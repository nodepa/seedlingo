import { path } from '@vuepress/utils';
import { defineUserConfig } from 'vuepress';
import type { DefaultThemeOptions } from 'vuepress';

export default defineUserConfig<DefaultThemeOptions>({
  lang: 'en-US',
  title: 'Seedling',
  description: 'Modern mobile multi-language literacy',
  head: [
    ['link', { rel: 'apple-touch-icon', type: 'image/png', sizes: '180x180', href: 'favicon/apple-icon-180.png' }],
    ['link', { rel: 'icon', type: 'image/png', sizes: '196x196', href: '/favicon/favicon-196.png' }],
    ['link', { rel: 'shortcut icon', href: '/favicon.ico' }],
    ['link', { rel: 'preconnect', href: 'https://DBU4PMHNAN-dsn.algolia.net', crossorigin: '' }],
  ],

  theme: path.resolve(__dirname, '.vuepress/theme'),
  themeConfig: {
    logo: 'images/seedling-logo-blue.svg',
    navbar: [
      '/get-started/get-started.md',
      '/content/content.md',
    ],
    sidebar: [
      '/get-started/get-started.md',
      {
        text: 'Content',
        link: '/content/content.html',
        children: [
          '/content/replace-content.md',
          '/content/content-spec.md',
          '/content/content-validation.md',
        ],
      },
    ],
    repo: 'nodepa/seedling',
    docsRepo: 'nodepa/seedling',
    docsBranch: 'main',
    docsDir: 'docs',
    toggleDarkMode: 'Toggle dark mode',
    lastUpdated: true,
  },
  markdown: {
    pageSuffix: '',
  },
  plugins: [
    [
      '@vuepress/docsearch',
      {
        apiKey: 'f697003c57e07694a70993bfb1b6a532',
        appId: 'DBU4PMHNAN',
        indexName: 'globalseedling',
        locales: {
          '/': {
            placeholder: 'Search',
          },
        },
      },
    ],
  ],
});
