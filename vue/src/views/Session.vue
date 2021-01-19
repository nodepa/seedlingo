<template>
  <component :is="exerciseComponent" :exercise-prop="exerciseItems" />
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
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

@Component({
  // eslint-disable-next-line no-undef
  components: {
    Cloze,
    Matching,
    MultipleChoice,
  },
})
export default class Session extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): {
    exerciseComponent: string;
    exerciseItems: Array<MatchingItem> | MultipleChoiceExercise | ClozeExercise;
    currentIteration: number;
  } {
    return {
      exerciseComponent: 'MultipleChoice',
      exerciseItems: [],
      currentIteration: 1,
    };
  }

  @Watch('$store.state.showContinueButton')
  // eslint-disable-next-line class-methods-use-this
  onShowContinueButtonChanged(show: boolean): void {
    if (!show) {
      // the continue button has been clicked, time to refresh or return home
      if (this.$data.currentIteration >= 5) {
        this.$router.push({ name: 'Home' });
      } else {
        this.getExercise();
        this.$data.currentIteration += 1;
      }
    }
  }

  getExercise(): void {
    if (
      this.$route.params.id === 'matching-test' ||
      +this.$route.params.id > 10
    ) {
      this.$data.exerciseComponent = 'Matching';
      this.$data.exerciseItems = getMatchingTestData();
    } else if (this.$route.params.id === 'multiple-choice-test') {
      this.$data.exerciseComponent = 'MultipleChoice';
      this.$data.exerciseItems = getMultipleChoiceTestData();
    } else if (this.$route.params.id === 'multiple-choice-explanation-test') {
      this.$data.exerciseComponent = 'MultipleChoice';
      this.$data.exerciseItems = getMultipleChoiceExplanationTestData();
    } else if (this.$route.params.id === 'matching-explanation-test') {
      this.$data.exerciseComponent = 'Matching';
      this.$data.exerciseItems = getMatchingExplanationTestData();
    } else if (this.$route.params.id === 'cloze-test') {
      this.$data.exerciseComponent = 'Cloze';
      this.$data.exerciseItems = getClozeTestData();
    } else if (
      this.$route.params.id != null &&
      this.$route.params.id !== '' &&
      !Number.isNaN(+this.$route.params.id)
    ) {
      const lessonIndex = +this.$route.params.id;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const vm = this;
      ExerciseProvider.getExerciseFromLesson(lessonIndex).then(
        (exercise: {
          exerciseType: string;
          exerciseItems:
            | Array<MatchingItem>
            | MultipleChoiceExercise
            | ClozeExercise;
        }) => {
          vm.$data.exerciseItems = exercise.exerciseItems;
          if (exercise.exerciseType === 'MultipleChoiceExplanation') {
            vm.$data.exerciseComponent = 'MultipleChoice';
          } else {
            vm.$data.exerciseComponent = exercise.exerciseType;
          }
        },
      );
    }
  }

  mounted(): void {
    this.getExercise();
  }
}
</script>

<style lang="stylus" scoped></style>
