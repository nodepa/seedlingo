import type { Schema } from '~/amplify/data/resource';

type UnitSchema = Schema['Unit']['type'];
export type UnitWritable = Exclude<
  keyof UnitSchema,
  'id' | 'createdAt' | 'updatedAt'
>;
export type DynamicUnit = Omit<UnitSchema, 'name' | 'description' | 'icon'> & {
  name?: string;
  description?: string;
  icon?: string;
  inEditMode?: boolean;
  isWaiting?: boolean;
  waitsOn?: { [Property in UnitWritable]?: boolean };
};
