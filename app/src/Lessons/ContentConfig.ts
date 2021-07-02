import _contentPack from '@/Lessons/data/ContentPack.json';
import { PackageConfig } from './ContentPackTypes';
import { Lesson } from './LessonTypes';
import { LessonMenuItems } from './LessonMenuTypes';

const ContentPack: PackageConfig = _contentPack;

export default class ContentConfig {
  public static getInstructionPathFor(
    scope: keyof PackageConfig['instructions'],
  ): Promise<{ default: string }> {
    const path = ContentPack.instructions[scope];
    return import(`@/Lessons/data/${path}`);
  }

  public static getLessonsMenu(): LessonMenuItems {
    const lessons = {} as LessonMenuItems;
    ContentPack.lessons.forEach((lesson, index) => {
      const oneBasedIndex = index + 1;
      lessons[oneBasedIndex] = {
        name: lesson.name,
        icon: '',
        audio: '',
      };
      import('@mdi/js').then((mod: typeof import('@mdi/js')) => {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        lessons[oneBasedIndex].icon = (mod as any)[lesson.icon];
      });
      const audioPath = lesson.audio;
      import(`@/Lessons/data/${audioPath}`).then(({ default: path }) => {
        lessons[oneBasedIndex].audio = path;
      });
    });

    return lessons;
  }

  public static async getLessons(): Promise<Array<Lesson>> {
    const lessons = [] as Array<Lesson>;
    for (let i = 0; i < ContentPack.lessons.length; i += 1) {
      const lessonPath = ContentPack.lessons[i].lessonData;
      // eslint-disable-next-line no-await-in-loop
      lessons.push(await import(`@/Lessons/data/${lessonPath}`));
    }
    return lessons;
  }
}
