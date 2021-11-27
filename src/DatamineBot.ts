import {
  ApplicationCommand,
  Client,
  ClientEvents,
  ClientOptions,
} from 'discord.js';
import { readdir } from 'fs/promises';
import { join, resolve } from 'path';
import { SlashCommand } from './commands/SlashCommand';
import { Event } from './events/Event';

export class DatamineBot extends Client {
  commands: Map<ApplicationCommand['id'], SlashCommand>;
  constructor(opts: ClientOptions) {
    super(opts);
    this.commands = new Map();
  }

  async loadCommands(): Promise<void> {
    const dir = resolve(__dirname, 'commands');
    const files = await readdir(dir);
    const commandFiles = files.filter(f => f.includes('.cmd'));
    for (const commandFile of commandFiles) {
      const { default: command } = (await import(join(dir, commandFile))) as {
        default: SlashCommand;
      };
      if (this.application) {
        const cmd = await this.application.commands.create(command.data);
        this.commands.set(cmd.id, command);
        console.log(`Loaded Command: ${cmd.name}`);
      }
    }
  }

  /**
   * Loads Events
   *
   * @return {*}  {Promise<void>}
   * @memberof Lifeguard
   */
  async loadEvents(): Promise<void> {
    const dir = resolve(__dirname, 'events');
    const files = await readdir(dir);
    const eventFiles = files.filter(f => f.includes('.evt'));
    for (const eventFile of eventFiles) {
      const { default: event } = (await import(join(dir, eventFile))) as {
        default: Event<keyof ClientEvents>;
      };
      if (Event.isEvent(event)) {
        if (event.opts?.once) {
          this.once(event.name, (...args) => {
            event.func(this, ...args);
          });
        } else {
          this.on(event.name, (...args) => {
            event.func(this, ...args);
          });
        }
      }
      console.log(`Loaded Event: ${event.name}`);
    }
  }
}
