// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const colorFormat = require('./libs/index')
const { isColor, isHex, isRgb, isRgba, isHsl, isHsla } = require('./libs/tools')
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
  let disposable = vscode.commands.registerCommand(
    'color-conversion.colorConversion',
    function () {
      let editor = vscode.window.activeTextEditor
      if (!editor) {
        return // 没有打开的编辑器
      }
      let selection = editor.selection
      let text = editor.document.getText(selection)
      let filterText = text.replace(/\'|\"/g, '')
      if (isColor(filterText)) {
        vscode.window
          .showQuickPick(['hex', 'rgb', 'rgba', 'hsl', 'hsla'], {
            placeHolder: '选择颜色转换模式'
          })
          .then((res) => {
            const document = editor.document
            editor.edit((editBuilder) => {
              editor.selections.forEach((sel) => {
                const range = sel.isEmpty
                  ? document.getWordRangeAtPosition(sel.start) || sel
                  : sel
                // let word = document.getText(range)
                // let reversed = word.split('').reverse().join('')
                const color = colorFormat({ color: filterText, format: res })
                const result = text.replace(filterText, color.complete)
                editBuilder.replace(range, result)
              })
            })
            vscode.window.showInformationMessage('done')
          })
      } else {
        vscode.window.showWarningMessage('invalid color')
      }
    }
  )
  context.subscriptions.push(disposable)
}

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
  activate,
  deactivate
}
