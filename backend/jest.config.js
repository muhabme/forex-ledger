import { createDefaultEsmPreset } from "ts-jest";

/** @type {import("jest").Config} */
export default {
  ...createDefaultEsmPreset(),
  testEnvironment: "node",
  // Nest loads this polyfill at startup; unit tests of decorated classes need it too.
  setupFiles: ["reflect-metadata"],
  // Source files import siblings as "./x.js" (required by ESM); point Jest at the .ts file.
  moduleNameMapper: { "^(\\.{1,2}/.*)\\.js$": "$1" },
};
