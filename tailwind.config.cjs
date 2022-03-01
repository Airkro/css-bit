'use strict';

const { tailwindSmartConfig } = require('@css-bit/tailwind-smart-config');
const { tailwindAntdColors } = require('@css-bit/tailwind-antd-color');

const { 0: __, ...spacing } = Object.fromEntries(
  Array.from({ length: 30 }).map((_, s) => [s, s * 0.5]),
);

module.exports = {
  important: true,
  content: ['./{src,packages}/**/*.{html,jsx,js}'],
  safelist: process.env.TAILWIND_ALL ? [{ pattern: /.*/ }] : undefined,
  corePlugins: {
    preflight: false,
  },
  theme: {
    extend: {
      borderColor: {
        DEFAULT: '#e6e6e6',
      },
    },
  },
  plugins: [
    tailwindAntdColors({
      10: false,
      grey: 174,
    }),
    tailwindSmartConfig({
      unit: 'rem',
      spacing,
      lineHeight: 1,
      fontSize: {
        small: 'small',
        normal: 'normal',
        large: 'large',
        'x-large': 'x-large',
      },
    }),
  ],
};
