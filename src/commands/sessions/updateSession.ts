import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { startSession } from "../../common/sessions/sessionManager";
import Session, { SessionParameters } from "../../common/sessions/session";
import { CommandReturn } from "../../common/commands";

export default class UpdateSessionCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "update",
      group: "sessions",
      memberName: "update",
      description: "Updates your existing work session",
      args: [
        {
          key: "workTime",
          type: "integer",
          prompt: "How many minutes will you work for?",
        },
        {
          key: "breakTime",
          type: "integer",
          prompt: "How many minutes will you take a break for?",
        },
        {
          key: "participants",
          type: "user",
          prompt: "Is anyone joining you?",
          infinite: true,
        },
      ],
    });
  }

  run(message: CommandoMessage, { workTime, breakTime, participants }: SessionParameters): CommandReturn {
    startSession(new Session({ channel: message.channel, workTime, breakTime, participants }));
    return message.say("Updated your session!");
  }
}
