const { Client, Message } = require("discord.js")
const commands = require("./commands");

/**
 * Argument Parser
 *
 * @param {String} prefix
 * @param {String} content
 * @returns {{cmd: String, args: String[]}} args
 */
function parseArgs(prefix, content) {
  const parsed = content.split(prefix)[1].split(" ");
  const cmd = parsed[0];
  parsed.shift()
  return { cmd, args: parsed }
}

/**
 * Command Handler
 *
 * @param {Client} DatamineBot
 * @param {Message} msg
 */
module.exports = (DatamineBot, msg) => {
  const prefix = "d!"
  if (msg.content.startsWith(prefix)) {
    const { args, cmd } = parseArgs(prefix, msg.content)
    if (commands[cmd]) {
      commands[cmd](msg, args, DatamineBot);
    }
  }
}