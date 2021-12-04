import getLatestCommit from '../methods/getLatestCommit';
import sendCommit from '../methods/sendCommit';
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
        channel_types: [0, 5],
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
        role: role ? role.id : undefined,
      });
      await i.editReply(
        'This server is now subscribed. Sending latest commit.'
      );
      const [commit] = await getLatestCommit();
      await sendCommit($, commit, server);
    }
  },
  {
    guildOnly: true,
    modOnly: true,
  }
);
