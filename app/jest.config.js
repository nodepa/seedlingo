module.exports = {
  preset: '@vue/cli-plugin-unit-jest/presets/typescript-and-babel',
  moduleFileExtensions: [
    'js',
    'jsx',
    'json',
    'vue',
    'ts',
    'tsx',
    'mjs',
    'cjs',
    'scss',
  ],
  moduleNameMapper: {
    '\\.mp3.audio$': '<rootDir>/tests/unit/__mocks__/mp3AudioMock.js',
    '@content/(.*)': '<rootDir>/../content/$1',
  },
  setupFilesAfterEnv: ['./tests/unit/jest.setup.js'],
  testMatch: ['**/?(*.)+(test).ts'],
  transform: { '^.*\\.[mc]js$': 'babel-jest' },
  transformIgnorePatterns: [
    '<rootDir>/node_modules/(?!vuetify|@ionic/vue|@ionic/vue-router|@ionic/core|@stencil/core|ionicons)',
  ],
};
