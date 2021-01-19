<template>
  <v-bottom-navigation
    app
    grow
    height="74"
    color="primary"
    data-test="bottom-navigation-bar"
  >
    <HomeButton :home-button-disabled="homeButtonDisabled" />
    <ContinueButton />
    <InstructionsButton :home-button-disabled.sync="homeButtonDisabled" />
  </v-bottom-navigation>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import HomeButton from './HomeButton.vue';
import ContinueButton from './ContinueButton.vue';
import InstructionsButton from './InstructionsButton.vue';

@Component({
  // eslint-disable-next-line no-undef
  components: {
    HomeButton,
    ContinueButton,
    InstructionsButton,
  },
})
export default class BottomNavigationBar extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): { homeButtonDisabled: boolean } {
    return {
      homeButtonDisabled: this.initiateHomeButtonDisabled,
    };
  }

  @Prop() initiateHomeButtonDisabled!: boolean;
}
</script>

<style lang="stylus"></style>
