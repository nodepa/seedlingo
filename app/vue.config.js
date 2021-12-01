module.exports = {
  transpileDependencies: ['vuetify'],
  pwa: {
    name: '立爱种字', // used for apple-mobile-web-app-title
    themeColor: '#ffffff', // color of notification bar if present?
    msTileColor: '#0086ff', // bg color for Start menu tile?
    appleMobileWebAppCapable: 'yes', // opens link directly in separate ios app?
    appleMobileWebAppStatusBarStyle: 'default', // default, black, black-translucent
    assetsVersion: '1.0.0', // appends ?v=1.0.0 to URL of icons and manifest
    manifestOptions: {
      display: 'standalone', // standalone, fullscreen, minimal, browser
      background_color: '#0086ff',
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
      swSrc: './src/service-worker.js',
      // clientsClaim: true,
    },
  },
};
