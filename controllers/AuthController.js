import sha1 from 'sha1';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class AuthController {
  static async getConnect(req, res) {
    let email;
    let password;

    try {
      const authorization = req.headers.Authorization;
      const credentials = authorization.trim().split(' ')[1];
      const decodedCredentials = Buffer.from(credentials, 'base64').toString(
        'utf-8'
      );

      const data = decodedCredentials.split(':');

      email = data[0];
      password = data[1];
    } catch (error) {
      res.status(401).json({ error: 'Unauthorized+' });
      return false;
    }

    const user = await dbClient.getUser({ email, password: sha1(password) });

    if (!user) {
      res.status(401).json({ error: 'Unauthorized' });
      return false;
    }

    const token = uuidv4();
    const key = `auth_${token}`;

    await redisClient.set(key, user._id.toString(), 24 * 3600);

    res.json({ token });
    return true;
  }

  static async getDisconnect(req, res) {
    const token = req.headers['X-Token'];
    const key = `auth_${token}`;

    const id = await redisClient.get(key);

    if (!id) {
      res.status(401).json({ error: 'Unauthorized' });
      return false;
    }

    await redisClient.del(key);

    res.status(204).end();
    return true;
  }
}
