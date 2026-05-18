import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import eslintPluginAstro from 'eslint-plugin-astro';

export default tseslint.config(
  // 1. Core ESLint recommended configuration
  js.configs.recommended,

  // 2. TypeScript-ESLint recommended configuration
  ...tseslint.configs.recommended,

  // 3. Astro recommended configuration
  ...eslintPluginAstro.configs.recommended,

  // 4. Custom overrides for .astro files to ensure TypeScript parsing works
  {
    files: ['**/*.astro'],
    languageOptions: {
      parserOptions: {
        parser: tseslint.parser,
        extraFileExtensions: ['.astro'],
      },
    },
  },

  // 5. Custom Rules / Overrides
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-non-null-asserted-optional-chain': 'warn',
      'no-useless-assignment': 'warn',
      'prefer-const': 'warn',
    },
  },

  // 6. Global Ignores
  {
    ignores: ['.astro/', 'dist/', 'node_modules/', '.vercel/', 'public/', 'pnpm-lock.yaml'],
  }
);
