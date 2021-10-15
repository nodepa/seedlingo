import { createVuetify } from 'vuetify';
import * as components from 'vuetify/lib/components';
import * as directives from 'vuetify/lib/directives';
import { mdi } from 'vuetify/lib/iconsets/mdi-svg';

export default createVuetify({
  components,
  directives,
  icons: { sets: { mdi } },
});
