<template>
  <UModal title='Add new word' description="Describe the word"
    v-model:open="showWordForm">
    <UButton :icon="isAddMode ? 'lucide:plus' : 'lucide:edit'"
      :color="isAddMode ? 'primary' : 'neutral'" class="self-center">
      {{ isAddMode ? 'Add new word' : 'Edit' }}
    </UButton>
    <template #body>
      <!-- <UForm :schema="wordSchema" :state="state" @submit="emitUpdateWord"> -->
      <UForm :schema="vWordSchema" :state="state" @submit="emitUpdateWord">
        <UFormField label="Word" required name="word" hint="required">
          <UInput v-model="state.word" />
        </UFormField>
        <UFormField label="Description" name="description" hint="optional">
          <UTextarea v-model="state.description" :autoresize="true" :maxrows="8"
            class="mb-4 w-full" />
        </UFormField>
        <UFormField label="Audio" name="audio" hint="optional">
          <UInput v-model="state.audio" />
        </UFormField>
        <UFormField label="Picture" name="picture" hint="optional">
          <UInput v-model="state.picture" />
        </UFormField>
        <!-- <UFormField label="Symbol(s)" name="symbol" hint="optional">
          <UInput v-model="state.symbol" />
        </UFormField> -->
        <UFormField label="Is this a punctuation symbol?" name="isPunctuation"
          hint="optional">
          <USwitch v-model="state.isPunctuation" color="primary" size="md"
            class="h-14" />
        </UFormField>
        <div class="flex justify-end space-x-2">
          <UButton type="submit"
            :icon="isAddMode ? 'lucide:plus' : 'lucide:save'">
            {{ isAddMode ? 'Add word' : 'Update' }}
          </UButton>
          <UButton icon="lucide:rotate-ccw" color="neutral"
            @click="showWordForm = false">
            Cancel
          </UButton>
        </div>
      </UForm>
    </template>
  </UModal>
</template>
<script setup lang="ts">
import * as v from 'valibot';
import type { FormSubmitEvent } from '@nuxt/ui';

const props = withDefaults(defineProps<{
  isAddMode?: boolean;
  wordData?: { id: string, word?: string, description?: string, audio?: string, picture?: string, symbol?: Array<string>, isPunctuation?: boolean };
}>(), {
  isAddMode: false,
  wordData: () => ({ id: '', word: '', description: '', audio: '', picture: '', symbol: [''], isPunctuation: false })
});

// const showWordForm = defineModel('showWordForm', { default: false });
const showWordForm = ref(false);
const emit = defineEmits(['updateWord']);


const vWordSchema = v.object({
  id: v.string(),
  word: v.pipe(v.string(), v.nonEmpty("Please enter a word")),
  description: v.optional(v.string()),
  audio: v.string(),
  picture: v.string(),
  symbol: v.array(v.string()),
  isPunctuation: v.boolean(),
});
type VWordSchema = v.InferOutput<typeof vWordSchema>;

const state = reactive<Partial<VWordSchema>>(props.wordData);

const emitUpdateWord = async (event: FormSubmitEvent<VWordSchema>) => {
  emit('updateWord', event.data);
  showWordForm.value = false;
};

</script>