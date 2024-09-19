import type {
  Blank,
  ContentSpec,
  UnitSpec,
  WordListSpec,
  WordRef,
  WordSpec,
} from '@/common/types/ContentTypes';
import type { UnitsMeta } from '@/common/types/UnitsMetaType';
import {
  mdiAccount,
  mdiAccountHardHat,
  mdiCash100,
  mdiCrowd,
  mdiHumanFemaleBoy,
  mdiHumanFemaleGirl,
  mdiHumanMaleBoard,
  mdiHumanMaleBoy,
  mdiHumanMaleChild,
  mdiHumanMaleGirl,
  mdiNumeric,
  mdiNumeric0,
  mdiNumeric0Circle,
  mdiNumeric1,
  mdiNumeric1Circle,
  mdiNumeric2,
  mdiNumeric2Circle,
  mdiNumeric2CircleOutline,
  mdiNumeric3,
  mdiNumeric4,
  mdiNumeric5,
  mdiNumeric6,
  mdiNumeric7,
  mdiNumeric8,
  mdiNumeric9,
} from '@mdi/js';
const mdiIcons = new Map([
  ['mdiAccount', mdiAccount],
  ['mdiAccountHardHat', mdiAccountHardHat],
  ['mdiCash100', mdiCash100],
  ['mdiCrowd', mdiCrowd],
  ['mdiHumanFemaleBoy', mdiHumanFemaleBoy],
  ['mdiHumanFemaleGirl', mdiHumanFemaleGirl],
  ['mdiHumanMaleBoard', mdiHumanMaleBoard],
  ['mdiHumanMaleBoy', mdiHumanMaleBoy],
  ['mdiHumanMaleChild', mdiHumanMaleChild],
  ['mdiHumanMaleGirl', mdiHumanMaleGirl],
  ['mdiNumeric', mdiNumeric],
  ['mdiNumeric0', mdiNumeric0],
  ['mdiNumeric0Circle', mdiNumeric0Circle],
  ['mdiNumeric1', mdiNumeric1],
  ['mdiNumeric1Circle', mdiNumeric1Circle],
  ['mdiNumeric2', mdiNumeric2],
  ['mdiNumeric2Circle', mdiNumeric2Circle],
  ['mdiNumeric2CircleOutline', mdiNumeric2CircleOutline],
  ['mdiNumeric3', mdiNumeric3],
  ['mdiNumeric4', mdiNumeric4],
  ['mdiNumeric5', mdiNumeric5],
  ['mdiNumeric6', mdiNumeric6],
  ['mdiNumeric7', mdiNumeric7],
  ['mdiNumeric8', mdiNumeric8],
  ['mdiNumeric9', mdiNumeric9],
]);

let jsonSources: Record<string, unknown>,
  picSources: Record<string, unknown>,
  mp3Base64Sources: Record<string, unknown>;
let contentFolder = '';
if (import.meta.env.MODE === 'test') {
  // applies to unit tests; e2e tests run in production mode
  contentFolder = '/src/test-support/';
  mp3Base64Sources = import.meta.glob('/src/test-support/**/*.mp3.audio', {
    eager: true,
    query: '?raw',
    import: 'default',
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
  contentFolder = '../../../content/';
  mp3Base64Sources = import.meta.glob('../../../content/**/*.mp3.audio', {
    eager: true,
    query: '?raw',
    import: 'default',
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
    `${contentFolder}ContentSpec.json`
  ] as ContentSpec;

  public static WordListSpec = jsonSources[
    `${contentFolder}${this.ContentSpec.wordSpecFile}`
  ] as WordListSpec;

  public static UnitSpecs: Array<UnitSpec> = (() => {
    const units = [] as Array<UnitSpec>;
    for (let i = 0; i < this.ContentSpec.units.length; i += 1) {
      const unitSpecFile = this.ContentSpec.units[i].unitSpecFile;
      const unit: UnitSpec = jsonSources[
        `${contentFolder}${unitSpecFile}`
      ] as UnitSpec;
      units.push(unit);
    }
    return units;
  })();

  public static UnitsMeta: UnitsMeta = (() => {
    const units = {} as UnitsMeta;
    const wordsSeenBefore = new Set();
    for (let i = 0; i < this.ContentSpec.units.length; i += 1) {
      const unit = this.ContentSpec.units[i];
      const oneBasedIndex = i + 1;
      units[oneBasedIndex] = {
        name: unit.name,
        icon: '',
        audio: '',
        words: [],
        newWords: [],
      };
      units[oneBasedIndex].icon = this.getIcon(unit.icon);
      units[oneBasedIndex].audio = this.getAudioData(unit.introductionAudio);

      const unitSpec = this.UnitSpecs[i];
      const unitWords = this.getWordsInUnit(unitSpec);
      units[oneBasedIndex].words = unitWords;
      units[oneBasedIndex].newWords = unitWords.filter((word) => {
        if (!wordsSeenBefore.has(word)) {
          wordsSeenBefore.add(word);
          return word;
        }
      });
    }
    return units;
  })();

  public static getWordsInUnit(unitSpec: UnitSpec) {
    const words: Set<WordSpec> = new Set();
    unitSpec.exercises.forEach((exercise) => {
      if (['MultipleChoice', 'Matching'].includes(exercise.type)) {
        if (exercise.multipleChoiceSpec?.multipleChoiceWords) {
          exercise.multipleChoiceSpec.multipleChoiceWords.forEach((wordRef) => {
            words.add(this.getWord(wordRef));
          });
        }
        if (exercise.matchingSpec?.matchingWords) {
          exercise.matchingSpec.matchingWords.forEach((wordRef) => {
            words.add(this.getWord(wordRef));
          });
        }
      }
      if (exercise.type === 'Explanation') {
        if (exercise.explanationSpec?.explanationTargets) {
          words.add(
            this.getWord(
              exercise.explanationSpec.explanationTargets.validOption,
            ),
          );
        }
      }
      if (exercise.type === 'SingleCloze' && exercise.singleClozeSpec?.text) {
        exercise.singleClozeSpec.text
          .filter((clozeItem): clozeItem is Blank => !!clozeItem.validOptions)
          .forEach((clozeItem) => {
            clozeItem.validOptions.forEach((wordRefOrRefs) => {
              if (!Array.isArray(wordRefOrRefs)) {
                words.add(this.getWord(wordRefOrRefs));
              }
              // Don't add composite words
              // else {
              //   (wordRefOrRefs as Array<WordRef>).forEach((wordRef) => {
              //     words.add(this.getWord(wordRef));
              //   });
              // }
            });
          });
      }
      if (exercise.type === 'MultiCloze' && exercise.multiClozeSpec?.text) {
        exercise.multiClozeSpec.text
          .filter((clozeItem): clozeItem is Blank => !!clozeItem.validOptions)
          .forEach((clozeItem) => {
            clozeItem.validOptions.forEach((wordRefOrRefs) => {
              if (!Array.isArray(wordRefOrRefs)) {
                words.add(this.getWord(wordRefOrRefs));
              }
              // Don't add composite words
              // else {
              //   (wordRefOrRefs as Array<WordRef>).forEach((wordRef) => {
              //     words.add(this.getWord(wordRef));
              //   });
              // }
            });
          });
      }
      // TODO Revisit to evaluate whether to re-add new words review for comprehension exercises
      // if (exercise.type === 'Comprehension' && exercise.comprehensionSpec) {
      //   exercise.comprehensionSpec.multipleChoiceWords?.forEach((wordRef) => {
      //     words.add(this.getWord(wordRef));
      //   });
      //   exercise.comprehensionSpec.matchingWords?.forEach((wordRef) => {
      //     words.add(this.getWord(wordRef));
      //   });
      // }
    });
    return [...words];
  }

  public static getAudioData(path: string): string {
    return `data:audio/mpeg;base64,${
      mp3Base64Sources[`${contentFolder}${path}.audio`] as string
    }`;
  }

  public static getPicPath(path: string): string {
    return picSources[`${contentFolder}${path}`] as string;
  }

  public static getInstructionsAudio(
    scope: keyof ContentSpec['instructions'],
  ): string {
    return this.getAudioData(this.ContentSpec.instructions[scope]);
  }

  public static getIcon(key: string): string {
    const drawPath = mdiIcons.get(key);
    if (!drawPath) {
      console.error('Missing icon:', key);
      return '';
    } else {
      return `data:image/svg+xml,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="${drawPath}"/></svg>`;
    }
  }

  public static getWord(wordRef: string | WordRef): WordSpec {
    if (typeof wordRef === 'string') {
      return Content.WordListSpec.words[wordRef];
    } else {
      return Content.WordListSpec.words[Object.values(wordRef)[0]];
    }
  }
}
