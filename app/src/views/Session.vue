<template>
  <component :is="exerciseComponent" :exercise-prop="exerciseItems"></component>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import SingleCloze from '@/Cloze/components/SingleCloze.vue';
import MultiCloze from '@/Cloze/components/MultiCloze.vue';
import Matching from '@/Matching/components/Matching.vue';
import MultipleChoice from '@/MultipleChoice/components/MultipleChoice.vue';
import getMatchingTestData from '@/Matching/data/MatchingTestData';
import getExplanationMatchingTestData from '@/Matching/data/ExplanationMatchingTestData';
import getMultipleChoiceTestData from '@/MultipleChoice/data/MultipleChoiceTestData';
import getExplanationMultipleChoiceTestData from '@/MultipleChoice/data/ExplanationMultipleChoiceTestData';
import getSingleClozeTestData from '@/Cloze/data/SingleClozeTestData';
import getMultiClozeTestData from '@/Cloze/data/MultiClozeTestData';
import { MatchingItem } from '@/Matching/MatchingTypes';
import ExerciseProvider, { ExerciseItems } from '@/Lessons/ExerciseProvider';

type ExerciseComponent =
  | typeof Matching
  | typeof MultipleChoice
  | typeof SingleCloze
  | typeof MultiCloze;
const ExerciseMapping: { [key: string]: ExerciseComponent } = {
  Matching,
  MultipleChoice,
  ExplanationMatching: Matching,
  ExplanationMultipleChoice: MultipleChoice,
  SingleCloze,
  MultiCloze,
};
const exerciseComponent = shallowRef<ExerciseComponent | string>(
  MultipleChoice,
);

const exerciseItems = ref<ExerciseItems>([] as Array<MatchingItem>);

const router = useRouter();
const store = useStore();
const currentIteration = ref<number>(1);
watch(
  () => store.state.showContinueButton,
  (show: boolean) => {
    if (!show) {
      // the continue button has been clicked, time to refresh or return home
      if (currentIteration.value >= 5) {
        router.push({ name: 'Home' });
      } else {
        getExercise();
        currentIteration.value += 1;
      }
    }
  },
);

const route = useRoute();
function getExercise(): void {
  const restoreAfterMock = ExerciseProvider.pickRandomExerciseType;
  if ('matching-test' === route.params.id) {
    exerciseComponent.value = Matching;
    exerciseItems.value = getMatchingTestData();
  } else if ('matching' === route.params.id) {
    exerciseComponent.value = Matching;
    ExerciseProvider.pickRandomExerciseType = () => 'Matching';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(3).exerciseItems;
  } else if ('multiple-choice-test' === route.params.id) {
    exerciseComponent.value = MultipleChoice;
    exerciseItems.value = getMultipleChoiceTestData();
  } else if ('multiple-choice' === route.params.id) {
    exerciseComponent.value = MultipleChoice;
    ExerciseProvider.pickRandomExerciseType = () => 'MultipleChoice';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(3).exerciseItems;
  } else if ('multiple-choice-explanation-test' === route.params.id) {
    exerciseComponent.value = MultipleChoice;
    exerciseItems.value = getExplanationMultipleChoiceTestData();
  } else if ('multiple-choice-explanation' === route.params.id) {
    exerciseComponent.value = MultipleChoice;
    ExerciseProvider.pickRandomExerciseType = () => 'ExplanationMultipleChoice';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(4).exerciseItems;
  } else if ('matching-explanation-test' === route.params.id) {
    exerciseComponent.value = Matching;
    exerciseItems.value = getExplanationMatchingTestData();
  } else if ('matching-explanation' === route.params.id) {
    exerciseComponent.value = Matching;
    ExerciseProvider.pickRandomExerciseType = () => 'ExplanationMatching';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(4).exerciseItems;
  } else if ('single-cloze-test' === route.params.id) {
    exerciseComponent.value = SingleCloze;
    exerciseItems.value = getSingleClozeTestData();
  } else if ('single-cloze' === route.params.id) {
    exerciseComponent.value = SingleCloze;
    ExerciseProvider.pickRandomExerciseType = () => 'SingleCloze';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(6).exerciseItems;
  } else if ('multi-cloze-test' === route.params.id) {
    exerciseComponent.value = MultiCloze;
    exerciseItems.value = getMultiClozeTestData();
  } else if ('multi-cloze' === route.params.id) {
    exerciseComponent.value = MultiCloze;
    ExerciseProvider.pickRandomExerciseType = () => 'MultiCloze';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(11).exerciseItems;
  } else if (
    route.params.id != null &&
    route.params.id !== '' &&
    !Number.isNaN(+route.params.id)
  ) {
    const lessonIndex = +route.params.id;
    const { exerciseType, exerciseItems: items } =
      ExerciseProvider.getExerciseFromLesson(lessonIndex);
    exerciseComponent.value = ExerciseMapping[exerciseType];
    exerciseItems.value = items;
  }
  ExerciseProvider.pickRandomExerciseType = restoreAfterMock;
}

onMounted(() => getExercise());
</script>
