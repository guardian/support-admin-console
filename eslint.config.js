const js = require('@eslint/js');
const tseslint = require('typescript-eslint');
const reactPlugin = require('eslint-plugin-react');
const prettierConfig = require('eslint-config-prettier');

module.exports = [
  {
    ignores: [
      'cdk/',
      'target/',
      'logs/',
      'public/build/',
      'node_modules/',
      '.idea',
      '.vscode',
      '.DS_Store',
      '.bloop/',
      '.metals/',
      '.bsp/',
      'project',
      'scripts/',
      'webpack.*.js',
      'jest.config.js',
      '.prettierrc.js',
      'eslint.config.js',
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  reactPlugin.configs.flat.recommended,
  prettierConfig,
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      parser: tseslint.parser,
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
      },
      globals: {
        ...tseslint.configs.recommended[0].languageOptions?.globals,
      },
    },
    settings: {
      react: {
        version: 'detect',
      },
    },
    rules: {
      curly: 2,
      '@typescript-eslint/no-inferrable-types': [
        'error',
        {
          ignoreParameters: true,
        },
      ],
      '@typescript-eslint/no-unused-vars': [
        'error',
        {
          args: 'after-used',
        },
      ],
      '@typescript-eslint/ban-ts-comment': 'off',
      '@typescript-eslint/no-unnecessary-type-constraint': 'off',
      'react/display-name': 'off',
    },
  },
];
