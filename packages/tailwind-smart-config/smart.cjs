'use strict';

const plugin = require('tailwindcss/plugin');
const { negative, addUnit, mapObject, withOpacityValue } = require('./lib.cjs');

function toPercent(a, b = 1) {
  const io = (a / b) * 100;

  return `${Number.isInteger(io) ? io : io.toFixed(5)}%`;
}

const ems = addUnit(
  Object.fromEntries(
    Array.from({ length: 39 })
      .fill(0)
      .map((_, i) => `${i + 1}em`)
      .map((i) => [i, i]),
  ),
  'em',
);

function getSpacing(rem, { step = 0.5, edge = 90, ...rest }) {
  const { 0: __, ...spacing } = Object.fromEntries(
    [
      ...Array.from({ length: edge + 1 }).map((_, s) => [s, s * step]),
      ...Object.entries(rest),
    ].map(([k, v]) => [k, typeof v === 'number' ? rem * v : v]),
  );

  return spacing;
}

exports.tailwindSmartConfig = plugin.withOptions(
  () => {},
  ({
    unit = 'px',
    rem = 1,
    borderRadius,
    borderWidth,
    fontSize,
    gap,
    inset,
    lineHeight,
    spacing: spacingConfig,
    aspectRatio,
    dash = '/',
  } = {}) => {
    const spacing = spacingConfig ? getSpacing(rem, spacingConfig) : undefined;

    const pair = [
      [1, 10],
      [1, 2],
      [1, 3],
      [1, 4],
      [1, 5],
      [2, 3],
      [2, 5],
      [3, 10],
      [3, 4],
      [3, 5],
      [4, 5],
      [7, 10],
      [9, 10],
      [9, 16],
    ];

    const clock = {
      ...Object.fromEntries(
        pair.map(([a, b]) => [a + dash + b, toPercent(a, b)]),
      ),
      full: toPercent(1),
      slice: toPercent(1, 3),
      '2-slice': toPercent(2, 3),
      half: toPercent(1, 2),
      quater: toPercent(1, 4),
      '3-quater': toPercent(3, 4),
    };

    const zero = { 0: '0' };

    const pxUnit = unit === 'rpx' ? unit : 'px';

    const zeroNone = {
      ...zero,
      em: '1em',
      rem: '1rem',
      pt: '1pt',
      '2pt': '2pt',
      px: `1${pxUnit}`,
      '2px': `2${pxUnit}`,
      '3px': `3${pxUnit}`,
      '4px': `4${pxUnit}`,
    };

    const io = {
      corePlugins: {
        preflight: false,
      },
      theme: {
        extend: {
          screens: {
            print: { raw: 'print' },
            screen: { raw: 'screen' },
          },
          colors: {
            transparent: 'transparent',
            current: 'currentColor',
            inherit: 'inherit',
            initial: 'initial',
            black: withOpacityValue('0 0 0'),
            white: withOpacityValue('255 255 255'),
          },
          zIndex: {
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
          },
          flexGrow: {
            1: '1',
            2: '2',
            3: '3',
            4: '4',
            5: '5',
          },
          margin: (theme) => {
            return {
              auto: 'auto',
              ...negative(theme('spacing')),
            };
          },
        },
      },
    };

    function modify({ name, names = [name], setting, handler }) {
      if (setting) {
        names.forEach((namespace) => {
          io.theme[namespace] = {};
          io.theme.extend[namespace] = handler();
        });
      }
    }

    modify({
      name: 'aspectRatio',
      setting: aspectRatio,
      handler: () => ({
        ...Object.fromEntries(
          pair.map(([a, b]) => [[a, b].join(dash), [a, b].join(' / ')]),
        ),
        auto: 'auto',
        square: '1 / 1',
        video: '16 / 9',
        image: '4 / 3',
      }),
    });

    modify({
      name: 'spacing',
      setting: spacing,
      handler: () => ({
        ...zeroNone,
        ...clock,
        ...(unit === 'em' ? undefined : ems),
        ...addUnit(spacing, unit),
      }),
    });

    modify({
      name: 'fontSize',
      setting: fontSize,
      handler: () =>
        addUnit(
          mapObject(fontSize, (value, key) => [
            key,
            typeof value === 'number' ? value * rem : value,
          ]),
          unit,
        ),
    });

    modify({
      name: 'lineHeight',
      setting: lineHeight,
      handler: () => ({
        ...zero,
        none: 1,
        ...lineHeight,
      }),
    });

    modify({
      name: 'borderRadius',
      setting: borderRadius,
      handler: () => ({
        ...zero,
        ...clock,
        ...addUnit(borderRadius, unit),
      }),
    });

    modify({
      name: 'gap',
      setting: gap,
      handler: () => ({
        ...zeroNone,
        ...clock,
        ...addUnit(gap, unit),
      }),
    });

    modify({
      name: 'borderWidth',
      setting: borderWidth,
      handler: () => ({
        ...zeroNone,
        DEFAULT: '1px',
        ...addUnit(borderWidth, unit),
      }),
    });

    modify({
      name: 'inset',
      setting: inset,
      handler: () => ({
        auto: 'auto',
        ...clock,
        ...zeroNone,
        ...addUnit(inset, unit),
      }),
    });

    modify({
      name: 'backgroundSize',
      setting: true,
      handler: () => ({
        auto: 'auto',
        cover: 'cover',
        contain: 'contain',
        ...mapObject(clock, (value, key) => [`x-${key}`, `${value} auto`]),
        ...mapObject(clock, (value, key) => [`y-${key}`, `auto ${value}`]),
      }),
    });

    return io;
  },
);
