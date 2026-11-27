import { describe, expect, it } from "@jest/globals";

import { validateEnv } from "./env.validation.js";

const REQUIRED_ENV = { MONGODB_URI: "mongodb://localhost:27017/forexledger" };

describe("validateEnv", () => {
  describe("PORT", () => {
    it("defaults to 3000 when it is not set", () => {
      expect(validateEnv(REQUIRED_ENV).PORT).toBe(3000);
    });

    it("converts a string to a number", () => {
      expect(validateEnv({ ...REQUIRED_ENV, PORT: "8080" }).PORT).toBe(8080);
    });

    it.each([
      ["not a number", "abc"],
      ["empty", ""],
      ["out of range", "70000"],
      ["a decimal", "80.5"],
    ])("rejects a value that is %s", (_case, value) => {
      expect(() => validateEnv({ ...REQUIRED_ENV, PORT: value })).toThrow(
        /Invalid environment variables[\s\S]*PORT/,
      );
    });
  });

  describe("MONGODB_URI", () => {
    it.each([
      "mongodb://localhost:27017/forexledger",
      "mongodb+srv://cluster.example.net/forexledger",
    ])("accepts %s", (uri) => {
      expect(validateEnv({ MONGODB_URI: uri }).MONGODB_URI).toBe(uri);
    });

    it("is required", () => {
      expect(() => validateEnv({})).toThrow(/MONGODB_URI/);
    });

    it.each(["", "localhost:27017", "http://localhost:27017"])(
      "rejects %j",
      (uri) => {
        expect(() => validateEnv({ MONGODB_URI: uri })).toThrow(/MONGODB_URI/);
      },
    );
  });
});
