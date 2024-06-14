import type { Config } from '@jest/types';
import path from 'path';

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname, '../src'), 
  testPathIgnorePatterns: [
    "/fakes/"
  ],
  testMatch: ['<rootDir>/__tests__/**/*.ts'], 
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  verbose: true,
};

export default config;
