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
  'description' | 'audio' | 'picture' | 'isPunctuation'
> & {
  description?: string;
  audio?: string;
  picture?: string;
  isPunctuation?: boolean;
  inEditMode?: boolean;
  isWaiting?: boolean;
  waitsOn: { [Property in WordWritable]?: boolean };
};

export type DynamicTag = TagSchema & {
  inEditMode?: boolean;
  isWaiting?: boolean;
  waitsOn?: { [Property in TagWritable]?: boolean };
};
