import { Lesson, LessonItem } from '@/Lessons/LessonTypes';
import ContentConfig from '@/Lessons/ContentConfig';
const lessons = ContentConfig.getLessons();

describe('Integrity of JSON Lesson data', () => {
  describe('Global integrity', () => {
    it("each 'lesson.id' & 'item.id' is unique", () => {
      const ids: string[] = [];
      lessons.forEach((lesson: Lesson) => {
        ids.push(lesson.id);
        lesson.items.forEach((lessonItem: LessonItem) => {
          ids.push(lessonItem.id);
        });
      });
      expect(ids.length).toBe([...new Set(ids)].length);
    });

    it("each 'lessonIndex' is unique", () => {
      const lessonIndices: number[] = [];
      lessons.forEach((lesson: Lesson) => {
        lessonIndices.push(lesson.lessonIndex);
      });
      expect(lessonIndices.length).toBe([...new Set(lessonIndices)].length);
    });

    it('has no empty fields', () => {
      lessons.forEach((lesson) => {
        expect(lesson.id.length).toBe(36);
        expect(lesson.lessonIndex).toBeGreaterThanOrEqual(1);
        expect(lesson.clozeCount).toBeGreaterThanOrEqual(0);
        expect(lesson.explanationCount).toBeGreaterThanOrEqual(0);
        expect(lesson.sentenceCount).toBeGreaterThanOrEqual(0);
        expect(lesson.wordCount).toBeGreaterThanOrEqual(0);
        lesson.items.forEach((lessonItem) => {
          try {
            expect(lessonItem.id.length).toBe(36);
            if (lessonItem.word) {
              expect(lessonItem.word.length).toBeGreaterThan(0);
            }
            if (lessonItem.sentence) {
              expect(lessonItem.sentence.length).toBeGreaterThan(0);
            }
            if (lessonItem.explanation) {
              expect(lessonItem.explanation.length).toBeGreaterThan(0);
            }
            if (lessonItem.explanationTargetId) {
              expect(lessonItem.explanationTargetId.length).toBe(36);
            }
            if (lessonItem.clozeText) {
              expect(lessonItem.clozeText.length).toBeGreaterThan(0);
            }
            if (lessonItem.clozeSpecVariants) {
              expect(lessonItem.clozeSpecVariants.length).toBeGreaterThan(0);
            }
            if (lessonItem.audioName) {
              expect(lessonItem.audioName.length).toBeGreaterThan(0);
            }
            if (lessonItem.pictureName) {
              expect(lessonItem.pictureName.length).toBeGreaterThan(0);
            }
            if (lessonItem.videoName) {
              expect(lessonItem.videoName.length).toBeGreaterThan(0);
            }
            if (lessonItem.symbolName) {
              expect(lessonItem.symbolName.length).toBeGreaterThan(0);
            }
          } catch (e) {
            throw new Error(
              `Lesson ${lesson.lessonIndex} has an error at item: ${lessonItem.id}\n${e}`,
            );
          }
        });
      });
    });

    describe('Lesson-level integrity', () => {
      lessons.forEach((lesson) => {
        it(`lesson.${lesson.lessonIndex}.id is 36 char string`, () => {
          expect(typeof lesson.id).toBe('string');
          expect(lesson.id.length).toBe(36);
        });

        it(`lesson.${lesson.lessonIndex}.index is a positive number`, () => {
          expect(typeof lesson.lessonIndex).toBe('number');
          expect(lesson.lessonIndex).toBeGreaterThan(0);
        });

        it(`lesson.${lesson.lessonIndex}.clozeCount=${lesson.clozeCount} is accurate`, () => {
          let clozeCount = 0;
          lesson.items.forEach((lessonItem) => {
            if (
              lessonItem.clozeText &&
              lessonItem.clozeText.length > 0 &&
              lessonItem.clozeSpecVariants &&
              lessonItem.clozeSpecVariants.length > 0
            ) {
              clozeCount += 1;
            }
          });
          expect(clozeCount).toBe(lesson.clozeCount);
        });

        it(`lesson.${lesson.lessonIndex}.explanationCount=${lesson.explanationCount} is accurate`, () => {
          let explanationCount = 0;
          let explanationTargetCount = 0;
          const wordIds = lesson.items.map((lessonItem) =>
            lessonItem.word && lessonItem.word.length > 0 ? lessonItem.id : '',
          );
          lesson.items.forEach((lessonItem) => {
            if (lessonItem.explanation && lessonItem.explanation.length > 0) {
              explanationCount += 1;
            }
            if (
              lessonItem.explanationTargetId &&
              lessonItem.explanationTargetId.length > 0 &&
              wordIds.includes(lessonItem.explanationTargetId)
            ) {
              explanationTargetCount += 1;
            }
          });
          expect(explanationCount).toBe(lesson.explanationCount);
          expect(explanationTargetCount).toBe(lesson.explanationCount);
        });

        it(`lesson.${lesson.lessonIndex}.sentenceCount=${lesson.sentenceCount} is accurate`, () => {
          let sentenceCount = 0;
          lesson.items.forEach((lessonItem) => {
            if (lessonItem.sentence && lessonItem.sentence.length > 0) {
              sentenceCount += 1;
            }
          });
          expect(sentenceCount).toBe(lesson.sentenceCount);
        });

        it(`lesson.${lesson.lessonIndex}.wordCount=${lesson.wordCount} is accurate`, () => {
          let wordCount = 0;
          lesson.items.forEach((lessonItem) => {
            if (lessonItem.word && lessonItem.word.length > 0) {
              wordCount += 1;
            }
          });
          expect(wordCount).toBe(lesson.wordCount);
        });
      });
    });

    describe('LessonItem-level integrity', () => {
      lessons.forEach((lesson: Lesson) => {
        describe(`lessonIndex.${lesson.lessonIndex}`, () => {
          lesson.items.forEach((lessonItem: LessonItem) => {
            describe(`id.${lessonItem.id}`, () => {
              it("'id' is 36 char string", () => {
                expect(typeof lessonItem.id).toBe('string');
                expect(lessonItem.id.length).toBe(36);
              });

              it("'word' is nonempty string", () => {
                if (lessonItem.word) {
                  expect(typeof lessonItem.word).toBe('string');
                  expect(lessonItem.word.length).toBeGreaterThan(0);
                }
              });

              it("'sentence' is nonempty string", () => {
                if (lessonItem.sentence) {
                  expect(typeof lessonItem.sentence).toBe('string');
                  expect(lessonItem.sentence.length).toBeGreaterThan(0);
                }
              });

              it("'explanation' & 'explanationTargetId' is consistent", () => {
                // all explanations have a target, and that target is a word
                if (lessonItem.explanation) {
                  expect(typeof lessonItem.explanation).toBe('string');
                  expect(lessonItem.explanation.length).toBeGreaterThan(0);
                  expect(lessonItem.explanationTargetId).toBeDefined();
                  expect(typeof lessonItem.explanationTargetId).toBe('string');
                  expect(lessonItem.explanationTargetId?.length).toBe(36);

                  // an explanation can have only one target,
                  // but an explanation target can be the target of many explanations
                  const explanationTarget = lesson.items.find(
                    (targetItem) =>
                      targetItem.id === lessonItem.explanationTargetId,
                  );
                  expect(explanationTarget).toBeDefined();
                  if (explanationTarget) {
                    try {
                      expect(explanationTarget.explanation).toBe(undefined);
                      expect(explanationTarget.explanationTargetId).toBe(
                        undefined,
                      );
                      expect(explanationTarget.word?.length).toBeGreaterThan(0);
                    } catch (e) {
                      throw new Error(
                        `Lesson ${lesson.lessonIndex}'s item ${explanationTarget.id}cannot be an explanationTarget.\n${e}`,
                      );
                    }
                  }
                }
                if (lessonItem.explanationTargetId) {
                  expect(lessonItem.explanation).toBeDefined();
                }
              });

              it("'clozeText' & 'clozeSpecVariants' is consistent", () => {
                if (lessonItem.clozeText) {
                  // must contain at least one blank
                  const blankCount = lessonItem.clozeText.filter(
                    (word) => word === '{blank}',
                  )?.length;
                  expect(blankCount).toBeGreaterThan(0);

                  // must have at least one corresponding clozeSpecVariant
                  expect(lessonItem.clozeSpecVariants?.length).toBeGreaterThan(
                    0,
                  );

                  if (lessonItem.clozeSpecVariants) {
                    lessonItem.clozeSpecVariants.forEach((clozeSpecVariant) => {
                      // each clozeSpecVariant must cover all blanks in clozeText
                      expect(clozeSpecVariant.blankSpecs.length).toBe(
                        blankCount,
                      );
                      clozeSpecVariant.blankSpecs.forEach((blankSpec) => {
                        // each blankSpecs must have validOptions
                        expect(blankSpec.validOptions.length).toBeGreaterThan(
                          0,
                        );
                        // if alwaysPreFilled -> no invalidOptions
                        if (blankSpec.alwaysPreFilled) {
                          try {
                            expect(blankSpec.invalidOptions).toBe(undefined);
                          } catch (e) {
                            throw new Error(
                              `Lesson ${lesson.lessonIndex}, item ${
                                lessonItem.id
                              }${
                                clozeSpecVariant.variant
                                  ? `, variant: ${clozeSpecVariant.variant}`
                                  : ''
                              }:\n${e}`,
                            );
                          }
                        } else {
                          try {
                            expect(
                              blankSpec.invalidOptions?.length,
                            ).toBeGreaterThan(0);
                          } catch (e) {
                            throw new Error(
                              `Lesson ${lesson.lessonIndex}, item ${
                                lessonItem.id
                              }${
                                clozeSpecVariant.variant
                                  ? `, variant: ${clozeSpecVariant.variant}`
                                  : ''
                              }:\n${e}`,
                            );
                          }
                        }
                        // if no invalidOptions -> alwaysPreFilled true
                        if (!blankSpec.invalidOptions) {
                          try {
                            expect(blankSpec.alwaysPreFilled).toBe(true);
                          } catch (e) {
                            throw new Error(
                              `Lesson ${lesson.lessonIndex}, item ${
                                lessonItem.id
                              }${
                                clozeSpecVariant.variant
                                  ? `, variant: ${clozeSpecVariant.variant}`
                                  : ''
                              }:\n${e}`,
                            );
                          }
                        } else {
                          try {
                            expect(blankSpec.alwaysPreFilled).toBe(false);
                          } catch (e) {
                            throw new Error(
                              `Lesson ${lesson.lessonIndex}, item ${
                                lessonItem.id
                              }${
                                clozeSpecVariant.variant
                                  ? `, variant: ${clozeSpecVariant.variant}`
                                  : ''
                              }:\n${e}`,
                            );
                          }
                        }
                      });
                    });
                  }
                }
                if (lessonItem.clozeSpecVariants) {
                  // must have corresponding clozeText
                  expect(lessonItem.clozeText).toBeDefined();
                  expect(lessonItem.clozeText?.length).toBeGreaterThan(0);
                }
              });

              it("'audioName' is nonempty string", () => {
                // verify url?
                if (lessonItem.audioName) {
                  expect(typeof lessonItem.audioName).toBe('string');
                  expect(lessonItem.audioName.length).toBeGreaterThan(0);
                }
                // expect(
                //   fs.existsSync(
                //     `/src/assets/lessons/lesson${lessonIndex
                //       .toString()
                //       .padStart(2, '0')}/${item.audioName}`,
                //   ),
                // ).toBe(true);
              });

              it("'pictureName' is nonempty string", () => {
                // verify url?
                if (lessonItem.pictureName) {
                  expect(typeof lessonItem.pictureName).toBe('string');
                  expect(lessonItem.pictureName.length).toBeGreaterThan(0);
                }
              });

              it("'videoName' is nonempty string", () => {
                // verify url?
                if (lessonItem.videoName) {
                  expect(typeof lessonItem.videoName).toBe('string');
                  expect(lessonItem.videoName.length).toBeGreaterThan(0);
                }
              });

              it("'symbolName' is nonempty array of strings", () => {
                // verify presence in mdiIcons?
                if (lessonItem.symbolName) {
                  expect(typeof lessonItem.symbolName).toBe('object');
                  expect(lessonItem.symbolName.length).toBeGreaterThan(0);
                }
              });
            });
          });
        });
      });
    });
  });
});
