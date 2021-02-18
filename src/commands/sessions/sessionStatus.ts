import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { getSession } from "../../common/sessions/sessionManager";

// TODO: Don't mention participants on status messages.
export default class SessionStatusCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "sessionstatus",
      aliases: [
        "status",
      ],
      group: "sessions",
      memberName: "status",
      description: "Gets the status for your session.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    const session = getSession(message.author);
    if (!session) return message.say("Couldn't find a session for you.");
    return message.say(`Session status:\n${session}`);
  }
}
