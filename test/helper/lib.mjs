import prettier from 'prettier';
import resolveConfig from 'tailwindcss/resolveConfig.js';

export function pretty(string) {
  return prettier.format(string, {
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
