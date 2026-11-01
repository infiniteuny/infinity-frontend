/* eslint-disable @typescript-eslint/no-require-imports */
const { defineConfig } = require('eslint/config');
const nextCoreWebVitals = require('eslint-config-next/core-web-vitals');
const baseConfig = require('../../eslint.config.js');

module.exports = defineConfig([...nextCoreWebVitals, ...baseConfig]);
