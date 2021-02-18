import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { peaceHand } from "../../common/emojis";
import { leaveSession } from "../../common/sessions/sessionManager";

export default class DoneCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "done",
      aliases: [
        "complete",
        "end",
        "finish",
        "exit",
        "leave",
      ],
      group: "sessions",
      memberName: "done",
      description: "Removes you from your session.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    leaveSession(message.author);
    message.react(peaceHand);
    return;
  }
}
