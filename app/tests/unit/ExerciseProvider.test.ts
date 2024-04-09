import { describe, it, expect, vi } from 'vitest';

import type { UnitSpec } from '@/common/types/ContentTypes';
import type { MultipleChoiceExercise } from '@/MultipleChoice/MultipleChoiceTypes';
import type { ExerciseType } from '@/Content/ExerciseProvider';

import Content from '@/Content/Content';

import unitTestData from '@/test-support/UnitSpecFile.json';
const unit = unitTestData as UnitSpec;

// Item under test
import ExerciseProvider from '@/Content/ExerciseProvider';

describe('ExerciseProvider', () => {
  describe('.getExerciseFromUnit()', () => {
    it('correctly returns exercises', () => {
      // mock: Matching on 2nd exercise
      const spyPickRandomExerciseTypeMatching = vi
        .spyOn(ExerciseProvider, 'pickRandomExerciseType')
        .mockImplementation((): ExerciseType => 'Matching');
      const spySelectRandomSubsetMatching = vi
        .spyOn(ExerciseProvider, 'selectRandomSubset')
        .mockImplementation(
          () => unit.exercises[1].matchingSpec?.matchingWords || [],
        );
      const spyGetAudioData = vi
        .spyOn(Content, 'getAudioData')
        .mockImplementation((path: string) => path);

      let exercise = ExerciseProvider.getExerciseFromUnit(1);
      expect(spyPickRandomExerciseTypeMatching).toHaveBeenCalled();
      expect(exercise.exerciseType).toBe('Matching');

      // reset mocks
      spyPickRandomExerciseTypeMatching.mockRestore();
      spySelectRandomSubsetMatching.mockRestore();

      // mock: MultipleChoice on 1st exercise, word 3 as correct answer
      const spyPickRandomExerciseTypeMultipleChoice = vi
        .spyOn(ExerciseProvider, 'pickRandomExerciseType')
        .mockImplementation((): ExerciseType => 'MultipleChoice');
      const spySelectRandomSubsetMultipleChoice = vi
        .spyOn(ExerciseProvider, 'selectRandomSubset')
        .mockImplementation(
          () => unit.exercises[0].multipleChoiceSpec?.multipleChoiceWords || [],
        );
      const spyRandomIndexLessThan = vi
        .spyOn(ExerciseProvider, 'randomIndexLessThan')
        .mockImplementation(() => 3);

      exercise = ExerciseProvider.getExerciseFromUnit(1);
      expect(spyPickRandomExerciseTypeMultipleChoice).toHaveBeenCalled();
      expect(spySelectRandomSubsetMultipleChoice).toHaveBeenCalled();
      expect(spyRandomIndexLessThan).toHaveBeenCalled();

      expect(exercise.exerciseType).toBe('MultipleChoice');
      expect(
        (exercise.exerciseItems as MultipleChoiceExercise).options[0].word,
      ).toBe(
        Object.keys(
          unit.exercises[0].multipleChoiceSpec?.multipleChoiceWords
            ? unit.exercises[0].multipleChoiceSpec?.multipleChoiceWords[0]
            : [],
        )[0],
      );

      // reset mocks
      spyPickRandomExerciseTypeMultipleChoice.mockRestore();
      spySelectRandomSubsetMultipleChoice.mockRestore();
      spyRandomIndexLessThan.mockRestore();
      spyGetAudioData.mockRestore();
    });
  });

  describe('.validateExerciseIndex()', () => {
    it('correctly handles invalid params', () => {
      const units = [unit, unit, unit];
      expect(() => ExerciseProvider.validateExerciseIndex(-1, units)).toThrow();
      expect(() => ExerciseProvider.validateExerciseIndex(0, units)).toThrow();
      expect(() =>
        ExerciseProvider.validateExerciseIndex(1, units),
      ).not.toThrow();
      expect(() =>
        ExerciseProvider.validateExerciseIndex(3, units),
      ).not.toThrow();
      expect(() => ExerciseProvider.validateExerciseIndex(4, units)).toThrow();
    });
  });

  describe('.generateMatchingExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioData = vi
        .spyOn(Content, 'getAudioData')
        .mockImplementation((path: string) => path);
      const matchingExercise = ExerciseProvider.generateMatchingExercise(unit);
      expect(matchingExercise.exerciseType).toBe('Matching');
      spyGetAudioData.mockRestore();
    });
  });

  describe('.generateExplanationMatchingExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioData = vi
        .spyOn(Content, 'getAudioData')
        .mockImplementation((path: string) => path);
      const matchingExercise =
        ExerciseProvider.generateExplanationMatchingExercise(unit);
      expect(matchingExercise.exerciseType).toBe('Matching');
      expect(matchingExercise.exerciseItems.items.length).toBe(4);
      spyGetAudioData.mockRestore();
    });
  });

  describe('.generateMultipleChoiceExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioData = vi
        .spyOn(Content, 'getAudioData')
        .mockImplementation((path: string) => path);
      const multipleChoiceExercise =
        ExerciseProvider.generateMultipleChoiceExercise(unit);
      expect(multipleChoiceExercise.exerciseType).toBe('MultipleChoice');
      spyGetAudioData.mockRestore();
    });
  });

  describe('.generateExplanationMultipleChoiceExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioData = vi
        .spyOn(Content, 'getAudioData')
        .mockImplementation((path: string) => path);
      const spyPickRandomItem = vi
        .spyOn(ExerciseProvider, 'pickRandomItem')
        .mockImplementation((array) => {
          return array[0];
        });
      const multipleChoiceExercise =
        ExerciseProvider.generateExplanationMultipleChoiceExercise(unit) as {
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
          unit.exercises[2].explanationSpec?.explanationTargets?.validOption ||
            [],
        )[0],
      );
      spyGetAudioData.mockRestore();
      spyPickRandomItem.mockRestore();
    });
  });

  describe('.generateSingleClozeExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioData = vi
        .spyOn(Content, 'getAudioData')
        .mockImplementation((path: string) => path);
      // force first single cloze exercise and first valid option in test spec
      const spyPickRandomItem = vi
        .spyOn(ExerciseProvider, 'pickRandomItem')
        .mockImplementation((array) => {
          return array[0];
        });

      const singleClozeExercise =
        ExerciseProvider.generateSingleClozeExercise(unit);
      expect(singleClozeExercise.exerciseType).toBe('SingleCloze');
      expect(singleClozeExercise.exerciseItems.clozeText.length).toBe(
        unit.exercises[4].singleClozeSpec?.text?.length,
      );
      expect(singleClozeExercise.exerciseItems.clozeOptions.length).toBe(4);
      expect(singleClozeExercise.exerciseItems.clozeText[0].isBlank).toBe(
        false,
      );
      expect(singleClozeExercise.exerciseItems.clozeText[3].isBlank).toBe(
        false,
      );
      expect(singleClozeExercise.exerciseItems.clozeText[4].isBlank).toBe(true);
      expect(singleClozeExercise.exerciseItems.clozeText[4].revealed).toBe(
        false,
      );
      expect(singleClozeExercise.exerciseItems.clozeText[4].buzzing).toBe(
        false,
      );
      expect(
        singleClozeExercise.exerciseItems.clozeOptions.filter((option) =>
          ['妈妈', '姥姥', '奶奶', '爸爸'].includes(option.word),
        ).length,
      ).toBe(4);

      expect(singleClozeExercise.exerciseItems.clozeOptions[1].disabled).toBe(
        false,
      );
      expect(singleClozeExercise.exerciseItems.clozeOptions[1].buzzing).toBe(
        false,
      );

      spyGetAudioData.mockRestore();
      spyPickRandomItem.mockRestore();
    });
  });

  describe('.generateMultiClozeExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioData = vi
        .spyOn(Content, 'getAudioData')
        .mockImplementation((path: string) => path);
      // force second multi-cloze exercise in test spec
      const spyPickRandomItem = vi
        .spyOn(ExerciseProvider, 'pickRandomItem')
        .mockImplementation((array) => {
          return array[1];
        });

      const multiClozeExercise =
        ExerciseProvider.generateMultiClozeExercise(unit);
      expect(multiClozeExercise.exerciseType).toBe('MultiCloze');
      expect(multiClozeExercise.exerciseItems.clozeText.length).toBe(
        unit.exercises[7].multiClozeSpec?.text?.length,
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

      spyGetAudioData.mockRestore();
      spyPickRandomItem.mockRestore();
    });
  });

  describe('.selectClozeExerciseFromSpec()', () => {
    it('correctly returns spec', () => {
      // force second single/multi cloze exercise in test spec (index 1)
      const spyPickRandomItem = vi
        .spyOn(ExerciseProvider, 'pickRandomItem')
        .mockImplementation((array) => {
          return array[1];
        });

      const single = ExerciseProvider.selectClozeExerciseFromSpec(
        unit,
        'SingleCloze',
      );
      const multi = ExerciseProvider.selectClozeExerciseFromSpec(
        unit,
        'MultiCloze',
      );

      expect(single.singleClozeSpec?.text?.length).toBe(4);
      expect(multi.multiClozeSpec?.text?.length).toBe(20);

      spyPickRandomItem.mockRestore();
    });
  });

  describe('.generateComprehensionExercise()', () => {
    it('correctly returns exercises', () => {
      const spyGetAudioData = vi
        .spyOn(Content, 'getAudioData')
        .mockImplementation((path: string) => path);
      // force random to always pick first option
      const spyPickRandomItem = vi
        .spyOn(ExerciseProvider, 'pickRandomItem')
        .mockImplementation((array) => {
          return array[0];
        });

      const comprehension =
        ExerciseProvider.generateComprehensionExercise(unit);

      expect(comprehension.exerciseType).toBe('Comprehension');
      expect(comprehension.exerciseItems.comprehensionText.length).toBe(20);
      expect(comprehension.exerciseItems.newWordsExercises?.length).toBe(4);
      expect(comprehension.exerciseItems.questions.length).toBe(3);
      expect(comprehension.exerciseItems.stages[1].questionnaire).toBe(true);

      spyGetAudioData.mockRestore();
      spyPickRandomItem.mockRestore();
    });
  });

  describe('.selectRandomSubset()', () => {
    it('correctly handles invalid params', () => {
      expect(() =>
        ExerciseProvider.selectRandomSubset(
          [1, 2, 3],
          {
            minItems: 4,
            maxItems: 4,
          },
          1,
        ),
      ).toThrow(
        'Unit 1 only has 3 suitable item(s), which is too few to generate this exercise.',
      );

      const subset = ExerciseProvider.selectRandomSubset(
        [1, 2, 3],
        {
          minItems: 3,
          maxItems: 3,
        },
        1,
      );
      expect(subset).toContain(1);
      expect(subset).toContain(2);
      expect(subset).toContain(3);
      expect(
        ExerciseProvider.selectRandomSubset(
          [1, 2, 3],
          {
            minItems: 3,
            maxItems: 99,
          },
          1,
        ).length,
      ).toBe(3);
    });
  });

  describe('.hasAtLeast()', () => {
    it('correctly handles params', () => {
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

  describe('.createPairsFromWords()', () => {
    it('correctly handles params', () => {
      const spyGetAudioData = vi
        .spyOn(Content, 'getAudioData')
        .mockImplementation((path: string) => path);
      const words = Content.getWordsInUnit(unit).slice(4);
      const pairs = ExerciseProvider.createPairsFromWords(words);

      expect(pairs[0].wordOrIcons).toBe('姥姥');
      expect(pairs[2].wordOrIcons).toBe('姥爷');

      spyGetAudioData.mockRestore();
    });
  });

  // describe('.shuffleMatchingItemsInPlace()', () => {
  //   it('correctly handles params', () => {
  //     // take two matched pairs
  //     // shuffle
  //     // verify pointing to correct answer
  //   });
  // });

  describe('.shuffleItemsInPlace()', () => {
    it('correctly handles params', () => {
      const array = [1, 2, 3, 4];
      let iteration = 0;
      while (iteration < 5) {
        ExerciseProvider.shuffleItemsInPlace(array);
        if (array.toString() != [1, 2, 3, 4].toString()) {
          iteration = 5;
        } else {
          iteration += 1;
        }
      }
      expect(array.toString()).not.toBe([1, 2, 3, 4].toString());
    });
  });

  // describe('.makeRandomItemCorrectOption()', () => {
  //   it('correctly handles params', () => {
  //   });
  // });

  describe('.pickRandomItem()', () => {
    it('correctly handles params', () => {
      expect(ExerciseProvider.pickRandomItem([1])).toBe(1);
      expect(ExerciseProvider.pickRandomItem([])).toBe(undefined);
    });
  });

  describe('.randomIndexLessThan', () => {
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
          'Comprehension',
          'Matching',
          'MultipleChoice',
          'ExplanationMatching',
          'ExplanationMultipleChoice',
          'MultiCloze',
          'SingleCloze',
        ]).toContain(ExerciseProvider.pickRandomExerciseType(unit));
      }
    });
  });
});
