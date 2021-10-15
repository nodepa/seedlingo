<template>
  <component :is="exerciseComponent" :exercise-prop="exerciseItems"></component>
</template>

<script setup lang="ts">
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useStore } from 'vuex';
import Cloze from '@/Cloze/components/Cloze.vue';
import Matching from '@/Matching/components/Matching.vue';
import MultipleChoice from '@/MultipleChoice/components/MultipleChoice.vue';
import getMatchingTestData from '@/Matching/data/MatchingTestData';
import getMatchingExplanationTestData from '@/Matching/data/MatchingExplanationTestData';
import getMultipleChoiceTestData from '@/MultipleChoice/data/MultipleChoiceTestData';
import getMultipleChoiceExplanationTestData from '@/MultipleChoice/data/MultipleChoiceExplanationTestData';
import getClozeTestData from '@/Cloze/data/ClozeTestData';
import { MatchingItem } from '@/Matching/MatchingTypes';
import { MultipleChoiceExercise } from '@/MultipleChoice/MultipleChoiceTypes';
import { ClozeExercise } from '@/Cloze/ClozeTypes';
import ExerciseProvider from '@/Lessons/ExerciseProvider';

const store = useStore();
const route = useRoute();
const router = useRouter();

type ExerciseComponent = typeof Matching | typeof MultipleChoice | typeof Cloze;

const ExerciseMapping: { [key: string]: ExerciseComponent } = {
  Matching: Matching,
  MatchingExplanation: Matching,
  MultipleChoice: MultipleChoice,
  MultipleChoiceExplanation: MultipleChoice,
  Cloze: Cloze,
};

const exerciseComponent = shallowRef<ExerciseComponent | string>(
  MultipleChoice,
);
const exerciseItems = ref<
  Array<MatchingItem> | MultipleChoiceExercise | ClozeExercise
>([]);
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

function getExercise(): void {
  const restoreAfterMock = ExerciseProvider.pickRandomExerciseType;
  if ('matching-test' === route.params.id || +route.params.id > 10) {
    exerciseComponent.value = Matching;
    exerciseItems.value = getMatchingTestData();
  } else if ('matching' === route.params.id) {
    exerciseComponent.value = Matching;
    ExerciseProvider.pickRandomExerciseType = () => 'Matching';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(3).exerciseItems;
    ExerciseProvider.pickRandomExerciseType = restoreAfterMock;
  } else if ('multiple-choice-test' === route.params.id) {
    exerciseComponent.value = MultipleChoice;
    exerciseItems.value = getMultipleChoiceTestData();
  } else if ('multiple-choice' === route.params.id) {
    exerciseComponent.value = MultipleChoice;
    ExerciseProvider.pickRandomExerciseType = () => 'MultipleChoice';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(3).exerciseItems;
    ExerciseProvider.pickRandomExerciseType = restoreAfterMock;
  } else if ('multiple-choice-explanation-test' === route.params.id) {
    exerciseComponent.value = MultipleChoice;
    exerciseItems.value = getMultipleChoiceExplanationTestData();
  } else if ('multiple-choice-explanation' === route.params.id) {
    exerciseComponent.value = MultipleChoice;
    ExerciseProvider.pickRandomExerciseType = () => 'MultipleChoiceExplanation';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(4).exerciseItems;
    ExerciseProvider.pickRandomExerciseType = restoreAfterMock;
  } else if ('matching-explanation-test' === route.params.id) {
    exerciseComponent.value = Matching;
    exerciseItems.value = getMatchingExplanationTestData();
  } else if ('matching-explanation' === route.params.id) {
    exerciseComponent.value = Matching;
    ExerciseProvider.pickRandomExerciseType = () => 'MatchingExplanation';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(4).exerciseItems;
    ExerciseProvider.pickRandomExerciseType = restoreAfterMock;
  } else if ('cloze-test' === route.params.id) {
    exerciseComponent.value = Cloze;
    exerciseItems.value = getClozeTestData();
  } else if ('cloze' === route.params.id) {
    exerciseComponent.value = Cloze;
    ExerciseProvider.pickRandomExerciseType = () => 'Cloze';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(6).exerciseItems;
    ExerciseProvider.pickRandomExerciseType = restoreAfterMock;
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

    // ExerciseProvider.getExerciseFromLesson(lessonIndex).then(
    //   (exercise: {
    //     exerciseType: string
    //     exerciseItems:
    //       | Array<MatchingItem>
    //       | MultipleChoiceExercise
    //       | ClozeExercise
    //   }) => {
    //     exerciseItems.value = exercise.exerciseItems;
    //     exerciseComponent.value = ExerciseMapping[exercise.exerciseType];
    //   }
    // )
  }
}

onMounted(() => getExercise());
</script>
