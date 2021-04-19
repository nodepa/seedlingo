<template>
  <div class="about">
    <h1>立爱种字</h1>
    <Logo />
    <p class="px-14">
      立爱种字 is a literacy education tool developed on behalf of
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
  // eslint-disable-next-line no-undef
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
