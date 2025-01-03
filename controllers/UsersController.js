import { ObjectId } from 'mongodb';
import dbClient from '../utils/db';

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
    } else if (!password) {
      res.status(400).json({ error: 'Missing password' });
    } else {
      const user = await dbClient.getUser({ email });
      if (user) {
        res.status(400).json({ error: 'Already exist' });
      } else {
        const id = await dbClient.createUser(email, password);
        res.status(201).json({ id, email });
      }
    }
  }

  static async getMe(req, res) {
    const token = req.headers['X-Token'];
    const key = `auth_${token}`;

    const id = await redisClient.get(key);

    if (!id) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { email } = await dbClient.getUser({ _id: ObjectId(id) });

    res.json({ id, email });
  }
}
