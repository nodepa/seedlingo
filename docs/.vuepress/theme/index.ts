import type { ThemeObject } from '@vuepress/core'
import { path } from '@vuepress/utils'

const localTheme: ThemeObject = {
  name: 'vuepress-theme-local',
  extends: '@vuepress/theme-default',
  layouts: {
    Layout: path.resolve(__dirname, 'Layout.vue'),
  },
  alias: {
    '@theme/HomeFeatures.vue': path.resolve(__dirname, 'HomeFeatures.vue'),
  },
}

export default localTheme