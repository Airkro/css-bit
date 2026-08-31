# @css-bit/tailwind-smart-config

Smart tailwind configuration modifier.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@css-bit/tailwind-smart-config
[npm-badge]: https://img.shields.io/npm/v/@css-bit/tailwind-smart-config.svg?style=flat-square&logo=npm
[github-url]: https://github.com/airkro/css-bit/tree/master/packages/tailwind-smart-config
[github-badge]: https://img.shields.io/npm/l/@css-bit/tailwind-smart-config.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@css-bit/tailwind-smart-config.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```bash
npm install @css-bit/tailwind-smart-config --save-dev
```

## Usage

Tailwind v3:

```mjs
import { tailwindSmartConfig } from '@css-bit/tailwind-smart-config';

export default {
  plugins: [tailwindSmartConfig()]
};
```

Tailwind v4: `tailwindSmartConfig` takes nested options, which v4's `@plugin`
directive cannot express (it only accepts a flat list of declarations), so load
it through the `@config` directive with a v3-style config file instead.

```js
// tailwind.config.js
import { tailwindSmartConfig } from '@css-bit/tailwind-smart-config';

export default {
  plugins: [
    tailwindSmartConfig({
      spacing: { sm: 10, md: 20 },
      unit: 'rpx'
    })
  ]
};
```

```css
/* app.css */
@import 'tailwindcss';
@config '../tailwind.config.js';
```

`featureFixing` takes no options, so it can go straight into `@plugin`:

```css
@import 'tailwindcss';

@plugin '@css-bit/tailwind-smart-config/fixing.mjs';
```

### Tailwind v4 limitations

These come from v4 itself, not from this plugin:

- Custom `background-size` values containing `/` are not available, e.g.
  `bg-y-2/3` and `bg-x-1/10`. v4 does not extend `background-size` through the
  theme, and it rejects escaped `/` in `addUtilities` selectors. Use v4's own
  arbitrary values (`bg-[length:auto_66.67%]`) or switch the `dash` option to
  avoid slashes. Values without a slash (`bg-cover`, `bg-half`) work as usual.
- Some utilities render differently under v4:
  - Negative margins are emitted as `calc(160rpx * -1)` instead of `-160rpx`.
    Same computed value.
  - `border-*` also sets `border-style`, and the directional utilities
    (`border-l` and friends) additionally set `border-width: 1px`. In v3
    `border-0 border-l` leaves `border-width: 0`; in v4 the `border-l` wins and
    the result is `1px`.
  - `@apply` emits utilities in v4's cascade order rather than in the order
    they were written, so declarations that override each other can resolve
    differently. `rounded-b-0 rounded-r-lg` gives a bottom-right radius of
    `10px` in v3 but `0` in v4.
  - v4 keeps every declaration while v3's optimiser drops the ones that end up
    overridden. The computed result is unaffected.

## Related

- [@css-bit/tailwind-antd-color](../tailwind-antd-color)
