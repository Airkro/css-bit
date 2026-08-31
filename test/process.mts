import { tailwindAntdColors } from '@css-bit/tailwind-antd-color';
import { featureFixing } from '@css-bit/tailwind-smart-config';
import test from 'ava';

import {
  css,
  processFile,
  processFileSmart,
  processFileSmartV3Only,
  processFileSmartV4,
} from './helper/lib.mts';

// v4 loads `featureFixing` through `@plugin`, which resolves a package
// subpath rather than an imported value.
const fixingV4 = '@css-bit/tailwind-smart-config/fixing.mjs';

test.serial(
  'color',
  processFile,
  css`
    body {
      @apply text-gold-6;
    }
  `,
  [tailwindAntdColors({})],
  {},
);

test.serial(
  'fixing',
  processFileSmart,
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
  {},
  [featureFixing],
  [fixingV4],
);

test.serial(
  'pseudo',
  processFileSmart,
  css`
    body {
      @apply before:flex after:hidden;
    }
  `,
  {},
  [featureFixing],
  [fixingV4],
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
      @apply min-h-quater max-w-half max-h-2/5;
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
      @apply -mb-sm p-full pb-1/10 m-0 m-auto p-0;
    }
  `,
  {
    spacing: {
      sm: 10,
      md: 20,
    },
    unit: 'rpx',
    rem: 16,
  },
);

test.serial(
  'spacing-2',
  processFileSmart,
  css`
    body {
      @apply ml-2/5 pb-1/10 m-2 mt-auto h-px w-0;
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
    rem: 16,
  },
);

// v4 cannot express custom `background-size` values containing `/`, so the full
// case stays v3-only and v4 gets the subset it does support (see README).
test.serial(
  'background-size',
  processFileSmartV3Only,
  css`
    body {
      @apply bg-y-2/3 bg-cover;
    }
  `,
);

test.serial(
  'background-size (v4)',
  processFileSmartV4,
  css`
    body {
      @apply bg-cover;
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
      @apply rounded-half rounded-b-0 rounded-s-full rounded-r-lg;
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
      @apply text-initial z-10 aspect-9/16 aspect-square grow-2;
    }
  `,
  {
    aspectRatio: {},
  },
);
