import { Page, expect } from '@playwright/test';

interface WindowSpies {
  audioPlay: number;
  animationPlay: number;
  animationAnimate: number;
  animateKeyframesList: unknown[][];
}

type InstrumentedWindow = Window & typeof globalThis & { __spies: WindowSpies };

export async function setupAudioSpy(page: Page): Promise<void> {
  await page.addInitScript(() => {
    // Local cast — compiled away before Playwright serializes this callback.
    const w = window as unknown as InstrumentedWindow;
    if (!w.__spies) w.__spies = {} as WindowSpies;
    w.__spies.audioPlay = 0;
    const orig = HTMLMediaElement.prototype.play;
    HTMLMediaElement.prototype.play = function () {
      (window as unknown as InstrumentedWindow).__spies.audioPlay++;
      return orig.apply(this);
    };
  });
}

export async function setupAnimationSpies(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const w = window as unknown as InstrumentedWindow;
    if (!w.__spies) w.__spies = {} as WindowSpies;
    w.__spies.animationPlay = 0;
    w.__spies.animationAnimate = 0;
    w.__spies.animateKeyframesList = [];
    const origPlay = Animation.prototype.play;
    Animation.prototype.play = function () {
      (window as unknown as InstrumentedWindow).__spies.animationPlay++;
      origPlay.apply(this);
    };
    const origAnimate = HTMLElement.prototype.animate;
    HTMLElement.prototype.animate = function (
      keyframes: PropertyIndexedKeyframes | Keyframe[] | null,
      options?: number | KeyframeAnimationOptions,
    ) {
      const iw = window as unknown as InstrumentedWindow;
      iw.__spies.animationAnimate++;
      const frames = Array.isArray(keyframes)
        ? keyframes
        : keyframes
          ? [keyframes]
          : [];
      iw.__spies.animateKeyframesList.push(frames);
      return origAnimate.call(this, keyframes, options);
    };
  });
}

export async function setupMatchMediaStub(page: Page): Promise<void> {
  await page.addInitScript(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      configurable: true,
      value: () => ({
        matches: false,
        addEventListener() {},
        removeEventListener() {},
      }),
    });
  });
}

export async function removeServiceWorker(page: Page): Promise<void> {
  await page.addInitScript(() => {
    const proto = Object.getPrototypeOf(navigator) as {
      serviceWorker?: ServiceWorkerContainer;
    };
    delete proto.serviceWorker;
  });
}

export async function skipInstructionsExplainer(page: Page): Promise<void> {
  await page.addInitScript(() => {
    localStorage.setItem('InstructionsExplainerShownCount', '5');
  });
}

export async function suppressAbortErrors(page: Page): Promise<void> {
  page.on('pageerror', (error: Error) => {
    if (error.name !== 'AbortError') {
      throw error;
    }
  });
}

export async function getAudioPlayCount(page: Page): Promise<number> {
  return page.evaluate(
    () => (window as unknown as InstrumentedWindow).__spies?.audioPlay ?? 0,
  );
}

export async function getAnimationPlayCount(page: Page): Promise<number> {
  return page.evaluate(
    () => (window as unknown as InstrumentedWindow).__spies?.animationPlay ?? 0,
  );
}

export async function getAnimationAnimateCount(page: Page): Promise<number> {
  return page.evaluate(
    () =>
      (window as unknown as InstrumentedWindow).__spies?.animationAnimate ?? 0,
  );
}

export async function resetAudioPlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as InstrumentedWindow).__spies.audioPlay = 0;
  });
}

export async function resetAnimationPlay(page: Page): Promise<void> {
  await page.evaluate(() => {
    (window as unknown as InstrumentedWindow).__spies.animationPlay = 0;
  });
}

export async function resetAnimationAnimate(page: Page): Promise<void> {
  await page.evaluate(() => {
    const w = window as unknown as InstrumentedWindow;
    w.__spies.animationAnimate = 0;
    w.__spies.animateKeyframesList = [];
  });
}

export async function resetAllSpies(page: Page): Promise<void> {
  await page.evaluate(() => {
    const s = (window as unknown as InstrumentedWindow).__spies;
    if (s) {
      s.audioPlay = 0;
      s.animationPlay = 0;
      s.animationAnimate = 0;
      s.animateKeyframesList = [];
    }
  });
}

export async function expectAudioPlayCount(
  page: Page,
  count: number,
): Promise<void> {
  await expect.poll(() => getAudioPlayCount(page)).toBe(count);
}

export async function expectAnimationPlayCount(
  page: Page,
  count: number,
): Promise<void> {
  await expect.poll(() => getAnimationPlayCount(page)).toBe(count);
}

export async function expectAnimationAnimateCount(
  page: Page,
  count: number,
): Promise<void> {
  await expect.poll(() => getAnimationAnimateCount(page)).toBe(count);
}
