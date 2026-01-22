import globals from 'globals';
import tseslint from 'typescript-eslint';
import prettierPlugin from 'eslint-plugin-prettier';
import eslintConfigPrettier from 'eslint-config-prettier';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default tseslint.config(
    {
        ignores: ['.husky/**', '.github/**', 'dist/**', 'docs/**', 'coverage/**', '**/*.config.js', '**/*.config.ts', '**/*.d.ts']
    },
    {
        plugins: {
            prettier: prettierPlugin
        },
        languageOptions: {
            globals: {
                ...globals.node,
                ...globals.jest
            }
        }
    },
    // TS Config
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: [...tseslint.configs.recommended],
        languageOptions: {
            parserOptions: {
                project: ['./tsconfig.json', './__tests__/tsconfig.json', './build/tsconfig.json', './examples/tsconfig.json'],
                tsconfigRootDir: __dirname
            }
        },
        rules: {
            '@typescript-eslint/no-inferrable-types': 'off',
            '@typescript-eslint/explicit-module-boundary-types': 'off',
            '@typescript-eslint/ban-types': 'off',
            '@typescript-eslint/no-explicit-any': 'error',
            '@typescript-eslint/no-unsafe-function-type': 'off',
            '@typescript-eslint/no-empty-object-type': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            '@typescript-eslint/no-unused-expressions': 'off',
            '@typescript-eslint/no-require-imports': 'off'
        }
    },
    // General Rules
    {
        rules: {
            'prettier/prettier': 'error',
            'no-var-require': 'off',
            'no-console': 'off',
            'no-bitwise': 'off',
            quotes: ['error', 'single'],
            'max-len': ['error', 130],
            'arrow-parens': 'off'
        }
    },
    eslintConfigPrettier
);
