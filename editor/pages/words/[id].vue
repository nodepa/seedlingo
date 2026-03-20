<template>
  <UCard>
    <template #header>
      {{ word?.word }}
    </template>
    <p>
      {{ word?.description }}
    </p>
    <template #footer>
      <p>Word id: {{ id }}</p>
      <p>
        Created at:
        {{
          word?.createdAt
            ? new Date(word.createdAt).toLocaleString()
            : 'missing'
        }}
      </p>
      <p>
        Updated at:
        {{
          word?.updatedAt
            ? new Date(word.updatedAt).toLocaleString()
            : 'missing'
        }}
      </p>
    </template>
  </UCard>
</template>
<script setup lang="ts">
import type { Schema } from '~/amplify/data/resource';

const route = useRoute();
const id = route.params.id;
type Word = Schema['Word']['type'];
type DynamicWord = Word & {
  inEditMode?: boolean;
  isWaiting?: boolean;
};

const words = useState<Array<DynamicWord>>('words');
const word = computed(() => words.value.find((word) => word.id === id));
</script>
