import test from 'ava';

import { tailwindAntdColors } from '@css-bit/tailwind-antd-color';

import {
  getColors,
  getColorsV4,
  type AntdColorOptions,
} from './helper/lib.mts';

import type { ExecutionContext } from 'ava';

function marco(t: ExecutionContext, options?: AntdColorOptions): void {
  const colors = getColors(tailwindAntdColors(options));

  t.snapshot(colors);
}

function marcoV4(
  t: ExecutionContext,
  options?: AntdColorOptions,
): Promise<void> {
  return getColorsV4(t, options);
}

test('default', marco);

test('default (v4)', marcoV4);

test('primary', marco, { primary: 'green' });

test('primary (v4)', marcoV4, { primary: 'green' });

test('gray', marco, { grey: 174 });

test('gray (v4)', marcoV4, { grey: 174 });

test('ten', marco, { 10: false });

test('ten (v4)', marcoV4, { 10: false });

test('all', marco, { 10: false, grey: 174, primary: 'green' });

test('all (v4)', marcoV4, { 10: false, grey: 174, primary: 'green' });
