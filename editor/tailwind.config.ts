import type { Config } from 'tailwindcss';

export default <Partial<Config>>{
  darkMode: 'selector',
  theme: {
    extend: {
      colors: {
        lochmara: {
          '50': '#effaff',
          '100': '#daf3ff',
          '200': '#beebff',
          '300': '#91dfff',
          '400': '#5ecbfc',
          '500': '#38aff9',
          '600': '#2293ee',
          '700': '#1976d2',
          '800': '#1c63b1',
          '900': '#1c548c',
          '950': '#163355',
        },
      },
    },
  },
};
