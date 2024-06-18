import { tailwindAntdColors } from '@css-bit/tailwind-antd-color';
import {
  featureFixing,
  tailwindSmartConfig,
} from '@css-bit/tailwind-smart-config';

export default {
  important: true,
  content: ['./{src,packages}/**/*.{html,jsx,js}'],
  safelist: process.env.TAILWIND_ALL ? [{ pattern: /.*/ }] : undefined,
  theme: {
    extend: {
      borderColor: {
        DEFAULT: '#e6e6e6',
      },
    },
  },
  plugins: [
    featureFixing,
    tailwindAntdColors({
      10: false,
      grey: 174,
    }),
    tailwindSmartConfig({
      unit: 'rem',
      spacing: {},
      aspectRatio: {},
      fontSize: {
        small: 'small',
        normal: 'normal',
        large: 'large',
        'x-large': 'x-large',
      },
    }),
  ],
};
