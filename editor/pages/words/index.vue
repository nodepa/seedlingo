<template>
  <UContainer>
    <UCard :ui="{ body: 'sm:p-0' }">
      <template #header>
        <h1 class="text-2xl text-(--ui-primary)">Words</h1>
      </template>

      <TagManager />

      <!-- Tag filter bar -->
      <div v-if="tagsState.length > 0"
        class="px-4 py-2 flex flex-wrap gap-2 items-center border-b border-(--ui-border)">
        <span class="text-sm text-(--ui-text-muted) shrink-0">Filter by tag:</span>
        <UBadge
          v-for="tag in tagsState" :key="tag.id"
          :color="selectedFilterTags.includes(tag.id) ? 'primary' : 'neutral'"
          :variant="selectedFilterTags.includes(tag.id) ? 'solid' : 'subtle'"
          class="cursor-pointer select-none"
          @click="toggleFilter(tag.id)">
          {{ tag.name }}
        </UBadge>
        <UButton v-if="selectedFilterTags.length > 0"
          icon="lucide:x" color="neutral" variant="ghost" size="xs"
          @click="selectedFilterTags = []">
          Clear
        </UButton>
      </div>

      <UTable :data="filteredWords" :columns="columns"
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
              class="w-full text-start rounded-md -mx-2 *:focus:outline-solid *:focus:outline-(--ui-primary)"
              autoresize :rows="1" :maxrows="3"
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
        <template #tags-cell="{ row }">
          <div class="flex flex-wrap gap-1 min-w-32 py-1">
            <UBadge
              v-for="tag in getWordTags(row.original.id)" :key="tag.id"
              color="primary" variant="subtle"
              class="cursor-pointer gap-0.5 pr-1 select-none"
              @click.stop="removeTagFromWord(row.original.id, tag.id)">
              {{ tag.name }}
              <UIcon name="lucide:x" class="size-3" />
            </UBadge>
            <UPopover
              :open="openTagPopoverWordId === row.original.id"
              @update:open="(v: boolean) => openTagPopoverWordId = v ? row.original.id : null"
              :content="{ align: 'start' }">
              <UTooltip text="Add tag">
                <UButton icon="lucide:tag" color="neutral" variant="ghost" size="xs"
                  :disabled="availableTagsForWord(row.original.id).length === 0" />
              </UTooltip>
              <template #content>
                <div class="p-2 min-w-36 space-y-0.5">
                  <button
                    v-for="tag in availableTagsForWord(row.original.id)" :key="tag.id"
                    class="flex items-center gap-2 w-full px-2 py-1.5 rounded text-sm hover:bg-(--ui-bg-elevated) cursor-pointer text-left"
                    @click="addTagToWord(row.original.id, tag.id)">
                    <UIcon name="lucide:tag" class="size-3.5 text-(--ui-text-muted)" />
                    {{ tag.name }}
                  </button>
                </div>
              </template>
            </UPopover>
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
          <WordForm isAddMode @updateWord="createWord" :available-tags="tagsState" />
        </div>
        <p class="text-center">
          Showing {{ filteredWords.length }}
          <template v-if="selectedFilterTags.length > 0">of {{ wordsState.length }}</template>
          words
        </p>
      </template>
    </UCard>
  </UContainer>
</template>

<script setup lang="ts">
import type { Schema } from '~/amplify/data/resource';
import { generateClient } from 'aws-amplify/data';
import * as v from 'valibot';
import type { TableRow, TableColumn } from '@nuxt/ui';
import type { MediaFile } from '~/types/MediaFile';
import type { DynamicWord, TagSchema, WordTagSchema, WordWritable } from '~/types/WordTypes';

const toast = useToast();

type DynamicWordField = WordWritable;

const WordValidationSchema = v.object({
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
type WordType = v.InferOutput<typeof WordValidationSchema>;

const wordsState = useState<Array<DynamicWord>>('words', () => []);
const tagsState = ref<TagSchema[]>([]);
const wordTagsState = ref<WordTagSchema[]>([]);
const selectedFilterTags = ref<string[]>([]);
const pendingAssignments = ref<string[]>([]);
const pendingRemovals = ref<string[]>([]);
const openTagPopoverWordId = ref<string | null>(null);

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
  { id: 'tags', header: 'Tags' },
  { accessorKey: 'inEditMode', header: 'Edit mode' },
  // { id: 'actions', header: 'Actions' },
];
const columnVisibility = ref({ id: false, description: false, inEditMode: false });
const sorting = ref([{
  id: 'word',
  desc: false,
}]);

const wordTagMap = computed<Map<string, TagSchema[]>>(() => {
  const tagById = new Map(tagsState.value.map((t) => [t.id, t]));
  const map = new Map<string, TagSchema[]>();
  for (const wt of wordTagsState.value) {
    if (!wt.tagId || !wt.wordId) continue;
    const tag = tagById.get(wt.tagId);
    if (!tag) continue;
    const existing = map.get(wt.wordId) ?? [];
    map.set(wt.wordId, [...existing, tag]);
  }
  return map;
});

const filteredWords = computed<DynamicWord[]>(() => {
  if (selectedFilterTags.value.length === 0) return wordsState.value;
  return wordsState.value.filter((word) => {
    const wordTags = wordTagMap.value.get(word.id) ?? [];
    return wordTags.some((t) => selectedFilterTags.value.includes(t.id));
  });
});

const getWordTags = (wordId: string): TagSchema[] => {
  const tags = wordTagMap.value.get(wordId) ?? [];
  return tags.filter((t) => !pendingRemovals.value.includes(`${wordId}:${t.id}`));
};

const availableTagsForWord = (wordId: string): TagSchema[] => {
  const assignedIds = new Set((wordTagMap.value.get(wordId) ?? ([] as TagSchema[])).map((t: TagSchema) => t.id));
  for (const key of pendingAssignments.value) {
    const [pendingWordId, pendingTagId] = key.split(':');
    if (pendingWordId === wordId && pendingTagId) assignedIds.add(pendingTagId);
  }
  return tagsState.value.filter((t: TagSchema) => !assignedIds.has(t.id));
};

const toggleFilter = (tagId: string) => {
  const idx = selectedFilterTags.value.indexOf(tagId);
  if (idx === -1) {
    selectedFilterTags.value = [...selectedFilterTags.value, tagId];
  } else {
    selectedFilterTags.value = selectedFilterTags.value.filter((id) => id !== tagId);
  }
};

const commitCell = (row: TableRow<DynamicWord>, col: DynamicWordField) => {
  const word = wordsState.value[row.index];
  if (!word) return;
  word.waitsOn = { ...word.waitsOn, [col]: true };
  updateData(row.index, col, row.original[col] as string);
}

const updateData = (tableRowIndex: number, fieldName: DynamicWordField, newValue: string) => {
  const word = wordsState.value[tableRowIndex];
  if (!word) return;
  word[fieldName as DynamicWordField] = newValue as never;
  save(word);
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

watchEffect(() => {
  try {
    client.models.Tag.observeQuery().subscribe({
      next: ({ items }) => {
        tagsState.value = items as TagSchema[];
      },
      error: (error) => {
        console.error('Error observing tags:', error);
      },
    });

    client.models.WordTag.observeQuery().subscribe({
      next: ({ items }) => {
        wordTagsState.value = items as WordTagSchema[];
      },
      error: (error) => {
        console.error('Error observing word tags:', error);
      },
    });
  } catch {
    console.warn(
      'Tag/WordTag models unavailable. Redeploy the Amplify backend (`npx ampx sandbox`) to enable tagging.'
    );
  }
});

const addTagToWord = async (wordId: string, tagId: string) => {
  const key = `${wordId}:${tagId}`;
  if (pendingAssignments.value.includes(key)) return;
  pendingAssignments.value = [...pendingAssignments.value, key];
  const { data: newWordTag, errors } = await client.models.WordTag.create({ wordId, tagId });
  pendingAssignments.value = pendingAssignments.value.filter((k) => k !== key);
  if (errors || !newWordTag) {
    console.error(errors);
    toast.add({ title: 'Error', description: 'Failed to add tag to word', color: 'error' });
  } else if (!wordTagsState.value.some((wt) => wt.id === newWordTag.id)) {
    wordTagsState.value = [...wordTagsState.value, newWordTag as WordTagSchema];
    if (openTagPopoverWordId.value === wordId && availableTagsForWord(wordId).length === 0) {
      openTagPopoverWordId.value = null;
    }
  }
};

const removeTagFromWord = async (wordId: string, tagId: string) => {
  const key = `${wordId}:${tagId}`;
  if (pendingRemovals.value.includes(key)) return;
  pendingRemovals.value = [...pendingRemovals.value, key];
  const wordTag = wordTagsState.value.find((wt) => wt.wordId === wordId && wt.tagId === tagId);
  if (!wordTag) {
    pendingRemovals.value = pendingRemovals.value.filter((k) => k !== key);
    return;
  }
  const { errors } = await client.models.WordTag.delete({ id: wordTag.id });
  pendingRemovals.value = pendingRemovals.value.filter((k) => k !== key);
  if (errors) {
    console.error(errors);
    toast.add({ title: 'Error', description: 'Failed to remove tag from word', color: 'error' });
  } else {
    wordTagsState.value = wordTagsState.value.filter((wt) => wt.id !== wordTag.id);
  }
};

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
    } as Schema['Word']['type'];
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

const createWord = async (wordData: DynamicWord & { tagIds?: string[] }) => {
  if (wordData.id) {
    wordsState.value.push(wordData);
  } else {
    const newWord = {
      word: wordData.word,
      description: wordData.description
    };
    const { data: createdWord, errors } = await client.models.Word.create(newWord);
    if (errors || !createdWord) {
      console.error(errors);
      toast.add({ title: 'Error', description: 'Failed to add word', color: 'error' });
      return;
    }
    toast.add({ title: 'Success', description: 'Word added successfully', color: 'success' });
    if (wordData.tagIds?.length) {
      await Promise.all(
        wordData.tagIds!.map((tagId: string) => client.models.WordTag.create({ wordId: createdWord.id, tagId }))
      );
    }
  }
};
</script>
