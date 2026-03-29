<template>
  <main class="min-h-screen flex items-center justify-center">
    <slot />
  </main>
</template>

<style>
/*
 * Amplify UI component theme overrides.
 * Scoped to the login layout so these variables don't pollute the global
 * stylesheet — Amplify components only appear on the /login page.
 */
:root.dark {
  --amplify-colors-black: #fff;
  --amplify-colors-white: #111;
  --amplify-colors-neutral-40: var(--ui-color-neutral-400);
  --amplify-colors-neutral-90: var(--ui-color-neutral-300);
  --amplify-colors-neutral-100: var(--ui-color-neutral-100);
  --amplify-colors-primary-10: var(--ui-color-primary-950);
  --amplify-colors-primary-20: var(--ui-color-primary-900);
  --amplify-colors-primary-30: var(--ui-color-primary-800);
  --amplify-colors-primary-40: var(--ui-color-primary-700);
  --amplify-colors-primary-50: var(--ui-color-primary-600);
  --amplify-colors-primary-60: var(--ui-color-primary-500);
  --amplify-colors-primary-70: var(--ui-color-primary-400);
  --amplify-colors-primary-80: var(--ui-color-primary-300);
  --amplify-colors-primary-90: var(--ui-color-primary-200);
  --amplify-colors-primary-100: var(--ui-color-primary-100);
}

:root {
  --amplify-colors-primary-10: var(--ui-color-primary-100);
  --amplify-colors-primary-20: var(--ui-color-primary-200);
  --amplify-colors-primary-30: var(--ui-color-primary-300);
  --amplify-colors-primary-40: var(--ui-color-primary-400);
  --amplify-colors-primary-50: var(--ui-color-primary-500);
  --amplify-colors-primary-60: var(--ui-color-primary-600);
  --amplify-colors-primary-70: var(--ui-color-primary-700);
  --amplify-colors-primary-80: var(--ui-color-primary-800);
  --amplify-colors-primary-90: var(--ui-color-primary-900);
  --amplify-colors-primary-100: var(--ui-color-primary-950);
}
</style>
