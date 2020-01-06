const { Client } = require("discord.js");
const CommandHandler = require("./CommandHandler")

const DatamineBot = new Client();

DatamineBot.on("message", (msg) => CommandHandler(DatamineBot, msg));

module.exports = DatamineBot;
