import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { startSession } from "../../common/sessions/sessionManager";
import Session, { SessionInputs } from "../../common/sessions/session";
import { breakMinutesArg, CommandReturn, participantsArg, workMinutesArg } from "../../common/commands";

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
        participantsArg,
      ],
    });
  }

  run(message: CommandoMessage, { workMinutes, breakMinutes, participants }: SessionInputs): CommandReturn {
    // TODO: Maintain timer between sessions.
    // TODO: Consider not allowing people add others to sessions.
    startSession(new Session({ channel: message.channel, workMinutes, breakMinutes, participants }));
    return message.say("Updated your session!");
  }
}
