import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

import { presetPalettes } from '@ant-design/colors';
import tailwindcssV4 from '@tailwindcss/postcss';
import postcss, { parse } from 'postcss';
import { format } from 'prettier';
import tailwindcssV3 from 'tailwindcss-v3';
import resolveConfig from 'tailwindcss-v3/resolveConfig.js';

import { tailwindSmartConfig } from '@css-bit/tailwind-smart-config';

import type { tailwindAntdColors } from '@css-bit/tailwind-antd-color';
import type { ExecutionContext } from 'ava';
import type { Config as TailwindV3Config } from 'tailwindcss-v3';

// Reference the plugin by its package name, exactly the way the README
// documents it, so the tests exercise the real-world `@plugin` usage.
const v4PluginPath = '@css-bit/tailwind-antd-color';

// `source(none)` disables v4's automatic content detection. Without it v4 scans
// the whole project directory for candidates, so classes from unrelated test
// cases leak into every snapshot and couple the tests to each other.
const v4Import = '@import "tailwindcss" source(none);';

// The plugins under test come from packages that resolve `tailwindcss/plugin.js`
// against different majors (v3 or v4), and those plugin types are not mutually
// assignable, so they are passed around opaquely and cast at the engine call.
type TailwindPlugin = object;

export type SmartConfigOptions = Parameters<typeof tailwindSmartConfig>[0];

export type AntdColorOptions = Parameters<typeof tailwindAntdColors>[0];

export type ColorMap = Record<string, string | Record<string, string>>;

// v4 emits a lot of engine boilerplate (version comment, layer statements,
// theme variables, preflight and `@property` declarations) that shifts between
// patch releases and drowns out the rules we actually want to assert. Strip it
// so the v4 snapshots stay as focused as the v3 ones.
function stripV4Boilerplate(input: string): string {
  const boilerplateLayers = new Set(['theme', 'base', 'properties']);

  const root = parse(input);

  root.nodes = root.nodes
    .filter((node) => {
      if (node.type === 'comment') {
        return false;
      }
      if (node.type === 'atrule' && node.name === 'property') {
        return false;
      }
      if (
        node.type === 'atrule' &&
        node.name === 'layer' &&
        boilerplateLayers.has(node.params)
      ) {
        return false;
      }
      return true;
    })
    // drop the `@layer ...;` statements and empty layer blocks left behind
    .filter(
      (node) =>
        !(
          node.type === 'atrule' &&
          node.name === 'layer' &&
          (!node.nodes || node.nodes.length === 0)
        ),
    );

  return root.toString();
}

export function pretty(source: string): Promise<string> {
  return format(source, {
    parser: 'css',
    singleQuote: true,
  });
}

export function getConfig(
  plugin: TailwindPlugin,
  config?: Partial<TailwindV3Config>,
): ReturnType<typeof resolveConfig> {
  return resolveConfig({
    ...config,
    plugins: [plugin],
  } as TailwindV3Config);
}

export function getTheme(
  plugin: TailwindPlugin,
  config?: Partial<TailwindV3Config>,
): ReturnType<typeof resolveConfig>['theme'] {
  return getConfig(plugin, config).theme;
}

export function getColors(
  plugin: TailwindPlugin,
  config?: Partial<TailwindV3Config>,
): ColorMap {
  // Tailwind's own `DefaultColors` type has no index signature, so it has to go
  // through `unknown` to reach the looser shape the tests snapshot.
  return getTheme(plugin, config).colors as unknown as ColorMap;
}

export function css(strings: TemplateStringsArray): string {
  return strings[0] ?? '';
}

// Tailwind v3: process source through the v3 postcss plugin.
export async function processFileV3(
  t: ExecutionContext,
  source: string,
  plugins: readonly TailwindPlugin[] = [],
): Promise<void> {
  // `content` is required by Tailwind's types but not by its runtime; an empty
  // array matches what v3 defaults to, so utilities still resolve through
  // `@apply` without scanning any files.
  const instance = tailwindcssV3({
    content: [],
    plugins: plugins as TailwindV3Config['plugins'],
  });

  const processor = postcss([instance]);

  const result = await processor.process(source, { from: '.' });

  t.snapshot(await pretty(result.css));

  t.is(result.warnings().length, 0);
}

// Tailwind v4: load the plugin via the `@plugin` directive, which is the
// canonical way to register a JS plugin in v4.
function optionsToCss(options: Record<string, unknown> = {}): string {
  return Object.entries(options)
    .map(([key, value]) => {
      const v = typeof value === 'string' ? value : JSON.stringify(value);
      return `  ${key}: ${v};`;
    })
    .join('\n');
}

export async function processFileV4(
  t: ExecutionContext,
  source: string,
  options: Record<string, unknown> = {},
): Promise<void> {
  const block =
    Object.keys(options).length > 0
      ? `@plugin "${v4PluginPath}" {\n${optionsToCss(options)}\n}`
      : `@plugin "${v4PluginPath}";`;
  const input = `${v4Import}\n${block}\n${source}`;
  const result = await postcss([tailwindcssV4()]).process(input, {
    from: undefined,
  });

  t.snapshot(await pretty(stripV4Boilerplate(result.css)));
}

// Run a source through both v3 and v4 and snapshot each.
export async function processFile(
  t: ExecutionContext,
  source: string,
  v3Plugins: readonly TailwindPlugin[] = [],
  v4Options: Record<string, unknown> = {},
): Promise<void> {
  await processFileV3(t, source, v3Plugins);
  await processFileV4(t, source, v4Options);
}

// `tailwindSmartConfig` takes nested options, which v4's `@plugin` directive
// cannot express (it only accepts a flat list of declarations), so v4 loads it
// through `@config` with a v3-style config file instead.
//
// `@config` takes a file path, so one is generated per distinct option set. The
// files live in `test/_v4/` — the leading underscore keeps AVA from treating
// them as test files.
const v4ConfigDir = fileURLToPath(new URL('../_v4/', import.meta.url));

function smartConfigPath(options: SmartConfigOptions): string {
  const hash = createHash('sha1')
    .update(JSON.stringify(options ?? null))
    .digest('hex')
    .slice(0, 10);
  const file = join(v4ConfigDir, `smart-${hash}.mjs`);

  mkdirSync(v4ConfigDir, { recursive: true });
  writeFileSync(
    file,
    `import { tailwindSmartConfig } from '@css-bit/tailwind-smart-config';\n\nexport default { plugins: [tailwindSmartConfig(${JSON.stringify(options)})] };\n`,
  );

  // CSS `@config "…"` needs forward slashes, even on Windows
  return file.replaceAll('\\', '/');
}

export async function processFileSmartV4(
  t: ExecutionContext,
  source: string,
  options?: SmartConfigOptions,
  v4Plugins: readonly string[] = [],
): Promise<void> {
  // v4 caches `@config` files by path, so each option set needs its own file or
  // a later case silently reuses an earlier one.
  const config = smartConfigPath(options);
  const extra = v4Plugins.map((path) => `@plugin "${path}";`).join('\n');
  const input = `${v4Import}\n@config "${config}";\n${extra}\n${source}`;
  const result = await postcss([tailwindcssV4()]).process(input, {
    from: undefined,
  });

  t.snapshot(await pretty(stripV4Boilerplate(result.css)));
}

export async function processFileSmart(
  t: ExecutionContext,
  source: string,
  options?: SmartConfigOptions,
  plugins: readonly TailwindPlugin[] = [],
  v4Plugins: readonly string[] = [],
): Promise<void> {
  await processFileV3(t, source, [
    tailwindSmartConfig(options) as TailwindPlugin,
    ...plugins,
  ]);
  await processFileSmartV4(t, source, options, v4Plugins);
}

// v3-only variant, for cases that rely on behaviour v4 does not provide.
export async function processFileSmartV3Only(
  t: ExecutionContext,
  source: string,
  options?: SmartConfigOptions,
  plugins: readonly TailwindPlugin[] = [],
): Promise<void> {
  return processFileV3(t, source, [
    tailwindSmartConfig(options) as TailwindPlugin,
    ...plugins,
  ]);
}

// `Palette` from `@ant-design/colors` is an array with an optional `primary`
// member, which is not assignable to `Record<string, string>`. Only its own
// enumerable keys are read here, so `object` is the honest parameter type.
function shadesOf(item: object, isTen: boolean): number[] {
  return Object.keys(item)
    .filter((key) => /^\d+$/.test(key))
    .map((key) => (isTen ? Number(key) + 1 : Number(key)));
}

// Tailwind v4: enumerate every antd color so their generated values can be
// snapshotted the same way v3's `getColors` does.
export function v4ColorKeys(options: AntdColorOptions = {}): string[] {
  const isTen = options[10] !== false;
  const names = Object.keys(presetPalettes).filter((name) => name !== 'grey');
  const keys: string[] = [];

  for (const name of names) {
    const palette = presetPalettes[name];
    if (palette) {
      for (const shade of shadesOf(palette, isTen)) {
        keys.push(`${name}-${shade}`);
      }
    }
  }

  if (options.grey !== undefined) {
    for (let i = 0; i < 10; i += 1) {
      keys.push(`grey-${isTen ? i + 1 : i}`);
    }
  }

  if (options.primary) {
    const palette = presetPalettes[options.primary];
    if (palette) {
      for (const shade of shadesOf(palette, isTen)) {
        keys.push(`primary-${shade}`);
      }
    }
  }

  return keys;
}

export async function getColorsV4(
  t: ExecutionContext,
  options: AntdColorOptions = {},
): Promise<void> {
  const keys = v4ColorKeys(options);
  const rules = keys
    .map((key) => `.c-${key} { @apply text-${key}; }`)
    .join('\n');
  const input = `${v4Import}
@plugin "${v4PluginPath}" {
${optionsToCss(options)}
}
${rules}`;
  const result = await postcss([tailwindcssV4()]).process(input, {
    from: undefined,
  });

  const regex = /\.c-([a-z0-9-]+)\s*\{[^}]*?color:\s*(#[0-9a-fA-F]{6})/g;
  const map = Object.fromEntries(
    Iterator.from(result.css.matchAll(regex)).map(([, key, value]) => [
      key,
      value,
    ]),
  );

  // Guard against a silent regression: if v4 ever stops inlining the color as
  // `#rrggbb` (e.g. switches to `oklch()`), the extraction above would yield an
  // empty map and the snapshot alone would still pass happily.
  t.deepEqual(
    Object.keys(map).toSorted((a, b) => a.localeCompare(b)),
    keys.toSorted((a, b) => a.localeCompare(b)),
  );

  t.snapshot(map);
}
