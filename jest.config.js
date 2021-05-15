module.exports = {
  preset: "ts-jest",
  setupFilesAfterEnv: ["<rootDir>/jest-setup.ts"],
  moduleNameMapper: {
    "^.+\\.(css|less|scss)$": "identity-obj-proxy",
  },
};

// https://itnext.io/testing-with-jest-in-typescript-cc1cd0095421
// https://medium.com/@JeffLombardJr/organizing-tests-in-jest-17fc431ff850
