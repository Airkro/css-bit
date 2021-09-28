'use strict';

const plugin = require('tailwindcss/plugin');

const { negative, addUnit, mapObject } = require('./lib.cjs');

const sides = ['top', 'right', 'bottom', 'left'];

const tailwindSmartConfig = plugin.withOptions(
  () => {
    return ({ addUtilities, variants, corePlugins }) => {
      if (corePlugins('borderStyle')) {
        addUtilities(
          [
            Object.fromEntries(
              sides.map((side) => [
                `.border-${side[0]}-solid`,
                { [`border-${side}-style`]: 'solid' },
              ]),
            ),
          ],
          variants('borderStyle'),
        );
      }
    };
  },
  ({ unit = 'px', spacing, fontSize, lineHeight, borderRadius } = {}) => {
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

    modify({
      name: 'spacing',
      setting: spacing,
      handler: () => ({
        0: '0',
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
        none: 0,
        full: '100%',
        ...addUnit(borderRadius, unit),
      }),
    });

    return io;
  },
);

module.exports = { tailwindSmartConfig };
