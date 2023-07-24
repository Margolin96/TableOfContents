module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
    jest: true,
  },
  extends: ['react-app'],
  plugins: [
    'react',
    'react-hooks',
  ],
  rules: {
    'linebreak-style': [2, 'unix'],
    'no-console': [1, { allow: ['info', 'error', 'warn'] }],
    'no-nested-ternary': 0,
    'no-unused-vars': 0,
    '@typescript-eslint/no-unused-vars': 1,
    '@typescript-eslint/no-use-before-define': [1, { functions: false, typedefs: false }],
    'no-param-reassign': [2, { props: false }],
    'no-underscore-dangle': 0,
    'padding-line-between-statements': [
      2,
      {
        blankLine: 'always',
        prev: ['const', 'let', 'var'],
        next: '*',
      },
      {
        blankLine: 'any',
        prev: ['const', 'let', 'var'],
        next: ['const', 'let', 'var'],
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'return',
      },
      {
        blankLine: 'always',
        prev: 'directive',
        next: '*',
      },
      {
        blankLine: 'any',
        prev: 'directive',
        next: 'directive',
      },
      {
        blankLine: 'always',
        prev: '*',
        next: 'if',
      },
    ],
    'prefer-destructuring': [2, { AssignmentExpression: { array: false } }],

    'import/no-extraneous-dependencies': [
      2,
      {
        devDependencies: ['**/setupTests.js'],
      },
    ],
    'import/order': [
      2,
      {
        groups: ['builtin', 'external', 'internal', 'parent', 'sibling'],
        'newlines-between': 'always',
        alphabetize: {
          order: 'asc',
          caseInsensitive: true,
        },
      },
    ],
    'import/prefer-default-export': 0,

    'react-hooks/rules-of-hooks': 2,
    'react-hooks/exhaustive-deps': 2,

    'react/forbid-prop-types': 0,
    'react/jsx-curly-newline': 0,
    'react/jsx-fragments': 0,
    'react/jsx-indent': [2, 2],
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-props-no-spreading': 0,
    'react/jsx-sort-props': [
      1,
      {
        callbacksLast: true,
        ignoreCase: true,
        reservedFirst: true,
      },
    ],
    'react/jsx-wrap-multilines': [
      2,
      {
        arrow: 'parens-new-line',
        condition: 'parens-new-line',
        return: 'parens',
      },
    ],
    'react/no-danger': 0,
    'react/no-did-update-set-state': 0,
    'react/require-default-props': 0,
    'react/sort-comp': [
      1,
      {
        order: [
          'static-methods',
          'lifecycle',
          'everything-else',
          '/^on.+$/',
          'rendering',
        ],
        groups: {
          rendering: ['/^render.+$/', 'render'],
        },
      },
    ],
    'react/sort-prop-types': [
      2,
      {
        requiredFirst: true,
        sortShapeProp: true,
        ignoreCase: true,
      },
    ],
  },
};
