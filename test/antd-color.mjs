import test from 'ava';

import { tailwindAntdColors } from '@css-bit/tailwind-antd-color';

import { getColors } from './helper/lib.mjs';

function marco(t, config) {
  const colors = getColors(tailwindAntdColors(config));

  t.snapshot(colors);
}

test('default', marco);

test('primary', marco, { primary: 'green' });

test('gray', marco, { grey: 174 });

test('ten', marco, { 10: false });

test('all', marco, { 10: false, grey: 174, primary: 'green' });
