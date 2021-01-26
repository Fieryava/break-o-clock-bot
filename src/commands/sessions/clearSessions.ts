import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { clearSessions, sessionLength } from "../../common/sessions/sessionManager";

export default class ClearSessionsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "clearsessions",
      group: "sessions",
      memberName: "clear",
      description: "Clears all existing work sessions.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    clearSessions();
    return message.say(`Cleared sessions. Remaining sessions: ${sessionLength}.`);
  }
}
