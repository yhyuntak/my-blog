import js from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  // Base configs
  js.configs.recommended,
  ...tseslint.configs.recommended,

  // NestJS-specific config
  {
    files: ['**/*.ts'],
    rules: {
      // TypeScript-specific
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/explicit-function-return-type': 'off',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],

      // General
      'no-console': 'warn',
      'prefer-const': 'error',
    },
  },

  // Ignore patterns
  {
    ignores: ['dist', 'node_modules', '*.config.js', 'prisma'],
  }
)
