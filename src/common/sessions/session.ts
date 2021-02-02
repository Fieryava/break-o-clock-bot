// TODO: Consider supporting multiple time units. Could use a union type of strings "s" | "m" | "h".
import { DMChannel, NewsChannel, TextChannel, User } from "discord.js";
import { getRandomItem, millisecondsToMinutes, minutesToMilliseconds, minutesToStatus } from "../utils";

export interface SessionInputs {
  workMinutes: number,
  breakMinutes: number,
  participants: User[],
}

export interface SessionParameters extends SessionInputs {
  channel: TextChannel | DMChannel | NewsChannel;
}

// TODO: Snooze
// TODO: More minimalist messaging. Messages and commands for every function is cumbersome and noisy.
// TODO: Consider reacting to commands instead of doing response messages.
// TODO: Consider allowing users to join sessions with reactions.
export default class Session {
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

  get participantsString(): string {
    return [...this.participants].join(", ");
  }

  private get breakString(): string {
    const vals = [
      `${this.participantsString}, it's break o'clock! ${minutesToStatus(this.breakMinutes)} before you get back to work.`,
      `Hey ${this.participantsString}, it's break o'clock! You've got ${minutesToStatus(this.breakMinutes)} to be free!`,
    ];

    return getRandomItem(vals);
  }

  private get workString(): string {
    const vals = [
      `${this.participantsString}, time to get back to work :( ${minutesToStatus(this.workMinutes)} until your next break.`,
      `${this.participantsString}, back to the grind for ${minutesToStatus(this.workMinutes)}.`,
    ];

    return getRandomItem(vals);
  }

  constructor({ channel, workMinutes, breakMinutes, participants }: SessionParameters) {
    this.channel = channel;
    this.workTime = minutesToMilliseconds(workMinutes);
    this.breakTime = minutesToMilliseconds(breakMinutes);
    this.participants = new Map();
    this.addParticipants(participants);
    this.isOnBreak = false;
    this.start(this.workTime);
  }

  update({ workMinutes, breakMinutes, participants }: SessionInputs): void {
    this.workTime = minutesToMilliseconds(workMinutes);
    this.breakTime = minutesToMilliseconds(breakMinutes);
    this.participants.clear();
    this.addParticipants(participants);
  }

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

  addParticipants(participants: User[] | User): void {
    if ("id" in participants) participants = [participants];

    participants.forEach((participant: User) => this.participants.set(participant.id, participant));
  }

  removeParticipants(participants: User[] | User): void {
    if ("id" in participants) participants = [participants];

    participants.forEach((participant: User) => this.participants.delete(participant.id));
  }

  timeUp(): void {
    this.isOnBreak = !this.isOnBreak;

    const nextTime = this.isOnBreak ? this.breakTime : this.workTime;
    const messageString = this.isOnBreak ? this.breakString : this.workString;

    this.channel.send(messageString);
    this.start(nextTime);
  }

  flip(): void {
    this.stop();
    this.timeUp();
  }
}
