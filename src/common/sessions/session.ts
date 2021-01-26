// TODO: How much time is left in a session.
// TODO: Snooze break time or work time.
// TODO: More messages to users.
import { DMChannel, NewsChannel, TextChannel, User } from "discord.js";

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
    if (this.isOnBreak) {
      this.channel.send(`${this.participants}, time to get back to work :(`);
      this.start(this.workTime);
    }
    else {
      this.channel.send(`${this.participants}, it's break o'clock!`);
      this.start(this.breakTime);
    }
    this.isOnBreak = !this.isOnBreak;
  }

  flip(): void {
    this.clear();
    this.timeUp();
  }
}
