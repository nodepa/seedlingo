<template>
  <!-- <v-badge overlap icon="$instructions"> -->
  <div class="instructions-wrapper" @click.capture.stop="say('divved')">
    <v-badge overlap icon="$instructions">
      <slot @click="say('slotted')" />
    </v-badge>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component
export default class InstructionsWrapper extends Vue {
  // eslint-disable-next-line class-methods-use-this
  say(msg: string) {
    // eslint-disable-next-line no-console
    console.log(msg);
  }
}
</script>

<style lang="stylus">
.instructions-wrapper
  z-index: 4
.instructions-wrapper button
  z-index: 4
</style>
