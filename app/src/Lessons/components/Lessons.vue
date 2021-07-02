<template>
  <v-list flat rounded data-test="lessons-list">
    <v-list-item v-for="(lesson, order) in lessons" :key="order">
      <v-col cols="6" offset="3">
        <v-btn
          v-instruction="lesson.audio"
          class="pa-5"
          data-test="lesson-button"
          block
          rounded
          elevation="5"
          height="100%"
          color="primary"
          :to="{ path: `lesson/${order}` }"
        >
          <span class="display-3">{{ order }}</span>
          <v-icon x-large>{{ lesson.icon }}</v-icon>
        </v-btn>
      </v-col>
    </v-list-item>
  </v-list>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ContentConfig from '@/Lessons/ContentConfig';
import { LessonMenuItems } from '../LessonMenuTypes';

@Component({
  // eslint-disable-next-line no-undef
  components: {},
})
export default class Lessons extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): {
    lessons: LessonMenuItems;
  } {
    return {
      lessons: ContentConfig.getLessonsMenu(),
    };
  }
}
</script>

<style lang="stylus" scoped></style>
