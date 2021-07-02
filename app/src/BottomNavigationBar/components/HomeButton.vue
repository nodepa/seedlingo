<template>
  <v-btn
    v-instruction="homeInstructionPath"
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
import ContentConfig from '@/Lessons/ContentConfig';

@Component
export default class HomeButton extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): { homeInstructionPath: string; mdiHome: string } {
    return {
      homeInstructionPath: 'await-async-path-in-mounted',
      mdiHome,
    };
  }

  @Prop({ default: false }) readonly homeButtonDisabled!: boolean;

  mounted(): void {
    ContentConfig.getInstructionPathFor('homeButton').then(
      ({ default: path }) => {
        this.$data.homeInstructionPath = path;
      },
    );
  }
}
</script>

<style lang="stylus" scoped></style>
