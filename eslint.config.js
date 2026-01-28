import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import pluginPrettier from 'eslint-plugin-prettier';
import pluginReact from 'eslint-plugin-react';
import pluginReactHooks from 'eslint-plugin-react-hooks';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '*.cjs',
      '*.mjs',
      '*.js',
      'v2-incompatible.js',
      'commitlint.config.js',
      'lint-staged.config.js',
      'package.config.ts',
    ],
  },

  // Base JS recommended rules
  js.configs.recommended,

  // TypeScript recommended rules
  ...tseslint.configs.recommended,

  // React configuration
  {
    files: ['**/*.{ts,tsx}'],
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      prettier: pluginPrettier,
    },
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      // React rules
      ...pluginReact.configs.recommended.rules,
      ...pluginReact.configs['jsx-runtime'].rules,
      'react/prop-types': 'off',
      'react/require-default-props': 'off',
      'react/jsx-no-bind': 'off',

      // React Hooks rules
      ...pluginReactHooks.configs.recommended.rules,

      // TypeScript rules
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],

      // General rules
      'no-use-before-define': 'off',
      'no-shadow': 'off',
      'consistent-return': 'off',
      'no-negated-condition': 'off',
      'no-unused-expressions': 'off',

      // Prettier
      'prettier/prettier': 'error',
    },
  },

  // Prettier config (disables conflicting rules)
  prettier,
);
