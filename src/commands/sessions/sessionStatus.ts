import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { getSession } from "../../common/sessions/sessionManager";

export default class SessionStatusCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "status",
      aliases: [
        "sessionstatus",
      ],
      group: "sessions",
      memberName: "status",
      description: "Gets the status for your session.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    const session = getSession(message.author);
    if (!session) return message.say("Couldn't find a session for you.");

    session.sendStatus();
    return;
  }
}
