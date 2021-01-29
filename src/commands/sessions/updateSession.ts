import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { startSession } from "../../common/sessions/sessionManager";
import Session, { SessionParameters } from "../../common/sessions/session";
import { CommandReturn } from "../../common/commands";

export default class UpdateSessionCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "update",
      aliases: [
        "updatesession",
      ],
      group: "sessions",
      memberName: "update",
      description: "Updates your existing work session",
      args: [
        {
          key: "workMinutes",
          type: "integer",
          prompt: "How many minutes will you work for?",
        },
        {
          key: "breakMinutes",
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

  run(message: CommandoMessage, { workMinutes, breakMinutes, participants }: SessionParameters): CommandReturn {
    startSession(new Session({ channel: message.channel, workMinutes, breakMinutes, participants }));
    return message.say("Updated your session!");
  }
}
