import { init, track } from '@plausible-analytics/tracker';
import type { PlausibleConfig } from '@plausible-analytics/tracker';
import type { App } from 'vue';
import { inject } from 'vue';
import { isPlatform } from '@ionic/vue';
import { App as CapacitorApp } from '@capacitor/app';

export type ReturnUsePlausible = { track: typeof track };

export interface OptionPlugin {
  init: PlausibleConfig;
  settings: InstallOptions;
  partytown?: boolean;
}

export interface InstallOptions {
  enableAutoPageviews?: boolean;
}

const enableAutoPageviews = async (hashBasedRouting: boolean) => {
  const props: { AppVersion?: string; MobileApp?: string } = {};
  props.MobileApp = isPlatform('capacitor') ? 'true' : 'false';
  if (props.MobileApp === 'true') {
    const appInfo = await CapacitorApp.getInfo();
    if (appInfo) {
      props.AppVersion = `v${appInfo.version}_${appInfo.build}`;
    }
  } else if (__APP_VERSION__) {
    props.AppVersion = `v${__APP_VERSION__}`;
    if (__AWS_JOB_ID__) {
      props.AppVersion += `_${__AWS_JOB_ID__}`;
    }
    if (__AWS_BRANCH__) {
      props.AppVersion += ` (${__AWS_BRANCH__})`;
    }
  }
  const pageview = () =>
    track('pageview', {
      props,
    });

  const originalPushState = history.pushState;
  if (originalPushState) {
    history.pushState = function (data, title, url) {
      originalPushState.apply(this, [data, title, url]);
      pageview();
    };
    addEventListener('popstate', pageview);
  }

  if (hashBasedRouting) {
    addEventListener('hashchange', pageview);
  }

  pageview();

  return function cleanup() {
    if (originalPushState) {
      history.pushState = originalPushState;
      removeEventListener('popstate', pageview);
    }
    if (hashBasedRouting) {
      removeEventListener('hashchange', pageview);
    }
  };
};

export function createPlausible(options: OptionPlugin) {
  return {
    install(app: App): void {
      init(options.init);

      if (options.settings.enableAutoPageviews === true) {
        enableAutoPageviews(options.init.hashBasedRouting || false);
      }

      app.config.globalProperties.$plausible = { track };
      app.provide('$plausible', { track });
    },
  };
}

export function usePlausible() {
  return inject('$plausible') as ReturnUsePlausible;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $plausible: { track: typeof track };
  }
}
