import { shallowMount, Wrapper } from '@vue/test-utils';

import getTestData from '../data/MatchingTestData';

import Matching from './Matching.vue';
import { MatchingAnswer } from '../MatchingTypes';

describe('Matching', () => {
  let wrapper: Wrapper<Vue>;

  beforeEach(() => {
    wrapper = shallowMount(Matching, {
      mocks: {
        $store: { commit: () => true },
      },
    });
  });

  afterEach(() => {
    wrapper.destroy();
  });

  describe('initial state', () => {
    it('is a Vue instance', () => {
      expect(wrapper.isVueInstance).toBeTruthy();
    });

    it('has correct defaults', () => {
      expect(Object.values(wrapper.vm.$data.answers).length).toBe(8);
      expect(wrapper.vm.$data.selected).toBe(-1);
      expect(Object.values(wrapper.vm.$data.colors).length).toBe(4);
    });
  });

  describe('.checkForMatchAndReOrder()', () => {
    it('colors only 1 answer on first selection', async () => {
      // #############
      // ### setup ###
      // #############
      expect(wrapper.vm.$data.selected).toBe(-1);
      await wrapper.setData({ selected: 1 });
      expect(wrapper.vm.$data.selected).toBe(1);

      // ##############
      // ### assert ###
      // ##############
      let countSelected = 0;
      let countMatched = 0;
      Object.values(wrapper.vm.$data.answers as Array<MatchingAnswer>).forEach(
        (answer: MatchingAnswer) => {
          if (answer.isSelected) {
            countSelected += 1;
          }
          if (answer.isMatched) {
            countMatched += 1;
          }
        },
      );

      expect(countSelected).toEqual(1);
      expect(countMatched).toEqual(0);
      expect(Object.values(wrapper.vm.$data.colors).length).toBe(4);
      const selectedAnswer = wrapper.vm.$data.answers[1] as MatchingAnswer;
      const preSelectionAnswer = getTestData()[1] as MatchingAnswer;
      expect(selectedAnswer.value).toBe(preSelectionAnswer.value);
      expect(selectedAnswer.match).toBe(preSelectionAnswer.match);
      expect(selectedAnswer.color).not.toBe(preSelectionAnswer.color);
      expect(selectedAnswer.color).toBe(wrapper.vm.$data.colors[0]);
      expect(selectedAnswer.isChar).toBe(preSelectionAnswer.isChar);
      expect(selectedAnswer.isIcon).toBe(preSelectionAnswer.isIcon);
      expect(selectedAnswer.isMatched).toBe(preSelectionAnswer.isMatched);
      expect(selectedAnswer.isSelected).not.toBe(preSelectionAnswer.isSelected);
      expect(selectedAnswer.isSelected).toBe(true);
      expect(selectedAnswer.isBuzzing).toBe(preSelectionAnswer.isBuzzing);
    });

    it('matches two matching answers and re-orders them', async () => {
      // #############
      // ### setup ###
      // #############
      const originalAnswers = getTestData();
      const firstIndex = 3;
      const secondIndex = 1;
      const firstIsChar = true;
      const expectedChar = '二';
      let { answers } = wrapper.vm.$data;
      const firstSelection = answers[firstIndex] as MatchingAnswer;
      const secondSelection = answers[secondIndex] as MatchingAnswer;
      expect(firstSelection.match).toBe(secondIndex);
      expect(secondSelection.match).toBe(firstIndex);

      // select answer 1
      expect(wrapper.vm.$data.selected).toBe(-1);
      await wrapper.setData({ selected: firstIndex });
      expect(wrapper.vm.$data.selected).toBe(firstIndex);
      expect(firstSelection.isSelected).toBe(true);

      // select answer 3
      await wrapper.setData({ selected: secondIndex });

      // ##############
      // ### assert ###
      // ##############

      const firstSelectionOriginal = originalAnswers[
        firstIndex
      ] as MatchingAnswer;
      const secondSelectionOriginal = originalAnswers[
        secondIndex
      ] as MatchingAnswer;

      // deselects after processing match
      expect(wrapper.vm.$data.selected).toBe(-1);
      expect(firstSelection.isSelected).toBe(false);
      expect(secondSelection.isSelected).toBe(false);

      // toggles objects to isMatched
      expect(firstSelection.isMatched).toBe(true);
      expect(secondSelection.isMatched).toBe(true);
      expect(firstSelectionOriginal.isMatched).toBe(false);
      expect(secondSelectionOriginal.isMatched).toBe(false);

      // shares color different from original
      expect(firstSelection.color).not.toEqual(firstSelectionOriginal.color);
      expect(secondSelection.color).not.toEqual(secondSelectionOriginal.color);
      expect(firstSelection.color).toBe(secondSelection.color);

      // re-orders matched answers
      answers = wrapper.vm.$data.answers;
      const newFirstIndex = Object.values(answers).indexOf(firstSelection) + 1;
      const newSecondIndex =
        Object.values(answers).indexOf(secondSelection) + 1;
      expect(newFirstIndex).toBe(firstIndex > secondIndex ? 2 : 1);
      expect(newSecondIndex).toBe(firstIndex > secondIndex ? 1 : 2);
      expect(firstSelection.match).toBe(newSecondIndex);
      expect(secondSelection.match).toBe(newFirstIndex);

      if (firstIsChar) {
        expect(firstSelection.isChar).toBe(true);
        expect(firstSelection.value).toBe(expectedChar);
      } else {
        expect(secondSelection.isChar).toBe(true);
        expect(secondSelection.value).toBe(expectedChar);
      }

      // re-orders unmatched answers after matching 2️⃣ + 二
      // Original test data => after re-ordering:
      // 1: 2️⃣ -> 3    => 2️⃣ -> 2
      // 2: 术 -> 5    => 二 -> 1
      // 3: 二 -> 1    => 术 -> 5
      // 4: 4️⃣ -> 8    => 4️⃣ -> 8
      // 5: 🌴 -> 2    => 🌴 -> 3
      // 6: 3️⃣ -> 7    => 3️⃣ -> 7
      // 7: 三 -> 6    => 三 -> 6
      // 8: 四 -> 4    => 四 -> 4
      // verify expected test data
      expect(originalAnswers[1].match).toBe(3);
      expect(originalAnswers[2].match).toBe(5);
      expect(originalAnswers[3].match).toBe(1);
      expect(originalAnswers[4].match).toBe(8);
      expect(originalAnswers[5].match).toBe(2);
      expect(originalAnswers[6].match).toBe(7);
      expect(originalAnswers[7].match).toBe(6);
      expect(originalAnswers[8].match).toBe(4);
      // verify new sort order
      expect(answers[1].value).toEqual(originalAnswers[1].value);
      expect(answers[2].value).toEqual(originalAnswers[3].value);
      expect(answers[3].value).toEqual(originalAnswers[2].value);
      expect(answers[4].value).toEqual(originalAnswers[4].value);
      expect(answers[5].value).toEqual(originalAnswers[5].value);
      expect(answers[6].value).toEqual(originalAnswers[6].value);
      expect(answers[7].value).toEqual(originalAnswers[7].value);
      expect(answers[8].value).toEqual(originalAnswers[8].value);
      // verify new matches
      expect(answers[1].match).toBe(2);
      expect(answers[2].match).toBe(1);
      expect(answers[3].match).toBe(5);
      expect(answers[4].match).toBe(8);
      expect(answers[5].match).toBe(3);
      expect(answers[6].match).toBe(7);
      expect(answers[7].match).toBe(6);
      expect(answers[8].match).toBe(4);
    });

    it('matches all matches with re-ordering', async () => {
      // #############
      // ### setup ###
      // #############
      const originalAnswers = getTestData();

      // Original test data => after re-ordering (keeping order within pairs):
      // matching order:  3️⃣+三(6+7)    二+2️⃣(5+3)    四+4️⃣(8+6)     术+🌴(7+8)
      // 1: 2️⃣ -> 3    => 3️⃣ -> 2    => 3️⃣ -> 2    => 3️⃣ -> 2    => 3️⃣ -> 2
      // 2: 术 -> 5    => 三 -> 1    => 三 -> 1    => 三 -> 1    => 三 -> 1
      // 3: 二 -> 1    => 2️⃣ -> 5    => 2️⃣ -> 4    => 2️⃣ -> 4    => 2️⃣ -> 4
      // 4: 4️⃣ -> 8    => 术 -> 7    => 二 -> 3    => 二 -> 3    => 二 -> 3
      // 5: 🌴 -> 2    => 二 -> 3    => 术 -> 7    => 4️⃣ -> 6    => 4️⃣ -> 6
      // 6: 3️⃣ -> 7    => 4️⃣ -> 8    => 4️⃣ -> 8    => 四 -> 5    => 四 -> 5
      // 7: 三 -> 6    => 🌴 -> 4    => 🌴 -> 5    => 术 -> 8    => 术 -> 8
      // 8: 四 -> 4    => 四 -> 6    => 四 -> 6    => 🌴 -> 7    => 🌴 -> 7
      // match 3️⃣+三(6+7)
      await wrapper.setData({ selected: 6 });
      await wrapper.setData({ selected: 7 });
      // match 二+2️⃣(5+3)
      await wrapper.setData({ selected: 5 });
      await wrapper.setData({ selected: 3 });
      // match 四+4️⃣(8+6)
      await wrapper.setData({ selected: 8 });
      await wrapper.setData({ selected: 6 });
      // match 术+🌴(7+8)
      await wrapper.setData({ selected: 7 });
      await wrapper.setData({ selected: 8 });

      // ##############
      // ### assert ###
      // ##############
      // expected new order
      const { answers } = wrapper.vm.$data;
      // verify new sort order
      expect(answers[1].value).toEqual(originalAnswers[6].value);
      expect(answers[2].value).toEqual(originalAnswers[7].value);
      expect(answers[3].value).toEqual(originalAnswers[1].value);
      expect(answers[4].value).toEqual(originalAnswers[3].value);
      expect(answers[5].value).toEqual(originalAnswers[4].value);
      expect(answers[6].value).toEqual(originalAnswers[8].value);
      expect(answers[7].value).toEqual(originalAnswers[2].value);
      expect(answers[8].value).toEqual(originalAnswers[5].value);
      // verify new matches
      expect(answers[1].match).toBe(2);
      expect(answers[2].match).toBe(1);
      expect(answers[3].match).toBe(4);
      expect(answers[4].match).toBe(3);
      expect(answers[5].match).toBe(6);
      expect(answers[6].match).toBe(5);
      expect(answers[7].match).toBe(8);
      expect(answers[8].match).toBe(7);
    });
  });
});
