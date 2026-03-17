import { defineConfig } from 'cypress';

export default defineConfig({
  e2e: {
    allowCypressEnv: false,
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false,
    supportFile: false,
    specPattern: 'tests/e2e/**/*.cy.{js,ts}',
    viewportHeight: 900,
    viewportWidth: 1280,
  },
  screenshotsFolder: 'tests/e2e/screenshots',
  videosFolder: 'tests/e2e/videos',
});
