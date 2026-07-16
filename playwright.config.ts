import { defineConfig } from '@playwright/test'

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'list',
  use: {
    baseURL: 'http://127.0.0.1:4321',
    channel: 'chrome',
    screenshot: 'only-on-failure',
    trace: 'retain-on-failure'
  },
  webServer: {
    command: 'NODE_ENV=development corepack pnpm run dev -- --host 127.0.0.1',
    port: 4321,
    reuseExistingServer: true,
    timeout: 120_000
  }
})
