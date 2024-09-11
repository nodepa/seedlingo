import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a
  .schema({
    ContentSpec: a.model({
      instructionCollection: a.hasOne('InstructionCollection', 'contentSpecId'),
      units: a.hasMany('Unit', 'contentSpecId'),
      wordList: a.hasOne('WordList', 'contentSpecId'),
    }),
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
      contentSpecId: a.id(),
      contentSpec: a.belongsTo('ContentSpec', 'contentSpecId'),
      name: a.string(),
      icon: a.string(),
      introductionAudio: a.string(),
      unitSpecFile: a.string(), // ref UnitSpec model
    }),
    WordList: a.model({
      contentSpecId: a.id(),
      contentSpec: a.belongsTo('ContentSpec', 'contentSpecId'),
      wordCount: a.integer().required(),
      words: a.hasMany('Word', 'wordId'),
    }),
    Word: a.model({
      wordListId: a.id(),
      wordList: a.belongsTo('WordList', 'wordListId'),
      word: a.string().required(),
      audio: a.string(),
      picture: a.string(),
      symbol: a.string().array(),
      isPunctuation: a.boolean(),
    }),
  })
  .authorization((allow) => [allow.guest()]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'iam',
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
