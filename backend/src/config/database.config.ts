import { registerAs } from "@nestjs/config";

export interface DatabaseConfig {
  uri: string;
}

export const databaseConfig = registerAs("database", (): DatabaseConfig => {
  const uri = process.env.MONGODB_URI;

  if (uri === undefined) {
    throw new Error("MONGODB_URI is not set");
  }

  return { uri };
});
