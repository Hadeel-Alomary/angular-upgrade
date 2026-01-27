// @ts-check
const eslint = require("@eslint/js");
const { defineConfig } = require("eslint/config");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = defineConfig([
  // Main TS files
  {
    files: ["**/*.ts"],
    ignores: [
      "**/*.d.ts", // ignore all type declaration files
      "src/static-libraries/vendor/**", // ignore all vendor files
      "src/typings/**", // ignore all legacy typings
    ],
    extends: [
      eslint.configs.recommended,
      tseslint.configs.recommended,
      tseslint.configs.stylistic,
      angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "error",
        { type: "attribute", prefix: "app", style: "camelCase" },
      ],
      "@angular-eslint/component-selector": [
        "error",
        { type: "element", prefix: "app", style: "kebab-case" },
      ],
    },
  },

  // HTML templates in your app (not vendor)
  {
    files: ["src/**/*.html"],
    ignores: ["src/static-libraries/vendor/**"], // ignore vendor HTML
    extends: [
      angular.configs.templateRecommended,
      angular.configs.templateAccessibility,
    ],
    rules: {},
  },
]);
