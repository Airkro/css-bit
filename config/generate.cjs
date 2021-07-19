'use strict';

const { Text, Json } = require('fs-chain');
const {
  generate,
  presetPalettes: { grey, ...presetPalettes },
} = require('@ant-design/colors');

const neutral = generate('#bfbfbf');

const all = Object.entries({
  neutral,
  ...presetPalettes,
}).map(([colorName, colors]) => [
  colorName,
  colors.map((value, index) => [`${colorName}-${index}`, value]),
]);

new Text()
  .handle(() =>
    all
      .map(([colorName, colors]) =>
        [
          `//--${colorName}--------`,
          ...colors.map(([name, value]) => `$${name}: ${value} !default;`),
        ].join('\n'),
      )
      .join('\n\n'),
  )
  .output('~dist/antd-color.scss')
  .logger('Generate antd colors variables');

new Json()
  .handle(() =>
    Object.fromEntries(Object.values(Object.fromEntries(all)).flat()),
  )
  .config({ pretty: true })
  .output('~dist/antd-color.json')
  .logger('Generate antd colors map');
