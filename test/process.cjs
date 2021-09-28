'use strict';

const test = require('ava').default;

const { Tailwind, css } = require('./helper/tailwind.cjs');

const { tailwindSmartConfig } = require('@css-bit/tailwind-smart-config');
const { tailwindAntdColors } = require('@css-bit/tailwind-antd-color');

test.serial('color', async (t) => {
  Tailwind(t);

  await t.processFile(
    css`
      body {
        @apply text-gold-6;
      }

      /* - */

      body {
        --tw-text-opacity: 1;
        color: rgba(250, 173, 20, var(--tw-text-opacity));
      }
    `,
    tailwindAntdColors(),
  );
});

test.serial('config', async (t) => {
  Tailwind(t);

  await t.processFile(css`
    body {
      @apply m-1;
    }

    /* - */

    body {
      margin: 0.25rem;
    }
  `);

  await t.processFile(
    css`
      body {
        @apply m-1;
      }

      /* - */

      body {
        margin: 1px;
      }
    `,
    tailwindSmartConfig({ spacing: { 1: 1 } }),
  );

  await t.processFile(
    css`
      body {
        @apply m-1;
      }

      /* - */

      body {
        margin: 1px;
      }
    `,
    tailwindSmartConfig({ spacing: { 1: 1 } }),
    { mode: 'jit' },
  );

  await t.processFile(
    css`
      body {
        @apply rounded-lg;
      }

      /* - */

      body {
        border-radius: 10pt;
      }
    `,
    tailwindSmartConfig({
      borderRadius: { lg: 10 },
      unit: 'pt',
    }),
  );

  await t.processFile(
    css`
      body {
        @apply border-b-solid;
      }

      /* - */

      body {
        border-bottom-style: solid;
      }
    `,
    tailwindSmartConfig(),
  );
});
