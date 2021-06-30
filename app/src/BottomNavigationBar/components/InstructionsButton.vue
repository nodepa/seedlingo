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
      data-test="instructions-close-icon"
      x-large
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
    <audio ref="instructionsButtonAudio" :src="说明耳朵" />
  </v-btn>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import 说明耳朵 from '@/Lessons/data/instructions/说明耳朵.mp3';
import { Instruction } from '@/common/directives/InstructionDirective';

@Component
export default class InstructionsButton extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): { 说明耳朵: string } {
    return {
      说明耳朵,
    };
  }

  get isInstructionsMode(): boolean {
    return this.$store.state.instructionsStore.isInstructionsMode;
  }

  get showGetInstructionsGraphic(): boolean {
    return this.$store.state.instructionsStore.showGetInstructionsGraphic;
  }

  @PropSync('homeButtonDisabled', { type: Boolean })
  syncedHomeButtonDisabled!: boolean;

  toggleInstructionsMode(): void {
    if (this.showGetInstructionsGraphic) {
      this.$store.dispatch(
        'instructionsStore/setShowGetInstructionsGraphic',
        false,
      );

      // Add <audio> element to Instruction.Collection to provoke cancelling whenever another instruction starts playing
      const audioEl = this.$refs.instructionsButtonAudio as HTMLAudioElement;
      Instruction.Collection.push(audioEl);
      audioEl.currentTime = 0;
      audioEl.play();
    }

    if (this.$props.homeButtonDisabled) {
      this.syncedHomeButtonDisabled = false;
    }

    // Inform globally that isInstructionsMode should toggle
    this.$store.dispatch('instructionsStore/toggleInstructionsMode');
  }

  mounted(): void {
    if (this.showGetInstructionsGraphic) {
      const animation = (this.$refs.instructionsButton as Vue).$el.animate(
        [
          { backgroundColor: 'inherit' },
          {
            backgroundColor: `${this.$vuetify.theme.currentTheme.accent}66`,
          },
          { backgroundColor: 'inherit' },
        ],
        { duration: 1300, iterations: Infinity },
      );

      (this.$refs.instructionsButton as Vue).$el.addEventListener(
        'click',
        () => {
          animation.cancel();
        },
      );
    }
  }
}
</script>

<style lang="stylus">
.highlight-toggle path
  fill: var(--v-primary-base)
  // color: var(--v-primary-base) !important
</style>
