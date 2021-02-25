import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { axe } from "../../common/emojis";
import WorkSession from "../../common/sessions/workSession";
import { startSession, getSession } from "../../common/sessions/sessionManager";
import { minutesToMilliseconds } from "../../common/utils";

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
    if (!existingSession) return message.say("No session to split you from; try starting a session first.");

    startSession(new WorkSession({
      channel: message.channel,
      users: [message.author],
      timeoutMs: minutesToMilliseconds(existingSession.remainingMinutes),
      workMinutes: existingSession.workMinutes,
      breakMinutes: existingSession.breakMinutes,
    }));
    message.react(axe);
    return;
  }
}
