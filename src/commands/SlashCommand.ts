import {
  ApplicationCommandData,
  Awaitable,
  CommandInteraction,
} from 'discord.js';
import { DatamineBot } from '../DatamineBot';

type SlashCommandFunc = (
  $: DatamineBot,
  i: CommandInteraction
) => Awaitable<void>;

interface SlashCommandOpts {
  guildOnly: boolean;
  modOnly: boolean;
}

export class SlashCommand {
  constructor(
    public data: ApplicationCommandData,
    public func: SlashCommandFunc,
    public opts?: SlashCommandOpts
  ) {}
}
