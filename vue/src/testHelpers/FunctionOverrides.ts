export function play(): Promise<void> {
  return new Promise(() => {
    /* do nothing */
  });
}

export function pause(): void {
  /* do nothing */
}

export function animate(): Animation {
  return {
    addEventListener() {
      /* do nothing */
    },
    cancel() {
      /* do nothing */
    },
    currentTime: null,
    dispatchEvent() {
      return false;
    },
    effect: null,
    finish() {
      /* do nothing */
    },
    finished: new Promise(() => {
      /* do nothing */
    }),
    id: '',
    oncancel: null,
    onfinish: null,
    pause() {
      /* do nothing */
    },
    play() {
      /* do nothing */
    },
    pending: false,
    playState: 'idle',
    playbackRate: 1,
    ready: new Promise(() => {
      /* do nothing */
    }),
    removeEventListener() {
      /* do nothing */
    },
    reverse() {
      /* do nothing */
    },
    updatePlaybackRate() {
      /* do nothing */
    },
    startTime: null,
    timeline: document.timeline,
  };
}
