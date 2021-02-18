import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { okHand } from "../../common/emojis";
import { flipSession } from "../../common/sessions/sessionManager";

export default class FlipSessionsCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "flip",
      aliases: [
        "flipsessions",
      ],
      group: "sessions",
      memberName: "flip",
      description: "Flips all existing work sessions.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    flipSession(message.author);
    message.react(okHand);
    return;
  }
}
