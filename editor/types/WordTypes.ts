import type { Schema } from '~/amplify/data/resource';

export type WordSchema = Schema['Word']['type'];
export type TagSchema = Schema['Tag']['type'];
export type WordTagSchema = Schema['WordTag']['type'];

export type WordWritable = Exclude<
  keyof WordSchema,
  'id' | 'createdAt' | 'updatedAt' | 'wordList' | 'wordTags'
>;
export type TagWritable = Exclude<
  keyof TagSchema,
  'id' | 'createdAt' | 'updatedAt' | 'wordTags'
>;

export type DynamicWord = Omit<
  WordSchema,
  | 'description'
  | 'audio'
  | 'picture'
  | 'isPunctuation'
  | 'importance'
  | 'difficulty'
> & {
  description?: string;
  audio?: string;
  picture?: string;
  isPunctuation?: boolean;
  /** Teacher-assigned importance rating (1 = low, 5 = essential) */
  importance?: number;
  /** Teacher-estimated learning difficulty (1 = easy, 5 = very hard) */
  difficulty?: number;
  inEditMode?: boolean;
  isWaiting?: boolean;
  waitsOn: { [Property in WordWritable]?: boolean };
};

export type DynamicTag = TagSchema & {
  inEditMode?: boolean;
  isWaiting?: boolean;
  waitsOn?: { [Property in TagWritable]?: boolean };
};
