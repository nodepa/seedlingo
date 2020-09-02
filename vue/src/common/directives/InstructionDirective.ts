/**
 * expects:
 * vuex, defaulting to an instructionsStore module storing an isInstructionsMode state
 * vuetify, allowing access to theme colors with fallbacks
 * directive being used on a vue component, not a HTML element
 *
 * setup:
 * pass in options for vuex store mutation name
 *
 * basic usage:
 * <v-btn v-instructions="./path/to/instructions.mp3" />
 *
 * change position of badge (!!not yet implemented!!)
 * options:  northeast ⬀ | southeast ⬂ (default) | southwest ⬃ | northwest ⬁
 * <v-btn v-instructions.northeast="./path/to/instructions.mp3" />
 *
 * add custom class (!!not yet implemented!!)
 * <v-btn v-instructions="{path: './path/to/instructions.mp3', class: 'custom-class'}">
 *
 */

import _Vue, { VNode, VNodeDirective } from 'vue';
import { MutationPayload } from 'vuex';
import InstructionsIcon from '@/common/icons/InstructionsIcon.vue';

const InstructionsIconClass = _Vue.extend(InstructionsIcon);

export interface InstructionElement extends HTMLElement {
  $instruction?: Instruction;
}

export class Instruction {
  public static Collection: Array<HTMLAudioElement> = [];

  private hostElement: InstructionElement;

  private audioElement = document.createElement('audio');

  private animation?: Animation;

  private vm: Vue;

  private originalStyle: {
    backgroundColor: string;
    border: string;
    zIndex: string;
  };

  private unsubscribeInstructionsModeWatch?: VoidFunction;

  constructor(hostElement: InstructionElement, audioSrc: string, vm: Vue) {
    Instruction.Collection.push(this.audioElement);
    this.hostElement = hostElement;
    this.vm = vm;

    if (this.hostElement.animate) {
      this.animation = this.hostElement.animate(
        [{ opacity: 1.0 }, { opacity: 0.4 }, { opacity: 1.0 }],
        { duration: 1300, iterations: Infinity },
      );
      this.animation.pause();
    }

    this.originalStyle = {
      backgroundColor: this.hostElement.style.backgroundColor,
      border: this.hostElement.style.border,
      zIndex: this.hostElement.style.zIndex,
    };

    this.respondToInstructionsModeChange();
    this.respondToThemeModeChange();

    if (audioSrc) {
      this.audioElement.src = audioSrc;
      this.addAudioListeners();
      this.hostElement.appendChild(this.audioElement);
    } else {
      throw new Error(
        'The v-instruction directive is missing an audio path, it should be: v-instruction="./path/to/audio.mp3"',
      );
    }
  } // end constructor

  public addEventListener() {
    this.hostElement.addEventListener(
      'click',
      Instruction.playInstructionClick,
      true,
    );
  }

  public removeEventListener() {
    this.hostElement.removeEventListener(
      'click',
      Instruction.playInstructionClick,
      true,
    );
  }

  public addInstructionStyle() {
    const color = this.vm.$vuetify.theme.dark
      ? this.getColorFromTheme('black', '#1E1E1E', 100)
      : this.getColorFromTheme('white', '#FFFFFF', 100);
    this.hostElement.style.backgroundColor = color;
    // this.hostElement.style.setProperty('background-color', color, 'important');
    this.hostElement.style.zIndex = '4';

    let badge = this.hostElement.getElementsByClassName(
      'badge',
    )[0] as HTMLDivElement;
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'badge';
      badge.style.position = 'absolute';
      badge.style.top = '45%';
      badge.style.left = '65%';
      badge.style.borderRadius = '50%';
      badge.style.width = '2em';
      badge.style.height = '2em';
      badge.style.zIndex = '5';
      const instructionsIcon = new InstructionsIconClass();
      instructionsIcon.$mount();
      badge.appendChild(instructionsIcon.$el);
      this.hostElement.appendChild(badge);
    }
    badge.style.backgroundColor = this.getColorFromTheme('primary', '#0000FF');
    badge.style.color = this.vm.$vuetify.theme.dark
      ? this.getColorFromTheme('black', '#1E1E1E', 100)
      : this.getColorFromTheme('white', '#FFFFFF', 100);
  }

  public removeInstructionStyle() {
    this.hostElement.style.backgroundColor = this.originalStyle.backgroundColor;
    this.hostElement.style.zIndex = this.originalStyle.zIndex;
    const badge = this.hostElement.getElementsByClassName('badge')[0];
    if (badge) {
      this.hostElement.removeChild(badge);
    }
  }

  public playInstruction() {
    this.audioElement.currentTime = 0;
    this.audioElement.play();
  }

  public cancelInstruction() {
    this.audioElement.pause();
  }

  public unsubscribe() {
    if (this.unsubscribeInstructionsModeWatch) {
      this.unsubscribeInstructionsModeWatch();
    } else {
      throw new Error(
        'The v-instruction directive is trying to unsubscribe from watching the vuex state, but no unsubscribe function has been provided.',
      );
    }
  }

  public delist() {
    Instruction.Collection.splice(
      Instruction.Collection.indexOf(this.audioElement),
      1,
    );
  }

  private addAudioListeners() {
    this.audioElement.addEventListener('playing', () => {
      if (this.animation) {
        this.animation.play();
      }
      Instruction.Collection.forEach((audioElement) => {
        if (audioElement !== this.audioElement && !audioElement.paused) {
          audioElement.pause();
        }
      });
    });

    this.audioElement.addEventListener('pause', () => {
      if (this.animation) {
        this.animation.cancel();
      }
    });

    this.audioElement.addEventListener('ended', () => {
      if (this.animation) {
        this.animation.cancel();
      }
      if (this.vm.$store.state.instructionsStore.isInstructionsMode) {
        this.vm.$store.dispatch('instructionsStore/toggleInstructionsMode');
      }
    });
  }

  private getColorFromTheme(
    colorNameInTheme: string,
    fallbackColor: string,
    opacityPercentage = 80,
  ): string {
    const validOpacityPercentage = Math.max(
      Math.min(opacityPercentage, 100),
      0,
    );
    const hexOpacity = Math.ceil(validOpacityPercentage * 2.55).toString(16);
    if (fallbackColor && !/^#[A-Fa-f0-9]{6}$/.test(fallbackColor)) {
      throw new Error('fallbackColor needs to be in hex format, like: #FF11AA');
    }
    return `${this.vm.$vuetify.theme.currentTheme[colorNameInTheme] ||
      fallbackColor}${hexOpacity}`;
  }

  private respondToInstructionsModeChange() {
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

  private respondToThemeModeChange() {
    this.vm.$watch('$vuetify.theme.dark', () => {
      if (this.vm.$store.state.instructionsStore.isInstructionsMode) {
        this.addInstructionStyle();
      } else {
        this.removeInstructionStyle();
      }
    });
  }

  static playInstructionClick(this: InstructionElement, event: Event) {
    // prevent triggering the button's regular action
    event.preventDefault();
    // instead, play the attached instruction
    if (this && this.$instruction) {
      this.$instruction.playInstruction();
    } else {
      throw new Error('Element has no "$instruction" property');
    }
  }
}

export default function InstallInstructionDirective(Vue: typeof _Vue) {
  Vue.directive('instruction', {
    bind(
      el: InstructionElement,
      { value }: VNodeDirective,
      { componentInstance: vm }: VNode,
    ) {
      if (vm) {
        // eslint-disable-next-line no-param-reassign
        el.$instruction = new Instruction(el, value, vm);
        // e.g. when moving from /about to /home
        if (vm.$store.state.instructionsStore.isInstructionsMode) {
          el.$instruction.addEventListener();
          el.$instruction.addInstructionStyle();
        } else {
          // el.$instruction.removeEventListener();
          // el.$instruction.removeInstructionStyle();
        }
      } else {
        throw new Error(
          'Expected VNode to have a .componentInstance, but found none. Only use the v-instruction directive on Vue components.',
        );
      }
    },

    // e.g. when moving from /home to /about, removed elements will be unbound
    unbind(el: InstructionElement) {
      if (el.$instruction) {
        el.$instruction.unsubscribe();
        el.$instruction.removeEventListener();
        el.$instruction.delist();
      }
    },
  });
}
