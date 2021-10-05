/**
 * Requires
 * - vuex, defaulting to an instructionStore module storing an
 *   isInstructionMode state
 * - directive being used on a vue component, not a HTML element
 *
 * Setup
 * import InstructionDirective from './common/directives/InstructionDirective';
 * app.use(InstructionDirective, { Badge: MyBadge });
 *   where:
 *     - MyBadge is a Vue component overlaid the host element in instruction-mode
 *       with the optional prop 'playing' indicating to animate or not
 *
 * Basic Usage
 * <v-btn v-instruction="./path/to/instruction.mp3" />
 */

import {
  App,
  ComponentPublicInstance,
  createApp,
  DefineComponent,
  DirectiveBinding,
  ref,
} from 'vue';
import { MutationPayload, Store } from 'vuex';

export interface InstructionElement extends HTMLElement {
  $instruction?: Instruction;
}

export interface InstructionOptions {
  // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
  Badge: DefineComponent<{}, {}, any>;
}

export interface InstructionRootState {
  instructionStore: InstructionState;
}

export interface InstructionState {
  isInstructionMode: boolean;
}

export class Instruction {
  public static AudioCollection: Array<HTMLAudioElement> = [];

  private hostElement: InstructionElement;

  private audioElement: HTMLAudioElement;

  private vm: ComponentPublicInstance;

  private badge: ComponentPublicInstance;

  private originalStyle: {
    zIndex: string;
  };

  private unsubscribeInstructionModeWatch?: VoidFunction;
  private store: Store<InstructionRootState>;

  private showAudioRipple = ref(false);

  constructor(
    hostElement: InstructionElement,
    audioUrl: string,
    vm: ComponentPublicInstance,
    // eslint-disable-next-line @typescript-eslint/ban-types, @typescript-eslint/no-explicit-any
    Badge: DefineComponent<{}, {}, any>,
    store: Store<InstructionRootState>,
  ) {
    this.hostElement = hostElement;
    this.audioElement = document.createElement('audio');
    this.vm = vm;

    const badgeDiv = document.createElement('div');
    this.badge = createApp(Badge, { playing: this.showAudioRipple }).mount(
      badgeDiv,
    );

    this.store = store;

    this.originalStyle = {
      zIndex: this.hostElement.style.zIndex,
    };

    this.makeResponsiveToInstructionModeChange();
    // In case already isInstructionMode
    if (this.store.state.instructionStore?.isInstructionMode) {
      this.addEventListener();
      this.addInstructionStyle();
    }
    this.audioElement.src = audioUrl;
    this.addAudioListeners();
    this.hostElement.appendChild(this.audioElement);
    Instruction.AudioCollection.push(this.audioElement);
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
    this.hostElement.classList.add('bg-info');
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
    this.hostElement.classList.remove('bg-info');
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
    if (this.unsubscribeInstructionModeWatch) {
      this.unsubscribeInstructionModeWatch();
    } else {
      throw new Error(
        'The v-instruction directive is trying to unsubscribe from watching the vuex state, but no unsubscribe function has been provided.',
      );
    }
  }

  public delist(): void {
    Instruction.AudioCollection.splice(
      Instruction.AudioCollection.indexOf(this.audioElement),
      1,
    );
  }

  public addAudioListeners(): void {
    this.audioElement.addEventListener('playing', () => {
      this.showAudioRipple.value = true;
      Instruction.AudioCollection.forEach((audioElement) => {
        if (audioElement !== this.audioElement && !audioElement.paused) {
          audioElement.pause();
        }
      });
    });

    this.audioElement.addEventListener('pause', () => {
      this.showAudioRipple.value = false;
    });

    this.audioElement.addEventListener('ended', () => {
      this.showAudioRipple.value = false;
      if (this.store.state.instructionStore?.isInstructionMode) {
        this.store.dispatch('instructionStore/toggleInstructionMode');
      }
    });
  }

  private makeResponsiveToInstructionModeChange() {
    this.unsubscribeInstructionModeWatch = this.store.subscribe(
      (mutation: MutationPayload, state) => {
        if (mutation.type === 'instructionStore/TOGGLE_INSTRUCTIONS_MODE') {
          if (state.instructionStore?.isInstructionMode) {
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

export default {
  install(app: App, { Badge }: InstructionOptions): void {
    app.directive('instruction', {
      mounted(
        hostElement: InstructionElement,
        { instance: vm, value: audioUrl }: DirectiveBinding,
      ) {
        if (vm) {
          hostElement.$instruction = new Instruction(
            hostElement,
            audioUrl,
            vm,
            Badge,
            app.config.globalProperties.$store,
          );
        } else {
          throw new Error(
            'Expected VNode to have a .componentInstance, but found none. Only use the v-instruction directive on Vue components.',
          );
        }
      },

      beforeUpdate(
        hostElement: InstructionElement,
        { value: audioUrl }: DirectiveBinding,
      ) {
        if (hostElement.$instruction) {
          hostElement.$instruction.setAudioSrc(audioUrl);
        }
      },

      // e.g. when moving from /home to /about, removed elements will be unbound
      unmounted(hostElement: InstructionElement) {
        if (hostElement.$instruction) {
          hostElement.$instruction.unsubscribe();
          hostElement.$instruction.removeEventListener();
          hostElement.$instruction.delist();
        }
      },
    });
  },
};
