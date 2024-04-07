'use strict';

const plugin = require('tailwindcss/plugin');

const Sides = {
  t: ['top'],
  r: ['right'],
  b: ['bottom'],
  l: ['left'],
  s: ['inline-start'],
  e: ['inline-end'],
  x: ['left', 'right'],
  y: ['top', 'bottom'],
};

const styles = ['solid', 'dashed', 'dotted', 'double', 'hidden', 'none'];

function declaration({ selector, properties, value }) {
  return [
    selector,
    Object.fromEntries(properties.map((property) => [property, value])),
  ];
}

exports.featureFixing = plugin(
  ({ addVariant, addUtilities, variants, corePlugins }) => {
    addVariant('before', () => {
      return '&::before';
    });

    addVariant('after', () => {
      return '&::after';
    });

    if (corePlugins('borderStyle')) {
      addUtilities(
        Object.fromEntries(
          styles.flatMap((style) =>
            Object.entries(Sides).map(([key, sides]) =>
              declaration({
                selector: `.border-${key}-${style}`,
                properties: sides.map((side) => `border-${side}-style`),
                value: style,
              }),
            ),
          ),
        ),
        variants('borderStyle'),
      );
    }
  },
);
