import { createClient } from 'redis';

class RedisClient {
  constructor() {
    this.client = createClient();
    this.client.on_error((err) => console.log('Redis Client Error', err));
    this.client.connect();
  }

  isAlive() {
    return this.client.connected;
  }

  async get(key) {
    return await this.client.get(key);
  }

  async set(key, value, duration) {
    await this.client.set(key, value, {
      EX: duration,
    });
  }

  async del(key) {
    await this.client.del(key);
  }
}

const redisClient = RedisClient();

export default redisClient;
