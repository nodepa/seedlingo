<template>
  <v-btn
    v-instruction="说明回家"
    icon
    exact
    :to="{ name: 'Home' }"
    data-test="home-button"
    :disabled="homeButtonDisabled"
    @click="$store.commit('showContinueButton', false)"
  >
    <v-icon x-large>{{ mdiHome }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mdiHome } from '@mdi/js';
import 说明回家 from '@/assets/audio/instructions/说明回家.mp3';

@Component
export default class HomeButton extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): { 说明回家: string; mdiHome: string } {
    return {
      说明回家,
      mdiHome,
    };
  }

  @Prop({ default: false }) readonly homeButtonDisabled!: boolean;
}
</script>

<style lang="stylus" scoped></style>
