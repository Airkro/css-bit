import { tailwindAntdColors } from '@css-bit/tailwind-antd-color';
import test from 'ava';

import { css, processFile, processFileSmart } from './helper/lib.mjs';

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
  processFileSmart,
  css`
    body {
      @apply -mb-sm m-0 m-auto p-0 p-full pb-1/10;
    }
  `,
  {
    spacing: {
      sm: 10,
      md: 20,
    },
    unit: 'rpx',
  },
);

test.serial(
  'spacing-2',
  processFileSmart,
  css`
    body {
      @apply m-2 mt-auto h-px w-0 pb-1/10;
    }
  `,
  {
    spacing: {
      2: 2,
    },
  },
);

test.serial(
  'config-1',
  processFileSmart,
  css`
    body {
      @apply rounded-lg;
    }
  `,
  {
    borderRadius: { lg: 10 },
    unit: 'pt',
  },
);

test.serial(
  'config-2',
  processFileSmart,
  css`
    body {
      @apply border-b-solid;
    }
  `,
);

test.serial(
  'font-size',
  processFileSmart,
  css`
    body {
      @apply text-large;
    }
  `,
  {
    fontSize: {
      large: 4,
    },
  },
);

test.serial(
  'background-size',
  processFileSmart,
  css`
    body {
      @apply bg-cover bg-y-2/3;
    }
  `,
);

test.serial(
  'inset',
  processFileSmart,
  css`
    body {
      @apply inset-lg top-px;
    }
  `,
  {
    inset: {
      lg: 10,
    },
  },
);

test.serial(
  'gap',
  processFileSmart,
  css`
    body {
      @apply gap-lg gap-x-px;
    }
  `,
  {
    gap: {
      lg: 10,
    },
  },
);

test.serial(
  'border-width',
  processFileSmart,
  css`
    body {
      @apply border-px border-t-lg;
    }
  `,
  {
    borderWidth: {
      lg: 10,
    },
  },
);

test.serial(
  'border-radius',
  processFileSmart,
  css`
    body {
      @apply rounded-half rounded-b-0 rounded-r-lg rounded-s-full;
    }
  `,
  {
    borderRadius: {
      lg: 10,
    },
  },
);

test.serial(
  'other',
  processFileSmart,
  css`
    body {
      @apply z-10 grow-2 text-initial;
    }
  `,
);
