<template>
  <transition>
    <v-btn
      v-if="showContinueButton()"
      ref="continueButton"
      v-instruction="continueInstructionPath"
      color="success"
      data-test="continue-button"
      icon
      @click="$store.commit('showContinueButton', false)"
    >
      <v-icon size="50" color="success">{{ mdiForward }}</v-icon>
    </v-btn>
  </transition>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { mdiForward } from '@mdi/js';
import ContentConfig from '@/Lessons/ContentConfig';

@Component
export default class ContinueButton extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): { mdiForward: string; continueInstructionPath: string } {
    return {
      mdiForward,
      continueInstructionPath: 'await-async-path-in-mounted',
    };
  }

  showContinueButton(): boolean {
    return this.$store.state.showContinueButton;
  }

  mounted(): void {
    ContentConfig.getInstructionPathFor('continueButton').then(
      ({ default: path }) => {
        this.$data.continueInstructionPath = path;
      },
    );

    this.$watch(
      () => {
        return this.showContinueButton();
      },
      (show: boolean) => {
        if (show) {
          const animation = (this.$refs.continueButton as Vue).$el.animate(
            [
              { backgroundColor: 'inherit' },
              {
                backgroundColor: `${this.$vuetify.theme.currentTheme.success}66`,
              },
              { backgroundColor: 'inherit' },
            ],
            { duration: 1300, iterations: Infinity },
          );

          (this.$refs.continueButton as Vue).$el.addEventListener(
            'click',
            () => {
              animation.cancel();
            },
          );
        }
      },
    );
  }
}
</script>

<style lang="stylus"></style>
