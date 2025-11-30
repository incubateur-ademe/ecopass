import next from "eslint-config-next"
import nextCoreWebVitals from "eslint-config-next/core-web-vitals"
import nextTypescript from "eslint-config-next/typescript"
import { dirname } from "path"
import { fileURLToPath } from "url"
import { FlatCompat } from "@eslint/eslintrc"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const compat = new FlatCompat({
  baseDirectory: __dirname,
})

const eslintConfig = [
  ...next,
  ...nextCoreWebVitals,
  ...nextTypescript,
  ...compat.config({
    extends: ["plugin:prettier/recommended"],
    plugins: ["prettier"],
    rules: {
      "prettier/prettier": "error",
      "react/no-unescaped-entities": "off",
    },
    ignorePatterns: ["*.test.ts", "*.spec.ts", "server-app.js"],
  }),
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      "out/**",
      "build/**",
      "next-env.d.ts",
      "playwright-report/**",
      "prisma/src/**",
    ],
  },
]

export default eslintConfig
