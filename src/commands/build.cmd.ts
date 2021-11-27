import sendCommitEphemeral from '../methods/sendCommitEphemeral';
import { Commit } from '../models/Commit';
import { SlashCommand } from './SlashCommand';

export default new SlashCommand(
  {
    name: 'build',
    description: "Get a specific build number's Datamine comment(s)",
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
    if (commit) {
      await sendCommitEphemeral($, commit, i);
    } else {
      await i.editReply(`No Commit(s) Found for Build ${buildNumber}`);
    }
  }
);
