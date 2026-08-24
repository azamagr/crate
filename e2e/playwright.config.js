const { defineConfig, devices } = require("@playwright/test");

module.exports = defineConfig({
  testDir: "./tests",
  fullyParallel: false,
  workers: 1,
  retries: 1,
  timeout: 30_000,
  expect: { timeout: 10_000 },
  reporter: "html",
  use: {
    baseURL: "http://localhost:5173/checkpoint/",
    trace: "on-first-retry",
    screenshot: "only-on-failure",
  },
  projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],

  // Starts both servers for you and waits until each responds before running
  // any test — removes the need to manually juggle two terminals in the
  // right order. If a server is already running on that port, it's reused
  // instead of double-starting it.
  webServer: [
    {
      command: "npm run dev",
      cwd: "../backend",
      url: "http://localhost:5000/api/health",
      timeout: 30_000,
      reuseExistingServer: true,
    },
    {
      command: "npm run dev",
      cwd: "../frontend",
      url: "http://localhost:5173/checkpoint/",
      timeout: 30_000,
      reuseExistingServer: true,
    },
  ],
});
