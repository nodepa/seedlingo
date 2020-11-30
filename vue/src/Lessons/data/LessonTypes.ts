export interface Lesson {
  lessonId: string;
  lessonIndex: number;
  wordsCount: number;
  phrasesCount: number;
  items: Array<LessonItem>;
}

export interface LessonItem {
  id: string;
  word: string;
  phrase?: string;
  phraseInterpretationId?: string;
  audioName: string;
  pictureName: string;
  videoName: string;
  symbolName: Array<string>;
}
