const { Client, Message } = require("discord.js");
const Server = require("../models/Server");

/**
 * Sets a role to ping for the Datamine Updates
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 */
module.exports = async function setrole(msg, args, _DatamineBot) {
  if (msg.member.hasPermission("MANAGE_GUILD")) {
    const role = await msg.guild.roles.fetch(args[0]);
    if (role) {
      return Server.findByIdAndUpdate(
        msg.guild.id,
        { $set: { roleid: role.id } },
        (err) => {
          if (err) return console.error(err);
          msg.channel.send(
            `\`${role.name}\` is now set to receive Datamine Updates`
          );
        }
      );
    }
  }
};
