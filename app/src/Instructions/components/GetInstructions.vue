<template>
  <v-container data-test="get-instructions-component" fill-height fluid>
    <v-row align="center" justify="center">
      <v-col fill-height>
        <GetInstructionsGraphic class="get-instructions-graphic" />
        <audio autoplay :src="welcomeInstructionPath" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import ContentConfig from '@/Lessons/ContentConfig';
import GetInstructionsGraphic from './GetInstructionsGraphic.vue';

@Component({
  // eslint-disable-next-line no-undef
  components: {
    GetInstructionsGraphic,
  },
})
export default class GetInstructions extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data(): { welcomeInstructionPath: string } {
    return {
      welcomeInstructionPath: 'await-async-path-in-mounted',
    };
  }

  mounted(): void {
    ContentConfig.getInstructionPathFor('welcome').then(({ default: path }) => {
      this.$data.welcomeInstructionPath = path;
    });
  }
}
</script>

<style lang="stylus">
.get-instructions-graphic
  height 70vh
  max-width 100%

.get-instructions-graphic g
  animation touch 3s linear infinite

@keyframes touch
  0%, 20%, 40%
    transform translate(0px, 0px)

  24%, 36%
    transform translate(-100px, 40px)
</style>
