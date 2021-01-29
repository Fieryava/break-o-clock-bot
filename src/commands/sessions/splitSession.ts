import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import Session from "../../common/sessions/session";
import { startSession, getSession } from "../../common/sessions/sessionManager";

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
    const existingSession = getSession(message.author);
    if (existingSession) {
      startSession(new Session({ channel: message.channel, workMinutes: existingSession.workMinutes, breakMinutes: existingSession.breakMinutes, participants: [message.author] }));
      return message.say("Split you to your own session.");
    }
    return message.say("No session to split you from; try starting a session first.");
  }
}
