import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { sessionStatuses } from "../../common/sessions/sessionManager";

export default class SessionStatusesCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "sessionstatuses",
      group: "sessions",
      memberName: "statuses",
      description: "Gets the status for every session.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    const statuses = sessionStatuses();
    return message.say(`Session statuses:${statuses.map((status, i) => `\n#${i + 1}\nWork time: ${status.workTime}\nBreak time: ${status.breakTime}\nOn break? ${status.isOnBreak}\nParticipants: ${status.participants}`)}`);
  }
}
