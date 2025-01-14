import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';
import redisClient from '../utils/redis';

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
      return false;
    }

    if (!password) {
      res.status(400).json({ error: 'Missing password' });
      return false;
    }

    const user = await dbClient.getUser({ email });

    if (user) {
      res.status(400).json({ error: 'Already exist' });
      return false;
    }

    const id = await dbClient.createUser(email, password);

    res.status(201).json({ id, email });
    return true;
  }

  static async getMe(req, res) {
    const token = req.header('X-Token');
    const id = await redisClient.get(`auth_${token}`);

    if (!id) {
      res.status(401).json({ error: 'Unauthorized' });
      return false;
    }

    const { email } = await dbClient.getUser({ _id: ObjectId(id) });

    res.json({ id, email });
    return true;
  }
}
