import { Event } from './Event';

export default new Event('rateLimit', ($, rl) => {
  console.log('Bot got ratelimited', rl);
});
