import getLatestCommit from '../methods/getLatestCommit';
import sendCommit from '../methods/sendCommit';
import setModCommands from '../methods/setModCommands';
import { Server } from '../models/Server';
import { SlashCommand } from './SlashCommand';

export default new SlashCommand(
  {
    name: 'subscribe',
    description: 'Subscribe to Datamine posts',
    options: [
      {
        type: 7,
        name: 'channel',
        description: 'Set the channel that will receive Datamine posts',
        required: true,
        channel_types: [0],
      },
      {
        type: 8,
        name: 'modrole',
        description: 'Set the moderator role that can edit config for Datamine',
        required: true,
      },
      {
        type: 8,
        name: 'role',
        description: 'Set the role that will receive pings about Datamine',
      },
    ],
  },
  async ($, i) => {
    await i.deferReply({
      ephemeral: true,
    });
    const channel = i.options.getChannel('channel', true);
    const modrole = i.options.getRole('modrole', true);
    const role = i.options.getRole('role');
    const exists = await Server.exists({
      _id: i.guildId,
    });
    if (exists) {
      await i.editReply(
        'This server is already subscribed. Use the config command to update settings.'
      );
    } else {
      const server = await Server.create({
        _id: i.guildId,
        channel: channel.id,
        modrole: modrole.id,
        role: role ? role.id : undefined,
      });
      await i.editReply(
        'This server is now subscribed. Sending latest commit.'
      );
      const [commit] = await getLatestCommit();
      await sendCommit($, commit, server);
      await setModCommands($, server);
    }
  },
  {
    guildOnly: true,
    modOnly: true,
  }
);
