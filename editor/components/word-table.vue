<template>
  <div>Its here</div>
  <!-- <UTable :data="wordsState" :columns="columns"
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
        </template> -->


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


  <!-- <template #empty>
          {{ !wordsState ? 'Loading...' : 'No data available' }}
        </template>
      </UTable> -->
</template>

<script setup lang="ts">
import type { TableColumn, TableRow } from '@nuxt/ui';
import type { Schema } from '~/amplify/data/resource';

type WordSchema = Schema['Word']['type'];
type DynamicWord = WordSchema & {
  inEditMode?: boolean;
  waitsOn: { [key: string]: boolean };
  isWaiting?: boolean;
};
type DynamicWordField = Exclude<keyof DynamicWord, 'id' | 'createdAt' | 'updatedAt'>;
const wordsState = useState<Array<DynamicWord>>('words');
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

const commitCell = (row: TableRow<DynamicWord>, col: DynamicWordField) => {
  wordsState.value[row.index].waitsOn = { ...wordsState.value[row.index].waitsOn, [col]: true };
  // updateData(row.index, col, row.original[col] as string);
}


</script>