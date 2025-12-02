import antfu from "@antfu/eslint-config";

export default antfu({
  react: true,
  typescript: true,
  stylistic: false,
  formatters: {
    css: true,
    markdown: true,
  },
  ignores: [
    "**/node_modules/**",
    "**/.next/**",
    "**/.open-next/**",
    "**/dist/**",
    "**/build/**",
    "**/.wrangler/**",
    "**/drizzle/**",
  ],
}, {
  rules: {
    "no-console": ["warn", { allow: ["warn", "error"] }],
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
      },
    ],
    "react/prop-types": "off",
    "react-hooks/exhaustive-deps": "warn",
  },
});
