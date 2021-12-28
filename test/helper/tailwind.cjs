'use strict';

const { format } = require('prettier');
const postcss = require('postcss');
const resolveConfig = require('tailwindcss/resolveConfig');
const tailwindcss = require('tailwindcss');
const { Define } = require('./lib.cjs');

function pretty(string) {
  return format(string, {
    parser: 'css',
    singleQuote: true,
  });
}

exports.Tailwind = function Tailwind(t) {
  Define(t, {
    getConfig(plugin, config) {
      return resolveConfig({
        ...config,
        plugins: [plugin],
      });
    },
    getTheme(plugin, config) {
      return this.getConfig(plugin, config).theme;
    },
    getColors(plugin, config) {
      return this.getTheme(plugin, config).colors;
    },
    async processFile(io, plugin) {
      const [source, expect] = io;

      const instance = tailwindcss({
        plugins: plugin ? [plugin] : [],
      });

      const processer = postcss([instance]);

      const result = await processer.process(source, { from: '.' });

      t.is(pretty(result.css), expect);

      t.is(result.warnings().length, 0);
    },
  });
};

exports.css = function css([string]) {
  return string.split('/* - */', 2).map((code) => pretty(code));
};
