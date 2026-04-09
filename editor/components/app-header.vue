<template>
  <section class="flex items-center">
    <UIcon
      class="block w-10 h-10 mx-3 text-primary"
      name="game-icons-tree-beehive"
    />
    <UNavigationMenu class="w-auto" :items="links" />
    <div class="flex grow"></div>

    <!-- Theme toggle button -->
    <AppThemeToggle class="mr-1" />

    <!-- User dropdown -->
    <UDropdownMenu :items="userMenuItems" :content="{ align: 'end' }">
      <UButton icon="mdi:account-circle" color="neutral" variant="outline">
        <UIcon name="lucide:chevron-down" />
      </UButton>
    </UDropdownMenu>
  </section>
</template>

<script setup lang="ts">
import { getCurrentUser, signOut } from 'aws-amplify/auth';

const links = [
  {
    label: 'Modules',
    icon: 'lucide:blocks',
    to: '/modules',
  },
  {
    label: 'Units',
    icon: 'lucide:folder-tree',
    to: '/units',
  },
  {
    label: 'Exercises',
    icon: 'lucide:biceps-flexed',
    to: '/exercises',
  },
  {
    label: 'Words',
    icon: 'lucide:whole-word',
    to: '/words',
  },
];

const user = await getCurrentUser().catch(() => ({ signInDetails: null }));

const handleSignOut = async () => {
  await signOut();
  await navigateTo('/login');
};

const userMenuItems = computed(() => [
  [
    {
      label: user.signInDetails?.loginId ?? 'Unknown user',
      icon: 'mdi:account-circle',
      disabled: true,
    },
  ],
  [
    {
      label: 'Sign Out',
      icon: 'lucide:log-out',
      onSelect: handleSignOut,
    },
  ],
]);
</script>
