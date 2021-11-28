import {
  Message,
  MessageActionRow,
  MessageButton,
  MessageEmbed,
  TextChannel,
} from 'discord.js';
import { DatamineBot } from '../DatamineBot';
import { Event } from '../events/Event';
import { Server } from '../models/Server';

export default async function sendAnnouncement(
  $: DatamineBot,
  msg: Message,
  servers: Server[]
): Promise<void> {
  const id = Date.now();
  const embed = new MessageEmbed()
    .setAuthor(msg.author.tag, msg.author.avatarURL()!)
    .setDescription(msg.content);
  msg.reply({
    content: `Want to send this announcement to ${servers.length} Servers?`,
    embeds: [embed],
    components: [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(`${id}-confirm`)
          .setLabel('Confirm')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId(`${id}-deny`)
          .setLabel('Deny')
          .setStyle('DANGER')
      ),
    ],
  });
  const [btn] = await Event.waitUntil(
    $,
    'interactionCreate',
    i => i.isButton() && i.customId.startsWith(`${id}`)
  );
  if (btn) {
    if (btn.isButton()) {
      await btn.deferReply();
      if (btn.customId === `${id}-confirm`) {
        for (const server of servers) {
          const guild = await $.guilds.fetch(server._id);
          if (guild) {
            const channel = (await guild.channels.fetch(
              server.channel
            )) as TextChannel;
            if (channel) {
              await btn.followUp({
                content: `Sending to  (${guild.name}/${channel.name})`,
                ephemeral: true,
              });
              await channel.send({
                content: server.role ? `<@&${server.role}>` : null,
                embeds: [embed],
              });
            }
          }
        }

        // await btn.update({
        //   content: 'Confirmed',
        //   components: [],
        // });
        await btn.followUp('Confirmed');
      } else if (btn.customId === `${id}-deny`) {
        // await btn.update({
        //   content: 'Denied',
        //   components: [],
        // });
        await btn.followUp('Denied');
      }
    }
  }
}
