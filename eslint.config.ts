import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import { defineConfig } from 'eslint/config';
import prettier from 'eslint-config-prettier';

export default defineConfig([
  prettier,
  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts}'],
    plugins: { js },
    extends: ['js/recommended'],
    languageOptions: { globals: globals.node },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
    },
    ignores: ['dist/**', 'node_modules/**', 'data/**'],
  },
  tseslint.configs.recommended,
]);
