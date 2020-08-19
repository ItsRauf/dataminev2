const { Client, Message } = require("discord.js");
const getLatestCommit = require("../getLatestCommit");
const ConstructEmbed = require("../ConstructEmbed");
const Server = require("../models/Server");

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
    msg.channel
      .send(role && memberCanPingRole ? `${role}` : "", ConstructEmbed(commit))
      .then(() => {
        if (commit.images.length > 0) {
          if (commit.images.length <= 5) {
            msg.channel.send(commit.images.join("\n"));
          } else {
            const length = Math.ceil(commit.images.length / 5);
            for (let index = 0; index < length; index++) {
              msg.channel.send(
                commit.images.splice(index, (index + 1) * 5).join("\n")
              );
            }
          }
        }
      });
  });
};
