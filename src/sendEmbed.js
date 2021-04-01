const ConstructEmbed = require("./ConstructEmbed");

/**
 * Sends Embed
 *
 * @param {import("discord.js").TextChannel} channel
 * @param {import("mongoose").Document} commit
 */
module.exports = async function sendEmbed(channel, commit, roleid) {
  try {
    if (!channel) return;
    await channel
      .send(roleid ? `<@&${roleid}>` : "", ConstructEmbed(commit))
      // .send(ConstructEmbed(commit))
      .then(async (msg) => {
        if (msg.crosspostable) {
          await msg.crosspost();
        }
        if (commit.images && commit.images.length > 0) {
          if (commit.images.length <= 5) {
            await channel.send(commit.images.join("\n")).then(async (msg) => {
              if (msg.crosspostable) {
                await msg.crosspost();
              }
            });
          } else {
            const length = Math.ceil(commit.images.length / 5);
            for (let index = 0; index < length; index++) {
              await channel
                .send(commit.images.splice(index, (index + 1) * 5).join("\n"))
                .then(async (msg) => {
                  if (msg.crosspostable) {
                    await msg.crosspost();
                  }
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
