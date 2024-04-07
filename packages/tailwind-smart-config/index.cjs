'use strict';

const { tailwindSmartConfig } = require('./smart.cjs');
const { featureFixing } = require('./fixing.cjs');

module.exports = {
  featureFixing,
  tailwindSmartConfig,
};
