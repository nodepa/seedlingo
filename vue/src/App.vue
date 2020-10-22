<template>
  <v-app data-test="app">
    <v-app-bar app flat color="background">
      <div class="d-flex align-center">
        <v-img
          alt="种字立爱 Logo"
          class="shrink mr-2"
          contain
          transition="scale-transition"
          src="@/assets/logo/logo.svg"
          width="40"
          height="40"
          :style="
            `border-radius: 100%; background-color: ${$vuetify.theme.currentTheme.primary}`
          "
          @click="$vuetify.theme.dark = !$vuetify.theme.dark"
        />
        <span
          :class="`shrink mt-1${branch && jobId ? '' : ' hidden-sm-and-down'}`"
          min-width="100"
          width="100"
        >
          种字立爱
        </span>
        <span class="caption white--text" if="branch && jobId"
          >({{ branch }}/{{ jobId }})
        </span>
      </div>
    </v-app-bar>

    <v-main>
      <GetInstructions v-if="showGetInstructionsGraphic" />
      <router-view v-if="!showGetInstructionsGraphic" />
      <v-overlay
        v-if="isInstructionsMode"
        z-index="3"
        data-test="instructions-overlay"
      />
    </v-main>

    <BottomNavigationBar />
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
      branch: process.env.VUE_APP_BRANCH,
      jobId: process.env.VUE_APP_JOB_ID.replaceAll('0', ''),
    };
  }

  get showGetInstructionsGraphic() {
    return (
      this.$route.name === 'Home' &&
      this.$store.state.instructionsStore.showGetInstructionsGraphic
    );
  }

  get isInstructionsMode() {
    return this.$store.state.instructionsStore.isInstructionsMode;
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
