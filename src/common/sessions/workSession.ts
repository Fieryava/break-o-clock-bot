import { getRandomItem, millisecondsToMinutes, minutesToMilliseconds, minutesToStatus } from "../utils";
import Timer from "../timer";
import Session, { SessionParams } from "./session";

export interface WorkSessionInputs {
  workMins: number;
  breakMins: number;
  timeoutMs?: number;
}

export interface WorkSessionParams extends WorkSessionInputs, SessionParams { }

// TODO: Snooze
// TODO: Consider allowing users to join sessions with reactions.
export default class WorkSession extends Session {
  private _timer: Timer;
  public get timer(): Timer {
    return this._timer;
  }
  private workMs: number;
  public get workMins(): number {
    return millisecondsToMinutes(this.workMs);
  }
  private breakMs: number;
  public get breakMins(): number {
    return millisecondsToMinutes(this.breakMs);
  }
  public isOnBreak: boolean;

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

  constructor({ workMins, breakMins, timeoutMs, ...rest }: WorkSessionParams) {
    super(rest);

    this.workMs = minutesToMilliseconds(workMins);
    this.breakMs = minutesToMilliseconds(breakMins);
    this.isOnBreak = false;
    this._timer = new Timer();
    this.start(timeoutMs ?? this.workMs);
  }

  update({ workMins, breakMins }: WorkSessionInputs): void {
    if (workMins <= 0 || breakMins <= 0) throw new RangeError("Work and break times must be greater than 0.");
    this.workMs = minutesToMilliseconds(workMins);
    this.breakMs = minutesToMilliseconds(breakMins);
  }

  private start(timeoutMs: number): void {
    this.timer.start(() => this.timeUp(), timeoutMs);
  }

  timeUp(): void {
    this.isOnBreak = !this.isOnBreak;

    const nextTime = this.isOnBreak ? this.breakMs : this.workMs;
    const messageString = this.isOnBreak ? this.breakString : this.workString;

    this.sendMessage(messageString);
    this.start(nextTime);
  }

  flip(): void {
    this.timer.stop();
    this.timeUp();
  }

  toString(): string {
    return `${this._timer.isPaused ? "Paused. " : ""}${minutesToStatus(this.timer.remainingMins)} until ${this.isOnBreak ? "work time." : "break time."}
Work time: ${this.workMins} min
Break time: ${this.breakMins} min
Participants: ${this.usersString}`;
  }
}
