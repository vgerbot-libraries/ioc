/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
    verbose: true,
    transform: {
        '\\.tsx?$': [
            'ts-jest',
            {
                tsconfig: './__tests__/tsconfig.json'
            }
        ]
    },
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
