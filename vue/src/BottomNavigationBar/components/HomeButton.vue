<template>
  <v-btn
    v-instruction="homeButtonAudio"
    icon
    exact
    :to="{ name: 'Home' }"
    data-test="home-button"
    :disabled="isHomeButtonDisabled"
  >
    <v-icon x-large>{{ mdiHome }}</v-icon>
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { mdiHome } from '@mdi/js';
import homeButtonAudio from '@/assets/audio/home-button.mp3';

@Component
export default class HomeButton extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      homeButtonAudio,
      mdiHome,
    };
  }

  @Prop({ default: false }) readonly isHomeButtonDisabled!: boolean;
}
</script>

<style lang="stylus"></style>
