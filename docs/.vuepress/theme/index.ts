import defaultTheme from '@vuepress/theme-default';
import type { ThemeObject } from '@vuepress/core'
import { path } from '@vuepress/utils'

const localTheme: ThemeObject = (options) => {
  return {
    name: 'vuepress-theme-local',
    extends: defaultTheme(options),
    layouts: {
      Layout: path.resolve(__dirname, 'Layout.vue'),
    },
    alias: {
      '@theme/HomeFeatures.vue': path.resolve(__dirname, 'HomeFeatures.vue'),
    },
  }
}

export default localTheme
