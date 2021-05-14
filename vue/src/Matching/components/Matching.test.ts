import { shallowMount, Wrapper } from '@vue/test-utils';

import getTestData from '../data/MatchingTestData';

import Matching from './Matching.vue';
import { MatchingItem } from '../MatchingTypes';

describe('Matching', () => {
  let wrapper: Wrapper<Vue>;

  beforeEach(() => {
    wrapper = shallowMount(Matching, {
      mocks: {
        $store: { commit: () => true },
        $route: { params: { id: 'test' } },
      },
      propsData: {
        exerciseProp: getTestData(),
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
      expect(wrapper.vm.$data.localExerciseItems.length).toBe(8);
      expect(wrapper.vm.$data.selected).toBe(-1);
    });
  });

  describe('.checkForMatchAndReOrder()', () => {
    it('colors only 1 option on first selection', async () => {
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
      wrapper.vm.$data.localExerciseItems.forEach((option: MatchingItem) => {
        if (option.selected) {
          countSelected += 1;
        }
        if (option.matched) {
          countMatched += 1;
        }
      });

      expect(countSelected).toEqual(1);
      expect(countMatched).toEqual(0);
      const selectedOption = wrapper.vm.$data
        .localExerciseItems[1] as MatchingItem;
      const preSelectionOption = getTestData()[1] as MatchingItem;
      expect(selectedOption.value).toBe(preSelectionOption.value);
      expect(selectedOption.match).toBe(preSelectionOption.match);
      expect(selectedOption.color).not.toBe(preSelectionOption.color);
      expect(selectedOption.isWord).toBe(preSelectionOption.isWord);
      expect(selectedOption.isIcon).toBe(preSelectionOption.isIcon);
      expect(selectedOption.matched).toBe(preSelectionOption.matched);
      expect(selectedOption.selected).not.toBe(preSelectionOption.selected);
      expect(selectedOption.selected).toBe(true);
      expect(selectedOption.buzzing).toBe(preSelectionOption.buzzing);
    });

    it('matches two related options and re-orders them', async () => {
      // #############
      // ### setup ###
      // #############
      const originalOptions = getTestData();
      const firstIndex = 2;
      const secondIndex = 0;
      const firstIsWord = true;
      const expectedWord = '二';
      let { localExerciseItems } = wrapper.vm.$data;
      const firstSelection = localExerciseItems[firstIndex] as MatchingItem;
      const secondSelection = localExerciseItems[secondIndex] as MatchingItem;
      expect(firstSelection.match).toBe(secondIndex);
      expect(secondSelection.match).toBe(firstIndex);

      // select option 1
      expect(wrapper.vm.$data.selected).toBe(-1);
      await wrapper.setData({ selected: firstIndex });
      expect(wrapper.vm.$data.selected).toBe(firstIndex);
      expect(firstSelection.selected).toBe(true);

      // select option 3
      await wrapper.setData({ selected: secondIndex });

      // ##############
      // ### assert ###
      // ##############

      const firstSelectionOriginal = originalOptions[
        firstIndex
      ] as MatchingItem;
      const secondSelectionOriginal = originalOptions[
        secondIndex
      ] as MatchingItem;

      // deselects after processing match
      expect(wrapper.vm.$data.selected).toBe(-1);
      expect(firstSelection.selected).toBe(false);
      expect(secondSelection.selected).toBe(false);

      // toggles objects to matched
      expect(firstSelection.matched).toBe(true);
      expect(secondSelection.matched).toBe(true);
      expect(firstSelectionOriginal.matched).toBe(false);
      expect(secondSelectionOriginal.matched).toBe(false);

      // shares color different from original
      expect(firstSelection.color).not.toEqual(firstSelectionOriginal.color);
      expect(secondSelection.color).not.toEqual(secondSelectionOriginal.color);
      expect(firstSelection.color).toBe(secondSelection.color);

      // re-orders matched items
      localExerciseItems = wrapper.vm.$data.localExerciseItems;
      const newFirstIndex =
        Object.values(localExerciseItems).indexOf(firstSelection);
      const newSecondIndex =
        Object.values(localExerciseItems).indexOf(secondSelection);
      expect(newFirstIndex).toBe(firstIndex > secondIndex ? 1 : 0);
      expect(newSecondIndex).toBe(firstIndex > secondIndex ? 0 : 1);
      expect(firstSelection.match).toBe(newSecondIndex);
      expect(secondSelection.match).toBe(newFirstIndex);

      if (firstIsWord) {
        expect(firstSelection.isWord).toBe(true);
        expect(firstSelection.value).toBe(expectedWord);
      } else {
        expect(secondSelection.isWord).toBe(true);
        expect(secondSelection.value).toBe(expectedWord);
      }

      // re-orders unmatched items after matching 2️⃣ + 二
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
      expect(originalOptions[0].match).toBe(2);
      expect(originalOptions[1].match).toBe(4);
      expect(originalOptions[2].match).toBe(0);
      expect(originalOptions[3].match).toBe(7);
      expect(originalOptions[4].match).toBe(1);
      expect(originalOptions[5].match).toBe(6);
      expect(originalOptions[6].match).toBe(5);
      expect(originalOptions[7].match).toBe(3);
      // verify new sort order
      expect(localExerciseItems[0].value).toEqual(originalOptions[0].value);
      expect(localExerciseItems[1].value).toEqual(originalOptions[2].value);
      expect(localExerciseItems[2].value).toEqual(originalOptions[1].value);
      expect(localExerciseItems[3].value).toEqual(originalOptions[3].value);
      expect(localExerciseItems[4].value).toEqual(originalOptions[4].value);
      expect(localExerciseItems[5].value).toEqual(originalOptions[5].value);
      expect(localExerciseItems[6].value).toEqual(originalOptions[6].value);
      expect(localExerciseItems[7].value).toEqual(originalOptions[7].value);
      // verify new matches
      expect(localExerciseItems[0].match).toBe(1);
      expect(localExerciseItems[1].match).toBe(0);
      expect(localExerciseItems[2].match).toBe(4);
      expect(localExerciseItems[3].match).toBe(7);
      expect(localExerciseItems[4].match).toBe(2);
      expect(localExerciseItems[5].match).toBe(6);
      expect(localExerciseItems[6].match).toBe(5);
      expect(localExerciseItems[7].match).toBe(3);

      // verify state
      expect(wrapper.vm.$data.selected).toBe(-1);
    });

    it('matches all matches with re-ordering', async () => {
      // #############
      // ### setup ###
      // #############
      const originalOptions = getTestData();

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
      await wrapper.setData({ selected: 5 });
      await wrapper.setData({ selected: 6 });
      // match 二+2️⃣(5+3)
      await wrapper.setData({ selected: 4 });
      await wrapper.setData({ selected: 2 });
      // match 四+4️⃣(8+6)
      await wrapper.setData({ selected: 7 });
      await wrapper.setData({ selected: 5 });
      // match 术+🌴(7+8)
      await wrapper.setData({ selected: 6 });
      await wrapper.setData({ selected: 7 });

      // ##############
      // ### assert ###
      // ##############
      // expected new order
      const { localExerciseItems } = wrapper.vm.$data;
      // verify new sort order
      expect(localExerciseItems[0].value).toEqual(originalOptions[5].value);
      expect(localExerciseItems[1].value).toEqual(originalOptions[6].value);
      expect(localExerciseItems[2].value).toEqual(originalOptions[0].value);
      expect(localExerciseItems[3].value).toEqual(originalOptions[2].value);
      expect(localExerciseItems[4].value).toEqual(originalOptions[3].value);
      expect(localExerciseItems[5].value).toEqual(originalOptions[7].value);
      expect(localExerciseItems[6].value).toEqual(originalOptions[1].value);
      expect(localExerciseItems[7].value).toEqual(originalOptions[4].value);
      // verify new matches
      expect(localExerciseItems[0].match).toBe(1);
      expect(localExerciseItems[1].match).toBe(0);
      expect(localExerciseItems[2].match).toBe(3);
      expect(localExerciseItems[3].match).toBe(2);
      expect(localExerciseItems[4].match).toBe(5);
      expect(localExerciseItems[5].match).toBe(4);
      expect(localExerciseItems[6].match).toBe(7);
      expect(localExerciseItems[7].match).toBe(6);
    });
  });

  describe('.getSpacing()', () => {
    it('returns correct spacing class names', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const matching = wrapper.find(Matching).vm as any;

      // getSpacing(itemCount, index)
      expect(matching.getSpacing(0, 0)).toBe('');
      expect(matching.getSpacing(1, 0)).toBe('');
      expect(matching.getSpacing(2, 0)).toBe('mr-n4');
      expect(matching.getSpacing(2, 1)).toBe('ml-n4');
      expect(matching.getSpacing(3, 1)).toBe('mx-n4');
    });
  });
});
