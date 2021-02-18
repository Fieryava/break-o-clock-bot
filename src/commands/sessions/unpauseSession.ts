import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { play } from "../../common/emojis";
import { unpauseSession } from "../../common/sessions/sessionManager";

export default class UnpauseSessionCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "unpause",
      aliases: [
        "unpausesession",
        "restart",
        "restartsession",
      ],
      group: "sessions",
      memberName: "unpause",
      description: "Unpauses your current work session.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    if (!unpauseSession(message.author)) return message.say("Couldn't find a session to unpause.");

    message.react(play);
    return;
  }
}
