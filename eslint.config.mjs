import js from "@eslint/js";
import globals from "globals";

export default [
  { ignores: ["node_modules/**", "playwright-report/**", "test-results/**"] },
  {
    files: ["app.js"],
    languageOptions: {
      ecmaVersion: 2020,
      sourceType: "script",
      globals: {
        ...globals.browser,
        marked: "readonly",
        DOMPurify: "readonly",
      },
    },
    rules: {
      ...js.configs.recommended.rules,
    },
  },
];
