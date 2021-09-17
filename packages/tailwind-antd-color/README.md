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

```cjs
const { tailwindAntdColors } = require('@css-bit/tailwind-antd-color');

module.exports = {
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

## Tips

Use [@css-bit/tailwind-smart-config](../tailwind-smart-config) to add more default color keywords like `black/white/currentColor/transparent/inherit/initial`.
