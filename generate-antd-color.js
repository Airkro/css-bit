const {
  generate,
  presetPalettes: { grey, ...presetPalettes }
} = require('@ant-design/colors');
const { mapValues, reduce } = require('lodash');
const { outputFileSync } = require('fs-extra');

const { EOL } = require('os');
const { resolve } = require('path');

const neutral = generate('#bfbfbf');
const preset = { neutral, ...presetPalettes };

function statement(colorName) {
  return (value, index) => `$${colorName}-${index}: ${value} !default;`;
}

const data = reduce(
  mapValues(preset, (colors, colorName) => colors.map(statement(colorName))),
  (io, sets, name) => [...io, `//--${name}--------`, ...sets, ''],
  ['/* stylelint-disable color-hex-length */', EOL]
).join(EOL);

outputFileSync(resolve('./package/antd-color.scss'), data);
