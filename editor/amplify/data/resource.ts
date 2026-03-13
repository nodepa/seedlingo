import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a
  .schema({
    InstructionCollection: a.model({
      contentSpecId: a.id(),
      contentSpec: a.belongsTo('ContentSpec', 'contentSpecId'),
      welcome: a.string(),
      homeButton: a.string(),
      continueButton: a.string(),
      toggleInstructionsButton: a.string(),
      matchingExercise: a.string(),
      multipleChoiceExercise: a.string(),
      singleClozeExercise: a.string(),
      multiClozeExercise: a.string(),
    }),
    Unit: a.model({
      name: a.string(),
      description: a.string(),
      icon: a.string(),
      introductionAudio: a.string(),
      contentSpecId: a.id(),
      contentSpec: a.belongsTo('ContentSpec', 'contentSpecId'),
      unitSpecFile: a.string(), // ref UnitSpec model
      words: a.hasMany('Word', 'unitId'),
    }),

    Word: a.model({
      word: a.string().required(),
      description: a.string(),
      audio: a.string(),
      picture: a.string(),
      symbol: a.string().array(),
      isPunctuation: a.boolean(),
      wordListId: a.id(),
      wordList: a.belongsTo('WordList', 'wordListId'),
      unitId: a.id(),
      unit: a.belongsTo('Unit', 'unitId'),
      wordTags: a.hasMany('WordTag', 'wordId'),
    }),
    Tag: a.model({
      name: a.string().required(),
      wordTags: a.hasMany('WordTag', 'tagId'),
    }),
    WordTag: a.model({
      wordId: a.id().required(),
      word: a.belongsTo('Word', 'wordId'),
      tagId: a.id().required(),
      tag: a.belongsTo('Tag', 'tagId'),
    }),
    WordList: a.model({
      contentSpecId: a.id(),
      contentSpec: a.belongsTo('ContentSpec', 'contentSpecId'),
      wordCount: a.integer().required(),
      words: a.hasMany('Word', 'wordListId'),
    }),
    ContentSpec: a.model({
      name: a.string().required(),
      description: a.string(),
      icon: a.string(),
      instructionCollection: a.hasOne('InstructionCollection', 'contentSpecId'),
      units: a.hasMany('Unit', 'contentSpecId'),
      wordList: a.hasOne('WordList', 'contentSpecId'),
    }),
  })
  .authorization((allow) => [allow.authenticated()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});
