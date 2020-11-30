<template>
  <v-container fill-height fluid>
    <v-row align="stretch" justify="space-around" class="fill-height">
      <v-col
        v-for="(option, index) in exerciseItems"
        :key="index"
        cols="6"
        sm="3"
      >
        <ExerciseButton
          :data-test="`option-button-${+index + 1}`"
          :playing="option.audio.playing"
          :buzzing.sync="option.buzzing"
          :color="option.color"
          @click="selectAndPlay(option, +index)"
        >
          <template v-if="option.isIcon">
            <v-icon
              v-for="(icon, iconIndex) in option.value"
              :key="iconIndex"
              :class="getSpacing(option.value.length, iconIndex)"
              :style="`font-size: ${2.6 - 0.3 * option.value.length}rem`"
            >
              {{ icon }}
            </v-icon>
          </template>
          <template v-else>
            <p :style="`font-size: ${2.6 - 0.3 * option.value.length}rem`">
              {{ option.value }}
            </p>
          </template>
        </ExerciseButton>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';
import { MatchingItem } from '@/Matching/MatchingTypes';

@Component({
  components: {
    RippleAnimation,
    ExerciseButton,
  },
})
export default class Matching extends Vue {
  colors: Array<string> = ['deep-purple', 'pink', 'orange', 'teal'];

  nonWordColor = 'primary';

  wordColor = '';

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

  selectAndPlay(option: MatchingItem, index: number) {
    this.$data.selected = index;
    this.exerciseItems.forEach((item) => {
      if (item.audio.playing) {
        item.audio.cancel();
      }
    });
    option.audio.play();
  }

  @Watch('selected')
  onSelectedChanged(indexOfSelected: number, indexOfPrevious: number) {
    this.checkForMatchAndReOrder(indexOfSelected, indexOfPrevious);
  }

  public checkForMatchAndReOrder(
    indexOfSelected: number,
    indexOfPrevious: number,
  ) {
    const selectedOption = this.exerciseItems[indexOfSelected];
    const previousOption = this.exerciseItems[indexOfPrevious];

    if (indexOfSelected > -1 && selectedOption.matched) {
      // 1 item selected, but already matched
      this.$data.selected = -1;
      // cancel (potential) previous selection
      if (previousOption) {
        previousOption.selected = false;
        previousOption.color = previousOption.isWord
          ? this.wordColor
          : this.nonWordColor;
      }
    } else if (indexOfPrevious === -1) {
      // nothing was selected, now 1 item is
      //   - color currently selected item
      selectedOption.selected = true;
      [selectedOption.color] = this.colors;
    } else if (indexOfSelected === -1) {
      // if no selection (neither indexOfPrevious nor indexOfSelected): programmatically reset to -1
    } else if (selectedOption && selectedOption.match === indexOfPrevious) {
      // 1 item was selected, now another item is selected
      //   - they are a match
      //     - color same
      [selectedOption.color] = this.colors;
      [previousOption.color] = this.colors;
      this.colors.shift();

      //     - set selection to nothing
      selectedOption.selected = false;
      previousOption.selected = false;
      selectedOption.matched = true;
      previousOption.matched = true;
      this.$data.selected = -1;

      //     - re-order
      // can probably eliminate temp allOptions here
      const allOptions = Object.values(
        this.exerciseItems as Array<MatchingItem>,
      );

      const originalIndexOfSelected = allOptions.indexOf(selectedOption);
      const originalIndexOfPrevious = allOptions.indexOf(previousOption);

      // 1 - put selectedOption and previousOption first, re-link to 1 and 2
      // remove matched pair from collection
      allOptions.splice(allOptions.indexOf(selectedOption), 1);
      allOptions.splice(allOptions.indexOf(previousOption), 1);

      // id latest previous match
      // note: lastMatched is zero-index-based
      let lastMatched = -1;
      allOptions.forEach((item: MatchingItem, index: number) => {
        if (item.matched) {
          lastMatched = index;
        }
      });
      lastMatched += 1;

      // add last selected before the unmatched options
      allOptions.splice(lastMatched, 0, selectedOption);
      // keep relative sort order within pair
      if (originalIndexOfSelected > originalIndexOfPrevious) {
        allOptions.splice(lastMatched, 0, previousOption);
        previousOption.match = lastMatched + 1;
        selectedOption.match = lastMatched;
      } else {
        allOptions.splice(lastMatched + 1, 0, previousOption);
        selectedOption.match = lastMatched + 1;
        previousOption.match = lastMatched;
      }

      // 2 - any 'match' link lower than
      // re-map internal matching given re-ordering
      allOptions.forEach((item) => {
        if (!item.matched) {
          // include new pair in lastMatched
          // if (item.match <= lastMatched + 2) {
          //   // eslint-disable-next-line no-param-reassign
          //   item.match += lastMatched + 2 - item.match + 1;
          // }
          if (
            item.match < originalIndexOfSelected &&
            item.match < originalIndexOfPrevious
          ) {
            // eslint-disable-next-line no-param-reassign
            item.match += 2;
          } else if (
            item.match < originalIndexOfSelected ||
            item.match < originalIndexOfPrevious
          ) {
            // eslint-disable-next-line no-param-reassign
            item.match += 1;
          }
        }
      });

      this.exerciseItems = allOptions;

      // if all options are matched up, continue!
      if (
        !allOptions.reduce((countMatched, item) => {
          return item.matched ? countMatched - 1 : countMatched;
        }, allOptions.length)
      ) {
        // all options have been matched
        // setTimeout(() => {
        this.$store.commit('showContinueButton', true);
        // }, 500);
      }
    } else {
      // 1 item was selected, now another item is selected
      //   - they are not a match
      if (selectedOption.isWord === previousOption.isWord) {
        //   - if the new selection is of same type, then
        //     - revert color of previous selection
        //     - keep current selection
        selectedOption.selected = true;
        // rotate color list
        this.colors.push(this.colors.shift() as string);
        [selectedOption.color] = this.colors;
      } else {
        //   - if new selection is of different type
        //     - revert color
        //     - set selection to nothing
        selectedOption.buzzing = true;
        previousOption.buzzing = true;
        selectedOption.color = selectedOption.isWord
          ? this.wordColor
          : this.nonWordColor;
        selectedOption.selected = false;
        this.$data.selected = -1;
      }
      previousOption.selected = false;
      previousOption.color = previousOption.isWord
        ? this.wordColor
        : this.nonWordColor;
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
