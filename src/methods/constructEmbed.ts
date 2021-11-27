import { MessageEmbed } from 'discord.js';
import { Commit } from '../models/Commit';

export default function constructEmbed(commit: Commit): MessageEmbed {
  return new MessageEmbed({
    title: commit.title,
    description:
      commit.description.length > 2000
        ? `${commit.description.substr(0, 2000)}...`
        : commit.description,
    url: commit.url,
    author: {
      name: commit.user.username,
      icon_url: commit.user.avatarURL,
      url: commit.user.url,
    },
  }).setTimestamp(new Date(commit.timestamp));
}
