<script setup lang="ts">
import { usePageFrontmatter } from '@vuepress/client'
import { computed } from 'vue'
import type { DefaultThemeHomePageFrontmatter } from '@vuepress/theme-default'
const frontmatter = usePageFrontmatter<DefaultThemeHomePageFrontmatter>()
const features = computed(() => frontmatter.value.features ?? [])
</script>

<template>
  <div v-if="features.length" class="vp-features">
    <div v-for="feature in features" :key="feature.title" class="vp-feature">
      <img class="feature-image" :src="feature.imagePath" />
      <h2>{{ feature.title }}</h2>
      <p>{{ feature.details }}</p>
    </div>
  </div>
</template>

<style>
.feature-image {
  max-height: 16rem;
}

.vp-features {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-start;
  place-content: stretch space-between;

  margin-top: 2.5rem;
  padding: 1.2rem 0;
  border-top: 1px solid var(--c-border);

  transition: border-color var(--t-color);

  @media (max-width: $MQMobile) {
    flex-direction: column;
  }
}

.vp-feature {
  flex-grow: 1;
  flex-basis: 30%;
  max-width: 30%;

  text-align: center;

  @media (max-width: $MQMobile) {
    max-width: 100%;
    padding: 0 2.5rem;
  }

  h2 {
    padding-bottom: 0;
    border-bottom: none;

    color: var(--c-text-light);

    font-weight: 500;
    font-size: 1.4rem;

    white-space: preserve;

    @media (max-width: $MQMobileNarrow) {
      font-size: 1.25rem;
    }
  }

  p {
    color: var(--c-text-lighter);
  }
}
</style>
