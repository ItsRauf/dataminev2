const ConstructEmbed = require("./ConstructEmbed");
const crosspost = require("./crosspost");

/**
 * Sends Embed
 *
 * @param {import("discord.js").TextChannel} channel
 * @param {import("mongoose").Document} commit
 */
module.exports = function sendEmbed(channel, commit, roleid) {
  channel
    .send(roleid ? `<@&${roleid}>` : "", ConstructEmbed(commit))
    .then((msg) => {
      crosspost(msg);
      if (commit.images && commit.images.length > 0) {
        if (commit.images.length <= 5) {
          channel.send(commit.images.join("\n")).then((msg) => {
            crosspost(msg);
          });
        } else {
          const length = Math.ceil(commit.images.length / 5);
          for (let index = 0; index < length; index++) {
            channel
              .send(commit.images.splice(index, (index + 1) * 5).join("\n"))
              .then((msg) => {
                crosspost(msg);
              });
          }
        }
      }
    });

  if (commit.comments) {
    commit.comments.forEach((comment) => {
      sendEmbed(channel, {
        title: commit.title,
        ...comment,
      });
    });
  }
};
