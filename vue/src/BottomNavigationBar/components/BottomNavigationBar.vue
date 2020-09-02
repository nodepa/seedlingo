<template>
  <v-bottom-navigation app grow color="primary">
    <HomeButton :is-home-button-disabled="isHomeButtonDisabled" />
    <InstructionsButton
      :show-get-instructions-graphic.sync="syncedShowGetInstructionsGraphic"
      :is-home-button-disabled.sync="isHomeButtonDisabled"
    />
  </v-bottom-navigation>
</template>

<script lang="ts">
import { Component, PropSync, Vue } from 'vue-property-decorator';
import HomeButton from './HomeButton.vue';
import InstructionsButton from './InstructionsButton.vue';

@Component({
  components: {
    HomeButton,
    InstructionsButton,
  },
})
export default class BottomNavigationBar extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      isHomeButtonDisabled: true,
    };
  }

  @PropSync('showGetInstructionsGraphic', { type: Boolean })
  syncedShowGetInstructionsGraphic!: boolean;
}
</script>

<style lang="stylus"></style>
