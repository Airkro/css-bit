import plugin from 'tailwindcss/plugin.js';

import { generate, presetPalettes } from '@ant-design/colors';

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

function isGrayAble(grey) {
  return typeof grey === 'number' && grey % 2 === 0 && grey >= 0 && grey <= 255;
}

// This plugin registers no utilities, but the handler must still be a function:
// Tailwind v4 calls it unconditionally and crashes when it is `undefined`.
function emptyHandler() {}

function noopHandler() {
  return emptyHandler;
}

export const tailwindAntdColors = plugin.withOptions(
  noopHandler,
  ({ primary, grey, 10: ten = true } = {}) => {
    delete presetPalettes.grey;

    const antdColors = mapObject(presetPalettes, (name, item) => [
      name,
      picker(item, { ten }),
    ]);
    const colors = {
      ...antdColors,
      ...(isGrayAble(grey) && {
        grey: picker(generateGrey(grey), { ten }),
      }),
      ...(antdColors[primary] && { primary: antdColors[primary] }),
    };

    return { theme: { extend: { colors } } };
  },
);

// `tailwindcss/plugin.js` ships a compatible shim in both v3 and v4, so a single
// `plugin.withOptions(...)` shape works with both engines. The default export is
// what Tailwind v4's `@plugin` directive loads, so it is required despite the
// general preference for named exports.
// eslint-disable-next-line import-x/no-default-export
export default tailwindAntdColors;
