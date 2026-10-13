# Change Log

All notable changes to the "color-conversion" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]
### 修复
- 取消颜色格式选择后仍会修改文档
- 光标停留在颜色上（未选中）时无法转换
- 编辑失败时仍提示成功、无有效颜色时的提示文案语义相反
- 右键菜单 `when` 条件正则未转义、未锚定（`resourceFilename =~ /.js|.vue|.../`），改用 `resourceExtname`
- `npm test` 跑不起来：`glob` v10 已不支持回调式调用，集成测试改为 promise API，并限定只收集 `test/suite`

### 优化
- 移除 `jsdom` 依赖，改用纯 JS 校验颜色与解析具名颜色
- ESLint 迁移到 9 + flat config（需要 Node ≥18；已用 `volta` 字段与 `.nvmrc` 固定为 Node 20）
- 测试框架由已废弃的 `vscode-test` 迁移到 `@vscode/test-electron`，移除未使用的 `typescript` 依赖
- 最低 VS Code 版本提升到 ^1.74.0，移除冗余的 `activationEvents`

### 新增
- 右键菜单：选中（或光标停在）颜色时出现「颜色转换」子菜单，可直接转成 hex/rgb/rgba/hsl/hsla；子菜单由 `colorConversion.hasColor` 上下文键控制，只有识别到颜色才显示
- 配置项 `color-conversion.defaultFormat` / `color-conversion.spacing` / `color-conversion.hexCase`
- 悬停（Hover）展示颜色的 hex/rgb/rgba/hsl/hsla 全部格式
- 代码操作（Code Action）一键把颜色转换为指定格式
- 本地化：`package.nls.json`、`package.nls.zh-cn.json` 与 `l10n` 运行时文案
- `npm run test:unit` 单元测试（颜色校验、颜色转换、颜色定位与输出格式化），其中 `test/unit/extension.test.js` 通过桩掉 `vscode` 模块，在纯 Node 下回归命令、Hover 与 Code Action 逻辑

## [Changed]
- 修改文档和配置