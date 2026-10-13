const assert = require('assert')
const colorFormat = require('../../libs/index')

const convert = (color, format) => colorFormat({ color, format }).complete

suite('libs/index (colorFormat)', () => {
  test('converts hex to all supported formats', () => {
    assert.strictEqual(convert('#ff0000', 'hex'), '#f00')
    assert.strictEqual(convert('#ff0000', 'rgb'), 'rgb(255,0,0)')
    assert.strictEqual(convert('#ff0000', 'rgba'), 'rgba(255,0,0,1)')
    assert.strictEqual(convert('#ff0000', 'hsl'), 'hsl(0,100%,50%)')
    assert.strictEqual(convert('#ff0000', 'hsla'), 'hsla(0,100%,50%,1)')
  })

  test('converts functional formats back to hex', () => {
    assert.strictEqual(convert('rgb(255,0,0)', 'hex'), '#f00')
    assert.strictEqual(convert('rgba(255,0,0,1)', 'hex'), '#f00')
    assert.strictEqual(convert('hsl(0,100%,50%)', 'hex'), '#f00')
  })

  test('converts between functional formats', () => {
    assert.strictEqual(convert('rgb(255,0,0)', 'hsl'), 'hsl(0,100%,50%)')
    assert.strictEqual(convert('rgb(255,0,0)', 'rgba'), 'rgba(255,0,0,1)')
    assert.strictEqual(convert('hsl(0,100%,50%)', 'rgba'), 'rgba(255,0,0,1)')
  })

  test('converts named colors', () => {
    assert.strictEqual(convert('red', 'rgb'), 'rgb(255,0,0)')
    assert.strictEqual(convert('blue', 'hex'), '#00f')
  })
})
