import {
  LessonSpec,
  PackageConfig,
  WordListSpec,
  WordRef,
  WordSpec,
} from './ContentTypes';
import { LessonMenuItems } from './LessonMenuTypes';
import * as mdiIcons from '@mdi/js';

let mp3: __WebpackModuleApi.RequireContext,
  json: __WebpackModuleApi.RequireContext;
if (process.env.NODE_ENV === 'test') {
  mp3 = require.context('../test-support', true, /\.mp3$/);
  json = require.context('../test-support', true, /\.json$/);
} else {
  mp3 = require.context('../../../content', true, /\.mp3$/);
  json = require.context('../../../content', true, /\.json$/);
}

export default class ContentSpec {
  public static contentPrefix = './';

  public static ContentPack = json(
    `${this.contentPrefix}ContentPack.json`,
  ) as PackageConfig;

  public static WordListSpec = json(
    `${this.contentPrefix}${ContentSpec.ContentPack.wordSpecFile}`,
  ) as WordListSpec;

  public static getInstructionPathFor(
    scope: keyof PackageConfig['instructions'],
  ): string {
    return this.getAudioPath(this.ContentPack.instructions[scope]);
  }

  public static getAudioPath(path: string): string {
    return mp3(`${this.contentPrefix}${path}`).default;
  }

  public static getMdiIcon(key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    return (mdiIcons as any)[key];
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
        `${this.contentPrefix}${lesson.introductionAudio}`,
      ).default;
    }

    return lessons;
  }

  public static getLessons(): Array<LessonSpec> {
    const lessons = [] as Array<LessonSpec>;
    for (let i = 0; i < this.ContentPack.lessons.length; i += 1) {
      const lessonSpecFile = this.ContentPack.lessons[i].lessonSpecFile;
      const lesson: LessonSpec = {
        ...json(`${this.contentPrefix}${lessonSpecFile}`),
      };
      lessons.push(lesson);
    }
    return lessons;
  }

  public static getWord(wordRef: string | WordRef): WordSpec {
    if (typeof wordRef === 'string') {
      return ContentSpec.WordListSpec.words[wordRef];
    } else {
      return ContentSpec.WordListSpec.words[Object.values(wordRef)[0]];
    }
  }
}
