import { describe, it, expect } from 'vitest';
import Content from '@/Lessons/Content';
import mp3 from '@/test-support/audio/placeholder-audio.mp3.audio?raw';

describe('Content.ts', () => {
  it('.getInstructionsPathFor()', () => {
    expect(Content.getInstructionsAudio('continueButton')).toBe(
      `data:audio/mpeg;base64,${mp3}`,
    );
  });

  it('.getAudioData()', () => {
    expect(Content.getAudioData('audio/placeholder-audio.mp3')).toBe(
      `data:audio/mpeg;base64,${mp3}`,
    );
  });

  it('.getIcon()', () => {
    expect(Content.getIcon('mdiNumeric').length).toBeGreaterThan(0);
    expect(Content.getIcon('non-existing')).toBe('');
  });

  it('.getLessonsMenu()', () => {
    const lessonsMeta = Content.LessonsMeta;
    expect(lessonsMeta[0]).toBe(undefined);
    expect(lessonsMeta[2]).toBe(undefined);
    expect(lessonsMeta[1]).toMatchObject({
      name: 'first',
      audio: `data:audio/mpeg;base64,${mp3}`,
    });
    expect(lessonsMeta[1].icon.length).toBeGreaterThan(0);
  });

  it('.getLessons()', () => {
    const lessons = Content.LessonSpecs;
    expect(lessons.length).toBe(1);
    expect(lessons[1]).toBe(undefined);

    expect(lessons[0].id).toBe('83cd60ab-224d-4723-b94e-21331bec4190');
    expect(lessons[0].lessonIndex).toBe(1);
    expect(lessons[0].multipleChoiceCount).toBe(4);
    expect(lessons[0].matchingCount).toBe(4);
    expect(lessons[0].explanationCount).toBe(2);
    expect(lessons[0].singleClozeCount).toBe(2);
    expect(lessons[0].multiClozeCount).toBe(2);
    expect(lessons[0].exercises.length).toBe(8);
  });
});
