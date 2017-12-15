const { generate, presetPalettes } = require("ant-design-palettes");
const { mapValues, reduce, pickBy } = require("lodash");
const os = require("os");
const fs = require("fs-extra");
const { resolve } = require("path");

const neutral = generate("#bfbfbf");
const preset = pickBy(presetPalettes, (_, key) => key !== "grey");

function statement(colorName) {
  return (value, index) => "$" + colorName + "-" + index + ": " + value + ";";
}

const data = reduce(
  mapValues({ neutral, ...preset }, (colors, colorName) =>
    colors.map(statement(colorName))
  ),
  (io, sets, name) => [...io, "//--" + name + "--------", ...sets, ""],
  ["/* stylelint-disable color-hex-length */" + os.EOL]
).join(os.EOL);

fs.outputFileSync(resolve("./package/antd-color.scss"), data);
