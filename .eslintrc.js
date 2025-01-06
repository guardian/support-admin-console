module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'plugin:@typescript-eslint/recommended',
    'plugin:react/recommended',
    'plugin:prettier/recommended',
  ],
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true, // Allows for the parsing of JSX
    },
  },
  rules: {
    // Place to specify ESLint rules. Can be used to overwrite rules specified from the extended configs
    // e.g. "@typescript-eslint/explicit-function-return-type": "off",
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
    '@typescript-eslint/no-unnecessary-type-constraint': 'off', // added in version 8.0.0 - for discussion
    'react/display-name': 'off', // added in version 8 - for discussion.
  },
  settings: {
    react: {
      version: 'detect',
    },
  },
};
