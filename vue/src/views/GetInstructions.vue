<template>
  <v-container fill-height fluid data-test="get-instructions-component">
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
// eslint-disable-next-line import/no-webpack-loader-syntax
import GetInstructionsGraphic from '@/components/graphics/GetInstructionsGraphic.vue';

export default {
  name: 'GetInstructions',
  components: {
    GetInstructionsGraphic,
  },
};
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
