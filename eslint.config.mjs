import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "playwright-report/**", "test-results/**"] },
  {
    files: ["scripts/**/*.mjs"],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.node,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ["app.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        ...globals.browser,
        marked: "readonly",
        DOMPurify: "readonly",
        mermaid: "readonly",
        CoolReaderTheme: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
  {
    files: ["theme.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        ...globals.browser,
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
