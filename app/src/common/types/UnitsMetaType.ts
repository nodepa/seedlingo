import { WordSpec } from './ContentTypes';
export interface UnitsMeta {
  [index: number]: {
    name: string;
    icon: string;
    audio: string;
    words: Array<WordSpec>;
    newWords: Array<WordSpec>;
  };
}
