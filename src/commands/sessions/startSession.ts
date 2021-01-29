import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { startSession, sessionLength } from "../../common/sessions/sessionManager";
import Session, { SessionInputs } from "../../common/sessions/session";
import { breakMinutesArg, CommandReturn, participantsArg, workMinutesArg } from "../../common/commands";

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
        participantsArg,
      ],
    });
  }

  run(message: CommandoMessage, { workMinutes, breakMinutes, participants }: SessionInputs): CommandReturn {
    startSession(new Session({ channel: message.channel, workMinutes, breakMinutes, participants }));
    return message.say(`Starting session #${sessionLength()}!`);
  }
}
