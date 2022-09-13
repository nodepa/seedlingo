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
        theme_color: '#ffffff',
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
      // https://github.com/ionic-team/ionic-framework/issues/25104#issuecomment-1153124409
      // '@ionic/vue-router': `${__dirname}/node_modules/@ionic/vue-router/dist/index.esm`,
      '@ionic/vue/css': `${__dirname}/node_modules/@ionic/vue/css`,
      '@ionic/vue': `${__dirname}/node_modules/@ionic/vue/dist/index.esm`,
    },
  },
  test: {
    include: ['tests/{unit,component}/**/*.{test,spec}.{js,ts}'],
    // environment: 'happy-dom', // verify renders <audio src=''/>
    environment: 'jsdom',
  },
});
