import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    include: ['tests/{unit,component}/**/*.{test,spec}.{js,ts}'],
    environmentMatchGlobs: [
      ['tests/component/**', 'nuxt'],
      ['tests/unit/**', 'happy-dom'],
    ],
    coverage: {
      provider: 'v8',
      include: ['helpers/**', 'components/**'],
    },
  },
});
