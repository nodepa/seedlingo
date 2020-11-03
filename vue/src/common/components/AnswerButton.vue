<template>
  <v-btn
    ref="button"
    height="100%"
    block
    raised
    elevation="5"
    :disabled="disabled"
    :color="errorColor ? errorColor : color"
    @click="$emit('click')"
  >
    <slot />
    <RippleAnimation :playing="isPlaying" />
    <RippleAnimation :playing="isPlaying" :delay="200" />
  </v-btn>
</template>

<script lang="ts">
import { Component, Prop, PropSync, Vue, Watch } from 'vue-property-decorator';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';

@Component({
  components: {
    RippleAnimation,
  },
})
export default class AnswerButton extends Vue {
  animation?: Animation;

  // eslint-disable-next-line class-methods-use-this
  data() {
    return {
      errorColor: '',
    };
  }

  @Prop({ default: false }) readonly isPlaying!: boolean;

  @Prop({ default: '' }) readonly color!: string;

  @Prop({ default: false }) readonly disabled!: boolean;

  @PropSync('isBuzzing', { type: Boolean, default: false })
  syncedIsBuzzing!: boolean;

  @Watch('isBuzzing')
  onIsBuzzingChanged(isBuzzing: boolean) {
    if (isBuzzing) {
      this.$data.errorColor = this.$vuetify.theme.currentTheme.error as string;
      this.playAnimation();
    } else {
      this.$data.errorColor = '';
    }
  }

  playAnimation() {
    if (this.animation) {
      this.animation.play();
    } else {
      const keyFrames = [
        { transform: 'translate(0px, 0px)' },
        { transform: 'translate(-3px, 2px)' },
        { transform: 'translate(2px, 2px)' },
        { transform: 'translate(0px, -2px)' },
        { transform: 'translate(-2px, 3px)' },
        { transform: 'translate(0px, 0px)' },
      ];
      this.animation = ((this.$refs.button as Vue).$el as HTMLElement).animate(
        keyFrames,
        {
          duration: 200,
          iterations: 2,
          easing: 'ease-in-out',
        },
      );

      this.animation.onfinish = () => {
        this.syncedIsBuzzing = false;
      };
    }
  }
}
</script>

<style scoped></style>
