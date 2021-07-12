module.exports = {
    preset: 'ts-jest',
    transform: {
        '^.+\\.(ts|tsx)?$': 'ts-jest',
        "^.+\\.(js|jsx)$": "babel-jest",
    },
    collectCoverageFrom: ["src/**/*.{ts,tsx,ts,jsx,mjs}"],
    testMatch: ["<rootDir>/src/**/tests/**/*.{ts,tsx,ts,jsx,mjs}", "<rootDir>/src/**/?(*.)(spec|tests).{ts,tsx,ts,jsx,mjs}}"],
    transformIgnorePatterns: ["[/\\\\]node_modules[/\\\\].+\\.(js|jsx|mjs)$"],
    // Setup Enzyme
    snapshotSerializers: ["enzyme-to-json/serializer"],
    setupFilesAfterEnv: ["<rootDir>/src/setupEnzyme.ts"],
};
