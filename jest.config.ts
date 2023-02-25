import type { Config } from '@jest/types';

export default async (): Promise<Config.InitialOptions> => {
  return {
    preset: 'ts-jest',
    testEnvironment: 'node',
    testEnvironmentOptions: {
      NODE_ENV: 'test'
    },
    moduleFileExtensions: ['ts', 'js'],
    moduleNameMapper: {
      '^@/(.*)$': '<rootDir>/src/$1'
    },
    setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
    detectOpenHandles: true
  };
};
