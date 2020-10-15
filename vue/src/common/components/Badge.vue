<template>
  <span class="badge-container">
    <span class="badge primary white--text">
      <InstructionsIcon />
    </span>
  </span>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import InstructionsIcon from '@/common/icons/InstructionsIcon.vue';

@Component({
  components: {
    InstructionsIcon,
  },
})
export default class Badge extends Vue {}
</script>

<style lang="stylus">
.badge-container
  position: absolute;
  top: inherit;
  left: inherit;
  width: 100%;
  height: 100%;
.badge
  position: absolute;
  border-radius: 100%;
  padding: 2px;
  z-index: 5;
  top: 52%;
  left: 52%;
  width: 3em;
  height: 3em;
</style>
