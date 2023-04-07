'use strict';

const plugin = require('tailwindcss/plugin');
const { negative, addUnit, mapObject, withOpacityValue } = require('./lib.cjs');

const sides = ['top', 'right', 'bottom', 'left'];

const styles = ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'];

function declaration({ selector, property, value }) {
  return [selector, { [property]: value }];
}

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

const tailwindSmartConfig = plugin.withOptions(
  () => {
    return ({ addUtilities, variants, corePlugins }) => {
      if (corePlugins('borderStyle')) {
        addUtilities(
          [
            Object.fromEntries(
              styles.flatMap((style) =>
                sides.map((side) =>
                  declaration({
                    selector: `.border-${side[0]}-${style}`,
                    property: `border-${side}-style`,
                    value: style,
                  }),
                ),
              ),
            ),
          ],
          variants('borderStyle'),
        );
      }
    };
  },
  ({
    unit = 'px',
    borderRadius,
    borderWidth,
    fontSize,
    gap,
    inset,
    lineHeight,
    spacing,
  } = {}) => {
    const clock = {
      full: toPercent(1),
      '9/10': toPercent(9, 10),
      '4/5': toPercent(4, 5),
      '7/10': toPercent(7, 10),
      '3/4': toPercent(3, 4),
      '2/3': toPercent(2, 3),
      '3/5': toPercent(3, 5),
      '9/16': toPercent(9, 16),
      half: toPercent(1, 2),
      '2/5': toPercent(2, 5),
      '1/3': toPercent(1, 3),
      '3/10': toPercent(3, 10),
      quater: toPercent(1, 4),
      '1/5': toPercent(1, 5),
      '1/10': toPercent(1, 10),
    };

    const zero = { 0: '0' };

    const zeroNone = {
      ...zero,
      '1em': '1em',
      '1rem': '1rem',
      px: `1${['rpx', 'pt'].includes(unit) ? unit : 'px'}`,
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
      name: 'spacing',
      setting: spacing,
      handler: () => ({
        ...zeroNone,
        ...clock,
        ...addUnit(spacing, unit),
      }),
    });

    modify({
      names: ['minWidth', 'maxWidth', 'minHeight', 'maxHeight'],
      setting: spacing,
      handler: () => ({
        ...zero,
        ...clock,
        ...(unit === 'em' ? undefined : ems),
        ...addUnit(spacing, unit),
      }),
    });

    modify({
      name: 'fontSize',
      setting: fontSize,
      handler: () =>
        mapObject(addUnit(fontSize, unit), (value, key) => [key, [value, 1]]),
    });

    modify({
      name: 'lineHeight',
      setting: lineHeight,
      handler: () => ({
        ...zero,
        none: 1,
        ...addUnit(lineHeight, unit),
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

module.exports = { tailwindSmartConfig };
