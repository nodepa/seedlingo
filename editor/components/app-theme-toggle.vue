<template>
  <UTooltip :text="themeTooltip">
    <UButton
      :icon="themeIcon"
      color="neutral"
      :variant="buttonVariant"
      :size="size"
      aria-label="Toggle theme"
      @click="toggleTheme"
    >
      <template v-if="showLabel">{{ themeLabel }}</template>
    </UButton>
  </UTooltip>
</template>

<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Show a text label beside the icon (login page style). */
    showLabel?: boolean;
    buttonVariant?: 'ghost' | 'outline' | 'soft' | 'subtle' | 'link';
    size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  }>(),
  {
    showLabel: false,
    buttonVariant: 'ghost',
    size: 'md',
  },
);

const { isSystemTheme, effectiveTheme, themeIcon, themeTooltip, toggleTheme } =
  useTheme();

const themeLabel = computed(() => {
  if (isSystemTheme.value) return `System (${effectiveTheme.value})`;
  return effectiveTheme.value === 'dark' ? 'Dark' : 'Light';
});
</script>
