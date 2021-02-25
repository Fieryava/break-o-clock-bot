import { DMChannel, NewsChannel, TextChannel, User } from "discord.js";

export interface SessionParams {
  channel: TextChannel | DMChannel | NewsChannel;
  users: User | User[];
}

export default abstract class Session {
  protected channel: TextChannel | DMChannel | NewsChannel;
  public users: Map<string, User>;

  protected get usersString(): string {
    return [...this.users.values()].join(", ");
  }

  protected prependUsers(input: string): string {
    return `${this.usersString}, ${input}`;
  }

  public constructor({ channel, users }: SessionParams) {
    this.channel = channel;
    this.users = new Map();
    this.addUsers(users);
  }

  public addUsers(users: User[] | User): void {
    if ("id" in users) users = [users];

    users.forEach((user: User) => this.users.set(user.id, user));
  }

  public removeUsers(users: User[] | User): void {
    if ("id" in users) users = [users];

    users.forEach((user: User) => this.users.delete(user.id));
  }

  public end(): void {
    this.users.clear();
  }

  protected sendMessage(messageString: string): void {
    this.channel.send(messageString);
  }
}
