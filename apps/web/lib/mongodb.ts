import { MongoClient, Db } from "mongodb";

// MongoDB 클라이언트 싱글턴
const globalForMongo = globalThis as unknown as {
  mongoClient: MongoClient | undefined;
};

export const mongoClient =
  globalForMongo.mongoClient ??
  new MongoClient(process.env.DATABASE_URL || "mongodb://localhost:27017/sdm");

if (process.env.NODE_ENV !== "production") {
  globalForMongo.mongoClient = mongoClient;
}

export const db: Db = mongoClient.db();
