import { Controller, Get } from "@nestjs/common";

import type { CurrencyResponse } from "../responses/currency.response.js";
import { CurrenciesService } from "../services/currencies.service.js";

@Controller("currencies")
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Get()
  findAll(): CurrencyResponse[] {
    return this.currenciesService
      .findAll()
      .map(({ code, name, decimals }) => ({ code, name, decimals }));
  }
}
