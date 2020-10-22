<template>
  <v-bottom-navigation app grow height="74" color="primary">
    <HomeButton :is-home-button-disabled="isHomeButtonDisabled" />
    <InstructionsButton :is-home-button-disabled.sync="isHomeButtonDisabled" />
  </v-bottom-navigation>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
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
}
</script>

<style lang="stylus"></style>
