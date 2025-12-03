import { defineConfig, globalIgnores } from 'eslint/config';
import nextVitals from 'eslint-config-next/core-web-vitals';

const eslintConfig = defineConfig([
  ...nextVitals,
  prettier,
  {
    rules: {
      'prefer-arrow-callback': 'error',
      'arrow-body-style': ['error', 'as-needed'],
      'prefer-template': 'error',
      'space-infix-ops': 'error',
      'object-curly-spacing': ['error', 'always'],
      'space-before-blocks': 'error',
      'arrow-spacing': ['error', { before: true, after: true }],
      quotes: ['error', 'single', { avoidEscape: true, allowTemplateLiterals: true }],
      semi: ['error', 'always'],
      'padding-line-between-statements': [
        'error',
        {
          blankLine: 'always',
          prev: '*',
          next: 'return',
        },
      ],
    },
  },
  globalIgnores(['.next/**', 'out/**', 'build/**', 'next-env.d.ts']),
]);

export default eslintConfig;
