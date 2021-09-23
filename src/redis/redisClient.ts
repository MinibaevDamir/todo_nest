import * as redis from 'redis';
export const redisClient = redis.createClient(6379, process.env.REDIS_HOST);

redisClient.on_connect(() => {
  console.log('redis connected');
});
