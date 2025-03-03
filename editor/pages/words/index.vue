<template>
  <UContainer>
    <UCard :ui="{ body: 'sm:p-0' }">
      <template #header>
        <h1 class="text-2xl text-[var(--ui-primary)]">Words</h1>
      </template>

      <!-- Add View and Edit buttons? -->
      <!-- When in Edit-mode, add Save, Cancel and Delete -->
      <UTable :data="wordsState" :columns="columns"
        :column-visibility="columnVisibility" :sorting="sorting"
        :loading="!wordsState || wordsState.length === 0"
        loading-color="primary" loading-animation="carousel" sticky
        class="flex-1">
        <template #word-cell="{ row }" class="w-10">
          <UInput type="text"
            class="w-full px-2 py-1 -mx-2 my-0 !text-lg !font-bold rounded-md"
            @blur="($event) => commitCell(row, 'word', $event)"
            @keydown="($event) => $event.key === 'Enter' && commitCell(row, 'word', $event)"
            :loading="row.original.waitsOn?.word" v-model="row.original.word" />
          <br />
          <textarea type="text"
            class="px-2 py-1 -mx-2 my-0 w-full h-13 text-start resize-none rounded-md"
            @blur="(event) => commitCell(row, 'description', event)"
            @keydown="($event) => $event.ctrlKey && $event.key === 'Enter' && commitCell(row, 'description', $event)"
            :loading="row.original.waitsOn?.description"
            v-model="row.original.description" />
        </template>
        <template #picture-cell="{ row }">
          <template v-if="row.original.picture">
            <NuxtImg :src="row.original.picture"
              class="w-40 h-28 object-cover rounded-md"
              @click="
                toast.add({ title: 'Open modal', description: 'Open picture selection & upload modal', color: 'warning' })" />
          </template>
          <template v-else>
            <MediaModal title="Add picture"
              description="Upload, organize and link media to words.">
              <UButton icon="lucide:plus"
                @click="
                  toast.add({ title: 'Open modal', description: 'Open picture selection & upload modal', color: 'warning' })"
                color="primary" class="w-40">
                Add
              </UButton>
            </MediaModal>
          </template>
        </template>
        <template #audio-cell="{ row }">
          <div class="flex flex-col gap-2">
            <template v-if="row.original.audio">
              <audio controls preload="auto" class="w-48 h-8 inline rounded-md">
                <source :src="row.original.audio" type="audio/mpeg" />
                Your browser does not support the audio element.
              </audio>
              <UButton icon="lucide:edit"
                @click="toast.add({ title: 'Open modal', description: 'Open audio selection & upload modal', color: 'warning' })"
                color="primary" class="w-48">Edit</UButton>
            </template>
            <template v-else>
              <UButton icon="lucide:plus"
                @click="toast.add({ title: 'Open modal', description: 'Open audio selection & upload modal', color: 'warning' })"
                color="primary" class="w-48">Add</UButton>
            </template>
          </div>
        </template>
        <template #isPunctuation-cell="{ row }">
          <USwitch v-model="row.original.isPunctuation" color="primary"
            @change="($event) => commitCell(row, 'isPunctuation', $event)"
            :loading="row.original.waitsOn?.isPunctuation" />
          <div
            :class="{ 'bg-amber-100': !row.original.waitsOn?.isPunctuation }">
            {{ row.original.waitsOn?.isPunctuation }}
          </div>
        </template>
        <template #actions-cell="{ row }">
          <div class="flex w-full flex-row gap-2">
            <UTooltip text="View details">
              <UButton icon="lucide:eye" color="primary"
                @click="viewClick(row)">
                <!-- View -->
              </UButton>
            </UTooltip>
            <UTooltip text="Delete word">
              <UButton icon="lucide:delete" color="primary"
                @click="viewClick(row)">
                <!-- Delete -->
              </UButton>
            </UTooltip>
            <UTooltip text="Undo changes">
              <UButton icon="lucide:undo" color="primary"
                @click="viewClick(row)">
                <!-- Undo -->
              </UButton>
            </UTooltip>
          </div>
        </template>
        <template #empty>
          {{ !wordsState ? 'Loading...' : 'No data available' }}
        </template>
      </UTable>

      <template #footer>
        <div class="my-4 flex justify-center">
          <WordForm isAddMode @updateWord="createWord" />
        </div>
        <input value="test" class="p-2 field-sizing-content bg-amber-100" />
        <p class="text-center">Currently showing {{ wordsState.length }}
          words</p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { Schema } from '~/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import * as v from 'valibot';
import type { TableColumn } from '@nuxt/ui';
import { type Row } from '@tanstack/vue-table';

const toast = useToast();

type Word = Schema['Word']['type'];
type DynamicWord = Word & {
  inEditMode?: boolean;
  waitsOn: { [key: string]: boolean };
  isWaiting?: boolean;
};
type DynamicWordField = Exclude<keyof DynamicWord, 'id' | 'createdAt' | 'updatedAt'>;

const WordSchema = v.object({
  id: v.optional(v.string()),
  word: v.pipe(
    v.string(),
    v.nonEmpty('Please enter a word'),
  ),
  description: v.optional(v.string()),
  audio: v.optional(v.string()),
  picture: v.optional(v.string()),
  // symbol: v.array(v.string()).optional().transform((val) => val === null ? undefined : val),
  isPunctuation: v.optional(v.boolean()),
});
type WordType = v.InferOutput<typeof WordSchema>;

const wordsState = useState<Array<DynamicWord>>('words', () => []);

const columns: TableColumn<DynamicWord>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'word', header: 'Word' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'picture', header: 'Picture' },
  { accessorKey: 'audio', header: 'Audio' },
  { accessorKey: 'isPunctuation', header: 'Punctuation' },
  { accessorKey: 'inEditMode', header: 'Edit mode' },
  { id: 'actions', header: 'Actions' },
];
const columnVisibility = ref({ id: false, description: false, inEditMode: false });
const sorting = ref([{
  id: 'word',
  desc: false,
}])

const commitCell = (row: Row<DynamicWord>, col: DynamicWordField) => {
  wordsState.value[row.index].waitsOn = { ...wordsState.value[row.index].waitsOn, [col]: true };
  updateData(row.index, col, row.original[col] as string);
}

const viewClick = (row) => {
  console.log('id', row.getValue('id'));
  const w = wordsState.value[+row.index];
  if (w) {
    w.inEditMode = true;
  }
  toast.add({ title: 'Open modal', description: 'View details about word in modal', color: 'warning' });
  setTimeout(() => {
    console.log('w.inEd', w?.inEditMode);
    console.log('row.inEd', row.getValue('inEditMode'));
  }, 1000);
}

const updateData = (tableRowIndex: number, fieldName: DynamicWordField, newValue: string) => {
  const word = wordsState.value[tableRowIndex];
  word[fieldName as DynamicWordField] = newValue as never;
  save(word)
};

const client = generateClient<Schema>({ authMode: 'userPool' });
watchEffect(() => {
  client.models.Word.observeQuery().subscribe({
    next: ({ items, isSynced }) => {
      console.log('Updated words received from server');
      wordsState.value = items;
    },
    error: (error) => {
      console.error('Error observing words:', error);
    },
  });
});
watch(() => wordsState.value, (updatedWords, oldWords) => {
  console.log('List of words changed into:\n', JSON.stringify(updatedWords), '\nfrom:\n', JSON.stringify(oldWords));
});

const save = async (word: DynamicWord) => {
  console.log('save > word:', word);
  word.isWaiting = true;
  if (word.id) {
    console.log('updating');
    const { data: existingWord, errors } = await client.models.Word.get({ id: word.id });
    if (errors || !existingWord) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to get word', color: 'error' });
      word.isWaiting = false;
      return;
    } else {
      const { data: updatedWord, errors } = await client.models.Word.update({ id: word.id, word: word.word, description: word.description, audio: word.audio, picture: word.picture, isPunctuation: word.isPunctuation });
      word.isWaiting = false;
      if (errors) {
        console.error(errors);
        toast.add({ title: 'Error', description: 'Failed to update word', color: 'error' });
        return;
      } else {
        toast.add({ title: 'Success', description: 'Word updated successfully', color: 'success' });
      }
    }
  } else {
    console.log('creating');
    const newWord = {
      word: word.word,
      description: word.description,
    } as Word;
    if (word.audio) {
      newWord.audio = word.audio;
    }
    if (word.picture) {
      newWord.picture = word.picture;
    }
    if ('isPunctuation' in word) {
      newWord.isPunctuation = word.isPunctuation;
    }
    const { data: updatedWord, errors } = await client.models.Word.create(newWord);
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to add word', color: 'error' });
      return;
    } else {
      toast.add({ title: 'Success', description: 'Word added successfully', color: 'success' });
      word.isWaiting = false;
    }
  }
};

const cancelEditing = async (word: DynamicWord) => {
  word.isWaiting = true;
  if (word.id) {
    const { data: existingWord, errors } = await client.models.Word.get({ id: word.id });

    if (existingWord) {
      word.word = existingWord.word as string;
      word.description = existingWord.description as string;
      word.audio = existingWord.audio as string;
      word.picture = existingWord.picture as string;
      // word.symbol = existingWord.symbol as Array<string>;
      word.isPunctuation = existingWord.isPunctuation as boolean;
    }
  }
  word.inEditMode = false;
  word.isWaiting = false;
};

const deleteWord = async (word: DynamicWord) => {
  word.isWaiting = true;
  if (word.id) {
    const { errors } = await client.models.Word.delete({ id: word.id });
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to delete word', color: 'error' });
    } else {
      toast.add({ title: 'Success', description: 'Word deleted successfully', color: 'success' });
    }
  }
};

const createWord = async (wordData: DynamicWord) => {
  console.log('createWord > wordData:', wordData);
  if (wordData.id) {
    wordsState.value.push(wordData);
  } else {
    const newWord = {
      word: wordData.word,
      description: wordData.description
    };
    const { data: updatedWord, errors } = await client.models.Word.create(newWord);
    if (errors) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to add word', color: 'error' });
      return;
    } else {
      toast.add({ title: 'Success', description: 'Word added successfully', color: 'success' });
    }
  }
};

// let createSub: Subscription, updateSub: Subscription, deleteSub: Subscription;
// onBeforeMount(() => {
//   createSub = client.models.Word.onCreate().subscribe({
//     next: (data) => console.log('db-reports-created:', data),
//     error: (error) => console.warn(error),
//   });
//   updateSub = client.models.Word.onUpdate().subscribe({
//     next: (data) => console.log('db-reports-updated:', data),
//     error: (error) => console.warn(error),
//   });
//   deleteSub = client.models.Word.onDelete().subscribe({
//     next: (data) => console.log('db-reports-deleted:', data),
//     error: (error) => console.warn(error),
//   });
// })

// onBeforeUnmount(() => {
//   createSub.unsubscribe();
//   updateSub.unsubscribe();
//   deleteSub.unsubscribe();
// });
</script>
