import { MultipleChoiceExercise } from '@/MultipleChoice/MultipleChoiceTypes';
import ContentSpec from './ContentSpec';
import ExerciseProvider from './ExerciseProvider';
import { LessonSpec } from './ContentTypes';

import lessonTestData from '../test-support/LessonSpecFile.json';
const lesson = lessonTestData as LessonSpec;

describe('ExerciseProvider', () => {
  describe('.getExerciseFromLesson()', () => {
    it('correctly returns exercises', () => {
      // mock: Matching on 2nd exercise
      const spyPickRandomExerciseTypeMatching = jest
        .spyOn(ExerciseProvider, 'pickRandomExerciseType')
        .mockImplementation(() => 'Matching');
      const spySelectRandomSubsetMatching = jest
        .spyOn(ExerciseProvider, 'selectRandomSubset')
        .mockImplementation(() => lesson.exercises[1].words || []);
      const spyGetAudioPath = jest
        .spyOn(ContentSpec, 'getAudioPath')
        .mockImplementation((path: string) => path);

      let exercise = ExerciseProvider.getExerciseFromLesson(1);
      expect(spyPickRandomExerciseTypeMatching).toHaveBeenCalled();
      expect(exercise.exerciseType).toBe('Matching');

      // reset mocks
      spyPickRandomExerciseTypeMatching.mockRestore();
      spySelectRandomSubsetMatching.mockRestore();

      // mock: MultipleChoice on 1st exercise, word 3 as correct answer
      const spyPickRandomExerciseTypeMultipleChoice = jest
        .spyOn(ExerciseProvider, 'pickRandomExerciseType')
        .mockImplementation(() => 'MultipleChoice');
      const spySelectRandomSubsetMultipleChoice = jest
        .spyOn(ExerciseProvider, 'selectRandomSubset')
        .mockImplementation(() => lesson.exercises[0].words || []);
      const spyRandomIndexLessThan = jest
        .spyOn(ExerciseProvider, 'randomIndexLessThan')
        .mockImplementation(() => 3);

      exercise = ExerciseProvider.getExerciseFromLesson(1);
      expect(spyPickRandomExerciseTypeMultipleChoice).toHaveBeenCalled();
      expect(spySelectRandomSubsetMultipleChoice).toHaveBeenCalled();
      expect(spyRandomIndexLessThan).toHaveBeenCalled();

      expect(exercise.exerciseType).toBe('MultipleChoice');
      expect(
        (exercise.exerciseItems as MultipleChoiceExercise).options[0].word,
      ).toBe(
        Object.keys(
          lesson.exercises[0].words ? lesson.exercises[0].words[0] : [],
        )[0],
      );

      // reset mocks
      spyPickRandomExerciseTypeMultipleChoice.mockRestore();
      spySelectRandomSubsetMultipleChoice.mockRestore();
      spyRandomIndexLessThan.mockRestore();
      spyGetAudioPath.mockRestore();
    });
  });

  describe('.generateMatchingExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioPath = jest
        .spyOn(ContentSpec, 'getAudioPath')
        .mockImplementation((path: string) => path);
      const matchingExercise =
        ExerciseProvider.generateMatchingExercise(lesson);
      expect(matchingExercise.exerciseType).toBe('Matching');
      spyGetAudioPath.mockRestore();
    });
  });

  describe('.generateMultipleChoiceExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioPath = jest
        .spyOn(ContentSpec, 'getAudioPath')
        .mockImplementation((path: string) => path);
      const multipleChoiceExercise =
        ExerciseProvider.generateMultipleChoiceExercise(lesson);
      expect(multipleChoiceExercise.exerciseType).toBe('MultipleChoice');
      spyGetAudioPath.mockRestore();
    });
  });

  describe('.generateExplanationMultipleChoiceExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioPath = jest
        .spyOn(ContentSpec, 'getAudioPath')
        .mockImplementation((path: string) => path);
      const spyPickRandomItem = jest
        .spyOn(ExerciseProvider, 'pickRandomItem')
        .mockImplementation((array) => {
          return array[0];
        });
      const multipleChoiceExercise =
        ExerciseProvider.generateExplanationMultipleChoiceExercise(lesson) as {
          exerciseType: string;
          exerciseItems: MultipleChoiceExercise;
        };
      expect(multipleChoiceExercise.exerciseType).toBe('MultipleChoice');
      expect(multipleChoiceExercise.exerciseItems.options.length).toBe(4);
      expect(
        multipleChoiceExercise.exerciseItems.explanationToMatch,
      ).toBeDefined();
      if (multipleChoiceExercise.exerciseItems.explanationToMatch) {
        expect(
          multipleChoiceExercise.exerciseItems.explanationToMatch.length,
        ).toBeGreaterThanOrEqual(3);
      }

      // assert correct option is marked 'correct'
      const correctAlternative =
        multipleChoiceExercise.exerciseItems.options.find(
          (option) => option.correct,
        );
      expect(correctAlternative?.word).toBe(
        Object.keys(
          lesson.exercises[2].explanationTargets?.validOption || [],
        )[0],
      );
      spyGetAudioPath.mockRestore();
      spyPickRandomItem.mockRestore();
    });
  });

  describe('.generateMultiClozeExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioPath = jest
        .spyOn(ContentSpec, 'getAudioPath')
        .mockImplementation((path: string) => path);
      // force exercise based on lesson item 2 (index 1)
      const spyPickRandomItem = jest
        .spyOn(ExerciseProvider, 'pickRandomItem')
        .mockImplementation((array) => {
          return array[1];
        });

      const multiClozeExercise =
        ExerciseProvider.generateMultiClozeExercise(lesson);
      expect(multiClozeExercise.exerciseType).toBe('MultiCloze');
      expect(multiClozeExercise.exerciseItems.clozeText.length).toBe(
        lesson.exercises[7].multiClozeText?.length,
      );
      expect(multiClozeExercise.exerciseItems.clozeOptions.length).toBe(4);
      expect(multiClozeExercise.exerciseItems.clozeText[3].isBlank).toBe(false);
      expect(multiClozeExercise.exerciseItems.clozeText[4].isBlank).toBe(true);
      expect(multiClozeExercise.exerciseItems.clozeText[4].revealed).toBe(
        false,
      );
      expect(multiClozeExercise.exerciseItems.clozeText[4].buzzing).toBe(false);
      expect(multiClozeExercise.exerciseItems.clozeText[12].isBlank).toBe(true);
      expect(multiClozeExercise.exerciseItems.clozeText[16].isBlank).toBe(true);
      expect(multiClozeExercise.exerciseItems.clozeText[18].isBlank).toBe(true);
      expect(multiClozeExercise.exerciseItems.clozeText[19].isBlank).toBe(
        false,
      );

      expect(
        multiClozeExercise.exerciseItems.clozeOptions.filter((option) =>
          ['姐夫', '儿子', '两', '外甥女'].includes(option.word),
        ).length,
      ).toBe(4);

      expect(multiClozeExercise.exerciseItems.clozeOptions[1].disabled).toBe(
        false,
      );
      expect(multiClozeExercise.exerciseItems.clozeOptions[1].buzzing).toBe(
        false,
      );

      spyGetAudioPath.mockRestore();
      spyPickRandomItem.mockRestore();
    });
  });

  describe('.validateExerciseIndex()', () => {
    it('correctly handles invalid params', () => {
      const lessons = [lesson, lesson, lesson];
      expect(() =>
        ExerciseProvider.validateExerciseIndex(-1, lessons),
      ).toThrow();
      expect(() =>
        ExerciseProvider.validateExerciseIndex(0, lessons),
      ).toThrow();
      expect(() =>
        ExerciseProvider.validateExerciseIndex(1, lessons),
      ).not.toThrow();
      expect(() =>
        ExerciseProvider.validateExerciseIndex(3, lessons),
      ).not.toThrow();
      expect(() =>
        ExerciseProvider.validateExerciseIndex(4, lessons),
      ).toThrow();
    });
  });

  describe('.hasAtLeast()', () => {
    it('correctly handles invalid params', () => {
      const array = [1, 2, 3, 4, 5, 6, 7, 8];
      const validLimits = [-1, 0, 1, 7, 8];
      const invalidLimits = [9, 11];
      validLimits.forEach((validLimit) => {
        expect(() =>
          ExerciseProvider.hasAtLeast(array, validLimit, 1),
        ).not.toThrow();
      });
      invalidLimits.forEach((invalidLimit) => {
        expect(() =>
          ExerciseProvider.hasAtLeast(array, invalidLimit, 1),
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
          'MultipleChoice',
          'ExplanationMatching',
          'ExplanationMultipleChoice',
          'SingleCloze',
          'MultiCloze',
        ]).toContain(ExerciseProvider.pickRandomExerciseType(lesson));
      }
    });
  });
});
