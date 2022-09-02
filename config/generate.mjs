import { presetPalettes } from '@ant-design/colors';
import { Text } from 'fs-chain';

const all = Object.entries(presetPalettes).map(([colorName, colors]) => [
  colorName,
  colors.map((value, index) => [`${colorName}-${index}`, value]),
]);

new Text()
  .onDone(() =>
    all
      .map(([colorName, colors]) =>
        [
          `//--${colorName}--------`,
          ...colors.map(([name, value]) => `$${name}: ${value} !default;`),
        ].join('\n'),
      )
      .join('\n\n'),
  )
  .output('~css-bit/dist/antd-color.scss')
  .logger('Generate antd colors variables scss');

new Text()
  .onDone(() =>
    all
      .map(([colorName, colors]) =>
        [
          `//--${colorName}--------`,
          ...colors.map(
            ([name, value]) =>
              `export const ${name.replace('-', '')} = '${value}';`,
          ),
        ].join('\n'),
      )
      .join('\n\n'),
  )
  .output('~css-bit/dist/antd-color.js')
  .logger('Generate antd colors variables js');
