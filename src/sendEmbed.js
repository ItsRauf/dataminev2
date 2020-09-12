const ConstructEmbed = require("./ConstructEmbed");
const crosspost = require("./crosspost");

/**
 * Sends Embed
 *
 * @param {import("discord.js").TextChannel} channel
 * @param {import("mongoose").Document} commit
 */
module.exports = function sendEmbed(channel, commit, roleid) {
  try {
    channel
      // .send(roleid ? `<@&${roleid}>` : "", ConstructEmbed(commit))
      .send(ConstructEmbed(commit))
      .then(async (msg) => {
        await crosspost(msg);
        if (commit.images && commit.images.length > 0) {
          if (commit.images.length <= 5) {
            await channel.send(commit.images.join("\n")).then(async (msg) => {
              await crosspost(msg);
            });
          } else {
            const length = Math.ceil(commit.images.length / 5);
            for (let index = 0; index < length; index++) {
              await channel
                .send(commit.images.splice(index, (index + 1) * 5).join("\n"))
                .then(async (msg) => {
                  await crosspost(msg);
                });
            }
          }
        }
      });

    if (commit.comments) {
      commit.comments.forEach(async (comment) => {
        await sendEmbed(channel, {
          title: commit.title,
          ...comment,
        });
      });
    }
    return Promise.resolve();
  } catch (error) {
    return Promise.reject(error);
  }
};
