const ConstructEmbed = require("./ConstructEmbed");

/**
 * @param {import("discord.js").TextChannel} channel
 * @param {import("mongoose").Document} commit
 * @param {string} roleid
 */
module.exports = async function sendEmbed(channel, commit, roleid) {
  try {
    if (!channel) return;
    if (!commit) return;

    const commitMSG = await channel.send(
      roleid ? `<@${roleid}>` : "",
      ConstructEmbed(commit)
    );

    if (commitMSG.crosspostable) {
      try {
        commitMSG.crosspost();
      } catch (error) {
        console.error(error.message);
      }
    }

    if (commit.images && commit.images.length > 0) {
      if (commit.images.length <= 5) {
        const imgMSG = await channel.send(commit.images.join("\n"));
        if (imgMSG.crosspostable) {
          try {
            imgMSG.crosspost();
          } catch (error) {
            console.error(error.message);
          }
        }
      }
    }

    if (commit.comments) {
      for (comment of commit.comments) {
        await sendEmbed(channel, {
          title: commit.title,
          ...comment,
        });
      }
    }
  } catch (error) {
    return Promise.reject(error);
  }
};
