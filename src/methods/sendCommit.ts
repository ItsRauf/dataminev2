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
  try {
    const guild = await $.guilds.fetch(server._id);
    if (guild) {
      try {
        const channel = (await guild.channels.fetch(
          server.channel
        )) as TextChannel;
        if (channel) {
          try {
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
                try {
                  await commitMSG.crosspost();
                } catch (error) {
                  console.error(
                    `${guild.name} (${guild.id}) // ${channel.name} errored on crosspost`
                  );
                }
              }
              if (commit.images) {
                const imgChunks = Array.from(
                  { length: Math.ceil(commit.images.length / 5) },
                  (v, i) => commit.images.slice(i * 5, i * 5 + 5)
                );
                try {
                  const imgMsgs = await Promise.all(
                    imgChunks.map(chunk => channel.send(chunk.join('\n')))
                  );
                  await Promise.all(
                    imgMsgs.map(msg => {
                      try {
                        return msg.crosspost();
                      } catch (error) {
                        return console.error(
                          `${guild.name} (${guild.id}) // ${channel.name} errored on image crosspost`
                        );
                      }
                    })
                  );
                } catch (error) {
                  console.error(
                    `${guild.name} (${guild.id}) // ${channel.name} errored on image sending`
                  );
                }
              }
              if (commit.comments) {
                await Promise.all(
                  commit.comments.map(comment => sendCommit($, comment, server))
                );
              }
            }
          } catch (error) {
            console.error(
              `${guild.name} (${guild.id}) // ${channel.name} errored`
            );
          }
        }
      } catch (error) {
        console.log(
          `${guild.name} (${guild.id}) is misconfigured. try to contact them if possible`
        );
      }
    }
  } catch (error) {
    console.log(`${server._id} errored.`);
  }
}
