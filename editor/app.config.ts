declare module 'nuxt/schema' {
  interface AppConfigInput {
    title?: string;
  }
}

export default defineAppConfig({
  title: 'Seedlingo Apiary',
  ui: {
    colors: {
      primary: 'lochmara',
      secondary: 'lochmara-200',
    },
    button: {
      slots: {
        base: ['hover:cursor-pointer'],
      },
    },
    switch: {
      slots: {
        base: ['hover:cursor-pointer'],
      },
    },
  },
});
