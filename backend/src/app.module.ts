import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { appConfig } from "./config/app.config.js";
import { validateEnv } from "./config/env.validation.js";
import { HealthCheckModule } from "./modules/health-check/health-check.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig],
      validate: validateEnv,
    }),
    HealthCheckModule,
  ],
})
export class AppModule {}
