// @ts-check

import { defineConfig } from '@nice-move/syncpack-config/define.mjs';

export default defineConfig(import.meta.url, {
  semverGroups: [
    {
      dependencies: ['node'],
      range: '>=',
    },
  ],
  versionGroups: [
    {
      dependencies: ['tailwindcss'],
      dependencyTypes: ['peer'],
      pinVersion: '^3.4.19 || ^4.3.3',
    },
  ],
});
