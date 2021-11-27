import { MessageEmbed } from 'discord.js';
import getLatestCommit from '../methods/getLatestCommit';
import sendCommit from '../methods/sendCommit';
import { Server } from '../models/Server';
import { SlashCommand } from './SlashCommand';

export default new SlashCommand(
  {
    name: 'config',
    description: "Modify DatamineBot's Config for the Current Server",
    defaultPermission: false,
    options: [
      {
        type: 1,
        name: 'channel',
        description: 'Set the channel that will receive Datamine posts',
        options: [
          {
            type: 7,
            name: 'channel',
            description: 'Set the channel that will receive Datamine posts',
            required: true,
            channel_types: [0],
          },
        ],
      },
      {
        type: 1,
        name: 'role',
        description: 'Set the role that will receive pings about Datamine',
        options: [
          {
            type: 8,
            name: 'role',
            description: 'Set the role that will receive pings about Datamine',
          },
        ],
      },
      {
        type: 1,
        name: 'modrole',
        description: 'Set the moderator role that can edit config for Datamine',
        options: [
          {
            type: 8,
            name: 'role',
            description:
              'Set the moderator role that can edit config for Datamine',
          },
        ],
      },
      {
        type: 1,
        name: 'remove',
        description: 'Removes this server from DatamineBot',
        options: [],
      },
      {
        type: 1,
        name: 'get',
        description: "Displays DatamineBot's Config for the Current Server",
        options: [],
      },
    ],
  },
  async ($, i) => {
    await i.deferReply({
      ephemeral: true,
    });
    const sub = i.options.getSubcommand(true);
    if (sub === 'get') {
      try {
        const server = await Server.findById(i.guildId);
        if (server) {
          const embed = new MessageEmbed().addFields([
            {
              name: 'Channel',
              value: `<#${server.channel}>`,
            },
            {
              name: 'Moderator Role',
              value: `<@&${server.modrole}>`,
            },
            {
              name: 'Role',
              value: server.role ? `<@&${server.role}>` : 'No Role Set',
            },
          ]);
          i.editReply({
            embeds: [embed],
          });
        } else {
          i.editReply('No config found');
        }
      } catch (error) {
        i.editReply(`${error}`);
      }
    }
    if (sub === 'remove') {
      try {
        await Server.deleteOne({ _id: i.guildId });
        i.editReply("Deleted the current guild's config");
      } catch (error) {
        i.editReply(`${error}`);
      }
    }
    if (sub === 'role') {
      const role = i.options.getRole('role');
      try {
        const server = await Server.findOneAndUpdate(
          { _id: i.guildId },
          { role: role?.id ?? '' },
          { upsert: true, new: true }
        );
        i.editReply(
          server.role
            ? `<@&${server.role}> has been set to receive notifications of Datamine posts.`
            : 'Role has been unset'
        );
      } catch (error) {
        i.editReply(`${error}`);
      }
    }
    if (sub === 'modrole') {
      const modrole = i.options.getRole('modrole', true);
      try {
        const server = await Server.findOneAndUpdate(
          { _id: i.guildId },
          { modrole: modrole.id },
          { upsert: true, new: true }
        );
        i.editReply(
          `<@&${server.modrole}> has been set to moderate this server's config of Datamine`
        );
      } catch (error) {
        i.editReply(`${error}`);
      }
    }
    if (sub === 'channel') {
      const chan = i.options.getChannel('channel', true);
      if (chan.type !== 'GUILD_TEXT') {
        i.editReply('Channel must be a Text Channel');
      } else {
        try {
          const server = await Server.findOneAndUpdate(
            { _id: i.guildId },
            { channel: chan.id },
            { upsert: true, new: true }
          );
          i.editReply(
            `<#${server?.channel}> has been set to receive Datamine posts. Sending most recent one now!`
          );
          const commit = await getLatestCommit();
          if (commit) {
            await sendCommit($, commit[0], server!, true);
          }
        } catch (error) {
          i.editReply(`${error}`);
        }
      }
    }
  },
  {
    guildOnly: true,
    modOnly: true,
  }
);
