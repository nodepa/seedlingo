<template>
  <ion-page>
    <component
      :is="exerciseComponent"
      :exercise-prop="exerciseItems"
    ></component>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, useIonRouter } from '@ionic/vue';
import { onMounted, ref, shallowRef, watch } from 'vue';
import { useRoute } from 'vue-router';
import { useStore } from 'vuex';
import Cloze from '@/Cloze/components/Cloze.vue';
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

type ExerciseComponent = typeof Matching | typeof MultipleChoice | typeof Cloze;
const ExerciseMapping: { [key: string]: ExerciseComponent } = {
  Matching,
  MultipleChoice,
  ExplanationMatching: Matching,
  ExplanationMultipleChoice: MultipleChoice,
  SingleCloze: Cloze,
  MultiCloze: Cloze,
};
const exerciseComponent = shallowRef<ExerciseComponent | string>(
  MultipleChoice,
);

const exerciseItems = ref<ExerciseItems>([] as Array<MatchingItem>);

const ionRouter = useIonRouter();
const store = useStore();
const currentIteration = ref<number>(1);
watch(
  () => store.state.showContinueButton,
  (show: boolean) => {
    if (!show) {
      // the continue button has been clicked, time to refresh or return home
      if (currentIteration.value >= 5) {
        ionRouter.navigate({ name: 'Home' }, 'root', 'replace');
      } else {
        currentIteration.value += 1;
        getExercise();
      }
    }
  },
);

const route = useRoute();
function getExercise(): void {
  const restoreAfterMock = ExerciseProvider.pickRandomExerciseType;
  if ('matching-test' === route.params.lessonIndex) {
    exerciseComponent.value = Matching;
    exerciseItems.value = getMatchingTestData();
  } else if ('matching' === route.params.lessonIndex) {
    exerciseComponent.value = Matching;
    ExerciseProvider.pickRandomExerciseType = () => 'Matching';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(3).exerciseItems;
  } else if ('multiple-choice-test' === route.params.lessonIndex) {
    exerciseComponent.value = MultipleChoice;
    exerciseItems.value = getMultipleChoiceTestData();
  } else if ('multiple-choice' === route.params.lessonIndex) {
    exerciseComponent.value = MultipleChoice;
    ExerciseProvider.pickRandomExerciseType = () => 'MultipleChoice';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(3).exerciseItems;
  } else if ('explanation-multiple-choice-test' === route.params.lessonIndex) {
    exerciseComponent.value = MultipleChoice;
    exerciseItems.value = getExplanationMultipleChoiceTestData();
  } else if ('explanation-multiple-choice' === route.params.lessonIndex) {
    exerciseComponent.value = MultipleChoice;
    ExerciseProvider.pickRandomExerciseType = () => 'ExplanationMultipleChoice';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(4).exerciseItems;
  } else if ('explanation-matching-test' === route.params.lessonIndex) {
    exerciseComponent.value = Matching;
    exerciseItems.value = getExplanationMatchingTestData();
  } else if ('explanation-matching' === route.params.lessonIndex) {
    exerciseComponent.value = Matching;
    ExerciseProvider.pickRandomExerciseType = () => 'ExplanationMatching';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(4).exerciseItems;
  } else if ('single-cloze-test' === route.params.lessonIndex) {
    exerciseComponent.value = Cloze;
    exerciseItems.value = getSingleClozeTestData();
  } else if ('single-cloze' === route.params.lessonIndex) {
    exerciseComponent.value = Cloze;
    ExerciseProvider.pickRandomExerciseType = () => 'SingleCloze';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(6).exerciseItems;
  } else if ('multi-cloze-test' === route.params.lessonIndex) {
    exerciseComponent.value = Cloze;
    exerciseItems.value = getMultiClozeTestData();
  } else if ('multi-cloze' === route.params.lessonIndex) {
    exerciseComponent.value = Cloze;
    ExerciseProvider.pickRandomExerciseType = () => 'MultiCloze';
    exerciseItems.value =
      ExerciseProvider.getExerciseFromLesson(11).exerciseItems;
  } else if (
    route.params.lessonIndex != null &&
    route.params.lessonIndex !== '' &&
    !Number.isNaN(+route.params.lessonIndex)
  ) {
    const lessonIndex = +route.params.lessonIndex;
    const { exerciseType, exerciseItems: items } =
      ExerciseProvider.getExerciseFromLesson(lessonIndex);
    exerciseComponent.value = ExerciseMapping[exerciseType];
    exerciseItems.value = items;
  }
  ExerciseProvider.pickRandomExerciseType = restoreAfterMock;
}

onMounted(() => getExercise());
</script>
