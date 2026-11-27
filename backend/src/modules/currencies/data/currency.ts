export interface Currency {
  /** ISO 4217 alphabetic code, e.g. "EUR". */
  code: string;
  name: string;
  /** ISO 4217 minor units: digits after the decimal point (JPY 0, EUR 2, KWD 3). */
  decimals: number;
}
