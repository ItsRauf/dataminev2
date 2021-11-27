import resendCommit from '../methods/resendCommit';
import { Commit } from '../models/Commit';
import { Server } from '../models/Server';
import { SlashCommand } from './SlashCommand';

export default new SlashCommand(
  {
    name: 'resend',
    description: 'Resend comments for a build number',
    defaultPermission: false,
    options: [
      {
        type: 4,
        name: 'buildnumber',
        description: 'The build number',
        required: true,
      },
    ],
  },
  async ($, i) => {
    await i.deferReply({
      ephemeral: true,
    });
    const buildNumber = i.options.getInteger('buildnumber', true);
    const commit = await Commit.findOne({ buildNumber: `${buildNumber}` });
    const server = await Server.findById(i.guildId);
    if (server) {
      if (commit) {
        await resendCommit($, commit, server, i);
      } else {
        await i.editReply(`No Commit(s) Found for Build ${buildNumber}`);
      }
    } else {
      await i.editReply('This server is not configured');
    }
  },
  {
    guildOnly: true,
    modOnly: true,
  }
);
