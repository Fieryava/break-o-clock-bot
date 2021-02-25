import { millisecondsToMinutes } from "./utils";

// TODO: Consider supporting multiple time units. Could use a union type of custom classes Milliseconds | Seconds | Minutes | Hours.
export default class Timer {
  private timeout: NodeJS.Timeout;
  private callback: () => void;
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

  /**
   * Start the timeout using time.
   * @param timeoutMs The timeout delay in milliseconds.
   */
  public start(callback: () => void, timeoutMs: number): void {
    if (timeoutMs <= 0) throw new RangeError("Remaining time must be greater than 0.");
    this.callback = callback;
    this._isPaused = false;
    this.targetTimestamp = Date.now() + timeoutMs;
    this.timeout = setTimeout(this.callback, timeoutMs);
  }

  public pause(): void {
    if (this.isPaused) return;
    this._isPaused = true;
    this.remainingMs = this.targetTimestamp - Date.now();
    this.stop();
  }

  public unpause(): void {
    if (!this.isPaused) return;
    this.start(this.callback, this.remainingMs);
  }

  public stop(): void {
    clearTimeout(this.timeout);
  }
}
