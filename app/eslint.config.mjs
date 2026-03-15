import pluginVue from 'eslint-plugin-vue';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import prettierPlugin from 'eslint-plugin-prettier';

export default [
  {
    ignores: [
      '**/android/',
      '**/coverage/',
      '**/dist/',
      '**/node_modules/',
      '**/.vscode/',
      '**/*.d.ts',
    ],
  },
  // Vue 3 recommended flat config (sets vue-eslint-parser for .vue files)
  ...pluginVue.configs['flat/recommended'],
  // TypeScript ESLint rules for .ts/.tsx files
  {
    files: ['**/*.ts', '**/*.tsx', '**/*.mts', '**/*.cts'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 2023,
      sourceType: 'module',
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  // TypeScript parser inside .vue files
  {
    files: ['**/*.vue'],
    plugins: { '@typescript-eslint': tsPlugin },
    languageOptions: {
      ecmaVersion: 2023,
      sourceType: 'module',
      parserOptions: {
        parser: tsParser,
      },
    },
    rules: {
      ...tsPlugin.configs.recommended.rules,
    },
  },
  // Custom rules for all JS/TS/Vue files
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
  // Prettier - disable rules that conflict with prettier formatting
  prettierConfig,
  // Prettier plugin to report formatting as lint errors
  {
    plugins: { prettier: prettierPlugin },
    rules: {
      'prettier/prettier': 'error',
      'arrow-body-style': 'off',
      'prefer-arrow-callback': 'off',
    },
  },
];
