import plugin from 'tailwindcss/plugin.js';

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

export const featureFixing = plugin(
  ({ addUtilities, variants, corePlugins }) => {
    // addVariant('before', () => {
    //   return '&::before';
    // });

    // addVariant('after', () => {
    //   return '&::after';
    // });

    // `corePlugins` and `variants` are Tailwind v3-only API. v4 exposes neither:
    // core plugins cannot be disabled from a plugin there, and utilities are
    // variant-agnostic, so every registered utility automatically works with
    // all variants. Detect them instead of assuming they exist.
    if (corePlugins && !corePlugins('borderStyle')) {
      return;
    }

    const utilities = Object.fromEntries(
      styles.flatMap((style) =>
        Object.entries(Sides).map(([key, sides]) =>
          declaration({
            selector: `.border-${key}-${style}`,
            properties: sides.map((side) => `border-${side}-style`),
            value: style,
          }),
        ),
      ),
    );

    if (variants) {
      addUtilities(utilities, variants('borderStyle'));
    } else {
      addUtilities(utilities);
    }
  },
);

// Tailwind v4's `@plugin` directive needs a default export. This plugin takes
// no options, so it works with both `@plugin` (v4) and `plugins: []` (v3).
// eslint-disable-next-line import-x/no-default-export
export default featureFixing;
