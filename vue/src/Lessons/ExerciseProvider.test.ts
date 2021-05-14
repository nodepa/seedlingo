import { MultipleChoiceExercise } from '@/MultipleChoice/MultipleChoiceTypes';
import ExerciseProvider from './ExerciseProvider';
import { Lesson } from './data/LessonTypes';

let lesson: Lesson;
beforeEach(() => {
  lesson = {
    id: '9b56ad90-9bee-48b7-baf5-e8372e2001b6',
    lessonIndex: 1,
    clozeCount: 0,
    explanationCount: 0,
    sentenceCount: 0,
    wordCount: 4,
    items: [
      {
        id: 'a681b683-d909-4f5b-834e-8347633df4b1',
        word: '数字',
        audioName: '数字.mp3',
        symbolName: ['mdiNumeric'],
      },
      {
        id: '8d2a8043-7eaa-4aee-927d-a42313036970',
        word: '零',
        audioName: '零.mp3',
        symbolName: ['mdiNumeric0Circle'],
      },
      {
        id: '1d936b6b-e44c-466c-8d04-ab52643670c2',
        word: '一',
        audioName: '一.mp3',
        symbolName: ['mdiNumeric1Circle'],
      },
      {
        id: '698cced9-2080-4226-87f0-07837add7938',
        word: '二',
        audioName: '二.mp3',
        symbolName: ['mdiNumeric2Circle'],
      },
    ],
  };
});

describe('ExerciseProvider', () => {
  describe('.getExerciseFromLesson()', () => {
    it('correctly returns exercises', () => {
      // mock: Matching
      const { pickRandomExerciseType } = ExerciseProvider;
      ExerciseProvider.pickRandomExerciseType = jest.fn(() => 'Matching');

      ExerciseProvider.getExerciseFromLesson(1).then((exercise) => {
        expect(exercise.exerciseType).toBe('Matching');
      });

      expect(lesson.items[3].symbolName?.length).toBe(1);
      lesson.items[3].symbolName = [];
      expect(lesson.items[3].symbolName?.length).toBe(0);

      // mock: MultipleChoice with items of `lesson`, index 3 as correct answer
      ExerciseProvider.pickRandomExerciseType = jest.fn(() => 'MultipleChoice');
      const { selectRandomSubset } = ExerciseProvider;
      ExerciseProvider.selectRandomSubset = jest.fn(() => lesson.items);
      const { randomIndexLessThan } = ExerciseProvider;
      ExerciseProvider.randomIndexLessThan = jest.fn(() => 3);

      ExerciseProvider.getExerciseFromLesson(1).then((exercise) => {
        expect(exercise.exerciseType).toBe('MultipleChoice');
        expect(
          (exercise.exerciseItems as MultipleChoiceExercise).options[0].word,
        ).toBe(lesson.items[0].word);
      });

      // reset mocks
      ExerciseProvider.pickRandomExerciseType = pickRandomExerciseType;
      ExerciseProvider.selectRandomSubset = selectRandomSubset;
      ExerciseProvider.randomIndexLessThan = randomIndexLessThan;
    });
  });

  describe('.generateMatchingExercise()', () => {
    it('correctly returns exercises', () => {
      expect(lesson.items[3].symbolName?.length).toBe(1);
      const matchingExercise =
        ExerciseProvider.generateMatchingExercise(lesson);
      expect(matchingExercise.exerciseType).toBe('Matching');
    });
  });

  describe('.generateMultipleChoiceExercise()', () => {
    it('correctly returns exercises', () => {
      const multipleChoiceExercise =
        ExerciseProvider.generateMultipleChoiceExercise(lesson);
      expect(multipleChoiceExercise.exerciseType).toBe('MultipleChoice');
    });
  });

  describe('.generateMultipleChoiceExplanationExercise()', () => {
    it('correctly returns exercises', () => {
      lesson = {
        id: '17df7241-eb9d-4bea-904e-d51823d8fc85',
        lessonIndex: 4,
        clozeCount: 0,
        explanationCount: 2,
        sentenceCount: 0,
        wordCount: 2,
        items: [
          {
            id: 'd63f08dd-f8e6-4b47-940b-8d9d939034a6',
            word: '姥姥',
            audioName: '姥姥.mp3',
            symbolName: ['mdiCellphoneWireless'],
          },
          {
            id: 'cb6f4821-c2d6-4ccc-b9a1-465e2ddc5e4e',
            explanation: '妈妈的妈妈',
            explanationTargetId: 'd63f08dd-f8e6-4b47-940b-8d9d939034a6',
            audioName: '妈妈的妈妈.mp3',
            symbolName: ['mdiCellphoneWireless'],
          },
          {
            id: '6c0f975c-4364-40c7-ae72-cfc2145da7e3',
            word: '老爷',
            audioName: '老爷.mp3',
            symbolName: ['mdiCellphoneWireless'],
          },
          {
            id: '4bc5c4ee-2a62-40ac-9c6b-c816dcde5330',
            explanation: '妈妈的爸爸',
            explanationTargetId: '6c0f975c-4364-40c7-ae72-cfc2145da7e3',
            audioName: '妈妈的爸爸.mp3',
            symbolName: ['mdiCellphoneWireless'],
          },
        ],
      };
      const multipleChoiceExercise =
        ExerciseProvider.generateMultipleChoiceExplanationExercise(lesson) as {
          exerciseType: string;
          exerciseItems: MultipleChoiceExercise;
        };
      expect(multipleChoiceExercise.exerciseType).toBe('MultipleChoice');
      expect(multipleChoiceExercise.exerciseItems.options.length).toBe(2);
      expect(
        multipleChoiceExercise.exerciseItems.explanationToMatch,
      ).toBeDefined();
      if (multipleChoiceExercise.exerciseItems.explanationToMatch) {
        expect(
          multipleChoiceExercise.exerciseItems.explanationToMatch.length,
        ).toBeGreaterThanOrEqual(3);
      }

      // assert correct option is marked 'correct'
      if (
        multipleChoiceExercise.exerciseItems.explanationToMatch ===
        lesson.items[1].explanation
      ) {
        const correctAlternative =
          multipleChoiceExercise.exerciseItems.options.find(
            (item) => item.correct,
          );
        expect(correctAlternative?.word).toBe(lesson.items[0].word);
      }
      if (
        multipleChoiceExercise.exerciseItems.explanationToMatch ===
        lesson.items[3].explanation
      ) {
        const correctAlternative =
          multipleChoiceExercise.exerciseItems.options.find(
            (item) => item.correct,
          );
        expect(correctAlternative?.word).toBe(lesson.items[2].word);
      }
    });
  });

  describe('.validateExerciseIndex()', () => {
    it('correctly handles invalid params', () => {
      expect(() => ExerciseProvider.validateExerciseIndex(-1)).toThrow();
      expect(() => ExerciseProvider.validateExerciseIndex(0)).toThrow();
      expect(() => ExerciseProvider.validateExerciseIndex(1)).not.toThrow();
      expect(() => ExerciseProvider.validateExerciseIndex(10)).not.toThrow();
      expect(() => ExerciseProvider.validateExerciseIndex(11)).toThrow();
    });
  });

  describe('.validateLowerLimit()', () => {
    it('correctly handles invalid params', () => {
      // lesson.length === 4
      const validLimits = [-1, 0, 1, 3, 4];
      const invalidLimits = [5, 11];
      validLimits.forEach((validLimit) => {
        expect(() =>
          ExerciseProvider.validateLowerLimit(lesson.items, validLimit, 1),
        ).not.toThrow();
      });
      invalidLimits.forEach((invalidLimit) => {
        expect(() =>
          ExerciseProvider.validateLowerLimit(lesson.items, invalidLimit, 1),
        ).toThrow();
      });
    });
  });

  describe('.pickRandomIndexLessThan', () => {
    it('is covered', () => {
      expect(ExerciseProvider.randomIndexLessThan(0)).toBe(0);
      expect(ExerciseProvider.randomIndexLessThan(1) === 0).toBe(true);
      expect(ExerciseProvider.randomIndexLessThan(2) < 2).toBe(true);
    });
  });

  describe('.pickRandomExerciseType', () => {
    it('is covered', () => {
      for (let i = 0; i < 100; i += 1) {
        expect([
          'Matching',
          'MatchingExplanation',
          'MultipleChoice',
          'MultipleChoiceExplanation',
          'Cloze',
        ]).toContain(ExerciseProvider.pickRandomExerciseType(lesson));
      }
    });
  });
});
