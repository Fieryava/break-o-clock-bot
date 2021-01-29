import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { getSession } from "../../common/sessions/sessionManager";

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
    const targetSession = getSession(message.author);
    if (targetSession) {
      targetSession.unpause();
      return message.say("Unpaused session!");
    }

    return message.say("Couldn't find a session to unpause.");
  }
}
