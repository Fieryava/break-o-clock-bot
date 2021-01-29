import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { sessionStatuses } from "../../common/sessions/sessionManager";

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
    const targetSession = sessionStatuses().find(session => session.participants.has(message.author));
    if (targetSession) {
      targetSession.pause();
      return message.say("Paused session!");
    }

    return message.say("Couldn't find a session to pause.");
  }
}
