const { Client, Message, RichEmbed } = require("discord.js");
const util = require("util");
const vm = require("vm");

/**
 * Evaluates given code
 *
 * @param {Message} msg
 * @param {String[]} args
 * @param {Client} DatamineBot
 */
module.exports = async function evaluate(msg, args, DatamineBot) {
  if (msg.author.id !== process.env.OWNERID) return;
  /**
   * Parses code from code block
   *
   * @param {String} data
   * @returns
   */
  function parseBlock(data) {
    // Regex provided from https://github.com/regexhq/gfm-code-block-regex/blob/master/index.js
    // (I felt it unnecessary to install the npm package)
    const re = /^(([ \t]*`{3,4})([^\n]*)([\s\S]+?)(^[ \t]*\2))/gm;
    const result = re.exec(data);
    return result[4];
  }

  const code = parseBlock(args.join(" "));
  if (code) {
    const evaled = await vm.runInNewContext(`(async () => { ${code} })()`, {
      DatamineBot,
      RichEmbed,
      msg
    });

    let func = evaled;
    if (typeof func !== "string") {
      func = util.inspect(func);
    }
    if (func) {
      const embed = new RichEmbed({
        fields: [
          {
            name: "Input:",
            value: `\`\`\`js\n${code}\n\`\`\``
          },
          {
            name: "Output:",
            value: `\`\`\`js\n${func}\n\`\`\``
          }
        ]
      });
      msg.channel.send(embed);
    }
  }
};
