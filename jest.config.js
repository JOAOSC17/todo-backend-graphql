module.exports = {
  collectCoverage: true,
  // on node 14.x coverage provider v8 offers good speed and more or less good report
  coverageProvider: 'v8',
  collectCoverageFrom: [
    '<rootDir>/src/**/*.{ts,tsx}'
  ],
  moduleNameMapper: {
  },
  // Add more setup options before each test is run
  testPathIgnorePatterns: ['<rootDir>/node_modules/',],
  testEnvironment: 'node',
  transform: {
    // Use babel-jest to transpile tests with the next/babel preset
    // https://jestjs.io/docs/configuration#transform-objectstring-pathtotransformer--pathtotransformer-object
    '^.+\\.(js|jsx|ts|tsx)$': 'babel-jest'
  },
  transformIgnorePatterns: [
    '/node_modules/',
  ],
}