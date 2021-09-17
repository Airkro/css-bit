'use strict';

const test = require('ava').default;

const { Extend } = require('./helper/lib.cjs');

const { tailwindAntdColors } = require('@css-bit/tailwind-antd-color');

const colorNames = [
  'blue',
  'cyan',
  'geekblue',
  'gold',
  'green',
  'lime',
  'magenta',
  'orange',
  'purple',
  'red',
  'volcano',
  'yellow',
];

test('default', (t) => {
  Extend(t);

  const colors = t.getColors(tailwindAntdColors());

  t.falsy(colors.primary);
  t.falsy(colors.grey);

  t.haveAllKeys(colors, colorNames);

  t.values(colors, (colorSet) => {
    t.is(colorSet.DEFAULT, colorSet['6']);
    t.truthy(colorSet['10']);
  });
});

test('primary', (t) => {
  Extend(t);

  const colors = t.getColors(
    tailwindAntdColors({
      primary: 'green',
    }),
  );

  t.falsy(colors.grey);

  t.deepEqual(colors.primary, colors.green);

  t.haveAllKeys(colors, ['primary', ...colorNames]);

  t.values(colors, (colorSet) => {
    t.is(colorSet.DEFAULT, colorSet['6']);
    t.truthy(colorSet['10']);
  });
});

test('gray', (t) => {
  Extend(t);

  const colors = t.getColors(
    tailwindAntdColors({
      grey: 174,
    }),
  );

  t.falsy(colors.primary);
  t.is(colors.grey['6'], '#aeaeae');

  t.haveAllKeys(colors, ['grey', ...colorNames]);

  t.values(colors, (colorSet) => {
    t.is(colorSet.DEFAULT, colorSet['6']);
    t.truthy(colorSet['10']);
  });
});

test('ten', (t) => {
  Extend(t);

  const colors = t.getColors(
    tailwindAntdColors({
      10: false,
    }),
  );

  t.falsy(colors.grey);
  t.falsy(colors.primary);

  t.haveAllKeys(colors, colorNames);

  t.values(colors, (colorSet) => {
    t.is(colorSet.DEFAULT, colorSet['5']);
    t.truthy(colorSet['0']);
  });
});

test('all', (t) => {
  Extend(t);

  const colors = t.getColors(
    tailwindAntdColors({
      10: false,
      grey: 174,
      primary: 'green',
    }),
  );

  t.is(colors.grey['5'], '#aeaeae');

  t.haveAllKeys(colors, ['primary', 'grey', ...colorNames]);

  t.values(colors, (colorSet) => {
    t.is(colorSet.DEFAULT, colorSet['5']);
    t.truthy(colorSet['0']);
  });
});
