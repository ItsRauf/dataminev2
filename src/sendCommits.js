const { Client, TextChannel } = require("discord.js");
const getLatestCommit = require("./getLatestCommit");
const Commit = require("./models/Commit");
const Server = require("./models/Server");
const sendSingleComment = require("./sendSingleComment");

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
        if (!server.lastSentComment) {
          return await sendSingleComment(DatamineBot, commit);
        } else if (commit._id > server.lastSentComment) {
          const commits = await Commit.find({
            _id: { $gt: server.lastSentComment },
          }).sort("buildNumber");

          for (const commit of commits) {
            await sendSingleComment(DatamineBot, commit);
          }
        }
      });
    }
  }
};
