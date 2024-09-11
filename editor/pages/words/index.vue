<template>
  <UContainer>
    <UCard :ui="{ body: 'sm:p-0' }">
      <template #header>
        <h1 class="text-2xl text-(--ui-primary)">Words</h1>
      </template>

      <UTable :data="wordsState" :columns="columns"
        :column-visibility="columnVisibility" :sorting="sorting"
        :loading="!wordsState || wordsState.length === 0"
        loading-color="primary" loading-animation="carousel" sticky
        class="flex-1">
        <template #word-cell="{ row }">
          <div class="h-28 flex flex-col gap-1 justify-start">
            <UInput type="text" variant="ghost"
              class="w-full min-w-40 -mx-2 !text-lg !font-bold rounded-md *:focus:outline-solid *:focus:outline-(--ui-primary)"
              @blur="() => commitCell(row, 'word')"
              @keydown="($event: KeyboardEvent) => $event.key === 'Enter' && commitCell(row, 'word')"
              :loading="row.original.waitsOn?.word" trailing
              v-model="row.original.word" />
            <UTextarea type="text" variant="ghost"
              class="w-full text-start resize-none rounded-md -mx-2 *:h-19 *:focus:outline-solid *:focus:outline-(--ui-primary) *:resize-none"
              @blur="() => commitCell(row, 'description')"
              @keydown="($event: KeyboardEvent) => $event.ctrlKey && $event.key === 'Enter' && commitCell(row, 'description')"
              :loading="row.original.waitsOn?.description" trailing
              v-model="row.original.description" />
          </div>
        </template>
        <template #picture-cell="{ row }">
          <MediaModal
            :title="row.original.picture ? 'Update picture' : 'Add picture'"
            description="Upload, organize and link media to words."
            mediaType="pictures" v-model:selected="row.original.picture"
            @change="() => commitCell(row, 'picture')">
            <div v-if="row.original.picture" class="relative w-40">
              <NuxtImg
                :src="library.pictures[row.original.picture]?.data || undefined"
                class="w-40 min-w-40 h-28 object-cover rounded-md hover:cursor-pointer" />
              <UButton v-if="row.original.picture" icon="lucide:trash-2"
                color="neutral"
                class="absolute z-12 bottom-0.5 right-0.5 rounded-full opacity-60 hover:bg-(--ui-primary) hover:opacity-100"
                @click.stop="row.original.picture = ''">
              </UButton>
            </div>
            <UButton v-else icon="lucide:plus" color="primary" class="w-40">
              Add
            </UButton>
          </MediaModal>
        </template>
        <template #audio-cell="{ row }">
          <MediaModal :title="row.original.audio ? 'Update audio' : 'Add audio'"
            description="Upload, organize and link media to words."
            mediaType="audio" v-model:selected="row.original.audio"
            @change="() => commitCell(row, 'audio')">
            <div
              v-if="row.original.audio && library.audio[row.original.audio]?.data"
              class="relative w-40 h-28 flex flex-col">
              <UIcon name="lucide:audio-lines" color="primary"
                class="w-40 h-18 text-(--ui-primary) hover:cursor-pointer" />
              <audio controls preload="auto" class="w-40 h-10 inline rounded-md"
                :alt="row.original.audio"
                :src="library.audio[row.original.audio].data">
                Your browser does not support the audio element.
              </audio>
              <UButton icon="lucide:trash-2" color="neutral"
                class="absolute z-12 bottom-10.5 right-0.5 rounded-full opacity-60 hover:bg-(--ui-primary) hover:opacity-100"
                @click.stop="row.original.audio = ''">
              </UButton>
            </div>
            <UButton v-else icon="lucide:plus" color="primary" class="w-40">
              Add
            </UButton>
          </MediaModal>
        </template>
        <template #isPunctuation-cell="{ row }">
          <USwitch v-model="row.original.isPunctuation" color="primary"
            @change="() => commitCell(row, 'isPunctuation')"
            :loading="row.original.waitsOn?.isPunctuation" />
          <div
            :class="{ 'bg-amber-100': !row.original.waitsOn?.isPunctuation }">
            {{ row.original.waitsOn?.isPunctuation }}
          </div>
        </template>
        <!-- <template #actions-cell="{ row }">
          <div class="flex w-full flex-row gap-2">
            <UTooltip text="View details">
              <UButton icon="lucide:eye" color="primary"
                @click="clickToast(row, 'view')">
              </UButton>
            </UTooltip>
            <UTooltip text="Delete word">
              <UButton icon="lucide:trash-2" color="primary"
                @click="clickToast(row, 'delete')">
              </UButton>
            </UTooltip>
            <UTooltip text="Undo changes">
              <UButton icon="lucide:undo" color="primary"
                @click="clickToast(row, 'undo')">
              </UButton>
            </UTooltip>
          </div>
        </template> -->
        <template #empty>
          {{ !wordsState ? 'Loading...' : 'No data available' }}
        </template>
      </UTable>

      <template #footer>
        <div class="my-4 flex justify-center">
          <WordForm isAddMode @updateWord="createWord" />
        </div>
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
import type { MediaFile } from '~/types/MediaFile';

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
const library = useState<{
  pictures: Record<string, MediaFile>,
  audio: Record<string, MediaFile>
}>('library', () => ({
  pictures: {},
  audio: {}
}));

const columns: TableColumn<DynamicWord>[] = [
  { accessorKey: 'id', header: 'ID' },
  { accessorKey: 'word', header: 'Word' },
  { accessorKey: 'description', header: 'Description' },
  { accessorKey: 'picture', header: 'Picture' },
  { accessorKey: 'audio', header: 'Audio' },
  { accessorKey: 'isPunctuation', header: 'Punctuation' },
  { accessorKey: 'inEditMode', header: 'Edit mode' },
  // { id: 'actions', header: 'Actions' },
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

const updateData = (tableRowIndex: number, fieldName: DynamicWordField, newValue: string) => {
  const word = wordsState.value[tableRowIndex];
  word[fieldName as DynamicWordField] = newValue as never;
  save(word)
};

const client = generateClient<Schema>({ authMode: 'userPool' });
watchEffect(() => {
  client.models.Word.observeQuery().subscribe({
    next: ({ items }) => {
      wordsState.value = items as DynamicWord[];
    },
    error: (error) => {
      console.error('Error observing words:', error);
    },
  });
});

const save = async (word: DynamicWord) => {
  word.isWaiting = true;
  if (word.id) {
    const { data: existingWord, errors } = await client.models.Word.get({ id: word.id });
    if (errors || !existingWord) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to get word', color: 'error' });
      word.isWaiting = false;
      word.waitsOn = {};
      return;
    } else {
      // TODO Improve save to S3 to keep local state as 'saving' until commit is confirmed, retry or revert to original otherwise?
      const { data: updatedWord, errors } = await client.models.Word.update({ id: word.id, word: word.word, description: word.description, audio: word.audio, picture: word.picture, isPunctuation: word.isPunctuation });
      word.isWaiting = false;
      word.waitsOn = {};
      if (errors) {
        console.error(errors);
        toast.add({ title: 'Error', description: 'Failed to update word', color: 'error' });
        return;
      } else {
        toast.add({ title: 'Success', description: 'Word updated successfully', color: 'success' });
        word.isWaiting = false;
        word.waitsOn = {};
      }
    }
  } else {
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
      word.waitsOn = {};
    }
  }
};

const createWord = async (wordData: DynamicWord) => {
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
</script>
