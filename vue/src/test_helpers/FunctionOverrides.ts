/* eslint-disable class-methods-use-this */

export function play(): Promise<void> {
  return new Promise(() => {
    /* do nothing */
  });
}

export function pause(): void {
  /* do nothing */
}

export class Animation {
  addEventListener() {
    /* do nothing */
  }

  cancel() {
    /* do nothing */
  }

  currentTime = null;

  dispatchEvent() {
    return false;
  }

  effect = null;

  finish() {
    /* do nothing */
  }

  finished = new Promise<Animation>(() => {
    /* do nothing */
  });

  id = '';

  oncancel = null;

  onfinish = null;

  pause() {
    /* do nothing */
  }

  play() {
    /* do nothing */
  }

  pending = false;

  playState = 'idle' as AnimationPlayState;

  playbackRate = 1;

  ready = new Promise<Animation>(() => {
    /* do nothing */
  });

  removeEventListener() {
    /* do nothing */
  }

  reverse() {
    /* do nothing */
  }

  updatePlaybackRate() {
    /* do nothing */
  }

  startTime = null;

  timeline = document.timeline;

  // eslint-disable-next-line no-useless-constructor
  constructor(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    effect?: AnimationEffect | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    timeline?: AnimationTimeline | null | undefined,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
  ) {}
}

export function animate(
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  keyframes: PropertyIndexedKeyframes | Keyframe[] | null,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  options?: number | KeyframeAnimationOptions | undefined,
) {
  return new Animation();
}
