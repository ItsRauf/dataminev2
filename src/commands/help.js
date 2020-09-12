const { Client, Message } = require("discord.js");

/**
 * Help Command
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 */
module.exports = function latest(msg, _args, _DatamineBot) {
  msg.reply("Command list at https://github.com/ItsRauf/dataminev2/#commands");
};
