import { describe, it, expect, vi, beforeAll } from 'vitest';
import { existsSync } from 'fs';
import {
  Blank,
  ExerciseSpec,
  LessonSpec,
  WordRef,
} from '@/Lessons/ContentTypes';

import Content from '@/Lessons/Content';

// Ensure that *production* content is used for (only) lesson validation
beforeAll(() => {
  vi.mock('@/Lessons/Content', async (importOriginal) => {
    vi.stubEnv('MODE', 'production');
    const Content = await importOriginal();
    vi.unstubAllEnvs();
    return Content;
  });
});

describe('Integrity of JSON Lesson data', () => {
  describe('Global integrity', () => {
    it("each 'lesson.id' & 'exercise.id' is unique", () => {
      const ids: string[] = [];
      Content.LessonSpecs.forEach((lesson: LessonSpec) => {
        ids.push(lesson.id);
        lesson.exercises.forEach((exercise: ExerciseSpec) => {
          ids.push(exercise.id);
        });
      });
      const uniqueIds = new Set(ids);
      if (ids.length != uniqueIds.size) {
        console.log('Non-unique IDs:');
        ids.forEach((id, index, allIds) => {
          if (id === allIds[index - 1]) {
            console.log(`"${id}"`);
          }
        });
      }
      expect(ids.length).toBe(uniqueIds.size);
    });

    it("each 'lessonIndex' is unique", () => {
      const lessonIndices: number[] = [];
      Content.LessonSpecs.forEach((lesson: LessonSpec) => {
        lessonIndices.push(lesson.lessonIndex);
      });
      expect(lessonIndices.length).toBe([...new Set(lessonIndices)].length);
    });

    it('has no empty fields', () => {
      Content.LessonSpecs.forEach((lesson) => {
        expect(lesson.id.length).toBeGreaterThanOrEqual(1);
        expect(lesson.lessonIndex).toBeGreaterThanOrEqual(1);
        expect(lesson.multipleChoiceCount).toBeGreaterThanOrEqual(0);
        expect(lesson.matchingCount).toBeGreaterThanOrEqual(0);
        expect(lesson.explanationCount).toBeGreaterThanOrEqual(0);
        expect(lesson.singleClozeCount).toBeGreaterThanOrEqual(0);
        expect(lesson.multiClozeCount).toBeGreaterThanOrEqual(0);
        if (lesson.wordsExercisedCount) {
          expect(lesson.wordsExercisedCount).toBeGreaterThanOrEqual(0);
        }
        lesson.exercises.forEach((exercise) => {
          try {
            expect(exercise.id.length).toBeGreaterThanOrEqual(1);
            expect(exercise.type.length).toBeGreaterThanOrEqual(0);
            if (['MultipleChoice', 'Matching'].includes(exercise.type)) {
              expect(exercise.words?.length).toBeGreaterThan(1);
            } else if (exercise.type === 'Explanation') {
              expect(exercise.explanation?.length).toBeGreaterThan(0);
              expect(
                exercise.explanation?.filter(
                  (wordRef) => wordRef[Object.keys(wordRef)[0]].length > 0,
                ).length === exercise.explanation?.length,
              ).toBe(true);
              expect(!!exercise.explanationTargets).toBe(true);
              if (exercise.explanationTargets) {
                expect(
                  exercise.explanationTargets.validOption[
                    Object.keys(exercise.explanationTargets.validOption)[0]
                  ].length,
                ).toBeGreaterThan(0);
                expect(
                  exercise.explanationTargets.invalidOptions.length,
                ).toBeGreaterThan(1);
              }
            } else if (exercise.type === 'SingleCloze') {
              expect(exercise.singleClozeText?.length).toBeGreaterThan(1);
              // at least one blank
              expect(
                exercise.singleClozeText?.filter(
                  (word) => 'validOptions' in word,
                ).length,
              ).toBeGreaterThan(0);
            } else if (exercise.type === 'MultiCloze') {
              expect(exercise.multiClozeText?.length).toBeGreaterThan(1);
              // at least one blank
              expect(
                exercise.multiClozeText?.filter(
                  (word) => 'validOptions' in word,
                ).length,
              ).toBeGreaterThan(0);
            } else {
              throw new Error(
                `Lesson ${lesson.lessonIndex} has an invalid 'type' field at exercise: ${exercise.id}`,
              );
            }

            if ('audio' in exercise) {
              expect(typeof exercise.audio).toBe('string');
              expect(exercise.audio?.length).toBeGreaterThan(0);
            }
            if ('picture' in exercise) {
              expect(typeof exercise.picture).toBe('string');
              expect(exercise.picture?.length).toBeGreaterThan(0);
            }
            if ('video' in exercise) {
              expect(typeof exercise.video).toBe('string');
              expect(exercise.video?.length).toBeGreaterThan(0);
            }
            if ('symbol' in exercise) {
              expect(exercise.symbol?.length).toBeGreaterThan(0);
            }
            if ('suppressClozeAudio' in exercise) {
              expect(typeof exercise.suppressClozeAudio).toBe('boolean');
            }
            if ('suppressOptionAudio' in exercise) {
              expect(typeof exercise.suppressOptionAudio).toBe('boolean');
            }
          } catch (e) {
            throw new Error(
              `Lesson ${lesson.lessonIndex} has an error at exercise: ${exercise.id}\n${e}`,
            );
          }
        });
      });
    });

    describe('Lesson-level integrity', () => {
      Content.LessonSpecs.forEach((lesson) => {
        it(`lesson.${lesson.lessonIndex}.id is 36 char string`, () => {
          expect(typeof lesson.id).toBe('string');
          expect(lesson.id.length).toBe(36);
        });

        it(`lesson.${lesson.lessonIndex}.index is a positive number`, () => {
          expect(typeof lesson.lessonIndex).toBe('number');
          expect(lesson.lessonIndex).toBeGreaterThan(0);
        });

        it(`lesson.${lesson.lessonIndex}.multipleChoiceCount=${lesson.multipleChoiceCount} is accurate`, () => {
          let multipleChoiceCount = 0;
          lesson.exercises.forEach((exercise) => {
            if (exercise.type === 'MultipleChoice') {
              multipleChoiceCount = exercise.words?.length || 0;
            }
          });
          expect(multipleChoiceCount).toBe(lesson.multipleChoiceCount);
        });

        it(`lesson.${lesson.lessonIndex}.matchingCount=${lesson.matchingCount} is accurate`, () => {
          let matchingCount = 0;
          lesson.exercises.forEach((exercise) => {
            if (exercise.type === 'Matching') {
              matchingCount = exercise.words?.length || 0;
            }
          });
          expect(matchingCount).toBe(lesson.matchingCount);
        });

        it(`lesson.${lesson.lessonIndex}.explanationCount=${lesson.explanationCount} is accurate`, () => {
          let explanationCount = 0;
          lesson.exercises.forEach((exercise) => {
            if (exercise.type === 'Explanation') {
              explanationCount += 1;
            }
          });
          expect(explanationCount).toBe(lesson.explanationCount);
        });

        it(`lesson.${lesson.lessonIndex}.singleClozeCount=${lesson.singleClozeCount} is accurate`, () => {
          let singleClozeCount = 0;
          let singleClozeConsistency = true;
          lesson.exercises.forEach((exercise) => {
            if (exercise.type === 'SingleCloze') {
              singleClozeCount += 1;
              if (
                !exercise.singleClozeText ||
                exercise.singleClozeText.length < 1
              ) {
                singleClozeConsistency = false;
              }
            }
          });
          expect(singleClozeCount).toBe(lesson.singleClozeCount);
          expect(singleClozeConsistency).toBe(true);
        });

        it(`lesson.${lesson.lessonIndex}.multiClozeCount=${lesson.multiClozeCount} is accurate`, () => {
          let multiClozeCount = 0;
          let multiClozeConsistency = true;
          lesson.exercises.forEach((exercise) => {
            if (exercise.type === 'MultiCloze') {
              multiClozeCount += 1;
              if (
                !exercise.multiClozeText ||
                exercise.multiClozeText.length < 2
              ) {
                multiClozeConsistency = false;
              }
            }
          });
          expect(multiClozeCount).toBe(lesson.multiClozeCount);
          expect(multiClozeConsistency).toBe(true);
        });

        it(`lesson.${lesson.lessonIndex}.wordsExercisedCount=${lesson.wordsExercisedCount} is accurate`, () => {
          const wordsExercised: Set<string> = new Set();
          lesson.exercises.forEach((exercise) => {
            if (['MultipleChoice', 'Matching'].includes(exercise.type)) {
              if (exercise.words) {
                exercise.words.forEach((wordRef) => {
                  if (!wordsExercised.has(Object.values(wordRef)[0])) {
                    wordsExercised.add(Object.values(wordRef)[0]);
                  }
                });
              }
            }
            if (exercise.type === 'Explanation') {
              if (exercise.explanationTargets) {
                if (
                  !wordsExercised.has(
                    Object.values(exercise.explanationTargets.validOption)[0],
                  )
                ) {
                  wordsExercised.add(
                    Object.values(exercise.explanationTargets.validOption)[0],
                  );
                }
              }
            }
            if (exercise.type === 'SingleCloze' && exercise.singleClozeText) {
              exercise.singleClozeText
                .filter(
                  (clozeItem): clozeItem is Blank => !!clozeItem.validOptions,
                )
                .forEach((clozeItem) => {
                  clozeItem.validOptions.forEach((wordRef) => {
                    if (!wordsExercised.has(Object.values(wordRef)[0])) {
                      wordsExercised.add(Object.values(wordRef)[0]);
                    }
                  });
                });
            }
            if (exercise.type === 'MultiCloze' && exercise.multiClozeText) {
              exercise.multiClozeText
                .filter(
                  (clozeItem): clozeItem is Blank => !!clozeItem.validOptions,
                )
                .forEach((clozeItem) => {
                  clozeItem.validOptions.forEach((wordRef) => {
                    if (!wordsExercised.has(Object.values(wordRef)[0])) {
                      wordsExercised.add(Object.values(wordRef)[0]);
                    }
                  });
                });
            }
          });
          expect(wordsExercised.size).toBe(lesson.wordsExercisedCount);
        });
      });
    });

    describe('Exercise-level integrity', () => {
      Content.LessonSpecs.forEach((lesson: LessonSpec) => {
        describe(`lessonIndex.${lesson.lessonIndex}`, () => {
          lesson.exercises.forEach((exercise: ExerciseSpec) => {
            describe(`exercise.id.${exercise.id}`, () => {
              it("'id' is 36 char string", () => {
                expect(typeof exercise.id).toBe('string');
                expect(exercise.id.length).toBe(36);
              });

              it("'type' is among valid options", () => {
                expect(typeof exercise.type).toBe('string');
                expect(
                  [
                    'MultipleChoice',
                    'Matching',
                    'Explanation',
                    'SingleCloze',
                    'MultiCloze',
                  ].includes(exercise.type),
                ).toBe(true);
              });

              it("'words' references exist in WordSpec", () => {
                if (['MultipleChoice', 'Matching'].includes(exercise.type)) {
                  expect(!!exercise.words).toBe(true);
                  if (exercise.words) {
                    expect(exercise.words.length).toBeGreaterThan(1);
                    exercise.words.forEach((wordRef) => {
                      expect(
                        Content.getWord(wordRef).word.length,
                      ).toBeGreaterThan(0);
                    });
                  }
                }
              });

              it("'explanation' & 'explanationTargets' is consistent", () => {
                if (exercise.type === 'Explanation') {
                  expect(
                    !!exercise.explanation && !!exercise.explanationTargets,
                  ).toBe(true);
                  if (exercise.explanation && exercise.explanationTargets) {
                    expect(exercise.explanation.length).toBeGreaterThan(0);
                    // every wordRef in explanation is found in WordSpec
                    expect(
                      exercise.explanation.filter(
                        (wordRef) => Content.getWord(wordRef).word.length > 0,
                      ).length,
                    ).toBe(exercise.explanation.length);

                    expect(
                      Object.keys(exercise.explanationTargets.validOption)
                        .length,
                    ).toBe(1);
                    // explanationTargets.validOption is found in WordSpec
                    expect(
                      Content.getWord(exercise.explanationTargets.validOption)
                        .word.length,
                    ).toBeGreaterThan(0);

                    // explanationTargets.invalidOptions are found in WordSpec
                    expect(
                      exercise.explanationTargets.invalidOptions.filter(
                        (wordRef) => Content.getWord(wordRef).word.length > 0,
                      ).length,
                    ).toBeGreaterThan(0);
                  }
                }
              });

              it("'singleClozeText' is consistent", () => {
                if (exercise.type === 'SingleCloze') {
                  expect(exercise.singleClozeText?.length).toBeGreaterThan(1);
                  if (exercise.singleClozeText) {
                    const blankCount = exercise.singleClozeText.filter(
                      (wordOrBlank) => 'validOptions' in wordOrBlank,
                    )?.length;
                    expect(blankCount).toBeGreaterThan(0);
                    expect(
                      exercise.singleClozeText.length - blankCount,
                    ).toBeGreaterThan(0);
                    const validWordRefs = exercise.singleClozeText.filter(
                      (wordOrBlank) => {
                        if (
                          'validOptions' in wordOrBlank &&
                          (wordOrBlank as Blank).validOptions.filter(
                            (wordRefOrRefs) => {
                              if (Array.isArray(wordRefOrRefs)) {
                                return (wordRefOrRefs as Array<WordRef>).filter(
                                  (wordRef) => {
                                    if (
                                      Object.keys(wordRef)[0] ===
                                      Content.getWord(wordRef).word
                                    ) {
                                      return true;
                                    } else {
                                      throw new Error(
                                        `Failed when lookup of ${JSON.stringify(
                                          wordRef,
                                        )} resulted in ${JSON.stringify(
                                          Content.getWord(wordRef),
                                        )}`,
                                      );
                                    }
                                  },
                                ).length;
                              } else {
                                if (
                                  Object.keys(wordRefOrRefs)[0] ===
                                  Content.getWord(wordRefOrRefs).word
                                ) {
                                  return true;
                                } else {
                                  throw new Error(
                                    `Failed when lookup of ${JSON.stringify(
                                      wordRefOrRefs,
                                    )} resulted in ${JSON.stringify(
                                      Content.getWord(wordRefOrRefs),
                                    )}`,
                                  );
                                }
                              }
                            },
                          )
                        ) {
                          return true;
                        } else if (
                          Object.keys(wordOrBlank)[0] ===
                          Content.getWord(wordOrBlank as WordRef).word
                        ) {
                          return true;
                        } else {
                          throw new Error(`
                          Failed when lookup of ${JSON.stringify(
                            wordOrBlank,
                          )} resulted in ${JSON.stringify(
                            Content.getWord(wordOrBlank as WordRef),
                          )}
                          `);
                        }
                      },
                    )?.length;
                    expect(validWordRefs).toBe(exercise.singleClozeText.length);
                  }
                }
              });

              it("'multiClozeText' is consistent", () => {
                if (exercise.type === 'MultiCloze') {
                  expect(exercise.multiClozeText?.length).toBeGreaterThan(1);
                  if (exercise.multiClozeText) {
                    const blankCount = exercise.multiClozeText.filter(
                      (wordOrBlank) => 'validOptions' in wordOrBlank,
                    )?.length;
                    expect(blankCount).toBeGreaterThan(0);
                    expect(
                      exercise.multiClozeText.length - blankCount,
                    ).toBeGreaterThan(0);

                    const validWordRefs = exercise.multiClozeText.filter(
                      (wordOrBlank) => {
                        if (
                          'validOptions' in wordOrBlank &&
                          (wordOrBlank as Blank).validOptions.filter(
                            (wordRefOrRefs) => {
                              if (Array.isArray(wordRefOrRefs)) {
                                return (wordRefOrRefs as Array<WordRef>).filter(
                                  (wordRef) => {
                                    if (
                                      Object.keys(wordRef)[0] ===
                                      Content.getWord(wordRef).word
                                    ) {
                                      return true;
                                    } else {
                                      throw new Error(
                                        `Failed when lookup of ${JSON.stringify(
                                          wordRef,
                                        )} resulted in ${JSON.stringify(
                                          Content.getWord(wordRef),
                                        )}`,
                                      );
                                    }
                                  },
                                ).length;
                              } else {
                                if (
                                  Object.keys(wordRefOrRefs)[0] ===
                                  Content.getWord(wordRefOrRefs).word
                                ) {
                                  return true;
                                } else {
                                  throw new Error(
                                    `Failed when lookup of ${JSON.stringify(
                                      wordRefOrRefs,
                                    )} resulted in ${JSON.stringify(
                                      Content.getWord(wordRefOrRefs),
                                    )}`,
                                  );
                                }
                              }
                            },
                          )
                        ) {
                          return true;
                        } else if (
                          Object.keys(wordOrBlank)[0] ===
                          Content.getWord(wordOrBlank as WordRef).word
                        ) {
                          return true;
                        } else {
                          throw new Error(`
                          Failed when lookup of ${JSON.stringify(
                            wordOrBlank,
                          )} resulted in ${JSON.stringify(
                            Content.getWord(wordOrBlank as WordRef),
                          )}
                          `);
                        }
                      },
                    )?.length;
                    expect(validWordRefs).toBe(exercise.multiClozeText.length);
                  }
                }
              });

              it("'suppressClozeAudio' & 'suppressOptionAudio' only in Cloze", () => {
                if (
                  'suppressClozeAudio' in exercise ||
                  'suppressOptionAudio' in exercise
                ) {
                  expect(
                    ['SingleCloze', 'MultiCloze'].includes(exercise.type),
                  ).toBe(true);
                }
              });

              it("'audio' is consistent", () => {
                if ('audio' in exercise) {
                  expect(typeof exercise.audio).toBe('string');
                  expect(exercise.audio?.length).toBeGreaterThan(0);
                  expect(existsSync(`../content/${exercise.audio}`)).toBe(true);
                }
              });

              it("'picture' is consistent", () => {
                if ('picture' in exercise) {
                  expect(typeof exercise.picture).toBe('string');
                  expect(exercise.picture?.length).toBeGreaterThan(0);
                  expect(existsSync(`../content/${exercise.picture}`)).toBe(
                    true,
                  );
                }
              });

              it("'video' is consistent", () => {
                if ('video' in exercise) {
                  expect(typeof exercise.video).toBe('string');
                  expect(exercise.video?.length).toBeGreaterThan(0);
                  expect(existsSync(`../content/${exercise.video}`)).toBe(true);
                }
              });

              it("'symbol' is consistent", () => {
                // verify presence in mdiIcons?
                if ('symbol' in exercise) {
                  expect(typeof exercise.symbol).toBe('object');
                  expect(exercise.symbol?.length).toBeGreaterThan(0);
                  exercise.symbol?.forEach((symbol) => {
                    expect(Content.getIcon(symbol).length).toBeGreaterThan(0);
                  });
                }
              });
            });
          });
        });
      });
    });

    describe('WordSpec integrity', () => {
      it("'wordCount' is consistent", () => {
        expect(Content.WordListSpec.wordCount).toEqual(
          Object.keys(Content.WordListSpec.words).length,
        );
      });
      it("'word', 'audio', 'picture', 'video', 'symbol' are consistent", () => {
        Object.keys(Content.WordListSpec.words).forEach((wordId) => {
          const entry = Content.WordListSpec.words[wordId];

          if ('word' in entry) {
            expect(typeof entry.word).toBe('string');
            expect(entry.word.length).toBeGreaterThan(0);
          } else {
            throw new Error(
              `The WordListSpec in ${Content.ContentSpec.wordSpecFile} has an entry missing the 'word' field (id: ${wordId})`,
            );
          }

          if ('audio' in entry) {
            expect(typeof entry.audio).toBe('string');
            expect(entry.audio?.length).toBeGreaterThan(0);
            const fileExists = existsSync(`../content/${entry.audio}`);
            if (!fileExists) {
              throw new Error(
                `The WordListSpec in ${Content.ContentSpec.wordSpecFile} has an entry with an 'audio' field referencing a file that does not exist (id: ${wordId}, filename: ${entry.audio})`,
              );
            }
            expect(fileExists).toBe(true);
          }

          if ('picture' in entry) {
            expect(typeof entry.picture).toBe('string');
            expect(entry.picture?.length).toBeGreaterThan(0);
            const fileExists = existsSync(`../content/${entry.picture}`);
            if (!fileExists) {
              throw new Error(
                `The WordListSpec in ${Content.ContentSpec.wordSpecFile} has an entry with a 'picture' field referencing a file that does not exist (id: ${wordId}, filename: ${entry.picture})`,
              );
            }
            expect(fileExists).toBe(true);
          }

          if ('video' in entry) {
            expect(typeof entry.video).toBe('string');
            expect(entry.video?.length).toBeGreaterThan(0);
            const fileExists = existsSync(`../content/${entry.video}`);
            if (!fileExists) {
              throw new Error(
                `The WordListSpec in ${Content.ContentSpec.wordSpecFile} has an entry with a 'video' field referencing a file that does not exist (id: ${wordId}, filename: ${entry.video})`,
              );
            }
            expect(fileExists).toBe(true);
          }

          if ('symbol' in entry) {
            expect(typeof entry.symbol).toBe('object');
            expect(entry.symbol?.length).toBeGreaterThan(0);
            entry.symbol?.forEach((symbol) => {
              expect(Content.getIcon(symbol).length).toBeGreaterThan(0);
            });
          }
        });
      });
    });
  });
});
