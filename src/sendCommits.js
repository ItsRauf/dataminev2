const { Client, TextChannel } = require("discord.js");
const getLatestCommit = require("./getLatestCommit");
const Commit = require("./models/Commit");
const Server = require("./models/Server");
const sendSingleComment = require("./sendSingleComment");
const sendEmbed = require("./sendEmbed");

/**
 * Parses build number from title
 *
 * @param {String} title
 * @returns Build Number
 */
function parseBuildNumber(title) {
  const regex = /(Canary\sbuild:\s([0-9]*))/;
  if (regex.test(title)) {
    return regex.exec(title)[2];
  }
}

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
        // console.log(commit);
        if (!server.lastSentComment) {
          await Server.findByIdAndUpdate(server._id, {
            lastSentComment: commit._id,
          });
          return await sendEmbed(channel, commit, server.roleid);
        } else if (commit._id > server.lastSentComment) {
          const commits = await Commit.find({
            _id: { $gt: server.lastSentComment },
          }).sort("buildNumber");

          for (const commit of commits) {
            await Server.findByIdAndUpdate(server._id, {
              lastSentComment: commit._id,
            });
            const test = await Server.findById(server._id);
            await sendEmbed(channel, commit, server.roleid);
          }
        }
      });
    }
  }
};
