import { describe, expect, it } from "@jest/globals";

import { CURRENCIES } from "./currencies.generated.js";

// Guards the generated file: a bad refresh should fail here, not in production.
describe("generated currency table", () => {
  it("has no duplicate codes", () => {
    const codes = CURRENCIES.map(({ code }) => code);

    expect(new Set(codes).size).toBe(codes.length);
  });

  it("is sorted by code", () => {
    const codes = CURRENCIES.map(({ code }) => code);

    expect(codes).toEqual([...codes].sort());
  });

  it("uses three-letter uppercase codes and whole-number decimals from 0 to 4", () => {
    for (const { code, decimals } of CURRENCIES) {
      expect(code).toMatch(/^[A-Z]{3}$/);
      expect([0, 1, 2, 3, 4]).toContain(decimals);
    }
  });

  it.each([
    ["JPY", 0],
    ["EUR", 2],
    ["KWD", 3],
  ])("has %s with %i decimals", (code, decimals) => {
    expect(CURRENCIES).toContainEqual(
      expect.objectContaining({ code, decimals }),
    );
  });
});
