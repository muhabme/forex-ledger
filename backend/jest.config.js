import { createDefaultEsmPreset } from "ts-jest";

/** @type {import("jest").Config} */
export default {
  ...createDefaultEsmPreset(),
  testEnvironment: "node",
  // Source files import siblings as "./x.js" (required by ESM); point Jest at the .ts file.
  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
};
