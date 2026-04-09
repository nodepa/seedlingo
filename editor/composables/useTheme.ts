/**
 * Shared theme composable.
 *
 * State is held in two Nuxt shared references that are keyed by name, so any
 * component calling useTheme() accesses the same reactive values:
 *   - userPreferredTheme  (persisted cookie)  'light' | 'dark' | 'unset'
 *   - browserPreferredTheme (Nuxt useState)   'light' | 'dark' | 'unset'
 *
 * The DOM watcher that applies the `.dark` class to <html> lives in app.vue
 * and continues to be the single place where the DOM is mutated.
 */
export function useTheme() {
  const userPreferredTheme = useCookie<'light' | 'dark' | 'unset'>(
    'userPreferredTheme',
    {
      default: () => 'unset' as const,
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'strict',
    },
  );

  const browserPreferredTheme = useState<'light' | 'dark' | 'unset'>(
    'browserPreferredTheme',
    () => 'unset',
  );

  /** True when the user has not overridden the system preference. */
  const isSystemTheme = computed(() => userPreferredTheme.value === 'unset');

  /** The theme that is actually visible right now. */
  const effectiveTheme = computed<'light' | 'dark'>(() => {
    if (userPreferredTheme.value !== 'unset') return userPreferredTheme.value;
    return browserPreferredTheme.value === 'dark' ? 'dark' : 'light';
  });

  /**
   * Icon name reflecting the current state:
   *   mdi:theme-light-dark – following system
   *   mdi:weather-sunny    – pinned to light
   *   mdi:weather-night    – pinned to dark
   */
  const themeIcon = computed(() => {
    if (isSystemTheme.value) return 'mdi:theme-light-dark';
    return effectiveTheme.value === 'dark'
      ? 'mdi:weather-night'
      : 'mdi:weather-sunny';
  });

  const themeTooltip = computed(() => {
    if (isSystemTheme.value)
      return `System theme (currently ${effectiveTheme.value}) — click to override`;
    return effectiveTheme.value === 'dark'
      ? 'Dark theme — click to restore system theme'
      : 'Light theme — click to restore system theme';
  });

  /**
   * Toggle behaviour:
   *   - Following system → pin to the *opposite* of the current system colour.
   *   - Pinned           → revert to system (clear the override).
   */
  const toggleTheme = () => {
    if (userPreferredTheme.value === 'unset') {
      userPreferredTheme.value =
        browserPreferredTheme.value === 'dark' ? 'light' : 'dark';
    } else {
      userPreferredTheme.value = 'unset';
    }
  };

  return {
    userPreferredTheme,
    browserPreferredTheme,
    isSystemTheme,
    effectiveTheme,
    themeIcon,
    themeTooltip,
    toggleTheme,
  };
}
