import { reactive } from 'vue';
import { ClozeExercise, ClozeOption, ClozeWord } from '@/Cloze/ClozeTypes';
import {
  ComprehensionExercise,
  ComprehensionOption,
  ComprehensionQuestion,
  ComprehensionStage,
  ComprehensionWord,
} from '@/Comprehension/ComprehensionTypes';
import { ExerciseAudio } from '@/common/types/ExerciseAudioType';
import { MatchingExercise, MatchingItem } from '@/Matching/MatchingTypes';
import {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '@/MultipleChoice/MultipleChoiceTypes';
import {
  Blank,
  ExerciseSpec,
  LessonSpec,
  WordSpec,
  WordRef,
  ComprehensionSpec,
} from './ContentTypes';
import Content from './Content';

export type ExerciseType =
  | 'Matching'
  | 'MultipleChoice'
  | 'ExplanationMatching'
  | 'ExplanationMultipleChoice'
  | 'SingleCloze'
  | 'MultiCloze'
  | 'Comprehension';

export type ExerciseItems =
  | Array<string>
  | MatchingExercise
  | MultipleChoiceExercise
  | ClozeExercise
  | ComprehensionExercise;

export interface Exercise {
  exerciseType: ExerciseType;
  exerciseItems: ExerciseItems;
}

export default class ExerciseProvider {
  private static GenerateExerciseOfType: {
    [key in ExerciseType]: (lesson: LessonSpec) => Exercise;
  } = {
    Matching: this.generateMatchingExercise,
    MultipleChoice: this.generateMultipleChoiceExercise,
    ExplanationMatching: this.generateExplanationMatchingExercise,
    ExplanationMultipleChoice: this.generateExplanationMultipleChoiceExercise,
    SingleCloze: this.generateSingleClozeExercise,
    MultiCloze: this.generateMultiClozeExercise,
    Comprehension: this.generateComprehensionExercise,
  };

  public static getExerciseFromLesson(indexFromOne: number): Exercise {
    this.validateExerciseIndex(indexFromOne, Content.LessonSpecs);
    const indexFromZero = indexFromOne - 1;
    const lesson = Content.LessonSpecs[indexFromZero];
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
    if (lesson.comprehensionCount >= 1) {
      validTypes.push('Comprehension');
    }
    return this.pickRandomItem(validTypes);
  }

  public static generateMatchingExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: MatchingExercise;
  } {
    const exerciseFromSpec = this.pickRandomItem(
      lesson.exercises.filter((exercise) => exercise.type === 'Matching'),
    );
    const selectedWordRefs = this.selectRandomSubset(
      exerciseFromSpec.matchingWords || [],
      { minItems: 2, maxItems: 4 },
      lesson.lessonIndex,
    );

    const selectedWords = selectedWordRefs.map((wordRef) =>
      Content.getWord(wordRef),
    );

    const matchingExercises = this.createPairsFromWords(selectedWords);

    this.shuffleMatchingItemsInPlace(matchingExercises);
    return { exerciseType: 'Matching', exerciseItems: matchingExercises };
  }

  public static generateExplanationMatchingExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: MatchingExercise;
  } {
    const explanationSpecs = lesson.exercises.filter(
      (exercise) => exercise.type === 'Explanation',
    );

    const selectedExplanations = this.selectRandomSubset(
      explanationSpecs,
      { minItems: 2, maxItems: 2 },
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
    const exerciseFromSpec = this.pickRandomItem(
      lesson.exercises.filter((exercise) => exercise.type === 'MultipleChoice'),
    );
    const selectedWordRefs = this.selectRandomSubset(
      exerciseFromSpec.multipleChoiceWords || [],
      { minItems: 4, maxItems: 4 },
      lesson.lessonIndex,
    );

    const selectedWords = selectedWordRefs.map((wordRef) =>
      Content.getWord(wordRef),
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
    const explanationExercises = lesson.exercises.filter(
      (exercise) => exercise.type === 'Explanation',
    );
    const explanationExercise = this.pickRandomItem(explanationExercises);
    const explanationSpec = explanationExercise.explanationSpec;

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
        .map((wordRef) => Content.getWord(wordRef).word)
        .join(''),
      options: [] as Array<MultipleChoiceItem>,
    } as MultipleChoiceExercise;

    const validWord = Content.getWord(
      explanationSpec.explanationTargets?.validOption,
    );

    if (!validWord) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has an explanation (${explanationExercise.id}) without a valid matching target (${explanationSpec.explanationTargets?.validOption}).`,
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

    const path = Content.getAudioData(`${validWord.audio}`);
    correctOption.audio = new Audio(path);

    multipleChoiceExercise.options.push(correctOption);

    const invalidOptions =
      explanationSpec.explanationTargets?.invalidOptions.map((wordRef) =>
        Content.getWord(wordRef),
      );

    const selectedOptions = this.selectRandomSubset(
      invalidOptions,
      { minItems: 1, maxItems: 3 },
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

      const path = Content.getAudioData(`${wordSpec.audio}`);
      incorrectInterpretation.audio = new Audio(path);
      multipleChoiceExercise.options.push(incorrectInterpretation);
    });

    // shuffle options
    this.shuffleItemsInPlace(multipleChoiceExercise.options);
    return {
      exerciseType: 'MultipleChoice',
      exerciseItems: multipleChoiceExercise,
    };
  }

  public static generateSingleClozeExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: ClozeExercise;
  } {
    const selectedExerciseSpec = this.selectClozeExerciseFromSpec(
      lesson,
      'SingleCloze',
    );

    const singleClozeExercise = this.createExerciseFromSingleClozeSpec(
      selectedExerciseSpec,
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
    const selectedExerciseSpec = this.selectClozeExerciseFromSpec(
      lesson,
      'MultiCloze',
    );

    const multiClozeExercise = this.createExerciseFromMultiClozeSpec(
      selectedExerciseSpec,
      lesson.lessonIndex,
    );

    return {
      exerciseType: 'MultiCloze',
      exerciseItems: multiClozeExercise,
    };
  }

  public static selectClozeExerciseFromSpec(
    lesson: LessonSpec,
    clozeType: 'SingleCloze' | 'MultiCloze',
  ): ExerciseSpec {
    let exerciseSpecs = [] as Array<ExerciseSpec>;
    if (clozeType === 'SingleCloze') {
      exerciseSpecs = lesson.exercises.filter(
        (exercise) =>
          exercise.type === 'SingleCloze' &&
          exercise.singleClozeSpec?.text &&
          exercise.singleClozeSpec?.text.length > 0,
      );
    } else if (clozeType === 'MultiCloze') {
      exerciseSpecs = lesson.exercises.filter(
        (exercise) =>
          exercise.type === 'MultiCloze' &&
          exercise.multiClozeSpec?.text &&
          exercise.multiClozeSpec?.text.length > 0,
      );
    }

    if (exerciseSpecs.length === 0) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has zero multi-blank cloze items, which is too few to generate an exercise.`,
      );
    }
    return this.pickRandomItem(exerciseSpecs);
  }

  public static generateComprehensionExercise(lesson: LessonSpec): {
    exerciseType: ExerciseType;
    exerciseItems: ComprehensionExercise;
  } {
    const exerciseSpecs = lesson.exercises.filter(
      (exercise) => exercise.type === 'Comprehension',
    );

    if (exerciseSpecs.length === 0) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has zero comprehension exercises, which is too few to generate an exercise.`,
      );
    }

    const selectedExercise = this.pickRandomItem(exerciseSpecs);

    if (selectedExercise.comprehensionSpec === undefined) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has a comprehension exercise (${selectedExercise.id}) without a "comprehensionSpec", therefore lacking necessary data to generate an exercise.`,
      );
    }

    const comprehensionExercise = this.createExerciseFromComprehensionSpec(
      selectedExercise.comprehensionSpec,
      selectedExercise.id,
      lesson.lessonIndex,
    );

    return {
      exerciseType: 'Comprehension',
      exerciseItems: comprehensionExercise,
    };
  }

  public static selectRandomSubset<T>(
    items: Array<T>,
    { minItems, maxItems }: { minItems: number; maxItems: number },
    lessonIndex: number,
  ): Array<T> {
    this.hasAtLeast(items, minItems, lessonIndex);
    const selected = [];
    const itemIndices = [...Array(items.length).keys()];
    const maxItemsAccepted = Math.min(maxItems, items.length);
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

  public static createPairsFromWords(words: Array<WordSpec>): MatchingExercise {
    const matchingItems = [] as Array<MatchingItem>;
    words.forEach((wordSpec: WordSpec, index: number) => {
      const wordPart = {
        wordOrIcons: wordSpec.word,
        audio: {} as ExerciseAudio,
        // match: {} as MatchingItem
        match: index * 2 + 1,
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
        isWord: false,
        isIcon: true,
        matched: false,
        selected: false,
        buzzing: false,
      } as MatchingItem;
      // wordPart.match = symPart;

      if (wordSpec.symbol) {
        wordSpec.symbol.forEach((symbol) => {
          (symPart.wordOrIcons as Array<string>).push(Content.getIcon(symbol));
        });
      } else if (wordSpec.picture) {
        symPart.picture = Content.getPicPath(wordSpec.picture);
        symPart.isIcon = false;
      }

      if (wordSpec.audio) {
        const path = Content.getAudioData(`${wordSpec.audio}`);
        wordPart.audio = this.createAudio(path);
        symPart.audio = this.createAudio(path);
      }

      matchingItems.push(wordPart);
      matchingItems.push(symPart);
    });
    return matchingItems;
  }

  public static createExplanationInterpretationPairs(
    explanationItems: Array<ExerciseSpec>,
  ): MatchingExercise {
    const matchingExercises = [] as Array<MatchingItem>;

    explanationItems.forEach((explanationItem: ExerciseSpec, index: number) => {
      const explanationSpec = explanationItem.explanationSpec;
      if (
        !explanationSpec?.explanationTargets ||
        !explanationSpec?.explanationTargets.validOption ||
        !explanationSpec?.explanationTargets.invalidOptions ||
        explanationSpec?.explanationTargets.invalidOptions.length < 1
      ) {
        throw new Error(
          `The explanation (${explanationItem.id}) is not valid.`,
        );
      }
      const explanationPart = {
        wordOrIcons: explanationSpec.explanation
          ?.map((wordRef) => Content.getWord(wordRef).word)
          .join(''),
        audio: {} as ExerciseAudio,
        // match: {} as MatchingItem
        match: index * 2 + 1,
        isWord: false,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      } as MatchingItem;

      const interpretationItem = Content.getWord(
        explanationSpec.explanationTargets?.validOption,
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
        isWord: true,
        isIcon: false,
        matched: false,
        selected: false,
        buzzing: false,
      } as MatchingItem;
      // wordPart.match = symPart;

      explanationPart.audio = this.createAudio(
        Content.getAudioData(`${explanationSpec.audio}`),
      );

      wordPart.audio = this.createAudio(
        Content.getAudioData(`${interpretationItem.audio}`),
      );

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
    matchingExercise: Array<MatchingItem>,
  ): void {
    for (let i = matchingExercise.length - 1; i > 0; i -= 1) {
      const j = this.randomIndexLessThan(i + 1);
      if (j !== i) {
        // update match targets
        if (matchingExercise[i].match === j) {
          // if matches are each others matches
          matchingExercise[i].match = i;
          matchingExercise[j].match = j;
        } else {
          // if item.match points to a pre-swap index, inject post-swap index
          matchingExercise[matchingExercise[i].match].match = j;
          matchingExercise[matchingExercise[j].match].match = i;
        }
        // swap location in list
        [matchingExercise[i], matchingExercise[j]] = [
          matchingExercise[j],
          matchingExercise[i],
        ];
      }
    }
  }

  public static shuffleItemsInPlace<T>(items: Array<T>): void {
    for (let i = items.length - 1; i > 0; i -= 1) {
      const j = this.randomIndexLessThan(i + 1);
      if (j !== i) {
        // swap location in list
        [items[i], items[j]] = [items[j], items[i]];
      }
    }
  }

  public static createMultipleChoiceExerciseFromWords(
    selectedItems: Array<WordSpec>,
  ): MultipleChoiceExercise {
    const multipleChoiceExercise = {
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
      const path = Content.getAudioData(`${wordSpec.audio}`);
      exerciseItem.audio = new Audio(path);
      multipleChoiceExercise.options.push(exerciseItem);
    });
    return multipleChoiceExercise;
  }

  public static createExerciseFromSingleClozeSpec(
    singleClozeExercise: ExerciseSpec,
    lessonIndex: number,
  ): ClozeExercise {
    if (
      !singleClozeExercise.singleClozeSpec?.text ||
      singleClozeExercise.singleClozeSpec.text.length < 2
    ) {
      throw new Error(
        `Lesson ${lessonIndex}'s item ${singleClozeExercise.id} does not have a clozeText with enough words and blanks to generate an exercise.`,
      );
    }

    const blanksCount = singleClozeExercise.singleClozeSpec.text.filter(
      (wordRefOrBlank) =>
        'validOptions' in wordRefOrBlank &&
        wordRefOrBlank.validOptions &&
        wordRefOrBlank.validOptions.length > 0 &&
        'invalidOptions' in wordRefOrBlank &&
        wordRefOrBlank.invalidOptions &&
        wordRefOrBlank.invalidOptions.length > 0,
    ).length;
    const pickedBlankIndex = this.randomIndexLessThan(blanksCount);
    let currentBlankIndex = 0;

    const clozeText: Array<ClozeWord> = [];
    const clozeOptions: Array<ClozeOption> = [];
    singleClozeExercise.singleClozeSpec.text.forEach((wordRefOrBlank) => {
      const clozeWord: ClozeWord = {
        word: '',
        buzzing: false,
        revealed: false,
      };

      if (!('validOptions' in wordRefOrBlank)) {
        // current wordRefOrBlank is a WordRef
        clozeWord.isBlank = false;

        const wordSpec = Content.getWord(wordRefOrBlank as WordRef);
        clozeWord.word = wordSpec.word;
        if (wordSpec.audio) {
          clozeWord.audio = this.createAudio(
            Content.getAudioData(wordSpec.audio),
          );
        }
        if (
          wordSpec.isPunctuation &&
          [true, 'true'].includes(wordSpec.isPunctuation)
        ) {
          clozeWord.isPunctuation = true;
        }
      } else {
        // current wordRefOrBlank is a Blank
        // (but may still not be picked as this exercise's blank to fill)

        const validOption = this.pickRandomItem(
          (wordRefOrBlank as Blank).validOptions,
        );

        // if validOption is not array, expect 1 ref, otherwise handle composite
        const validOptionWordSpecs = Array.isArray(validOption)
          ? // validOption is a composite WordRef[]
            validOption.map((wordRef) => Content.getWord(wordRef))
          : // validOption is a single WordRef
            [Content.getWord(validOption)];

        validOptionWordSpecs.forEach((wordSpec) => {
          clozeWord.word += wordSpec.word;
          // TODO: Handle successive audio
          if (wordSpec.audio) {
            clozeWord.audio = this.createAudio(
              Content.getAudioData(wordSpec.audio),
            );
          }
          if (
            wordSpec.isPunctuation &&
            [true, 'true'].includes(wordSpec.isPunctuation)
          ) {
            clozeWord.isPunctuation = true;
          }
        });

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
            };
            if (clozeWord.audio?.el.src) {
              clozeOption.audio = this.createAudio(clozeWord.audio.el.src);
            }
            if (singleClozeExercise.singleClozeSpec?.suppressOptionAudio) {
              clozeOption.suppressOptionAudio =
                singleClozeExercise.singleClozeSpec.suppressOptionAudio;
            }
            clozeOptions.push(clozeOption);

            const wordRefs = this.selectRandomSubset(
              (wordRefOrBlank as Blank).invalidOptions || [],
              { minItems: 3, maxItems: 3 },
              lessonIndex,
            );
            clozeOptions.push(
              ...wordRefs.map((wordRef) => {
                const wordSpec = Content.getWord(wordRef);
                const clozeOption: ClozeOption = {
                  word: wordSpec.word,
                  correct: false,
                  buzzing: false,
                  disabled: false,
                };
                if (wordSpec.audio) {
                  clozeOption.audio = this.createAudio(
                    Content.getAudioData(wordSpec.audio),
                  );
                }
                if (
                  singleClozeExercise.singleClozeSpec?.suppressOptionAudio &&
                  [true, 'true'].includes(
                    singleClozeExercise.singleClozeSpec.suppressOptionAudio,
                  )
                ) {
                  clozeOption.suppressOptionAudio = true;
                }
                return clozeOption;
              }),
            );
          }
          currentBlankIndex += 1;
        }
      }

      if (
        singleClozeExercise.singleClozeSpec?.suppressClozeAudio &&
        [true, 'true'].includes(
          singleClozeExercise.singleClozeSpec.suppressClozeAudio,
        )
      ) {
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

  public static createExerciseFromMultiClozeSpec(
    clozeSpec: ExerciseSpec,
    lessonIndex: number,
  ): ClozeExercise {
    if (
      !clozeSpec.multiClozeSpec?.text ||
      clozeSpec.multiClozeSpec?.text.length < 3
    ) {
      throw new Error(
        `Lesson ${lessonIndex}'s item "${clozeSpec.id}" does not have enough elements in multiClozeSpec.text to generate an exercise.`,
      );
    }

    const blanks = clozeSpec.multiClozeSpec.text.filter(
      (wordRefOrBlank) =>
        wordRefOrBlank.validOptions && wordRefOrBlank.validOptions.length > 0,
    );

    if (!blanks || blanks.length <= 1) {
      throw new Error(
        `Lesson ${lessonIndex}'s item ${clozeSpec.id} does not have enough blanks in multiClozeSpec.text to generate an exercise.`,
      );
    }

    const multiClozeOptions: Array<ClozeOption> = [];
    const clozeText: Array<ClozeWord> = clozeSpec.multiClozeSpec.text.map(
      (wordRefOrBlank) => {
        const multiClozeWord: ClozeWord = {
          word: '',
          buzzing: false,
          revealed: false,
        };

        if (!('validOptions' in wordRefOrBlank)) {
          // current wordRefOrBlank is a WordRef
          multiClozeWord.isBlank = false;

          const wordSpec = Content.getWord(wordRefOrBlank);
          multiClozeWord.word = wordSpec.word;
          if (wordSpec.audio) {
            multiClozeWord.audio = this.createAudio(
              Content.getAudioData(wordSpec.audio),
            );
          }
          if (
            wordSpec.isPunctuation &&
            [true, 'true'].includes(wordSpec.isPunctuation)
          ) {
            multiClozeWord.isPunctuation = true;
          }
        } else {
          // current wordRefOrBlank is a Blank
          multiClozeWord.isBlank = true;
          // assume spec has exactly one valid option for multiCloze
          const validOption = wordRefOrBlank.validOptions[0];
          // but that option can be a single WordRef or a composite of WordRefs
          const wordSpecs = Array.isArray(validOption)
            ? // validOption is a composite WordRef[]
              validOption.map((wordRef) => Content.getWord(wordRef))
            : // validOption is a single WordRef
              [Content.getWord(validOption)];

          const option: ClozeOption = {
            word: '',
            buzzing: false,
            disabled: false,
          };
          wordSpecs.forEach((wordSpec) => {
            multiClozeWord.word += wordSpec.word;
            // TODO: Handle successive audio
            if (wordSpec.audio) {
              multiClozeWord.audio = this.createAudio(
                Content.getAudioData(wordSpec.audio),
              );
              option.audio = this.createAudio(
                Content.getAudioData(wordSpec.audio),
              );
            }
            if (
              wordSpec.isPunctuation &&
              [true, 'true'].includes(wordSpec.isPunctuation)
            ) {
              multiClozeWord.isPunctuation = true;
            }
          });
          option.word = multiClozeWord.word;

          // const wordSpec = Content.getWord(wordRefOrBlank.validOptions[0]);
          // if (wordSpec && wordSpec.audio) {
          //   multiClozeWord.audio = this.createAudio(
          //     Content.getAudioData(wordSpec.audio),
          //   );
          //   option.audio = this.createAudio(
          //     Content.getAudioData(wordSpec.audio),
          //   );
          //   if (
          //     wordSpec.isPunctuation &&
          //     [true, 'true'].includes(wordSpec.isPunctuation)
          //   ) {
          //     multiClozeWord.isPunctuation = true;
          //   }
          // }
          if (
            clozeSpec.multiClozeSpec?.suppressOptionAudio &&
            [true, 'true'].includes(
              clozeSpec.multiClozeSpec.suppressOptionAudio,
            )
          ) {
            option.suppressOptionAudio = true;
          }
          multiClozeOptions.push(option);
        }
        if (
          clozeSpec.multiClozeSpec?.suppressClozeAudio &&
          [true, 'true'].includes(clozeSpec.multiClozeSpec.suppressClozeAudio)
        ) {
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

  public static createExerciseFromComprehensionSpec(
    comprehensionSpec: ComprehensionSpec,
    exerciseId: string,
    lessonIndex: number,
  ): ComprehensionExercise {
    if (!comprehensionSpec.text || comprehensionSpec.text.length < 2) {
      throw new Error(
        `Lesson ${lessonIndex} has a "comprehensionSpec" (${exerciseId}) with a too short "text" to generate an exercise.`,
      );
    }

    const comprehensionExercise = {} as ComprehensionExercise;

    comprehensionExercise.stages = comprehensionSpec.comprehensionStages?.map(
      (stageSpec) => {
        const stage = {} as ComprehensionStage;
        if (stageSpec.instructionText) {
          stage.instructionText = stageSpec.instructionText;
        }
        if (stageSpec.instructionAudio) {
          stage.instructionAudio = this.createAudio(
            Content.getAudioData(`${stageSpec.instructionAudio}`),
          );
        }
        if (
          stageSpec.questionnaire &&
          [true, 'true'].includes(stageSpec.questionnaire)
        ) {
          stage.questionnaire = true;
        }
        if (
          stageSpec.onlyInstructOnRequest &&
          [true, 'true'].includes(stageSpec.onlyInstructOnRequest)
        ) {
          stage.onlyInstructOnRequest = true;
        }
        return stage;
      },
    ) as Array<ComprehensionStage>;

    comprehensionExercise.comprehensionText = comprehensionSpec.text.map(
      (wordRef) => {
        const comprehensionWord = {} as ComprehensionWord;
        const wordSpec = Content.getWord(wordRef);
        if (wordSpec.audio) {
          comprehensionWord.audio = this.createAudio(
            Content.getAudioData(`${wordSpec.audio}`),
          );
        }
        comprehensionWord.suppressComprehensionAudio = false;
        comprehensionWord.word = wordSpec.word;
        comprehensionWord.isNew =
          !!comprehensionSpec.multipleChoiceWords?.find(
            (ref) => Object.values(ref)[0] === Object.values(wordRef)[0],
          ) ||
          !!comprehensionSpec.matchingWords?.find(
            (ref) => Object.values(ref)[0] === Object.values(wordRef)[0],
          );
        if (
          wordSpec.isPunctuation &&
          [true, 'true'].includes(wordSpec.isPunctuation)
        ) {
          comprehensionWord.isPunctuation = true;
        }
        return comprehensionWord;
      },
    );

    comprehensionExercise.questions =
      comprehensionSpec.comprehensionQuestions?.map((questionSpec) => {
        const question = {} as ComprehensionQuestion;
        question.questionText = questionSpec.questionText;
        question.questionAudio = this.createAudio(
          Content.getAudioData(`${questionSpec.questionAudio}`),
        );
        question.options = [];
        questionSpec.options.forEach((optionSpec) => {
          const option = { word: '' } as ComprehensionOption;
          const wordSpecs = Array.isArray(optionSpec.word)
            ? // word is a composite WordRef[]
              optionSpec.word.map((wordRef) => Content.getWord(wordRef))
            : // word is a single WordRef
              [Content.getWord(optionSpec.word)];

          wordSpecs.forEach((wordSpec) => {
            option.word += wordSpec.word;
            // TODO: Handle successive audio
            if (wordSpec.audio) {
              option.audio = this.createAudio(
                Content.getAudioData(wordSpec.audio),
              );
            }
          });

          if (
            optionSpec.correct &&
            [true, 'true'].includes(optionSpec.correct)
          ) {
            option.correct = true;
          }
          option.buzzing = false;
          option.disabled = false;

          question.options.push(option);
        });
        return question;
      }) as Array<ComprehensionQuestion>;

    comprehensionExercise.newWordsExercises = [] as Array<
      MultipleChoiceExercise | MatchingExercise
    >;

    const matchingWords = comprehensionSpec.matchingWords?.map((wordRef) =>
      Content.getWord(wordRef),
    );

    if (matchingWords) {
      if (matchingWords?.length <= 1) {
        throw new Error(
          `Lesson ${lessonIndex} has a "comprehensionSpec" (${exerciseId}) with a "matchingWords" field that contains too few elements to generate an exercise.`,
        );
      } else {
        this.shuffleItemsInPlace(matchingWords);
        // This algorithm can be improved
        // If the number of words are divisible by 3
        // we generate (words / 3) number of matchable pairs
        // If the remainder when number of words are divided by 3 is 1
        // we generate 2 exercises with 2 pairs, and the rest with 3 pairs
        // If the remainder when number of words are divided by 3 is 2
        // we generate 1 exercises with 2 pairs, and the rest with 3 pairs
        // This isolates each matching exercise with unique words,
        // which may not be desirable,
        // since mixing some new and some familiar words may increase retention
        // TODO Add configuration for exercises to overlap 0, 1 or 2 words
        const groupsWith2Map = [0, 2, 1];
        let groupsWith2Count = groupsWith2Map[matchingWords.length % 3];
        const numberOfExercises = Math.floor((matchingWords.length + 2) / 3);
        for (let i = 0; i < numberOfExercises; i += 1) {
          const matchingExercise =
            groupsWith2Count > 0
              ? this.createPairsFromWords(matchingWords.splice(0, 2))
              : this.createPairsFromWords(matchingWords.splice(0, 3));
          groupsWith2Count -= 1;
          this.shuffleMatchingItemsInPlace(matchingExercise);
          comprehensionExercise.newWordsExercises.push(matchingExercise);
        }
      }
    }

    const multipleChoiceWords = comprehensionSpec.multipleChoiceWords?.map(
      (wordRef) => Content.getWord(wordRef),
    );
    multipleChoiceWords?.forEach((word) => {
      const selectedWords = this.selectRandomSubset(
        multipleChoiceWords,
        { minItems: 2, maxItems: 4 },
        lessonIndex,
      );
      // Get word's index or replace item at random index with word
      let index: number;
      if ((index = selectedWords.indexOf(word)) < 0) {
        index = this.randomIndexLessThan(selectedWords.length);
        selectedWords.splice(index, 1, word);
      }
      const multipleChoiceExercise =
        this.createMultipleChoiceExerciseFromWords(selectedWords);
      multipleChoiceExercise.options[index].correct = true;
      multipleChoiceExercise.itemUnderTestAudio = new Audio(
        Content.getAudioData(`${word.audio}`),
      );

      if (word.symbol && word.symbol.length > 0) {
        word.symbol.forEach((symbol) => {
          (multipleChoiceExercise.iconToMatch as Array<string>).push(
            Content.getIcon(symbol),
          );
        });
      } else if (word.picture && word.picture.length > 0) {
        multipleChoiceExercise.pictureToMatch = Content.getPicPath(
          word.picture,
        );
      }
      comprehensionExercise.newWordsExercises?.push(multipleChoiceExercise);
    });

    // if (comprehensionExercise.newWordsExercises.length > 0) {
    //   this.shuffleItemsInPlace(comprehensionExercise.newWordsExercises);
    // }

    return comprehensionExercise;
  }

  public static makeRandomItemCorrectOption(
    multipleChoiceExercise: MultipleChoiceExercise,
    selectedItems: Array<WordSpec>,
  ): void {
    // pick random item as correct option
    const correctIndex = this.randomIndexLessThan(selectedItems.length);
    const correctItem = selectedItems[correctIndex];
    multipleChoiceExercise.options[correctIndex].correct = true;

    const path = Content.getAudioData(`${correctItem.audio}`);
    multipleChoiceExercise.itemUnderTestAudio = new Audio(path);

    if (correctItem.symbol && correctItem.symbol.length > 0) {
      correctItem.symbol.forEach((symbol) => {
        (multipleChoiceExercise.iconToMatch as Array<string>).push(
          Content.getIcon(symbol),
        );
      });
    } else if (correctItem.picture && correctItem.picture.length > 0) {
      multipleChoiceExercise.pictureToMatch = Content.getPicPath(
        correctItem.picture,
      );
    }
  }

  public static pickRandomItem<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  public static randomIndexLessThan(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
