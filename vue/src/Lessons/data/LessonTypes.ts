export interface Lesson {
  id: string;
  lessonIndex: number;
  clozeCount: number;
  explanationCount: number;
  sentenceCount: number;
  wordCount: number;
  items: Array<LessonItem>;
}

export interface LessonItem {
  id: string;
  word?: string;
  sentence?: string;
  explanation?: string;
  explanationTargetId?: string;
  clozeText?: Array<string>;
  clozeSpecVariants?: Array<ClozeSpecVariant>;
  audioName?: string;
  pictureName?: string;
  videoName?: string;
  symbolName?: Array<string>;
}

export interface ClozeSpecVariant {
  variant?: number;
  blankSpecs: Array<BlankSpec>;
}

export interface BlankSpec {
  description?: string;
  alwaysPreFilled: boolean;
  validOptions: Array<BlankOption>;
  invalidOptions?: Array<BlankOption>;
}

export interface BlankOption {
  lesson: number;
  words?: Array<string>;
}
