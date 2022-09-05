import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:4173',
    chromeWebSecurity: false,
    supportFile: false,
    specPattern: 'tests/e2e/**/*[.ts|.js]',
    viewportHeight: 812,
    viewportWidth: 375,
  },
  fixturesFolder: false,
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
});
