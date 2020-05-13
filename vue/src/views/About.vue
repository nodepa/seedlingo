<template>
  <div class="about">
    <h1>About</h1>
    <Logo />
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
// eslint-disable-next-line import/no-webpack-loader-syntax
import Logo from '!vue-svg-loader!@/assets/logo/logo-col.svg';

@Component({
  components: {
    Logo,
  },
})
export default class About extends Vue {}
</script>

<style lang="stylus" scoped></style>
