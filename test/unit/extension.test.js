const assert = require('assert')
const Module = require('module')

// 这些用例在纯 Node 下运行：先把 'vscode' 模块桩掉，再加载 extension.js，
// 这样命令、Hover、Code Action 的逻辑都能不经 VS Code 就被回归覆盖。
const state = {
  info: [],
  errors: [],
  edits: [],
  registrations: [],
  commandHandlers: {},
  contextCalls: [],
  contextValue: undefined,
  pickCalled: false,
  pickResult: undefined,
  config: { defaultFormat: 'ask', spacing: false, hexCase: 'lower' }
}

class Range {
  constructor(startLine, startCharacter, endLine, endCharacter) {
    this.start = { line: startLine, character: startCharacter }
    this.end = { line: endLine, character: endCharacter }
  }
}

class MarkdownString {
  constructor(value) {
    this.value = value
  }
}

class Hover {
  constructor(contents) {
    this.contents = contents
  }
}

class CodeAction {
  constructor(title, kind) {
    this.title = title
    this.kind = kind
  }
}

class WorkspaceEdit {
  constructor() {
    this.operations = []
  }

  replace(uri, range, text) {
    this.operations.push({ uri, range, text })
  }
}

const vscodeStub = {
  Range,
  MarkdownString,
  Hover,
  CodeAction,
  WorkspaceEdit,
  CodeActionKind: { Refactor: { value: 'refactor' } },
  window: {
    activeTextEditor: null,
    showInformationMessage(message) {
      state.info.push(message)
      return Promise.resolve()
    },
    showErrorMessage(message) {
      state.errors.push(message)
      return Promise.resolve()
    },
    showQuickPick() {
      state.pickCalled = true
      return Promise.resolve(state.pickResult)
    },
    onDidChangeTextEditorSelection(callback) {
      state.registrations.push('selectionListener')
      state.selectionListener = callback
      return { dispose() {} }
    },
    onDidChangeActiveTextEditor(callback) {
      state.registrations.push('activeEditorListener')
      state.activeEditorListener = callback
      return { dispose() {} }
    }
  },
  commands: {
    registerCommand(id, handler) {
      state.commandHandlers[id] = handler
      state.registrations.push('command')
      return { dispose() {} }
    },
    executeCommand(command, key, value) {
      if (command === 'setContext') {
        state.contextCalls.push({ key, value })
        state.contextValue = value
      }
      return Promise.resolve()
    }
  },
  languages: {
    registerHoverProvider() {
      state.registrations.push('hover')
      return { dispose() {} }
    },
    registerCodeActionsProvider(selector, provider, metadata) {
      state.registrations.push('codeAction')
      state.codeActionMetadata = metadata
      return { dispose() {} }
    }
  },
  workspace: {
    getConfiguration() {
      return {
        get(key, fallback) {
          return state.config[key] === undefined ? fallback : state.config[key]
        }
      }
    },
    onDidChangeTextDocument(callback) {
      state.registrations.push('documentListener')
      state.documentListener = callback
      return { dispose() {} }
    }
  },
  l10n: {
    t(message, ...args) {
      return message.replace(/\{(\d+)\}/g, (match, index) => String(args[Number(index)]))
    }
  }
}

const originalLoad = Module._load
Module._load = function (request) {
  if (request === 'vscode') {
    return vscodeStub
  }
  return originalLoad.apply(this, arguments)
}
const extension = require('../../extension.js')
Module._load = originalLoad

const context = { subscriptions: [] }
extension.activate(context)

const makeDocument = (lines) => {
  const text = lines.join('\n')
  return {
    uri: { toString: () => 'file:///test.js' },
    lineAt(line) {
      return { text: lines[line] }
    },
    getText(range) {
      if (!range) {
        return text
      }
      const { start, end } = range
      if (start.line === end.line) {
        return lines[start.line].slice(start.character, end.character)
      }
      const parts = [lines[start.line].slice(start.character)]
      for (let i = start.line + 1; i < end.line; i++) {
        parts.push(lines[i])
      }
      parts.push(lines[end.line].slice(0, end.character))
      return parts.join('\n')
    }
  }
}

const makeEditor = (lines, selections) => ({
  document: makeDocument(lines),
  selections,
  edit(callback) {
    const operations = []
    callback({ replace: (range, value) => operations.push({ range, value }) })
    state.edits.push(operations)
    return Promise.resolve(true)
  }
})

const selection = (startCharacter, endCharacter, line = 0) => ({
  start: { line, character: startCharacter },
  end: { line, character: endCharacter },
  isEmpty: startCharacter === endCharacter
})

const reset = (config, pickResult) => {
  state.info = []
  state.errors = []
  state.edits = []
  state.pickCalled = false
  state.pickResult = pickResult
  state.config = Object.assign({ defaultFormat: 'ask', spacing: false, hexCase: 'lower' }, config)
}

const CONVERT_COMMAND_IDS = [
  'color-conversion.convertToHex',
  'color-conversion.convertToRgb',
  'color-conversion.convertToRgba',
  'color-conversion.convertToHsl',
  'color-conversion.convertToHsla'
]

const convert = async (lines, selections, config = {}, pickResult, noEditor) => {
  reset(config, pickResult)
  vscodeStub.window.activeTextEditor = noEditor ? null : makeEditor(lines, selections)
  await state.commandHandlers['color-conversion.colorConversion']()
}

const runConvertCommand = async (id, lines, selections, config = {}, noEditor) => {
  reset(config, undefined)
  vscodeStub.window.activeTextEditor = noEditor ? null : makeEditor(lines, selections)
  await state.commandHandlers[id]()
}

suite('extension activation', () => {
  test('registers the command, hover and code action providers', () => {
    assert.ok(state.commandHandlers['color-conversion.colorConversion'])
    assert.ok(state.commandHandlers['color-conversion.convertToRgb'])
    assert.deepStrictEqual(state.registrations, [
      'command',
      'command',
      'command',
      'command',
      'command',
      'command',
      'hover',
      'codeAction',
      'selectionListener',
      'activeEditorListener',
      'documentListener'
    ])
    assert.strictEqual(context.subscriptions.length, 11)
  })

  test('registers one direct conversion command per format', () => {
    CONVERT_COMMAND_IDS.forEach((id) => {
      assert.strictEqual(typeof state.commandHandlers[id], 'function', `${id} should be registered`)
    })
  })

  test('exposes a refactor code action kind', () => {
    assert.strictEqual(state.codeActionMetadata.providedCodeActionKinds.length, 1)
  })
})

suite('extension conversion command', () => {
  test('cancelling the quick pick leaves the document untouched', async () => {
    await convert(['color: #ffffff;'], [selection(7, 14)], {}, undefined)
    assert.strictEqual(state.edits.length, 0)
    assert.deepStrictEqual(state.info, [])
  })

  test('a configured defaultFormat skips the quick pick', async () => {
    await convert(['color: #ffffff;'], [selection(7, 14)], { defaultFormat: 'rgb' }, undefined)
    assert.strictEqual(state.pickCalled, false)
    assert.strictEqual(state.edits[0][0].value, 'rgb(255,255,255)')
    assert.deepStrictEqual(state.info, ['Color converted'])
  })

  test('keeps the surrounding quotes', async () => {
    await convert(['color: "#ffffff";'], [selection(7, 16)], { defaultFormat: 'rgb' }, undefined)
    assert.strictEqual(state.edits[0][0].value, '"rgb(255,255,255)"')
  })

  test('applies the spacing setting', async () => {
    await convert(['color: #ffffff;'], [selection(7, 14)], { defaultFormat: 'rgb', spacing: true }, undefined)
    assert.strictEqual(state.edits[0][0].value, 'rgb(255, 255, 255)')
  })

  test('applies the hexCase setting', async () => {
    await convert(['color: rgb(255,0,0);'], [selection(7, 19)], { defaultFormat: 'hex', hexCase: 'upper' }, undefined)
    assert.strictEqual(state.edits[0][0].value, '#F00')

    await convert(['color: #FF0000;'], [selection(7, 14)], { defaultFormat: 'hex', hexCase: 'preserve' }, undefined)
    assert.strictEqual(state.edits[0][0].value, '#F00')
  })

  test('converts a color under the cursor without a selection', async () => {
    await convert(['color: #ffffff;'], [selection(9, 9)], { defaultFormat: 'rgb' }, undefined)
    assert.strictEqual(state.edits[0][0].value, 'rgb(255,255,255)')

    await convert(['a: rgb(255,0,0);'], [selection(8, 8)], { defaultFormat: 'hsl' }, undefined)
    assert.strictEqual(state.edits[0][0].value, 'hsl(0,100%,50%)')

    await convert(['color: red;'], [selection(8, 8)], { defaultFormat: 'rgb' }, undefined)
    assert.strictEqual(state.edits[0][0].value, 'rgb(255,0,0)')
  })

  test('converts every selection with a single edit', async () => {
    await convert(
      ['a: #ff0000;', 'b: red;'],
      [selection(3, 10, 0), selection(4, 4, 1)],
      { defaultFormat: 'hsl' },
      undefined
    )
    assert.strictEqual(state.edits.length, 1)
    assert.strictEqual(state.edits[0].length, 2)
    assert.strictEqual(state.edits[0][0].value, 'hsl(0,100%,50%)')
    assert.strictEqual(state.edits[0][1].value, 'hsl(0,100%,50%)')
  })

  test('de-duplicates identical selections', async () => {
    await convert(['a: #ff0000;'], [selection(3, 10), selection(3, 10)], { defaultFormat: 'rgb' }, undefined)
    assert.strictEqual(state.edits[0].length, 1)
  })

  test('reports when nothing valid is selected', async () => {
    await convert(['const a = 1;'], [selection(6, 7)], { defaultFormat: 'rgb' }, undefined)
    assert.strictEqual(state.edits.length, 0)
    assert.deepStrictEqual(state.info, ['No valid color selected'])
  })

  test('reports when the color already uses the target format', async () => {
    await convert(['a: #fff;'], [selection(3, 7)], { defaultFormat: 'hex' }, undefined)
    assert.strictEqual(state.edits.length, 0)
    assert.deepStrictEqual(state.info, ['Color is already in hex format'])
  })

  test('does nothing without an active editor', async () => {
    await convert([], [], {}, undefined, true)
    assert.strictEqual(state.info.length, 0)
    assert.strictEqual(state.edits.length, 0)
  })
})

suite('extension hover provider', () => {
  test('lists every format for the color under the cursor', () => {
    const document = makeDocument(['color: #ff0000;'])
    const hover = extension.hoverProvider.provideHover(document, { line: 0, character: 10 })
    assert.ok(hover)
    assert.ok(hover.contents.value.includes('rgb(255,0,0)'))
    assert.ok(hover.contents.value.includes('hsl(0,100%,50%)'))
  })

  test('ignores positions that are not a color', () => {
    const document = makeDocument(['color: #ff0000;'])
    assert.strictEqual(extension.hoverProvider.provideHover(document, { line: 0, character: 2 }), null)
  })
})

suite('extension code action provider', () => {
  test('offers a conversion per format, skipping the current one', () => {
    const document = makeDocument(['a: #f00;'])
    const actions = extension.codeActionProvider.provideCodeActions(document, new Range(0, 4, 0, 4))
    assert.strictEqual(actions.length, 4)
    const rgb = actions.find((action) => action.title === 'Convert to rgb')
    assert.ok(rgb)
    assert.strictEqual(rgb.edit.operations[0].text, 'rgb(255,0,0)')
    assert.strictEqual(rgb.edit.operations[0].range.start.character, 3)
    assert.strictEqual(rgb.edit.operations[0].range.end.character, 7)
  })

  test('offers nothing when there is no color', () => {
    const document = makeDocument(['const a = 1;'])
    assert.deepStrictEqual(extension.codeActionProvider.provideCodeActions(document, new Range(0, 6, 0, 6)), [])
  })
})

suite('extension direct conversion commands', () => {
  test('converts the selected color with a single command', async () => {
    await runConvertCommand('color-conversion.convertToRgb', ['color: #ff0000;'], [selection(7, 14)])
    assert.strictEqual(state.edits.length, 1)
    assert.strictEqual(state.edits[0][0].value, 'rgb(255,0,0)')
    assert.deepStrictEqual(state.info, ['Color converted'])
  })

  test('honours the spacing and hexCase settings', async () => {
    await runConvertCommand(
      'color-conversion.convertToRgba',
      ['color: #ff0000;'],
      [selection(7, 14)],
      { spacing: true }
    )
    assert.strictEqual(state.edits[0][0].value, 'rgba(255, 0, 0, 1)')

    await runConvertCommand(
      'color-conversion.convertToHex',
      ['color: rgb(255,0,0);'],
      [selection(7, 19)],
      { hexCase: 'upper' }
    )
    assert.strictEqual(state.edits[0][0].value, '#F00')
  })

  test('converts a color under the cursor and every selection', async () => {
    await runConvertCommand('color-conversion.convertToHex', ['color: red;'], [selection(8, 8)])
    assert.strictEqual(state.edits[0][0].value, '#f00')

    await runConvertCommand(
      'color-conversion.convertToHsl',
      ['a: #ff0000;', 'b: red;'],
      [selection(3, 10, 0), selection(4, 4, 1)]
    )
    assert.strictEqual(state.edits[0].length, 2)
  })

  test('reports when nothing valid is selected', async () => {
    await runConvertCommand('color-conversion.convertToRgb', ['const a = 1;'], [selection(6, 7)])
    assert.strictEqual(state.edits.length, 0)
    assert.deepStrictEqual(state.info, ['No valid color selected'])
  })

  test('reports when the color already uses the target format', async () => {
    await runConvertCommand('color-conversion.convertToHex', ['a: #fff;'], [selection(3, 7)])
    assert.strictEqual(state.edits.length, 0)
    assert.deepStrictEqual(state.info, ['Color is already in hex format'])
  })

  test('does nothing without an active editor', async () => {
    await runConvertCommand('color-conversion.convertToRgb', [], [], {}, true)
    assert.strictEqual(state.edits.length, 0)
    assert.strictEqual(state.info.length, 0)
  })
})

suite('extension color context key', () => {
  const emitSelection = (lines, selections) => {
    const editor = makeEditor(lines, selections)
    vscodeStub.window.activeTextEditor = editor
    state.selectionListener({ textEditor: editor })
  }

  test('tracks whether the selection holds a color', () => {
    emitSelection(['color: #ff0000;'], [selection(7, 14)])
    assert.strictEqual(state.contextValue, true)

    emitSelection(['const a = 1;'], [selection(6, 7)])
    assert.strictEqual(state.contextValue, false)

    emitSelection(['color: red;'], [selection(8, 8)])
    assert.strictEqual(state.contextValue, true)
  })

  test('uses the colorConversion.hasColor context key', () => {
    assert.ok(state.contextCalls.length > 0, 'setContext should have been called')
    assert.ok(
      state.contextCalls.every((call) => call.key === 'colorConversion.hasColor'),
      'every call should target colorConversion.hasColor'
    )
  })

  test('reacts to the active editor changing', () => {
    vscodeStub.window.activeTextEditor = makeEditor(['const a = 1;'], [selection(6, 7)])
    state.activeEditorListener(vscodeStub.window.activeTextEditor)
    assert.strictEqual(state.contextValue, false)

    vscodeStub.window.activeTextEditor = makeEditor(['a: #00ff00;'], [selection(3, 10)])
    state.activeEditorListener(vscodeStub.window.activeTextEditor)
    assert.strictEqual(state.contextValue, true)
  })
})
