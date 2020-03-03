<template>
  <v-container fill-height fluid>
    <v-row align="center" justify="center">
      <v-col>
        <Logo height="30vh" />
        <p>(with vue.js)</p>
        <!-- <HelloWorld msg="立爱识字" /> -->
      </v-col>
    </v-row>
  </v-container>
</template>

<script lang="ts">
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!vue-svg-loader!@/assets/logo/logo-col.svg';

export default {
  name: 'Home',
  components: {
    // HelloWorld,
    Logo,
  },
};
</script>

<style lang="stylus" scoped></style>
