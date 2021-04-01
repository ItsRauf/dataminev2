const { Client } = require("discord.js");
const CommandHandler = require("./CommandHandler");

const DatamineBot = new Client({
  ws: {
    intents: ["GUILDS", "GUILD_MESSAGES"],
  },
});

DatamineBot.on("message", (msg) => CommandHandler(DatamineBot, msg));

module.exports = DatamineBot;
