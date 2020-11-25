// Libraries, plugins, components
import Vue from 'vue';
import store from '@/store';
import Vuetify from 'vuetify';
import Badge from '@/common/components/Badge.vue';
import RippleAnimation from '@/common/animations/RippleAnimation.vue';

// Helpers
import { pause, play } from '@/test_helpers/FunctionOverrides';

// Item under test
import {
  Instruction,
  InstructionElement,
} from '@/common/directives/InstructionDirective';

window.HTMLMediaElement.prototype.pause = pause;
window.HTMLMediaElement.prototype.play = play;

let vm: Vue;
let instruction: Instruction;
let vuetify: Vuetify;
const audioPath = 'http://just.a.test/audio.mp3';

beforeEach(() => {
  // Setup
  store.dispatch('instructionsStore/resetState');
  vuetify = new Vuetify();
  vm = new Vue({
    render(createElement) {
      return createElement('button');
    },
    store,
    vuetify,
  }).$mount();
  instruction = new Instruction(
    vm.$el as InstructionElement,
    audioPath,
    vm,
    Badge,
    RippleAnimation,
  );

  // As set up in the "bind"-function at directive installation
  if (vm.$store.state.instructionsStore.isInstructionsMode) {
    instruction.addEventListener();
    instruction.addInstructionStyle();
  }
});

afterEach(() => {
  // Teardown
  // As set up in the "unbind"-function at directive installation
  instruction.unsubscribe();
  instruction.removeEventListener();
  instruction.delist();
  vm.$destroy(); // added for full teardown
});

describe('class Instruction', () => {
  it('constructor: functional', () => {
    expect(instruction).toBeInstanceOf(Instruction);
    expect(instruction).toHaveProperty('audioElement');
    expect(instruction).toHaveProperty('vm');
    expect(instruction).toMatchSnapshot();
  });

  it('constructor: instance added to instruction collection', () => {
    expect(Instruction.Collection.length).toBe(1);
  });

  it('addEventListener: adds event listeners', () => {
    const spy = jest.spyOn(vm.$el, 'addEventListener');
    expect(spy).toHaveBeenCalledTimes(0);
    store.dispatch('instructionsStore/toggleInstructionsMode');
    expect(spy).toHaveBeenCalledTimes(1);
    instruction.addEventListener();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('removeEventListener: removes event listeners', () => {
    const spyAdd = jest.spyOn(vm.$el, 'addEventListener');
    const spyRemove = jest.spyOn(vm.$el, 'removeEventListener');
    expect(spyAdd).toHaveBeenCalledTimes(0);
    expect(spyRemove).toHaveBeenCalledTimes(0);
    instruction.addEventListener();
    expect(spyAdd).toHaveBeenCalledTimes(1);
    expect(spyRemove).toHaveBeenCalledTimes(0);
    instruction.removeEventListener();
    expect(spyAdd).toHaveBeenCalledTimes(1);
    expect(spyRemove).toHaveBeenCalledTimes(1);
  });

  it('addInstructionStyle: adds styling to the element', () => {
    // Setup pre-state
    const el = vm.$el as HTMLButtonElement;
    el.style.backgroundColor = '#FF0000';
    el.style.zIndex = '0';
    const elToRemove: Element[] = [];
    for (let i = 0; i < el.children.length; i += 1) {
      if (el.children[i].tagName === 'DIV') {
        elToRemove.push(el.children[i]);
      }
    }
    elToRemove.forEach((element) => {
      element.remove();
    });
    expect(el.childElementCount).toBe(3); // 2 animations, 1 audio

    // Apply function
    instruction.addInstructionStyle();

    // Assert post-state
    expect(el.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(el.style.zIndex).toBe('4');
    expect(el.childElementCount).toBe(4); // 2 animations, 1 audio, 1 badge
    expect(el.children[0].tagName).toBe('SPAN');
    expect(el.children[1].tagName).toBe('SPAN');
    expect(el.children[2].tagName).toBe('AUDIO');
    expect(el.children[3].tagName).toBe('SPAN');
  });

  it('removeInstructionStyle: removes/restores styling to the element', () => {
    // Setup pre-state
    instruction.addInstructionStyle();
    const el = vm.$el as HTMLButtonElement;
    el.style.backgroundColor = '#FF0000';
    el.style.zIndex = '9';
    expect(el.childElementCount).toBe(4); // 2 animations, 1 audio, 1 badge

    // Apply function
    instruction.removeInstructionStyle();

    // Assert post-state
    expect(el.style.backgroundColor).toBe('rgb(255, 0, 0)');
    expect(el.style.zIndex).toBe('');
    expect(el.childElementCount).toBe(3); // 2 animations, 1 audio
    expect(el.children[2].tagName).toBe('AUDIO'); // audio is 3rd elm
  });

  it('playInstruction: plays attached audio', () => {
    // Setup and assert pre-state
    const parentEl = vm.$el;
    expect(parentEl.children[0].tagName).toBe('SPAN');
    expect(parentEl.children[1].tagName).toBe('SPAN');
    const el = parentEl.children[2] as HTMLAudioElement;
    expect(el.tagName).toBe('AUDIO');
    expect(el.src).toBe(audioPath);

    const spy = jest.spyOn(el, 'play');
    expect(spy).toHaveBeenCalledTimes(0);

    // Apply function
    instruction.playInstruction();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('cancelInstruction: stops playing attached audio', () => {
    // Setup and assert pre-state
    const parentEl = vm.$el;
    expect(parentEl.children[0].tagName).toBe('SPAN');
    expect(parentEl.children[1].tagName).toBe('SPAN');
    const el = parentEl.children[2] as HTMLAudioElement;
    expect(el.tagName).toBe('AUDIO');
    expect(el.src).toBe(audioPath);

    const spy = jest.spyOn(el, 'pause');
    expect(spy).toHaveBeenCalledTimes(0);

    // Apply function
    instruction.cancelInstruction();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe: calls unsubscribe function from store', () => {
    // Setup and assert pre-state
    // A side-effect of subscribing a watch to the store's
    // toggleInstructionsMode value, is that - if toggleInstructionsMode is
    // false - cancelInstruction() is called. Conversely, after unsubscribing,
    // cancelInstruction() should no longer be called.
    const spy = jest.spyOn(instruction, 'cancelInstruction');

    // Assert that we can provoke invocation of cancelInstruction()
    expect(spy).toHaveBeenCalledTimes(0);
    store.dispatch('instructionsStore/toggleInstructionsMode');
    store.dispatch('instructionsStore/toggleInstructionsMode');
    expect(spy).toHaveBeenCalledTimes(1);

    // Apply function
    instruction.unsubscribe();

    // Assert that we can NO LONGER provoke invocation of cancelInstruction()
    store.dispatch('instructionsStore/toggleInstructionsMode');
    store.dispatch('instructionsStore/toggleInstructionsMode');
    expect(spy).toHaveBeenCalledTimes(1); // Still 1
  });

  it('delist: current instance is removed from Instruction.Collection', () => {
    const el = Object.values(vm.$el.children).find((elm) => {
      return elm.tagName === 'AUDIO';
    }) as HTMLAudioElement;
    const count = Instruction.Collection.length;
    expect(Instruction.Collection.includes(el)).toBe(true);

    instruction.delist();

    expect(Instruction.Collection.length).toBe(count - 1);
    expect(Instruction.Collection.includes(el)).toBe(false);
  });
});
