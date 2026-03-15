<template>
  <UContainer>
    <UCard>
      <template #header>
        <div class="flex items-center gap-4">
          <UButton
            icon="lucide:arrow-left"
            color="neutral"
            variant="ghost"
            to="/units"
          />
          <UInput
            v-if="unit != undefined"
            v-model="unit.name"
            type="text"
            variant="ghost"
            class="-mx-2 rounded-md *:focus:outline-solid *:focus:outline-primary"
            :loading="unit.waitsOn?.name"
            trailing
            @blur="() => commit('name')"
            @keydown="
              ($event: KeyboardEvent) =>
                $event.key === 'Enter' && commit('name')
            "
          />
        </div>
      </template>

      <div v-if="unit" class="flex flex-col gap-6">
        <div class="flex gap-6 flex-wrap">
          <UIcon
            :name="unit.icon || 'noto-unknown-flag'"
            class="p-0 m-0 w-32 h-32 block"
          />
          <div class="flex-1 min-w-xs">
            <UTextarea
              v-model="unit.description"
              type="text"
              variant="ghost"
              class="w-full text-start rounded-md -mx-2 *:focus:outline-solid *:focus:outline-primary"
              autoresize
              :rows="1"
              :maxrows="8"
              :loading="unit.waitsOn?.description"
              trailing
              placeholder="Unit description (optional)"
              @blur="() => commit('description')"
              @keydown="
                ($event: KeyboardEvent) =>
                  $event.ctrlKey &&
                  $event.key === 'Enter' &&
                  commit('description')
              "
            />
          </div>
        </div>

        <UDivider />

        <div>
          <div class="flex items-center justify-between mb-4">
            <h2 class="text-xl font-semibold text-primary">
              Words in this unit
            </h2>
            <div class="flex gap-2">
              <UButton
                icon="lucide:link"
                color="neutral"
                size="sm"
                @click="showAssignModal = true"
              >
                Assign existing word
              </UButton>
              <UButton
                icon="lucide:plus"
                color="primary"
                size="sm"
                @click="showAddWordModal = true"
              >
                Add new word
              </UButton>
            </div>
          </div>

          <UTable
            v-if="unitWords.length > 0"
            :data="unitWords"
            :columns="wordColumns"
            :sorting="wordSorting"
          >
            <template #word-cell="{ row }">
              <span class="font-bold text-lg">{{ row.original.word }}</span>
              <p v-if="row.original.description" class="text-sm text-gray-500">
                {{ row.original.description }}
              </p>
            </template>
            <template #actions-cell="{ row }">
              <UButton
                icon="lucide:unlink"
                color="warning"
                variant="ghost"
                size="sm"
                :loading="row.original.isWaiting"
                @click="removeWordFromUnit(row.original)"
              >
                Remove
              </UButton>
            </template>
          </UTable>
          <p v-else class="text-gray-500 text-sm">
            No words assigned to this unit yet. Add or assign words above.
          </p>
        </div>
      </div>

      <template #footer>
        <p class="text-sm text-gray-500">Unit id: {{ id }}</p>
        <p class="text-sm text-gray-500">
          Created at:
          {{
            unit?.createdAt
              ? new Date(unit.createdAt).toLocaleString()
              : 'missing'
          }}
        </p>
        <p class="text-sm text-gray-500">
          Updated at:
          {{
            unit?.updatedAt
              ? new Date(unit.updatedAt).toLocaleString()
              : 'missing'
          }}
        </p>
      </template>
    </UCard>

    <!-- Add new word modal -->
    <UModal
      v-model:open="showAddWordModal"
      title="Add new word to unit"
      description="Create a new word and assign it to this unit"
    >
      <template #body>
        <UForm
          :schema="WordValidationSchema"
          :state="newWordState"
          @submit="addNewWord"
        >
          <UFormField label="Word" required name="word" hint="required">
            <UInput v-model="newWordState.word" />
          </UFormField>
          <UFormField label="Description" name="description" hint="optional">
            <UTextarea
              v-model="newWordState.description"
              :autoresize="true"
              :maxrows="8"
              class="mb-4 w-full"
            />
          </UFormField>
          <UFormField
            label="Is punctuation?"
            name="isPunctuation"
            hint="optional"
          >
            <USwitch
              v-model="newWordState.isPunctuation"
              color="primary"
              size="md"
              class="h-14"
            />
          </UFormField>
          <div class="flex justify-end space-x-2">
            <UButton
              type="submit"
              icon="lucide:plus"
              color="primary"
              :loading="isAddingWord"
            >
              Add word
            </UButton>
            <UButton
              icon="lucide:rotate-ccw"
              color="neutral"
              @click="showAddWordModal = false"
            >
              Cancel
            </UButton>
          </div>
        </UForm>
      </template>
    </UModal>

    <!-- Assign existing word modal -->
    <UModal
      v-model:open="showAssignModal"
      title="Assign word to unit"
      description="Select an existing word to assign to this unit"
    >
      <template #body>
        <div class="flex flex-col gap-4">
          <UInput
            v-model="wordSearch"
            placeholder="Search words..."
            icon="lucide:search"
          />
          <div class="max-h-96 overflow-y-auto">
            <ul class="flex flex-col gap-2">
              <li
                v-for="word in filteredUnassignedWords"
                :key="word.id"
                class="flex items-center justify-between p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <div>
                  <span class="font-bold">{{ word.word }}</span>
                  <p v-if="word.description" class="text-sm text-gray-500">
                    {{ word.description }}
                  </p>
                </div>
                <UButton
                  icon="lucide:link"
                  color="primary"
                  size="sm"
                  :loading="word.isWaiting"
                  @click="assignWordToUnit(word)"
                >
                  Assign
                </UButton>
              </li>
              <li
                v-if="filteredUnassignedWords.length === 0"
                class="text-gray-500 text-sm"
              >
                No unassigned words found.
              </li>
            </ul>
          </div>
        </div>
      </template>
    </UModal>
  </UContainer>
</template>
<script setup lang="ts">
import { generateClient } from 'aws-amplify/data';
import * as v from 'valibot';
import type { FormSubmitEvent } from '@nuxt/ui';
import type { TableColumn } from '@nuxt/ui';
import type { Subscription } from 'rxjs';
import type { Schema } from '~/amplify/data/resource';
import type { DynamicUnit, UnitWritable } from '~/types/UnitTypes';

const toast = useToast();
const route = useRoute();
const id = route.params.id as string;

const client = generateClient<Schema>({ authMode: 'userPool' });

const units = useState<Array<DynamicUnit>>('units', () => []);
const unit = computed(() => units.value.find((unit) => unit.id === id));

type WordModelType = Schema['Word']['type'];
type DynamicWord = WordModelType & {
  isWaiting?: boolean;
};

const unitWords = ref<DynamicWord[]>([]);
const allWords = ref<DynamicWord[]>([]);
const showAddWordModal = ref(false);
const showAssignModal = ref(false);
const wordSearch = ref('');
const isAddingWord = ref(false);

const wordColumns: TableColumn<DynamicWord>[] = [
  { accessorKey: 'word', header: 'Word' },
  { id: 'actions', header: '' },
];

const wordSorting = ref([{ id: 'word', desc: false }]);

const filteredUnassignedWords = computed(() => {
  const query = wordSearch.value.toLowerCase();
  return allWords.value
    .filter((w) => !w.unitId)
    .filter(
      (w) =>
        !query ||
        (w.word && w.word.toLowerCase().includes(query)) ||
        (w.description && w.description.toLowerCase().includes(query)),
    );
});

let unitsSub: Subscription;
let wordsSub: Subscription;

onMounted(() => {
  unitsSub = client.models.Unit.observeQuery().subscribe({
    next: ({ items }) => {
      units.value = items as DynamicUnit[];
    },
    error: (error) => {
      console.error('Error observing units:', error);
    },
  });
  wordsSub = client.models.Word.observeQuery().subscribe({
    next: ({ items }) => {
      allWords.value = items as DynamicWord[];
      unitWords.value = items.filter((w) => w.unitId === id) as DynamicWord[];
    },
    error: (error) => {
      console.error('Error observing words:', error);
    },
  });
});

onBeforeUnmount(() => {
  unitsSub?.unsubscribe();
  wordsSub?.unsubscribe();
});

const commit = (property: UnitWritable) => {
  if (!unit.value) return;
  unit.value.waitsOn = { ...unit.value.waitsOn, [property]: true };
  setTimeout(() => {
    if (unit.value) {
      unit.value.waitsOn = { ...unit.value.waitsOn, [property]: false };
    }
  }, 1000);
};

const WordValidationSchema = v.object({
  word: v.pipe(v.string(), v.nonEmpty('Please enter a word')),
  description: v.optional(v.string()),
  isPunctuation: v.optional(v.boolean()),
});
type WordValidType = v.InferOutput<typeof WordValidationSchema>;

const newWordState = reactive<Partial<WordValidType>>({
  word: '',
  description: '',
  isPunctuation: false,
});

const addNewWord = async (event: FormSubmitEvent<WordValidType>) => {
  isAddingWord.value = true;
  const { errors } = await client.models.Word.create({
    word: event.data.word,
    description: event.data.description,
    isPunctuation: event.data.isPunctuation,
    unitId: id,
  });
  isAddingWord.value = false;
  if (errors) {
    console.error(errors);
    toast.add({
      title: 'Error',
      description: 'Failed to add word',
      color: 'error',
    });
  } else {
    toast.add({
      title: 'Success',
      description: 'Word added to unit',
      color: 'success',
    });
    newWordState.word = '';
    newWordState.description = '';
    newWordState.isPunctuation = false;
    showAddWordModal.value = false;
  }
};

const assignWordToUnit = async (word: DynamicWord) => {
  word.isWaiting = true;
  const { errors } = await client.models.Word.update({
    id: word.id,
    unitId: id,
  });
  word.isWaiting = false;
  if (errors) {
    console.error(errors);
    toast.add({
      title: 'Error',
      description: 'Failed to assign word to unit',
      color: 'error',
    });
  } else {
    toast.add({
      title: 'Success',
      description: 'Word assigned to unit',
      color: 'success',
    });
    showAssignModal.value = false;
    wordSearch.value = '';
  }
};

const removeWordFromUnit = async (word: DynamicWord) => {
  word.isWaiting = true;
  const { errors } = await client.models.Word.update({
    id: word.id,
    unitId: null,
  });
  word.isWaiting = false;
  if (errors) {
    console.error(errors);
    toast.add({
      title: 'Error',
      description: 'Failed to remove word from unit',
      color: 'error',
    });
  } else {
    toast.add({
      title: 'Success',
      description: 'Word removed from unit',
      color: 'success',
    });
  }
};
</script>
