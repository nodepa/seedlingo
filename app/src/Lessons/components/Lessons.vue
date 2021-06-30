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
import {
  mdiNumeric,
  mdiHumanFemaleBoy,
  mdiHumanMaleGirl,
  mdiHumanMaleChild,
  mdiHumanMaleBoy,
  mdiHumanFemaleGirl,
} from '@mdi/js';
import 说明第一课 from '@/Lessons/data/instructions/说明第一课.mp3';
import 说明第二课 from '@/Lessons/data/instructions/说明第二课.mp3';
import 说明第三课 from '@/Lessons/data/instructions/说明第三课.mp3';
import 说明第四课 from '@/Lessons/data/instructions/说明第四课.mp3';
import 说明第五课 from '@/Lessons/data/instructions/说明第五课.mp3';
import 说明第六课 from '@/Lessons/data/instructions/说明第六课.mp3';
import 说明第七课 from '@/Lessons/data/instructions/说明第七课.mp3';
import 说明第八课 from '@/Lessons/data/instructions/说明第八课.mp3';
import 说明第九课 from '@/Lessons/data/instructions/说明第九课.mp3';
import 说明第十课 from '@/Lessons/data/instructions/说明第十课.mp3';

@Component({
  // eslint-disable-next-line no-undef
  components: {},
})
export default class Lessons extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): {
    lessons: { [index: number]: { name: string; icon: string; audio: string } };
  } {
    return {
      lessons: {
        1: {
          name: 'Numbers 1-5',
          icon: mdiNumeric,
          audio: 说明第一课,
        },
        2: {
          name: 'Numbers 6-10',
          icon: mdiNumeric,
          audio: 说明第二课,
        },
        3: {
          name: 'Family 1',
          icon: mdiHumanFemaleBoy,
          audio: 说明第三课,
        },
        4: {
          name: 'Family 2',
          icon: mdiHumanFemaleGirl,
          audio: 说明第四课,
        },
        5: {
          name: 'Family 3',
          icon: mdiHumanFemaleBoy,
          audio: 说明第五课,
        },
        6: {
          name: 'Family 4',
          icon: mdiHumanFemaleGirl,
          audio: 说明第六课,
        },
        7: {
          name: 'Family 5',
          icon: mdiHumanMaleBoy,
          audio: 说明第七课,
        },
        8: {
          name: 'Family 6',
          icon: mdiHumanMaleGirl,
          audio: 说明第八课,
        },
        9: {
          name: 'Family 7',
          icon: mdiHumanMaleChild,
          audio: 说明第九课,
        },
        10: {
          name: 'Family 8',
          icon: mdiHumanMaleChild,
          audio: 说明第十课,
        },
      },
    };
  }
}
</script>

<style lang="stylus" scoped></style>
