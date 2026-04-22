import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import guardian from '@guardian/eslint-config';
import prettierPlugin from 'eslint-plugin-prettier/recommended';
import globals from 'globals';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default [
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
      'eslint.config.mjs',
    ],
  },
  ...guardian.configs.recommended,
  ...guardian.configs.react,
  ...guardian.configs.jest,
  prettierPlugin,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node,
      },
      parserOptions: {
        tsconfigRootDir,
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
