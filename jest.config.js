/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  testEnvironmentOptions: {
    NODE_ENV: 'test'
  },
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '@config/(.*)': '<rootDir>/src/config/$1',
    '@utils/(.*)': '<rootDir>/src/utils/$1',
    '@interfaces/(.*)': '<rootDir>/src/interfaces/$1',
    '@routes/(.*)': '<rootDir>/src/routes/$1',
    '@controllers/(.*)': '<rootDir>/src/controllers/$1',
    '@services/(.*)': '<rootDir>/src/services/$1'
  }
};
