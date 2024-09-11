<template>
  <section class="flex items-center">
    <UIcon class="block w-[2.5rem] h-[2.5rem] mx-3 text-(--ui-primary)"
      name="game-icons-tree-beehive" @click="toggleDarkTheme" />
    <UNavigationMenu class="w-auto" :items="links" />
    <div class="flex grow"></div>
    <p>{{ user.signInDetails?.loginId }}</p>
    <UButton class="text-nowrap m-4" @click="signOut()">Sign Out</UButton>
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

const user = await getCurrentUser();

const userPreferredTheme: CookieRef<'light' | 'dark' | 'unset'> = useCookie(
  'userPreferredTheme',
  {
    default: () => 'unset',
    maxAge: 60 * 60 * 24 * 365,
  },
);
const toggleDarkTheme = () => {
  userPreferredTheme.value =
    userPreferredTheme.value === 'dark' ? 'light' : 'dark';
};
</script>
