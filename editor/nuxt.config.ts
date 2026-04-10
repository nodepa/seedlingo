// https://nuxt.com/docs/api/configuration/nuxt-config
import { defineNuxtConfig } from 'nuxt/config';
import { fileURLToPath } from 'node:url';
import type { LoggingFunction, RollupLog } from 'rollup';

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
  typescript: {
    tsConfig: {
      compilerOptions: {
        // app/src files import these packages directly, but TypeScript resolves
        // modules by walking up from the source file's directory — which never
        // reaches editor/node_modules when type-checking ../../app/src/**. Pin
        // them here so nuxi prepare injects them into .nuxt/tsconfig.json via
        // defu deep-merge, preserving all other Nuxt-generated paths.
        paths: {
          vue: [fileURLToPath(new URL('./node_modules/vue', import.meta.url))],
          '@ionic/vue': [
            fileURLToPath(
              new URL('./node_modules/@ionic/vue', import.meta.url),
            ),
          ],
          ionicons: [
            fileURLToPath(new URL('./node_modules/ionicons', import.meta.url)),
          ],
          // Wildcard variant covers ionicons/icons and other subpath imports.
          // Uses a relative path (relative to .nuxt/) because resolveConfig()
          // only converts absolute paths, and a glob '*' can't go through URL.
          'ionicons/*': ['../node_modules/ionicons/*'],
        },
      },
    },
  },
  // Nuxt alias config is injected into both Vite and the generated tsconfig,
  // so TypeScript and Vite both resolve @/ the same way.
  // The more-specific Content mock alias must be listed before the generic @/.
  alias: {
    '@/Content/Content': fileURLToPath(
      new URL('./mocks/Content.ts', import.meta.url),
    ),
    '@': fileURLToPath(new URL('../app/src', import.meta.url)),
  },
  vite: {
    resolve: {
      alias: {
        // Duplicate here as well so Vite picks up both the trailing-slash form
        // (@/foo) and the bare form (@) consistently.
        '@/Content/Content': fileURLToPath(
          new URL('./mocks/Content.ts', import.meta.url),
        ),
        '@/': fileURLToPath(new URL('../app/src/', import.meta.url)),
      },
    },
    build: {
      rollupOptions: {
        // nuxt:module-preload-polyfill and @tailwindcss/vite:generate:build are
        // upstream plugins that transform files without emitting sourcemaps.
        // Suppress the resulting SOURCEMAP_BROKEN warnings since we can't fix them.
        onwarn(warning: RollupLog, warn: LoggingFunction) {
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
        '@plausible-analytics/tracker',
        'aws-amplify',
        '@ionic/vue',
        'ionicons',
        'aws-amplify/data',
        'valibot',
        'aws-amplify/storage',
        '@aws-amplify/ui-vue',
        'aws-amplify/utils',
      ],
    },
  },
});
