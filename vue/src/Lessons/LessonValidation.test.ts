import { Lesson, LessonItem } from '@/Lessons/data/LessonTypes';
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

const lessons: Array<Lesson> = [
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
];

describe('Lesson 1-10 JSON data structures', () => {
  it('is internally consistent', () => {
    const ids: string[] = [];
    lessons.forEach((lesson: Lesson) => {
      ids.push(lesson.lessonId);
      lesson.items.forEach((item: LessonItem) => {
        ids.push(item.id);
      });
    });

    // all ids are unique
    expect(ids.length).toBe([...new Set(ids)].length);

    lessons.forEach((lesson: Lesson) => {
      lesson.items.forEach((lessonItem: LessonItem) => {
        // all phrases have an explanation, and the explanation is a word
        if (lessonItem.phrase) {
          try {
            expect(typeof lessonItem.phrase).toBe('string');
            expect(lessonItem.phrase.length).toBeGreaterThan(0);
            expect(lessonItem.phraseInterpretationId).toBeDefined();
            expect(typeof lessonItem.phraseInterpretationId).toBe('string');
            expect(lessonItem.phraseInterpretationId?.length).toBe(36);
          } catch (e) {
            throw new Error(
              `Lesson ${lesson.lessonIndex} has an error at item: ${lessonItem.id}\n${e}`,
            );
          }
          // a phrase can have only one interpretation,
          // but one interpretation can belong to many phrases
          const phraseInterpretationItem = lesson.items.find(
            (item) => item.id === lessonItem.phraseInterpretationId,
          );
          expect(phraseInterpretationItem).toBeDefined();
          if (phraseInterpretationItem) {
            try {
              expect(phraseInterpretationItem?.phrase).toBe(undefined);
              expect(phraseInterpretationItem?.phraseInterpretationId).toBe(
                undefined,
              );
              expect(phraseInterpretationItem?.word.length).toBeGreaterThan(0);
            } catch (e) {
              throw new Error(
                `Lesson ${lesson.lessonIndex} has an error at item (as phrase): ${phraseInterpretationItem.id}\n${e}`,
              );
            }
          }
        }
        if (lessonItem.phraseInterpretationId) {
          expect(lessonItem.phrase).toBeDefined();
        }
      });
    });
  });

  it('has counted words and phrases correctly', () => {
    lessons.forEach((lesson) => {
      let words = 0;
      let phrases = 0;
      let phraseIds = 0;
      const wordIds = lesson.items.map((i) =>
        i.word && i.word.length > 0 ? i.id : '',
      );
      lesson.items.forEach((item) => {
        if (item.word && item.word.length > 0) {
          words += 1;
        }
        if (item.phrase && item.phrase.length > 0) {
          phrases += 1;
        }
        if (
          item.phraseInterpretationId &&
          item.phraseInterpretationId.length > 0 &&
          wordIds.includes(item.phraseInterpretationId)
        ) {
          phraseIds += 1;
        }
      });
      expect(words).toBe(lesson.wordsCount);
      expect(phrases).toBe(lesson.phrasesCount);
      expect(phraseIds).toBe(lesson.phrasesCount);
    });
  });
});
