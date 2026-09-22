import nextVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  { ignores: [".next/**", "out/**", "build/**", "coverage/**", "next-env.d.ts"] },
  ...nextVitals,
  ...nextTypescript,
  // Preserve compatibility props that demo widgets intentionally do not consume.
  { rules: { "@typescript-eslint/no-unused-vars": ["error", { argsIgnorePattern: "^_" }] } },
];

export default eslintConfig;
