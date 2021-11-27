import {
  CommandInteraction,
  MessageActionRow,
  MessageButton,
} from 'discord.js';
import { DatamineBot } from '../DatamineBot';
import { Event } from '../events/Event';
import { Commit } from '../models/Commit';
import { Server } from '../models/Server';
import sendCommit from './sendCommit';
import sendCommitEphemeral from './sendCommitEphemeral';

export default async function resendCommit(
  $: DatamineBot,
  commit: Commit,
  server: Server,
  i: CommandInteraction
): Promise<void> {
  await sendCommitEphemeral($, commit, i);
  const id = Date.now();
  await i.followUp({
    ephemeral: true,
    content: 'Would you like to resend these commit(s)',
    components: [
      new MessageActionRow().addComponents(
        new MessageButton()
          .setCustomId(`${id}-confirm`)
          .setLabel('Confirm')
          .setStyle('PRIMARY'),
        new MessageButton()
          .setCustomId(`${id}-deny`)
          .setLabel('Deny')
          .setStyle('DANGER')
      ),
    ],
  });
  const [btn] = await Event.waitUntil(
    $,
    'interactionCreate',
    ii => ii.isButton() && ii.customId.startsWith(`${id}`)
  );
  if (btn) {
    if (btn.isButton()) {
      if (btn.customId === `${id}-confirm`) {
        await sendCommit($, commit, server, true);
        await btn.update({
          content: 'Confirmed',
          components: [],
        });
      } else if (btn.customId === `${id}-deny`) {
        await btn.update({
          content: 'Denied',
          components: [],
        });
      }
    }
  }
}
