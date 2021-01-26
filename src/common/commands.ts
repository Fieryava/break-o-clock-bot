import { CommandoMessage } from "discord.js-commando";

export type CommandReturn = Promise<null | CommandoMessage | CommandoMessage[]>;
