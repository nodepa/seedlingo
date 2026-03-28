import type {
  MultipleChoiceExercise,
  MultipleChoiceItem,
} from '@/MultipleChoice/MultipleChoiceTypes';
import type { ExerciseAudio } from '@/common/types/ExerciseAudioType';
import type { DynamicWord } from '~/types/WordTypes';
import { createAudioFromBase64 } from '~/utils/EditorAudioProvider';

/**
 * Generates a MultipleChoiceExercise from an array of DynamicWord objects
 * sourced from the editor's DynamoDB backend.
 *
 * Works with any number of words ≥ 1. One word is chosen at random to be the
 * "item under test" (its audio plays in the top card); all words appear as
 * answer option buttons, with the item-under-test being the correct answer.
 */
export function generateMultipleChoiceExercise(
  words: DynamicWord[],
): MultipleChoiceExercise {
  if (words.length === 0) {
    throw new Error('At least one word is required to generate an exercise.');
  }

  // Build one MultipleChoiceItem per word
  const options: MultipleChoiceItem[] = words.map((word) => ({
    word: word.word ?? '',
    audio: createAudioFromBase64(word.audio) as ExerciseAudio,
    correct: false,
    disabled: false,
    playing: false,
  }));

  // Pick a random word as the correct answer / item under test
  const correctIndex = Math.floor(Math.random() * words.length);
  options[correctIndex]!.correct = true;
  const correctWord = words[correctIndex]!;

  const exercise: MultipleChoiceExercise = {
    options,
    itemUnderTestAudio: createAudioFromBase64(
      correctWord.audio,
    ) as ExerciseAudio,
    itemUnderTestAudioPlaying: false,
  };

  // Attach picture if the word has one (stored as a base64 data URI in the DB)
  if (correctWord.picture && correctWord.picture.length > 0) {
    exercise.pictureToMatch = correctWord.picture;
  }

  return exercise;
}
