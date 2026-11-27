import { defineConfig } from "@playwright/test";

const production = process.env.TEST_PRODUCTION === "1";
const port = production ? 3038 : 3037;
const baseURL = `http://127.0.0.1:${port}`;

export default defineConfig({
  testDir: "./tests",
  timeout: 90_000,
  expect: { timeout: 10_000 },
  use: { baseURL, channel: process.env.PLAYWRIGHT_CHANNEL },
  webServer: {
    command: production ? `npm run start -- -H 127.0.0.1 -p ${port}` : `npm run dev -- --webpack -H 127.0.0.1 -p ${port}`,
    url: baseURL + "/account/signin",
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
  },
});
