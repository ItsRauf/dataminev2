import { TextChannel } from 'discord.js';
import { DatamineBot } from '../DatamineBot';
import { Commit } from '../models/Commit';
import { Server } from '../models/Server';
import constructEmbed from './constructEmbed';

export default async function sendCommit(
  $: DatamineBot,
  commit: Commit,
  server: Server,
  force?: boolean
): Promise<void> {
  const guild = $.guilds.cache.get(server._id);
  if (guild) {
    const channel = guild.channels.cache.get(server.channel) as TextChannel;
    if (channel) {
      if (force || (server.lastSentComment ?? 0) < commit._id) {
        const commitMSG = await channel.send({
          content: server.role ? `<@&${server.role}>` : null,
          embeds: [constructEmbed(commit)],
        });
        if (!force) {
          await Server.updateOne(
            {
              _id: server._id,
            },
            { lastSentComment: commit._id }
          );
        }
        if (commitMSG.crosspostable) {
          await commitMSG.crosspost();
        }
        if (commit.images) {
          const imgChunks = Array.from(
            { length: Math.ceil(commit.images.length / 5) },
            (v, i) => commit.images.slice(i * 5, i * 5 + 5)
          );
          const imgMsgs = await Promise.all(
            imgChunks.map(chunk => channel.send(chunk.join('\n')))
          );
          await Promise.all(imgMsgs.map(msg => msg.crosspost()));
        }
        if (commit.comments) {
          await Promise.all(
            commit.comments.map(comment => sendCommit($, comment, server))
          );
        }
      }
    }
  }
}
