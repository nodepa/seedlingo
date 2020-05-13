<template>
  <v-app data-test="app">
    <v-app-bar
      app
      color="primary"
      @click="$vuetify.theme.dark = !$vuetify.theme.dark"
    >
      <div class="d-flex align-center">
        <v-img
          alt="立爱识字 Logo"
          class="shrink mr-2"
          contain
          transition="scale-transition"
          src="./assets/logo/logo.svg"
          width="40"
        />

        <span
          class="shrink mt-1 hidden-sm-and-down white--text"
          min-width="100"
          width="100"
        >
          立爱识字
        </span>
      </div>
    </v-app-bar>

    <v-content>
      <GetInstructions v-if="showGetInstructionsGraphic" />
      <router-view v-if="!showGetInstructionsGraphic" />
      <v-overlay v-if="isInstructionsMode" z-index="4">
        <h1>INSTRUCTIONS</h1>
      </v-overlay>
    </v-content>

    <BottomNavigationBar
      :show-get-instructions-graphic.sync="showGetInstructionsGraphic"
      :is-instructions-mode.sync="isInstructionsMode"
    />
  </v-app>
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import BottomNavigationBar from '@/BottomNavigationBar/components/BottomNavigationBar.vue';
import GetInstructions from '@/Instructions/components/GetInstructions.vue';

@Component({
  components: {
    BottomNavigationBar,
    GetInstructions,
  },
})
export default class App extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      isInstructionsMode: false,
      showGetInstructionsGraphic: true,
    };
  }
}
</script>

<style lang="stylus" scoped>
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
</style>
