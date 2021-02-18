import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { startSession } from "../../common/sessions/sessionManager";
import Session, { SessionInputs } from "../../common/sessions/session";
import { breakMinutesArg, CommandReturn, workMinutesArg } from "../../common/commands";
import { okHand } from "../../common/emojis";

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
        workMinutesArg,
        breakMinutesArg,
      ],
    });
  }

  // TODO: Consider sending a message with time for initial timer.
  run(message: CommandoMessage, { workMinutes, breakMinutes }: SessionInputs): CommandReturn {
    startSession(new Session({ channel: message.channel, workMinutes, breakMinutes, participants: message.author }));
    message.react(okHand);
    return;
  }
}
