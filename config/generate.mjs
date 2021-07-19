import { presetPalettes } from '@ant-design/colors';
import { Json, Text } from 'fs-chain';

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
  .output('dist/antd-color.scss')
  .logger('Generate antd colors variables');

new Json()
  .onDone(() =>
    Object.fromEntries(Object.values(Object.fromEntries(all)).flat()),
  )
  .config({ pretty: true })
  .output('dist/antd-color.json')
  .logger('Generate antd colors map');
