'use strict';

const { presetPalettes, generate } = require('@ant-design/colors');

const blue = '#1677ff';
presetPalettes.blue = generate(blue);
presetPalettes.blue.primary = blue;
delete presetPalettes.grey;

const plugin = require('tailwindcss/plugin');

function mapObject(object, mapper) {
  return Object.fromEntries(
    Object.entries(object).map(([key, value]) => mapper(key, value)),
  );
}

function picker({ primary: DEFAULT, ...item }, { ten }) {
  return {
    DEFAULT,
    ...(ten ? mapObject(item, (no, value) => [Number(no) + 1, value]) : item),
  };
}

function rgb2hex(r, g = r, b = g) {
  // eslint-disable-next-line no-bitwise
  return `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)}`;
}

function generateGrey(value) {
  const primary = rgb2hex(value);
  const io = generate(primary);
  io.primary = primary;

  return io;
}

function grayAble(grey) {
  return typeof grey === 'number' && grey % 2 === 0 && grey >= 0 && grey <= 255;
}

const tailwindAntdColors = plugin.withOptions(
  () => {
    return () => {};
  },
  ({ primary, grey, 10: ten = true } = {}) => {
    const antdColors = mapObject(presetPalettes, (name, item) => [
      name,
      picker(item, { ten }),
    ]);
    const colors = {
      ...antdColors,
      ...(grayAble(grey) && {
        grey: picker(generateGrey(grey), { ten }),
      }),
      ...(antdColors[primary] && { primary: antdColors[primary] }),
    };

    return { theme: { colors } };
  },
);

module.exports = { tailwindAntdColors };
