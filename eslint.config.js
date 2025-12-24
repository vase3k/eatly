import js from '@eslint/js';
import globals from 'globals';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  //helper function
  {
    rules: {
      'no-unused-vars': 'off', //skip unused vars
    },
    files: ['**/*.{js,mjs,cjs,jsx}'], //what folder to verify
    plugins: { js }, // register plugin js
    extends: ['js/recommended'], //apply recommended rules for js plugin
    languageOptions: {
      globals: {
        ...globals.browser, //globals for browser, example DOM
        ...globals.node, //globals for node.js example fs
      },
    },
  },
  prettier, //disable conflicts with prettier plugin
]);
