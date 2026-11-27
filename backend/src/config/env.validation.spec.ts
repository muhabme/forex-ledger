import { describe, expect, it } from "@jest/globals";

import { validateEnv } from "./env.validation.js";

describe("validateEnv", () => {
  it("defaults PORT to 3000 when it is not set", () => {
    expect(validateEnv({}).PORT).toBe(3000);
  });

  it("converts PORT from a string to a number", () => {
    expect(validateEnv({ PORT: "8080" }).PORT).toBe(8080);
  });

  it.each([
    ["not a number", "abc"],
    ["empty", ""],
    ["out of range", "70000"],
    ["a decimal", "80.5"],
  ])("rejects a PORT that is %s", (_case, value) => {
    expect(() => validateEnv({ PORT: value })).toThrow(
      /Invalid environment variables[\s\S]*PORT/,
    );
  });
});
