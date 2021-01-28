import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import Session from "../../common/sessions/session";
import { sessionStatuses } from "../../common/sessions/sessionManager";

const statusSeparator = "\n==============================\n";
const statusMessage = (session: Session) => {
  return `Work time: ${session.workTime} minutes
Break time: ${session.breakTime} minutes
On break? ${session.isOnBreak}
Participants: ${session.participantsString}`;
};

const statusMap = (sessions: Session[]) => {
  return sessions.map((session, i) =>
    `#${i + 1}\n${statusMessage(session)}`).join(statusSeparator);
};

export default class SessionStatusesCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "sessionstatuses",
      aliases: [
        "statuses",
        "status",
        "sessionstatus",
      ],
      group: "sessions",
      memberName: "statuses",
      description: "Gets the status for every session.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    const sessions = sessionStatuses();
    return message.say(`Session statuses:\n${statusMap(sessions)}`);
  }
}
