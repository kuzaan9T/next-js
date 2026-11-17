import { MongoClient } from "mongodb";
import type { TodoDocument } from "./types";

const uri = process.env.MONGODB_URI ?? "mongodb://127.0.0.1:27017";
const dbName = process.env.MONGODB_DB ?? "ex4_todos";

const globalForMongo = globalThis as unknown as {
  mongoClient?: Promise<MongoClient>;
};

function getClient() {
  if (!globalForMongo.mongoClient) {
    globalForMongo.mongoClient = new MongoClient(uri).connect().catch((error) => {
      globalForMongo.mongoClient = undefined;
      throw error;
    });
  }
  return globalForMongo.mongoClient;
}

export async function getTodosCollection() {
  const client = await getClient();
  return client.db(dbName).collection<TodoDocument>("todos");
}
