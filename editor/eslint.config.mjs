import vuePlugin from 'eslint-plugin-vue';
import vueParser from 'vue-eslint-parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      '**/.amplify/',
      '**/.nuxt/',
      '**/.output/',
      '**/coverage/',
      '**/dist/',
      '**/node_modules/',
      '**/.vscode/',
      '**/*.d.ts',
    ],
  },

  // TypeScript recommended (sets TS parser globally + TS rules)
  ...tsPlugin.configs['flat/recommended'],

  // Vue recommended (overrides parser for .vue files + Vue rules)
  ...vuePlugin.configs['flat/recommended'],

  // Configure vue-eslint-parser to use TS parser for <script> blocks
  {
    files: ['**/*.vue'],
    languageOptions: {
      parser: vueParser,
      parserOptions: {
        parser: tsParser,
        ecmaVersion: 2022,
        sourceType: 'module',
      },
    },
  },

  // Disable style rules that conflict with Prettier
  prettierConfig,

  // Run Prettier as a lint rule
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },

  // Project rules
  {
    files: [
      '**/*.vue',
      '**/*.ts',
      '**/*.js',
      '**/*.cjs',
      '**/*.mjs',
      '**/*.tsx',
      '**/*.jsx',
    ],
    rules: {
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-debugger': 'error',
    },
  },

  // Pages and layouts don't need multi-word component names (they are routes)
  {
    files: ['pages/**/*.vue', 'layouts/**/*.vue'],
    rules: {
      'vue/multi-word-component-names': 'off',
    },
  },
];
