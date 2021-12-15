'use strict';

const plugin = require('tailwindcss/plugin');

const { negative, addUnit, mapObject } = require('./lib.cjs');

const sides = ['top', 'right', 'bottom', 'left'];

const styles = ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'];

function declaration({ selector, property, value }) {
  return [selector, { [property]: value }];
}

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
    const io = {
      corePlugins: {
        preflight: false,
      },
      theme: {
        extend: {
          colors: {
            transparent: 'transparent',
            current: 'currentColor',
            inherit: 'inherit',
            initial: 'initial',
            black: 'black',
            white: 'white',
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

    function modify({ name, setting, handler }) {
      if (setting) {
        io.theme[name] = {};
        io.theme.extend[name] = handler();
      }
    }

    const zero = { 0: '0' };

    const zeroNone = {
      ...zero,
      px: `1${['rpx', 'pt'].includes(unit) ? unit : 'px'}`,
    };

    const clock = {
      full: '100%',
      half: '50%',
      quater: '25%',
    };

    modify({
      name: 'spacing',
      setting: spacing,
      handler: () => ({
        ...zeroNone,
        ...addUnit(spacing, unit),
      }),
    });

    modify({
      name: 'fontSize',
      setting: fontSize,
      handler: () =>
        lineHeight
          ? mapObject(addUnit(fontSize, unit), (value, key) => [
              key,
              [value, lineHeight],
            ])
          : addUnit(fontSize, unit),
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

    return io;
  },
);

module.exports = { tailwindSmartConfig };
