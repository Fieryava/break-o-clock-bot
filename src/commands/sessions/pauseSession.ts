import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { pause } from "../../common/emojis";
import { getSession } from "../../common/sessions/sessionManager";

export default class PauseSessionCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "pause",
      aliases: [
        "pausesession",
      ],
      group: "sessions",
      memberName: "pause",
      description: "Pauses your current work session.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    const targetSession = getSession(message.author);
    if (!targetSession) return message.say("Couldn't find a session to pause.");

    targetSession.pause();
    message.react(pause);
    return;
  }
}
