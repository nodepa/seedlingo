<template>
  <v-app data-test="app">
    <v-app-bar app color="primary" dark>
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
          class="shrink mt-1 hidden-sm-and-down"
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
      <v-overlay v-if="isInstructionsMode" absolute>
        <h1>INSTRUCTIONS</h1>
      </v-overlay>
    </v-content>

    <BottomNavigationBar
      :show-get-instructions-graphic.sync="showGetInstructionsGraphic"
      :is-instructions-mode.sync="isInstructionsMode"
    />
    <!-- :show-instructions="isInstructionsMode"
      @update:show-instructions="onUpdateShowInstructions" -->
    <!-- @update:show-instructions="isInstructionsMode = $event" -->
  </v-app>
</template>

<script lang="ts">
// @ is an alias to /src
import Vue from 'vue';
import Component from 'vue-class-component';
import BottomNavigationBar from '@/components/BottomNavigationBar.vue';
import { mdiHome } from '@mdi/js';
// import GetInstructionsGraphic from '@/components/graphics/GetInstructionsGraphic.vue';
import GetInstructions from '@/components/GetInstructions.vue';

@Component({
  name: 'App',

  components: {
    BottomNavigationBar,
    GetInstructions,
  },

  data: () => ({
    isInstructionsMode: false,
    showGetInstructionsGraphic: true,
    mdiHome,
  }),

  // .eslintrc: no-console not allowed in prod
  // watch: {
  //   isInstructionsMode() {
  //     console.log(
  //       `isInstructionsMode in App changed to: ${this.$data.isInstructionsMode}`,
  //     );
  //   },
  //   showGetInstructionsGraphic() {
  //     console.log(
  //       `showGetInstructionsGraphic in App changed to: ${this.$data.showGetInstructionsGraphic}`,
  //     );
  //   },
  // },

  methods: {},
})
export default class extends Vue {}
</script>

<style lang="stylus" scoped>
#app
  font-family Avenir, Helvetica, Arial, sans-serif
  -webkit-font-smoothing antialiased
  -moz-osx-font-smoothing grayscale
  text-align center
</style>
