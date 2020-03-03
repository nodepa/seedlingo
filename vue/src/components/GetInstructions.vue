<template>
  <v-container data-test="get-instructions-component" fill-height fluid>
    <v-row align="center" justify="center">
      <v-col fill-height>
        <GetInstructionsGraphic
          class="get-instructions-graphic"
          height="70vh"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import GetInstructionsGraphic from '@/components/graphics/GetInstructionsGraphic.vue';

@Component({
  components: {
    GetInstructionsGraphic,
  },
})
export default class GetInstructions extends Vue {}
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
