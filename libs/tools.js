const jsdom = require("jsdom");
const { JSDOM } = jsdom;

const dom = new JSDOM(`<!DOCTYPE html><p>Hello Color conversion</p>`);

const isHex = (color) => {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)
}
const isRgb = (color) => {
  return /^rgb\(/.test(color)
}
const isRgba = (color) => {
  return /^rgba\(/.test(color)
}
const isHsl = (color) => {
  return /^hsl\(/.test(color)
}
const isHsla = (color) => {
  return /^hsla\(/.test(color)
}
const isColor = (color) => {
  return isHex(color) || isRgb(color) || isHsl(color) || isRgba(color) || isHsla(color)
}

const isValidColor = (color) => {
  let otpNode = new dom.window.Option()
  otpNode.style.color = color
  return !!otpNode.style.color
}

const colorWordToRgb = (colorWord) => {
  // 创建一个临时的DOM元素来应用样式
  let div = dom.window.document.createElement("div");
  div.style.color = colorWord;
  dom.window.document.body.appendChild(div)
  // 获取计算后的样式
  let style = dom.window.getComputedStyle(div);
  let color = style.color;
  dom.window.document.body.removeChild(div);
  return color;
}

module.exports = {
  isHex,
  isRgb,
  isHsl,
  isRgba,
  isHsla,
  isColor,
  isValidColor,
  colorWordToRgb
}