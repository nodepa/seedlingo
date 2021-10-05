import { createVuetify } from 'vuetify';
import 'vuetify/styles';
import * as components from 'vuetify/components';
import * as directives from 'vuetify/directives';
import { mdi } from 'vuetify/iconsets/mdi-svg';
// import colors from 'vuetify/lib/util/colors'

export default createVuetify({
  components,
  directives,
  icons: {
    sets: {
      mdi,
    },
  },
  theme: {
    themes: {
      light: {
        dark: false,
        colors: {
          background: '#ffffff',
          surface: '#ffffff',
          primary: '#1976d2',
          secondary: '#90caf9',
          success: '#009688',
          warning: '#ff7043',
          error: '#e53935',
          info: '#b2dfdb',
          // background: colors.shades.white,
          // surface: colors.shades.white,
          // primary: colors.blue.darken2,
          // secondary: colors.blue.lighten3,
          // success: colors.teal.base,
          // warning: colors.deepOrange.lighten1,
          // error: colors.red.darken1,
          // info: colors.teal.lighten4,
        },
        // variables: {},
      },
      dark: {
        dark: true,
        colors: {
          background: '#212121',
          surface: '#424242',
          primary: '#1976d2',
          secondary: '#f06292',
          success: '#26a69a',
          warning: '#ff8a65',
          error: '#e57373',
          info: '#b2dfdb',
          // background: colors.grey.darken4,
          // surface: colors.grey.darken3,
          // primary: colors.blue.darken2,
          // secondary: colors.pink.lighten2,
          // success: colors.teal.lighten1,
          // warning: colors.deepOrange.lighten2,
          // error: colors.red.lighten2,
          // info: colors.teal.lighten4,
        },
        // variables: {},
      },
    },
  },
});
