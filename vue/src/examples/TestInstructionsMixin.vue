<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <h3>Mixin Test</h3>
        <v-list flat rounded data-test="lessons-list">
          <v-list-item>
            <v-col cols="6" offset="3">
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
                <span>Mi</span>
                <v-icon>{{ mdiDatabaseImport }}</v-icon>
              </v-btn>
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
          <v-btn exact :to="{ name: 'InstrMix' }" data-test="home-button">
            <span>Mixin</span>
            <v-icon x-large>{{ mdiDatabaseImport }}</v-icon>
          </v-btn>
        </v-bottom-navigation>
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Mixins } from 'vue-property-decorator';
import InstructionsMixin from '@/examples/InstructionsMixin.vue';
import instructionAudioPath from '@/assets/audio/instructions/欢迎.mp3';
import {
  mdiDatabaseImport,
  mdiStandardDefinition,
  mdiTransferRight,
  mdiWrap,
} from '@mdi/js';

@Component({
  // eslint-disable-next-line no-undef
  components: {},
})
export default class InstructionsMixinView extends Mixins(InstructionsMixin) {
  // eslint-disable-next-line class-methods-use-this
  data(): {
    instructionAudioPath: string;
    mdiDatabaseImport: string;
    mdiStandardDefinition: string;
    mdiTransferRight: string;
    mdiWrap: string;
  } {
    return {
      instructionAudioPath,
      mdiDatabaseImport,
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
