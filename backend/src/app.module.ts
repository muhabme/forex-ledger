import { Module } from "@nestjs/common";
import type { ConfigType } from "@nestjs/config";
import { ConfigModule } from "@nestjs/config";
import { MongooseModule } from "@nestjs/mongoose";

import { appConfig } from "./config/app.config.js";
import { databaseConfig } from "./config/database.config.js";
import { validateEnv } from "./config/env.validation.js";
import { HealthCheckModule } from "./modules/health-check/health-check.module.js";

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      load: [appConfig, databaseConfig],
      validate: validateEnv,
    }),
    MongooseModule.forRootAsync({
      inject: [databaseConfig.KEY],
      useFactory: (database: ConfigType<typeof databaseConfig>) => ({
        uri: database.uri,
      }),
    }),
    HealthCheckModule,
  ],
})
export class AppModule {}
