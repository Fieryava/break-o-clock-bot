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
    try {
      startSession(new WorkSession({
        channel: message.channel,
        users: message.author,
        workMins: workMins,
        breakMins: breakMins,
      }));
    } catch (error) {
      if (error instanceof RangeError) {
        return message.say("The work and break times must be greater than 0.");
      }
    }
    message.react(okHand);
    return;
  }
}
