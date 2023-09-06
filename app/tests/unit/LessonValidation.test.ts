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
        expect(lesson.comprehensionCount).toBeGreaterThanOrEqual(0);
        if (lesson.wordsExercisedCount) {
          expect(lesson.wordsExercisedCount).toBeGreaterThanOrEqual(0);
        }
        lesson.exercises.forEach((exercise) => {
          try {
            expect(exercise.id.length).toBeGreaterThanOrEqual(1);
            expect(exercise.type.length).toBeGreaterThanOrEqual(0);
            if (exercise.type === 'MultipleChoice') {
              expect(exercise.multipleChoiceWords?.length).toBeGreaterThan(1);
            } else if (exercise.type === 'Matching') {
              expect(exercise.matchingWords?.length).toBeGreaterThan(1);
            } else if (exercise.type === 'Explanation') {
              expect(
                exercise.explanationSpec?.explanation?.length,
              ).toBeGreaterThan(0);
              expect(
                exercise.explanationSpec?.explanation?.filter(
                  (wordRef) => wordRef[Object.keys(wordRef)[0]].length > 0,
                ).length === exercise.explanationSpec?.explanation?.length,
              ).toBe(true);
              expect(!!exercise.explanationSpec?.explanationTargets).toBe(true);
              if (exercise.explanationSpec?.explanationTargets) {
                expect(
                  exercise.explanationSpec?.explanationTargets.validOption[
                    Object.keys(
                      exercise.explanationSpec?.explanationTargets.validOption,
                    )[0]
                  ].length,
                ).toBeGreaterThan(0);
                expect(
                  exercise.explanationSpec?.explanationTargets.invalidOptions
                    .length,
                ).toBeGreaterThan(1);
              }
              try {
                expect(Object.hasOwn(exercise, 'explanation')).toBe(false);
              } catch (e) {
                throw new Error(
                  `Lesson ${lesson.lessonIndex} exercise "${exercise.id}" uses a deprecated 'explanation' field; use 'explanationSpec' instead.\n${e}`,
                );
              }
            } else if (exercise.type === 'SingleCloze') {
              expect(exercise.singleClozeSpec).not.toBeUndefined();
              if (exercise.singleClozeSpec) {
                expect(exercise.singleClozeSpec.text?.length).toBeGreaterThan(
                  1,
                );
                // at least one blank
                expect(
                  exercise.singleClozeSpec.text?.filter(
                    (word) => 'validOptions' in word,
                  ).length,
                ).toBeGreaterThan(0);
                if ('suppressClozeAudio' in exercise.singleClozeSpec) {
                  expect(
                    typeof exercise.singleClozeSpec.suppressClozeAudio,
                  ).toBe('boolean');
                }
                if ('suppressOptionAudio' in exercise.singleClozeSpec) {
                  expect(
                    typeof exercise.singleClozeSpec.suppressOptionAudio,
                  ).toBe('boolean');
                }
              }
            } else if (exercise.type === 'MultiCloze') {
              expect(exercise.multiClozeSpec).not.toBeUndefined();
              if (exercise.multiClozeSpec) {
                expect(exercise.multiClozeSpec.text?.length).toBeGreaterThan(1);
                // at least one blank
                expect(
                  exercise.multiClozeSpec.text?.filter(
                    (word) => 'validOptions' in word,
                  ).length,
                ).toBeGreaterThan(0);
                if ('suppressClozeAudio' in exercise.multiClozeSpec) {
                  expect(
                    typeof exercise.multiClozeSpec.suppressClozeAudio,
                  ).toBe('boolean');
                }
                if ('suppressOptionAudio' in exercise.multiClozeSpec) {
                  expect(
                    typeof exercise.multiClozeSpec.suppressOptionAudio,
                  ).toBe('boolean');
                }
              }
            } else if (exercise.type === 'Comprehension') {
              expect(exercise.comprehensionSpec?.text.length).toBeGreaterThan(
                1,
              );
            } else {
              throw new Error(
                `Lesson ${lesson.lessonIndex} has an invalid 'type' field at exercise "${exercise.id}"`,
              );
            }

            if ('audio' in exercise) {
              throw new Error(
                `Lesson ${lesson.lessonIndex} exercise "${exercise.id}" uses a deprecated 'audio' field; as of formatVersion 1.2.0, 'audio' is no longer a top-level field in 'exercises'. 'audio' is now either a field under 'words' in 'WordSpec', or a field under 'explanationSpec'.`,
              );
            }
            if ('picture' in exercise) {
              throw new Error(
                `Lesson ${lesson.lessonIndex} exercise "${exercise.id}" uses a deprecated 'picture' field; as of formatVersion 1.2.0, 'picture' is no longer a top-level field in 'exercises'. 'picture' is now a field under 'words' in 'WordSpec'.`,
              );
            }
            if ('video' in exercise) {
              throw new Error(
                `Lesson ${lesson.lessonIndex} exercise "${exercise.id}" uses a deprecated 'video' field; as of formatVersion 1.2.0, 'video' is no longer a top-level field in 'exercises'. 'video' is now a field under 'words' in 'WordSpec'.`,
              );
            }
            if ('symbol' in exercise) {
              throw new Error(
                `Lesson ${lesson.lessonIndex} exercise "${exercise.id}" uses a deprecated 'symbol' field; as of formatVersion 1.2.0, 'symbol' is no longer a top-level field in 'exercises'. 'symbol' is now a field under 'words' in 'WordSpec'.`,
              );
            }
            if ('suppressClozeAudio' in exercise) {
              throw new Error(
                `Lesson ${lesson.lessonIndex} exercise "${exercise.id}" uses a deprecated 'suppressClozeAudio' field; as of formatVersion 1.2.0, 'suppressClozeAudio' is no longer a top-level field in 'exercises'. 'suppressClozeAudio' is now a field under 'singleClozeSpec' and 'multiClozeSpec'.`,
              );
            }
            if ('suppressOptionAudio' in exercise) {
              throw new Error(
                `Lesson ${lesson.lessonIndex} exercise "${exercise.id}" uses a deprecated 'suppressOptionAudio' field; as of formatVersion 1.2.0, 'suppressOptionAudio' is no longer a top-level field in 'exercises'. 'suppressOptionAudio' is now a field under 'singleClozeSpec' and 'multiClozeSpec'.`,
              );
            }
          } catch (e) {
            throw new Error(
              `Lesson ${lesson.lessonIndex} has an error at exercise "${exercise.id}"\n${e}`,
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
              multipleChoiceCount = exercise.multipleChoiceWords?.length || 0;
            }
          });
          expect(multipleChoiceCount).toBe(lesson.multipleChoiceCount);
        });

        it(`lesson.${lesson.lessonIndex}.matchingCount=${lesson.matchingCount} is accurate`, () => {
          let matchingCount = 0;
          lesson.exercises.forEach((exercise) => {
            if (exercise.type === 'Matching') {
              matchingCount = exercise.matchingWords?.length || 0;
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
                !exercise.singleClozeSpec?.text ||
                exercise.singleClozeSpec?.text.length < 1
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
                !exercise.multiClozeSpec?.text ||
                exercise.multiClozeSpec?.text.length < 2
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
              const words =
                exercise.multipleChoiceWords || exercise.matchingWords || [];
              words.forEach((wordRef) => {
                if (!wordsExercised.has(Object.values(wordRef)[0])) {
                  wordsExercised.add(Object.values(wordRef)[0]);
                }
              });
            }
            if (exercise.type === 'Explanation') {
              if (exercise.explanationSpec?.explanationTargets) {
                if (
                  !wordsExercised.has(
                    Object.values(
                      exercise.explanationSpec?.explanationTargets.validOption,
                    )[0],
                  )
                ) {
                  wordsExercised.add(
                    Object.values(
                      exercise.explanationSpec?.explanationTargets.validOption,
                    )[0],
                  );
                }
              }
            }
            if (
              exercise.type === 'SingleCloze' &&
              exercise.singleClozeSpec?.text
            ) {
              exercise.singleClozeSpec.text
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
            if (
              exercise.type === 'MultiCloze' &&
              exercise.multiClozeSpec?.text
            ) {
              exercise.multiClozeSpec.text
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
                    'Comprehension',
                  ].includes(exercise.type),
                ).toBe(true);
              });

              it("'multipleChoiceWords' references exist in WordSpec", () => {
                if (exercise.type === 'MultipleChoice') {
                  expect(!!exercise.multipleChoiceWords).toBe(true);
                  if (exercise.multipleChoiceWords) {
                    expect(exercise.multipleChoiceWords.length).toBeGreaterThan(
                      1,
                    );
                    exercise.multipleChoiceWords.forEach((wordRef) => {
                      expect(
                        Content.getWord(wordRef).word.length,
                      ).toBeGreaterThan(0);
                    });
                  }
                }
              });

              it("'matchingWords' references exist in WordSpec", () => {
                if (exercise.type === 'Matching') {
                  expect(!!exercise.matchingWords).toBe(true);
                  if (exercise.matchingWords) {
                    expect(exercise.matchingWords.length).toBeGreaterThan(1);
                    exercise.matchingWords.forEach((wordRef) => {
                      expect(
                        Content.getWord(wordRef).word.length,
                      ).toBeGreaterThan(0);
                    });
                  }
                }
              });

              it("'explanationSpec''s 'explanation' & 'explanationTargets' is consistent", () => {
                if (exercise.type === 'Explanation') {
                  expect(
                    !!exercise.explanationSpec?.explanation &&
                      !!exercise.explanationSpec?.explanationTargets,
                  ).toBe(true);
                  if (
                    exercise.explanationSpec?.explanation &&
                    exercise.explanationSpec?.explanationTargets
                  ) {
                    expect(
                      exercise.explanationSpec?.explanation.length,
                    ).toBeGreaterThan(0);
                    // every wordRef in explanation is found in WordSpec
                    expect(
                      exercise.explanationSpec?.explanation.filter(
                        (wordRef) => Content.getWord(wordRef).word.length > 0,
                      ).length,
                    ).toBe(exercise.explanationSpec?.explanation.length);

                    expect(
                      Object.keys(
                        exercise.explanationSpec?.explanationTargets
                          .validOption,
                      ).length,
                    ).toBe(1);
                    // explanationTargets.validOption is found in WordSpec
                    expect(
                      Content.getWord(
                        exercise.explanationSpec?.explanationTargets
                          .validOption,
                      ).word.length,
                    ).toBeGreaterThan(0);

                    // explanationTargets.invalidOptions are found in WordSpec
                    expect(
                      exercise.explanationSpec?.explanationTargets.invalidOptions.filter(
                        (wordRef) => Content.getWord(wordRef).word.length > 0,
                      ).length,
                    ).toBeGreaterThan(0);
                  }
                }
              });

              it("'singleClozeText' is consistent", () => {
                if (exercise.type === 'SingleCloze') {
                  expect(
                    exercise.singleClozeSpec?.text?.length,
                  ).toBeGreaterThan(1);
                  if (exercise.singleClozeSpec?.text) {
                    const blankCount = exercise.singleClozeSpec.text.filter(
                      (wordOrBlank) => 'validOptions' in wordOrBlank,
                    )?.length;
                    expect(blankCount).toBeGreaterThan(0);
                    expect(
                      exercise.singleClozeSpec.text.length - blankCount,
                    ).toBeGreaterThan(0);
                    const validWordRefs = exercise.singleClozeSpec.text.filter(
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
                    expect(validWordRefs).toBe(
                      exercise.singleClozeSpec.text.length,
                    );
                  }
                }
              });

              it("'multiClozeText' is consistent", () => {
                if (exercise.type === 'MultiCloze') {
                  expect(exercise.multiClozeSpec?.text?.length).toBeGreaterThan(
                    1,
                  );
                  if (exercise.multiClozeSpec?.text) {
                    const blankCount = exercise.multiClozeSpec.text.filter(
                      (wordOrBlank) => 'validOptions' in wordOrBlank,
                    )?.length;
                    expect(blankCount).toBeGreaterThan(0);
                    expect(
                      exercise.multiClozeSpec.text.length - blankCount,
                    ).toBeGreaterThan(0);

                    const validWordRefs = exercise.multiClozeSpec.text.filter(
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
                    expect(validWordRefs).toBe(
                      exercise.multiClozeSpec.text.length,
                    );
                  }
                }
              });

              it.skip("'comprehension' is consistent", () => {
                if (exercise.type === 'Comprehension') {
                  expect(true).toBe(false);
                }
              });

              it("'audio' is consistent", () => {
                if (
                  exercise.explanationSpec &&
                  'audio' in exercise.explanationSpec
                ) {
                  expect(typeof exercise.explanationSpec.audio).toBe('string');
                  expect(
                    exercise.explanationSpec.audio?.length,
                  ).toBeGreaterThan(0);
                  expect(
                    existsSync(`../content/${exercise.explanationSpec.audio}`),
                  ).toBe(true);
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
              `The WordListSpec in "${Content.ContentSpec.wordSpecFile}" has an entry missing the 'word' field (id: "${wordId}")`,
            );
          }

          if ('audio' in entry) {
            expect(typeof entry.audio).toBe('string');
            expect(entry.audio?.length).toBeGreaterThan(0);
            const fileExists = existsSync(`../content/${entry.audio}`);
            if (!fileExists) {
              throw new Error(
                `The WordListSpec in "${Content.ContentSpec.wordSpecFile}" has an entry with an 'audio' field referencing a file that does not exist (id: "${wordId}", filename: "${entry.audio}")`,
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
                `The WordListSpec in "${Content.ContentSpec.wordSpecFile}" has an entry with a 'picture' field referencing a file that does not exist (id: "${wordId}", filename: "${entry.picture}")`,
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
                `The WordListSpec in "${Content.ContentSpec.wordSpecFile}" has an entry with a 'video' field referencing a file that does not exist (id: "${wordId}", filename: "${entry.video}")`,
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
