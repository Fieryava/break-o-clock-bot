import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { updateSession } from "../../common/sessions/sessionManager";
import { WorkSessionInputs } from "../../common/sessions/workSession";
import { breakMinsArg, CommandReturn, workMinsArg } from "../../common/commands";
import { okHand } from "../../common/emojis";

export default class UpdateSessionCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "update",
      aliases: [
        "updatesession",
      ],
      group: "sessions",
      memberName: "update",
      description: "Updates your existing work session",
      args: [
        workMinsArg,
        breakMinsArg,
      ],
    });
  }

  run(message: CommandoMessage, { workMins, breakMins }: WorkSessionInputs): CommandReturn {
    try {
      if (!updateSession(message.author, workMins, breakMins)) return message.say("No session to update.");
    } catch (error) {
      if (error instanceof RangeError) {
        return message.say(error.message);
      }
    }

    message.react(okHand);
    return;
  }
}
