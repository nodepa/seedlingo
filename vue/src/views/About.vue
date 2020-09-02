<template>
  <div class="about">
    <h1>About 立爱识字</h1>
    <Logo />
    <p>
      立爱识字 is a literacy education tool developed on behalf of
      <a href="https://liaieducation.com">Li Ai Education</a> as part of a
      research project aiming to empower rural citizens.
    </p>
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

<style lang="stylus" scoped>
svg
  max-width: 50vmin
</style>
