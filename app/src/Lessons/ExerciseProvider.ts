import { reactive } from 'vue';
import { ExerciseAudio } from '@/common/types/ExerciseAudioType';
import { MatchingItem } from '@/Matching/MatchingTypes';
import {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '@/MultipleChoice/MultipleChoiceTypes';
import { ClozeExercise, ClozeOption, ClozeWord } from '@/Cloze/ClozeTypes';
import {
  Blank,
  ExerciseSpec,
  LessonSpec,
  WordSpec,
  WordRef,
} from './ContentTypes';

import ContentSpec from './ContentSpec';

export type ExerciseType =
  | 'Matching'
  | 'MultipleChoice'
  | 'ExplanationMatching'
  | 'ExplanationMultipleChoice'
  | 'SingleCloze'
  | 'MultiCloze';

export type ExerciseItems =
  | Array<MatchingItem>
  | MultipleChoiceExercise
  | ClozeExercise;

export interface Exercise {
  exerciseType: ExerciseType;
  exerciseItems: ExerciseItems;
}

export default class ExerciseProvider {
  private static lessons = [] as Array<LessonSpec>;
  private static GenerateExerciseOfType: {
    [key in ExerciseType]: (lesson: LessonSpec) => Exercise;
  } = {
    Matching: this.generateMatchingExercise,
    MultipleChoice: this.generateMultipleChoiceExercise,
    ExplanationMatching: this.generateExplanationMatchingExercise,
    ExplanationMultipleChoice: this.generateExplanationMultipleChoiceExercise,
    SingleCloze: this.generateSingleClozeExercise,
    MultiCloze: this.generateMultiClozeExercise,
  };

  public static getExerciseFromLesson(indexFromOne: number): Exercise {
    const lessons = ContentSpec.getLessons();
    this.validateExerciseIndex(indexFromOne, lessons);
    const indexFromZero = indexFromOne - 1;
    const lesson = lessons[indexFromZero];
    return this.GenerateExerciseOfType[
      this.pickRandomExerciseType(lesson)
    ].bind(this)(lesson);
  }

  public static validateExerciseIndex(
    indexFromOne: number,
    lessons: Array<LessonSpec>,
  ): void {
    if (indexFromOne < 1 || indexFromOne > lessons.length) {
      throw new Error(`Please choose a lesson between 1 and ${lessons.length}`);
    }
  }

  public static pickRandomExerciseType(lesson: LessonSpec): ExerciseType {
    const validTypes = [] as Array<ExerciseType>;
    if (lesson.matchingCount >= 2) {
      validTypes.push('Matching');
    }
    if (lesson.multipleChoiceCount >= 4) {
      validTypes.push('MultipleChoice');
    }
    if (lesson.explanationCount >= 2) {
      validTypes.push('ExplanationMatching');
    }
    if (lesson.explanationCount >= 1) {
      validTypes.push('ExplanationMultipleChoice');
    }
    if (lesson.singleClozeCount >= 1) {
      validTypes.push('SingleCloze');
    }
    if (lesson.multiClozeCount >= 1) {
      validTypes.push('MultiCloze');
    }
    return this.pickRandomItem(validTypes);
  }

  public static generateMatchingExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: Array<MatchingItem>;
  } {
    const exerciseSpec = this.pickRandomItem(
      lesson.exercises.filter((exercise) => exercise.type === 'Matching'),
    );
    const selectedWordRefs = this.selectRandomSubset(
      exerciseSpec.words || [],
      {
        minItems: 2,
        maxItems: 4,
      },
      lesson.lessonIndex,
    );

    const selectedWords = selectedWordRefs.map((wordRef) =>
      ContentSpec.getWord(wordRef),
    );

    const matchingExercises = this.createPairsFromWords(selectedWords);

    this.shuffleMatchingItemsInPlace(matchingExercises);
    return { exerciseType: 'Matching', exerciseItems: matchingExercises };
  }

  public static generateExplanationMatchingExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: Array<MatchingItem>;
  } {
    const explanationSpecs = lesson.exercises.filter(
      (exercise) => exercise.type === 'Explanation',
    );

    const selectedExplanations = this.selectRandomSubset(
      explanationSpecs,
      {
        minItems: 2,
        maxItems: 2,
      },
      lesson.lessonIndex,
    );

    const matchingExercises =
      this.createExplanationInterpretationPairs(selectedExplanations);

    this.shuffleMatchingItemsInPlace(matchingExercises);
    return { exerciseType: 'Matching', exerciseItems: matchingExercises };
  }

  public static generateMultipleChoiceExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: MultipleChoiceExercise;
  } {
    const exerciseSpec = this.pickRandomItem(
      lesson.exercises.filter((exercise) => exercise.type === 'MultipleChoice'),
    );
    const selectedWordRefs = this.selectRandomSubset(
      exerciseSpec.words || [],
      {
        minItems: 4,
        maxItems: 4,
      },
      lesson.lessonIndex,
    );

    const selectedWords = selectedWordRefs.map((wordRef) =>
      ContentSpec.getWord(wordRef),
    );

    const multipleChoiceExercise =
      this.createMultipleChoiceExerciseFromWords(selectedWords);

    this.makeRandomItemCorrectOption(multipleChoiceExercise, selectedWords);

    return {
      exerciseType: 'MultipleChoice',
      exerciseItems: multipleChoiceExercise,
    };
  }

  public static generateExplanationMultipleChoiceExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: MultipleChoiceExercise;
  } {
    const explanationSpecs = lesson.exercises.filter(
      (exercise) => exercise.type === 'Explanation',
    );
    const explanationSpec = this.pickRandomItem(explanationSpecs);

    // ensure lesson has 1 or more explanations
    if (
      !explanationSpec ||
      !explanationSpec.explanation ||
      !(explanationSpec.explanation?.length > 0) ||
      !explanationSpec.explanationTargets ||
      !explanationSpec.explanationTargets.validOption ||
      !explanationSpec.explanationTargets.invalidOptions ||
      !(explanationSpec.explanationTargets.invalidOptions.length > 0)
    ) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has zero valid explanation items, which is too few to generate an exercise.`,
      );
    }

    // create collection of options, starting with correct interpretation
    const multipleChoiceExercise = {
      explanationToMatch: explanationSpec.explanation
        .map((wordRef) => ContentSpec.getWord(wordRef).word)
        .join(''),
      options: [] as Array<MultipleChoiceItem>,
    } as MultipleChoiceExercise;

    const validWord = ContentSpec.getWord(
      explanationSpec.explanationTargets?.validOption,
    );

    if (!validWord) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has an explanation (${explanationSpec.id}) without a valid matching target (${explanationSpec.explanationTargets?.validOption}).`,
      );
    }
    const correctOption = {
      word: validWord.word,
      audio: {} as HTMLAudioElement,
      correct: true,
      disabled: false,
      playing: false,
      buzzing: false,
    } as MultipleChoiceItem;

    const path = ContentSpec.getAudioPath(`${validWord.audio}`);
    correctOption.audio = new Audio(path);

    multipleChoiceExercise.options.push(correctOption);

    const invalidOptions =
      explanationSpec.explanationTargets?.invalidOptions.map((wordRef) =>
        ContentSpec.getWord(wordRef),
      );

    const selectedOptions = this.selectRandomSubset(
      invalidOptions,
      {
        minItems: 1,
        maxItems: 3,
      },
      lesson.lessonIndex,
    );

    selectedOptions.forEach((wordSpec: WordSpec) => {
      const incorrectInterpretation = {
        word: wordSpec.word,
        audio: {} as HTMLAudioElement,
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      } as MultipleChoiceItem;

      const path = ContentSpec.getAudioPath(`${wordSpec.audio}`);
      incorrectInterpretation.audio = new Audio(path);
      multipleChoiceExercise.options.push(incorrectInterpretation);
    });

    // shuffle options
    this.shuffleMultipleChoiceItemsInPlace(multipleChoiceExercise.options);
    return {
      exerciseType: 'MultipleChoice',
      exerciseItems: multipleChoiceExercise,
    };
  }

  public static generateSingleClozeExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: ClozeExercise;
  } {
    const exerciseSpecs = lesson.exercises.filter(
      (exercise) =>
        exercise.type === 'SingleCloze' &&
        exercise.singleClozeText &&
        exercise.singleClozeText.length > 0,
    );

    if (exerciseSpecs.length === 0) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has zero single-blank cloze items, which is too few to generate an exercise.`,
      );
    }
    const selectedSingleClozeSpec = this.pickRandomItem(exerciseSpecs);
    const singleClozeExercise = this.createSingleClozeExerciseFromClozeSpec(
      selectedSingleClozeSpec,
      lesson.lessonIndex,
    );

    return {
      exerciseType: 'SingleCloze',
      exerciseItems: singleClozeExercise,
    };
  }

  public static generateMultiClozeExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: ClozeExercise;
  } {
    const multiClozeItems = this.selectMultiClozeSpecs(lesson);
    if (multiClozeItems.length === 0) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has zero multi-blank cloze items, which is too few to generate an exercise.`,
      );
    }
    const selectedMultiClozeItem = this.pickRandomItem(multiClozeItems);
    const multiClozeExercise = this.createMultiClozeExerciseFromClozeItem(
      selectedMultiClozeItem,
      lesson.lessonIndex,
    );

    return {
      exerciseType: 'MultiCloze',
      exerciseItems: multiClozeExercise,
    };
  }

  public static selectMultiClozeSpecs(lesson: LessonSpec): Array<ExerciseSpec> {
    return lesson.exercises.filter((exercise: ExerciseSpec) => {
      return exercise.multiClozeText && exercise.multiClozeText.length > 0;
    });
  }

  public static selectRandomSubset<T>(
    items: Array<T>,
    limits: { minItems: number; maxItems: number },
    lessonIndex: number,
  ): Array<T> {
    this.hasAtLeast(items, limits.minItems, lessonIndex);
    const selected = [];
    const itemIndices = [...Array(items.length).keys()];
    const maxItemsAccepted = Math.min(limits.maxItems, items.length);
    for (let i = 0; i < maxItemsAccepted; i += 1) {
      const randomUniqueIndex = itemIndices.splice(
        this.randomIndexLessThan(itemIndices.length),
        1,
      )[0];
      selected.push(items[randomUniqueIndex]);
    }
    return selected;
  }

  public static hasAtLeast<T>(
    items: Array<T>,
    lowerLimit: number,
    lessonIndex: number,
  ): void {
    if (items.length < lowerLimit) {
      throw new Error(
        `Lesson ${lessonIndex} only has ${items.length} suitable item(s), which is too few to generate this exercise.`,
      );
    }
  }

  public static createPairsFromWords(
    words: Array<WordSpec>,
  ): Array<MatchingItem> {
    const matchingExercises = [] as Array<MatchingItem>;
    words.forEach((wordSpec: WordSpec, index: number) => {
      const wordPart = {
        wordOrIcons: wordSpec.word,
        audio: {} as ExerciseAudio,
        // match: {} as MatchingItem
        match: index * 2 + 1,
        color: '',
        isWord: true,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      } as MatchingItem;
      const symPart = {
        wordOrIcons: [] as Array<string>,
        audio: {} as ExerciseAudio,
        // match: wordPart,
        match: index * 2,
        color: 'primary',
        isWord: false,
        isIcon: true,
        matched: false,
        selected: false,
        buzzing: false,
      } as MatchingItem;
      // wordPart.match = symPart;

      if (wordSpec.symbol) {
        wordSpec.symbol.forEach((symbol) => {
          (symPart.wordOrIcons as Array<string>).push(
            ContentSpec.getMdiIcon(symbol),
          );
        });
      }

      if (wordSpec.audio) {
        const path = ContentSpec.getAudioPath(`${wordSpec.audio}`);
        wordPart.audio = this.createAudio(path);
        symPart.audio = this.createAudio(path);
      }

      matchingExercises.push(wordPart);
      matchingExercises.push(symPart);
    });
    return matchingExercises;
  }

  public static createExplanationInterpretationPairs(
    explanationItems: Array<ExerciseSpec>,
  ): Array<MatchingItem> {
    const matchingExercises = [] as Array<MatchingItem>;

    explanationItems.forEach((explanationItem: ExerciseSpec, index: number) => {
      if (
        !explanationItem.explanationTargets ||
        !explanationItem.explanationTargets.validOption ||
        !explanationItem.explanationTargets.invalidOptions ||
        explanationItem.explanationTargets.invalidOptions.length < 1
      ) {
        throw new Error(
          `The explanation (${explanationItem.id}) is not valid.`,
        );
      }
      const explanationPart = {
        wordOrIcons: explanationItem.explanation
          ?.map((wordRef) => ContentSpec.getWord(wordRef).word)
          .join(''),
        audio: {} as ExerciseAudio,
        // match: {} as MatchingItem
        match: index * 2 + 1,
        color: 'primary',
        isWord: false,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      } as MatchingItem;

      const interpretationItem = ContentSpec.getWord(
        explanationItem.explanationTargets?.validOption,
      );
      if (
        !interpretationItem ||
        !interpretationItem.word ||
        interpretationItem.word.length < 1
      ) {
        throw new Error(
          `The explanation (${explanationItem.id}) does not have a valid corresponding interpretation word.`,
        );
      }
      const wordPart = {
        wordOrIcons: interpretationItem.word,
        audio: {} as ExerciseAudio,
        // match: wordPart,
        match: index * 2,
        color: '',
        isWord: true,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      } as MatchingItem;
      // wordPart.match = symPart;

      let path = ContentSpec.getAudioPath(`${explanationItem.audio}`);
      explanationPart.audio = this.createAudio(path);

      path = ContentSpec.getAudioPath(`${interpretationItem.audio}`);
      wordPart.audio = this.createAudio(path);

      matchingExercises.push(explanationPart);
      matchingExercises.push(wordPart);
    }); // end explanationItems.forEach

    return matchingExercises;
  }

  public static createAudio(src: string): ExerciseAudio {
    const el = new Audio(src);
    const audio = reactive({
      el,
      playing: false,
      play() {
        el.currentTime = 0;
        el.play();
      },
      cancel() {
        el.pause();
      },
    }) as ExerciseAudio;

    el.onplaying = () => {
      audio.playing = true;
    };
    el.onpause = () => {
      audio.playing = false;
    };
    el.onended = () => {
      audio.playing = false;
    };

    return audio;
  }

  public static shuffleMatchingItemsInPlace(
    matchingExercises: Array<MatchingItem>,
  ): void {
    for (let i = matchingExercises.length - 1; i > 0; i -= 1) {
      const j = this.randomIndexLessThan(i + 1);
      if (j !== i) {
        // update match targets
        if (matchingExercises[i].match === j) {
          // if matches are each others matches
          matchingExercises[i].match = i;
          matchingExercises[j].match = j;
        } else {
          // if item.match points to a pre-swap index, inject post-swap index
          matchingExercises[matchingExercises[i].match].match = j;
          matchingExercises[matchingExercises[j].match].match = i;
        }
        // swap location in list
        [matchingExercises[i], matchingExercises[j]] = [
          matchingExercises[j],
          matchingExercises[i],
        ];
      }
    }
  }

  public static shuffleItemsInPlace(
    items: Array<MultipleChoiceItem> | Array<ClozeOption>,
  ): void {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = this.randomIndexLessThan(i + 1);
      if (j !== i) {
        // swap location in list
        [items[i], items[j]] = [items[j], items[i]];
      }
    }
  }

  public static shuffleMultipleChoiceItemsInPlace(
    multipleChoiceItems: Array<MultipleChoiceItem>,
  ): void {
    for (let i = multipleChoiceItems.length - 1; i > 0; i -= 1) {
      const j = this.randomIndexLessThan(i + 1);
      if (j !== i) {
        // swap location in list
        [multipleChoiceItems[i], multipleChoiceItems[j]] = [
          multipleChoiceItems[j],
          multipleChoiceItems[i],
        ];
      }
    }
  }

  public static createMultipleChoiceExerciseFromWords(
    selectedItems: Array<WordSpec>,
  ): MultipleChoiceExercise {
    const multipleChoiceExercise = {
      itemUnderTestAudio: {} as HTMLAudioElement,
      itemUnderTestAudioPlaying: false,
      iconToMatch: [] as Array<string>,
      options: [] as Array<MultipleChoiceItem>,
    } as MultipleChoiceExercise;

    selectedItems.forEach((wordSpec: WordSpec) => {
      const exerciseItem = {
        word: wordSpec.word,
        audio: {} as HTMLAudioElement,
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      } as MultipleChoiceItem;
      const path = ContentSpec.getAudioPath(`${wordSpec.audio}`);
      exerciseItem.audio = new Audio(path);
      multipleChoiceExercise.options.push(exerciseItem);
    });
    return multipleChoiceExercise;
  }

  public static createSingleClozeExerciseFromClozeSpec(
    clozeSpec: ExerciseSpec,
    lessonIndex: number,
  ): ClozeExercise {
    if (!clozeSpec.singleClozeText || clozeSpec.singleClozeText.length < 2) {
      throw new Error(
        `Lesson ${lessonIndex}'s item ${clozeSpec.id} does not have a clozeText with enough words and blanks to generate an exercise.`,
      );
    }

    const blanks = clozeSpec.singleClozeText.filter(
      (wordRefOrBlank) =>
        'validOptions' in wordRefOrBlank &&
        wordRefOrBlank.validOptions &&
        wordRefOrBlank.validOptions.length > 0 &&
        'invalidOptions' in wordRefOrBlank &&
        wordRefOrBlank.invalidOptions &&
        wordRefOrBlank.invalidOptions.length > 0,
    ).length;
    const pickedBlankIndex = this.randomIndexLessThan(blanks);
    let currentBlankIndex = 0;

    const clozeText: Array<ClozeWord> = [];
    const clozeOptions: Array<ClozeOption> = [];
    clozeSpec.singleClozeText.forEach((wordRefOrBlank) => {
      const clozeWord: ClozeWord = {
        word: '',
        buzzing: false,
        revealed: false,
      };

      if (
        'validOptions' in wordRefOrBlank &&
        wordRefOrBlank.validOptions &&
        wordRefOrBlank.validOptions.length > 0
      ) {
        // Blank
        const validOption = this.pickRandomItem(
          (wordRefOrBlank as Blank).validOptions,
        );
        const wordSpec = ContentSpec.getWord(validOption);
        clozeWord.word = wordSpec.word;
        if (wordSpec.audio) {
          clozeWord.audio = this.createAudio(
            ContentSpec.getAudioPath(wordSpec.audio),
          );
        }
        if (
          wordSpec.isPunctuation &&
          [true, 'true'].includes(wordSpec.isPunctuation)
        ) {
          clozeWord.isPunctuation = true;
        }

        if (
          'invalidOptions' in wordRefOrBlank &&
          wordRefOrBlank.invalidOptions &&
          wordRefOrBlank.invalidOptions.length > 0
        ) {
          if (currentBlankIndex === pickedBlankIndex) {
            clozeWord.isBlank = true;
            const clozeOption: ClozeOption = {
              word: clozeWord.word,
              correct: true,
              buzzing: false,
              disabled: false,
              color: 'primary',
            };
            if (wordSpec.audio) {
              clozeOption.audio = this.createAudio(
                ContentSpec.getAudioPath(wordSpec.audio),
              );
            }
            if (clozeSpec.suppressOptionAudio) {
              clozeOption.suppressOptionAudio = clozeSpec.suppressOptionAudio;
            }
            clozeOptions.push(clozeOption);

            const wordRefs = this.selectRandomSubset(
              (wordRefOrBlank as Blank).invalidOptions || [],
              {
                minItems: 3,
                maxItems: 3,
              },
              lessonIndex,
            );
            clozeOptions.push(
              ...wordRefs.map((wordRef) => {
                const wordSpec = ContentSpec.getWord(wordRef);
                const clozeOption: ClozeOption = {
                  word: wordSpec.word,
                  correct: false,
                  buzzing: false,
                  disabled: false,
                  color: 'primary',
                };
                if (wordSpec.audio) {
                  clozeOption.audio = this.createAudio(
                    ContentSpec.getAudioPath(wordSpec.audio),
                  );
                }
                if (clozeSpec.suppressOptionAudio) {
                  clozeOption.suppressOptionAudio = true;
                }
                return clozeOption;
              }),
            );
          }
          currentBlankIndex += 1;
        }
      } else {
        // WordRef
        const wordSpec = ContentSpec.getWord(wordRefOrBlank as WordRef);
        clozeWord.word = wordSpec.word;
        if (wordSpec.audio) {
          clozeWord.audio = this.createAudio(
            ContentSpec.getAudioPath(wordSpec.audio),
          );
        }
        if (
          wordSpec.isPunctuation &&
          [true, 'true'].includes(wordSpec.isPunctuation)
        ) {
          clozeWord.isPunctuation = true;
        }
      }

      if (clozeSpec.suppressClozeAudio) {
        clozeWord.suppressClozeAudio = true;
      }

      clozeText.push(clozeWord);
    });

    this.shuffleItemsInPlace(clozeOptions);

    return {
      clozeType: 'SingleCloze',
      clozeText,
      clozeOptions,
    } as ClozeExercise;
  }

  public static createMultiClozeExerciseFromClozeItem(
    clozeItem: ExerciseSpec,
    lessonIndex: number,
  ): ClozeExercise {
    if (!clozeItem.multiClozeText || clozeItem.multiClozeText.length < 3) {
      throw new Error(
        `Lesson ${lessonIndex}'s item ${clozeItem.id} does not have enough elements in multiClozeText to generate an exercise.`,
      );
    }

    const blanks = clozeItem.multiClozeText.filter(
      (wordRefOrBlank) =>
        'validOptions' in wordRefOrBlank &&
        wordRefOrBlank.validOptions &&
        wordRefOrBlank.validOptions.length > 0,
    );

    if (!blanks || blanks.length <= 1) {
      throw new Error(
        `Lesson ${lessonIndex}'s item ${clozeItem.id} does not have enough blanks in multiClozeText to generate an exercise.`,
      );
    }

    let wordRef = '';
    const multiClozeOptions: Array<ClozeOption> = [];
    const clozeText: Array<ClozeWord> = clozeItem.multiClozeText.map(
      (wordRefOrBlank) => {
        const multiClozeWord: ClozeWord = {
          word: '',
          buzzing: false,
          isBlank: false,
          revealed: false,
        };

        if (
          'validOptions' in wordRefOrBlank &&
          wordRefOrBlank.validOptions &&
          wordRefOrBlank.validOptions.length > 0
        ) {
          // blank
          // assume only one valid option for multiCloze
          multiClozeWord.word = Object.keys(wordRefOrBlank.validOptions[0])[0];
          multiClozeWord.isBlank = true;
          const option: ClozeOption = {
            word: multiClozeWord.word.toString(),
            buzzing: false,
            color: 'primary',
            disabled: false,
          };
          wordRef = (wordRefOrBlank as Blank).validOptions[0][
            multiClozeWord.word
          ];
          const wordSpec = ContentSpec.getWord(wordRef);
          if (wordSpec && wordSpec.audio) {
            multiClozeWord.audio = this.createAudio(
              ContentSpec.getAudioPath(wordSpec.audio),
            );
            option.audio = this.createAudio(
              ContentSpec.getAudioPath(wordSpec.audio),
            );
            if (
              wordSpec.isPunctuation &&
              [true, 'true'].includes(wordSpec.isPunctuation)
            ) {
              multiClozeWord.isPunctuation = true;
            }
          }
          if (clozeItem.suppressOptionAudio) {
            option.suppressOptionAudio = true;
          }
          multiClozeOptions.push(option);
        } else {
          // wordRef
          multiClozeWord.word = Object.keys(wordRefOrBlank)[0];
          wordRef = (wordRefOrBlank as WordRef)[multiClozeWord.word];
          const wordSpec = ContentSpec.getWord(wordRef);
          if (wordSpec && wordSpec.audio) {
            multiClozeWord.audio = this.createAudio(
              ContentSpec.getAudioPath(wordSpec.audio),
            );
          }
          if (
            wordSpec &&
            wordSpec.isPunctuation &&
            [true, 'true'].includes(wordSpec.isPunctuation)
          ) {
            multiClozeWord.isPunctuation = true;
          }
        }
        if (clozeItem.suppressClozeAudio) {
          multiClozeWord.suppressClozeAudio = true;
        }
        return multiClozeWord;
      },
    );

    this.shuffleItemsInPlace(multiClozeOptions);

    return {
      clozeType: 'MultiCloze',
      clozeText,
      clozeOptions: multiClozeOptions,
    } as ClozeExercise;
  }

  public static makeRandomItemCorrectOption(
    multipleChoiceExercise: MultipleChoiceExercise,
    selectedItems: Array<WordSpec>,
  ): void {
    // pick random item as correct option
    const correctIndex = this.randomIndexLessThan(selectedItems.length);
    const correctItem = selectedItems[correctIndex];
    multipleChoiceExercise.options[correctIndex].correct = true;

    const path = ContentSpec.getAudioPath(`${correctItem.audio}`);
    multipleChoiceExercise.itemUnderTestAudio = new Audio(path);

    if (correctItem.symbol && correctItem.symbol.length > 0) {
      correctItem.symbol.forEach((symbol) => {
        (multipleChoiceExercise.iconToMatch as Array<string>).push(
          ContentSpec.getMdiIcon(symbol),
        );
      });
    } else {
      multipleChoiceExercise.iconToMatch = [
        ContentSpec.getMdiIcon('mdiCellphoneWireless'),
      ];
    }
  }

  public static pickRandomItem<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  public static randomIndexLessThan(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
