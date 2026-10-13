const assert = require('assert')
const {
  isHex,
  isRgb,
  isRgba,
  isHsl,
  isHsla,
  isColor,
  isValidColor,
  colorWordToRgb,
  findColorAt,
  applySpacing,
  applyHexCase
} = require('../../libs/tools')

suite('libs/tools', () => {
  suite('isValidColor', () => {
    test('accepts hex colors', () => {
      ['#fff', '#FFF', '#ffffff', '#abcd', '#ff0000ff'].forEach((color) => {
        assert.strictEqual(isValidColor(color), true, `${color} should be valid`)
      })
    })

    test('accepts rgb and rgba colors', () => {
      ['rgb(255,0,0)', 'rgb(255, 0, 0)', 'RGB(255,0,0)', 'rgba(255,0,0,0.5)', 'rgba(255,0,0,50%)'].forEach((color) => {
        assert.strictEqual(isValidColor(color), true, `${color} should be valid`)
      })
    })

    test('accepts hsl and hsla colors', () => {
      ['hsl(0,100%,50%)', 'hsl(0deg, 100%, 50%)', 'hsla(120,100%,50%,0.25)'].forEach((color) => {
        assert.strictEqual(isValidColor(color), true, `${color} should be valid`)
      })
    })

    test('accepts named colors and transparent', () => {
      ['red', 'Blue', 'rebeccapurple', 'transparent'].forEach((color) => {
        assert.strictEqual(isValidColor(color), true, `${color} should be valid`)
      })
    })

    test('rejects invalid colors', () => {
      [
        '',
        'not-a-color',
        '#ff',
        '#gggggg',
        'rgb(300,0,0)',
        'rgb(255,0)',
        'rgba(255,0,0,2)',
        'hsl(0,200%,50%)'
      ].forEach((color) => {
        assert.strictEqual(isValidColor(color), false, `${color} should be invalid`)
      })
    })
  })

  suite('colorWordToRgb', () => {
    test('converts named colors to rgb', () => {
      assert.strictEqual(colorWordToRgb('red'), 'rgb(255,0,0)')
      assert.strictEqual(colorWordToRgb('RED'), 'rgb(255,0,0)')
      assert.strictEqual(colorWordToRgb('rebeccapurple'), 'rgb(102,51,153)')
    })

    test('converts transparent to rgba', () => {
      assert.strictEqual(colorWordToRgb('transparent'), 'rgba(0,0,0,0)')
    })

    test('returns the input for unknown keywords', () => {
      assert.strictEqual(colorWordToRgb('notacolor'), 'notacolor')
    })
  })

  suite('helpers', () => {
    test('isHex only matches 3/6 digit hex', () => {
      assert.strictEqual(isHex('#fff'), true)
      assert.strictEqual(isHex('#ffffff'), true)
      assert.strictEqual(isHex('#ffff'), false)
    })

    test('detects functional formats', () => {
      assert.strictEqual(isRgb('rgb(1,2,3)'), true)
      assert.strictEqual(isRgba('rgba(1,2,3,.5)'), true)
      assert.strictEqual(isHsl('hsl(1,2%,3%)'), true)
      assert.strictEqual(isHsla('hsla(1,2%,3%,.5)'), true)
      assert.strictEqual(isColor('#fff'), true)
      assert.strictEqual(isColor('rgb(1,2,3)'), true)
    })
  })

  suite('findColorAt', () => {
    test('finds hex colors', () => {
      const found = findColorAt('color: #ff0000;', 10)
      assert.deepStrictEqual(found, { text: '#ff0000', start: 7, end: 14 })
    })

    test('finds functional colors', () => {
      const line = 'background: rgb(255, 0, 0);'
      const found = findColorAt(line, 15)
      assert.strictEqual(found.text, 'rgb(255, 0, 0)')
      assert.strictEqual(line.slice(found.start, found.end), 'rgb(255, 0, 0)')
    })

    test('finds color keywords', () => {
      const found = findColorAt('color: rebeccapurple;', 10)
      assert.strictEqual(found.text, 'rebeccapurple')
    })

    test('returns null for non color words and blank positions', () => {
      assert.strictEqual(findColorAt('const value = 1;', 7), null)
      assert.strictEqual(findColorAt('color: #ff0000;', 3), null)
    })
  })

  suite('applySpacing', () => {
    test('inserts a space after commas when enabled', () => {
      assert.strictEqual(applySpacing('rgb(255,0,0)', true), 'rgb(255, 0, 0)')
      assert.strictEqual(applySpacing('hsla(0,100%,50%,1)', true), 'hsla(0, 100%, 50%, 1)')
    })

    test('keeps the output untouched when disabled', () => {
      assert.strictEqual(applySpacing('rgb(255,0,0)', false), 'rgb(255,0,0)')
      assert.strictEqual(applySpacing('#ff0000', true), '#ff0000')
    })
  })

  suite('applyHexCase', () => {
    test('honours lower and upper modes', () => {
      assert.strictEqual(applyHexCase('#FF0000', '#FF0000', 'lower'), '#ff0000')
      assert.strictEqual(applyHexCase('#ff0000', '#ff0000', 'upper'), '#FF0000')
    })

    test('preserves the case of the original hex value', () => {
      assert.strictEqual(applyHexCase('#ff0000', '#FF0000', 'preserve'), '#FF0000')
      assert.strictEqual(applyHexCase('#FF0000', '#ff0000', 'preserve'), '#ff0000')
      assert.strictEqual(applyHexCase('#ff0000', '#123456', 'preserve'), '#ff0000')
    })

    test('ignores non hex output', () => {
      assert.strictEqual(applyHexCase('rgb(255,0,0)', '#FF0000', 'upper'), 'rgb(255,0,0)')
    })
  })
})
