import { User } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { joinSession } from "../../common/sessions/sessionManager";

export default class JoinSessionCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "join",
      aliases: [
        "joinsession",
      ],
      group: "sessions",
      memberName: "join",
      description: "Join someone's existing session.",
      args: [
        {
          key: "target",
          type: "user",
          prompt: "Whose session are you joining?",
        },
      ],
    });
  }

  run(message: CommandoMessage, { target }: { target: User }): CommandReturn {
    const success = joinSession(message.author, target);
    if (success) return message.say("Joined the session!");
    else return message.say("The target did not have a session. You can start one with `!start` though.");
  }
}
