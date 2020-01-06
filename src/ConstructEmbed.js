const { RichEmbed } = require("discord.js");

/**
 * Embed Constructor
 *
 * @param {Object} commit
 * @param {String} commit.title
 * @param {String} commit.description
 * @param {String} commit.url
 * @returns {RichEmbed}
 */
module.exports = function ConstructEmbed(commit) {
  return new RichEmbed({
    title: commit.title,
    description: (commit.description.length > 2000) ? commit.description.substr(0, 2000) + "..." : commit.description,
    url: commit.url
  }).setTimestamp();
}