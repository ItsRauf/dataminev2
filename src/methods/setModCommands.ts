import { DatamineBot } from '../DatamineBot';
import { Server } from '../models/Server';

export default async function setModCommands(
  $: DatamineBot,
  server: Server
): Promise<void> {
  const cmds = Array.from($.commands.entries());
  for (const [id, cmd] of cmds) {
    if (cmd.opts?.modOnly) {
      await $.application?.commands.permissions.add({
        command: id,
        guild: server._id,
        permissions: [
          {
            id: server.modrole,
            type: 'ROLE',
            permission: true,
          },
        ],
      });
    }
  }
}
