<template>
  <ion-page>
    <component :is="exerciseComponent" :exercise-prop="exerciseItems">
    </component>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, useIonRouter } from '@ionic/vue';
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import ClozeExercise from '@/Cloze/components/ClozeExercise.vue';
import ComprehensionExercise from '@/Comprehension/components/ComprehensionExercise.vue';
import MatchingExercise from '@/Matching/components/MatchingExercise.vue';
import MultipleChoiceExercise from '@/MultipleChoice/components/MultipleChoiceExercise.vue';
import getMatchingTestData from '@/Matching/data/MatchingTestData';
import getExplanationMatchingTestData from '@/Matching/data/ExplanationMatchingTestData';
import getMultipleChoiceTestData from '@/MultipleChoice/data/MultipleChoiceTestData';
import getExplanationMultipleChoiceTestData from '@/MultipleChoice/data/ExplanationMultipleChoiceTestData';
import getSingleClozeTestData from '@/Cloze/data/SingleClozeTestData';
import getMultiClozeTestData from '@/Cloze/data/MultiClozeTestData';
import getComprehensionTestData from '@/Comprehension/data/ComprehensionTestData';
import ExerciseProvider from '@/Content/ExerciseProvider';
import type { ExerciseItems } from '@/Content/ExerciseProvider';
import type { MultipleChoiceExercise as MultipleChoiceExerciseType } from '@/MultipleChoice/MultipleChoiceTypes';

type ExerciseComponent =
  | typeof MatchingExercise
  | typeof MultipleChoiceExercise
  | typeof ClozeExercise
  | typeof ComprehensionExercise;
const ExerciseMapping: { [key: string]: ExerciseComponent } = {
  Matching: MatchingExercise,
  MultipleChoice: MultipleChoiceExercise,
  ExplanationMatching: MatchingExercise,
  ExplanationMultipleChoice: MultipleChoiceExercise,
  SingleCloze: ClozeExercise,
  MultiCloze: ClozeExercise,
  Comprehension: ComprehensionExercise,
};
const exerciseComponent = shallowRef<ExerciseComponent | string>(
  MultipleChoiceExercise,
);

const exerciseItems = ref<ExerciseItems>({} as MultipleChoiceExerciseType);

const ionRouter = useIonRouter();
const store = useStore();
const currentIteration = ref<number>(1);
watch(
  () => store.state.showContinueButton,
  (show: boolean) => {
    if (!show) {
      if (exerciseComponent.value !== ComprehensionExercise) {
        if (currentIteration.value >= 10) {
          ionRouter.navigate({ name: 'Home' }, 'root', 'push');
        } else {
          currentIteration.value += 1;
          getExercise();
        }
      }
    }
  },
);

const route = useRoute();
function getExercise(): void {
  const restoreAfterMock = ExerciseProvider.pickRandomExerciseType;
  if ('matching-test' === route.params.unitIndex) {
    exerciseComponent.value = MatchingExercise;
    exerciseItems.value = getMatchingTestData('mixed');
  } else if ('matching' === route.params.unitIndex) {
    exerciseComponent.value = MatchingExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'Matching';
    exerciseItems.value = ExerciseProvider.getExerciseFromUnit(3).exerciseItems;
  } else if ('multiple-choice-test' === route.params.unitIndex) {
    exerciseComponent.value = MultipleChoiceExercise;
    exerciseItems.value = getMultipleChoiceTestData();
  } else if ('multiple-choice' === route.params.unitIndex) {
    exerciseComponent.value = MultipleChoiceExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'MultipleChoice';
    exerciseItems.value = ExerciseProvider.getExerciseFromUnit(3).exerciseItems;
  } else if ('explanation-multiple-choice-test' === route.params.unitIndex) {
    exerciseComponent.value = MultipleChoiceExercise;
    exerciseItems.value = getExplanationMultipleChoiceTestData();
  } else if ('explanation-multiple-choice' === route.params.unitIndex) {
    exerciseComponent.value = MultipleChoiceExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'ExplanationMultipleChoice';
    exerciseItems.value = ExerciseProvider.getExerciseFromUnit(4).exerciseItems;
  } else if ('explanation-matching-test' === route.params.unitIndex) {
    exerciseComponent.value = MatchingExercise;
    exerciseItems.value = getExplanationMatchingTestData();
  } else if ('explanation-matching' === route.params.unitIndex) {
    exerciseComponent.value = MatchingExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'ExplanationMatching';
    exerciseItems.value = ExerciseProvider.getExerciseFromUnit(4).exerciseItems;
  } else if ('single-cloze-test' === route.params.unitIndex) {
    exerciseComponent.value = ClozeExercise;
    exerciseItems.value = getSingleClozeTestData();
  } else if ('single-cloze' === route.params.unitIndex) {
    exerciseComponent.value = ClozeExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'SingleCloze';
    exerciseItems.value = ExerciseProvider.getExerciseFromUnit(6).exerciseItems;
  } else if ('multi-cloze-test' === route.params.unitIndex) {
    exerciseComponent.value = ClozeExercise;
    exerciseItems.value = getMultiClozeTestData();
  } else if ('multi-cloze' === route.params.unitIndex) {
    exerciseComponent.value = ClozeExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'MultiCloze';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromUnit(11).exerciseItems;
  } else if ('comprehension-test' === route.params.unitIndex) {
    exerciseComponent.value = ComprehensionExercise;
    exerciseItems.value = getComprehensionTestData();
  } else if ('comprehension' === route.params.unitIndex) {
    exerciseComponent.value = ComprehensionExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'Comprehension';
    exerciseItems.value = ExerciseProvider.getExerciseFromUnit(6).exerciseItems;
  } else if (
    route.params.unitIndex != null &&
    route.params.unitIndex !== '' &&
    !Number.isNaN(+route.params.unitIndex)
  ) {
    const unitIndex = +route.params.unitIndex;
    const { exerciseType, exerciseItems: items } =
      ExerciseProvider.getExerciseFromUnit(unitIndex);
    exerciseComponent.value = ExerciseMapping[exerciseType];
    exerciseItems.value = items;
  }
  ExerciseProvider.pickRandomExerciseType = restoreAfterMock;
}

onMounted(() => getExercise());
</script>
