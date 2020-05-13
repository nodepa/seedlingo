<template>
  <v-list flat rounded>
    <!-- <v-list-item-group v-model="selectedLesson" color="primary"> -->
    <v-list-item v-for="(lesson, order) in lessons" :key="order">
      <v-col cols="6" offset="3">
        <v-btn
          class="lesson-button"
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

@Component
export default class Lessons extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      // selectedLesson: 0,
      lessons: {
        1: { name: 'Numbers 1-5', icon: mdiNumeric },
        2: { name: 'Numbers 6-10', icon: mdiNumeric },
        3: { name: 'Family 1', icon: mdiHumanFemaleBoy },
        4: { name: 'Family 2', icon: mdiHumanMaleGirl },
        5: { name: 'Sentences 1', icon: mdiTimelapse },
        6: { name: 'Sentences 2', icon: mdiTimelapse },
        7: { name: 'More 1', icon: mdiTimelapse },
        8: { name: 'More 2', icon: mdiTimelapse },
        9: { name: 'More 3', icon: mdiTimelapse },
        10: { name: 'More 4', icon: mdiTimelapse },
        11: { name: 'More 5', icon: mdiTimelapse },
        12: { name: 'More 6', icon: mdiTimelapse },
      },
    };
  }
}
</script>

<style lang="sass" scoped>
.lesson-button
  transform: scale(1.5)
  margin-bottom: 20px
</style>
