const { Client, Message, MessageEmbed } = require("discord.js");
const Server = require("../models/Server");

/**
 * Announces a message
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 */
module.exports = async function announce(msg, args, DatamineBot) {
  if (msg.author.id !== process.env.OWNERID) return;

  const imageRegex = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/gm;
  const imageRegexTwo = /(http(s?):)([/|.|\w|\s|-])*\.(?:jpg|gif|png)/m;
  const description = args.join(" ");
  const imageArr = description.match(imageRegex);
  const images =
    imageArr && imageArr.length > 0
      ? imageArr.map((imageUrl) => imageRegexTwo.exec(imageUrl)[0])
      : [];
  Server.find({}, (err, docs) => {
    if (err) return console.error(err);
    docs.forEach(async (doc) => {
      const server = await DatamineBot.guilds.fetch(doc._id);
      const channel = server.channels.resolve(doc.channel);
      const embed = new MessageEmbed()
        .setAuthor(msg.author.tag, msg.author.avatarURL())
        .setDescription(description);
      channel.send(embed).then(async (m) => {
        if (m.crosspostable) {
          await m.crosspost();
        }
        if (images.length > 0) {
          if (images.length <= 5) {
            channel
              .send(
                doc.roleid
                  ? `<@&${doc.roleid}>\n ${images.join("\n")}`
                  : images.join("\n")
              )
              .then(async (m) => {
                await m.crosspost();
              });
          } else {
            const length = Math.ceil(images.length / 5);
            for (let index = 0; index < length; index++) {
              channel
                .send(images.splice(index, (index + 1) * 5).join("\n"))
                .then(async (m) => {
                  await m.crosspost();
                });
            }
          }
        }
      });
    });
  });
};
