// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
const vscode = require('vscode')
const colorFormat = require('./libs/index')
const {
  isValidColor,
  colorWordToRgb,
  findColorAt,
  applySpacing,
  applyHexCase
} = require('./libs/tools')

const COMMAND_ID = 'color-conversion.colorConversion'
const CONFIG_SECTION = 'color-conversion'
const FORMATS = ['hex', 'rgb', 'rgba', 'hsl', 'hsla']
// 右键菜单里"直接转成某格式"的命令，与 FORMATS 一一对应
const CONVERT_COMMANDS = {
  hex: 'color-conversion.convertToHex',
  rgb: 'color-conversion.convertToRgb',
  rgba: 'color-conversion.convertToRgba',
  hsl: 'color-conversion.convertToHsl',
  hsla: 'color-conversion.convertToHsla'
}
// 由扩展写入的上下文键：当前选中/光标处是否存在可识别的颜色，用于控制右键菜单显隐
const COLOR_CONTEXT_KEY = 'colorConversion.hasColor'
const SUPPORTED_LANGUAGES = [
  'javascript',
  'javascriptreact',
  'typescript',
  'typescriptreact',
  'vue',
  'css',
  'scss',
  'less',
  'stylus',
  'html'
]

const stripQuotes = (text) => text.replace(/['"]/g, '')

const toRgbIfNeeded = (color) => (/^[A-Za-z]+$/.test(color) ? colorWordToRgb(color) : color)

const getOptions = () => {
  const config = vscode.workspace.getConfiguration(CONFIG_SECTION)
  return {
    defaultFormat: config.get('defaultFormat', 'ask'),
    spacing: config.get('spacing', false),
    hexCase: config.get('hexCase', 'lower')
  }
}

/**
 * 颜色文本 -> 目标格式，并按配置套用空格样式与 hex 大小写
 * @param {string} rawColor
 * @param {string} format
 * @param {{ spacing: boolean, hexCase: string }} options
 */
const convertColor = (rawColor, format, options) => {
  const converted = colorFormat({ color: toRgbIfNeeded(rawColor), format }).complete
  return applyHexCase(applySpacing(converted, options.spacing), rawColor, options.hexCase)
}

/**
 * 非空选区直接使用，空选区（光标）取当前位置的颜色
 * @param {vscode.TextDocument} document
 * @param {vscode.Selection} selection
 */
const resolveRange = (document, selection) => {
  if (!selection.isEmpty) {
    return selection
  }
  const line = document.lineAt(selection.start.line).text
  const found = findColorAt(line, selection.start.character)
  if (!found) {
    return null
  }
  return new vscode.Range(selection.start.line, found.start, selection.start.line, found.end)
}

const collectRanges = (document, selections) => {
  const ranges = []
  const seen = new Set()
  selections.forEach((selection) => {
    const range = resolveRange(document, selection)
    if (!range || !isValidColor(stripQuotes(document.getText(range)))) {
      return
    }
    const key = `${range.start.line}:${range.start.character}-${range.end.line}:${range.end.character}`
    if (!seen.has(key)) {
      seen.add(key)
      ranges.push(range)
    }
  })
  return ranges
}

/**
 * 生成一条替换编辑；非法颜色或结果与原文一致时返回 null
 * @param {vscode.TextDocument} document
 * @param {vscode.Range} range
 * @param {string} format
 * @param {{ spacing: boolean, hexCase: string }} options
 */
const buildEdit = (document, range, format, options) => {
  const text = document.getText(range)
  const rawColor = stripQuotes(text)
  if (!isValidColor(rawColor)) {
    return null
  }
  const result = text.replace(rawColor, convertColor(rawColor, format, options))
  return result === text ? null : { range, result }
}

const colorRanges = (editor) => collectRanges(editor.document, editor.selections)

/**
 * 当前编辑器里是否有可识别的颜色（选中或光标处），用于 setContext
 * @param {vscode.TextEditor | undefined} editor
 */
const hasColor = (editor) => !!editor && colorRanges(editor).length > 0

let colorContextValue
const updateColorContext = (editor) => {
  const value = hasColor(editor)
  if (value === colorContextValue) {
    return
  }
  colorContextValue = value
  vscode.commands.executeCommand('setContext', COLOR_CONTEXT_KEY, value)
}

/**
 * 把编辑器里识别到的颜色转成指定格式；返回是否真的改动了文档
 * @param {vscode.TextEditor} editor
 * @param {string} format
 */
async function applyConversion(editor, format) {
  const ranges = colorRanges(editor)
  if (ranges.length === 0) {
    vscode.window.showInformationMessage(vscode.l10n.t('No valid color selected'))
    return false
  }

  const options = getOptions()
  const edits = ranges.map((range) => buildEdit(editor.document, range, format, options)).filter(Boolean)
  if (edits.length === 0) {
    vscode.window.showInformationMessage(vscode.l10n.t('Color is already in {0} format', format))
    return false
  }

  const applied = await editor.edit((editBuilder) => {
    edits.forEach(({ range, result }) => editBuilder.replace(range, result))
  })

  if (applied) {
    vscode.window.showInformationMessage(vscode.l10n.t('Color converted'))
  } else {
    vscode.window.showErrorMessage(vscode.l10n.t('Color conversion failed'))
  }
  return applied
}

/**
 * 右键菜单 / 命令面板：直接把选中（或光标处）的颜色转成指定格式
 * @param {string} format
 */
async function convertSelection(format) {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return
  }
  await applyConversion(editor, format)
}

async function colorConversion() {
  const editor = vscode.window.activeTextEditor
  if (!editor) {
    return // 没有打开的编辑器
  }

  if (colorRanges(editor).length === 0) {
    vscode.window.showInformationMessage(vscode.l10n.t('No valid color selected'))
    return
  }

  const options = getOptions()
  let format = options.defaultFormat
  if (!FORMATS.includes(format)) {
    format = await vscode.window.showQuickPick(FORMATS, {
      placeHolder: vscode.l10n.t('Select a color format')
    })
  }
  if (!format) {
    return // 用户取消，保持文档不变
  }

  await applyConversion(editor, format)
}

const hoverProvider = {
  provideHover(document, position) {
    const line = document.lineAt(position.line).text
    const found = findColorAt(line, position.character)
    if (!found) {
      return null
    }
    const options = getOptions()
    const rows = FORMATS.map((format) => `\`${format}\` ${convertColor(found.text, format, options)}`)
    const markdown = new vscode.MarkdownString(`$(symbol-color) ${found.text}\n\n${rows.join('  \n')}`)
    return new vscode.Hover(markdown)
  }
}

const codeActionProvider = {
  provideCodeActions(document, range) {
    const line = document.lineAt(range.start.line).text
    const found = findColorAt(line, range.start.character)
    if (!found) {
      return []
    }
    const options = getOptions()
    const colorRange = new vscode.Range(range.start.line, found.start, range.start.line, found.end)
    const actions = []
    FORMATS.forEach((format) => {
      const value = convertColor(found.text, format, options)
      if (value === found.text) {
        return
      }
      const action = new vscode.CodeAction(
        vscode.l10n.t('Convert to {0}', format),
        vscode.CodeActionKind.Refactor
      )
      action.edit = new vscode.WorkspaceEdit()
      action.edit.replace(document.uri, colorRange, value)
      actions.push(action)
    })
    return actions
  }
}

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  const registrations = [vscode.commands.registerCommand(COMMAND_ID, colorConversion)]

  Object.keys(CONVERT_COMMANDS).forEach((format) => {
    registrations.push(
      vscode.commands.registerCommand(CONVERT_COMMANDS[format], () => convertSelection(format))
    )
  })

  registrations.push(
    vscode.languages.registerHoverProvider(SUPPORTED_LANGUAGES, hoverProvider),
    vscode.languages.registerCodeActionsProvider(SUPPORTED_LANGUAGES, codeActionProvider, {
      providedCodeActionKinds: [vscode.CodeActionKind.Refactor]
    }),
    vscode.window.onDidChangeTextEditorSelection((event) => updateColorContext(event.textEditor)),
    vscode.window.onDidChangeActiveTextEditor((editor) => updateColorContext(editor)),
    vscode.workspace.onDidChangeTextDocument((event) => {
      const editor = vscode.window.activeTextEditor
      if (editor && event.document === editor.document) {
        updateColorContext(editor)
      }
    })
  )

  context.subscriptions.push(...registrations)
  updateColorContext(vscode.window.activeTextEditor)
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate,
  colorConversion,
  convertSelection,
  updateColorContext,
  hoverProvider,
  codeActionProvider
}