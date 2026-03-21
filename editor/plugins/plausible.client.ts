import Plausible from 'plausible-tracker';

export default defineNuxtPlugin(() => {
  const runtimeConfig = useRuntimeConfig();
  const { awsBranch, appVersion, awsJobId } = runtimeConfig.public;

  const domain =
    awsBranch === 'main' ? 'apiary.seedlingo.app' : 'test-apiary.seedlingo.app';

  const plausible = Plausible({
    domain,
    trackLocalhost: true,
  });

  const getProps = (): { AppVersion?: string } => {
    if (!appVersion) return {};
    let version = `v${appVersion}`;
    if (awsJobId) version += `_${awsJobId}`;
    if (awsBranch) version += ` (${awsBranch})`;
    return { AppVersion: version };
  };

  const router = useRouter();
  router.afterEach(() => {
    plausible.trackPageview({}, { props: getProps() });
  });

  plausible.enableAutoOutboundTracking();

  return {
    provide: {
      plausible,
    },
  };
});
