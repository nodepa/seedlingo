import { defineConfig, splitVendorChunkPlugin } from 'vite';
import vue from '@vitejs/plugin-vue';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  appType: 'spa',
  plugins: [
    splitVendorChunkPlugin(),
    vue(),
    VitePWA({
      registerType: 'autoUpdate',
      injectRegister: null,
      includeAssets: ['**/*.{ico,jpg,png,svg,xml,txt}'],
      manifest: {
        id: '/',
        name: '立爱种字',
        short_name: '种字',
        description: '现代的流动的识字',
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
      },
    }),
  ],
  define: {
    __AWS_JOB_ID__: `\"${process.env.AWS_JOB_ID || ''}\"`,
    __AWS_BRANCH__: `\"${process.env.AWS_BRANCH || ''}\"`,
  },
  resolve: {
    alias: {
      '@/': `${__dirname}/src/`,
    },
  },
  test: {
    include: ['tests/{unit,component}/**/*.{test,spec}.{js,ts}'],
    environment: 'happy-dom',
  },
});
