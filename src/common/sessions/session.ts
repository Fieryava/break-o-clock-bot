// TODO: Consider supporting multiple time units. Could use a union type of strings "s" | "m" | "h".
import { CollectorFilter, DMChannel, Message, MessageReaction, NewsChannel, ReactionCollector, TextChannel, User } from "discord.js";
import { axe as splitEmoji, flipEmoji, handshake as joinEmoji, pause as pauseEmoji, peaceHand as doneEmoji, play as unpauseEmoji, timerEmoji } from "../emojis";
import { getRandomItem, millisecondsToMinutes, minutesToMilliseconds, minutesToStatus } from "../utils";
import { joinSession, leaveSession, splitSession } from "./sessionManager";

// #region Interfaces
export interface SessionInputs {
  workMinutes: number;
  breakMinutes: number;
}

export interface SessionParameters extends SessionInputs {
  participants: User | User[];
  channel: TextChannel | DMChannel | NewsChannel;
  remainingTime?: number;
}
// #endregion

// TODO: Delete previous messages to maintain 1 message per session
// TODO: Snooze
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
  private message: Message;
  private collector: ReactionCollector;
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
  constructor({ channel, workMinutes, breakMinutes, participants, remainingTime: remainingMinutes = -1 }: SessionParameters) {
    this.channel = channel;
    this.workTime = minutesToMilliseconds(workMinutes);
    this.breakTime = minutesToMilliseconds(breakMinutes);
    this.participants = new Map();
    this.addParticipants(participants);
    this.isOnBreak = false;
    this.start(remainingMinutes >= 0 ? minutesToMilliseconds(remainingMinutes) : this.workTime);
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
    this.message?.delete();
    this.collector.stop("Session ended");
  }
  // #endregion

  // #region Flipping
  async timeUp(): Promise<void> {
    this.isOnBreak = !this.isOnBreak;

    const nextTime = this.isOnBreak ? this.breakTime : this.workTime;
    const messageString = this.isOnBreak ? this.breakString : this.workString;

    await this.sendMessage(messageString);
    this.reactionHandling();
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
  async sendMessage(messageString: string): Promise<void> {
    await this.message?.delete();
    this.message = await this.channel.send(messageString);
  }

  sendStatus(): void {
    this.sendMessage(this.toString());
  }

  async reactionHandling(): Promise<void> {
    const emojiCommands = new Map<string, (user: User) => void>([
      [unpauseEmoji, () => this.unpause],
      [pauseEmoji, () => this.pause],
      [flipEmoji, () => this.flip],
      [joinEmoji, (user: User) => joinSession(user, this)],
      [splitEmoji, (user: User) => splitSession(user, this.channel)],
      [timerEmoji, () => this.sendStatus()],
      [doneEmoji, (user: User) => leaveSession(user)],
    ]);
    for (const [emoji] of emojiCommands) {
      await this.message.react(emoji);
    }

    const filter: CollectorFilter = (reaction: MessageReaction) => emojiCommands.has(reaction.emoji.name);
    const collectorListener = (reaction: MessageReaction, user: User) => {
      const command = emojiCommands.get(reaction.emoji.name);
      if (command) command(user);
    };

    this.collector = this.message.createReactionCollector(filter, { idle: minutesToMilliseconds(60) });
    this.collector.on("collect", collectorListener);
    this.collector.on("remove", collectorListener);
  }

  // TODO: Don't mention participants on status messages.
  toString(): string {
    return `Session status:
${this.isPaused ? "Paused. " : ""}${minutesToStatus(this.remainingMinutes)} until ${this.isOnBreak ? "work" : "break"} time.
Work time: ${this.workMinutes} min
Break time: ${this.breakMinutes} min
Participants: ${this.participantsString}`;
  }
  // #endregion
}
