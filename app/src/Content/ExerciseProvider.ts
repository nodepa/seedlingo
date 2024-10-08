import type { ClozeExercise, ClozeOption, ClozeWord } from '@/Cloze/ClozeTypes';
import type {
  ComprehensionExercise,
  ComprehensionOption,
  ComprehensionQuestion,
  ComprehensionStage,
  ComprehensionWord,
} from '@/Comprehension/ComprehensionTypes';
import type { ExerciseAudio } from '@/common/types/ExerciseAudioType';
import type { MatchingExercise, MatchingItem } from '@/Matching/MatchingTypes';
import type {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '@/MultipleChoice/MultipleChoiceTypes';
import type {
  Blank,
  ExerciseSpec,
  UnitSpec,
  WordSpec,
  WordRef,
  ComprehensionSpec,
} from '@/common/types/ContentTypes';
import Content from './Content';
import AudioProvider from './AudioProvider';

export type ExerciseType =
  | 'Matching'
  | 'MultipleChoice'
  | 'ExplanationMatching'
  | 'ExplanationMultipleChoice'
  | 'SingleCloze'
  | 'MultiCloze'
  | 'Comprehension';

export type ExerciseItems =
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
    [key in ExerciseType]: (unit: UnitSpec) => Exercise;
  } = {
    Matching: this.generateMatchingExercise,
    MultipleChoice: this.generateMultipleChoiceExercise,
    ExplanationMatching: this.generateExplanationMatchingExercise,
    ExplanationMultipleChoice: this.generateExplanationMultipleChoiceExercise,
    SingleCloze: this.generateSingleClozeExercise,
    MultiCloze: this.generateMultiClozeExercise,
    Comprehension: this.generateComprehensionExercise,
  };

  public static getExerciseFromUnit(indexFromOne: number): Exercise {
    this.validateExerciseIndex(indexFromOne, Content.UnitSpecs);
    const indexFromZero = indexFromOne - 1;
    const unit = Content.UnitSpecs[indexFromZero];
    return this.GenerateExerciseOfType[this.pickRandomExerciseType(unit)].bind(
      this,
    )(unit);
  }

  public static validateExerciseIndex(
    indexFromOne: number,
    units: Array<UnitSpec>,
  ): void {
    if (indexFromOne < 1 || indexFromOne > units.length) {
      throw new Error(`Please choose a unit between 1 and ${units.length}`);
    }
  }

  public static pickRandomExerciseType(unit: UnitSpec): ExerciseType {
    const validTypes = [] as Array<ExerciseType>;
    if (unit.matchingCount >= 2) {
      validTypes.push('Matching');
    }
    if (unit.multipleChoiceCount >= 4) {
      validTypes.push('MultipleChoice');
    }
    if (unit.explanationCount >= 2) {
      validTypes.push('ExplanationMatching');
    }
    if (unit.explanationCount >= 1) {
      validTypes.push('ExplanationMultipleChoice');
    }
    if (unit.singleClozeCount >= 1) {
      validTypes.push('SingleCloze');
    }
    if (unit.multiClozeCount >= 1) {
      validTypes.push('MultiCloze');
    }
    if (unit.comprehensionCount >= 1) {
      validTypes.push('Comprehension');
    }
    return this.pickRandomItem(validTypes);
  }

  public static generateMatchingExercise(unit: UnitSpec): {
    exerciseType: ExerciseType;
    exerciseItems: MatchingExercise;
  } {
    const exerciseFromSpec = this.pickRandomItem(
      unit.exercises.filter((exercise) => exercise.type === 'Matching'),
    );
    const selectedWordRefs = this.selectRandomSubset(
      exerciseFromSpec.matchingSpec?.matchingWords || [],
      { minItems: 2, maxItems: 4 },
      unit.unitIndex,
    );

    const selectedWords = selectedWordRefs.map((wordRef) =>
      Content.getWord(wordRef),
    );

    const matchingExercise = {
      items: this.createPairsFromWords(selectedWords),
      unsuppressWordAudio: !!exerciseFromSpec.matchingSpec?.unsuppressWordAudio,
    };

    this.shuffleMatchingItemsInPlace(matchingExercise.items);
    return { exerciseType: 'Matching', exerciseItems: matchingExercise };
  }

  public static generateExplanationMatchingExercise(unit: UnitSpec): {
    exerciseType: ExerciseType;
    exerciseItems: MatchingExercise;
  } {
    const explanationSpecs = unit.exercises.filter(
      (exercise) => exercise.type === 'Explanation',
    );

    const selectedExplanations = this.selectRandomSubset(
      explanationSpecs,
      { minItems: 2, maxItems: 2 },
      unit.unitIndex,
    );

    const matchingExercise =
      this.createExplanationInterpretationPairs(selectedExplanations);

    this.shuffleMatchingItemsInPlace(matchingExercise.items);
    return { exerciseType: 'Matching', exerciseItems: matchingExercise };
  }

  public static generateMultipleChoiceExercise(unit: UnitSpec): {
    exerciseType: ExerciseType;
    exerciseItems: MultipleChoiceExercise;
  } {
    const exerciseFromSpec = this.pickRandomItem(
      unit.exercises.filter((exercise) => exercise.type === 'MultipleChoice'),
    );
    const selectedWordRefs = this.selectRandomSubset(
      exerciseFromSpec.multipleChoiceSpec?.multipleChoiceWords || [],
      { minItems: 4, maxItems: 4 },
      unit.unitIndex,
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

  public static generateExplanationMultipleChoiceExercise(unit: UnitSpec): {
    exerciseType: ExerciseType;
    exerciseItems: MultipleChoiceExercise;
  } {
    const explanationExercises = unit.exercises.filter(
      (exercise) => exercise.type === 'Explanation',
    );
    const explanationExercise = this.pickRandomItem(explanationExercises);
    const explanationSpec = explanationExercise.explanationSpec;

    // ensure unit has 1 or more explanations
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
        `Unit ${unit.unitIndex} has zero valid explanation items, which is too few to generate an exercise.`,
      );
    }

    // create collection of options, starting with correct interpretation
    const multipleChoiceExercise = {
      explanationToMatch: explanationSpec.explanation
        .map((wordRef) => Content.getWord(wordRef).word)
        .join(explanationSpec.injectSpaces ? ' ' : ''),
      options: [] as Array<MultipleChoiceItem>,
    } as MultipleChoiceExercise;

    const validWord = Content.getWord(
      explanationSpec.explanationTargets?.validOption,
    );

    if (!validWord) {
      throw new Error(
        `Unit ${unit.unitIndex} has an explanation (${explanationExercise.id}) without a valid matching target (${explanationSpec.explanationTargets?.validOption}).`,
      );
    }
    const correctOption = {
      word: validWord.word,
      audio: {} as ExerciseAudio,
      correct: true,
      disabled: false,
      playing: false,
      buzzing: false,
    } as MultipleChoiceItem;

    correctOption.audio = AudioProvider.createAudioFromPath(
      validWord.audio as string,
    );

    multipleChoiceExercise.options.push(correctOption);

    const invalidOptions =
      explanationSpec.explanationTargets?.invalidOptions.map((wordRef) =>
        Content.getWord(wordRef),
      );

    const selectedOptions = this.selectRandomSubset(
      invalidOptions,
      { minItems: 1, maxItems: 3 },
      unit.unitIndex,
    );

    selectedOptions.forEach((wordSpec: WordSpec) => {
      const incorrectInterpretation = {
        word: wordSpec.word,
        audio: {} as ExerciseAudio,
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      } as MultipleChoiceItem;

      incorrectInterpretation.audio = AudioProvider.createAudioFromPath(
        wordSpec.audio as string,
      );
      multipleChoiceExercise.options.push(incorrectInterpretation);
    });

    // shuffle options
    this.shuffleItemsInPlace(multipleChoiceExercise.options);
    return {
      exerciseType: 'MultipleChoice',
      exerciseItems: multipleChoiceExercise,
    };
  }

  public static generateSingleClozeExercise(unit: UnitSpec): {
    exerciseType: ExerciseType;
    exerciseItems: ClozeExercise;
  } {
    const selectedExerciseSpec = this.selectClozeExerciseFromSpec(
      unit,
      'SingleCloze',
    );

    const singleClozeExercise = this.createExerciseFromSingleClozeSpec(
      selectedExerciseSpec,
      unit.unitIndex,
    );

    return {
      exerciseType: 'SingleCloze',
      exerciseItems: singleClozeExercise,
    };
  }

  public static generateMultiClozeExercise(unit: UnitSpec): {
    exerciseType: ExerciseType;
    exerciseItems: ClozeExercise;
  } {
    const selectedExerciseSpec = this.selectClozeExerciseFromSpec(
      unit,
      'MultiCloze',
    );

    const multiClozeExercise = this.createExerciseFromMultiClozeSpec(
      selectedExerciseSpec,
      unit.unitIndex,
    );

    return {
      exerciseType: 'MultiCloze',
      exerciseItems: multiClozeExercise,
    };
  }

  public static selectClozeExerciseFromSpec(
    unit: UnitSpec,
    clozeType: 'SingleCloze' | 'MultiCloze',
  ): ExerciseSpec {
    let exerciseSpecs = [] as Array<ExerciseSpec>;
    if (clozeType === 'SingleCloze') {
      exerciseSpecs = unit.exercises.filter(
        (exercise) =>
          exercise.type === 'SingleCloze' &&
          exercise.singleClozeSpec?.text &&
          exercise.singleClozeSpec?.text.length > 0,
      );
    } else if (clozeType === 'MultiCloze') {
      exerciseSpecs = unit.exercises.filter(
        (exercise) =>
          exercise.type === 'MultiCloze' &&
          exercise.multiClozeSpec?.text &&
          exercise.multiClozeSpec?.text.length > 0,
      );
    }

    if (exerciseSpecs.length === 0) {
      throw new Error(
        `Unit ${unit.unitIndex} has zero multi-blank cloze items, which is too few to generate an exercise.`,
      );
    }
    return this.pickRandomItem(exerciseSpecs);
  }

  public static generateComprehensionExercise(unit: UnitSpec): {
    exerciseType: ExerciseType;
    exerciseItems: ComprehensionExercise;
  } {
    const exerciseSpecs = unit.exercises.filter(
      (exercise) => exercise.type === 'Comprehension',
    );

    if (exerciseSpecs.length === 0) {
      throw new Error(
        `Unit ${unit.unitIndex} has zero comprehension exercises, which is too few to generate an exercise.`,
      );
    }

    const selectedExercise = this.pickRandomItem(exerciseSpecs);

    if (selectedExercise.comprehensionSpec === undefined) {
      throw new Error(
        `Unit ${unit.unitIndex} has a comprehension exercise (${selectedExercise.id}) without a "comprehensionSpec", therefore lacking necessary data to generate an exercise.`,
      );
    }

    const comprehensionExercise = this.createExerciseFromComprehensionSpec(
      selectedExercise.comprehensionSpec,
      selectedExercise.id,
      unit.unitIndex,
    );

    return {
      exerciseType: 'Comprehension',
      exerciseItems: comprehensionExercise,
    };
  }

  public static selectRandomSubset<T>(
    items: Array<T>,
    { minItems, maxItems }: { minItems: number; maxItems: number },
    unitIndex: number,
  ): Array<T> {
    this.hasAtLeast(items, minItems, unitIndex);
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
    unitIndex: number,
  ): void {
    if (items.length < lowerLimit) {
      throw new Error(
        `Unit ${unitIndex} only has ${items.length} suitable item(s), which is too few to generate this exercise.`,
      );
    }
  }

  public static createPairsFromWords(
    words: Array<WordSpec>,
  ): Array<MatchingItem> {
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
        wordPart.audio = AudioProvider.createAudioFromPath(wordSpec.audio);
        symPart.audio = AudioProvider.createAudioFromPath(wordSpec.audio);
      }

      matchingItems.push(wordPart);
      matchingItems.push(symPart);
    });
    return matchingItems;
  }

  public static createExplanationInterpretationPairs(
    explanationItems: Array<ExerciseSpec>,
  ): MatchingExercise {
    const matchingExercise = { items: [] } as MatchingExercise;

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
          .join(explanationSpec.injectSpaces ? ' ' : ''),
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

      if (explanationSpec.audio) {
        explanationPart.audio = AudioProvider.createAudioFromPath(
          explanationSpec.audio,
        );
      }

      wordPart.audio = AudioProvider.createAudioFromPath(
        interpretationItem.audio as string,
      );

      matchingExercise.items.push(explanationPart);
      matchingExercise.items.push(wordPart);
    }); // end explanationItems.forEach

    return matchingExercise;
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
        audio: {} as ExerciseAudio,
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      } as MultipleChoiceItem;

      exerciseItem.audio = AudioProvider.createAudioFromPath(
        wordSpec.audio as string,
      );
      multipleChoiceExercise.options.push(exerciseItem);
    });
    return multipleChoiceExercise;
  }

  public static createExerciseFromSingleClozeSpec(
    clozeSpec: ExerciseSpec,
    unitIndex: number,
  ): ClozeExercise {
    if (
      !clozeSpec.singleClozeSpec?.text ||
      clozeSpec.singleClozeSpec.text.length < 2
    ) {
      throw new Error(
        `Unit ${unitIndex}'s item ${clozeSpec.id} does not have a clozeText with enough words and blanks to generate an exercise.`,
      );
    }

    const blanksCount = clozeSpec.singleClozeSpec.text.filter(
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

    const singleClozeText: Array<ClozeWord> = [];
    const singleClozeOptions: Array<ClozeOption> = [];
    clozeSpec.singleClozeSpec.text.forEach((wordRefOrBlank) => {
      const singleClozeWord: ClozeWord = {
        word: '',
        buzzing: false,
        revealed: false,
      };

      if (!('validOptions' in wordRefOrBlank)) {
        // current wordRefOrBlank is a WordRef
        singleClozeWord.isBlank = false;

        const wordSpec = Content.getWord(wordRefOrBlank as WordRef);
        singleClozeWord.word = wordSpec.word;
        if (wordSpec.audio) {
          singleClozeWord.audio = AudioProvider.createAudioFromPath(
            wordSpec.audio,
          );
        }
        if (
          wordSpec.isPunctuation &&
          [true, 'true'].includes(wordSpec.isPunctuation)
        ) {
          singleClozeWord.isPunctuation = true;
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

        let optAudioId;
        validOptionWordSpecs.forEach((wordSpec) => {
          singleClozeWord.word += wordSpec.word;
          // TODO: Handle successive audio #432
          if (wordSpec.audio) {
            optAudioId = wordSpec.audio;
            singleClozeWord.audio = AudioProvider.createAudioFromPath(
              wordSpec.audio,
            );
          }
          if (
            wordSpec.isPunctuation &&
            [true, 'true'].includes(wordSpec.isPunctuation)
          ) {
            singleClozeWord.isPunctuation = true;
          }
        });

        if (
          'invalidOptions' in wordRefOrBlank &&
          wordRefOrBlank.invalidOptions &&
          wordRefOrBlank.invalidOptions.length > 0
        ) {
          if (currentBlankIndex === pickedBlankIndex) {
            singleClozeWord.isBlank = true;
            const singleClozeOption: ClozeOption = {
              word: singleClozeWord.word,
              correct: true,
              buzzing: false,
              disabled: false,
            };
            if (optAudioId) {
              singleClozeOption.audio =
                AudioProvider.createAudioFromPath(optAudioId);
            }
            if (clozeSpec.singleClozeSpec?.suppressOptionAudio) {
              singleClozeOption.suppressOptionAudio =
                clozeSpec.singleClozeSpec.suppressOptionAudio;
            }
            singleClozeOptions.push(singleClozeOption);

            const wordRefs = this.selectRandomSubset(
              (wordRefOrBlank as Blank).invalidOptions || [],
              { minItems: 3, maxItems: 3 },
              unitIndex,
            );
            singleClozeOptions.push(
              ...wordRefs.map((wordRef) => {
                const wordSpec = Content.getWord(wordRef);
                const singleClozeOption: ClozeOption = {
                  word: wordSpec.word,
                  correct: false,
                  buzzing: false,
                  disabled: false,
                };
                if (wordSpec.audio) {
                  singleClozeOption.audio = AudioProvider.createAudioFromPath(
                    wordSpec.audio,
                  );
                }
                if (
                  clozeSpec.singleClozeSpec?.suppressOptionAudio &&
                  [true, 'true'].includes(
                    clozeSpec.singleClozeSpec.suppressOptionAudio,
                  )
                ) {
                  singleClozeOption.suppressOptionAudio = true;
                }
                return singleClozeOption;
              }),
            );
          }
          currentBlankIndex += 1;
        }
      }

      if (
        clozeSpec.singleClozeSpec?.suppressClozeAudio &&
        [true, 'true'].includes(clozeSpec.singleClozeSpec.suppressClozeAudio)
      ) {
        singleClozeWord.suppressClozeAudio = true;
      }

      singleClozeText.push(singleClozeWord);
    });

    this.shuffleItemsInPlace(singleClozeOptions);

    const singleClozeExercise = {
      clozeType: 'SingleCloze',
      clozeText: singleClozeText,
      clozeOptions: singleClozeOptions,
    } as ClozeExercise;

    if (clozeSpec.singleClozeSpec.injectSpaces) {
      singleClozeExercise.injectSpaces = true;
    }

    return singleClozeExercise;
  }

  public static createExerciseFromMultiClozeSpec(
    clozeSpec: ExerciseSpec,
    unitIndex: number,
  ): ClozeExercise {
    if (
      !clozeSpec.multiClozeSpec?.text ||
      clozeSpec.multiClozeSpec?.text.length < 3
    ) {
      throw new Error(
        `Unit ${unitIndex}'s item "${clozeSpec.id}" does not have enough elements in multiClozeSpec.text to generate an exercise.`,
      );
    }

    const blanks = clozeSpec.multiClozeSpec.text.filter(
      (wordRefOrBlank) =>
        wordRefOrBlank.validOptions && wordRefOrBlank.validOptions.length > 0,
    );

    if (!blanks || blanks.length <= 1) {
      throw new Error(
        `Unit ${unitIndex}'s item ${clozeSpec.id} does not have enough blanks in multiClozeSpec.text to generate an exercise.`,
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
            multiClozeWord.audio = AudioProvider.createAudioFromPath(
              wordSpec.audio,
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

          const multiClozeOption: ClozeOption = {
            word: '',
            buzzing: false,
            disabled: false,
          };
          wordSpecs.forEach((wordSpec) => {
            multiClozeWord.word += wordSpec.word;
            // TODO: Handle successive audio #432
            if (wordSpec.audio) {
              multiClozeWord.audio = AudioProvider.createAudioFromPath(
                wordSpec.audio,
              );
              multiClozeOption.audio = AudioProvider.createAudioFromPath(
                wordSpec.audio,
              );
            }
            if (
              wordSpec.isPunctuation &&
              [true, 'true'].includes(wordSpec.isPunctuation)
            ) {
              multiClozeWord.isPunctuation = true;
            }
          });
          multiClozeOption.word = multiClozeWord.word;

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
            multiClozeOption.suppressOptionAudio = true;
          }
          multiClozeOptions.push(multiClozeOption);
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

    const multiClozeExercise = {
      clozeType: 'MultiCloze',
      clozeText,
      clozeOptions: multiClozeOptions,
    } as ClozeExercise;

    if (clozeSpec.multiClozeSpec.injectSpaces) {
      multiClozeExercise.injectSpaces = true;
    }

    return multiClozeExercise;
  }

  public static createExerciseFromComprehensionSpec(
    comprehensionSpec: ComprehensionSpec,
    exerciseId: string,
    unitIndex: number,
  ): ComprehensionExercise {
    if (!comprehensionSpec.text || comprehensionSpec.text.length < 2) {
      throw new Error(
        `Unit ${unitIndex} has a "comprehensionSpec" (${exerciseId}) with a too short "text" to generate an exercise.`,
      );
    }

    const comprehensionExercise = {} as ComprehensionExercise;
    if (comprehensionSpec.injectSpaces) {
      comprehensionExercise.injectSpaces = true;
    }

    comprehensionExercise.stages = comprehensionSpec.comprehensionStages?.map(
      (stageSpec) => {
        const stage = {} as ComprehensionStage;
        if (stageSpec.instructionText) {
          stage.instructionText = stageSpec.instructionText;
        }
        if (stageSpec.instructionAudio) {
          stage.instructionAudio = AudioProvider.createAudioFromPath(
            stageSpec.instructionAudio,
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
          comprehensionWord.audio = AudioProvider.createAudioFromPath(
            wordSpec.audio,
          );
        }
        comprehensionWord.suppressComprehensionAudio = false;
        comprehensionWord.word = wordSpec.word;

        comprehensionWord.isNew =
          !!comprehensionSpec.multipleChoiceSpec?.multipleChoiceWords?.find(
            (ref) => Object.values(ref)[0] === Object.values(wordRef)[0],
          ) ||
          !!comprehensionSpec.matchingSpec?.matchingWords?.find(
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
        question.questionAudio = AudioProvider.createAudioFromPath(
          questionSpec.questionAudio,
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
            // TODO: Handle successive audio #432
            if (wordSpec.audio) {
              option.audio = AudioProvider.createAudioFromPath(wordSpec.audio);
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

    const matchingWords = comprehensionSpec.matchingSpec?.matchingWords?.map(
      (wordRef) => Content.getWord(wordRef),
    );

    if (matchingWords) {
      if (matchingWords?.length <= 1) {
        throw new Error(
          `Unit ${unitIndex} has a "comprehensionSpec" (${exerciseId}) with a "matchingWords" field that contains too few elements to generate an exercise.`,
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
        // This isolates matching exercise into sets of non-overlapping words,
        // which may not be desirable,
        // since mixing some new and some familiar words may increase retention
        // TODO Add configuration for exercises to overlap 0, 1 or 2 words
        const groupsWith2Map = [0, 2, 1];
        let groupsWith2Count = groupsWith2Map[matchingWords.length % 3];
        const numberOfExercises = Math.floor((matchingWords.length + 2) / 3);
        for (let i = 0; i < numberOfExercises; i += 1) {
          const matchingExercise = {
            items:
              groupsWith2Count > 0
                ? this.createPairsFromWords(matchingWords.splice(0, 2))
                : this.createPairsFromWords(matchingWords.splice(0, 3)),
            unsuppressWordAudio: false,
          };
          groupsWith2Count -= 1;
          this.shuffleMatchingItemsInPlace(matchingExercise.items);
          comprehensionExercise.newWordsExercises.push(matchingExercise);
        }
      }
    }

    const multipleChoiceWords =
      comprehensionSpec.multipleChoiceSpec?.multipleChoiceWords?.map(
        (wordRef) => Content.getWord(wordRef),
      );
    multipleChoiceWords?.forEach((word) => {
      const selectedWords = this.selectRandomSubset(
        multipleChoiceWords,
        { minItems: 2, maxItems: 4 },
        unitIndex,
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

      multipleChoiceExercise.itemUnderTestAudio =
        AudioProvider.createAudioFromPath(word.audio as string);

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

    multipleChoiceExercise.itemUnderTestAudio =
      AudioProvider.createAudioFromPath(correctItem.audio as string);

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
