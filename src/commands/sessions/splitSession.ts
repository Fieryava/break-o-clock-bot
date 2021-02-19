import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { axe } from "../../common/emojis";
import { splitSession } from "../../common/sessions/sessionManager";

export default class SplitSessionCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "split",
      aliases: [
        "splitsession",
      ],
      group: "sessions",
      memberName: "split",
      description: "Splits you into your own session while keeping existing settings.",
    });
  }

  // TODO: Maintain current time on new session.
  run(message: CommandoMessage): CommandReturn {
    if (!splitSession(message.author, message.channel)) return message.say("No session to split you from.");

    message.react(axe);
    return;
  }
}
