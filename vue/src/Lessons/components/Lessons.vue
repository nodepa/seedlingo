<template>
  <v-list flat rounded data-test="lessons-list">
    <!-- <v-list-item-group v-model="selectedLesson" color="primary"> -->
    <v-list-item v-for="(lesson, order) in lessons" :key="order">
      <v-col cols="6" offset="3">
        <v-btn
          v-instruction="lesson.audio"
          class="lesson-button"
          data-test="lesson-button"
          x-large
          elevation="5"
          fab
          outlined
          color="primary"
        >
          <span>{{ order }}</span>
          <v-icon>{{ lesson.icon }}</v-icon>
        </v-btn>
      </v-col>
    </v-list-item>
    <!-- </v-list-item-group> -->
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import {
  mdiNumeric,
  mdiTimelapse,
  mdiHumanFemaleBoy,
  mdiHumanMaleGirl,
} from '@mdi/js';
import lesson01Numbers from '@/assets/audio/lesson-01-numbers.mp3';
import lesson02Numbers from '@/assets/audio/lesson-02-numbers.mp3';
import lesson03Family from '@/assets/audio/lesson-03-family.mp3';
import lesson04Family from '@/assets/audio/lesson-04-family.mp3';
import lesson05Time from '@/assets/audio/lesson-05-time.mp3';
import lesson06Time from '@/assets/audio/lesson-06-time.mp3';

@Component({
  components: {},
})
export default class Lessons extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      // selectedLesson: 0,
      lessons: {
        1: {
          name: 'Numbers 1-5',
          icon: mdiNumeric,
          audio: lesson01Numbers,
        },
        2: {
          name: 'Numbers 6-10',
          icon: mdiNumeric,
          audio: lesson02Numbers,
        },
        3: {
          name: 'Family 1',
          icon: mdiHumanFemaleBoy,
          audio: lesson03Family,
        },
        4: {
          name: 'Family 2',
          icon: mdiHumanMaleGirl,
          audio: lesson04Family,
        },
        5: {
          name: 'Time 1',
          icon: mdiTimelapse,
          audio: lesson05Time,
        },
        6: {
          name: 'Time 2',
          icon: mdiTimelapse,
          audio: lesson06Time,
        },
        7: { name: 'More 1', icon: mdiTimelapse, audio: lesson06Time },
        8: { name: 'More 2', icon: mdiTimelapse, audio: lesson06Time },
        9: { name: 'More 3', icon: mdiTimelapse, audio: lesson06Time },
        10: { name: 'More 4', icon: mdiTimelapse, audio: lesson06Time },
        11: { name: 'More 5', icon: mdiTimelapse, audio: lesson06Time },
        12: { name: 'More 6', icon: mdiTimelapse, audio: lesson06Time },
      },
    };
  }
}
</script>

<style lang="stylus" scoped>
.lesson-button
  transform: scale(1.5)
  margin-bottom: 20px
</style>
