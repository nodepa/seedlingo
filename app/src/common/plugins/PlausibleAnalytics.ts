import Plausible from 'plausible-tracker';
import type { PlausibleOptions, EventOptions } from 'plausible-tracker';
import type { App } from 'vue';
import { inject } from 'vue';
import { isPlatform } from '@ionic/vue';
import { App as CapacitorApp } from '@capacitor/app';

export type IPlausible = typeof Plausible;
export type ReturnUsePlausible = Omit<
  ReturnType<typeof Plausible>,
  'enableAutoPageviews' | 'enableAutoOutboundTracking'
>;

export interface OptionPlugin {
  init: PlausibleOptions;
  settings: InstallOptions;
  partytown?: boolean;
}

export interface InstallOptions {
  enableAutoPageviews?: boolean;
  enableAutoOutboundTracking?: boolean;
}

type TrackPageview = (
  eventData?: PlausibleOptions,
  options?: EventOptions,
) => void;

const enableAutoPageviews = async (
  trackPageview: TrackPageview,
  hashMode: boolean,
) => {
  const props: { AppVersion?: string; MobileApp?: boolean } = {};
  props.MobileApp = isPlatform('capacitor');
  if (props.MobileApp) {
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
    trackPageview(
      {},
      {
        props,
      },
    );

  const originalPushState = history.pushState;
  if (originalPushState) {
    history.pushState = function (data, title, url) {
      originalPushState.apply(this, [data, title, url]);
      pageview();
    };
    addEventListener('popstate', pageview);
  }

  if (hashMode) {
    addEventListener('hashchange', pageview);
  }

  pageview();

  return function cleanup() {
    if (originalPushState) {
      history.pushState = originalPushState;
      removeEventListener('popstate', pageview);
    }
    if (hashMode) {
      removeEventListener('hashchange', pageview);
    }
  };
};

export function createPlausible(options: OptionPlugin) {
  return {
    install(app: App): void {
      const plausible = Plausible(options.init);

      if (options.settings.enableAutoPageviews === true) {
        // plausible.enableAutoPageviews();
        enableAutoPageviews(
          plausible.trackPageview,
          options.init.hashMode || false,
        );
      }

      if (options.settings.enableAutoOutboundTracking === true) {
        plausible.enableAutoOutboundTracking();
      }

      app.config.globalProperties.$plausible = plausible;
      app.provide('$plausible', plausible);
    },
  };
}

export function usePlausible() {
  return inject('$plausible') as ReturnUsePlausible;
}

declare module '@vue/runtime-core' {
  interface ComponentCustomProperties {
    $plausible: ReturnType<typeof Plausible>;
  }
}
