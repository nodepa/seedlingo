// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';

export default defineNuxtConfig({
  compatibilityDate: '2025-03-31',
  ssr: false,
  devtools: { enabled: true },
  devServer: {
    port: 4000,
  },
  modules: ['@nuxt/ui', '@nuxt/image'],
  runtimeConfig: {
    public: {
      awsBranch: process.env.AWS_BRANCH || '',
      appVersion: process.env.npm_package_version || '',
      awsJobId: process.env.AWS_JOB_ID
        ? process.env.AWS_JOB_ID.replace(/^0+/, '')
        : '',
    },
  },
  app: {
    head: {
      title: 'Seedlingo Apiary',
    },
  },
  pages: true,
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'error',
        'neutral',
      ],
    },
  },
  vite: {
    build: {
      rollupOptions: {
        // nuxt:module-preload-polyfill and @tailwindcss/vite:generate:build are
        // upstream plugins that transform files without emitting sourcemaps.
        // Suppress the resulting SOURCEMAP_BROKEN warnings since we can't fix them.
        onwarn(warning, warn) {
          if (warning.code === 'SOURCEMAP_BROKEN') return;
          warn(warning);
        },
      },
    },
    optimizeDeps: {
      include: [
        '@vue/devtools-core',
        '@vue/devtools-kit',
        'aws-amplify/auth',
        'plausible-tracker',
        'aws-amplify',
      ],
    },
  },
});
