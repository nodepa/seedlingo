export interface ContentSpec {
  formatVersion: '1.3.0';

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
    comprehensionExercise: string;
  };

  wordSpecFile: string;

  units: Array<{
    name: string;
    icon: string;
    introductionAudio: string;
    unitSpecFile: string;
  }>;
}

export interface WordListSpec {
  formatVersion: '1.3.0';
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

export interface UnitSpec {
  formatVersion: '1.3.0';
  id: string;
  unitIndex: number;
  matchingCount: number;
  multipleChoiceCount: number;
  explanationCount: number;
  singleClozeCount: number;
  multiClozeCount: number;
  comprehensionCount: number;
  wordsExercisedCount?: number;
  exercises: Array<ExerciseSpec>;
}

export interface ExerciseSpec {
  id: string;
  type:
    | 'Matching'
    | 'MultipleChoice'
    | 'Explanation'
    | 'SingleCloze'
    | 'MultiCloze'
    | 'Comprehension';
  matchingWords?: Array<WordRef>;
  multipleChoiceWords?: Array<WordRef>;
  explanationSpec?: ExplanationSpec;
  singleClozeSpec?: ClozeSpec;
  multiClozeSpec?: ClozeSpec;
  comprehensionSpec?: ComprehensionSpec;
}

export interface WordRef {
  [key: string]: string;
}

export interface Blank {
  description?: string;
  validOptions: Array<WordRef | Array<WordRef>>;
  invalidOptions?: Array<WordRef>;
}

export interface ExplanationSpec {
  explanation: Array<WordRef>;
  explanationTargets: {
    validOption: WordRef;
    invalidOptions: Array<WordRef>;
  };
  audio?: string;
}

export interface ClozeSpec {
  text?: Array<WordRef | Blank>;
  suppressClozeAudio?: boolean;
  suppressOptionAudio?: boolean;
}

export interface ComprehensionSpec {
  text: Array<WordRef>;
  multipleChoiceWords?: Array<WordRef>;
  matchingWords?: Array<WordRef>;
  suppressOptionAudio?: boolean;
  comprehensionQuestions?: Array<ComprehensionQuestionSpec>;
  comprehensionStages?: Array<ComprehensionStageSpec>;
}
export interface ComprehensionQuestionSpec {
  questionText: string;
  questionAudio: string;
  options: Array<{
    word: WordRef;
    correct?: boolean;
  }>;
}
export interface ComprehensionStageSpec {
  instructionText?: string;
  instructionAudio?: string;
  questionnaire?: boolean;
  onlyInstructOnRequest?: boolean;
}
