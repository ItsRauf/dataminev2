import { MessageEmbed } from 'discord.js';
import { SlashCommand } from './SlashCommand';

export default new SlashCommand(
  {
    name: 'ping',
    description: 'Pings the bot to see if it is alive.',
  },
  async ($, i) => {
    i.reply({
      ephemeral: true,
      embeds: [
        new MessageEmbed()
          .setTitle('Datamine Ping')
          .setDescription(`WebSocket Ping: ${$.ws.ping}ms`),
      ],
    });
  }
);
