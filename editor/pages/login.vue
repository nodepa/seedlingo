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
            >Seedlingo</NuxtLink
          >
        </h2>
      </div>
    </template>
    <template #footer>
      <AppThemeToggle
        show-label
        button-variant="outline"
        size="md"
        class="float-right mt-2"
      />
    </template>
  </Authenticator>
</template>

<script setup lang="ts">
import { Authenticator } from '@aws-amplify/ui-vue';
import { Hub } from 'aws-amplify/utils';

definePageMeta({ layout: 'login' });

const route = useRoute();
let unsubscribeHub: (() => void) | undefined;

onMounted(() => {
  unsubscribeHub = Hub.listen('auth', async ({ payload }) => {
    if (payload.event === 'signedIn') {
      const redirect = route.query.redirect as string | undefined;
      await navigateTo(redirect || '/modules');
    }
  });
});

onUnmounted(() => unsubscribeHub?.());
</script>
