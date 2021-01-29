import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import Session from "../../common/sessions/session";
import { sessionStatuses } from "../../common/sessions/sessionManager";
import { minutesToStatus } from "../../common/utils";

const statusSeparator = "\n==============================\n";

const statusMessage = (session: Session) => {
  return `Work time: ${session.workMinutes} minutes
Break time: ${session.breakMinutes} minutes
On break? ${session.isOnBreak}
Paused? ${session.isPaused}
Remaining time: ${minutesToStatus(session.remainingMinutes)} until ${session.isOnBreak ? "work time." : "break time."}
Participants: ${session.participantsString}`;
};

const statusMap = (sessions: Set<Session>): string => {
  return [...sessions].map((session, i) =>
    `#${i + 1}\n${statusMessage(session)}`).join(statusSeparator);
};

// TODO: Don't mention participants on status messages.
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
