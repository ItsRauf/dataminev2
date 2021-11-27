import sendAnnouncement from '../methods/sendAnnouncement';
import { Server } from '../models/Server';
import { Event } from './Event';

export default new Event('messageCreate', async ($, m) => {
  if (m.channel.type === 'DM') {
    if (m.author.id === process.env.OWNERID) {
      const servers = await Server.find();
      await sendAnnouncement($, m, servers);
    }
  }
});
