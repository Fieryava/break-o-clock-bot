// TODO: Consider supporting multiple time units. Could use a union type of strings "s" | "m" | "h".
import { DMChannel, NewsChannel, TextChannel, User } from "discord.js";
import { getRandomItem, millisecondsToMinutes, minutesToMilliseconds, minutesToStatus } from "../utils";

// #region Interfaces
export interface SessionInputs {
  workMinutes: number,
  breakMinutes: number,
}

export interface SessionParameters extends SessionInputs {
  participants: User | User[],
  channel: TextChannel | DMChannel | NewsChannel;
}
// #endregion

// TODO: Snooze
// TODO: Consider allowing users to join sessions with reactions.
export default class Session {
  // #region Properties
  channel: TextChannel | DMChannel | NewsChannel;
  private workTime: number;
  get workMinutes(): number {
    return millisecondsToMinutes(this.workTime);
  }
  private breakTime: number;
  get breakMinutes(): number {
    return millisecondsToMinutes(this.breakTime);
  }
  participants: Map<string, User>;
  isOnBreak: boolean;
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
  // #endregion

  // #region String getters
  get participantsString(): string {
    return [...this.participants.values()].join(", ");
  }

  private withTextDecorations(input: string): string {
    return `${this.participantsString}, ${input}`;
  }

  private get breakString(): string {
    const vals = [
      `it's break o'clock! ${minutesToStatus(this.breakMinutes)} before you get back to work.`,
      `it's break o'clock! You've got ${minutesToStatus(this.breakMinutes)} to be free!`,
    ];

    return this.withTextDecorations(getRandomItem(vals));
  }

  private get workString(): string {
    const vals = [
      `time to get back to work :( ${minutesToStatus(this.workMinutes)} until your next break.`,
      `back to the grind for ${minutesToStatus(this.workMinutes)}.`,
    ];

    return this.withTextDecorations(getRandomItem(vals));
  }
  // #endregion

  // #region Constructors and update
  constructor({ channel, workMinutes, breakMinutes, participants }: SessionParameters) {
    this.channel = channel;
    this.workTime = minutesToMilliseconds(workMinutes);
    this.breakTime = minutesToMilliseconds(breakMinutes);
    this.participants = new Map();
    this.addParticipants(participants);
    this.isOnBreak = false;
    this.start(this.workTime);
  }

  update({ workMinutes, breakMinutes }: SessionInputs): void {
    this.workTime = minutesToMilliseconds(workMinutes);
    this.breakTime = minutesToMilliseconds(breakMinutes);
  }
  // #endregion

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
    this.participants.clear();
  }
  // #endregion

  // #region Flipping
  timeUp(): void {
    this.isOnBreak = !this.isOnBreak;

    const nextTime = this.isOnBreak ? this.breakTime : this.workTime;
    const messageString = this.isOnBreak ? this.breakString : this.workString;

    this.message(messageString);
    this.start(nextTime);
  }

  flip(): void {
    this.stop();
    this.timeUp();
  }
  // #endregion

  // #region Participants
  addParticipants(participants: User[] | User): void {
    if ("id" in participants) participants = [participants];

    participants.forEach((participant: User) => this.participants.set(participant.id, participant));
  }

  removeParticipants(participants: User[] | User): void {
    if ("id" in participants) participants = [participants];

    participants.forEach((participant: User) => this.participants.delete(participant.id));
  }
  // #endregion

  // #region User interfacing
  message(messageString: string): void {
    this.channel.send(messageString);
  }

  toString(): string {
    return `Work time: ${this.workMinutes} minutes
Break time: ${this.breakMinutes} minutes
On break? ${this.isOnBreak}
Paused? ${this.isPaused}
Remaining time: ${minutesToStatus(this.remainingMinutes)} until ${this.isOnBreak ? "work time." : "break time."}
Participants: ${this.participantsString}`;
  }
  // #endregion
}
