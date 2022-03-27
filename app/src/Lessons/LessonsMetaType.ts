import { WordSpec } from '@/Lessons/ContentTypes';
export interface LessonsMeta {
  [index: number]: {
    name: string;
    icon: string;
    audio: string;
    words: Array<WordSpec>;
    newWords: Array<WordSpec>;
  };
}
