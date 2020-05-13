<template>
  <!-- <v-bottom-navigation app grow dark background-color="primary"> -->
  <v-bottom-navigation app grow color="primary">
    <v-btn
      icon
      exact
      :to="{ name: 'Home' }"
      data-test="home-button"
      :disabled="isHomeButtonDisabled"
    >
      <v-icon x-large>{{ mdiHome }}</v-icon>
    </v-btn>
    <v-btn
      icon
      :input-value="syncedIsInstructionsMode"
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
      isHomeButtonDisabled: true,
    };
  }

  @PropSync('showGetInstructionsGraphic', { type: Boolean })
  syncedShowGetInstructionsGraphic!: boolean;

  @PropSync('isInstructionsMode', { type: Boolean })
  syncedIsInstructionsMode!: boolean;

  toggleInstructionsMode() {
    // Hide GetInstructionsGraphic and enable Home button
    if (this.$props.showGetInstructionsGraphic) {
      this.syncedShowGetInstructionsGraphic = false;
    }
    if (this.$data.isHomeButtonDisabled) {
      this.$data.isHomeButtonDisabled = false;
    }

    // Toggle isInstructionsMode
    this.syncedIsInstructionsMode = !this.syncedIsInstructionsMode;
  }
}
</script>

<style lang="stylus" scoped></style>
