/**
 * Crossposts the message
 *
 * @param {import("discord.js").Message} message
 */
module.exports = function crosspost(message) {
  if (message.channel.type === "news") {
    message.client.api
      .channels(message.channel.id)
      .messages(message.id)
      .crosspost()
      .post();
  }
};
