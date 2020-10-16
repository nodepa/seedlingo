const name = '种字立爱';
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
      background_color: '#0086ff', // eslint-disable-line @typescript-eslint/camelcase
      // assumes assets generated with `yarn genass`, see packages.json
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
  },
  transpileDependencies: ['vuetify'],
  chainWebpack: (config) => {
    // Interfers with vuetify's loading of svgs, use webpack overload instead
    // i.e. "import Icon from '!vue-svg-loader!@/assets/icons/icon.svg';"
    // const svgRule = config.module.rule('svg');
    // svgRule.uses.clear();
    // svgRule
    //   .use('babel-loader')
    //   .loader('babel-loader')
    //   .end()
    //   .use('vue-svg-loader')
    //   .loader('vue-svg-loader');

    // Can be configured to generate progressive images
    // https://github.com/vuetifyjs/vuetify-loader
    // config.plugin('VuetifyLoaderPlugin').tap((args) => [
    config.plugin('VuetifyLoaderPlugin').tap(() => [
      {
        // match(originalTag, { kebabTag, camelTag, path, component }) {
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
  },
};
