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

test.serial('spacing', async (t) => {
  Tailwind(t);

  await t.processFile(css`
    body {
      @apply m-1 h-4;
    }

    /* - */

    body {
      margin: 0.25rem;
      height: 1rem;
    }
  `);

  await t.processFile(
    css`
      body {
        @apply m-2 h-px w-0;
      }

      /* - */

      body {
        margin: 2px;
        height: 1px;
        width: 0;
      }
    `,
    tailwindSmartConfig({ spacing: { 2: 2 } }),
    { mode: 'jit' },
  );
});

test.serial('config', async (t) => {
  Tailwind(t);

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
