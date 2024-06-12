// jest.config.ts
import type { Config } from '@jest/types';
import path from 'path'; // Import path module to handle file paths

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname, '../src'), 
  testMatch: ['<rootDir>/__tests__/**/*.ts'], 
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  collectCoverage: true,
  verbose: true,
};

export default config;
