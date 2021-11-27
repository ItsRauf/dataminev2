import getLatestCommit from '../methods/getLatestCommit';
import sendCommitEphemeral from '../methods/sendCommitEphemeral';
import { SlashCommand } from './SlashCommand';

export default new SlashCommand(
  {
    name: 'latest',
    description: 'Get the latest Datamine comment',
  },
  async ($, i) => {
    await i.deferReply({
      ephemeral: true,
    });
    const [commit] = await getLatestCommit();
    await sendCommitEphemeral($, commit, i);
  }
);
