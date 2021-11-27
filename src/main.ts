import { config } from 'dotenv';
import { DatamineBot } from './DatamineBot';
config();

const datamine = new DatamineBot({
  intents: ['GUILDS', 'GUILD_MESSAGES'],
});

(async () => {
  await datamine.loadEvents();
  await datamine.login(process.env.TOKEN);
  await datamine.loadCommands();
})();

process.on('uncaughtException', console.error);
process.on('unhandledRejection', console.error);
