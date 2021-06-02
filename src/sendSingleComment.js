const { Client, TextChannel } = require("discord.js");
const sendEmbed = require("./sendEmbed");
const Server = require("./models/Server");

/**
 * Sends commits
 *
 * @param {Client} DatamineBot
 */
module.exports = async function sendCommits(DatamineBot, comment) {
  try {
    Server.find().then((servers) => {
      servers.forEach(async (server) => {
        const s = await DatamineBot.guilds.fetch(server._id);
        if (s) {
          Server.findByIdAndUpdate(
            s.id,
            { lastSentComment: comment._id },
            (err) => {
              if (err) throw console.error(err);
              if (s && s.channels) {
                /**
                 * @type {TextChannel}
                 */
                const channel = s.channels.fetch(server.channel);
                sendEmbed(channel, comment, server.roleid);
              }
            }
          );
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};
