// @vitest-environment happy-dom
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { generateMultipleChoiceExercise } from '../../../utils/EditorExerciseProvider';
import * as EditorAudioProvider from '../../../utils/EditorAudioProvider';
import type { DynamicWord } from '../../../types/WordTypes';

// Stub createAudioFromBase64 so tests don't need real Audio playback
vi.mock('../../../utils/EditorAudioProvider', () => ({
  createAudioFromBase64: vi.fn((base64?: string | null) => ({
    el: { src: base64 ? `data:audio/mpeg;base64,${base64}` : '' },
    playing: false,
    play: vi.fn(),
    cancel: vi.fn(),
  })),
}));

function makeWord(overrides: Partial<DynamicWord> = {}): DynamicWord {
  return {
    id: 'word-1',
    word: 'hello',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z',
    ...overrides,
  } as DynamicWord;
}

describe('generateMultipleChoiceExercise', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('throws when given an empty word array', () => {
    expect(() => generateMultipleChoiceExercise([])).toThrow(
      'At least one word is required',
    );
  });

  it('produces one option per word', () => {
    const words = [
      makeWord({ id: '1', word: 'cat' }),
      makeWord({ id: '2', word: 'dog' }),
      makeWord({ id: '3', word: 'fish' }),
    ];
    const exercise = generateMultipleChoiceExercise(words);
    expect(exercise.options).toHaveLength(3);
  });

  it('sets the word text on each option', () => {
    const words = [
      makeWord({ id: '1', word: 'cat' }),
      makeWord({ id: '2', word: 'dog' }),
    ];
    const exercise = generateMultipleChoiceExercise(words);
    const wordTexts = exercise.options.map((o) => o.word);
    expect(wordTexts).toContain('cat');
    expect(wordTexts).toContain('dog');
  });

  it('marks exactly one option as correct', () => {
    const words = [
      makeWord({ id: '1', word: 'cat' }),
      makeWord({ id: '2', word: 'dog' }),
      makeWord({ id: '3', word: 'fish' }),
    ];
    const exercise = generateMultipleChoiceExercise(words);
    const correctOptions = exercise.options.filter((o) => o.correct);
    expect(correctOptions).toHaveLength(1);
  });

  it('starts all options as not disabled', () => {
    const words = [makeWord({ id: '1' }), makeWord({ id: '2', word: 'bye' })];
    const exercise = generateMultipleChoiceExercise(words);
    expect(exercise.options.every((o) => o.disabled === false)).toBe(true);
  });

  it('creates itemUnderTestAudio from the correct word audio', () => {
    const createAudioFromBase64 = vi.mocked(
      EditorAudioProvider.createAudioFromBase64,
    );
    const words = [makeWord({ id: '1', word: 'cat', audio: 'BASE64AUDIO' })];
    generateMultipleChoiceExercise(words);
    // itemUnderTestAudio is created by calling createAudioFromBase64 on the
    // correct word's audio — verify the call was made with that value
    expect(createAudioFromBase64).toHaveBeenCalledWith('BASE64AUDIO');
  });

  it('works with a single word', () => {
    const words = [makeWord({ id: '1', word: 'only' })];
    const exercise = generateMultipleChoiceExercise(words);
    expect(exercise.options).toHaveLength(1);
    expect(exercise.options[0]!.correct).toBe(true);
  });

  describe('pictureToMatch', () => {
    it('is set when the correct word picture is a data URI', () => {
      // Force the single word to be correct (only word = always correct)
      const words = [
        makeWord({ id: '1', picture: 'data:image/webp;base64,ABC123' }),
      ];
      const exercise = generateMultipleChoiceExercise(words);
      expect(exercise.pictureToMatch).toBe('data:image/webp;base64,ABC123');
    });

    it('is not set when the correct word picture is a plain filename', () => {
      const words = [makeWord({ id: '1', picture: 'cat.webp' })];
      const exercise = generateMultipleChoiceExercise(words);
      expect(exercise.pictureToMatch).toBeUndefined();
    });

    it('is not set when the correct word has no picture', () => {
      const words = [makeWord({ id: '1' })];
      const exercise = generateMultipleChoiceExercise(words);
      expect(exercise.pictureToMatch).toBeUndefined();
    });

    it('is not set when a non-correct word has a data URI picture', () => {
      // Use vi.spyOn on Math.random to force correctIndex = 0
      vi.spyOn(Math, 'random').mockReturnValue(0);
      const words = [
        makeWord({ id: '1', word: 'correct', picture: undefined }),
        makeWord({
          id: '2',
          word: 'wrong',
          picture: 'data:image/png;base64,XYZ',
        }),
      ];
      const exercise = generateMultipleChoiceExercise(words);
      expect(exercise.pictureToMatch).toBeUndefined();
    });
  });

  describe('correct option selection', () => {
    it('the correct option corresponds to the chosen word', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0); // always pick index 0
      const words = [
        makeWord({ id: '1', word: 'first' }),
        makeWord({ id: '2', word: 'second' }),
      ];
      const exercise = generateMultipleChoiceExercise(words);
      const correct = exercise.options.find((o) => o.correct);
      expect(correct?.word).toBe('first');
    });

    it('respects Math.random choosing the last index', () => {
      vi.spyOn(Math, 'random').mockReturnValue(0.999);
      const words = [
        makeWord({ id: '1', word: 'first' }),
        makeWord({ id: '2', word: 'second' }),
        makeWord({ id: '3', word: 'third' }),
      ];
      const exercise = generateMultipleChoiceExercise(words);
      const correct = exercise.options.find((o) => o.correct);
      expect(correct?.word).toBe('third');
    });
  });
});
