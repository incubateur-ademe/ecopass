import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...compat.config({
    extends: [
      "next",
      "next/core-web-vitals",
      "next/typescript",
      "plugin:prettier/recommended",
      "plugin:jsx-a11y/recommended",
    ],
    plugins: ["prettier", "jsx-a11y"],
    rules: {
      "prettier/prettier": "error",
      "react/no-unescaped-entities": "off",
    },
    ignorePatterns: ["*.test.ts", "*.spec.ts", "server-app.js"],
  }),
]

export default eslintConfig
