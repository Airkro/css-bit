'use strict';

const test = require('ava').default;

const { Util } = require('./helper/util.cjs');
const { Tailwind } = require('./helper/tailwind.cjs');

const { tailwindSmartConfig } = require('@css-bit/tailwind-smart-config');

test('basic', (t) => {
  Util(t);
  Tailwind(t);

  const { zIndex, flexGrow } = t.getTheme(tailwindSmartConfig());

  t.is(flexGrow[2], '2');

  t.is(zIndex[1], '1');
});

test('colors', (t) => {
  Util(t);
  Tailwind(t);

  const colors = t.getColors(tailwindSmartConfig(), {
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
  Util(t);
  Tailwind(t);

  const { margin, padding, spacing } = t.getTheme(
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

  t.like(margin, padding);

  t.deepEqual(padding, spacing);
});

test('fontSize', (t) => {
  Util(t);
  Tailwind(t);

  const { fontSize } = t.getTheme(
    tailwindSmartConfig({
      fontSize: {
        lg: 32,
      },
    }),
  );

  t.is(fontSize.lg, '32px');

  const { fontSize: withLineHeight } = t.getTheme(
    tailwindSmartConfig({
      fontSize: {
        lg: 32,
      },
      lineHeight: 1,
    }),
  );

  t.deepEqual(withLineHeight.lg, ['32px', 1]);
});

test('borderRadius', (t) => {
  Util(t);
  Tailwind(t);

  const { borderRadius } = t.getTheme(
    tailwindSmartConfig({
      borderRadius: {
        lg: 10,
      },
    }),
  );

  t.is(borderRadius.full, '100%');
  t.is(borderRadius.none, 0);
  t.is(borderRadius.lg, '10px');
});