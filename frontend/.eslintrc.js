module.exports = {
  root: true,
  env: {
    browser: true,
    es2021: true,
  },
  parser: "@typescript-eslint/parser",
  parserOptions: {
    project: ["./tsconfig.eslint.json"],
    sourceType: "module",
    tsconfigRootDir: __dirname,
    ecmaFeatures: { jsx: true },
  },
  extends: [
    "airbnb",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "eslint:recommended",
    "next",
    "next/core-web-vitals",
    "prettier",
  ],
  rules: {
    "arrow-body-style": "off",
    "import/prefer-default-export": "off",
    "import/extensions": [
      "error",
      {
        js: "never",
        jsx: "never",
        ts: "never",
        tsx: "never",
      },
    ],
    "react/function-component-definition": [
      2,
      { namedComponents: ["function-declaration", "arrow-function"] },
    ],
    "react/jsx-filename-extension": [
      "error",
      {
        extensions: [".jsx", ".tsx"],
      },
    ],
    "import/no-extraneous-dependencies": ["error", { devDependencies: ["./debug/**"] }],
    "react/react-in-jsx-scope": "off",
    "react/require-default-props": [0, { ignoreFunctionalComponents: true }],
    "react/jsx-props-no-spreading": "off",
    "no-nested-ternary": "off",
    "no-void": [
      "error",
      {
        allowAsStatement: true,
      },
    ],
  },
  settings: {
    "import/resolver": {
      typescript: {
        project: path.join(__dirname, "tsconfig.json"),
      },
    },
  },
};
