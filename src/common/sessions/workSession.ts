import { getRandomItem, millisecondsToMinutes, minutesToMilliseconds, minutesToStatus } from "../utils";
import { TimedSessionParams } from "./timedSession";
import TimedSession from "./timedSession";

export interface WorkSessionInputs {
  workMinutes: number;
  breakMinutes: number;
}

export interface WorkSessionParams extends TimedSessionParams, WorkSessionInputs { }

export default class WorkSession extends TimedSession {
  //#region Properties
  private workTime: number;
  get workMinutes(): number {
    return millisecondsToMinutes(this.workTime);
  }
  private breakTime: number;
  get breakMinutes(): number {
    return millisecondsToMinutes(this.breakTime);
  }
  isOnBreak: boolean;
  //#endregion

  //#region Constructors
  constructor({ workMinutes, breakMinutes, ...rest }: WorkSessionParams) {
    super(rest);

    this.workTime = minutesToMilliseconds(workMinutes);
    this.breakTime = minutesToMilliseconds(breakMinutes);
    this.isOnBreak = false;
  }

  update({ workMinutes, breakMinutes }: WorkSessionInputs): void {
    this.workTime = minutesToMilliseconds(workMinutes);
    this.breakTime = minutesToMilliseconds(breakMinutes);
  }
  //#endregion

  private get breakString(): string {
    const vals = [
      `it's break o'clock! ${minutesToStatus(this.breakMinutes)} before you get back to work.`,
      `it's break o'clock! You've got ${minutesToStatus(this.breakMinutes)} to be free!`,
    ];

    return this.prependParticipants(getRandomItem(vals));
  }

  private get workString(): string {
    const vals = [
      `time to get back to work :( ${minutesToStatus(this.workMinutes)} until your next break.`,
      `back to the grind for ${minutesToStatus(this.workMinutes)}.`,
    ];

    return this.prependParticipants(getRandomItem(vals));
  }

  // #region Flipping
  timeUp(): void {
    this.isOnBreak = !this.isOnBreak;

    const nextTime = this.isOnBreak ? this.breakTime : this.workTime;
    const messageString = this.isOnBreak ? this.breakString : this.workString;

    this.sendMessage(messageString);
    this.start(nextTime);
  }

  flip(): void {
    this.stop();
    this.timeUp();
  }
  // #endregion

  toString(): string {
    return `${this.isPaused ? "Paused. " : ""}${minutesToStatus(this.remainingMinutes)} until ${this.isOnBreak ? "work time." : "break time."}
Work time: ${this.workMinutes} min
Break time: ${this.breakMinutes} min
Participants: ${this.participantsString}`;
  }
}
