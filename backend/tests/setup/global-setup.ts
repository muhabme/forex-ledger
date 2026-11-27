import { MongoMemoryServer } from "mongodb-memory-server";

declare global {
  var mongoServer: MongoMemoryServer | undefined;
}

// Runs once before all e2e tests. MONGODB_URI must be set before AppModule is
// imported, because ConfigModule validates the environment at import time.
export default async function globalSetup(): Promise<void> {
  globalThis.mongoServer = await MongoMemoryServer.create();
  process.env.MONGODB_URI = globalThis.mongoServer.getUri("forexledger-test");
}
