/* eslint-disable no-console */
import type {
  Blank,
  ContentSpec,
  LessonSpec,
  WordListSpec,
  WordRef,
  WordSpec,
} from './ContentTypes';
import { LessonsMeta } from './LessonsMetaType';
import * as mdiIcons from '@mdi/js';

let mp3Base64Sources: Record<string, unknown>,
  jsonSources: Record<string, unknown>,
  picSources: Record<string, unknown>;
let prefix = '';
if (import.meta.env.MODE === 'test') {
  // applies to unit tests; e2e tests run in production mode
  prefix = '/src/test-support/';
  mp3Base64Sources = import.meta.glob('/src/test-support/**/*.mp3.audio', {
    eager: true,
    as: 'raw',
  });
  jsonSources = import.meta.glob('/src/test-support/**/*.json', {
    eager: true,
    import: 'default',
  });
  picSources = import.meta.glob('/src/test-support/**/*.jpg|jpeg|png|gif', {
    eager: true,
    import: 'default',
  });
} else {
  prefix = '../../../content/';
  mp3Base64Sources = import.meta.glob('../../../content/**/*.mp3.audio', {
    eager: true,
    as: 'raw',
  });
  jsonSources = import.meta.glob('../../../content/**/*.json', {
    eager: true,
    import: 'default',
  });
  picSources = import.meta.glob('../../../content/**/*.jpg|jpeg|png|gif', {
    eager: true,
    import: 'default',
  });
}

export default class Content {
  public static ContentSpec = jsonSources[
    `${prefix}ContentSpec.json`
  ] as ContentSpec;

  public static WordListSpec = jsonSources[
    `${prefix}${this.ContentSpec.wordSpecFile}`
  ] as WordListSpec;

  public static LessonSpecs: Array<LessonSpec> = (() => {
    const lessons = [] as Array<LessonSpec>;
    for (let i = 0; i < this.ContentSpec.lessons.length; i += 1) {
      const lessonSpecFile = this.ContentSpec.lessons[i].lessonSpecFile;
      const lesson: LessonSpec = jsonSources[
        `${prefix}${lessonSpecFile}`
      ] as LessonSpec;
      lessons.push(lesson);
    }
    return lessons;
  })();

  public static LessonsMeta: LessonsMeta = (() => {
    const lessons = {} as LessonsMeta;
    const wordsSeenBefore = new Set();
    for (let i = 0; i < this.ContentSpec.lessons.length; i += 1) {
      const lesson = this.ContentSpec.lessons[i];
      const oneBasedIndex = i + 1;
      lessons[oneBasedIndex] = {
        name: lesson.name,
        icon: '',
        audio: '',
        words: [],
        newWords: [],
      };
      lessons[oneBasedIndex].icon = this.getIcon(lesson.icon);
      lessons[oneBasedIndex].audio = this.getAudioPath(
        lesson.introductionAudio,
      );

      const lessonSpec = this.LessonSpecs[i];
      const lessonWords = this.getWordsInLesson(lessonSpec);
      lessons[oneBasedIndex].words = lessonWords;
      lessons[oneBasedIndex].newWords = lessonWords.filter((word) => {
        if (!wordsSeenBefore.has(word)) {
          wordsSeenBefore.add(word);
          return word;
        }
      });
    }
    return lessons;
  })();

  public static getWordsInLesson(lessonSpec: LessonSpec) {
    const words: Set<WordSpec> = new Set();
    lessonSpec.exercises.forEach((exercise) => {
      if (['MultipleChoice', 'Matching'].includes(exercise.type)) {
        if (exercise.words) {
          exercise.words.forEach((wordRef) => {
            words.add(this.getWord(wordRef));
          });
        }
      }
      if (exercise.type === 'Explanation') {
        if (exercise.explanationTargets) {
          const word = this.getWord(exercise.explanationTargets.validOption);
          if (!words.has(word)) {
            words.add(word);
          }
        }
      }
      if (exercise.type === 'SingleCloze' && exercise.singleClozeText) {
        exercise.singleClozeText
          .filter((clozeItem): clozeItem is Blank => !!clozeItem.validOptions)
          .forEach((clozeItem) => {
            clozeItem.validOptions.forEach((wordRef) => {
              const word = this.getWord(wordRef);
              if (!words.has(word)) {
                words.add(word);
              }
            });
          });
      }
      if (exercise.type === 'MultiCloze' && exercise.multiClozeText) {
        exercise.multiClozeText
          .filter((clozeItem): clozeItem is Blank => !!clozeItem.validOptions)
          .forEach((clozeItem) => {
            clozeItem.validOptions.forEach((wordRef) => {
              const word = this.getWord(wordRef);
              if (!words.has(word)) {
                words.add(word);
              }
            });
          });
      }
    });
    return [...words];
  }

  public static getAudioPath(path: string): string {
    return `data:audio/mpeg;base64,${
      mp3Base64Sources[`${prefix}${path}.audio`]
    }`;
  }

  public static getPicPath(path: string): string {
    return picSources[`${prefix}${path}`] as string;
  }

  public static getInstructionsAudio(
    scope: keyof ContentSpec['instructions'],
  ): string {
    return this.getAudioPath(this.ContentSpec.instructions[scope]);
  }

  public static getIcon(key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawPath = (mdiIcons as any)[key];
    return drawPath
      ? `data:image/svg+xml,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="${drawPath}"/></svg>`
      : '';
  }

  public static getWord(wordRef: string | WordRef): WordSpec {
    if (typeof wordRef === 'string') {
      return Content.WordListSpec.words[wordRef];
    } else {
      return Content.WordListSpec.words[Object.values(wordRef)[0]];
    }
  }
}
