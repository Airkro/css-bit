'use strict';

function negateValue(io) {
  const value = String(io);

  // Flip sign of numbers
  if (/^[+-]?(\d+|\d*\.\d+)(e[+-]?\d+)?(%|\w+)?$/.test(value)) {
    return value.replace(/^[+-]?/, (sign) => (sign === '-' ? '' : '-'));
  }

  if (value.includes('var(') || value.includes('calc(')) {
    return `calc(${value} * -1)`;
  }

  return value;
}

function mapObject(object, callback, filter) {
  const io = Object.entries(object);
  const tmp = filter ? io.filter(([key, value]) => filter(value, key)) : io;

  return Object.fromEntries(tmp.map(([key, value]) => callback(value, key)));
}

exports.mapObject = mapObject;

exports.addUnit = function addUnit(object, unit) {
  return mapObject(object, (value, key) => [
    key,
    typeof value === 'number' && value !== 0 && value !== '0'
      ? value + unit
      : value,
  ]);
};

exports.negative = function negative(object) {
  return mapObject(
    object,
    (value, key) => [`-${key}`, negateValue(value)],
    (value) => value !== '0' && value !== 0,
  );
};

exports.withOpacityValue = function withOpacityValue(variable) {
  return ({ opacityValue }) => {
    if (opacityValue === undefined) {
      return variable;
    }

    return `rgb(${variable} / ${opacityValue})`;
  };
};
