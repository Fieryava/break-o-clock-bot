import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { updateSession } from "../../common/sessions/sessionManager";
import { SessionInputs } from "../../common/sessions/session";
import { breakMinutesArg, CommandReturn, workMinutesArg } from "../../common/commands";
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
        workMinutesArg,
        breakMinutesArg,
      ],
    });
  }

  run(message: CommandoMessage, { workMinutes, breakMinutes }: SessionInputs): CommandReturn {
    if (!updateSession(message.author, workMinutes, breakMinutes)) return message.say("No session to update.");

    message.react(okHand);
    return;
  }
}
