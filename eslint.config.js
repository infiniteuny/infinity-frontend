/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig, globalIgnores } = require('eslint/config');
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const nextTs = require('eslint-config-next/typescript');
const prettierRecommended = require('eslint-plugin-prettier/recommended');
const typescriptEslintPlugin = require('@typescript-eslint/eslint-plugin');

module.exports = defineConfig([
  ...nextCoreWebVitals,
  ...nextTs,
  prettierRecommended,
  {
    files: ['**/*.ts', '**/*.tsx'],
    plugins: {
      '@typescript-eslint': typescriptEslintPlugin,
    },
    rules: {
      'no-prototype-builtins': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'error',
    },
  },
  globalIgnores(['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);
