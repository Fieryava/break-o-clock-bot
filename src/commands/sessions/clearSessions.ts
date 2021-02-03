import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { okHand } from "../../common/emojis";
import { clearSessions } from "../../common/sessions/sessionManager";

export default class ClearSessionsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "clearsessions",
      aliases: [
        "clear",
      ],
      group: "sessions",
      memberName: "clear",
      description: "Clears all existing work sessions.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    clearSessions();
    message.react(okHand);
    return;
  }
}
