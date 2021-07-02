/**
 * Requires
 * - vuex, defaulting to an instructionsStore module storing an
 *   isInstructionsMode state
 * - directive being used on a vue component, not a HTML element
 *
 * Setup
 * import InstructionDirective from '.common/directives/InstructionDirective';
 * Vue.use(InstructionDirective, { Badge: Badge, Animation: Animation });
 *   where:
 *     - Badge is a Vue component overlaid the host element in instructions-mode
 *     - Animation is a Vue component animating when playing the instruction
 *
 * Basic Usage
 * <v-btn v-instructions="./path/to/instructions.mp3" />
 */

import _Vue, { VNode, VNodeDirective, VueConstructor } from 'vue';
import { MutationPayload } from 'vuex';

export interface InstructionElement extends HTMLElement {
  $instruction?: Instruction;
}

export interface InstructionsOptions {
  Badge: VueConstructor;
  Animation: VueConstructor;
}

export class Instruction {
  public static Collection: Array<HTMLAudioElement> = [];

  private hostElement: InstructionElement;

  private audioElement: HTMLAudioElement;

  private vm: Vue;

  private badge: Vue;

  private animation1: Vue;

  private animation2: Vue;

  private originalStyle: {
    zIndex: string;
  };

  private unsubscribeInstructionsModeWatch?: VoidFunction;

  constructor(
    hostElement: InstructionElement,
    audioUrl: string,
    vm: Vue,
    Badge: VueConstructor,
    Animation: VueConstructor,
  ) {
    this.hostElement = hostElement;
    this.audioElement = document.createElement('audio');
    this.vm = vm;

    this.badge = new Badge().$mount();
    this.animation1 = new Animation().$mount();
    this.animation2 = new Animation({
      propsData: { delay: 200 },
    }).$mount();
    this.badge.$el.appendChild(this.animation1.$el);
    this.badge.$el.appendChild(this.animation2.$el);

    this.originalStyle = {
      zIndex: this.hostElement.style.zIndex,
    };

    this.makeResponsiveToInstructionsModeChange();
    this.makeResponsiveToThemeModeChange();
    // In case already isInstructionsMode
    if (this.vm.$store.state.instructionsStore.isInstructionsMode) {
      this.addEventListener();
      this.addInstructionStyle();
    }

    this.audioElement.src = audioUrl;
    this.addAudioListeners();
    this.hostElement.appendChild(this.audioElement);
    Instruction.Collection.push(this.audioElement);
  } // end constructor

  public setAudioSrc(audioUrl: string): void {
    this.audioElement.src = audioUrl;
  }

  public addEventListener(): void {
    this.hostElement.addEventListener(
      'click',
      Instruction.playInstructionClick,
      true,
    );
  }

  public removeEventListener(): void {
    this.hostElement.removeEventListener(
      'click',
      Instruction.playInstructionClick,
      true,
    );
  }

  public addInstructionStyle(): void {
    this.hostElement.style.zIndex = '4';
    this.hostElement.classList.add('accent');
    if (this.hostElement.firstChild) {
      this.hostElement.insertBefore(
        this.badge.$el,
        this.hostElement.firstChild,
      );
    } else {
      this.hostElement.appendChild(this.badge.$el);
    }
  }

  public removeInstructionStyle(): void {
    this.hostElement.style.zIndex = this.originalStyle.zIndex;
    this.hostElement.classList.remove('accent');
    if (this.hostElement.getElementsByClassName(this.badge.$el.className)[0]) {
      this.hostElement.removeChild(this.badge.$el);
    }
  }

  public playInstruction(): void {
    this.audioElement.currentTime = 0;
    this.audioElement.play();
  }

  public cancelInstruction(): void {
    this.audioElement.pause();
  }

  public unsubscribe(): void {
    if (this.unsubscribeInstructionsModeWatch) {
      this.unsubscribeInstructionsModeWatch();
    } else {
      throw new Error(
        'The v-instruction directive is trying to unsubscribe from watching the vuex state, but no unsubscribe function has been provided.',
      );
    }
  }

  public delist(): void {
    Instruction.Collection.splice(
      Instruction.Collection.indexOf(this.audioElement),
      1,
    );
  }

  public addAudioListeners(): void {
    this.audioElement.addEventListener('playing', () => {
      if (this.animation1 && this.animation2) {
        this.animation1.$props.playing = true;
        this.animation2.$props.playing = true;
      }
      Instruction.Collection.forEach((audioElement) => {
        if (audioElement !== this.audioElement && !audioElement.paused) {
          audioElement.pause();
        }
      });
    });

    this.audioElement.addEventListener('pause', () => {
      if (this.animation1 && this.animation2) {
        this.animation1.$props.playing = false;
        this.animation2.$props.playing = false;
      }
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.animation1 && this.animation2) {
        this.animation1.$props.playing = false;
        this.animation2.$props.playing = false;
      }
      if (this.vm.$store.state.instructionsStore.isInstructionsMode) {
        this.vm.$store.dispatch('instructionsStore/toggleInstructionsMode');
      }
    });
  }

  private makeResponsiveToInstructionsModeChange() {
    this.unsubscribeInstructionsModeWatch = this.vm.$store.subscribe(
      (mutation: MutationPayload, state) => {
        if (mutation.type === 'instructionsStore/TOGGLE_INSTRUCTIONS_MODE') {
          if (state.instructionsStore.isInstructionsMode) {
            this.addEventListener();
            this.addInstructionStyle();
          } else {
            this.removeEventListener();
            this.removeInstructionStyle();
            // Cancel audio and animation if manually toggled while playing
            this.cancelInstruction();
          }
        }
      },
    );
  }

  private makeResponsiveToThemeModeChange() {
    this.vm.$watch('$vuetify.theme.dark', () => {
      if (this.vm.$store.state.instructionsStore.isInstructionsMode) {
        this.addInstructionStyle();
      } else {
        this.removeInstructionStyle();
      }
    });
  }

  static playInstructionClick(this: InstructionElement, event: Event): void {
    // prevent triggering the button's regular action
    event.preventDefault();
    event.stopPropagation();
    // instead, play the attached instruction
    if (this && this.$instruction) {
      this.$instruction.playInstruction();
    } else {
      throw new Error('Element has no "$instruction" property');
    }
  }
}

export default function InstallInstructionDirective(
  Vue: typeof _Vue,
  { Badge, Animation }: InstructionsOptions,
): void {
  Vue.directive('instruction', {
    bind(
      hostElement: InstructionElement,
      { value: audioUrl }: VNodeDirective,
      { componentInstance: vm }: VNode,
    ) {
      if (vm) {
        // eslint-disable-next-line no-param-reassign
        hostElement.$instruction = new Instruction(
          hostElement,
          audioUrl,
          vm,
          Badge,
          Animation,
        );
      } else {
        throw new Error(
          'Expected VNode to have a .componentInstance, but found none. Only use the v-instruction directive on Vue components.',
        );
      }
    },

    update(
      hostElement: InstructionElement,
      { value: audioUrl }: VNodeDirective,
    ) {
      if (hostElement.$instruction) {
        hostElement.$instruction.setAudioSrc(audioUrl);
      }
    },

    // e.g. when moving from /home to /about, removed elements will be unbound
    unbind(hostElement: InstructionElement) {
      if (hostElement.$instruction) {
        hostElement.$instruction.unsubscribe();
        hostElement.$instruction.removeEventListener();
        hostElement.$instruction.delist();
      }
    },
  });
}
