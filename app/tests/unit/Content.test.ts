import { describe, it, expect } from 'vitest';
import Content from '@/Content/Content';
import mp3 from '@/test-support/audio/placeholder-audio.mp3.audio?raw';
const base64mp3 = `data:audio/mpeg;base64,${mp3}`;

describe('Content.ts', () => {
  it('.getInstructionsPathFor()', () => {
    expect(Content.getInstructionsAudio('continueButton')).toBe(base64mp3);
  });

  it('.getAudioData()', () => {
    expect(Content.getAudioData('audio/placeholder-audio.mp3')).toBe(base64mp3);
  });

  it('.getIcon()', () => {
    expect(Content.getIcon('mdiNumeric').length).toBeGreaterThan(0);
    expect(Content.getIcon('non-existing')).toBe('');
  });

  it('.getUnitsMenu()', () => {
    const unitsMeta = Content.UnitsMeta;
    expect(unitsMeta[0]).toBe(undefined);
    expect(unitsMeta[2]).toBe(undefined);
    expect(unitsMeta[1]).toMatchObject({
      name: 'first',
      audio: base64mp3,
    });
    expect(unitsMeta[1].icon.length).toBeGreaterThan(0);
  });

  it('.getUnits()', () => {
    const units = Content.UnitSpecs;
    expect(units.length).toBe(1);
    expect(units[1]).toBe(undefined);

    expect(units[0].id).toBe('83cd60ab-224d-4723-b94e-21331bec4190');
    expect(units[0].unitIndex).toBe(1);
    expect(units[0].multipleChoiceCount).toBe(4);
    expect(units[0].matchingCount).toBe(4);
    expect(units[0].explanationCount).toBe(2);
    expect(units[0].singleClozeCount).toBe(2);
    expect(units[0].multiClozeCount).toBe(2);
    expect(units[0].exercises.length).toBe(9);
  });
});
