import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import guardian from '@guardian/eslint-config';
import globals from 'globals';

const tsconfigRootDir = dirname(fileURLToPath(import.meta.url));

export default [
  {
    ignores: ['node_modules', 'cdk.out', 'eslint.config.mjs', 'jest.config.js'],
  },
  ...guardian.configs.recommended,
  ...guardian.configs.jest,
  {
    languageOptions: {
      globals: {
        ...globals.node,
      },
      parserOptions: {
        projectService: {
          defaultProject: './tsconfig.eslint.json',
          allowDefaultProject: ['lib/*.test.ts'],
        },
        tsconfigRootDir,
      },
    },
    rules: {
      '@typescript-eslint/no-inferrable-types': 'off',
      'import/no-namespace': 'error',
    },
  },
];
