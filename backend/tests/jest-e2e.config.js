import baseConfig from "../jest.config.js";

/** @type {import("jest").Config} */
export default {
  ...baseConfig,
  testRegex: "\\.e2e-spec\\.ts$",
  globalSetup: "<rootDir>/setup/global-setup.ts",
  globalTeardown: "<rootDir>/setup/global-teardown.ts",
};
