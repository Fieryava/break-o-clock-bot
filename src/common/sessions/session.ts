// TODO: Consider supporting multiple time units. Could use a union type of strings "s" | "m" | "h".
import { DMChannel, NewsChannel, TextChannel, User } from "discord.js";
import { getRandomItem, millisecondsToMinutes, minutesToMilliseconds, minutesToStatus } from "../utils";

// #region Interfaces
export interface SessionParams {
  channel: TextChannel | DMChannel | NewsChannel;
  users: User | User[];
}
// #endregion

// TODO: Snooze
// TODO: Consider allowing users to join sessions with reactions.
export default class Session {
  protected channel: TextChannel | DMChannel | NewsChannel;
  users: Map<string, User>;

  protected get participantsString(): string {
    return [...this.users.values()].join(", ");
  }

  protected prependParticipants(input: string): string {
    return `${this.participantsString}, ${input}`;
  }

  // #region Constructors and update
  constructor({ channel, users }: SessionParams) {
    this.channel = channel;
    this.users = new Map();
    this.addUsers(users);
  }
  // #endregion

  // #region Participants
  addUsers(users: User[] | User): void {
    if ("id" in users) users = [users];

    users.forEach((user: User) => this.users.set(user.id, user));
  }

  removeUsers(users: User[] | User): void {
    if ("id" in users) users = [users];

    users.forEach((user: User) => this.users.delete(user.id));
  }
  // #endregion

  // #region User interfacing
  sendMessage(messageString: string): void {
    this.channel.send(messageString);
  }
  // #endregion
}
