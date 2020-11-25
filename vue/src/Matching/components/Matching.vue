<template>
  <v-container fill-height fluid>
    <v-row align="stretch" justify="space-around" class="fill-height">
      <v-col
        v-for="(answer, index) in exerciseItems"
        :key="index"
        cols="6"
        sm="3"
      >
        <AnswerButton
          :ref="`answer${index}Button`"
          :data-test="`answer-${+index + 1}-button`"
          :is-playing="answer.audio.isPlaying"
          :is-buzzing.sync="answer.isBuzzing"
          :color="answer.color"
          @click="selectAndPlay(answer, +index)"
        >
          <template v-if="answer.isIcon">
            <v-icon
              v-for="(icon, iconIndex) in answer.value"
              :key="iconIndex"
              :class="getSpacing(answer.value.length, iconIndex)"
              :style="`font-size: ${2.6 - 0.3 * answer.value.length}rem`"
            >
              {{ icon }}
            </v-icon>
          </template>
          <template v-else>
            <p :style="`font-size: ${2.6 - 0.3 * answer.value.length}rem`">
              {{ answer.value }}
            </p>
          </template>
        </AnswerButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import AnswerButton from '@/common/components/AnswerButton.vue';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import { MatchingItem } from '@/Matching/MatchingTypes';

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

  @Prop(Array) exerciseProp!: Array<MatchingItem>;

  @Watch('exerciseProp')
  onExercisePropChanged() {
    Object.assign(this.$data, this.getDefaultData());
  }

  // eslint-disable-next-line class-methods-use-this
  data() {
    return this.getDefaultData();
  }

  // eslint-disable-next-line class-methods-use-this
  getDefaultData() {
    this.colors = ['deep-purple', 'pink', 'orange', 'teal'];
    return {
      selected: -1,
      localExerciseItems: [] as Array<MatchingItem>,
    };
  }

  get exerciseItems() {
    if (this.$data.localExerciseItems.length === 0) {
      this.$data.localExerciseItems = this.exerciseProp;
    }
    return this.$data.localExerciseItems;
  }

  set exerciseItems(items: Array<MatchingItem>) {
    this.$data.localExerciseItems = items;
  }

  selectAndPlay(answer: MatchingItem, index: number) {
    this.$data.selected = index;
    this.exerciseItems.forEach((item) => {
      if (item.audio.isPlaying) {
        item.audio.cancel();
      }
    });
    answer.audio.play();
  }

  @Watch('selected')
  onSelectedChanged(currIndex: number, prevIndex: number) {
    this.checkForMatchAndReOrder(currIndex, prevIndex);
  }

  public checkForMatchAndReOrder(currIndex: number, prevIndex: number) {
    const currAnswer = this.exerciseItems[currIndex];
    const prevAnswer = this.exerciseItems[prevIndex];

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
      // can probably eliminate temp allAnswers here
      const allAnswers = Object.values(
        this.exerciseItems as Array<MatchingItem>,
      );

      const origCurrAnswerIndex = allAnswers.indexOf(currAnswer);
      const origPrevAnswerIndex = allAnswers.indexOf(prevAnswer);

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
      // Object.values(allAnswers).forEach((item, i) => {
      //   concat += `${i + 1}: ${m[item.value.substring(0, 6)]}  ->  ${item.match}${
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
      allAnswers.forEach((item: MatchingItem, index: number) => {
        if (item.isMatched) {
          lastMatched = index;
        }
      });
      lastMatched += 1;

      // add last selected before the unmatched answers
      allAnswers.splice(lastMatched, 0, currAnswer);
      // keep relative sort order within pair
      if (origCurrAnswerIndex > origPrevAnswerIndex) {
        allAnswers.splice(lastMatched, 0, prevAnswer);
        prevAnswer.match = lastMatched + 1;
        currAnswer.match = lastMatched;
      } else {
        allAnswers.splice(lastMatched + 1, 0, prevAnswer);
        currAnswer.match = lastMatched + 1;
        prevAnswer.match = lastMatched;
      }

      // 2 - any 'match' link lower than
      // re-map internal matching given re-ordering
      allAnswers.forEach((item) => {
        if (!item.isMatched) {
          // include new pair in lastMatched
          // if (item.match <= lastMatched + 2) {
          //   // eslint-disable-next-line no-param-reassign
          //   item.match += lastMatched + 2 - item.match + 1;
          // }
          if (
            item.match < origCurrAnswerIndex &&
            item.match < origPrevAnswerIndex
          ) {
            // eslint-disable-next-line no-param-reassign
            item.match += 2;
          } else if (
            item.match < origCurrAnswerIndex ||
            item.match < origPrevAnswerIndex
          ) {
            // eslint-disable-next-line no-param-reassign
            item.match += 1;
          }
        }
      });

      // debug output: print order of answers collection
      // concat = 'After re-ordering\n';
      // Object.values(allAnswers).forEach((item, i) => {
      //   concat += `${i + 1}: ${m[item.value.substring(0, 6)]}  ->  ${item.match}\n`;
      // });
      // console.log(`${concat}\n\n`);
      // end debug output

      // this.$data.answers = Object.fromEntries(
      //   allAnswers.map((ans, index) => {
      //     return [index, ans];
      //   }),
      // );
      this.exerciseItems = allAnswers;

      // if all answers are matched up, continue!
      if (
        !allAnswers.reduce((countMatched, item) => {
          return item.isMatched ? countMatched - 1 : countMatched;
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

  // eslint-disable-next-line class-methods-use-this
  getSpacing(itemCount: number, index: number): string {
    if (itemCount > 1) {
      if (index === 0) {
        return 'mr-n4';
      }
      if (index === itemCount - 1) {
        return 'ml-n4';
      }
      return 'mx-n4';
    }
    return '';
  }
}
</script>

<style lang="stylus">
.v-icon__svg
  height: 1.8em;
  width: 1.8em;
</style>
