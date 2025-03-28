import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import prettierConfig from "eslint-config-prettier";

/** @type {import('eslint').Linter.Config[]} */
export default [
  {files: ["src/*.{js,mjs,cjs,ts}"]},
  {files: ["**/*.js"], languageOptions: {sourceType: "script"}},
  {languageOptions: { globals: {...globals.browser, ...globals.node} }},
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: ["plugin:prettier/recommended"],
    rules: {
      "prettier/prettier": "error",
    },
  },
  prettierConfig,
];