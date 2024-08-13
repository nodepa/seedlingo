export function play(): Promise<void> {
  return new Promise(() => {
    /* do nothing */
  });
}

export function pause(): void {
  /* do nothing */
}

export class Animation {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect?: AnimationEffect | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timeline?: AnimationTimeline | null | undefined,
  ) {}

  addEventListener(): void {
    /* do nothing */
  }

  cancel(): void {
    /* do nothing */
  }

  commitStyles(): void {
    /* do nothing */
  }

  currentTime = null;

  dispatchEvent(): boolean {
    return false;
  }

  effect = null;

  finish(): void {
    /* do nothing */
  }

  finished = new Promise<Animation>(() => {
    /* do nothing */
  });

  id = '';

  oncancel = null;

  onfinish = null;

  onremove = null;

  pause(): void {
    /* do nothing */
  }

  pending = false;

  persist(): void {
    /* do nothing */
  }

  play(): void {
    /* do nothing */
  }

  playState = 'idle' as AnimationPlayState;

  playbackRate = 1;

  ready = new Promise<Animation>(() => {
    /* do nothing */
  });

  removeEventListener(): void {
    /* do nothing */
  }

  replaceState = 'active' as AnimationReplaceState;

  reverse(): void {
    /* do nothing */
  }

  startTime = null;

  timeline = document.timeline;

  updatePlaybackRate(): void {
    /* do nothing */
  }
}

export class AnimationEffect {
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect?: AnimationEffect | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timeline?: AnimationTimeline | null | undefined,
  ) {}

  getTiming(): ComputedEffectTiming {
    return {};
  }

  getComputedTiming(): ComputedEffectTiming {
    return {};
  }

  updateTiming(): void {
    /* do nothing */
  }
}

export function animate(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keyframes: PropertyIndexedKeyframes | Keyframe[] | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: number | KeyframeAnimationOptions | undefined,
): Animation {
  return new Animation();
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function matchMedia(query: string) {
  return {
    matches: false,
    media: '',
    addListener: () => null,
    removeListener: () => null,
    addEventListener: () => null,
    removeEventListener: () => null,
    onchange: function (
      this: MediaQueryList,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ev: MediaQueryListEvent,
    ) {},
    dispatchEvent: function (
      this: MediaQueryList,
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      ev: MediaQueryListEvent,
    ) {
      return false;
    },
  };
}
