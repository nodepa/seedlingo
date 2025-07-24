import type { Schema } from '~/amplify/data/resource';

type UnitSchema = Schema['Unit']['type'];
export type UnitWritable = Exclude<keyof UnitSchema, 'id'|'createdAt'|'updatedAt'>;
export type DynamicUnit = UnitSchema & {
  inEditMode?: boolean;
  isWaiting?: boolean;
  waitsOn?: { [Property in UnitWritable]?: boolean; };
};
