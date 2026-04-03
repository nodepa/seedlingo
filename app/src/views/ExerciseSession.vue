<template>
  <ion-page>
    <component :is="exerciseComponent" :exercise-prop="exerciseItems">
    </component>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, useIonRouter } from '@ionic/vue';
import { ref, shallowRef, watch } from 'vue';
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
import type { ExerciseAudio } from '@/common/types/ExerciseAudioType';
import type { MatchingExercise as MatchingExerciseType } from '@/Matching/MatchingTypes';
import type { MultipleChoiceExercise as MultipleChoiceExerciseType } from '@/MultipleChoice/MultipleChoiceTypes';
import type { ClozeExercise as ClozeExerciseType } from '@/Cloze/ClozeTypes';
import type { ComprehensionExercise as ComprehensionExerciseType } from '@/Comprehension/ComprehensionTypes';

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

function collectAudioObjects(items: ExerciseItems): ExerciseAudio[] {
  const audios: ExerciseAudio[] = [];

  if ('items' in items) {
    // MatchingExercise
    const matching = items as MatchingExerciseType;
    matching.items.forEach((item) => {
      if (item.audio) audios.push(item.audio);
    });
  } else if ('clozeText' in items) {
    // ClozeExercise
    const cloze = items as ClozeExerciseType;
    cloze.clozeText.forEach((word) => {
      if (word.audio) audios.push(word.audio);
    });
    cloze.clozeOptions.forEach((option) => {
      if (option.audio) audios.push(option.audio);
    });
  } else if ('comprehensionText' in items) {
    // ComprehensionExercise
    const comprehension = items as ComprehensionExerciseType;
    comprehension.comprehensionText.forEach((word) => {
      if (word.audio) audios.push(word.audio);
    });
    comprehension.stages?.forEach((stage) => {
      if (stage.instructionAudio) audios.push(stage.instructionAudio);
    });
    comprehension.questions?.forEach((question) => {
      if (question.questionAudio) audios.push(question.questionAudio);
      question.options.forEach((option) => {
        if (option.audio) audios.push(option.audio);
      });
    });
    comprehension.newWordsExercises?.forEach((subExercise) => {
      audios.push(...collectAudioObjects(subExercise as ExerciseItems));
    });
  } else {
    // MultipleChoiceExercise
    const mc = items as MultipleChoiceExerciseType;
    if (mc.itemUnderTestAudio) audios.push(mc.itemUnderTestAudio);
    mc.options.forEach((option) => {
      if (option.audio) audios.push(option.audio);
    });
  }

  return audios;
}

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
async function getExercise(): Promise<void> {
  const restoreAfterMock = ExerciseProvider.pickRandomExerciseType;
  let component: ExerciseComponent | undefined;
  let items: ExerciseItems | undefined;

  if ('matching-test' === route.params.unitIndex) {
    component = MatchingExercise;
    items = getMatchingTestData('mixed');
  } else if ('matching' === route.params.unitIndex) {
    component = MatchingExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'Matching';
    items = ExerciseProvider.getExerciseFromUnit(3).exerciseItems;
  } else if ('multiple-choice-test' === route.params.unitIndex) {
    component = MultipleChoiceExercise;
    items = getMultipleChoiceTestData();
  } else if ('multiple-choice' === route.params.unitIndex) {
    component = MultipleChoiceExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'MultipleChoice';
    items = ExerciseProvider.getExerciseFromUnit(3).exerciseItems;
  } else if ('explanation-multiple-choice-test' === route.params.unitIndex) {
    component = MultipleChoiceExercise;
    items = getExplanationMultipleChoiceTestData();
  } else if ('explanation-multiple-choice' === route.params.unitIndex) {
    component = MultipleChoiceExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'ExplanationMultipleChoice';
    items = ExerciseProvider.getExerciseFromUnit(4).exerciseItems;
  } else if ('explanation-matching-test' === route.params.unitIndex) {
    component = MatchingExercise;
    items = getExplanationMatchingTestData();
  } else if ('explanation-matching' === route.params.unitIndex) {
    component = MatchingExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'ExplanationMatching';
    items = ExerciseProvider.getExerciseFromUnit(4).exerciseItems;
  } else if ('single-cloze-test' === route.params.unitIndex) {
    component = ClozeExercise;
    items = getSingleClozeTestData();
  } else if ('single-cloze' === route.params.unitIndex) {
    component = ClozeExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'SingleCloze';
    items = ExerciseProvider.getExerciseFromUnit(6).exerciseItems;
  } else if ('multi-cloze-test' === route.params.unitIndex) {
    component = ClozeExercise;
    items = getMultiClozeTestData();
  } else if ('multi-cloze' === route.params.unitIndex) {
    component = ClozeExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'MultiCloze';
    items = ExerciseProvider.getExerciseFromUnit(11).exerciseItems;
  } else if ('comprehension-test' === route.params.unitIndex) {
    component = ComprehensionExercise;
    items = getComprehensionTestData();
  } else if ('comprehension' === route.params.unitIndex) {
    component = ComprehensionExercise;
    ExerciseProvider.pickRandomExerciseType = () => 'Comprehension';
    items = ExerciseProvider.getExerciseFromUnit(6).exerciseItems;
  } else if (
    route.params.unitIndex != null &&
    route.params.unitIndex !== '' &&
    !Number.isNaN(+route.params.unitIndex)
  ) {
    const unitIndex = +route.params.unitIndex;
    const { exerciseType, exerciseItems: exerciseItemsFromProvider } =
      ExerciseProvider.getExerciseFromUnit(unitIndex);
    component = ExerciseMapping[exerciseType];
    items = exerciseItemsFromProvider;
  }
  ExerciseProvider.pickRandomExerciseType = restoreAfterMock;

  if (component !== undefined && items !== undefined) {
    await Promise.all(
      collectAudioObjects(items).map(
        (a) => a.readyToPlay?.() ?? Promise.resolve(),
      ),
    );
    exerciseComponent.value = component;
    exerciseItems.value = items;
  }
}

watch(() => route.params, getExercise, { immediate: true });
</script>
