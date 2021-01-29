import { User } from "discord.js";
import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn, targetUserArg } from "../../common/commands";
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
        targetUserArg,
      ],
    });
  }

  run(message: CommandoMessage, { targetUser }: { targetUser: User }): CommandReturn {
    const success = joinSession(message.author, targetUser);
    if (success) return message.say("Joined the session!");
    else return message.say("The target did not have a session. You can start one with `!start` though.");
  }
}
