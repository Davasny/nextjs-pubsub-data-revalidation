module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es6: true,
    jest: true,
    node: true,
  },
  extends: [
    "eslint:recommended",
    "next/core-web-vitals",
    "plugin:@typescript-eslint/recommended",
    "plugin:@typescript-eslint/recommended-requiring-type-checking",
    "plugin:import/recommended",
    "plugin:import/typescript",
  ],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: ["./tsconfig.json"],
  },
  plugins: ["simple-import-sort"],
  root: true,
  rules: {
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "warn",
    "@typescript-eslint/consistent-type-imports": "error",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    "@typescript-eslint/no-unsafe-assignment": "warn",
    "@typescript-eslint/no-explicit-any": "warn",
    "simple-import-sort/imports": "off",
    "simple-import-sort/exports": "off",
    "react/prop-types": "off",
    "react/react-in-jsx-scope": "off",
    "import/no-default-export": "error",
    "@next/next/google-font-display": "off",
    "@next/next/google-font-preconnect": "off",
    "@next/next/no-page-custom-font": "off",
  },
  settings: {
    react: {
      version: "detect",
    },
    "import/resolver": {
      typescript: {
        alwaysTryTypes: true,
      },
    },
    "import/ignore": ["\\.svg$", "\\.png$"],
  },
  overrides: [
    {
      files: ["src/app/*", "src/app/**/*", "src/pages/*", "src/pages/**/*"],
      rules: {
        "import/no-default-export": "off",
      },
    },
  ],
};
