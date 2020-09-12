const { Client, TextChannel } = require("discord.js");
const getLatestCommit = require("./getLatestCommit");
const Commit = require("./models/Commit");
const Server = require("./models/Server");
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
  try {
    Server.find().then((servers) => {
      servers.forEach(async (server) => {
        const s = await DatamineBot.guilds.resolve(server._id);
        if (s && s.channels) {
          /**
           * @type {TextChannel}
           */
          const channel = s.channels.resolve(server.channel);
          const messages = Array.from(
            (await channel.messages.fetch({ limit: 100 })).values()
          );
          if (Array.isArray(messages)) {
            const messagesFromDatamine = messages.filter(
              (message) => message.author.id === DatamineBot.user.id
            );
            const messagesWithEmbed = messagesFromDatamine.filter(
              (message) => message.embeds.length > 0
            );
            const DatamineEmbeds = messagesWithEmbed.filter((message) => {
              const regex = /(Canary\sbuild:\s([0-9]*))/;
              if (regex.test(message.embeds[0].title)) return message;
            });
            const message = DatamineEmbeds[0];
            getLatestCommit().then((commit) => {
              if (message) {
                if (message.embeds.length <= 0) {
                  sendEmbed(message.channel, commit, server.roleid);
                } else if (message.embeds[0].title !== commit.title) {
                  Commit.find()
                    .sort("-buildNumber")
                    .then((commits) => {
                      commits
                        .filter(
                          (commit) =>
                            parseBuildNumber(message.embeds[0].title) <
                            commit.buildNumber
                        )
                        .sort((a, b) => a.buildNumber - b.buildNumber)
                        .forEach((commit) => {
                          sendEmbed(message.channel, commit, server.roleid);
                        });
                    });
                }
              } else {
                sendEmbed(channel, commit, server.roleid);
              }
            });
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};
