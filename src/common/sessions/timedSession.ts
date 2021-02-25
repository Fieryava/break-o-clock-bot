import { millisecondsToMinutes } from "../utils";
import Session, { SessionParams } from "./session";

export interface TimedSessionParams extends SessionParams {
  timeoutMs: number;
}

// TODO: Consider supporting multiple time units. Could use a union type of custom classes Milliseconds | Seconds | Minutes | Hours.
export default abstract class TimedSession extends Session {
  private timeout: NodeJS.Timeout;
  private _isPaused: boolean;
  public get isPaused(): boolean {
    return this._isPaused;
  }
  private targetTimestamp: number;
  private remainingMs: number;
  public get remainingMins(): number {
    const time = this.isPaused
      ? this.remainingMs
      : this.targetTimestamp - Date.now();
    return millisecondsToMinutes(time);
  }

  public constructor({ timeoutMs, ...rest }: TimedSessionParams) {
    super(rest);
    if (timeoutMs <= 0) throw new RangeError("Remaining time must be greater than 0.");
    this.start(timeoutMs);
  }

  /**
   * Start the timeout using time.
   * @param timeoutMs The timeout delay in milliseconds.
   */
  public start(timeoutMs: number): void {
    this._isPaused = false;
    this.targetTimestamp = Date.now() + timeoutMs;
    this.remainingMs = timeoutMs;
    this.timeout = setTimeout(() => this.timeUp(), timeoutMs);
  }

  public pause(): void {
    if (this.isPaused) return;
    this._isPaused = true;
    this.remainingMs = this.targetTimestamp - Date.now();
    this.stop();
  }

  public unpause(): void {
    if (!this.isPaused) return;
    this.start(this.remainingMs);
  }

  public stop(): void {
    clearTimeout(this.timeout);
  }

  public end(): void {
    super.end();
    this.stop();
  }

  public abstract timeUp(): void;
}
