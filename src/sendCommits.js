const { Client, TextChannel } = require("discord.js");
const getLatestCommit = require("./getLatestCommit");
const Commit = require("./models/Commit");
const Server = require("./models/Server");
const sendEmbed = require("./sendEmbed");

/**
 * Sends commits
 *
 * @param {Client} DatamineBot
 */
module.exports = async function sendCommits(DatamineBot) {
  const servers = await Server.find();
  for (const server of servers) {
    const s = await DatamineBot.guilds.resolve(server._id);
    if (s && s.channels) {
      /**
       * @type {TextChannel}
       */
      const channel = s.channels.resolve(server.channel);
      getLatestCommit().then(async (commit) => {
        if (!server.lastSentComment) {
          await Server.findByIdAndUpdate(server._id, {
            lastSentComment: commit._id,
          });
          return await sendEmbed(channel, commit, server.roleid);
        } else if (commit._id > server.lastSentComment) {
          const commits = await Commit.find({
            _id: { $gt: server.lastSentComment },
          }).sort("_id");

          for (const commit of commits) {
            await Server.findByIdAndUpdate(server._id, {
              lastSentComment: commit._id,
            });
            await sendEmbed(channel, commit, server.roleid);
          }
        }
      });
    }
  }
};
