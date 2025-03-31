// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-03-31',
  devtools: { enabled: true },
  modules: ['@nuxt/ui', '@nuxt/image'],
  css: ['@aws-amplify/ui-vue/styles.css', '~/assets/css/main.css'],
  app: {
    head: {
      title: 'Seedlingo Apiary',
    },
  },
  ui: {
    theme: {
      colors: [
        'primary',
        'secondary',
        'success',
        'info',
        'warning',
        'error',
        'neutral',
      ],
    },
  },
});