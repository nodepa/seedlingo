<template>
  <audio ref="instructionsAudio" :src="AudioPath" />
</template>

<script lang="ts">
// How to pass audio path to mixin?
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class InstructionsMixin extends Vue {
  @Prop(String) AudioPath!: string;

  Audio = new Audio(this.AudioPath);

  person = 'Bob';

  hello(): void {
    this.say(`Hello ${this.person}`);
  }

  created(): void {
    this.say('mixin created');
    this.hello();
    this.say(this.$children.length);
  }

  // eslint-disable-next-line class-methods-use-this
  say(msg: string | number): void {
    // eslint-disable-next-line no-console
    console.log(msg);
  }
}
</script>

<style lang="stylus" scoped>
a
  border: 1px solid red

.mytest
  background-color: rgba(255,0,0,0.5)
</style>
