<template>
  <span
    ref="ripple"
    class="ripple"
    :style="{
      '--size': size,
      height: size,
      width: size,
      borderWidth,
      borderColor,
    }"
  />
</template>

<script lang="ts">
import { Component, Prop, Vue, Watch } from 'vue-property-decorator';

@Component
export default class Ripple extends Vue {
  animation?: Animation;

  @Prop({ default: false }) readonly playing!: boolean;

  @Prop({ default: 500 }) readonly duration!: number;

  @Prop({ default: 0 }) readonly delay!: number;

  @Prop({ default: Infinity }) readonly iterations!: number;

  @Prop({ default: '4px' }) readonly borderWidth!: string;

  @Prop({ default: '40px' }) readonly size!: string;

  @Prop({ default: '4' }) readonly scale!: string;

  @Prop({ default: 'rgba(0,0,0,0.2)' }) readonly borderColor!: string;

  @Watch('playing')
  onPlayingChanged(playing: boolean): void {
    if (!playing && this.animation) {
      this.animation.cancel();
    } else {
      this.playAnimation();
    }
  }

  playAnimation(): void {
    if (this.animation) {
      this.animation.play();
    } else {
      const keyFrames = [
        { opacity: '1', transform: 'scale(1, 1)' },
        {
          opacity: '0',
          transform: `scale(${this.scale}, ${this.scale})`,
        },
      ];
      this.animation = (this.$refs.ripple as HTMLElement).animate(keyFrames, {
        delay: this.delay,
        duration: this.$props.duration,
        iterations: this.$props.iterations,
      });
    }
  }
}
</script>

<style lang="stylus">
.ripple
  opacity: 0;
  border-style: solid;
  border-radius: 100%;
  position: absolute;
  // requires :style="{'--size': size}" on element
  top: calc(50% - var(--size)/2);
  left: calc(50% - var(--size)/2);
</style>
