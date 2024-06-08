// jest.config.ts
import type { Config } from '@jest/types';
import path from 'path'; // Import path module to handle file paths

const config: Config.InitialOptions = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: path.resolve(__dirname, '../src'), // Set the root directory to the 'src' directory
  testMatch: ['<rootDir>/__tests__/**/*.ts'], // Adjust the path to match your directory structure
  transform: {
    '^.+\\.tsx?$': 'ts-jest',
  },
  verbose: true,
};

export default config;
