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

        <!-- Two-column layout: words left, exercise right -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <!-- Left column: words list -->
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
              <template #select-cell="{ row }">
                <UCheckbox
                  :model-value="selectedWordIds.has(row.original.id)"
                  @update:model-value="toggleWordSelection(row.original)"
                />
              </template>
              <template #word-cell="{ row }">
                <span class="font-bold text-lg">{{ row.original.word }}</span>
                <p
                  v-if="row.original.description"
                  class="text-sm text-gray-500"
                >
                  {{ row.original.description }}
                </p>
              </template>
              <template #importance-cell="{ row }">
                <UInput
                  :model-value="row.original.importance ?? undefined"
                  type="number"
                  min="1"
                  max="5"
                  size="sm"
                  class="w-16"
                  :loading="row.original.waitsOn?.importance"
                  @update:model-value="
                    (v: string | number) =>
                      setWordRating(row.original, 'importance', v)
                  "
                  @blur="commitWordRating(row.original, 'importance')"
                  @keydown="
                    ($event: KeyboardEvent) =>
                      $event.key === 'Enter' &&
                      commitWordRating(row.original, 'importance')
                  "
                />
              </template>
              <template #difficulty-cell="{ row }">
                <UInput
                  :model-value="row.original.difficulty ?? undefined"
                  type="number"
                  min="1"
                  max="5"
                  size="sm"
                  class="w-16"
                  :loading="row.original.waitsOn?.difficulty"
                  @update:model-value="
                    (v: string | number) =>
                      setWordRating(row.original, 'difficulty', v)
                  "
                  @blur="commitWordRating(row.original, 'difficulty')"
                  @keydown="
                    ($event: KeyboardEvent) =>
                      $event.key === 'Enter' &&
                      commitWordRating(row.original, 'difficulty')
                  "
                />
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

          <!-- Right column: exercise panel -->
          <div class="flex flex-col gap-4">
            <!-- Exercise type badge -->
            <div class="flex items-center gap-2">
              <h2 class="text-xl font-semibold text-primary">Exercise</h2>
              <UBadge color="primary" variant="subtle">Multiple Choice</UBadge>
            </div>

            <!-- Exercise preview area -->
            <div
              class="border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden"
              style="min-height: 32rem"
            >
              <!-- idle: show play button -->
              <div
                v-if="exerciseState === 'idle'"
                class="flex flex-col items-center justify-center h-full gap-3 p-8"
                style="min-height: 32rem"
              >
                <p
                  v-if="selectedWordIds.size === 0"
                  class="text-gray-400 text-sm text-center"
                >
                  Select words from the list on the left to build an exercise.
                </p>
                <UButton
                  icon="lucide:play"
                  size="xl"
                  color="primary"
                  :disabled="selectedWordIds.size === 0"
                  @click="playExercise"
                >
                  Play
                </UButton>
                <p
                  v-if="selectedWordIds.size > 0"
                  class="text-gray-400 text-xs text-center"
                >
                  {{ selectedWordIds.size }}
                  {{ selectedWordIds.size === 1 ? 'word' : 'words' }} selected
                </p>
              </div>

              <!-- playing: show the actual exercise component -->
              <div
                v-else-if="exerciseState === 'playing' && currentExercise"
                class="exercise-host"
                style="height: 32rem"
              >
                <MultipleChoiceExerciseComponent
                  :exercise-prop="currentExercise"
                />
              </div>

              <!-- done: show play-again button -->
              <div
                v-else-if="exerciseState === 'done'"
                class="flex flex-col items-center justify-center h-full gap-3 p-8"
                style="min-height: 24rem"
              >
                <UIcon
                  name="lucide:circle-check"
                  class="w-12 h-12 text-success-500"
                />
                <p class="text-gray-500 text-sm">Exercise complete!</p>
                <UButton
                  icon="lucide:refresh-cw"
                  size="xl"
                  color="primary"
                  @click="playExercise"
                >
                  Play again
                </UButton>
              </div>
            </div>

            <!-- Save exercise button (available when playing or done) -->
            <div v-if="exerciseState !== 'idle'" class="flex justify-end">
              <UButton
                icon="lucide:save"
                color="success"
                :loading="isSavingExercise"
                @click="saveExercise"
              >
                Save exercise
              </UButton>
            </div>

            <p class="text-xs text-gray-400">
              Check words in the list to include them in the exercise. The
              correct answer is chosen at random each time you press Play.
            </p>
          </div>
        </div>

        <UDivider />

        <!-- Saved exercises list -->
        <div>
          <h2 class="text-xl font-semibold text-primary mb-4">
            Saved exercises
          </h2>
          <div v-if="savedExercises.length > 0" class="flex flex-col gap-3">
            <div
              v-for="exercise in savedExercises"
              :key="exercise.id"
              class="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl"
            >
              <div class="flex items-center gap-3">
                <UBadge color="primary" variant="subtle">
                  {{ exercise.type }}
                </UBadge>
                <span class="text-sm text-gray-600 dark:text-gray-400">
                  {{ describeExercise(exercise) }}
                </span>
              </div>
              <div class="flex gap-2 items-center">
                <span class="text-xs text-gray-400">
                  {{ new Date(exercise.createdAt).toLocaleString() }}
                </span>
                <UButton
                  icon="lucide:trash-2"
                  color="error"
                  variant="ghost"
                  size="sm"
                  :loading="exercise.isDeleting"
                  @click="deleteExercise(exercise)"
                >
                  Delete
                </UButton>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-500 text-sm">
            No exercises saved yet. Preview an exercise above and click "Save
            exercise".
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
import type { DynamicWord } from '~/types/WordTypes';
import type { MultipleChoiceExercise } from '@/MultipleChoice/MultipleChoiceTypes';
import type { MultipleChoiceSpec } from '@/common/types/ContentTypes';
import { generateMultipleChoiceExercise } from '~/utils/EditorExerciseProvider';
import MultipleChoiceExerciseComponent from '@/MultipleChoice/components/MultipleChoiceExercise.vue';
import { exerciseStore } from '~/plugins/ionic.client';

// ─── Types ───────────────────────────────────────────────────────────────────

type ExerciseSchema = Schema['Exercise']['type'];

type DynamicExercise = ExerciseSchema & {
  isDeleting?: boolean;
};

// ─── Setup ───────────────────────────────────────────────────────────────────

const toast = useToast();
const route = useRoute();
const id = route.params.id as string;

const client = generateClient<Schema>({ authMode: 'userPool' });

const units = useState<Array<DynamicUnit>>('units', () => []);
const unit = computed(() => units.value.find((u) => u.id === id));

const unitWords = ref<DynamicWord[]>([]);
const allWords = ref<DynamicWord[]>([]);
const savedExercises = ref<DynamicExercise[]>([]);

const showAddWordModal = ref(false);
const showAssignModal = ref(false);
const wordSearch = ref('');
const isAddingWord = ref(false);

// ─── Exercise panel state ─────────────────────────────────────────────────────

const selectedWordIds = ref<Set<string>>(new Set());
type ExerciseState = 'idle' | 'playing' | 'done';
const exerciseState = ref<ExerciseState>('idle');
const currentExercise = ref<MultipleChoiceExercise | null>(null);
const isSavingExercise = ref(false);

// Watch the exercise store for the "exercise completed" signal from
// MultipleChoiceExercise.vue (it dispatches setShowContinueButton(true),
// which our fake store translates into exerciseStore.showContinueButton)
watch(
  () => exerciseStore.showContinueButton,
  (show) => {
    if (show && exerciseState.value === 'playing') {
      exerciseState.value = 'done';
    }
  },
);

function toggleWordSelection(word: DynamicWord): void {
  const next = new Set(selectedWordIds.value);
  if (next.has(word.id)) {
    next.delete(word.id);
  } else {
    next.add(word.id);
  }
  selectedWordIds.value = next;
  // Reset exercise whenever the selection changes
  exerciseState.value = 'idle';
  currentExercise.value = null;
}

function playExercise(): void {
  const selected = unitWords.value.filter((w) =>
    selectedWordIds.value.has(w.id),
  );
  if (selected.length === 0) return;

  // Reset the exercise store's continue-button flag before starting
  exerciseStore.showContinueButton = false;

  // Cast to the type EditorExerciseProvider expects (DynamicWord from WordTypes)
  currentExercise.value = generateMultipleChoiceExercise(
    selected as Parameters<typeof generateMultipleChoiceExercise>[0],
  );
  exerciseState.value = 'playing';
}

async function saveExercise(): Promise<void> {
  if (!currentExercise.value) return;

  isSavingExercise.value = true;

  // Build the MultipleChoiceSpec from the currently selected DynamicWords.
  // DynamicWord has both word.word (display text) and word.id (UUID), which
  // maps exactly to the WordRef format: { "<display word>": "<UUID>" }.
  const selectedWords = unitWords.value.filter((w) =>
    selectedWordIds.value.has(w.id),
  );
  const spec: MultipleChoiceSpec = {
    multipleChoiceWords: selectedWords.map((w) => ({
      [w.word ?? '']: w.id,
    })),
  };

  const { errors } = await client.models.Exercise.create({
    unitId: id,
    type: 'MultipleChoice',
    specJson: JSON.stringify(spec),
  });

  isSavingExercise.value = false;

  if (errors) {
    console.error(errors);
    toast.add({
      title: 'Error',
      description: 'Failed to save exercise',
      color: 'error',
    });
  } else {
    toast.add({
      title: 'Saved',
      description: 'Exercise saved to unit',
      color: 'success',
    });
  }
}

async function deleteExercise(exercise: DynamicExercise): Promise<void> {
  exercise.isDeleting = true;
  const { errors } = await client.models.Exercise.delete({ id: exercise.id });
  exercise.isDeleting = false;
  if (errors) {
    console.error(errors);
    toast.add({
      title: 'Error',
      description: 'Failed to delete exercise',
      color: 'error',
    });
  }
}

/** Return a short human-readable summary of a saved exercise. */
function describeExercise(exercise: DynamicExercise): string {
  try {
    if (exercise.type === 'MultipleChoice') {
      const spec = JSON.parse(exercise.specJson) as MultipleChoiceSpec;
      const words = spec.multipleChoiceWords.map((ref) => Object.keys(ref)[0]);
      return `${words.length} word${words.length !== 1 ? 's' : ''}: ${words.join(', ')}`;
    }
  } catch {
    // malformed JSON — fall through
  }
  return exercise.type;
}

// ─── Word rating helpers ──────────────────────────────────────────────────────

/** Stage a numeric rating change locally (before committing to DB). */
function setWordRating(
  word: DynamicWord,
  field: 'importance' | 'difficulty',
  value: string | number,
): void {
  const parsed = typeof value === 'string' ? parseInt(value, 10) : value;
  word[field] = isNaN(parsed) ? undefined : Math.min(5, Math.max(1, parsed));
}

/** Persist an importance or difficulty rating to DynamoDB. */
async function commitWordRating(
  word: DynamicWord,
  field: 'importance' | 'difficulty',
): Promise<void> {
  word.waitsOn = { ...word.waitsOn, [field]: true };
  const { errors } = await client.models.Word.update({
    id: word.id,
    [field]: word[field] ?? null,
  });
  word.waitsOn = { ...word.waitsOn, [field]: false };
  if (errors) {
    console.error(errors);
    toast.add({
      title: 'Error',
      description: `Failed to update ${field}`,
      color: 'error',
    });
  }
}

// ─── Table config ─────────────────────────────────────────────────────────────

const wordColumns: TableColumn<DynamicWord>[] = [
  { id: 'select', header: '' },
  { accessorKey: 'word', header: 'Word' },
  {
    id: 'importance',
    header: 'Importance',
    meta: { class: { td: 'w-20' } },
  },
  {
    id: 'difficulty',
    header: 'Difficulty',
    meta: { class: { td: 'w-20' } },
  },
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

// ─── Data subscriptions ───────────────────────────────────────────────────────

let unitsSub: Subscription;
let wordsSub: Subscription;
let exercisesSub: Subscription;

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
  exercisesSub = client.models.Exercise.observeQuery({
    filter: { unitId: { eq: id } },
  }).subscribe({
    next: ({ items }) => {
      // Sort by createdAt ascending so oldest exercises appear first
      savedExercises.value = [...items]
        .sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
        )
        .map((e) => e as DynamicExercise);
    },
    error: (error) => {
      console.error('Error observing exercises:', error);
    },
  });
});

onBeforeUnmount(() => {
  unitsSub?.unsubscribe();
  wordsSub?.unsubscribe();
  exercisesSub?.unsubscribe();
});

// ─── Unit field commits ───────────────────────────────────────────────────────

const commit = async (property: UnitWritable) => {
  if (!unit.value) return;
  unit.value.waitsOn = { ...unit.value.waitsOn, [property]: true };
  const { errors } = await client.models.Unit.update({
    id: unit.value.id,
    [property]: unit.value[property],
  });
  if (unit.value) {
    unit.value.waitsOn = { ...unit.value.waitsOn, [property]: false };
  }
  if (errors) {
    console.error(errors);
    toast.add({
      title: 'Error',
      description: `Failed to update ${property}`,
      color: 'error',
    });
  }
};

// ─── Word form ────────────────────────────────────────────────────────────────

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

// ─── Word assignment ──────────────────────────────────────────────────────────

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

<style scoped>
/*
 * All Ionic CSS is scoped to .exercise-host — nothing leaks into the rest of
 * the editor. Values are taken verbatim from app/src/common/styles/theme.scss
 * so the preview matches exactly what the learner sees in the app.
 *
 * core.css is NOT imported globally (see ionic.client.ts). All the CSS custom
 * properties it would have set on :root are provided here instead.
 */

/* ── Light-mode Ionic environment (app light: background #e9e9e9) ─────────── */
.exercise-host {
  /* Typography */
  --ion-font-family: inherit;
  --ion-text-color: #373737;
  --ion-text-color-rgb: 55, 55, 55;

  /* Background — matches app light mode (theme.scss :root) */
  --ion-background-color: #e9e9e9;
  --ion-background-color-rgb: 233, 233, 233;
  background-color: #e9e9e9;

  /* Card — the top ExerciseButton uses color="card" */
  --ion-color-card: #ffffff;
  --ion-color-card-rgb: 255, 255, 255;
  --ion-color-card-contrast: #373737;
  --ion-color-card-contrast-rgb: 55, 55, 55;
  --ion-color-card-shade: #e0e0e0;
  --ion-color-card-tint: #ffffff;

  /* Primary — option buttons */
  --ion-color-primary: #1976d2;
  --ion-color-primary-rgb: 25, 118, 210;
  --ion-color-primary-contrast: #ffffff;
  --ion-color-primary-contrast-rgb: 255, 255, 255;
  --ion-color-primary-shade: #1668b9;
  --ion-color-primary-tint: #3084d7;

  /* Success — correct-answer button */
  --ion-color-success: #009688;
  --ion-color-success-rgb: 0, 150, 136;
  --ion-color-success-contrast: #ffffff;
  --ion-color-success-contrast-rgb: 255, 255, 255;
  --ion-color-success-shade: #008478;
  --ion-color-success-tint: #1aa194;

  /* Danger — wrong-answer buzz */
  --ion-color-danger: #e53935;
  --ion-color-danger-rgb: 229, 57, 53;
  --ion-color-danger-contrast: #ffffff;
  --ion-color-danger-contrast-rgb: 255, 255, 255;
  --ion-color-danger-shade: #ca322f;
  --ion-color-danger-tint: #e84d49;

  /* Grid — match app/src/App.vue: ion-grid { --ion-grid-column-padding: 8px } */
  --ion-grid-column-padding: 8px;

  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
}

/* ── Dark-mode Ionic environment (app dark: background #383838) ───────────── */
/* The editor's dark mode sets .dark on <html> (Tailwind selector strategy).   */
:global(.dark) .exercise-host {
  --ion-text-color: #ffffff;
  --ion-text-color-rgb: 255, 255, 255;

  --ion-background-color: #383838;
  --ion-background-color-rgb: 56, 56, 56;
  background-color: #383838;

  /* Card — dark mode (theme.scss body.dark) */
  --ion-color-card: #595959;
  --ion-color-card-rgb: 89, 89, 89;
  --ion-color-card-contrast: #ffffff;
  --ion-color-card-contrast-rgb: 255, 255, 255;
  --ion-color-card-shade: #4e4e4e;
  --ion-color-card-tint: #6a6a6a;

  /* Primary, Success, Danger stay the same in app dark mode */
}

/* ── Ionic color utility class for color="card" on ExerciseButton ─────────── */
/* ion-button uses .ion-color-{name} to map --ion-color-{name} → --ion-color-  */
/* base/contrast/shade/tint. Without this mapping the button renders with no   */
/* background. This mirrors the .ion-color-card block in theme.scss.           */
.exercise-host :deep(.ion-color-card) {
  --ion-color-base: var(--ion-color-card);
  --ion-color-base-rgb: var(--ion-color-card-rgb);
  --ion-color-contrast: var(--ion-color-card-contrast);
  --ion-color-contrast-rgb: var(--ion-color-card-contrast-rgb);
  --ion-color-shade: var(--ion-color-card-shade);
  --ion-color-tint: var(--ion-color-card-tint);
}
</style>
