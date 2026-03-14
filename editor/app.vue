<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
useHeadSafe({
  title: appConfig.title,
  htmlAttrs: {
    lang: 'en',
  },
});
useSeoMeta({
  title: appConfig.title,
  ogTitle: appConfig.title,
  description: 'Content editor for Seedlingo.',
  ogDescription: 'Content editor for Seedlingo.',
});

// initial saved user preference
const userPreferredTheme = useCookie<'light' | 'dark' | 'unset'>(
  'userPreferredTheme',
  {
    default: () => 'unset',
    maxAge: 60 * 60 * 24 * 365,
    sameSite: 'strict',
  },
);
// initial virtual state
const browserPreferredTheme: Ref<'light' | 'dark' | 'unset'> = useState(
  'browserPreferredTheme',
  () => 'unset',
);
// update virtual state on os/browser state change
onMounted(() => {
  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      browserPreferredTheme.value = e.matches ? 'dark' : 'light';
    });
  browserPreferredTheme.value = window.matchMedia(
    '(prefers-color-scheme: dark)',
  ).matches
    ? 'dark'
    : 'light';
});
// effectuate os/browser state change in DOM
watch(browserPreferredTheme, (browserPreferredTheme) => {
  if (userPreferredTheme.value === 'unset') {
    document.documentElement.classList.toggle(
      'dark',
      browserPreferredTheme === 'dark',
    );
  } else {
    document.documentElement.classList.toggle(
      'dark',
      userPreferredTheme.value === 'dark',
    );
  }
});
// effectuate user preference change in DOM
watch(userPreferredTheme, (userPreferredTheme) => {
  if (userPreferredTheme === 'unset') {
    document.documentElement.classList.toggle(
      'dark',
      browserPreferredTheme.value === 'dark',
    );
  } else {
    document.documentElement.classList.toggle(
      'dark',
      userPreferredTheme === 'dark',
    );
  }
});
</script>
<style>
@import '@aws-amplify/ui-vue/styles.css';
@import '~/assets/css/main.css';

[data-amplify-authenticator] {
  [data-amplify-router] {
    border-radius: var(--amplify-radii-medium);
    overflow: hidden;
  }

  .amplify-tab {
    background-color: none;
  }

  /* Fix for styling error in @aws-amplify/ui-vue/styles.css 2024/10/23 */
  .amplify-field-group:first-of-type .amplify-input {
    border-start-start-radius: var(--amplify-radii-small);
    border-end-start-radius: var(--amplify-radii-small);
  }

  /* Fix for styling error using inline styles in
   * https://github.com/aws-amplify/amplify-ui/blob/main/packages/vue/src/components/sign-up.vue
   * 2024/10/23 */
  #signUp-panel .amplify-button {
    border-radius: var(--amplify-radii-small) !important;
    font-weight: bold !important;
  }
}
</style>
