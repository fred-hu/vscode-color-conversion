// @ts-nocheck
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode')
const colorFormat = require('./libs/index')
const { isValidColor, colorWordToRgb } = require('./libs/tools')
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

      const document = editor.document;
      const selections = editor.selections; // 获取所有选区
      const texts = selections.map(selection => {
        // 对于每个选区，使用document.getText(selection)来获取文本
        return document.getText(selection).replace(/\'|\"/g, '');
      });
      if (texts.some(v => isValidColor(v))) {
        vscode.window
          .showQuickPick(['hex', 'rgb', 'rgba', 'hsl', 'hsla'], {
            placeHolder: '选择颜色转换模式'
          })
          .then((res) => {
            const document = editor.document
            editor.edit((editBuilder) => {
              editor.selections.forEach((sel) => {
                const text = editor.document.getText(sel)
                const filterText = text.replace(/\'|\"/g, '');
                if (isValidColor(filterText)) {
                  const range = sel.isEmpty
                    ? document.getWordRangeAtPosition(sel.start) || sel
                    : sel
                  const color = colorFormat({ color: /^[A-Za-z]+$/.test(filterText) ? colorWordToRgb(filterText) : filterText, format: res })
                  const result = text.replace(filterText, color.complete)
                  editBuilder.replace(range, result)
                }
              })
              vscode.window.showInformationMessage('done')
            })
          })
      } else {
        vscode.window.showInformationMessage('no invalid colors')
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
