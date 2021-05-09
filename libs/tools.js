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
module.exports = {
  isHex,
  isRgb,
  isHsl,
  isRgba,
  isHsla,
  isColor
}