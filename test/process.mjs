import { tailwindAntdColors } from '@css-bit/tailwind-antd-color';
import { tailwindSmartConfig } from '@css-bit/tailwind-smart-config';
import test from 'ava';
import postcss from 'postcss';
import tailwindcss from 'tailwindcss';

import { css, pretty } from './helper/lib.mjs';

async function processFile(t, source, plugin) {
  const instance = tailwindcss({
    plugins: plugin ? [plugin] : [],
  });

  const processor = postcss([instance]);

  const result = await processor.process(source, { from: '.' });

  t.snapshot(pretty(result.css));

  t.is(result.warnings().length, 0);
}

test.serial(
  'color',
  processFile,
  css`
    body {
      @apply text-gold-6;
    }
  `,
  tailwindAntdColors(),
);
test.serial(
  'spacing-1',
  processFile,
  css`
    body {
      @apply m-1 h-4;
    }
  `,
);

test.serial(
  'spacing-2',
  processFile,
  css`
    body {
      @apply m-2 h-px w-0 mt-auto pb-1/10;
    }
  `,
  tailwindSmartConfig({ spacing: { 2: 2 } }),
);

test.serial(
  'config-1',
  processFile,
  css`
    body {
      @apply rounded-lg;
    }
  `,
  tailwindSmartConfig({
    borderRadius: { lg: 10 },
    unit: 'pt',
  }),
);

test.serial(
  'config-2',
  processFile,
  css`
    body {
      @apply border-b-solid;
    }
  `,
  tailwindSmartConfig(),
);
