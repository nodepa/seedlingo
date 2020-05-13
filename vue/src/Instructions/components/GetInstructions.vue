<template>
  <v-container data-test="get-instructions-component" fill-height fluid>
    <v-row align="center" justify="center">
      <v-col fill-height>
        <GetInstructionsGraphic
          class="get-instructions-graphic"
          height="60vh"
        />
        <audio autoplay :src="getInstructionsAudioPath" />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import getInstructionsAudioPath from '@/assets/audio/get-instructions.mp3';
import GetInstructionsGraphic from './GetInstructionsGraphic.vue';

@Component({
  components: {
    GetInstructionsGraphic,
  },
})
export default class GetInstructions extends Vue {
  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      getInstructionsAudioPath,
    };
  }
}
</script>

<style lang="stylus">
.get-instructions-graphic g
  animation touch 3s linear infinite

@keyframes touch
  0%, 20%, 40%
    transform translate(0px, 0px)

  24%, 36%
    transform translate(-100px, 40px)
</style>
