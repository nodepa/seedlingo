import ContentSpec from './ContentSpec';

describe('ContentConfig.ts', () => {
  it('.getInstructionPathFor()', () => {
    expect(ContentSpec.getInstructionPathFor('continueButton')).toBe(
      'data:audio/mpeg;base64,this-mp3-file-has-been-mocked',
    );
  });

  it('.getAudioPath()', () => {
    expect(ContentSpec.getAudioPath('audio/placeholder-audio.mp3')).toBe(
      'data:audio/mpeg;base64,this-mp3-file-has-been-mocked',
    );
  });

  it('.getMdiIcon()', () => {
    expect(ContentSpec.getMdiIcon('mdiNumeric').length).toBeGreaterThan(0);
    expect(ContentSpec.getMdiIcon('non-existing')).toBe('');
  });

  it('.getLessonsMenu()', () => {
    const lessonMenu = ContentSpec.getLessonsMenu();
    expect(lessonMenu[0]).toBe(undefined);
    expect(lessonMenu[2]).toBe(undefined);
    expect(lessonMenu[1]).toMatchObject({
      name: 'first',
      audio: 'data:audio/mpeg;base64,this-mp3-file-has-been-mocked',
    });
    expect(lessonMenu[1].icon.length).toBeGreaterThan(0);
  });

  it('.getLessons()', () => {
    const lessons = ContentSpec.getLessons();
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
