import { defineVitestConfig } from '@nuxt/test-utils/config';
import { fileURLToPath } from 'node:url';

export default defineVitestConfig({
  test: {
    include: ['tests/{unit,component}/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      include: ['helpers/**', 'components/**'],
    },
  },
  resolve: {
    alias: {
      '@plausible-analytics/tracker': fileURLToPath(
        new URL(
          './node_modules/@plausible-analytics/tracker/plausible.js',
          import.meta.url,
        ),
      ),
    },
  },
});
