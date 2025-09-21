/* eslint-disable @typescript-eslint/no-require-imports */
const js = require('@eslint/js');
const { FlatCompat } = require('@eslint/eslintrc');

const compat = new FlatCompat({
  baseDirectory: __dirname,
  recommendedConfig: js.configs.recommended,
});

module.exports = [
  ...compat.config({
    extends: [
      'eslint:recommended',
      'next/core-web-vitals',
      'next/typescript',
      'plugin:prettier/recommended',
    ],
    rules: {
      'no-prototype-builtins': 'off',
      '@typescript-eslint/explicit-member-accessibility': 'error',
    },
  }),
  {
    ignores: ['node_modules/**', '.next/**', 'out/**', 'build/**', 'next-env.d.ts'],
  },
];
