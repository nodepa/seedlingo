export interface Lesson {
  'lesson-id': string;
  'lesson-index': number;
  items: Array<LessonItem>;
}

export interface LessonItem {
  id: string;
  word: string;
  audioName: string;
  pictureName: string;
  videoName: string;
  symbolName: Array<string>;
}
