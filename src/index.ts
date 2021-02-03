import * as dotenv from "dotenv";
dotenv.config();

import { CommandoClient } from "discord.js-commando";
import path = require("path");

import { prefix } from "./config.json";

const client = new CommandoClient({
  commandPrefix: prefix,
});

client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["sessions", "Start/stop sessions"],
    ["preferences", "Manage session preferences"],
    ["extra", "Random extra commands"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands()
  .registerCommandsIn(path.join(__dirname, "commands"));

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  client.user.setActivity("with Commando");
});

client.on("error", console.error);

client.login(process.env.DISCORD_TOKEN);
