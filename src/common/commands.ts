import { ArgumentInfo, CommandoMessage } from "discord.js-commando";

export type CommandReturn = Promise<null | CommandoMessage | CommandoMessage[]>;

export const workMinsArg: ArgumentInfo = {
  key: "workMins",
  type: "integer",
  prompt: "How many minutes will you work for?",
  default: 45,
};

export const breakMinsArg: ArgumentInfo = {
  key: "breakMins",
  type: "integer",
  prompt: "How many minutes will you take a break for?",
  default: 15,
};

export const targetUserArg: ArgumentInfo = {
  key: "targetUser",
  type: "user",
  prompt: "Whose session are you joining?",
};
