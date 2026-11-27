import { Module } from "@nestjs/common";

import { CurrenciesController } from "./controllers/currencies.controller.js";
import { CurrenciesService } from "./services/currencies.service.js";

@Module({
  controllers: [CurrenciesController],
  providers: [CurrenciesService],
})
export class CurrenciesModule {}
