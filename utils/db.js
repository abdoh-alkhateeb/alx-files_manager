import { MongoClient } from 'mongodb';
import sha1 from 'sha1';

class DBClient {
  constructor() {
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || 27017;
    const database = process.env.DB_DATABASE || 'files_manager';

    const url = `mongodb://${host}:${port}/${database}`;

    this.client = MongoClient(url);
    this.client.connect();
  }

  isAlive() {
    return this.client.isConnected();
  }

  async nbUsers() {
    return this.client.db().collection('users').countDocuments();
  }

  async nbFiles() {
    return this.client.db().collection('files').countDocuments();
  }

  async createUser(email, password) {
    return (
      await this.client
        .db()
        .collection('users')
        .insertOne({ email, password: sha1(password) })
    ).insertedId;
  }

  async getUser(email) {
    await this.client.db().collection('users').find({ email }).toArray()[0];
  }
}

const dbClient = new DBClient();

export default dbClient;
