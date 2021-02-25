import { getRandomItem, millisecondsToMinutes, minutesToMilliseconds, minutesToStatus } from "../utils";
import { TimedSessionParams } from "./timedSession";
import TimedSession from "./timedSession";

export interface WorkSessionInputs {
  workMins: number;
  breakMins: number;
}

export interface WorkSessionParams extends TimedSessionParams, WorkSessionInputs { }

// TODO: Snooze
// TODO: Consider allowing users to join sessions with reactions.
export default class WorkSession extends TimedSession {
  private workMs: number;
  public get workMins(): number {
    return millisecondsToMinutes(this.workMs);
  }
  private breakMs: number;
  public get breakMins(): number {
    return millisecondsToMinutes(this.breakMs);
  }
  public isOnBreak: boolean;

  constructor({ workMins, breakMins, ...rest }: WorkSessionParams) {
    super(rest);

    this.workMs = minutesToMilliseconds(workMins);
    this.breakMs = minutesToMilliseconds(breakMins);
    this.isOnBreak = false;
  }

  update({ workMins, breakMins }: WorkSessionInputs): void {
    this.workMs = minutesToMilliseconds(workMins);
    this.breakMs = minutesToMilliseconds(breakMins);
  }

  private get breakString(): string {
    const vals = [
      `it's break o'clock! ${minutesToStatus(this.breakMins)} before you get back to work.`,
      `it's break o'clock! You've got ${minutesToStatus(this.breakMins)} to be free!`,
    ];

    return this.prependUsers(getRandomItem(vals));
  }

  private get workString(): string {
    const vals = [
      `time to get back to work :( ${minutesToStatus(this.workMins)} until your next break.`,
      `back to the grind for ${minutesToStatus(this.workMins)}.`,
    ];

    return this.prependUsers(getRandomItem(vals));
  }

  timeUp(): void {
    this.isOnBreak = !this.isOnBreak;

    const nextTime = this.isOnBreak ? this.breakMs : this.workMs;
    const messageString = this.isOnBreak ? this.breakString : this.workString;

    this.sendMessage(messageString);
    this.start(nextTime);
  }

  flip(): void {
    this.stop();
    this.timeUp();
  }

  toString(): string {
    return `${this.isPaused ? "Paused. " : ""}${minutesToStatus(this.remainingMins)} until ${this.isOnBreak ? "work time." : "break time."}
Work time: ${this.workMins} min
Break time: ${this.breakMins} min
Participants: ${this.usersString}`;
  }
}
