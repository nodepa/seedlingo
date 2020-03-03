<template>
  <v-bottom-navigation app grow dark background-color="primary">
    <v-btn data-test="home-button" :disabled="disableHome" icon to="/">
      <v-icon x-large>{{ mdiHome }}</v-icon>
    </v-btn>
    <v-btn
      icon
      data-test="toggle-instructions-button"
      @click="toggleInstructionsMode()"
    >
      <v-icon v-if="isInstructionsMode" x-large>$instructionsClose</v-icon>
      <v-icon v-else x-large>$instructions</v-icon>
    </v-btn>
  </v-bottom-navigation>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import { mdiHome } from '@mdi/js';

@Component
export default class BottomNavigationBar extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      mdiHome,
      disableHome: true,
    };
  }

  @PropSync('showGetInstructionsGraphic', { type: Boolean })
  syncedShowGetInstructionsGraphic!: boolean;

  @PropSync('isInstructionsMode', { type: Boolean })
  syncedIsInstructionsMode!: boolean;

  toggleInstructionsMode() {
    // Hide GetInstructionsGraphic and enable Home button
    if (this.$props.showGetInstructionsGraphic) {
      // this.$emit('update:show-get-instructions-graphic', false);
      this.syncedShowGetInstructionsGraphic = false;
    }
    if (this.$data.disableHome) {
      this.$data.disableHome = false;
    }

    // Toggle isInstructionsMode
    // this.$emit('update:is-instructions-mode', !this.$props.isInstructionsMode);
    this.syncedIsInstructionsMode = !this.syncedIsInstructionsMode;
  }
}
</script>

<style lang="stylus" scoped></style>
