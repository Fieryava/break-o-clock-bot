import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { startSession, sessionLength } from "../../common/sessions/sessionManager";
import Session, { SessionInputs } from "../../common/sessions/session";
import { CommandReturn } from "../../common/commands";

// TODO: Create arguments as reusable variables.
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
        {
          key: "workMinutes",
          type: "integer",
          prompt: "How many minutes will you work for?",
          default: 45,
        },
        {
          key: "breakMinutes",
          type: "integer",
          prompt: "How many minutes will you take a break for?",
          default: 15,
        },
        {
          key: "participants",
          type: "user",
          prompt: "Is anyone joining you?",
          infinite: true,
          default: (message: CommandoMessage) => [message.author],
        },
      ],
    });
  }

  run(message: CommandoMessage, { workMinutes, breakMinutes, participants }: SessionInputs): CommandReturn {
    startSession(new Session({ channel: message.channel, workMinutes, breakMinutes, participants }));
    return message.say(`Starting session #${sessionLength()}!`);
  }
}
