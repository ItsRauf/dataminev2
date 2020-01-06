const { Client, Message } = require("discord.js");
const getLatestCommit = require("../getLatestCommit");
const ConstructEmbed = require("../ConstructEmbed");

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
  _args,
  _DatamineBot,
  deleteMessage = true
) {
  if (deleteMessage) msg.delete(1000);
  getLatestCommit().then(commit => {
    msg.channel.send(ConstructEmbed(commit)).then(() => {
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
