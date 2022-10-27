export interface ContentSpec {
  formatVersion: '1.1.1';

  instructions: {
    // Paths to instructions audio must be relative to <project root>/content/:
    // some/audio/path.mp3.audio
    // will be resolved to:
    // <project root>/content/some/audio/path.mp3.audio
    welcome: string;
    homeButton: string;
    continueButton: string;
    toggleInstructionsButton: string;
    matchingExercise: string;
    multipleChoiceExercise: string;
    singleClozeExercise: string;
    multiClozeExercise: string;
  };

  wordSpecFile: string;

  lessons: Array<{
    name: string;
    icon: string;
    introductionAudio: string;
    lessonSpecFile: string;
  }>;
}

export interface WordListSpec {
  formatVersion: '1.1.1';
  wordCount: number;
  words: { [key: string]: WordSpec };
}

export interface WordSpec {
  word: string;
  audio?: string;
  picture?: string;
  video?: string;
  symbol?: Array<string>;
  isPunctuation?: string | boolean;
}

export interface LessonSpec {
  formatVersion: '1.1.1';
  id: string;
  lessonIndex: number;
  multipleChoiceCount: number;
  matchingCount: number;
  explanationCount: number;
  singleClozeCount: number;
  multiClozeCount: number;
  wordsExercisedCount?: number;
  exercises: Array<ExerciseSpec>;
}

export interface ExerciseSpec {
  id: string;
  type:
    | 'MultipleChoice'
    | 'Matching'
    | 'Explanation'
    | 'SingleCloze'
    | 'MultiCloze';
  words?: Array<WordRef>;
  explanation?: Array<WordRef>;
  explanationTargets?: { validOption: WordRef; invalidOptions: Array<WordRef> };
  singleClozeText?: Array<WordRef | Blank>;
  multiClozeText?: Array<WordRef | Blank>;
  audio?: string;
  picture?: string;
  video?: string;
  symbol?: Array<string>;
  suppressClozeAudio?: boolean;
  suppressOptionAudio?: boolean;
}

export interface WordRef {
  [key: string]: string;
}

export interface Blank {
  description?: string;
  validOptions: Array<WordRef | Array<WordRef>>;
  invalidOptions?: Array<WordRef>;
}
