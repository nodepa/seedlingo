// Libraries, plugins, components
import { Store } from 'vuex';
import store from '@/common/store/RootStore';
import Badge from '@/common/components/Badge.vue';

// Helpers
import { mount, VueWrapper } from '@vue/test-utils';
import { pause, play } from '@/test-support/MockImplementations';
window.HTMLMediaElement.prototype.pause = pause;
window.HTMLMediaElement.prototype.play = play;

// Item under test
import {
  Instructions,
  InstructionsElement,
  InstructionsModeRootState,
} from '@/common/directives/InstructionsDirective';

const spyAddAudioListeners = jest.spyOn(
  Instructions.prototype,
  'addAudioListeners',
);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let wrapper: VueWrapper<any>;
let instructions: Instructions;
const audioPath = 'http://just.a.test/audio.mp3';

beforeEach(() => {
  // Setup
  store.dispatch('resetState');
  spyAddAudioListeners.mockClear();

  wrapper = mount(
    {
      template: `<button />`,
    },
    {
      global: {
        plugins: [store],
      },
    },
  );

  instructions = new Instructions(
    wrapper.vm.$el as InstructionsElement,
    audioPath,
    wrapper.vm,
    Badge,
    store as Store<InstructionsModeRootState>,
  );

  // Replicates the "bind"-function
  if (wrapper.vm.$store.state.instructionsModeStore.isInstructionsMode) {
    instructions.addEventListener();
    instructions.addStyling();
  }
});

afterEach(() => {
  // Replicates the "unbind"-function
  instructions.unsubscribe();
  instructions.removeEventListener();
  instructions.delist();
});

describe('class Instructions', () => {
  it('constructor: functional', () => {
    expect(instructions).toBeInstanceOf(Instructions);
    expect(instructions).toHaveProperty('audioElement');
    expect(instructions).toHaveProperty('vm');
  });

  it('constructor: instance added to instructions collection', () => {
    expect(Instructions.AudioCollection.length).toBe(1);
  });

  it('addEventListener: adds event listeners', () => {
    const spy = jest.spyOn(wrapper.vm.$el, 'addEventListener');
    expect(spy).toHaveBeenCalledTimes(0);
    store.dispatch('instructionsModeStore/toggleInstructionsMode');
    expect(spy).toHaveBeenCalledTimes(1);
    instructions.addEventListener();
    expect(spy).toHaveBeenCalledTimes(2);
  });

  it('addAudioListeners: adds event listeners', () => {
    const spyAudioAddEventListener = jest.spyOn(
      HTMLAudioElement.prototype,
      'addEventListener',
    );
    expect(spyAddAudioListeners).toHaveBeenCalledTimes(1);
    spyAudioAddEventListener.mockClear();
    instructions.addAudioListeners();
    expect(spyAddAudioListeners).toHaveBeenCalledTimes(2);
    expect(spyAudioAddEventListener).toHaveBeenCalledTimes(3);
  });

  it('removeEventListener: removes event listeners', () => {
    const spyAdd = jest.spyOn(wrapper.vm.$el, 'addEventListener');
    const spyRemove = jest.spyOn(wrapper.vm.$el, 'removeEventListener');
    expect(spyAdd).toHaveBeenCalledTimes(0);
    expect(spyRemove).toHaveBeenCalledTimes(0);
    instructions.addEventListener();
    expect(spyAdd).toHaveBeenCalledTimes(1);
    expect(spyRemove).toHaveBeenCalledTimes(0);
    instructions.removeEventListener();
    expect(spyAdd).toHaveBeenCalledTimes(1);
    expect(spyRemove).toHaveBeenCalledTimes(1);
  });

  it('addStyling: adds styling to the element', () => {
    // Setup pre-state
    const el = wrapper.vm.$el as HTMLButtonElement;
    const elToRemove: Element[] = [];
    for (let i = 0; i < el.children.length; i += 1) {
      if (el.children[i].tagName === 'DIV') {
        elToRemove.push(el.children[i]);
      }
    }
    elToRemove.forEach((element) => {
      element.remove();
    });
    expect(el.childElementCount).toBe(1); // 1 audio, 0 animations

    // Apply function
    instructions.addStyling();

    // Assert post-state
    expect(el.classList).toContain('pop-through');
    expect(el.childElementCount).toBe(2); // 1 badge, 1 audio, 0 animations
    expect(el.children[0].tagName).toBe('SPAN');
    expect(el.children[1].tagName).toBe('AUDIO');
  });

  it('removeStyling: removes/restores styling to the element', () => {
    // Setup pre-state
    instructions.addStyling();
    const el = wrapper.vm.$el as HTMLButtonElement;
    expect(el.classList).toContain('pop-through');
    expect(el.childElementCount).toBe(2); // 1 badge, 1 audio, 0 animations

    // Apply function
    instructions.removeStyling();

    // Assert post-state
    expect(el.classList).not.toContain('pop-through');
    expect(el.childElementCount).toBe(1); // 1 audio, 0 animations
    expect(el.children[0].tagName).toBe('AUDIO'); // audio is 1rst elm
  });

  it('playInstructions: plays attached audio', () => {
    // Setup and assert pre-state
    const parentEl = wrapper.vm.$el;
    expect(parentEl.children[0].tagName).toBe('AUDIO');
    expect(parentEl.childElementCount).toBe(1); // 1 audio, 0 animations
    const el = parentEl.children[0] as HTMLAudioElement;
    expect(el.tagName).toBe('AUDIO');
    expect(el.src).toBe(audioPath);

    const spy = jest.spyOn(el, 'play');
    expect(spy).toHaveBeenCalledTimes(0);

    // Apply function
    instructions.playInstructions();

    expect(spy).toHaveBeenCalledTimes(1);
  });

  it('unsubscribe: calls unsubscribe function from store', () => {
    // Setup and assert pre-state
    // A side-effect of the store's toggleInstructionsMode value
    // changing to false
    // is that pauseRegisteredInstructionsAudio() is called.
    // After unsubscribing,
    // pauseRegisteredInstructionsAudio() should no longer be called
    // when toggleInstructionsMode turns false.
    const spy = jest.spyOn(Instructions, 'pauseRegisteredInstructionsAudio');

    // Assert invocating pauseRegisteredInstructionsAudio()
    expect(spy).toHaveBeenCalledTimes(0);
    store.dispatch('instructionsModeStore/toggleInstructionsMode');
    store.dispatch('instructionsModeStore/toggleInstructionsMode');
    expect(spy).toHaveBeenCalledTimes(1);

    // Apply function
    instructions.unsubscribe();

    // Assert NO LONGER invocating pauseRegisteredInstructionsAudio()
    store.dispatch('instructionsModeStore/toggleInstructionsMode');
    store.dispatch('instructionsModeStore/toggleInstructionsMode');
    expect(spy).toHaveBeenCalledTimes(1); // Still 1
  });

  it('delist: current instance is removed from Instructions.AudioCollection', () => {
    const el = Object.values(wrapper.vm.$el.children).find((elm) => {
      return (elm as Element).tagName === 'AUDIO';
    }) as HTMLAudioElement;
    const count = Instructions.AudioCollection.length;
    expect(Instructions.AudioCollection.includes(el)).toBe(true);

    instructions.delist();

    expect(Instructions.AudioCollection.length).toBe(count - 1);
    expect(Instructions.AudioCollection.includes(el)).toBe(false);
  });
});
