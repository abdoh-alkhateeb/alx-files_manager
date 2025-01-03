import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AuthController {
  static async getConnect(req, res) {
    let data;

    try {
      data = atob(req.headers.Authorization).split(':');
    } catch (error) {
      data = null;
    }

    if (!data) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const [email, password] = data;

    const user = await dbClient.getUser({ email, password: sha1(password) });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const token = uuidv4();
    const key = `auth_${token}`;

    await redisClient.set(key, user._id.toString(), 24 * 3600);

    res.json({ token });
  }

  static async getDisconnect(req, res) {
    const token = req.headers['X-Token'];
    const key = `auth_${token}`;

    const id = await redisClient.get(key);

    if (!id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    await redisClient.del(key);

    res.status(204).send();
  }
}
