import { defineConfig, devices } from '@playwright/test'

const isCi = Boolean(process.env['CI'])

export default defineConfig({
  forbidOnly: isCi,
  fullyParallel: true,
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
    {
      name: 'Mobile Chrome',
      use: { ...devices['Pixel 5'] },
    },
    {
      name: 'Mobile Safari',
      use: { ...devices['iPhone 12'] },
    },
  ],
  reporter: 'html',
  retries: isCi ? 2 : 0,
  testDir: './e2e',
  use: {
    baseURL: 'http://localhost:4173',
    trace: 'on-first-retry',
  },
  webServer: {
    command: 'bun run build && bun run preview',
    reuseExistingServer: !isCi,
    url: 'http://localhost:4173',
  },
  workers: isCi ? 1 : 3,
})
