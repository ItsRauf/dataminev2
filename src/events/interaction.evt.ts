import { GuildMember } from 'discord.js';
import { Event } from './Event';

export default new Event('interactionCreate', async ($, i) => {
  if (i.isCommand()) {
    const cmd = $.commands.get(i.commandId);
    if (cmd) {
      if (cmd.opts?.guildOnly && !i.inGuild()) {
        return await i.reply({
          ephemeral: true,
          content: 'This is a guild only command',
        });
      }
      if (
        cmd.opts?.modOnly &&
        !(i.member as GuildMember).permissions.has('MANAGE_WEBHOOKS', true)
      ) {
        return await i.reply({
          ephemeral: true,
          content: 'This is a mod only command',
        });
      }
      await cmd.func($, i);
    }
  }
});
