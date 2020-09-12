const { Client, Message } = require("discord.js");
const getLatestCommit = require("../getLatestCommit");
const Server = require("../models/Server");
const sendEmbed = require("../sendEmbed");

/**
 * Fetches latest datamine commit
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 * @param {Boolean} deleteMessage
 */
module.exports = function latest(
  msg,
  args,
  _DatamineBot,
  deleteMessage = false
) {
  if (deleteMessage || args[0] === "true") msg.delete({ timeout: 1000 });
  getLatestCommit().then(async (commit) => {
    const server = await Server.findById(msg.guild.id);
    const role = msg.guild.roles.resolve(
      args[0] === "true" ? server.roleid : args[0]
    );
    const memberCanPingRole =
      msg.member.hasPermission("MENTION_EVERYONE") || role.mentionable;
    sendEmbed(msg.channel, commit, role && memberCanPingRole ? `${role}` : "");
  });
};
