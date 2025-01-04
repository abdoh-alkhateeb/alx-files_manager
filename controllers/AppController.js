import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AppController {
  static async getStatus(req, res) {
    res.json({ redis: redisClient.isAlive(), db: dbClient.isAlive() });
  }

  static async getStats(req, res) {
    res.json({
      users: await dbClient.nbUsers(),
      files: await dbClient.nbFiles(),
    });
  }
}
