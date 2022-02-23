import {
  LessonSpec,
  PackageConfig,
  WordListSpec,
  WordRef,
  WordSpec,
} from './ContentTypes';
import { LessonMenuItems } from './LessonMenuTypes';
import * as mdiIcons from '@mdi/js';

let mp3Base64Sources: __WebpackModuleApi.RequireContext,
  jsonSources: __WebpackModuleApi.RequireContext;
if (process.env.NODE_ENV === 'test') {
  mp3Base64Sources = require.context('../test-support', true, /\.mp3.audio/);
  jsonSources = require.context('../test-support', true, /\.json$/);
} else {
  mp3Base64Sources = require.context('../../../content', true, /\.mp3.audio$/);
  jsonSources = require.context('../../../content', true, /\.json$/);
}

export default class ContentSpec {
  public static contentPrefix = './';

  public static ContentPack = jsonSources(
    `${this.contentPrefix}ContentPack.json`,
  ) as PackageConfig;

  public static WordListSpec = jsonSources(
    `${this.contentPrefix}${ContentSpec.ContentPack.wordSpecFile}`,
  ) as WordListSpec;

  public static getInstructionPathFor(
    scope: keyof PackageConfig['instructions'],
  ): string {
    return this.getAudioPath(this.ContentPack.instructions[scope]);
  }

  public static getAudioPath(path: string): string {
    return `data:audio/mpeg;base64,${mp3Base64Sources(
      `${this.contentPrefix}${path}.audio`,
    )}`;
  }

  public static getMdiIcon(key: string): string {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const drawPath = (mdiIcons as any)[key];
    return drawPath
      ? `data:image/svg+xml,<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="24" height="24" viewBox="0 0 24 24"><path d="${drawPath}"/></svg>`
      : '';
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
      // lessons[oneBasedIndex].icon = (mdiIcons as any)[lesson.icon];
      lessons[oneBasedIndex].icon = this.getMdiIcon(lesson.icon);

      lessons[oneBasedIndex].audio = `data:audio/mpeg;base64,${mp3Base64Sources(
        `${this.contentPrefix}${lesson.introductionAudio}.audio`,
      )}`;
    }

    return lessons;
  }

  public static getLessons(): Array<LessonSpec> {
    const lessons = [] as Array<LessonSpec>;
    for (let i = 0; i < this.ContentPack.lessons.length; i += 1) {
      const lessonSpecFile = this.ContentPack.lessons[i].lessonSpecFile;
      const lesson: LessonSpec = {
        ...jsonSources(`${this.contentPrefix}${lessonSpecFile}`),
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
