const { Text } = require('fs-chain');
const {
  generate,
  presetPalettes: { grey, ...presetPalettes },
} = require('@ant-design/colors');

const neutral = generate('#bfbfbf');

function createColorPalettes() {
  return Object.entries({
    neutral,
    ...presetPalettes,
  })
    .map(([colorName, colors]) =>
      [
        `//--${colorName}--------`,
        ...colors.map(
          (value, index) => `$${colorName}-${index}: ${value} !default;`,
        ),
      ].join('\n'),
    )
    .join('\n\n');
}

new Text()
  .handle(createColorPalettes)
  .output('~antd-color.scss')
  .logger('Generate antd colors');
