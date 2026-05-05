module.exports = {
  preset: 'react-native',
  clearMocks: true,
  restoreMocks: true,
  coverageThreshold: {
    global: {
      statements: 80,
      branches: 80,
      functions: 80,
      lines: 80,
    },
  },
  transformIgnorePatterns: [
    '/node_modules/(?!((jest-)?react-native|@react-native(-community)?|@notifee)|react-clone-referenced-element|react-navigation|@react-navigation/.*)',
  ],
  collectCoverageFrom: [
    'src/components/**/*.{ts,tsx}',
    'src/hooks/**/*.{ts,tsx}',
    'src/services/**/*.{ts,tsx}',
    'src/utils/**/*.{ts,tsx}',
    '!**/*.stories.{ts,tsx}',
    '!src/services/firebase/**',
    '!src/components/index.ts',
    '!src/components/ui/index.ts',
    '!src/components/ui/ProductList/index.ts',
    '!src/services/notifications/index.ts',
    '!**/*.style.ts',
  ],
  moduleDirectories: [
    'node_modules',
    // add the directory with the test-utils.js file, for example:
    'utils', // a utility folder
    __dirname, // the root directory
  ],
  setupFilesAfterEnv: ['./jest-setup.ts'],
  coveragePathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/hooks/useCart\\.ts',
    '<rootDir>/src/hooks/useWishlist\\.ts',
  ],
};
