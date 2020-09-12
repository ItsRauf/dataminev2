const { Client, Message } = require("discord.js");
const sendEmbed = require("../sendEmbed");
const Commit = require("../models/Commit");

/**
 * Sends the specified build number's corrosponding comment(s)
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 */
module.exports = function getBuild(msg, args, _DatamineBot) {
  Commit.findOne({ buildNumber: args[0] }, (err, commit) => {
    if (err) return msg.reply(`\`\`\`\n${err}\n\`\`\``);
    if (commit) sendEmbed(msg.channel, commit);
  });
};
