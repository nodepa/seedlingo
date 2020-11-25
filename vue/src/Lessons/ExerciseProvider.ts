import { createAudio } from '@/Matching/data/MatchingTestData';
import { MatchingItem, ExerciseAudio } from '@/Matching/MatchingTypes';
import { MultipleChoiceExercise } from '@/MultipleChoice/MultipleChoiceTypes';
import { Lesson, LessonItem } from './LessonTypes';
import Lesson01 from './Lesson01.json';
import Lesson02 from './Lesson02.json';
import Lesson03 from './Lesson03.json';
import Lesson04 from './Lesson04.json';
import Lesson05 from './Lesson05.json';
import Lesson06 from './Lesson06.json';
import Lesson07 from './Lesson07.json';
import Lesson08 from './Lesson08.json';
import Lesson09 from './Lesson09.json';
import Lesson10 from './Lesson10.json';

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

  public static async getNextExercise(oneBaseIndex: number) {
    if (oneBaseIndex < 1 || oneBaseIndex > ExerciseProvider.lessons.length) {
      throw new Error(
        `Please choose a lesson between 1 and ${ExerciseProvider.lessons.length}`,
      );
    }
    const lesson = ExerciseProvider.lessons[oneBaseIndex - 1] as Lesson;

    // decide exercise type: Matching or MultipleChoice
    if (Math.random() * 2 > 1) {
      // if (false) {
      // return Matching-exercise

      // pseudo code:
      // pick 2-4 items from lesson (first at random, later based on progress)
      // generate 4 symbol w/audio and 4 word w/audio items paired as matches
      // randomly order the 8 items from 0 to 7
      // maintain correct pairing
      // return Array<MatchingItem>

      const selectedItems = [];
      if (lesson.items.length < 2) {
        // only 0 or 1 item in lesson
        throw new Error(
          `Lesson ${oneBaseIndex} only has ${lesson.items.length} item(s), which is too few to produce a Matching exercise.`,
        );
      } else {
        // pick 2-4 random items from lesson
        const itemIndexes = [...Array(lesson.items.length).keys()];
        const maxIterations = Math.min(4, lesson.items.length);
        for (let i = 0; i < maxIterations; i += 1) {
          const randomlySelectedUniqueIndex = itemIndexes.splice(
            Math.floor(Math.random() * itemIndexes.length),
            1,
          )[0];
          selectedItems.push(lesson.items[randomlySelectedUniqueIndex]);
        }
      }

      const matchingExercises = [] as Array<MatchingItem>;
      // const matchingExercises = [] as unknown;
      // we now have an array of 2-4 randomly ordered test items
      // we need to have 4 to 8 pairwise test items generated from this list
      selectedItems.forEach(async (item: LessonItem, index: number) => {
        const wordPart = {
          value: item.word,
          audio: {} as ExerciseAudio,
          // match: {} as MatchingItem
          match: index * 2 + 1,
          color: '',
          isChar: true,
          isIcon: false,
          isMatched: false,
          isSelected: false,
          isBuzzing: false,
        } as MatchingItem;
        const symPart = {
          value: [] as Array<string>,
          audio: {} as ExerciseAudio,
          // match: wordPart,
          match: index * 2,
          color: 'primary',
          isChar: false,
          isIcon: true,
          isMatched: false,
          isSelected: false,
          isBuzzing: false,
        } as MatchingItem;
        // wordPart.match = symPart;

        import('@mdi/js').then((mod: typeof import('@mdi/js')) => {
          item.symbolName.forEach((name) => {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (symPart.value as string[]).push((mod as any)[name]);
          });
        });

        import(
          `@/assets/lessons/lesson${lesson['lesson-index']
            .toString()
            .padStart(2, '0')}/${item.audioName}`
        ).then(({ default: path }) => {
          wordPart.audio = createAudio(path);
          symPart.audio = createAudio(path);
        });

        matchingExercises.push(wordPart);
        matchingExercises.push(symPart);
      });

      // shuffle
      for (let i = matchingExercises.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
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
          // swap index in list
          [matchingExercises[i], matchingExercises[j]] = [
            matchingExercises[j],
            matchingExercises[i],
          ];
        }
      }
      return { exerciseType: 'Matching', exerciseItems: matchingExercises };
    }
    // not returning Matching-exercise, so must return MultipleChoice-exercise

    const selectedItems = [];
    if (lesson.items.length < 5) {
      throw new Error(
        `Lesson ${oneBaseIndex} only has ${lesson.items.length} item(s), which is too few to produce a MultipleChoice exercise.`,
      );
    } else {
      // pick 4 random items from lesson
      const itemIndexes = [...Array(lesson.items.length).keys()];
      for (let i = 0; i < 4; i += 1) {
        const randomlySelectedUniqueIndex = itemIndexes.splice(
          Math.floor(Math.random() * itemIndexes.length),
          1,
        )[0];
        selectedItems.push(lesson.items[randomlySelectedUniqueIndex]);
      }
    }

    const multipleChoiceExercise = {
      itemUnderTestAudio: {} as HTMLAudioElement,
      itemUnderTestAudioIsPlaying: false,
      itemUnderTestIcon: [] as Array<string>,
      answers: [
        {
          char: selectedItems[0].word,
          audio: {} as HTMLAudioElement,
          correct: false,
          disabled: false,
          playing: false,
          isBuzzing: false,
        },
        {
          char: selectedItems[1].word,
          audio: {} as HTMLAudioElement,
          correct: false,
          disabled: false,
          playing: false,
          isBuzzing: false,
        },
        {
          char: selectedItems[2].word,
          audio: {} as HTMLAudioElement,
          correct: false,
          disabled: false,
          playing: false,
          isBuzzing: false,
        },
        {
          char: selectedItems[3].word,
          audio: {} as HTMLAudioElement,
          correct: false,
          disabled: false,
          playing: false,
          isBuzzing: false,
        },
      ],
    } as MultipleChoiceExercise;

    const correctIndex = Math.floor(Math.random() * 4);
    const correctItem = selectedItems[correctIndex];
    multipleChoiceExercise.answers[correctIndex].correct = true;

    import(
      `@/assets/lessons/lesson${lesson['lesson-index']
        .toString()
        .padStart(2, '0')}/${correctItem.audioName}`
    ).then(({ default: path }) => {
      multipleChoiceExercise.itemUnderTestAudio = new Audio(path);
    });

    if (correctItem.symbolName.length > 0) {
      import('@mdi/js').then((mod: typeof import('@mdi/js')) => {
        correctItem.symbolName.forEach((name) => {
          (multipleChoiceExercise.itemUnderTestIcon as string[]).push(
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            (mod as any)[name],
          );
        });
      });
    } else {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const mdiIcons: any = await import('@mdi/js');
      const iconName = 'mdiCellphoneWireless';
      multipleChoiceExercise.itemUnderTestIcon = mdiIcons[iconName];
    }

    import(
      `@/assets/lessons/lesson${lesson['lesson-index']
        .toString()
        .padStart(2, '0')}/${selectedItems[0].audioName}`
    ).then(({ default: path }) => {
      multipleChoiceExercise.answers[0].audio = new Audio(path);
    });
    import(
      `@/assets/lessons/lesson${lesson['lesson-index']
        .toString()
        .padStart(2, '0')}/${selectedItems[1].audioName}`
    ).then(({ default: path }) => {
      multipleChoiceExercise.answers[1].audio = new Audio(path);
    });
    import(
      `@/assets/lessons/lesson${lesson['lesson-index']
        .toString()
        .padStart(2, '0')}/${selectedItems[2].audioName}`
    ).then(({ default: path }) => {
      multipleChoiceExercise.answers[2].audio = new Audio(path);
    });
    import(
      `@/assets/lessons/lesson${lesson['lesson-index']
        .toString()
        .padStart(2, '0')}/${selectedItems[3].audioName}`
    ).then(({ default: path }) => {
      multipleChoiceExercise.answers[3].audio = new Audio(path);
    });

    return {
      exerciseType: 'MultipleChoice',
      exerciseItems: multipleChoiceExercise,
    };
  }
}
