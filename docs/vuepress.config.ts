import { defineUserConfig } from 'vuepress';
import { viteBundler } from '@vuepress/bundler-vite';
import { defaultTheme } from '@vuepress/theme-default';
import { path } from '@vuepress/utils';
import { docsearchPlugin } from '@vuepress/plugin-docsearch';
import { seoPlugin } from '@vuepress/plugin-seo';
import { sitemapPlugin } from '@vuepress/plugin-sitemap';

export default defineUserConfig({
  bundler: viteBundler(),

  lang: 'en-US',
  title: 'Seedlingo',
  description: 'Modern mobile multi-language literacy',
  head: [
    [ 'link', { rel: 'icon', type: 'image/svg+xml', href: 'favicon/favicon.svg' } ],
    [ 'link', { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: 'favicon/apple-icon-180.png' } ],
    [ 'link', { rel: 'shortcut icon', href: '/favicon.ico' } ],
    [ 'link', { rel: 'preconnect', href: 'https://DBU4PMHNAN-dsn.algolia.net', crossorigin: '' } ],
  ],

  alias: {
    '@theme/VPHomeFeatures.vue': path.resolve('./.vuepress/theme/HomeFeatures.vue'),
  },

  theme: defaultTheme({
    logo: 'images/seedlingo-logo-blue.svg',
    navbar: [
      { text: 'Home', link: '/' },
      { text: 'Try Seedlingo', link: 'https://en.seedlingo.app' },
      { text: 'For teachers', link: '/content/content.md' },
      { text: 'For developers', link: '/get-started/get-started.md' },
    ],
    sidebar: [
      {
        text: 'For teachers',
        children: [
          '/content/content.md',
          '/content/replace-content.md',
          '/content/content-spec.md',
          '/content/content-validation.md',
        ],
      },
      {
        text: 'For developers',
        children: [
          '/get-started/get-started.md',
          {
            text: 'Android',
            link: '/android/android-build.html',
          },
          '/architecture/architecture.md',
        ],
      },
    ],
    repo: 'nodepa/seedlingo',
    docsRepo: 'nodepa/seedlingo',
    docsBranch: 'main',
    docsDir: 'docs',
    toggleColorMode: 'Toggle dark mode',
    lastUpdated: true,
  }),

  plugins: [
    [
      docsearchPlugin({
        apiKey: 'f697003c57e07694a70993bfb1b6a532',
        appId: 'DBU4PMHNAN',
        indexName: 'globalseedling',
        locales: {
          '/': {
            placeholder: 'Search',
          },
        },
      }),
    ],
    seoPlugin({
      hostname: 'seedlingo.com',
    }),
    sitemapPlugin({
      hostname: 'seedlingo.com',
    }),
  ],
});
