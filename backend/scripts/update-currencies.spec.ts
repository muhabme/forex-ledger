import { describe, expect, it } from "@jest/globals";

import {
  buildCurrencyTable,
  parseIsoList,
  renderModule,
} from "./update-currencies.js";

const ISO_XML = `<?xml version="1.0" encoding="UTF-8" standalone="yes"?>
<ISO_4217 Pblshd="2026-09-17">
  <CcyTbl>
    <CcyNtry><CtryNm>JAPAN</CtryNm><CcyNm>Yen</CcyNm><Ccy>JPY</Ccy><CcyNbr>392</CcyNbr><CcyMnrUnts>0</CcyMnrUnts></CcyNtry>
    <CcyNtry><CtryNm>FRANCE</CtryNm><CcyNm>Euro</CcyNm><Ccy>EUR</Ccy><CcyNbr>978</CcyNbr><CcyMnrUnts>2</CcyMnrUnts></CcyNtry>
    <CcyNtry><CtryNm>GERMANY</CtryNm><CcyNm>Euro</CcyNm><Ccy>EUR</Ccy><CcyNbr>978</CcyNbr><CcyMnrUnts>2</CcyMnrUnts></CcyNtry>
    <CcyNtry><CtryNm>KUWAIT</CtryNm><CcyNm>Kuwaiti Dinar</CcyNm><Ccy>KWD</Ccy><CcyNbr>414</CcyNbr><CcyMnrUnts>3</CcyMnrUnts></CcyNtry>
    <CcyNtry><CtryNm>ZZ08_Gold</CtryNm><CcyNm>Gold</CcyNm><Ccy>XAU</Ccy><CcyNbr>959</CcyNbr><CcyMnrUnts>N.A.</CcyMnrUnts></CcyNtry>
    <CcyNtry><CtryNm>ANTARCTICA</CtryNm><CcyNm>No universal currency</CcyNm></CcyNtry>
  </CcyTbl>
</ISO_4217>`;

describe("parseIsoList", () => {
  it("reads the publication date and the minor units of each currency", () => {
    const { published, minorUnits } = parseIsoList(ISO_XML);

    expect(published).toBe("2026-09-17");
    expect(Object.fromEntries(minorUnits)).toEqual({ JPY: 0, EUR: 2, KWD: 3 });
  });

  it("fails when the list has no publication date", () => {
    expect(() => parseIsoList("<ISO_4217></ISO_4217>")).toThrow(
      /publication date/,
    );
  });
});

describe("buildCurrencyTable", () => {
  const minorUnits = new Map([
    ["EUR", 2],
    ["JPY", 0],
    ["KWD", 3],
  ]);

  it("keeps fiat currencies that have ISO decimals, sorted by code", () => {
    const { currencies } = buildCurrencyTable(
      [
        { iso_code: "KWD", name: "Kuwaiti Dinar", type: "currency" },
        { iso_code: "EUR", name: "Euro", type: "currency" },
        { iso_code: "JPY", name: "Japanese Yen", type: "currency" },
      ],
      minorUnits,
    );

    expect(currencies).toEqual([
      { code: "EUR", name: "Euro", decimals: 2 },
      { code: "JPY", name: "Japanese Yen", decimals: 0 },
      { code: "KWD", name: "Kuwaiti Dinar", decimals: 3 },
    ]);
  });

  it("drops crypto and metals, and reports fiat codes missing from ISO 4217", () => {
    const { currencies, skipped } = buildCurrencyTable(
      [
        { iso_code: "BTC", name: "Bitcoin", type: "crypto" },
        { iso_code: "XAU", name: "Gold (Troy Ounce)", type: "metal" },
        { iso_code: "GGP", name: "Guernsey Pound", type: "currency" },
        {
          iso_code: "CNH",
          name: "Chinese Renminbi Yuan Offshore",
          type: "currency",
        },
        { iso_code: "EUR", name: "Euro", type: "currency" },
      ],
      minorUnits,
    );

    expect(currencies.map(({ code }) => code)).toEqual(["EUR"]);
    expect(skipped).toEqual(["CNH", "GGP"]);
  });
});

describe("renderModule", () => {
  it("renders a typed module with a header naming the sources", () => {
    const source = renderModule(
      [{ code: "EUR", name: "Euro", decimals: 2 }],
      "2026-09-17",
    );

    expect(source).toContain("Do not edit by hand");
    expect(source).toContain("ISO 4217 list published 2026-09-17");
    expect(source).toContain(
      'export const CURRENCIES: readonly Currency[] = [\n  { code: "EUR", name: "Euro", decimals: 2 },\n];',
    );
  });

  it("escapes quotes in currency names", () => {
    const source = renderModule(
      [{ code: "XXX", name: 'Say "hi"', decimals: 2 }],
      "2026-09-17",
    );

    expect(source).toContain('name: "Say \\"hi\\""');
  });
});
