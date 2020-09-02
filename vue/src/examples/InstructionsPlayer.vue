<template>
  <!-- <v-badge overlap icon="$instructions"> -->
  <span class="instructions-player" @click.capture.stop="say('played')">
    <v-badge overlap icon="$instructions" />
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class InstructionsPlayer extends Vue {
  // eslint-disable-next-line class-methods-use-this
  say(msg: string) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }
}
</script>

<style lang="stylus">
.instructions-player
  z-index: 5
  // position: fixed
  position: absolute
  top: 0px
  left: 0px
  width: 100%
  height: 100%
  background-color: rgba(200, 0, 0, 0.5)
</style>
