import { defineStorage } from '@aws-amplify/backend';

export const storage = defineStorage({
  name: 'SeedlingoApiaryStorage',
  isDefault: true,
  access: (allow) => ({
    'word-pictures/{entity_id}/*': [allow.entity('identity').to(['read', 'write', 'delete'])],
    'word-audio/{entity_id}/*': [allow.entity('identity').to(['read', 'write', 'delete'])],
  }),
});
