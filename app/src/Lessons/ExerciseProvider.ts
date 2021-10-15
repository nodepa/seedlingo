import { MatchingItem, ExerciseAudio } from '@/Matching/MatchingTypes';
import {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '@/MultipleChoice/MultipleChoiceTypes';
import { ClozeExercise, ClozeOption } from '@/Cloze/ClozeTypes';
import { Lesson, LessonItem, BlankOption } from './LessonTypes';
import { ref } from 'vue';

import ContentConfig from './ContentConfig';

export type ExerciseType =
  | 'Matching'
  | 'MatchingExplanation'
  | 'MultipleChoice'
  | 'MultipleChoiceExplanation'
  | 'Cloze';

export default class ExerciseProvider {
  private static lessons = [] as Array<Lesson>;

  public static getExerciseFromLesson(indexFromOne: number): {
    exerciseType: ExerciseType;
    exerciseItems: Array<MatchingItem> | MultipleChoiceExercise | ClozeExercise;
  } {
    ExerciseProvider.lessons = ContentConfig.getLessons();
    this.validateExerciseIndex(indexFromOne);
    const indexFromZero = indexFromOne - 1;
    const lesson = this.lessons[indexFromZero] as Lesson;

    const exerciseType = this.pickRandomExerciseType(lesson);
    if (exerciseType === 'Matching') {
      return this.generateMatchingExercise(lesson);
    }
    if (exerciseType === 'MatchingExplanation') {
      return this.generateMatchingExplanationExercise(lesson);
    }
    if (exerciseType === 'MultipleChoice') {
      return this.generateMultipleChoiceExercise(lesson);
    }
    if (exerciseType === 'MultipleChoiceExplanation') {
      return this.generateMultipleChoiceExplanationExercise(lesson);
    }
    // else (exerciseType === 'Cloze') {
    return this.generateClozeExercise(lesson);
  }

  public static validateExerciseIndex(indexFromOne: number): void {
    if (indexFromOne < 1 || indexFromOne > ExerciseProvider.lessons.length) {
      throw new Error(
        `Please choose a lesson between 1 and ${ExerciseProvider.lessons.length}`,
      );
    }
  }

  public static pickRandomExerciseType(lesson: Lesson): ExerciseType {
    const validTypes = [] as Array<ExerciseType>;
    if (lesson.wordCount >= 2) {
      validTypes.push('Matching');
    }
    if (lesson.explanationCount >= 2 && lesson.wordCount >= 2) {
      validTypes.push('MatchingExplanation');
    }
    if (lesson.wordCount >= 4) {
      validTypes.push('MultipleChoice');
    }
    if (lesson.explanationCount >= 1 && lesson.wordCount >= 2) {
      validTypes.push('MultipleChoiceExplanation');
    }
    if (lesson.clozeCount >= 1) {
      validTypes.push('Cloze');
    }
    return this.pickRandomItem(validTypes);
  }

  public static generateMatchingExercise(lesson: Lesson): {
    exerciseType: ExerciseType;
    exerciseItems: Array<MatchingItem>;
  } {
    const wordsInLesson = this.selectWordsInLesson(lesson);
    const selectedWords = this.selectRandomSubset(
      wordsInLesson,
      {
        minItems: 2,
        maxItems: 4,
      },
      lesson.lessonIndex,
    );

    const matchingExercises = this.createPairsFromWords(
      selectedWords,
      lesson.lessonPath,
    );

    this.shuffleMatchingItemsInPlace(matchingExercises);
    return { exerciseType: 'Matching', exerciseItems: matchingExercises };
  }

  public static generateMatchingExplanationExercise(lesson: Lesson): {
    exerciseType: ExerciseType;
    exerciseItems: Array<MatchingItem>;
  } {
    const explanationsInLesson = this.selectExplanationsInLesson(lesson);
    const wordsInLesson = this.selectWordsInLesson(lesson);

    const selectedExplanations = this.selectRandomSubset(
      explanationsInLesson,
      {
        minItems: 2,
        maxItems: 2,
      },
      lesson.lessonIndex,
    );

    const matchingExercises = this.createPairsFromExplanationsAndWords(
      selectedExplanations,
      wordsInLesson,
      lesson.lessonPath,
    );

    this.shuffleMatchingItemsInPlace(matchingExercises);
    return { exerciseType: 'Matching', exerciseItems: matchingExercises };
  }

  public static generateMultipleChoiceExercise(lesson: Lesson): {
    exerciseType: ExerciseType;
    exerciseItems: MultipleChoiceExercise;
  } {
    const wordsInLesson = this.selectWordsInLesson(lesson);
    const selectedWords = this.selectRandomSubset(
      wordsInLesson,
      {
        minItems: 4,
        maxItems: 4,
      },
      lesson.lessonIndex,
    );

    const multipleChoiceExercise = this.createMultipleChoiceExerciseFromWords(
      selectedWords,
      lesson.lessonPath,
    );

    this.makeRandomItemCorrectOption(
      multipleChoiceExercise,
      selectedWords,
      lesson.lessonPath,
    );

    return {
      exerciseType: 'MultipleChoice',
      exerciseItems: multipleChoiceExercise,
    };
  }

  public static generateClozeExercise(lesson: Lesson): {
    exerciseType: ExerciseType;
    exerciseItems: ClozeExercise;
  } {
    const clozeItems = this.selectClozeItemsInLesson(lesson);
    if (clozeItems.length === 0) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has zero cloze items, which is too few to generate an exercise.`,
      );
    }
    const selectedClozeItem = this.pickRandomItem(clozeItems);
    const clozeExercise = this.createClozeExerciseFromClozeItem(
      selectedClozeItem,
      lesson.lessonIndex,
    );

    return {
      exerciseType: 'Cloze',
      exerciseItems: clozeExercise,
    };
  }

  public static generateMultipleChoiceExplanationExercise(lesson: Lesson): {
    exerciseType: ExerciseType;
    exerciseItems: MultipleChoiceExercise;
  } {
    const explanationsInLesson = this.selectExplanationsInLesson(lesson);

    // ensure lesson has 1 or more explanations
    if (explanationsInLesson.length === 0) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has zero explanation items, which is too few to generate an exercise.`,
      );
    }

    // randomly pick an explanation from all available explanations
    const explanationToMatch = this.pickRandomItem(explanationsInLesson);

    // get the explanation's interpretation
    const targetOfExplanation = lesson.items.find(
      (lessonItem) => lessonItem.id === explanationToMatch.explanationTargetId,
    );
    if (!targetOfExplanation) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has an explanation (${explanationToMatch.id}) without a matching target (${explanationToMatch.explanationTargetId}).`,
      );
    }

    // create collection of options, starting with correct interpretation
    const multipleChoiceExercise = {
      explanationToMatch: explanationToMatch.explanation,
      options: [] as Array<MultipleChoiceItem>,
    } as MultipleChoiceExercise;

    const correctOption = {
      word: targetOfExplanation.word,
      audio: {} as HTMLAudioElement,
      correct: true,
      disabled: false,
      playing: false,
      buzzing: false,
    } as MultipleChoiceItem;

    const path = ContentConfig.getAudioPath(
      `${lesson.lessonPath}${targetOfExplanation.audioName}`,
    );
    correctOption.audio = new Audio(path);

    multipleChoiceExercise.options.push(correctOption);

    // randomly pick additional interpretations from (words - correct int.)
    const allIncorrectInterpretations = this.selectWordsInLesson(
      lesson,
      targetOfExplanation,
    );

    allIncorrectInterpretations.forEach((lessonItem: LessonItem) => {
      const incorrectInterpretation = {
        word: lessonItem.word,
        audio: {} as HTMLAudioElement,
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      } as MultipleChoiceItem;

      const path = ContentConfig.getAudioPath(
        `${lesson.lessonPath}${lessonItem.audioName}`,
      );
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

  public static selectWordsInLesson(
    lesson: Lesson,
    exception?: LessonItem,
  ): Array<LessonItem> {
    if (exception) {
      return lesson.items.filter(
        (lessonItem: LessonItem) =>
          lessonItem.word &&
          lessonItem.word.length > 0 &&
          lessonItem !== exception,
      );
    }
    return lesson.items.filter(
      (lessonItem: LessonItem) => lessonItem.word && lessonItem.word.length > 0,
    );
  }

  public static selectExplanationsInLesson(lesson: Lesson): Array<LessonItem> {
    return lesson.items.filter((lessonItem: LessonItem) => {
      return (
        lessonItem.explanation &&
        lessonItem.explanation.length > 0 &&
        lessonItem.explanationTargetId &&
        lessonItem.explanationTargetId.length === 36
      );
    });
  }

  public static selectClozeItemsInLesson(lesson: Lesson): Array<LessonItem> {
    return lesson.items.filter((lessonItem: LessonItem) => {
      return (
        lessonItem.clozeText &&
        lessonItem.clozeText.length > 0 &&
        lessonItem.clozeSpecVariants &&
        lessonItem.clozeSpecVariants.length > 0
      );
    });
  }

  public static selectRandomSubset(
    lessonItems: Array<LessonItem>,
    limits: { minItems: number; maxItems: number },
    lessonIndex: number,
  ): Array<LessonItem> {
    this.validateLowerLimit(lessonItems, limits.minItems, lessonIndex);
    const selected = [];
    const lessonItemIndexes = [...Array(lessonItems.length).keys()];
    const maxItemsAccepted = Math.min(limits.maxItems, lessonItems.length);
    for (let i = 0; i < maxItemsAccepted; i += 1) {
      const randomUniqueIndex = lessonItemIndexes.splice(
        this.randomIndexLessThan(lessonItemIndexes.length),
        1,
      )[0];
      selected.push(lessonItems[randomUniqueIndex]);
    }
    return selected;
  }

  public static validateLowerLimit(
    lessonItems: Array<LessonItem>,
    lowerLimit: number,
    lessonIndex: number,
  ): void {
    if (lessonItems.length < lowerLimit) {
      throw new Error(
        `Lesson ${lessonIndex} only has ${lessonItems.length} suitable item(s), which is too few to generate this exercise.`,
      );
    }
  }

  public static createPairsFromWords(
    words: Array<LessonItem>,
    lessonPath: string,
  ): Array<MatchingItem> {
    const matchingExercises = [] as Array<MatchingItem>;
    words.forEach((lessonItem: LessonItem, index: number) => {
      const wordPart = {
        value: lessonItem.word,
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
        value: [] as Array<string>,
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

      if (lessonItem.symbolName) {
        lessonItem.symbolName.forEach((name) => {
          (symPart.value as Array<string>).push(ContentConfig.getMdiIcon(name));
        });
      }

      if (lessonItem.audioName) {
        const path = ContentConfig.getAudioPath(
          `${lessonPath}${lessonItem.audioName}`,
        );
        wordPart.audio = this.createAudio(path);
        symPart.audio = this.createAudio(path);
      }

      matchingExercises.push(wordPart);
      matchingExercises.push(symPart);
    });
    return matchingExercises;
  }

  public static createPairsFromExplanationsAndWords(
    explanationItems: Array<LessonItem>,
    targetItems: Array<LessonItem>,
    lessonPath: string,
  ): Array<MatchingItem> {
    const matchingExercises = [] as Array<MatchingItem>;
    explanationItems.forEach((explanationItem: LessonItem, index: number) => {
      const explanationPart = {
        value: explanationItem.explanation,
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

      const interpretationItem = targetItems.find(
        (wordItem: LessonItem) =>
          wordItem.id === explanationItem.explanationTargetId,
      );
      if (
        !interpretationItem ||
        !interpretationItem.word ||
        interpretationItem.word.length < 1
      ) {
        throw new Error(
          `This explanation (${explanationItem.word}) does not have a corresponding interpretation word in the same lesson.`,
        );
      }
      const wordPart = {
        value: interpretationItem.word,
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

      let path = ContentConfig.getAudioPath(
        `${lessonPath}${explanationItem.audioName}`,
      );
      explanationPart.audio = this.createAudio(path);

      path = ContentConfig.getAudioPath(
        `${lessonPath}${interpretationItem.audioName}`,
      );
      wordPart.audio = this.createAudio(path);

      matchingExercises.push(explanationPart);
      matchingExercises.push(wordPart);
    }); // end explanationItems.forEach

    return matchingExercises;
  }

  public static createAudio(src: string): ExerciseAudio {
    const el = new Audio(src);
    const audio = {
      el,
      playing: ref(false),
      play() {
        el.currentTime = 0;
        el.play();
      },
      cancel() {
        el.pause();
      },
    } as ExerciseAudio;

    el.onplaying = () => {
      audio.playing.value = true;
    };
    el.onpause = () => {
      audio.playing.value = false;
    };
    el.onended = () => {
      audio.playing.value = false;
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
    selectedItems: Array<LessonItem>,
    lessonPath: string,
  ): MultipleChoiceExercise {
    const multipleChoiceExercise = {
      itemUnderTestAudio: {} as HTMLAudioElement,
      itemUnderTestAudioPlaying: false,
      iconToMatch: [] as Array<string>,
      options: [] as Array<MultipleChoiceItem>,
    } as MultipleChoiceExercise;

    selectedItems.forEach((item: LessonItem) => {
      const exerciseItem = {
        word: item.word,
        audio: {} as HTMLAudioElement,
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
      } as MultipleChoiceItem;
      const path = ContentConfig.getAudioPath(`${lessonPath}${item.audioName}`);
      exerciseItem.audio = new Audio(path);
      multipleChoiceExercise.options.push(exerciseItem);
    });
    return multipleChoiceExercise;
  }

  public static createClozeExerciseFromClozeItem(
    clozeItem: LessonItem,
    lessonIndex: number,
  ): ClozeExercise {
    if (!clozeItem.clozeText || clozeItem.clozeText.length < 2) {
      throw new Error(
        `Lesson ${lessonIndex}'s clozeItem ${clozeItem.id} does not have a clozeText with enough words and blanks to generate an exercise.`,
      );
    }
    if (
      !clozeItem.clozeSpecVariants ||
      clozeItem.clozeSpecVariants.length === 0
    ) {
      throw new Error(
        `Lesson ${lessonIndex}'s clozeItem ${clozeItem.id} has zero clozeSpecVariants, which is too few to generate an exercise.`,
      );
    }

    // randomly pick a clozeSpecVariant to use for this clozeExercise
    const variantIndex = this.randomIndexLessThan(
      clozeItem.clozeSpecVariants?.length,
    );
    const selectedBlankSpecs =
      clozeItem.clozeSpecVariants[variantIndex].blankSpecs;

    // verify number of blankSpecs match number of blanks in clozeText
    if (
      selectedBlankSpecs.length !==
      clozeItem.clozeText?.filter((word) => word === '{blank}').length
    ) {
      throw new Error(
        `Lesson ${lessonIndex}'s clozeItem ${clozeItem.id}'s clozeSpecVariant ${
          variantIndex + 1
        } and the clozeText does not specify the same number of blanks, but must be equal to generate an exercise.`,
      );
    }

    // create a clozeText with all blanks pre-filled with valid values
    let blankIndex = -1;
    const blankMap = [] as Array<number>;
    const validBlankItems = [] as Array<LessonItem>;
    const preFilledClozeText = clozeItem.clozeText.map((clozeWord, index) => {
      if (clozeWord === '{blank}') {
        blankIndex += 1;
        blankMap.push(index);
        const currentBlankValidWordItems = this.getBlankOptionWordItems(
          selectedBlankSpecs[blankIndex].validOptions,
        );
        const randomValidWordItem = this.pickRandomItem(
          currentBlankValidWordItems,
        );
        if (
          !randomValidWordItem.word ||
          randomValidWordItem.word.length === 0
        ) {
          throw new Error(
            `Lesson ${lessonIndex}'s clozeItem ${
              clozeItem.id
            }'s clozeSpecVariant ${variantIndex + 1}'s blankSpec number ${
              blankIndex + 1
            } has a validOption referring to a LessonItem (id: ${
              randomValidWordItem.id
            }) missing a word, which must exist to generate this exercise.`,
          );
        }
        validBlankItems.push(randomValidWordItem);
        return randomValidWordItem.word;
      }
      return clozeWord;
    });

    // randomly pick blank to request, excluding any pre-filled
    const indicesOfFlexibleBlanks = [] as Array<number>;
    selectedBlankSpecs.forEach((blankSpec, index) => {
      if (!blankSpec.alwaysPreFilled) {
        indicesOfFlexibleBlanks.push(index);
      }
    });
    const blankIndexToRequest = this.pickRandomItem(indicesOfFlexibleBlanks);
    const blankToRequest = selectedBlankSpecs[blankIndexToRequest];

    // randomly pick 3 invalid options for selected blank
    if (
      !blankToRequest.invalidOptions ||
      blankToRequest.invalidOptions.length === 0
    ) {
      throw new Error(
        `Lesson ${lessonIndex}'s clozeSpecVariant ${
          clozeItem.id
        }'s blankSpec number ${
          blankIndexToRequest + 1
        } has no invalidOptions, which must exist to generate an exercise.`,
      );
    }
    // get invalid blank options from relevant lessons for requested blank
    const invalidWords = this.getBlankOptionWordItems(
      blankToRequest.invalidOptions,
    );

    // randomly pick 3 invalid blank options out of above
    const answerOptions = this.selectRandomSubset(
      invalidWords,
      { minItems: 3, maxItems: 3 },
      lessonIndex,
    );

    // insert correct option among answers at random index
    const randomLocationInAnswerOptions = this.randomIndexLessThan(
      answerOptions.length,
    );
    const validWordItem = validBlankItems[blankIndexToRequest];
    answerOptions.splice(randomLocationInAnswerOptions, 0, validWordItem);

    // format as a ClozeExercise
    const indexOfBlankToRequest = blankMap[blankIndexToRequest];
    const clozeExercise = {
      sentenceBeginning: preFilledClozeText.slice(0, indexOfBlankToRequest),
      sentenceBlank: preFilledClozeText[indexOfBlankToRequest],
      sentenceEnd: preFilledClozeText.slice(indexOfBlankToRequest + 1),
      sentenceAudioPlaying: false,
      showingBlankFilled: false,
      options: [] as Array<ClozeOption>,
    };
    answerOptions.forEach((option) => {
      if (!option.word || option.word.length === 0) {
        throw new Error(
          `Lesson ${lessonIndex}'s clozeSpecVariant ${clozeItem.id}'s selected blankSpec refers to non-existing word with id: ${option.id}, preventing generation of exercise.`,
        );
      }
      clozeExercise.options.push({
        word: option.word,
        // audio: new Audio(术),
        correct: false,
        disabled: false,
        playing: false,
        buzzing: false,
        color: 'primary',
      } as ClozeOption);
    });
    clozeExercise.options[randomLocationInAnswerOptions].correct = true;

    return clozeExercise;
  }

  public static makeRandomItemCorrectOption(
    multipleChoiceExercise: MultipleChoiceExercise,
    selectedItems: Array<LessonItem>,
    lessonPath: string,
  ): void {
    // pick random item as correct option
    const correctIndex = this.randomIndexLessThan(selectedItems.length);
    const correctItem = selectedItems[correctIndex];
    multipleChoiceExercise.options[correctIndex].correct = true;

    const path = ContentConfig.getAudioPath(
      `${lessonPath}${correctItem.audioName}`,
    );
    multipleChoiceExercise.itemUnderTestAudio = new Audio(path);

    if (correctItem.symbolName && correctItem.symbolName.length > 0) {
      correctItem.symbolName.forEach((name) => {
        (multipleChoiceExercise.iconToMatch as Array<string>).push(
          ContentConfig.getMdiIcon(name),
        );
      });
    } else {
      multipleChoiceExercise.iconToMatch = [
        ContentConfig.getMdiIcon('mdiCellphoneWireless'),
      ];
    }
  }

  public static getBlankOptionWordItems(
    blankOptions: Array<BlankOption>,
  ): Array<LessonItem> {
    return blankOptions.reduce(
      (accumulatedWordItems: LessonItem[], blankOption) => {
        let wordItemsFromLesson = [];
        if (blankOption.words) {
          // select a subset of words from lesson
          wordItemsFromLesson = blankOption.words?.map((word) => {
            return this.lessons[blankOption.lesson - 1].items.find(
              (targetLessonItem) => {
                return targetLessonItem.word === word;
              },
            );
          }) as Array<LessonItem>;
        } else {
          // or select all words from lesson
          wordItemsFromLesson = this.lessons[
            blankOption.lesson - 1
          ].items.filter((item) => item.word && item.word.length > 0);
        }
        return [...accumulatedWordItems, ...wordItemsFromLesson];
      },
      [],
    );
  }

  public static pickRandomItem<T>(array: Array<T>): T {
    return array[Math.floor(Math.random() * array.length)];
  }

  public static randomIndexLessThan(max: number): number {
    return Math.floor(Math.random() * max);
  }
}
