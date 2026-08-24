const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: true,
  retries: 0,
  reporter: "list",
  use: {
    baseURL: "http://localhost:5173/checkpoint/",
    trace: "on-first-retry",
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
  ],
});
