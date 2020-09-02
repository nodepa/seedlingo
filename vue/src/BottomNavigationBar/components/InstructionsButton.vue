<template>
  <v-btn
    ref="instructionsButton"
    icon
    :input-value="isInstructionsMode"
    data-test="toggle-instructions-button"
    @click="toggleInstructionsMode()"
  >
    <v-icon
      v-if="isInstructionsMode"
      x-large
      data-test="instructions-close-icon"
    >
      $instructionsClose
    </v-icon>
    <v-icon
      v-else
      x-large
      data-test="instructions-icon"
      :class="{ 'highlight-toggle': showGetInstructionsGraphic }"
    >
      $instructions
    </v-icon>
    <audio ref="instructionsButtonAudio" :src="whenYouSeeAnEarAudio" />
  </v-btn>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import whenYouSeeAnEarAudio from '@/assets/audio/when-you-see-an-ear.mp3';
import { Instruction } from '@/common/directives/InstructionDirective';

@Component
export default class InstructionsButton extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      whenYouSeeAnEarAudio,
    };
  }

  get isInstructionsMode() {
    return this.$store.state.instructionsStore.isInstructionsMode;
  }

  @PropSync('showGetInstructionsGraphic', { type: Boolean })
  syncedShowGetInstructionsGraphic!: boolean;

  @PropSync('isHomeButtonDisabled', { type: Boolean })
  syncedIsHomeButtonDisabled!: boolean;

  toggleInstructionsMode() {
    if (this.$props.showGetInstructionsGraphic) {
      this.syncedShowGetInstructionsGraphic = false;

      // Add <audio> element to Instruction.Collection to provoke cancelling whenever another instruction starts playing
      // const audioEl = this.$refs.instructionsButtonAudio as HTMLAudioElement;
      // Instruction.Collection.push(audioEl);
      // audioEl.currentTime = 0;
      // audioEl.play();
    }
    if (this.$props.isHomeButtonDisabled) {
      this.syncedIsHomeButtonDisabled = false;
    }
    if (!this.$store.state.instructionsStore.isInstructionsMode) {
      // Add <audio> element to Instruction.Collection to provoke cancelling whenever another instruction starts playing
      const audioEl = this.$refs.instructionsButtonAudio as HTMLAudioElement;
      Instruction.Collection.push(audioEl);
      audioEl.currentTime = 0;
      audioEl.play();
    }
    // Inform globally that isInstructionsMode should toggle
    this.$store.dispatch('instructionsStore/toggleInstructionsMode');
  }
}
</script>

<style lang="stylus">
.highlight-toggle path
  fill: var(--v-primary-base)
  // color: var(--v-primary-base) !important
</style>
