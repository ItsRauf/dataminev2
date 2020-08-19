const { Client, TextChannel } = require("discord.js");
const ConstructEmbed = require("./ConstructEmbed");
const getLatestCommit = require("./getLatestCommit");
const Commit = require("./models/Commit");
const Server = require("./models/Server");

/**
 * Parses build number from title
 *
 * @param {String} title
 * @returns Build Number
 */
function parseBuildNumber(title) {
  const regex = /(Canary\sbuild:\s([0-9]*))/;
  if (regex.test(title)) {
    return regex.exec(title)[2];
  }
}

/**
 * Sends commits
 *
 * @param {Client} DatamineBot
 */
module.exports = async function sendCommits(DatamineBot) {
  try {
    Server.find().then((servers) => {
      servers.forEach(async (server) => {
        const s = await DatamineBot.guilds.resolve(server._id);
        if (s && s.channels) {
          /**
           * @type {TextChannel}
           */
          const channel = s.channels.resolve(server.channel);
          const messages = Array.from(
            // (await channel.fetchMessages({ limit: 100 })).values()
            (await channel.messages.fetch({ limit: 100 })).values()
          );
          if (Array.isArray(messages)) {
            const messagesFromDatamine = messages.filter(
              (message) => message.author.id === DatamineBot.user.id
            );
            const messagesWithEmbed = messagesFromDatamine.filter(
              (message) => message.embeds.length > 0
            );
            const DatamineEmbeds = messagesWithEmbed.filter((message) => {
              const regex = /(Canary\sbuild:\s([0-9]*))/;
              if (regex.test(message.embeds[0].title)) return message;
            });
            const message = DatamineEmbeds[0];
            getLatestCommit().then((commit) => {
              if (message) {
                if (message.embeds.length <= 0) {
                  message.channel
                    .send(
                      server.roleid ? `<@&${server.roleid}>` : "",
                      ConstructEmbed(commit)
                    )
                    .then((msg) => {
                      if (msg.channel.type === "news") {
                        msg.client.api
                          .channels(msg.channel.id)
                          .messages(msg.id)
                          .crosspost()
                          .post();
                      }
                      if (commit.images.length > 0) {
                        if (commit.images.length <= 5) {
                          message.channel
                            .send(commit.images.join("\n"))
                            .then((msg) => {
                              if (msg.channel.type === "news") {
                                msg.client.api
                                  .channels(msg.channel.id)
                                  .messages(msg.id)
                                  .crosspost()
                                  .post();
                              }
                            });
                        } else {
                          const length = Math.ceil(commit.images.length / 5);
                          for (let index = 0; index < length; index++) {
                            message.channel
                              .send(
                                commit.images
                                  .splice(index, (index + 1) * 5)
                                  .join("\n")
                              )
                              .then((msg) => {
                                if (msg.channel.type === "news") {
                                  msg.client.api
                                    .channels(msg.channel.id)
                                    .messages(msg.id)
                                    .crosspost()
                                    .post();
                                }
                              });
                          }
                        }
                      }
                    });
                } else if (message.embeds[0].title !== commit.title) {
                  Commit.find()
                    .sort("-buildNumber")
                    .then((commits) => {
                      commits
                        .filter(
                          (commit) =>
                            parseBuildNumber(message.embeds[0].title) <
                            commit.buildNumber
                        )
                        .sort((a, b) => a.buildNumber - b.buildNumber)
                        .forEach((commit) => {
                          message.channel
                            .send(
                              server.roleid ? `<@&${server.roleid}>` : "",
                              ConstructEmbed(commit)
                            )
                            .then(async (msg) => {
                              if (msg.channel.type === "news") {
                                msg.client.api
                                  .channels(msg.channel.id)
                                  .messages(msg.id)
                                  .crosspost()
                                  .post();
                              }
                              if (commit.images.length > 0) {
                                if (commit.images.length <= 5) {
                                  await message.channel
                                    .send(commit.images.join("\n"))
                                    .then((msg) => {
                                      if (msg.channel.type === "news") {
                                        msg.client.api
                                          .channels(msg.channel.id)
                                          .messages(msg.id)
                                          .crosspost()
                                          .post();
                                      }
                                    });
                                } else {
                                  const length = Math.ceil(
                                    commit.images.length / 5
                                  );
                                  for (let index = 0; index < length; index++) {
                                    await message.channel
                                      .send(
                                        commit.images
                                          .splice(index, (index + 1) * 5)
                                          .join("\n")
                                      )
                                      .then((msg) => {
                                        if (msg.channel.type === "news") {
                                          msg.client.api
                                            .channels(msg.channel.id)
                                            .messages(msg.id)
                                            .crosspost()
                                            .post();
                                        }
                                      });
                                  }
                                }
                              }
                            });
                        });
                    });
                }
              } else {
                channel
                  .send(
                    server.roleid ? `<@&${server.roleid}>` : "",
                    ConstructEmbed(commit)
                  )
                  .then((msg) => {
                    if (msg.channel.type === "news") {
                      msg.client.api
                        .channels(msg.channel.id)
                        .messages(msg.id)
                        .crosspost()
                        .post();
                    }
                    if (commit.images.length > 0) {
                      if (commit.images.length <= 5) {
                        message.channel
                          .send(commit.images.join("\n"))
                          .then((msg) => {
                            if (msg.channel.type === "news") {
                              msg.client.api
                                .channels(msg.channel.id)
                                .messages(msg.id)
                                .crosspost()
                                .post();
                            }
                          });
                      } else {
                        const length = Math.ceil(commit.images.length / 5);
                        for (let index = 0; index < length; index++) {
                          message.channel
                            .send(
                              commit.images
                                .splice(index, (index + 1) * 5)
                                .join("\n")
                            )
                            .then((msg) => {
                              if (msg.channel.type === "news") {
                                msg.client.api
                                  .channels(msg.channel.id)
                                  .messages(msg.id)
                                  .crosspost()
                                  .post();
                              }
                            });
                        }
                      }
                    }
                  });
              }
            });
          }
        }
      });
    });
  } catch (error) {
    console.error(error);
  }
};
