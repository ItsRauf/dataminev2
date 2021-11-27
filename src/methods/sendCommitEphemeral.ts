import { CommandInteraction } from 'discord.js';
import { DatamineBot } from '../DatamineBot';
import { Commit } from '../models/Commit';
import constructEmbed from './constructEmbed';

export default async function sendCommitEphemeral(
  $: DatamineBot,
  commit: Commit,
  i: CommandInteraction
): Promise<void> {
  await i.followUp({
    ephemeral: true,
    embeds: [constructEmbed(commit)],
  });
  if (commit.images) {
    const imgChunks = Array.from(
      { length: Math.ceil(commit.images.length / 5) },
      (v, i) => commit.images.slice(i * 5, i * 5 + 5)
    );
    await Promise.all(
      imgChunks.map(chunk =>
        i.followUp({
          content: chunk.join('\n'),
          ephemeral: true,
        })
      )
    );
  }
  if (commit.comments) {
    await Promise.all(
      commit.comments.map(comment => sendCommitEphemeral($, comment, i))
    );
  }
}
