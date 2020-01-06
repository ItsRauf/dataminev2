const { Client, Message, RichEmbed } = require("discord.js");
const Server = require("../models/Server");
const getLatestCommit = require("../getLatestCommit");
const ConstructEmbed = require("../ConstructEmbed");

/**
 * Subscribes a channel to the Datamine Updates
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 */
module.exports = function migrate(msg, _args, DatamineBot) {
  [
    "566732434239127556",
    "568136119947100161",
    "573634980182228994",
    "603620760883429376",
    "607261502004658234",
    "607319843276062720",
    "633515746974105611",
    "639561744783507487"
  ].forEach(c => {
    const guild = DatamineBot.guilds.find(g => g.channels.has(c));
    const channel = guild.channels.get(c);
    Server.create({ _id: guild.id, channel: channel.id }).then(() => {
      channel
        .send(
          new RichEmbed({
            title: "Announcement: Migration to v2",
            description:
              "v2 of DatamineBot is now here (Don't Worry, you don't have to do anything!).\nChanges:\n - Prefix is now d!\n - Switched from JSON to MongoDB\n - Added a latest command"
          })
        )
        .then(() => {
          getLatestCommit().then(commit => {
            channel.send(ConstructEmbed(commit)).then(() => {
              if (commit.images.length > 0) {
                if (commit.images.length <= 5) {
                  channel.send(commit.images.join("\n"));
                } else {
                  const length = Math.ceil(commit.images.length / 5);
                  for (let index = 0; index < length; index++) {
                    channel.send(
                      commit.images.splice(index, (index + 1) * 5).join("\n")
                    );
                  }
                }
              }
            });
          });
        });
    });
  });
};
