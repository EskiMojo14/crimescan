// eslint-disable-next-line @typescript-eslint/no-var-requires
const tsconfig = require("./tsconfig.json");

const {
  compilerOptions: { paths },
} = tsconfig;

const pathGroupsOverrides = [
  {
    group: "external",
    pattern: "react",
    position: "before",
  },
  {
    group: "internal",
    pattern: "/*",
    position: "before",
  },
  {
    group: "internal",
    pattern: "@i",
    position: "after",
  },
  {
    group: "object",
    pattern: "@m/*",
    position: "after",
  },
  {
    group: "object",
    pattern: "./*.scss",
    position: "after",
  },
];

module.exports = {
  extends: [
    "plugin:react/recommended",
    "plugin:@typescript-eslint/recommended",
    "plugin:import/recommended",
    "plugin:import/typescript",
    "prettier",
    "plugin:prettier/recommended",
  ],
  ignorePatterns: ["node_modules/*", "build/*"],
  overrides: [
    {
      files: ["*.ts", "*.tsx"],
      parserOptions: {
        project: ["./tsconfig.json"],
      },
      rules: {
        "@typescript-eslint/prefer-includes": "warn",
        "@typescript-eslint/prefer-reduce-type-parameter": "warn",
      },
    },
    {
      extends: ["plugin:jest/recommended", "plugin:jest-dom/recommended", "plugin:testing-library/react"],
      files: ["**/tests/**/*.[jt]s?(x)", "**/?(*.)+(test).[jt]s?(x)"],
    },
  ],
  parser: "@typescript-eslint/parser",
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 2018,
    sourceType: "module",
  },
  plugins: ["jest", "jest-dom", "testing-library", "sort-destructure-keys", "sort-keys", "typescript-sort-keys"],
  rules: {
    "@typescript-eslint/array-type": [
      "error",
      {
        default: "array",
      },
    ],
    "@typescript-eslint/consistent-indexed-object-style": ["warn", "record"],
    "@typescript-eslint/consistent-type-assertions": [
      "warn",
      {
        assertionStyle: "as",
      },
    ],
    "@typescript-eslint/consistent-type-imports": [
      "warn",
      {
        prefer: "type-imports",
      },
    ],
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/member-delimiter-style": "warn",
    "@typescript-eslint/method-signature-style": "warn",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/prefer-optional-chain": "warn",
    "@typescript-eslint/sort-type-union-intersection-members": "warn",
    "arrow-body-style": ["error", "as-needed"],
    "import/newline-after-import": "error",
    "import/no-named-as-default": "off",
    "import/no-unresolved": "off",
    "import/order": [
      "warn",
      {
        alphabetize: {
          caseInsensitive: true,
          order: "asc",
        },
        groups: ["builtin", "external", "internal", "index", "parent", "sibling"],
        pathGroups: [
          ...Object.keys(paths)
            .filter((path) => !pathGroupsOverrides.find((pathGroup) => pathGroup.pattern === path))
            .map((path) => ({
              group: "internal",
              pattern: path,
            })),
          ...pathGroupsOverrides,
        ],
        pathGroupsExcludedImportTypes: [...pathGroupsOverrides.map((pathGroup) => pathGroup.pattern)],
        warnOnUnassignedImports: true,
      },
    ],
    "no-use-before-define": "error",
    "object-shorthand": "error",
    "prefer-destructuring": [
      "error",
      {
        array: true,
        object: true,
      },
      {
        enforceForRenamedProperties: true,
      },
    ],
    "prefer-template": "warn",
    "react/destructuring-assignment": ["error", "always"],
    "react/function-component-definition": [
      "error",
      {
        namedComponents: "arrow-function",
        unnamedComponents: "arrow-function",
      },
    ],
    "react/jsx-boolean-value": "error",
    "react/jsx-fragments": "error",
    "react/jsx-sort-props": [
      "error",
      {
        ignoreCase: true,
        reservedFirst: true,
      },
    ],
    "react/no-array-index-key": "warn",
    "sort-destructure-keys/sort-destructure-keys": [2, { caseSensitive: false }],
    "sort-imports": [
      "warn",
      {
        ignoreCase: true,
        ignoreDeclarationSort: true,
      },
    ],
    "sort-keys/sort-keys-fix": [
      "error",
      "asc",
      {
        caseSensitive: false,
        natural: true,
      },
    ],
    "typescript-sort-keys/interface": ["error", "asc", { caseSensitive: false, natural: true, requiredFirst: true }],
    "typescript-sort-keys/string-enum": ["error", "asc", { caseSensitive: false, natural: true }],
  },
  settings: {
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
        project: "./tsconfig.json",
      },
    },
    react: {
      version: "detect",
    },
  },
};
