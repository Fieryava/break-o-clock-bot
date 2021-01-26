import { Command, CommandoClient, CommandoMessage } from "discord.js-commando";
import { startSession, sessionLength } from "../../common/sessions/sessionManager";
import Session, { SessionInputs } from "../../common/sessions/session";
import { CommandReturn } from "../../common/commands";

export default class StartSessionCommand extends Command {
  constructor(client: CommandoClient) {
    super(client, {
      name: "start",
      group: "sessions",
      memberName: "start",
      description: "Starts a new work session",
      args: [
        {
          key: "workTime",
          type: "integer",
          prompt: "How many minutes will you work for?",
          default: 45,
        },
        {
          key: "breakTime",
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

  run(message: CommandoMessage, { workTime, breakTime, participants }: SessionInputs): CommandReturn {
    startSession(new Session({ channel: message.channel, workTime, breakTime, participants }));
    return message.say(`Starting session #${sessionLength()}!`);
  }
}
