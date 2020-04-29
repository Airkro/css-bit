const {
  generate,
  presetPalettes: { grey, ...presetPalettes },
  // eslint-disable-next-line import/no-extraneous-dependencies
} = require('@ant-design/colors');
// eslint-disable-next-line import/no-extraneous-dependencies
const { mapValues, reduce } = require('lodash');
// eslint-disable-next-line import/no-extraneous-dependencies
const { Text } = require('fs-chain');

const { EOL } = require('os');

const neutral = generate('#bfbfbf');
const preset = { neutral, ...presetPalettes };

function statement(colorName) {
  return (value, index) => `$${colorName}-${index}: ${value} !default;`;
}

new Text('Generate antd colors')
  .handle(() =>
    reduce(
      mapValues(preset, (colors, colorName) =>
        colors.map(statement(colorName)),
      ),
      (io, sets, name) => [...io, `//--${name}--------`, ...sets, ''],
      [],
    ).join(EOL),
  )
  .output('./package/antd-color.scss');
