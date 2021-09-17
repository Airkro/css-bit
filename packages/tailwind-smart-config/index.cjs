'use strict';

const plugin = require('tailwindcss/plugin');

const colors = {
  transparent: 'transparent',
  current: 'currentColor',
  inherit: 'inherit',
  initial: 'initial',
  black: 'black',
  white: 'white',
};

const tailwindSmartConfig = plugin.withOptions(
  () => {},
  () => ({
    theme: {
      extend: {
        colors,
      },
    },
  }),
);

module.exports = { tailwindSmartConfig };
