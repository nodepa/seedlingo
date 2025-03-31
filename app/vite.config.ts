/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  appType: 'spa',
  plugins: [
    vue(),
    VitePWA({
      injectRegister: null,
      registerType: 'autoUpdate',
      manifest: {
        id: '/',
        name: 'Seedlingo',
        short_name: 'seedlingo',
        description: 'Modern mobile multi-language literacy',
        theme_color: '#1976d2',
        icons: [
          {
            src: 'logo/manifest-icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'logo/manifest-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'logo/manifest-icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable any',
          },
        ],
      },
      workbox: {
        globPatterns: [
          '**/*.{js,css,html,ico,jpg,jpeg,png,gif,svg,mp3,audio,xml,txt}',
        ],
        maximumFileSizeToCacheInBytes: 8000000,
      },
    }),
  ],
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __AWS_JOB_ID__: JSON.stringify(
      process.env.AWS_JOB_ID ? process.env.AWS_JOB_ID.replace(/^0+/, '') : '',
    ),
    __AWS_BRANCH__: JSON.stringify(process.env.AWS_BRANCH),
  },
  resolve: {
    alias: {
      '@/': `${__dirname}/src/`,
    },
  },
  test: {
    include: ['tests/{unit,component}/**/*.{test,spec}.{js,ts}'],
    environment: 'happy-dom',
    coverage: {
      provider: 'v8',
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks(id: string) {
          if (id.includes('Content/Content.ts')) {
            return 'Content';
          }
          if (id.includes('node_modules/@mdi')) {
            return 'mdi';
          }
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
});
