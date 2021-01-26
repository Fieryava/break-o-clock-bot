import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { CommandReturn } from "../../common/commands";
import { leaveSessions } from "../../common/sessions/sessionManager";

export default class DoneCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "done",
      group: "sessions",
      memberName: "done",
      description: "Removes you from your session.",
    });
  }

  run(message: CommandoMessage): CommandReturn {
    leaveSessions(message.author);
    return message.say("Done with your session!");
  }
}
