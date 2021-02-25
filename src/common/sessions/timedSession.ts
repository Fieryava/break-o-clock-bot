import { millisecondsToMinutes } from "../utils";
import Session, { SessionParams } from "./session";

export interface TimedSessionParams extends SessionParams {
  timeoutMs: number;
}

// TODO: Consider supporting multiple time units. Could use a union type of strings "s" | "m" | "h".
export default abstract class TimedSession extends Session {
  private timeout: NodeJS.Timeout;
  isPaused: boolean;
  private targetTimestamp: number;
  private remainingMs: number;
  get remainingMins(): number {
    const time = this.isPaused
      ? this.remainingMs
      : this.targetTimestamp - Date.now();
    return millisecondsToMinutes(time);
  }

  constructor({ timeoutMs, ...rest }: TimedSessionParams) {
    super(rest);
    if (timeoutMs <= 0) throw new RangeError("Remaining time must be greater than 0.");
    this.start(timeoutMs);
  }

  /**
   * Start the timeout using time.
   * @param timeoutMs The timeout delay in milliseconds.
   */
  start(timeoutMs: number): void {
    this.isPaused = false;
    this.targetTimestamp = Date.now() + timeoutMs;
    this.remainingMs = timeoutMs;
    this.timeout = setTimeout(() => this.timeUp(), timeoutMs);
  }

  pause(): void {
    if (this.isPaused) return;
    this.isPaused = true;
    this.remainingMs = this.targetTimestamp - Date.now();
    this.stop();
  }

  unpause(): void {
    if (!this.isPaused) return;
    this.start(this.remainingMs);
  }

  stop(): void {
    clearTimeout(this.timeout);
  }

  end(): void {
    super.end();
    this.stop();
  }

  abstract timeUp(): void;
}
