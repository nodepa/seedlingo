// import '@mdi/font/css/materialdesignicons.css';
import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import { UserVuetifyPreset } from 'vuetify';
import InstructionsIcon from '@/components/icons/InstructionsIcon.vue';
import InstructionsCloseIcon from '@/components/icons/InstructionsCloseIcon.vue';

Vue.use(Vuetify);

const options: UserVuetifyPreset = {
  icons: {
    iconfont: 'mdiSvg',
    values: {
      instructions: {
        component: InstructionsIcon,
      },
      instructionsClose: {
        component: InstructionsCloseIcon,
      },
    },
  },
  theme: {
    options: {
      customProperties: true,
    },
  },
};

export default new Vuetify(options);
