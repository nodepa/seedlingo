import { init, track } from '@plausible-analytics/tracker';

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const { awsBranch, appVersion, awsJobId } = runtimeConfig.public;

  const domain =
    awsBranch === 'main' ? 'apiary.seedlingo.com' : 'test.seedlingo.com';

  const getProps = (): { AppVersion?: string } => {
    if (!appVersion) return {};
    let version = `v${appVersion}`;
    if (awsJobId) version += `_${awsJobId}`;
    if (awsBranch) version += ` (${awsBranch})`;
    return { AppVersion: version };
  };

  init({
    domain,
    captureOnLocalhost: true,
    autoCapturePageviews: false,
    outboundLinks: true,
  });

  const router = useRouter();
  router.afterEach(() => {
    track('pageview', { props: getProps() });
  });

  return {
    provide: {
      plausible: { track },
    },
  };
});
