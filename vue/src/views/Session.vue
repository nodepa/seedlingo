<template>
  <component :is="exerciseComponent" :exercise-prop="exerciseItems" />
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import MultipleChoice from '@/MultipleChoice/components/MultipleChoice.vue';
import Matching from '@/Matching/components/Matching.vue';
import getMatchingExerciseTestData from '@/Matching/data/MatchingTestData';
import getMultipleChoiceExerciseTestData from '@/MultipleChoice/data/MultipleChoiceTestData';
import { MatchingItem } from '@/Matching/MatchingTypes';
import ExerciseProvider from '@/Lessons/ExerciseProvider';

@Component({
  components: {
    MultipleChoice,
    Matching,
  },
})
export default class Session extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      exerciseComponent: 'MultipleChoice',
      exerciseItems: [],
      currentIteration: 1,
    };
  }

  @Watch('$store.state.showContinueButton')
  // eslint-disable-next-line class-methods-use-this
  onShowContinueButtonChanged(show: boolean) {
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

  getExercise() {
    if (
      this.$route.params.id === 'matching-test' ||
      +this.$route.params.id > 10
    ) {
      this.$data.exerciseComponent = 'Matching';
      this.$data.exerciseItems = getMatchingExerciseTestData();
    } else if (this.$route.params.id === 'multiple-choice-test') {
      this.$data.exerciseComponent = 'MultipleChoice';
      this.$data.exerciseItems = getMultipleChoiceExerciseTestData();
    } else if (
      this.$route.params.id != null &&
      this.$route.params.id !== '' &&
      !Number.isNaN(+this.$route.params.id)
    ) {
      const lessonIndex = +this.$route.params.id;
      // eslint-disable-next-line @typescript-eslint/no-this-alias
      const vm = this;
      ExerciseProvider.getNextExercise(lessonIndex).then(
        (exercise: {
          exerciseType: string;
          exerciseItems: Array<MatchingItem> | {};
        }) => {
          vm.$data.exerciseItems = exercise.exerciseItems;
          vm.$data.exerciseComponent = exercise.exerciseType;
        },
      );
    }
  }

  mounted() {
    this.getExercise();
  }
}
</script>

<style lang="stylus" scoped></style>
