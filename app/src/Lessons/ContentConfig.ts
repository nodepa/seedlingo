import { PackageConfig } from './ContentPackTypes';
import { Lesson } from './LessonTypes';
import { LessonMenuItems } from './LessonMenuTypes';
import * as mdiIcons from '@mdi/js';

const mp3 = require.context('../../../content', true, /\.mp3$/);
const json = require.context('../../../content', true, /\.json$/);

export default class ContentConfig {
  private static contentPrefix = './';

  private static ContentPack = json(
    `${this.contentPrefix}ContentPack.json`,
  ) as PackageConfig;

  public static getInstructionPathFor(
    scope: keyof PackageConfig['instructions'],
  ): string {
    return mp3(`${this.contentPrefix}${this.ContentPack.instructions[scope]}`)
      .default;
  }

  public static getLessonsMenu(): LessonMenuItems {
    const lessons = {} as LessonMenuItems;
    for (let i = 0; i < this.ContentPack.lessons.length; i += 1) {
      const lesson = this.ContentPack.lessons[i];
      const oneBasedIndex = i + 1;
      lessons[oneBasedIndex] = {
        name: lesson.name,
        icon: '',
        audio: '',
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      lessons[oneBasedIndex].icon = (mdiIcons as any)[lesson.icon];

      lessons[oneBasedIndex].audio = mp3(
        `${this.contentPrefix}${lesson.instructionAudio}`,
      ).default;
    }

    return lessons;
  }

  public static getLessons(): Array<Lesson> {
    const lessons = [] as Array<Lesson>;
    for (let i = 0; i < this.ContentPack.lessons.length; i += 1) {
      const lessonPath = this.ContentPack.lessons[i].lessonData;
      const lesson: Lesson = {
        ...json(`${this.contentPrefix}${lessonPath}`),
        lessonPath: `${this.contentPrefix}${lessonPath.replace(
          /\/.*\.json/,
          '/',
        )}`,
      } as Lesson;
      lessons.push(lesson);
    }
    return lessons;
  }

  public static getAudioPath(path: string): string {
    return mp3(path).default;
  }

  public static getMdiIcon(key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (mdiIcons as any)[key];
  }
}
