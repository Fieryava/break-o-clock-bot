import { millisecondsToMinutes, minutesToMilliseconds } from "../utils";
import Session, { SessionParams } from "./session";

export interface TimedSessionParams extends SessionParams {
  timeoutMs: number;
}

export default abstract class TimedSession extends Session {
  private timeout: NodeJS.Timeout;
  isPaused: boolean;
  private targetTime: number;
  private remainingTime: number;
  get remainingMinutes(): number {
    const time = this.isPaused
      ? this.remainingTime
      : this.targetTime - Date.now();
    return millisecondsToMinutes(time);
  }

  constructor({ timeoutMs, ...rest }: TimedSessionParams) {
    super(rest);
    if (timeoutMs <= 0) throw new RangeError("Remaining time must be greater than 0.");
    this.start(timeoutMs);
  }

  // #region Starting and stopping
  /**
   * Start the timeout using time.
   * @param time The timeout delay in milliseconds.
   */
  start(time: number): void {
    this.isPaused = false;
    this.targetTime = Date.now() + time;
    this.remainingTime = time;
    this.timeout = setTimeout(() => this.timeUp(), time);
  }

  pause(): void {
    if (this.isPaused) return;
    this.isPaused = true;
    this.remainingTime = this.targetTime - Date.now();
    this.stop();
  }

  unpause(): void {
    if (!this.isPaused) return;
    this.start(this.remainingTime);
  }

  stop(): void {
    clearTimeout(this.timeout);
  }

  end(): void {
    this.stop();
    this.users.clear();
  }
  // #endregion
  
  abstract timeUp(): void;
}
