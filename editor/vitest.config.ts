import { defineVitestConfig } from '@nuxt/test-utils/config';

export default defineVitestConfig({
  test: {
    include: ['tests/{unit,component}/**/*.{test,spec}.{js,ts}'],
    coverage: {
      provider: 'v8',
      include: ['helpers/**', 'components/**'],
    },
  },
});
