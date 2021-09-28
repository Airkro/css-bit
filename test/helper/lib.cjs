'use strict';

exports.Define = function Define(object, settings) {
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
};
