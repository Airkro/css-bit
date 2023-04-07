import { tailwindSmartConfig } from '@css-bit/tailwind-smart-config';
import test from 'ava';

import { getColors, getTheme } from './helper/lib.mjs';

test('basic', (t) => {
  const { zIndex, flexGrow } = getTheme(tailwindSmartConfig());

  t.is(flexGrow[2], '2');

  t.is(zIndex[1], '1');
});

test('colors', (t) => {
  const colors = getColors(tailwindSmartConfig(), {
    theme: {
      colors: { red: '#f00' },
      extend: {
        colors: { fff: '#004' },
      },
    },
  });

  t.is(colors.initial, 'initial');
});

test('spacing', (t) => {
  const { margin, padding, spacing } = getTheme(
    tailwindSmartConfig({
      spacing: {
        sm: 10,
        md: 20,
      },
      unit: 'rpx',
    }),
  );

  t.is(margin.auto, 'auto');

  t.is(margin[0], '0');
  t.is(margin.sm, '10rpx');
  t.is(margin['-sm'], '-10rpx');

  t.is(padding[0], '0');
  t.is(padding.sm, '10rpx');
  t.is(padding.full, '100%');
  t.is(padding['1/10'], '10%');

  t.like(margin, spacing);
  t.like(padding, spacing);
});

test('fontSize', (t) => {
  const { fontSize } = getTheme(
    tailwindSmartConfig({
      fontSize: {
        lg: 32,
      },
    }),
  );

  t.deepEqual(fontSize.lg, ['32px', 1]);
});

test('borderRadius', (t) => {
  const { borderRadius } = getTheme(
    tailwindSmartConfig({
      borderRadius: {
        lg: 10,
      },
    }),
  );

  t.is(borderRadius.full, '100%');
  t.is(borderRadius.half, '50%');
  t.is(borderRadius[0], '0');
  t.is(borderRadius.lg, '10px');
});

test('borderWidth', (t) => {
  const { borderWidth } = getTheme(
    tailwindSmartConfig({
      borderWidth: {
        lg: 10,
      },
    }),
  );

  t.is(borderWidth.px, '1px');
  t.is(borderWidth.lg, '10px');
});

test('gap', (t) => {
  const { gap } = getTheme(
    tailwindSmartConfig({
      gap: {
        lg: 10,
      },
    }),
  );

  t.is(gap.px, '1px');
  t.is(gap.lg, '10px');
});

test('inset', (t) => {
  const { inset } = getTheme(
    tailwindSmartConfig({
      inset: {
        lg: 10,
      },
    }),
  );

  t.is(inset.px, '1px');
  t.is(inset.lg, '10px');
});

test('backgroundSize', (t) => {
  const { backgroundSize } = getTheme(tailwindSmartConfig());

  t.is(backgroundSize.cover, 'cover');
  t.is(backgroundSize['y-2/3'], 'auto 66.66667%');
});
