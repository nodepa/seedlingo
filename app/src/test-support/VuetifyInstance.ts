// Workaround for missing global.CSS in Vuetify 3.0.0-alpha.12 as introduced by
// https://github.com/vuetifyjs/vuetify/commit/a582eea2df1e5747096c98d58b8b19a930f221f2
// eslint-disable-next-line @typescript-eslint/no-explicit-any
(global as any).CSS = { supports: () => false };
import { createVuetify } from 'vuetify';
import * as components from 'vuetify/lib/components';
import * as directives from 'vuetify/lib/directives';
import { mdi } from 'vuetify/lib/iconsets/mdi-svg';

export default createVuetify({
  components,
  directives,
  icons: { sets: { mdi } },
});
