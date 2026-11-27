import { Injectable } from "@nestjs/common";

import { CURRENCIES } from "../data/currencies.generated.js";
import type { Currency } from "../data/currency.js";

@Injectable()
export class CurrenciesService {
  findAll(): readonly Currency[] {
    return CURRENCIES;
  }
}
