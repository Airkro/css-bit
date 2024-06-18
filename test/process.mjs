import test from 'ava';

import { tailwindAntdColors } from '@css-bit/tailwind-antd-color';
import { featureFixing } from '@css-bit/tailwind-smart-config';

import { css, processFile, processFileSmart } from './helper/lib.mjs';

test.serial(
  'color',
  processFile,
  css`
    body {
      @apply text-gold-6;
    }
  `,
  [tailwindAntdColors()],
);

test.serial(
  'fixing',
  processFile,
  css`
    body {
      @apply border-b-solid border-t-dotted border-l-hidden border-r-none;
    }

    div {
      @apply border-x-dashed border-y-double;
    }

    p {
      @apply border-s-hidden border-e-none;
    }
  `,
  [featureFixing],
);

test.serial(
  'pseudo',
  processFile,
  css`
    body {
      @apply before:flex after:hidden;
    }
  `,
  [featureFixing],
);

test.serial(
  'spacing-0',
  processFileSmart,
  css`
    body {
      @apply size-full;
    }
    div {
      @apply h-quater w-half;
    }
    img {
      @apply max-h-2/5 min-h-quater max-w-half;
    }
  `,
  {
    spacing: {},
  },
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

    div {
      @apply size-10;
    }
  `,
  {
    spacing: {
      step: 1,
      edge: 20,
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
      @apply border-px border-lg border-0 border-l;
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
      @apply z-10 aspect-9/16 aspect-square grow-2 text-initial;
    }
  `,
  {
    aspectRatio: {},
  },
);
