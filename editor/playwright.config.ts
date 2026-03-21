import { defineConfig } from '@playwright/test';

const isDevMode = process.env.E2E_DEV;
const port = isDevMode ? 4000 : 3000;
const baseURL = `http://localhost:${port}`;

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.spec.ts',
  use: {
    baseURL,
    viewport: { width: 1280, height: 900 },
  },
  webServer: process.env.E2E_NO_SERVER
    ? undefined
    : {
        command: isDevMode ? 'npm run dev' : 'npm run start', // dev: 4000, start: 3000
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 120_000,
      },
  reporter: process.env.CI
    ? [
        ['list'],
        ['json', { outputFile: 'tests/e2e/report/playwright-report.json' }],
      ]
    : [['list']],
  outputDir: 'tests/e2e/test-results',
});
