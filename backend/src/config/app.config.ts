import { registerAs } from "@nestjs/config";

export interface AppConfig {
  port: number;
}

// process.env is read after validateEnv() has checked it and filled in defaults.
export const appConfig = registerAs("app", (): AppConfig => ({
  port: Number(process.env.PORT),
}));
