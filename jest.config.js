module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
    "~/(.*)": "<rootDir>/src/$1",
    "@s/(.*)": "<rootDir>/src/app/slices/$1",
    "@h": "<rootDir>/src/app/hooks",
    "@h/(.*)": "<rootDir>/src/app/hooks/$1",
    "@c/(.*)": "<rootDir>/src/components/$1",
    "@m/(.*)": "<rootDir>/src/media/$1",
  },
};

// https://itnext.io/testing-with-jest-in-typescript-cc1cd0095421
// https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850
