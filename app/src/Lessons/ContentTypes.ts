export interface PackageConfig {
  formatVersion: string;

  instructions: {
    // All instruction paths must be relative to <project root>/content/:
    // some/audio/path.mp3
    // will be resolved to:
    // <project root>/content/some/audio/path.mp3
    welcome: string;
    homeButton: string;
    continueButton: string;
    instructionButton: string;
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
  formatVersion: string;
  wordCount: number;
  words: { [key: string]: WordSpec };
}

export interface WordSpec {
  word: string;
  audio?: string;
  picture?: string;
  video?: string;
  symbol?: Array<string>;
}

export interface LessonSpec {
  formatVersion: string;
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
  validOptions: Array<WordRef>;
  invalidOptions?: Array<WordRef>;
}
