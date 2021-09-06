export interface PackageConfig {
  formatVersion: string;
  // All instruction paths must be relative paths
  // starting from <project root>/content/:
  // some/audio/path.mp3
  // will be used to resolve: <project root>/content/some/audio/path.mp3
  instructions: {
    welcome: string;
    homeButton: string;
    continueButton: string;
    instructionsButton: string;
    multipleChoiceExercise: string;
    clozeExercise: string;
  };
  lessons: Array<{
    name: string;
    icon: string;
    audio: string;
    lessonData: string;
  }>;
}
