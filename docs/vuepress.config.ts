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
    ['link', { rel: 'shortcut icon', href: '/favicon/favicon.ico' }],
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
        link: '/content/content.md',
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
    footerHtml: true,
    footer: '<a href="/privacy-policy/privacy-policy">Privacy policy</a></br></br><a href="https://nodepa.org">Copyright &copy; 2019-2022 Norwegian Development Partners</a>',
  },
  plugins: [
    [
      '@vuepress/plugin-search',
      {
        locales: {
          '/': {
            placeholder: 'Search',
          },
        },
      },
    ],
  ],
});
