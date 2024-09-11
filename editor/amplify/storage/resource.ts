import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'SeedlingoApiaryStorage',
  access: (allow) => ({
    // 'word-pictures/{entity_id}/*': [allow.authenticated.to(['read', 'write', 'delete'])],
    'word-pictures/{entity_id}/*': [allow.entity('identity').to(['read', 'write', 'delete'])],
    'word-audio/{entity_id}/*': [allow.entity('identity').to(['read', 'write', 'delete'])],
    'dump/*': [allow.authenticated.to(['read', 'write', 'delete'])],
  }),
});
