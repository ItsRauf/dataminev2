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
        const s = await DatamineBot.guilds.resolve(server._id);
        if (s && s.channels) {
          /**
           * @type {TextChannel}
           */
          const channel = s.channels.resolve(server.channel);
          sendEmbed(channel, comment, server.roleid);
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};
