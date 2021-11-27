import { Awaitable, ClientEvents } from 'discord.js';
import { DatamineBot } from '../DatamineBot';

type EventFunc<E extends keyof ClientEvents> = (
  $: DatamineBot,
  ...args: ClientEvents[E]
) => Awaitable<void>;

interface EventOpts {
  once: boolean;
}

export class Event<E extends keyof ClientEvents> {
  constructor(
    public name: E,
    public func: EventFunc<E>,
    public opts?: EventOpts
  ) {}
  static isEvent(event: unknown): event is Event<keyof ClientEvents> {
    return event instanceof Event;
  }
  static async waitUntil<E extends keyof ClientEvents>(
    $: DatamineBot,
    event: E,
    checkFunction: (...args: ClientEvents[E]) => boolean = () => true,
    timeout?: number
  ): Promise<ClientEvents[E] | []> {
    return await new Promise(resolve => {
      let timeoutID: NodeJS.Timeout;
      if (timeout !== undefined) {
        timeoutID = setTimeout(() => {
          $.off(event, eventFunc);
          resolve([]);
        }, timeout);
      }
      const eventFunc = (...args: ClientEvents[E]): void => {
        if (checkFunction(...args)) {
          resolve(args);
          $.off(event, eventFunc);
          if (timeoutID !== undefined) clearTimeout(timeoutID);
        }
      };
      $.on(event, eventFunc);
    });
  }
}
