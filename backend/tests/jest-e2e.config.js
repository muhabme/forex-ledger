import baseConfig from "../jest.config.js";

/** @type {import("jest").Config} */
export default {
  ...baseConfig,
  testRegex: "\\.e2e-spec\\.ts$",
};
