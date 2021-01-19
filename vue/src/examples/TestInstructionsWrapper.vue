<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <h3>Wrapper Test</h3>
        <v-list flat rounded data-test="lessons-list">
          <v-list-item>
            <v-col cols="6" offset="3">
              <InstructionsWrapper @click="say('wrapped')">
                <v-btn
                  class="lesson-button"
                  data-test="lesson-button"
                  x-large
                  elevation="5"
                  fab
                  outlined
                  color="primary"
                  @click="say('buttoned')"
                >
                  <span>Wr</span>
                  <v-icon>{{ mdiWrap }}</v-icon>
                </v-btn>
              </InstructionsWrapper>
              <v-btn
                v-instruction="instructionAudioPath"
                class="lesson-button"
                data-test="lesson-button"
                x-large
                elevation="5"
                fab
                outlined
                color="primary"
                @click="say('buttoned')"
              >
                <span>Di</span>
                <v-icon>{{ mdiTransferRight }}</v-icon>
              </v-btn>
              <v-btn
                class="lesson-button"
                data-test="lesson-button"
                x-large
                elevation="5"
                fab
                outlined
                color="primary"
                @click="say('buttoned')"
              >
                <span>No</span>
                <v-icon>{{ mdiStandardDefinition }}</v-icon>
              </v-btn>
            </v-col>
          </v-list-item>
        </v-list>
        <v-bottom-navigation grow>
          <v-btn exact :to="{ name: 'InstrPlay' }" data-test="home-button">
            <span>Player</span>
            <v-icon x-large>{{ mdiPlay }}</v-icon>
            <!-- <InstructionsPlayer /> -->
          </v-btn>
        </v-bottom-navigation>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InstructionsWrapper from '@/examples/InstructionsWrapper.vue';
import instructionAudioPath from '@/assets/audio/instructions/欢迎.mp3';
import {
  mdiPlay,
  mdiStandardDefinition,
  mdiTransferRight,
  mdiWrap,
} from '@mdi/js';

@Component({
  // eslint-disable-next-line no-undef
  components: {
    InstructionsWrapper,
  },
})
export default class InstructionsWrapperView extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): {
    instructionAudioPath: string;
    mdiPlay: string;
    mdiStandardDefinition: string;
    mdiTransferRight: string;
    mdiWrap: string;
  } {
    return {
      instructionAudioPath,
      mdiPlay,
      mdiStandardDefinition,
      mdiTransferRight,
      mdiWrap,
    };
  }

  // eslint-disable-next-line class-methods-use-this
  say(msg: string): void {
    // eslint-disable-next-line no-console
    console.log(msg);
  }
}
</script>

<style lang="stylus" scoped>
.lesson-button
  transform: scale(1.5)
  margin-bottom: 50px
</style>
