import type { ConfigType } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";

import { AppModule } from "./app.module.js";
import { configureApp } from "./bootstrap.js";
import { appConfig } from "./config/app.config.js";

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  configureApp(app);

  const { port } = app.get<ConfigType<typeof appConfig>>(appConfig.KEY);
  await app.listen(port);
}

await bootstrap();
