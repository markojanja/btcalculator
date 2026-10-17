import js from "@eslint/js";
import globals from "globals";
import react from "eslint-plugin-react";
import reactHooks from "eslint-plugin-react-hooks";
import reactRefresh from "eslint-plugin-react-refresh";

export default [
  { ignores: ["dist"] },
  {
    files: ["**/*.{js,jsx}"],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: "latest",
        ecmaFeatures: { jsx: true },
        sourceType: "module",
      },
    },
    settings: { react: { version: "18.3" } },
    plugins: {
      react,
      "react-hooks": reactHooks,
      "react-refresh": reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs["jsx-runtime"].rules,
      ...reactHooks.configs.recommended.rules,
      "react/jsx-no-target-blank": "off",
      "react-refresh/only-export-components": ["warn", { allowConstantExport: true }],
      "react/prop-types": "off",
      "react-hooks/exhaustive-deps": "off",
      "no-unused-vars": ["error", { ignoreRestSiblings: true }],
      // console.error/warn are for real failures; stray debug logging fails lint.
      "no-console": ["error", { allow: ["error", "warn"] }],
    },
  },
  {
    // Generated shadcn/ui components: keep them as the generator writes them.
    files: ["components/ui/**/*.jsx"],
    rules: {
      "no-unused-vars": ["error", { varsIgnorePattern: "^React$" }],
      "react-refresh/only-export-components": "off",
    },
  },
  {
    files: ["*.config.js", "**/*.test.{js,jsx}"],
    languageOptions: { globals: { ...globals.node } },
  },
];
