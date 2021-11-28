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
      if (btn.customId === `${id}-confirm`) {
        await btn.update({
          content: 'Confirmed',
          components: [],
        });
        for (const server of servers) {
          try {
            const guild = await $.guilds.fetch(server._id);
            if (guild) {
              try {
                const channel = (await guild.channels.fetch(
                  server.channel
                )) as TextChannel;
                if (channel) {
                  try {
                    console.log(`Sending to ${guild.name} // ${channel.name}`);
                    await channel.send({
                      content: server.role ? `<@&${server.role}>` : null,
                      embeds: [embed],
                    });
                  } catch (error) {
                    console.error(`${guild.name} // ${channel.name} errored`);
                  }
                }
              } catch (error) {
                console.log(
                  `${guild.name} is misconfigured. try to contact them if possible`
                );
              }
            }
          } catch (error) {
            console.log(`Deleting server ${server._id} as it errored`);
            try {
              await Server.deleteOne({ _id: server._id });
            } catch (error) {
              console.error(error);
            }
          }
        }
      } else if (btn.customId === `${id}-deny`) {
        await btn.update({
          content: 'Denied',
          components: [],
        });
      }
    }
  }
}
