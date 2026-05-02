/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    verbose: true,
    transform: {
        '\\.[tj]sx?$': ['ts-jest', { tsconfig: './__tests__/tsconfig.json' }]
    },
    moduleNameMapper: {
        '^@vgerbot/lazily$': '<rootDir>/node_modules/@vgerbot/lazily/dist/index.esm.js'
    },
    transformIgnorePatterns: ['/node_modules/(?!.*@vgerbot[/+]lazily)'],
    testEnvironment: 'node', // dom
    testMatch: ['**/__tests__/**/*.spec.ts'],
    moduleFileExtensions: ['ts', 'js'],
    collectCoverage: process.env.DEBUG !== 'true',
    collectCoverageFrom: ['src/**/*.ts', '!**/node_modules/**/*', '!__tests__/**/*', '!src/types/*.ts'],
    coverageDirectory: './report/coverage',
    coverageReporters: ['cobertura', 'html', 'text-summary'],
    reporters: [
        'default',
        [
            'jest-html-reporter',
            {
                pageTitle: 'Test Report',
                outputPath: './report/test-report.html'
            }
        ]
    ]
};
