import { MongoClient, Db } from 'mongodb';

let client: MongoClient | null = null;
let database: Db | null = null;

export async function getDb(): Promise<Db> {
  if (database) return database;
  const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/splitshare';
  client = new MongoClient(uri);
  await client.connect();
  database = client.db('splitshare');
  return database;
}

export async function closeDb() {
  if (client) {
    await client.close();
    client = null;
    database = null;
  }
}
