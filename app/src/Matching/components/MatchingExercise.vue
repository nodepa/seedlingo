<script setup lang="ts">
import { computed, ComputedRef, Ref, ref, watch } from 'vue';
import { useStore } from 'vuex';
import { earOutline } from 'ionicons/icons';
import { IonCol, IonGrid, IonIcon, IonRow } from '@ionic/vue';
import ExerciseButton from '@/common/components/ExerciseButton.vue';
import Content from '@/Content/Content';
import getSpacing from '../utils/GetSpacing';
import calcFontSize from '@/common/utils/CalcFontSize';
import type { MatchingExercise, MatchingItem } from '../MatchingTypes';

const startColors = ['purple', 'pink', 'orange', 'teal'];
const colors: Array<string> = Array.from(startColors);
const selected: Ref<number> = ref(-1);
function reset() {
  colors.push(...startColors);
  selected.value = -1;
}

const props = defineProps<{ exerciseProp: MatchingExercise }>();
const localExercise = ref<MatchingExercise>({ items: [] });
const exercise = computed({
  get: () => {
    if (localExercise.value.items.length === 0) {
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      localExercise.value = props.exerciseProp;
    }
    return localExercise.value as MatchingExercise;
  },
  set: (exercise: MatchingExercise): void => {
    localExercise.value = exercise;
  },
});
watch(
  () => props.exerciseProp,
  (exerciseProp: MatchingExercise) => {
    reset();
    exercise.value = exerciseProp;
  },
);

const nonWordColor = 'card';
const wordColor = 'primary';
function selectAndPlay(option: MatchingItem, index: number): void {
  selected.value = index;
  exercise.value.items.forEach((item) => {
    if (item.audio?.playing) {
      item.audio.cancel();
    }
  });
  if (option.audio && option.audio.play) {
    // handle new selection (see watch(selected, ...)) before playing audio
    setTimeout(() => {
      // suppress audio unless unsuppressed, is a word, or has been solved/matched
      if (
        exercise.value.unsuppressWordAudio ||
        !option.isWord ||
        option.matched
      ) {
        option.audio?.play();
      }
    }, 0);
  }
}

watch(selected, (indexOfSelected: number, indexOfPrevious: number) => {
  checkForMatchAndReOrder(indexOfSelected, indexOfPrevious);
});

const store = useStore();
function checkForMatchAndReOrder(
  indexOfSelected: number,
  indexOfPrevious: number,
): void {
  const selectedOption = exercise.value.items[indexOfSelected];
  const previousOption = exercise.value.items[indexOfPrevious];

  if (indexOfSelected > -1 && selectedOption.matched) {
    // 1 item selected, but already matched
    selected.value = -1;
    // cancel (potential) previous selection
    if (previousOption) {
      previousOption.selected = false;
      previousOption.color = previousOption.isWord ? wordColor : nonWordColor;
    }
  } else if (indexOfPrevious === -1) {
    // nothing was selected, now 1 item is
    //   - color currently selected item
    selectedOption.selected = true;
    [selectedOption.color] = colors;
  } else if (indexOfSelected === -1) {
    // if no selection (neither indexOfPrevious nor indexOfSelected): programmatically reset to -1
  } else if (selectedOption && selectedOption.match === indexOfPrevious) {
    // 1 item was selected, now another item is selected
    //   - they are a match
    //     - color same
    [selectedOption.color] = colors;
    [previousOption.color] = colors;
    colors.shift();

    //     - set selection to nothing
    selectedOption.selected = false;
    previousOption.selected = false;
    selectedOption.matched = true;
    previousOption.matched = true;
    selected.value = -1;

    //     - re-order
    // can probably eliminate temp allOptions here
    const allOptions = Object.values(
      exercise.value.items as Array<MatchingItem>,
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
        //   item.match += lastMatched + 2 - item.match + 1
        // }
        if (
          item.match < originalIndexOfSelected &&
          item.match < originalIndexOfPrevious
        ) {
          item.match += 2;
        } else if (
          item.match < originalIndexOfSelected ||
          item.match < originalIndexOfPrevious
        ) {
          item.match += 1;
        }
      }
    });

    exercise.value.items = allOptions;

    // if all options are matched up, continue!
    if (
      !allOptions.reduce((countMatched, item) => {
        return item.matched ? countMatched - 1 : countMatched;
      }, allOptions.length)
    ) {
      // all options have been matched
      store.dispatch('setShowContinueButton', true);
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
      colors.push(colors.shift() as string);
      [selectedOption.color] = colors;
    } else {
      //   - if new selection is of different type
      //     - revert color
      //     - set selection to nothing
      selectedOption.buzzing = true;
      previousOption.buzzing = true;
      selectedOption.color = selectedOption.isWord ? wordColor : nonWordColor;
      selectedOption.selected = false;
      selected.value = -1;
    }
    previousOption.selected = false;
    previousOption.color = previousOption.isWord ? wordColor : nonWordColor;
  }
}

const matchingInstructionsPath: ComputedRef<string> = computed(() => {
  return Content.getInstructionsAudio('matchingExercise');
});
</script>

<template>
  <ion-grid fixed style="max-height: 100%">
    <ion-row class="ion-justify-content-center" style="height: 100%">
      <ion-col
        v-for="(option, index) in exercise.items"
        :key="index"
        size="6"
        :style="`width: 100%; height: calc(100% / ${exercise.items.length / 2});  padding: 0.5rem;`"
      >
        <ExerciseButton
          v-model:buzzing="option.buzzing"
          v-instructions="matchingInstructionsPath"
          :data-test="`option-button-${+index + 1}`"
          :playing="option.audio && option.audio.playing"
          :color="option.color || (option.isWord ? wordColor : nonWordColor)"
          style="width: 100%; height: 100%"
          @click="selectAndPlay(option, +index)"
        >
          <template v-if="option.isIcon">
            <ion-icon
              v-for="(icon, iconIndex) in option.wordOrIcons.length
                ? option.wordOrIcons
                : [earOutline]"
              :key="iconIndex"
              :style="`font-size: 4.0rem; ${getSpacing(option.wordOrIcons.length, +iconIndex)}`"
              :icon="icon"
            />
          </template>
          <template v-else-if="option.picture && option.picture.length > 0">
            <img
              :src="option.picture"
              style="width: 100%; height: 100%; object-fit: contain"
            />
          </template>
          <template v-else>
            <span
              :style="`
                font-size: ${calcFontSize(2.5, 1, 10, 'rem', option.wordOrIcons as string, 5)};
                margin: 0px;
                white-space: break-spaces;
              `"
            >
              {{ option.wordOrIcons }}
            </span>
          </template>
        </ExerciseButton>
      </ion-col>
    </ion-row>
  </ion-grid>
</template>
