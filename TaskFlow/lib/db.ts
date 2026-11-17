import mongoose from "mongoose";
import { MONGODB_URI } from "./env";

const globalForMongoose = globalThis as unknown as {
  mongooseConnection?: Promise<typeof mongoose>;
};

export function connectDB() {
  if (!globalForMongoose.mongooseConnection) {
    globalForMongoose.mongooseConnection = mongoose
      .connect(MONGODB_URI, { bufferCommands: false })
      .catch((error) => {
        globalForMongoose.mongooseConnection = undefined;
        throw error;
      });
  }
  return globalForMongoose.mongooseConnection;
}
