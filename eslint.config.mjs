import globals from 'globals';

export default [
  { ignores: ['dist/**', 'coverage/**', 'playwright-report/**', 'test-results/**'] },
  {
    files: ['app.js', 'src/**/*.mjs'],
    languageOptions: { globals: globals.browser, ecmaVersion: 'latest' },
    rules: {
      'no-undef': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-unreachable': 'error',
      'no-dupe-keys': 'error',
    },
  },
  {
    files: ['sw.js'],
    languageOptions: { globals: globals.serviceworker, ecmaVersion: 'latest' },
    rules: { 'no-undef': 'error', 'no-unreachable': 'error' },
  },
  {
    files: ['tests/**/*.mjs', 'tests/**/*.cjs', 'scripts/**/*.mjs', '*.config.mjs'],
    languageOptions: { globals: { ...globals.node, ...globals.browser }, ecmaVersion: 'latest' },
    rules: { 'no-undef': 'error', 'no-unreachable': 'error' },
  },
];
