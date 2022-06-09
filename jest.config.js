module.exports = {
  moduleNameMapper: {
    "@c/(.*)": "<rootDir>/src/components/$1",
    "@h": "<rootDir>/src/app/hooks",
    "@h/(.*)": "<rootDir>/src/app/hooks/$1",
    "@s/(.*)": "<rootDir>/src/app/slices/$1",
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "^/(.*)": "<rootDir>/$1",
  },
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
};

// https://itnext.io/testing-with-jest-in-typescript-cc1cd0095421
// https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850
