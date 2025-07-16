// eslint.config.js
import tsParser from '@typescript-eslint/parser'
import tsPlugin from '@typescript-eslint/eslint-plugin'
import reactPlugin from 'eslint-plugin-react'

export default [
  // 1) Ignore build/artifact directories
  { ignores: ['node_modules/**', 'dist/**', 'build/**'] },

  // 2) Apply all rules only to your TS/JSX sources
  {
files: ['src/**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
        ecmaFeatures: { jsx: true }
      }
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
      react: reactPlugin
    },
    settings: {
      react: { version: 'detect' }
    },
    rules: {
      // enable the recommended sets
      ...tsPlugin.configs.recommended.rules,
      ...reactPlugin.configs.recommended.rules
    }
  }
]

