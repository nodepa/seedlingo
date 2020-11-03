<template>
  <v-container fill-height fluid>
    <v-row align="stretch" justify="space-around">
      <v-col v-for="(answer, index) in answers" :key="index">
        <AnswerButton
          :ref="`answer${index}Button`"
          :data-test="`answer-${index}-button`"
          :is-playing="answer.audio.isPlaying"
          :is-buzzing.sync="answer.isBuzzing"
          :color="answer.color"
          @click="selectAndPlay(answer, +index)"
        >
          <v-icon v-if="answer.isIcon" class="pa-4 mb-3">
            {{ answer.value }}
          </v-icon>
          <p
            v-else
            :class="
              `${answer.value.length > 1 ? 'display-2' : 'display-3'} pa-4`
            "
          >
            {{ answer.value }}
          </p>
        </AnswerButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'vue-property-decorator';
import AnswerButton from '@/common/components/AnswerButton.vue';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import getExerciseTestData from '@/Matching/data/MatchingTestData';
import { MatchingAnswer } from '@/Matching/MatchingTypes';

@Component({
  components: {
    RippleAnimation,
    AnswerButton,
  },
})
export default class Matching extends Vue {
  colors: Array<string> = ['deep-purple', 'pink', 'orange', 'teal'];

  iconColor = 'primary';

  charColor = '';

  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      answers: {} as Array<MatchingAnswer>,
      selected: -1,
    };
  }

  created() {
    this.$data.answers = getExerciseTestData();
  }

  selectAndPlay(answer: MatchingAnswer, index: number) {
    this.$data.selected = index;
    Object.values(this.$data.answers as Array<MatchingAnswer>).forEach((el) => {
      if (el.audio.isPlaying) {
        el.audio.cancel();
      }
    });
    answer.audio.play();
  }

  @Watch('selected')
  onSelectedChanged(currIndex: number, prevIndex: number) {
    this.checkForMatchAndReOrder(currIndex, prevIndex);
  }

  public checkForMatchAndReOrder(currIndex: number, prevIndex: number) {
    const currAnswer = this.$data.answers[currIndex];
    const prevAnswer = this.$data.answers[prevIndex];

    if (currIndex > -1 && currAnswer.isMatched) {
      // 1 item selected, but already matched
      this.$data.selected = -1;
      // cancel (potential) previous selection
      if (prevAnswer) {
        prevAnswer.isSelected = false;
        prevAnswer.color = prevAnswer.isIcon ? this.iconColor : this.charColor;
      }
    } else if (prevIndex === -1) {
      // nothing was selected, now 1 item is
      //   - color currently selected item
      currAnswer.isSelected = true;
      [currAnswer.color] = this.colors;
    } else if (currIndex === -1) {
      // if no selection (neither prevIndex nor currIndex): programmatically reset to -1
    } else if (currAnswer && currAnswer.match === prevIndex) {
      // 1 item was selected, now another item is selected
      //   - they are a match
      //     - color same
      [currAnswer.color] = this.colors;
      [prevAnswer.color] = this.colors;
      this.colors.shift();

      //     - set selection to nothing
      currAnswer.isSelected = false;
      prevAnswer.isSelected = false;
      currAnswer.isMatched = true;
      prevAnswer.isMatched = true;
      this.$data.selected = -1;

      //     - re-order
      const allAnswers = Object.values(
        this.$data.answers as Array<MatchingAnswer>,
      );

      const origCurrAnswerIndex = allAnswers.indexOf(currAnswer) + 1;
      const origPrevAnswerIndex = allAnswers.indexOf(prevAnswer) + 1;

      // debug output: print order of answers collection
      // const m = {
      //   'M9,7V9': ' 2',
      //   术: '术',
      //   二: '二',
      //   'M9,7V1': ' 4',
      //   'M12 9C': '🌴',
      //   'M5,3H1': ' 3',
      //   三: '三',
      //   四: '四',
      // };
      // let concat = 'Before re-ordering\n';
      // Object.values(allAnswers).forEach((el, i) => {
      //   concat += `${i + 1}: ${m[el.value.substring(0, 6)]}  ->  ${el.match}${
      //     i === origCurrAnswerIndex - 1 || i === origPrevAnswerIndex - 1
      //       ? '*'
      //       : ''
      //   }\n`;
      // });
      // console.log(`${concat.substring(0, concat.length - 1)}`);
      // console.log(
      //   `curr:   ${origCurrAnswerIndex}: ${
      //     m[currAnswer.value.substring(0, 6)]
      //   }  ->  ${currAnswer.match}\nprev:   ${origPrevAnswerIndex}: ${
      //     m[prevAnswer.value.substring(0, 6)]
      //   }  ->  ${prevAnswer.match}`,
      // );
      // end debug output

      // 1 - put currAnswer and prevAnswer first, re-link to 1 and 2
      // remove matched pair from collection
      allAnswers.splice(allAnswers.indexOf(currAnswer), 1);
      allAnswers.splice(allAnswers.indexOf(prevAnswer), 1);

      // id latest previous match
      // note: lastMatched is zero-index-based
      let lastMatched = -1;
      allAnswers.forEach((el: MatchingAnswer, index: number) => {
        if (el.isMatched) {
          lastMatched = index;
        }
      });
      lastMatched += 1;

      // keep relative sort order within pair
      allAnswers.splice(lastMatched, 0, currAnswer);
      if (origCurrAnswerIndex > origPrevAnswerIndex) {
        allAnswers.splice(lastMatched, 0, prevAnswer);
        prevAnswer.match = lastMatched + 2;
        currAnswer.match = lastMatched + 1;
      } else {
        allAnswers.splice(lastMatched + 1, 0, prevAnswer);
        currAnswer.match = lastMatched + 2;
        prevAnswer.match = lastMatched + 1;
      }

      // 2 - any 'match' link lower than
      // re-map internal matching given re-ordering
      allAnswers.forEach((el) => {
        if (!el.isMatched) {
          // include new pair in lastMatched
          // if (el.match <= lastMatched + 2) {
          //   // eslint-disable-next-line no-param-reassign
          //   el.match += lastMatched + 2 - el.match + 1;
          // }
          if (
            el.match < origCurrAnswerIndex &&
            el.match < origPrevAnswerIndex
          ) {
            // eslint-disable-next-line no-param-reassign
            el.match += 2;
          } else if (
            el.match < origCurrAnswerIndex ||
            el.match < origPrevAnswerIndex
          ) {
            // eslint-disable-next-line no-param-reassign
            el.match += 1;
          }
        }
      });

      // debug output: print order of answers collection
      // concat = 'After re-ordering\n';
      // Object.values(allAnswers).forEach((el, i) => {
      //   concat += `${i + 1}: ${m[el.value.substring(0, 6)]}  ->  ${el.match}\n`;
      // });
      // console.log(`${concat}\n\n`);
      // end debug output

      this.$data.answers = Object.fromEntries(
        allAnswers.map((ans, index) => {
          return [index + 1, ans];
        }),
      );

      // if all answers are matched up, continue!
      if (
        !allAnswers.reduce((countMatched, el) => {
          return el.isMatched ? countMatched - 1 : countMatched;
        }, allAnswers.length)
      ) {
        // all answers have been matched
        // setTimeout(() => {
        this.$store.commit('showContinueButton', true);
        // }, 500);
      }
    } else {
      // 1 item was selected, now another item is selected
      //   - they are not a match
      if (currAnswer.isIcon === prevAnswer.isIcon) {
        //   - if the new selection is of same type, then
        //     - revert color of previous selection
        //     - keep current selection
        currAnswer.isSelected = true;
        // rotate color list
        this.colors.push(this.colors.shift() as string);
        [currAnswer.color] = this.colors;
      } else {
        //   - if new selection is of different type
        //     - revert color
        //     - set selection to nothing
        currAnswer.isBuzzing = true;
        prevAnswer.isBuzzing = true;
        currAnswer.color = currAnswer.isIcon ? this.iconColor : this.charColor;
        currAnswer.isSelected = false;
        this.$data.selected = -1;
      }
      prevAnswer.isSelected = false;
      prevAnswer.color = prevAnswer.isIcon ? this.iconColor : this.charColor;
    }
  }
}
</script>

<style lang="stylus">
.v-icon__svg
  height: 2.6em;
  width: 2.6em;
</style>
