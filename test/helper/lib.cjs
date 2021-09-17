'use strict';

const resolveConfig = require('tailwindcss/resolveConfig');

function Define(object, settings) {
  Object.defineProperties(
    object,
    Object.fromEntries(
      Object.entries(settings).map(([key, func]) => [
        key,
        {
          writable: false,
          configurable: false,
          value: func,
        },
      ]),
    ),
  );
}

exports.Extend = function Extend(t) {
  Define(t, {
    haveAllKeys(object, keys) {
      t.deepEqual(Object.keys(object).sort(), keys.sort());
    },
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
    values(object, callback) {
      for (const value of Object.values(object)) {
        callback(value);
      }
    },
  });
};
