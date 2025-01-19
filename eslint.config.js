import eslint from "@eslint/js";
import pluginRouter from "@tanstack/eslint-plugin-router";
import drizzlePlugin from "eslint-plugin-drizzle";
import eslintComments from "eslint-plugin-eslint-comments";
import eslintPluginImportX from "eslint-plugin-import-x";
import perfectionist from "eslint-plugin-perfectionist";
import eslintPluginPrettierRecommended from "eslint-plugin-prettier/recommended";
import vitest from "eslint-plugin-vitest";
import {
  configs as tsEslintConfigs,
  parser as tsEslintParser,
  plugin as tsEslintPlugin,
} from "typescript-eslint";

export default [
  { ignores: ["**/*.gen.ts"] },
  eslint.configs.recommended,
  ...tsEslintConfigs.recommendedTypeChecked,
  ...tsEslintConfigs.strictTypeChecked,
  ...tsEslintConfigs.stylisticTypeChecked,
  eslintPluginImportX.flatConfigs.recommended,
  eslintPluginImportX.flatConfigs.typescript,
  eslintPluginImportX.flatConfigs.react,
  {
    languageOptions: {
      parser: tsEslintParser,
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    plugins: {
      "@typescript-eslint": tsEslintPlugin,
      drizzle: drizzlePlugin,
      "eslint-comments": eslintComments,
    },
    rules: {
      ...drizzlePlugin.configs.recommended.rules,
      "@typescript-eslint/no-empty-object-type": [
        "error",
        { allowWithName: "Props$" },
      ],
      "@typescript-eslint/only-throw-error": [
        "error",
        {
          allow: [
            {
              from: "package",
              name: ["Redirect"],
              package: "@tanstack/react-router",
            },
          ],
        },
      ],
      "@typescript-eslint/restrict-template-expressions": [
        "error",
        { allowBoolean: true, allowNumber: true },
      ],
      "eslint-comments/disable-enable-pair": "error",
      "eslint-comments/no-unlimited-disable": "error",
      "eslint-comments/no-unused-disable": "error",
      "eslint-comments/no-unused-enable": "error",
      "eslint-comments/no-use": [
        "error",
        {
          allow: [
            "eslint-disable",
            "eslint-disable-line",
            "eslint-disable-next-line",
            "eslint-enable",
          ],
        },
      ],
      "eslint-comments/require-description": [
        "warn",
        { ignore: ["eslint-enable"] },
      ],
    },
  },
  {
    // disable type-aware linting on JS files
    ...tsEslintConfigs.disableTypeChecked,
    files: ["**/*.js"],
  },
  ...pluginRouter.configs["flat/recommended"],
  {
    files: ["**/*.test.ts"],
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules, // you can also use vitest.configs.all.rules to enable all rules
    },
  },
  perfectionist.configs["recommended-natural"],
  eslintPluginPrettierRecommended,
];
