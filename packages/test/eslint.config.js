import { eslintConfig } from '@blole/node-setup-lint';

export default [
  {
    ignores: ['coverage/'],
  },
  eslintConfig.md,
  eslintConfig.json,
  eslintConfig.jsonc,
  eslintConfig.js,
  eslintConfig.ts,
  eslintConfig.tests,
  ...eslintConfig.editorconfig,
  eslintConfig.prettier,
];
