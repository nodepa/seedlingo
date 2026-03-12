<template>
  <Authenticator>
    <template #header>
      <div class="text-center">
        <img src="/logo-col.svg" alt="Seedlingo Apiary" />
        <h1 class="-mt-10 text-3xl font-bold">Seedlingo Apiary</h1>
        <h2 class="mb-10 text-lg">
          Content editor for
          <NuxtLink
            to="https://seedlingo.com"
            external
            class="text-lochmara-700 hover:text-lochmara-900"
          >Seedlingo</NuxtLink>
        </h2>
      </div>
    </template>
    <template #footer>
      <UButton
        icon="lucide:sun-moon"
        color="neutral"
        variant="outline"
        size="xs"
        class="float-right mt-2"
        @click="toggleDarkTheme"
      >
        Toggle Dark Mode
      </UButton>
    </template>
  </Authenticator>
</template>

<script setup lang="ts">
import { Authenticator } from '@aws-amplify/ui-vue';
import { Hub } from 'aws-amplify/utils';

definePageMeta({ layout: 'login' });

const userPreferredTheme: CookieRef<'light' | 'dark' | 'unset'> = useCookie(
  'userPreferredTheme',
  { default: () => 'unset', maxAge: 60 * 60 * 24 * 365, sameSite: 'strict' },
);

const toggleDarkTheme = () => {
  userPreferredTheme.value =
    userPreferredTheme.value !== 'dark' ? 'dark' : 'light';
};

let unsubscribeHub: (() => void) | undefined;

onMounted(() => {
  unsubscribeHub = Hub.listen('auth', async ({ payload }) => {
    if (payload.event === 'signedIn') {
      await navigateTo('/');
    }
  });
});

onUnmounted(() => unsubscribeHub?.());
</script>
