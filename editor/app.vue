<template>
  <UApp>
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </UApp>
</template>

<script setup lang="ts">
const appConfig = useAppConfig();
const appTitle = appConfig.title as string;
useHeadSafe({
  title: appTitle,
  htmlAttrs: {
    lang: 'en',
  },
});
useSeoMeta({
  title: appTitle,
  ogTitle: appTitle,
  description: 'Content editor for Seedlingo.',
  ogDescription: 'Content editor for Seedlingo.',
});

const { userPreferredTheme, browserPreferredTheme } = useTheme();

// Populate browserPreferredTheme from the OS on mount and keep it in sync.
// This is the only place the matchMedia listener is registered.
onMounted(() => {
  const mq = window.matchMedia('(prefers-color-scheme: dark)');
  mq.addEventListener('change', (e) => {
    browserPreferredTheme.value = e.matches ? 'dark' : 'light';
  });
  browserPreferredTheme.value = mq.matches ? 'dark' : 'light';
});

// Apply .dark to <html> whenever the OS preference changes
watch(browserPreferredTheme, (browser) => {
  document.documentElement.classList.toggle(
    'dark',
    userPreferredTheme.value === 'unset'
      ? browser === 'dark'
      : userPreferredTheme.value === 'dark',
  );
});

// Apply .dark to <html> whenever the user preference changes
watch(userPreferredTheme, (user) => {
  document.documentElement.classList.toggle(
    'dark',
    user === 'unset' ? browserPreferredTheme.value === 'dark' : user === 'dark',
  );
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
