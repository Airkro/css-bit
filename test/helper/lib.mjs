import { tailwindSmartConfig } from '@css-bit/tailwind-smart-config';
import postcss from 'postcss';
import { format } from 'prettier';
import tailwindcss from 'tailwindcss';
import resolveConfig from 'tailwindcss/resolveConfig.js';

export function pretty(string) {
  return format(string, {
    parser: 'css',
    singleQuote: true,
  });
}

export function getConfig(plugin, config) {
  return resolveConfig({
    ...config,
    plugins: [plugin],
  });
}

export function getTheme(plugin, config) {
  return getConfig(plugin, config).theme;
}

export function getColors(plugin, config) {
  return getTheme(plugin, config).colors;
}

export function css([string]) {
  return string.split('/* - */', 2).map((code) => pretty(code));
}

export async function processFile(t, source, plugin) {
  const instance = tailwindcss({
    plugins: plugin ? [plugin] : [],
  });

  const processor = postcss([instance]);

  const result = await processor.process(await source, { from: '.' });

  t.snapshot(pretty(result.css));

  t.is(result.warnings().length, 0);
}

export async function processFileSmart(t, source, options) {
  return processFile(t, source, tailwindSmartConfig(options));
}
