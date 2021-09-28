'use strict';

const { Define } = require('./lib.cjs');

exports.Util = function Util(t) {
  Define(t, {
    haveAllKeys(object, keys) {
      t.deepEqual(Object.keys(object).sort(), keys.sort());
    },
    values(object, callback) {
      for (const value of Object.values(object)) {
        callback(value);
      }
    },
  });
};
