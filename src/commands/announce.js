const { Client, Message, MessageEmbed } = require("discord.js");
const util = require("util");
const vm = require("vm");
const Server = require("../models/Server");

/**
 * Evaluates given code
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 */
module.exports = async function evaluate(msg, args, DatamineBot) {
  if (msg.author.id !== process.env.OWNERID) return;

  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/gm;
  const imageRegexTwo = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/m;
  const description = args.join(" ");
  const imageArr = description.match(imageRegex);
  const images = imageArr.map((imageUrl) => imageRegexTwo.exec(imageUrl)[0]);
  Server.find({}, (err, docs) => {
    console.log(docs);
    if (err) return console.error(err);
    docs.forEach(async (doc) => {
      const server = await DatamineBot.guilds.fetch(doc._id);
      const channel = server.channels.resolve(doc.channel);
      const embed = new MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.avatarURL())
        .setDescription(description);
      channel.send(embed).then((m) => {
        if (m.channel.type === "news") {
          m.client.api.channels(m.channel.id).messages(m.id).crosspost().post();
        }
        if (images.length > 0) {
          if (images.length <= 5) {
            channel
              .send(doc.roleid ? `<@&${doc.roleid}>` : "", images.join("\n"))
              .then((m) => {
                crosspost(m);
              });
          } else {
            const length = Math.ceil(images.length / 5);
            for (let index = 0; index < length; index++) {
              channel
                .send(images.splice(index, (index + 1) * 5).join("\n"))
                .then((m) => {
                  crosspost(m);
                });
            }
          }
        }
      });
    });
  });
};
