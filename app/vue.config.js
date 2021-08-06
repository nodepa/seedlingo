// eslint-disable-next-line @typescript-eslint/no-var-requires
const path = require('path');

const name = '立爱种字';
module.exports = {
  devServer: {
    compress: true,
  },
  pwa: {
    name, // used for apple-mobile-web-app-title
    themeColor: '#0086ff', // color of notification bar if present?
    msTileColor: '#0086ff', // bg color for Start menu tile?
    appleMobileWebAppCapable: 'yes', // opens link directly in separate ios app?
    appleMobileWebAppStatusBarStyle: 'default', // default, black, black-translucent
    assetsVersion: '1.0.0', // appends ?v=1.0.0 to URL of icons and manifest
    manifestOptions: {
      display: 'standalone', // standalone, fullscreen, minimal, browser
      background_color: '#0086ff',
      // assumes assets generated with `npm run genass`, see packages.json
      icons: [
        {
          src: 'logo/manifest-icon-512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'maskable any',
        },
        {
          src: 'logo/manifest-icon-192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'maskable any',
        },
      ],
    },
    iconPaths: {
      appleTouchIcon: 'logo/apple-icon-152.png',
      maskIcon: 'logo-m/safari-pinned-tab.svg',
      favicon32: 'logo-m/favicon-32x32.png',
      favicon16: 'logo-m/favicon-16x16.png',
      msTileImage: 'logo-m/msapplication-icon-144x144.png',
    },
    // workboxPluginMode: 'GenerateSW',
    workboxPluginMode: 'InjectManifest',
    workboxOptions: {
      swSrc: 'src/service-worker.js',
      importWorkboxFrom: 'local', // see v4.3.1 get-workbox-sw-imports.js
      // importWorkboxFrom: 'disabled', // see v4.3.1 get-workbox-sw-imports.js
      // modulePathPrefix: '/wb5.1.4/',
    },
  },
  transpileDependencies: ['vuetify'],
  configureWebpack: {
    entry: './app/src/main.ts',
    context: path.resolve(__dirname, '..'),
  },
  chainWebpack: (config) => {
    config.plugin('fork-ts-checker').tap((args) => {
      args[0].tsconfig = './app/tsconfig.json'; // eslint-disable-line no-param-reassign
      return args;
    });

    // Can be configured to generate progressive images
    // https://github.com/vuetifyjs/vuetify-loader
    config.plugin('VuetifyLoaderPlugin').tap(() => [
      {
        match(originalTag, { kebabTag, camelTag }) {
          if (kebabTag.startsWith('core-')) {
            return [
              camelTag,
              `import ${camelTag} from '@/components/core/${camelTag.substring(
                4,
              )}.vue'`,
            ];
          }
          return null;
        },
      },
    ]);

    config.plugin('html').tap((args) => {
      // Sets the <title> used in index.html
      args[0].title = name; // eslint-disable-line no-param-reassign
      return args;
    });

    config.resolve.alias.set('@content', path.resolve(__dirname, '../content'));
  },
};
