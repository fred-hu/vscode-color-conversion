// CSS 具名颜色 -> HEX，用于把 red / rebeccapurple 等颜色关键字转换成 rgb
const NAMED_COLORS = {
  aliceblue: '#f0f8ff',
  antiquewhite: '#faebd7',
  aqua: '#00ffff',
  aquamarine: '#7fffd4',
  azure: '#f0ffff',
  beige: '#f5f5dc',
  bisque: '#ffe4c4',
  black: '#000000',
  blanchedalmond: '#ffebcd',
  blue: '#0000ff',
  blueviolet: '#8a2be2',
  brown: '#a52a2a',
  burlywood: '#deb887',
  cadetblue: '#5f9ea0',
  chartreuse: '#7fff00',
  chocolate: '#d2691e',
  coral: '#ff7f50',
  cornflowerblue: '#6495ed',
  cornsilk: '#fff8dc',
  crimson: '#dc143c',
  cyan: '#00ffff',
  darkblue: '#00008b',
  darkcyan: '#008b8b',
  darkgoldenrod: '#b8860b',
  darkgray: '#a9a9a9',
  darkgreen: '#006400',
  darkgrey: '#a9a9a9',
  darkkhaki: '#bdb76b',
  darkmagenta: '#8b008b',
  darkolivegreen: '#556b2f',
  darkorange: '#ff8c00',
  darkorchid: '#9932cc',
  darkred: '#8b0000',
  darksalmon: '#e9967a',
  darkseagreen: '#8fbc8f',
  darkslateblue: '#483d8b',
  darkslategray: '#2f4f4f',
  darkslategrey: '#2f4f4f',
  darkturquoise: '#00ced1',
  darkviolet: '#9400d3',
  deeppink: '#ff1493',
  deepskyblue: '#00bfff',
  dimgray: '#696969',
  dimgrey: '#696969',
  dodgerblue: '#1e90ff',
  firebrick: '#b22222',
  floralwhite: '#fffaf0',
  forestgreen: '#228b22',
  fuchsia: '#ff00ff',
  gainsboro: '#dcdcdc',
  ghostwhite: '#f8f8ff',
  gold: '#ffd700',
  goldenrod: '#daa520',
  gray: '#808080',
  green: '#008000',
  greenyellow: '#adff2f',
  grey: '#808080',
  honeydew: '#f0fff0',
  hotpink: '#ff69b4',
  indianred: '#cd5c5c',
  indigo: '#4b0082',
  ivory: '#fffff0',
  khaki: '#f0e68c',
  lavender: '#e6e6fa',
  lavenderblush: '#fff0f5',
  lawngreen: '#7cfc00',
  lemonchiffon: '#fffacd',
  lightblue: '#add8e6',
  lightcoral: '#f08080',
  lightcyan: '#e0ffff',
  lightgoldenrodyellow: '#fafad2',
  lightgray: '#d3d3d3',
  lightgreen: '#90ee90',
  lightgrey: '#d3d3d3',
  lightpink: '#ffb6c1',
  lightsalmon: '#ffa07a',
  lightseagreen: '#20b2aa',
  lightskyblue: '#87cefa',
  lightslategray: '#778899',
  lightslategrey: '#778899',
  lightsteelblue: '#b0c4de',
  lightyellow: '#ffffe0',
  lime: '#00ff00',
  limegreen: '#32cd32',
  linen: '#faf0e6',
  magenta: '#ff00ff',
  maroon: '#800000',
  mediumaquamarine: '#66cdaa',
  mediumblue: '#0000cd',
  mediumorchid: '#ba55d3',
  mediumpurple: '#9370db',
  mediumseagreen: '#3cb371',
  mediumslateblue: '#7b68ee',
  mediumspringgreen: '#00fa9a',
  mediumturquoise: '#48d1cc',
  mediumvioletred: '#c71585',
  midnightblue: '#191970',
  mintcream: '#f5fffa',
  mistyrose: '#ffe4e1',
  moccasin: '#ffe4b5',
  navajowhite: '#ffdead',
  navy: '#000080',
  oldlace: '#fdf5e6',
  olive: '#808000',
  olivedrab: '#6b8e23',
  orange: '#ffa500',
  orangered: '#ff4500',
  orchid: '#da70d6',
  palegoldenrod: '#eee8aa',
  palegreen: '#98fb98',
  paleturquoise: '#afeeee',
  palevioletred: '#db7093',
  papayawhip: '#ffefd5',
  peachpuff: '#ffdab9',
  peru: '#cd853f',
  pink: '#ffc0cb',
  plum: '#dda0dd',
  powderblue: '#b0e0e6',
  purple: '#800080',
  rebeccapurple: '#663399',
  red: '#ff0000',
  rosybrown: '#bc8f8f',
  royalblue: '#4169e1',
  saddlebrown: '#8b4513',
  salmon: '#fa8072',
  sandybrown: '#f4a460',
  seagreen: '#2e8b57',
  seashell: '#fff5ee',
  sienna: '#a0522d',
  silver: '#c0c0c0',
  skyblue: '#87ceeb',
  slateblue: '#6a5acd',
  slategray: '#708090',
  slategrey: '#708090',
  snow: '#fffafa',
  springgreen: '#00ff7f',
  steelblue: '#4682b4',
  tan: '#d2b48c',
  teal: '#008080',
  thistle: '#d8bfd8',
  tomato: '#ff6347',
  turquoise: '#40e0d0',
  violet: '#ee82ee',
  wheat: '#f5deb3',
  white: '#ffffff',
  whitesmoke: '#f5f5f5',
  yellow: '#ffff00',
  yellowgreen: '#9acd32'
}

const HEX_RE = /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i
const FUNCTIONAL_RE = /^(rgba?|hsla?)\(([^()]*)\)$/i
const NUMBER_RE = /^[+-]?(?:\d+\.?\d*|\.\d+)$/
const PERCENT_RE = /^[+-]?(?:\d+\.?\d*|\.\d+)%$/
const DEGREE_RE = /^[+-]?(?:\d+\.?\d*|\.\d+)deg$/i

const hexToRgb = (hex) => {
  let value = hex.replace('#', '')
  if (value.length === 3 || value.length === 4) {
    value = value
      .split('')
      .map((char) => char + char)
      .join('')
  }
  const int = parseInt(value.slice(0, 6), 16)
  return {
    r: (int >> 16) & 255,
    g: (int >> 8) & 255,
    b: int & 255
  }
}

const isChannel = (value) => {
  if (PERCENT_RE.test(value)) {
    const percent = parseFloat(value)
    return percent >= 0 && percent <= 100
  }
  return NUMBER_RE.test(value) && parseFloat(value) >= 0 && parseFloat(value) <= 255
}

const isPercent = (value) => {
  const number = parseFloat(value)
  if (PERCENT_RE.test(value)) {
    return number >= 0 && number <= 100
  }
  return NUMBER_RE.test(value) && number >= 0 && number <= 100
}

const isAlpha = (value) => {
  const number = parseFloat(value)
  if (PERCENT_RE.test(value)) {
    return number >= 0 && number <= 100
  }
  return NUMBER_RE.test(value) && number >= 0 && number <= 1
}

const isHue = (value) => NUMBER_RE.test(value) || DEGREE_RE.test(value)

const isHex = (color) => {
  return /(^#[0-9A-F]{6}$)|(^#[0-9A-F]{3}$)/i.test(color)
}
const isRgb = (color) => {
  return /^rgb\(/i.test(color)
}
const isRgba = (color) => {
  return /^rgba\(/i.test(color)
}
const isHsl = (color) => {
  return /^hsl\(/i.test(color)
}
const isHsla = (color) => {
  return /^hsla\(/i.test(color)
}
const isColor = (color) => {
  return isHex(color) || isRgb(color) || isHsl(color) || isRgba(color) || isHsla(color)
}

const isValidColor = (color) => {
  if (typeof color !== 'string') {
    return false
  }
  const value = color.trim()
  if (HEX_RE.test(value)) {
    return true
  }

  const functional = FUNCTIONAL_RE.exec(value)
  if (functional) {
    const type = functional[1].toLowerCase()
    const args = functional[2].trim().split(/[\s,/]+/).filter(Boolean)
    switch (type) {
      case 'rgb':
        return args.length === 3 && args.every(isChannel)
      case 'rgba':
        return args.length === 4 && args.slice(0, 3).every(isChannel) && isAlpha(args[3])
      case 'hsl':
        return args.length === 3 && isHue(args[0]) && isPercent(args[1]) && isPercent(args[2])
      case 'hsla':
        return args.length === 4 && isHue(args[0]) && isPercent(args[1]) && isPercent(args[2]) && isAlpha(args[3])
      default:
        return false
    }
  }

  const keyword = value.toLowerCase()
  return keyword === 'transparent' || Object.prototype.hasOwnProperty.call(NAMED_COLORS, keyword)
}

const colorWordToRgb = (colorWord) => {
  const keyword = String(colorWord).trim().toLowerCase()
  if (keyword === 'transparent') {
    return 'rgba(0,0,0,0)'
  }
  const hex = NAMED_COLORS[keyword]
  if (!hex) {
    return colorWord
  }
  const { r, g, b } = hexToRgb(hex)
  return `rgb(${r},${g},${b})`
}

// 在一行文本中定位颜色：hex、rgb/rgba、hsl/hsla、颜色关键字
const COLOR_TOKEN_RE = /#[0-9a-fA-F]{3,8}\b|rgba?\([^()]*\)|hsla?\([^()]*\)|[A-Za-z]+/g

/**
 * 返回一行文本中覆盖指定列的颜色 token，未命中返回 null
 * @param {string} line
 * @param {number} character
 */
const findColorAt = (line, character) => {
  COLOR_TOKEN_RE.lastIndex = 0
  let match
  while ((match = COLOR_TOKEN_RE.exec(line))) {
    const start = match.index
    const end = start + match[0].length
    if (character >= start && character <= end && isValidColor(match[0])) {
      return { text: match[0], start, end }
    }
  }
  return null
}

/**
 * 按配置在逗号后补空格，例如 rgb(255, 0, 0)
 * @param {string} text
 * @param {boolean} spacing
 */
const applySpacing = (text, spacing) => (spacing ? text.replace(/,/g, ', ') : text)

/**
 * 调整 hex 输出的大小写
 * @param {string} text 转换结果
 * @param {string} source 原始颜色文本
 * @param {'lower'|'upper'|'preserve'} mode
 */
const applyHexCase = (text, source, mode) => {
  if (text.charAt(0) !== '#') {
    return text
  }
  if (mode === 'upper') {
    return text.toUpperCase()
  }
  if (mode === 'preserve' && /^#[0-9a-fA-F]{3,8}$/.test(source) && /[a-f]/i.test(source)) {
    return /[A-F]/.test(source) ? text.toUpperCase() : text.toLowerCase()
  }
  return text.toLowerCase()
}

module.exports = {
  isHex,
  isRgb,
  isHsl,
  isRgba,
  isHsla,
  isColor,
  isValidColor,
  colorWordToRgb,
  findColorAt,
  applySpacing,
  applyHexCase
}