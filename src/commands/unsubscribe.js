const { Client, Message, RichEmbed } = require("discord.js");
const Server = require("../models/Server");

const NotSubscribed = new RichEmbed({
  title: "Datamine Updates",
  description:
    "This channel is not subscribed. Use `d!subscribe` to receive updates!"
}).setTimestamp();

const Removed = new RichEmbed({
  title: "Datamine Updates",
  description: "This channel will not receive any more datamine updates."
}).setTimestamp();

/**
 * Subscribes a channel to the Datamine Updates
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 */
module.exports = function subscribe(msg, _args, _DatamineBot) {
  if (msg.member.hasPermission("MANAGE_GUILD")) {
    return Server.findOneAndDelete({ _id: msg.guild.id }, (err, doc) => {
      if (err) return console.error(err);
      if (doc) {
        msg.channel.send(Removed);
      } else {
        msg.channel.send(NotSubscribed);
      }
    });
  }
};
