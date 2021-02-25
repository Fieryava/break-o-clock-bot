import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { startSession } from "../../common/sessions/sessionManager";
import WorkSession, { WorkSessionInputs } from "../../common/sessions/workSession";
import { breakMinsArg, CommandReturn, workMinsArg } from "../../common/commands";
import { okHand } from "../../common/emojis";
import { minutesToMilliseconds } from "../../common/utils";

export default class StartSessionCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "start",
      aliases: [
        "startsession",
        "begin",
        "beginsession",
      ],
      group: "sessions",
      memberName: "start",
      description: "Starts a new work session",
      args: [
        workMinsArg,
        breakMinsArg,
      ],
    });
  }

  // TODO: Consider sending a message with time for initial timer.
  run(message: CommandoMessage, { workMins, breakMins }: WorkSessionInputs): CommandReturn {
    startSession(new WorkSession({
      channel: message.channel,
      users: message.author,
      timeoutMs: minutesToMilliseconds(workMins),
      workMins: workMins,
      breakMins: breakMins,
    }));
    message.react(okHand);
    return;
  }
}
