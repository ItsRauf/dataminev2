import CommitHandler from '../CommitHandler';
import { Database } from '../Database';
import getLatestCommit from '../methods/getLatestCommit';
import { Event } from './Event';

export default new Event('ready', async $ => {
  console.log('Connected to Discord.', `Logged in as ${$.user?.tag}`);
  Database();
  await CommitHandler($);
  setInterval(CommitHandler, 60000 * 5, $);
  const [latest] = await getLatestCommit();
  $.user?.setActivity({
    name: `Build ${latest.buildNumber}`,
    type: 'WATCHING',
    url: latest.url,
  });
});
