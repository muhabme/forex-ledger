export interface CurrencyResponse {
  code: string;
  name: string;
  /** Digits after the decimal point; amounts are sent as integers in these minor units. */
  decimals: number;
}
