// TODO: How much time is left in a session.
// TODO: Snooze break time or work time.
// TODO: More messages to users.
import { DMChannel, NewsChannel, TextChannel, User } from "discord.js";
import { getRandomItem } from "../utils";

export interface SessionInputs {
  workTime: number,
  breakTime: number,
  participants: User[],
}

export interface SessionParameters extends SessionInputs {
  channel: TextChannel | DMChannel | NewsChannel;
}

export default class Session {
  channel: TextChannel | DMChannel | NewsChannel;
  workTime: number;
  breakTime: number;
  participants: User[];
  isOnBreak: boolean;
  timeout: NodeJS.Timeout;
  // TODO: Add isPaused
  // TODO: Add targetTimestamp
  // TODO: Add remainingTime

  get participantsString(): string {
    return this.participants.join(", ");
  }

  private get breakString(): string {
    const vals = [
      `${this.participantsString}, it's break o'clock! ${this.breakTime} minutes before you get back to work.`,
      `Hey ${this.participantsString}, it's break o'clock! You've got ${this.breakTime} minutes to be free!`,
    ];

    return getRandomItem(vals);
  }

  private get workString(): string {
    const vals = [
      `${this.participantsString}, time to get back to work :( ${this.workTime} minutes until your next break.`,
      `${this.participantsString}, back to the grind for ${this.workTime} minutes.`,
    ];

    return getRandomItem(vals);
  }

  constructor({ channel, workTime, breakTime, participants }: SessionParameters) {
    this.channel = channel;
    this.workTime = workTime;
    this.breakTime = breakTime;
    // TODO: Consider using a set for participants.
    this.participants = participants;
    this.isOnBreak = false;
    this.start(this.workTime);
  }

  update({ workTime, breakTime, participants }: SessionInputs): void {
    this.workTime = workTime;
    this.breakTime = breakTime;
    this.participants = participants;
    this.clear();
    this.start(this.workTime);
  }

  /**
   * Start the timeout using time.
   * @param time The timeout delay in minutes.
   */
  start(time: number): void {
    this.timeout = setTimeout(() => this.timeUp(), time * 1000 * 60);
  }

  pause(): void {
    // TODO: Calculate remaining time.
  }

  unpause(): void {
    // TODO: Handle restarting timer using remaining time when paused.
  }

  clear(): void {
    clearTimeout(this.timeout);
  }

  end(): void {
    this.clear();
    this.participants = [];
  }

  removeParticipants(participantsToRemove: User[]): void {
    this.participants = this.participants.filter(participant => !participantsToRemove.includes(participant));
  }

  timeUp(): void {
    const nextTime = this.isOnBreak ? this.workTime : this.breakTime;
    const messageString = this.isOnBreak ? this.breakString : this.workString;

    this.channel.send(messageString);
    this.start(nextTime);
    this.isOnBreak = !this.isOnBreak;
  }

  flip(): void {
    this.clear();
    this.timeUp();
  }
}
