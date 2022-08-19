import { defineConfig } from 'cypress';

export default defineConfig({
  fixturesFolder: false,
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
  e2e: {
    supportFile: false,
    specPattern: 'tests/e2e/**/*.[t|j]s',
    // baseUrl: 'http://localhost:8080',
    viewportWidth: 375,
    viewportHeight: 812,
  },
});
