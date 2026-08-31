# @css-bit/tailwind-antd-color

Use `@ant-design/colors` as `tailwind colors default`.

[![npm][npm-badge]][npm-url]
[![github][github-badge]][github-url]
![node][node-badge]

[npm-url]: https://www.npmjs.com/package/@css-bit/tailwind-antd-color
[npm-badge]: https://img.shields.io/npm/v/@css-bit/tailwind-antd-color.svg?style=flat-square&logo=npm
[github-url]: https://github.com/airkro/css-bit/tree/master/packages/tailwind-antd-color
[github-badge]: https://img.shields.io/npm/l/@css-bit/tailwind-antd-color.svg?style=flat-square&colorB=blue&logo=github
[node-badge]: https://img.shields.io/node/v/@css-bit/tailwind-antd-color.svg?style=flat-square&colorB=green&logo=node.js

## Installation

```bash
npm install @css-bit/tailwind-antd-color --save-dev
```

## Usage

Tailwind v3:

```mjs
import { tailwindAntdColors } from '@css-bit/tailwind-antd-color';

export default {
  plugins: [
    tailwindAntdColors({
      // color name
      primary: 'green',
      // 0 ~ 255
      grey: 174,
      // start on 0
      10: false
    })
  ]
};
```

Tailwind v4: register the plugin via the `@plugin` directive in your CSS entry file.

```css
@import 'tailwindcss';

@plugin '@css-bit/tailwind-antd-color' {
  primary: green;
  grey: 174;
  10: false;
}
```

> **Breaking change in 0.5.0:** the antd colors are now merged into Tailwind's
> default palette via `theme.extend.colors` instead of replacing it via
> `theme.colors`. Tailwind v4 ignores a plugin's `theme.colors` (it only honors
> `theme.extend.colors`), so this was required for v4 support. As a result the
> built-in colors (`red`, `blue`, `green`, ...) now remain available alongside the
> antd colors on **both** v3 and v4 — previously they were replaced entirely.

## Tips

Use [@css-bit/tailwind-smart-config](../tailwind-smart-config) to add more default color keywords like `black/white/currentColor/transparent/inherit/initial`.
