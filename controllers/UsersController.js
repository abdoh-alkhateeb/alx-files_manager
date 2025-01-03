import dbClient from '../utils/db';

export default class UsersController {
  static async postNew(req, res) {
    const { email, password } = req.body;

    if (!email) {
      res.status(400).json({ error: 'Missing email' });
    } else if (!password) {
      res.status(400).json({ error: 'Missing password' });
    } else {
      const user = dbClient.getUser(email);
      console.log(user);
      if (user) {
        res.status(400).json({ error: 'Already exist' });
      } else {
        const id = dbClient.createUser(email, password);
        res.status(201).json({ id, email });
      }
    }
  }
}
