import { MatchingItem, ExerciseAudio } from '@/Matching/MatchingTypes';
import {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '@/MultipleChoice/MultipleChoiceTypes';
import Lesson01 from '@/Lessons/data/Lesson01.json';
import Lesson02 from '@/Lessons/data/Lesson02.json';
import Lesson03 from '@/Lessons/data/Lesson03.json';
import Lesson04 from '@/Lessons/data/Lesson04.json';
import Lesson05 from '@/Lessons/data/Lesson05.json';
import Lesson06 from '@/Lessons/data/Lesson06.json';
import Lesson07 from '@/Lessons/data/Lesson07.json';
import Lesson08 from '@/Lessons/data/Lesson08.json';
import Lesson09 from '@/Lessons/data/Lesson09.json';
import Lesson10 from '@/Lessons/data/Lesson10.json';
import { Lesson, LessonItem } from '@/Lessons/data/LessonTypes';

export type ExerciseType =
  | 'Matching'
  | 'MatchingPhrase'
  | 'MultipleChoice'
  | 'MultipleChoicePhrase';

export default class ExerciseProvider {
  private static lessons = [
    Lesson01,
    Lesson02,
    Lesson03,
    Lesson04,
    Lesson05,
    Lesson06,
    Lesson07,
    Lesson08,
    Lesson09,
    Lesson10,
  ] as Array<Lesson>;

  public static async getExerciseFromLesson(
    indexFromOne: number,
  ): Promise<{
    exerciseType: string;
    exerciseItems: Array<MatchingItem> | MultipleChoiceExercise;
  }> {
    this.validateExerciseIndex(indexFromOne);
    const indexFromZero = indexFromOne - 1;
    const lesson = this.lessons[indexFromZero] as Lesson;

    const exerciseType = this.pickRandomExerciseType(lesson);
    // const exerciseType = 'Matching' as ExerciseType;
    // const exerciseType = 'MatchingPhrase' as ExerciseType;
    // const exerciseType = 'MultipleChoice' as ExerciseType;
    // const exerciseType = 'MultipleChoicePhrase' as ExerciseType;

    if (exerciseType === 'Matching') {
      return this.generateMatchingExercise(lesson);
    }
    if (exerciseType === 'MatchingPhrase') {
      return this.generateMatchingPhraseExercise(lesson);
    }
    if (exerciseType === 'MultipleChoice') {
      return this.generateMultipleChoiceExercise(lesson);
    }
    // else (exerciseType === 'MultipleChoicePhrase')
    return this.generateMultipleChoicePhraseExercise(lesson);
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
    // Matching requires minimum 2 words
    if (lesson.wordsCount >= 2) {
      validTypes.push('Matching');
    }
    // MatchingPhrase requires minimum 2 phrases & 2 words
    if (lesson.phrasesCount >= 2 && lesson.wordsCount >= 2) {
      validTypes.push('MatchingPhrase');
    }
    // MultipleChoice requires minimum 4 words
    if (lesson.wordsCount >= 4) {
      validTypes.push('MultipleChoice');
    }
    // MultipleChoicePhrase requires minimum 1 phrase & 2 words
    if (lesson.phrasesCount >= 1 && lesson.wordsCount >= 2) {
      validTypes.push('MultipleChoicePhrase');
    }
    return validTypes[Math.floor(Math.random() * validTypes.length)];
  }

  public static generateMatchingExercise(
    lesson: Lesson,
  ): { exerciseType: ExerciseType; exerciseItems: Array<MatchingItem> } {
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
      lesson.lessonIndex,
    );

    this.shuffleMatchingItemsInPlace(matchingExercises);
    return { exerciseType: 'Matching', exerciseItems: matchingExercises };
  }

  public static generateMatchingPhraseExercise(
    lesson: Lesson,
  ): { exerciseType: ExerciseType; exerciseItems: Array<MatchingItem> } {
    const phrasesInLesson = this.selectPhrasesInLesson(lesson);
    const wordsInLesson = this.selectWordsInLesson(lesson);

    const selectedPhrases = this.selectRandomSubset(
      phrasesInLesson,
      {
        minItems: 2,
        maxItems: 2,
      },
      lesson.lessonIndex,
    );

    const matchingExercises = this.createPairsFromPhrasesAndWords(
      selectedPhrases,
      wordsInLesson,
      lesson.lessonIndex,
    );

    this.shuffleMatchingItemsInPlace(matchingExercises);
    return { exerciseType: 'Matching', exerciseItems: matchingExercises };
  }

  public static generateMultipleChoiceExercise(
    lesson: Lesson,
  ): { exerciseType: ExerciseType; exerciseItems: MultipleChoiceExercise } {
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
      lesson.lessonIndex,
    );

    this.makeRandomItemCorrectOption(
      multipleChoiceExercise,
      selectedWords,
      lesson.lessonIndex,
    );

    return {
      exerciseType: 'MultipleChoice',
      exerciseItems: multipleChoiceExercise,
    };
  }

  public static generateMultipleChoicePhraseExercise(
    lesson: Lesson,
  ): { exerciseType: ExerciseType; exerciseItems: MultipleChoiceExercise } {
    const phrasesInLesson = this.selectPhrasesInLesson(lesson);

    // ensure lesson has 1 or more phrases
    if (phrasesInLesson.length === 0) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has zero phrase items, which is too few to generate an exercise.`,
      );
    }

    // randomly pick a phrase from all available phrases
    const phraseToMatch =
      phrasesInLesson[Math.floor(Math.random() * phrasesInLesson.length)];

    // get picked phrase's interpretation
    const interpretationOfPhrase = lesson.items.find(
      (lessonItem) => lessonItem.id === phraseToMatch.phraseInterpretationId,
    );
    if (!interpretationOfPhrase) {
      throw new Error(
        `Lesson ${lesson.lessonIndex} has a phrase (${phraseToMatch.id}) without a matching interpretation (${phraseToMatch.phraseInterpretationId}).`,
      );
    }

    // create collection of options, starting with correct interpretation
    const multipleChoiceExercise = {
      phraseToMatch: phraseToMatch.phrase,
      options: [] as Array<MultipleChoiceItem>,
    } as MultipleChoiceExercise;

    const correctOption = {
      word: interpretationOfPhrase.word,
      audio: {} as HTMLAudioElement,
      correct: true,
      disabled: false,
      playing: false,
      buzzing: false,
    } as MultipleChoiceItem;

    import(
      `@/assets/lessons/lesson${lesson.lessonIndex
        .toString()
        .padStart(2, '0')}/${interpretationOfPhrase.audioName}`
    ).then(({ default: path }) => {
      correctOption.audio = new Audio(path);
    });

    multipleChoiceExercise.options.push(correctOption);

    // randomly pick additional interpretations from (words - correct int.)
    const allIncorrectInterpretations = this.selectWordsInLesson(
      lesson,
      interpretationOfPhrase,
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
      import(
        `@/assets/lessons/lesson${lesson.lessonIndex
          .toString()
          .padStart(2, '0')}/${lessonItem.audioName}`
      ).then(({ default: path }) => {
        incorrectInterpretation.audio = new Audio(path);
      });
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

  public static selectPhrasesInLesson(lesson: Lesson): Array<LessonItem> {
    return lesson.items.filter((lessonItem: LessonItem) => {
      return (
        lessonItem.phrase &&
        lessonItem.phrase.length > 0 &&
        lessonItem.phraseInterpretationId &&
        lessonItem.phraseInterpretationId.length === 36
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
        Math.floor(Math.random() * lessonItemIndexes.length),
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
    lessonIndex: number,
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

      import('@mdi/js').then((mod: typeof import('@mdi/js')) => {
        lessonItem.symbolName.forEach((name) => {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (symPart.value as Array<string>).push((mod as any)[name]);
        });
      });

      import(
        `@/assets/lessons/lesson${lessonIndex.toString().padStart(2, '0')}/${
          lessonItem.audioName
        }`
      ).then(({ default: path }) => {
        wordPart.audio = this.createAudio(path);
        symPart.audio = this.createAudio(path);
      });

      matchingExercises.push(wordPart);
      matchingExercises.push(symPart);
    });
    return matchingExercises;
  }

  public static createPairsFromPhrasesAndWords(
    phraseItems: Array<LessonItem>,
    interpretationItems: Array<LessonItem>,
    lessonIndex: number,
  ): Array<MatchingItem> {
    const matchingExercises = [] as Array<MatchingItem>;
    phraseItems.forEach((phraseItem: LessonItem, index: number) => {
      const phrasePart = {
        value: phraseItem.phrase,
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

      const interpretationItem = interpretationItems.find(
        (wordItem: LessonItem) =>
          wordItem.id === phraseItem.phraseInterpretationId,
      );
      if (
        !interpretationItem ||
        !interpretationItem.word ||
        interpretationItem.word.length < 1
      ) {
        throw new Error(
          `This phrase (${phraseItem.word}) does not have a corresponding interpretation word in the same lesson.`,
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

      import(
        `@/assets/lessons/lesson${lessonIndex.toString().padStart(2, '0')}/${
          phraseItem.audioName
        }`
      ).then(({ default: path }) => {
        phrasePart.audio = this.createAudio(path);
      });

      import(
        `@/assets/lessons/lesson${lessonIndex.toString().padStart(2, '0')}/${
          interpretationItem.audioName
        }`
      ).then(({ default: path }) => {
        wordPart.audio = this.createAudio(path);
      });

      matchingExercises.push(phrasePart);
      matchingExercises.push(wordPart);
    }); // end phraseItems.forEach

    return matchingExercises;
  }

  public static createAudio(src: string) {
    const el = new Audio(src);
    const audio = {
      el,
      playing: false,
      play() {
        el.currentTime = 0;
        el.play();
      },
      cancel() {
        el.pause();
      },
    } as ExerciseAudio;

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
      const j = Math.floor(Math.random() * (i + 1));
      if (j !== i) {
        // update match targets
        if (matchingExercises[i].match === j) {
          // if matches are each others matches
          // eslint-disable-next-line no-param-reassign
          matchingExercises[i].match = i;
          // eslint-disable-next-line no-param-reassign
          matchingExercises[j].match = j;
        } else {
          // if item.match points to a pre-swap index, inject post-swap index
          // eslint-disable-next-line no-param-reassign
          matchingExercises[matchingExercises[i].match].match = j;
          // eslint-disable-next-line no-param-reassign
          matchingExercises[matchingExercises[j].match].match = i;
        }
        // swap location in list
        // eslint-disable-next-line no-param-reassign
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
      const j = Math.floor(Math.random() * (i + 1));
      if (j !== i) {
        // swap location in list
        // eslint-disable-next-line no-param-reassign
        [multipleChoiceItems[i], multipleChoiceItems[j]] = [
          multipleChoiceItems[j],
          multipleChoiceItems[i],
        ];
      }
    }
  }

  public static createMultipleChoiceExerciseFromWords(
    selectedItems: Array<LessonItem>,
    lessonIndex: number,
  ): MultipleChoiceExercise {
    const multipleChoiceExercise = {
      itemUnderTestAudio: {} as HTMLAudioElement,
      itemUnderTestAudioIsPlaying: false,
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
      import(
        `@/assets/lessons/lesson${lessonIndex.toString().padStart(2, '0')}/${
          item.audioName
        }`
      ).then(({ default: path }) => {
        exerciseItem.audio = new Audio(path);
      });
      multipleChoiceExercise.options.push(exerciseItem);
    });
    return multipleChoiceExercise;
  }

  public static makeRandomItemCorrectOption(
    multipleChoiceExercise: MultipleChoiceExercise,
    selectedItems: Array<LessonItem>,
    lessonIndex: number,
  ): void {
    // pick random item as correct option
    const correctIndex = this.pickRandomIndexLessThan(selectedItems.length);
    const correctItem = selectedItems[correctIndex];
    // eslint-disable-next-line no-param-reassign
    multipleChoiceExercise.options[correctIndex].correct = true;

    import(
      `@/assets/lessons/lesson${lessonIndex.toString().padStart(2, '0')}/${
        correctItem.audioName
      }`
    ).then(({ default: path }) => {
      // eslint-disable-next-line no-param-reassign
      multipleChoiceExercise.itemUnderTestAudio = new Audio(path);
    });

    if (correctItem.symbolName.length > 0) {
      import('@mdi/js').then((mod: typeof import('@mdi/js')) => {
        correctItem.symbolName.forEach((name) => {
          (multipleChoiceExercise.iconToMatch as Array<string>).push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mod as any)[name],
          );
        });
      });
    } else {
      import('@mdi/js').then((mod: typeof import('@mdi/js')) => {
        // eslint-disable-next-line no-param-reassign
        multipleChoiceExercise.iconToMatch = [mod.mdiCellphoneWireless];
      });
    }
  }

  public static pickRandomIndexLessThan(max: number) {
    return Math.floor(Math.random() * max);
  }
}
