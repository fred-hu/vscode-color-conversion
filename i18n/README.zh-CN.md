# vscode-color-conversion
<p align="center">
  <img width="100" src="https://github.com/fred-hu/vscode-color-conversion/raw/master/static/colors.png" />
</p>
<p align="center">
  <a href="../README.md">English</a> | 简体中文
</p>

#### 项目说明
vscode 中 用于颜色转换的一个插件，支持hex、rgb、rgba、hsl、hsla的相互转换


#### 安装
>一.插件市场安装方式
>
```
搜索color conversion
```
>二.vsix安装方式
>
```
下载color-conversion.vsix
vscode 插件 -> 从 VSIX 安装
```

#### 使用
>一.指令
>
```
选中颜色 -> ctrl shift p -> color conversion
```
>二.快捷键
>
```
选中颜色 -> ctrl+f1 （mac: cmd+f1）
```
>三.光标
>
```
也可以把光标直接放在颜色上（hex、rgb()/hsl() 或颜色关键字），无需选中。
```
>四.悬停 / 代码操作
>
```
悬停颜色可预览各种格式；也可用灯泡菜单（重构）就地转换为指定格式。
```
>五.右键菜单
>
```
选中颜色（或把光标放在颜色上、直接在颜色上右键）后，从右键菜单选「颜色转换」，即可直接转成 hex / rgb / rgba / hsl / hsla；只有真正识别到颜色时该子菜单才会出现。
```

#### 配置项

| 配置 | 默认值 | 说明 |
| --- | --- | --- |
| `color-conversion.defaultFormat` | `ask` | 命令使用的目标格式，`ask` 表示每次弹出选择框。 |
| `color-conversion.spacing` | `false` | 在逗号后补空格，例如 `rgb(255, 0, 0)`。 |
| `color-conversion.hexCase` | `lower` | `lower`、`upper` 或 `preserve`（保留原始 hex 大小写）。 |

#### 插件市场地址
>
[vscode marketplace](https://marketplace.visualstudio.com/items?itemName=fredu.color-conversion)


#### 演示
>
![color-conversion](https://i.imgur.com/OR38BQy.gif)

#### 运行
```
1. npm i
2. 完成后进入 VS Code，按下F5，你会立即看到一个插件发开主机窗口，其中就运行着插件。
```

#### 开发校验
```
# Node 版本已通过 package.json 的 "volta" 字段与 .nvmrc 固定为 20；ESLint 9 需要 Node >= 18
npm run lint        # ESLint 代码检查
npm run test:unit   # 单元测试（纯函数 + 桩掉 vscode 的扩展逻辑）
npm test            # VS Code 集成测试（会下载 VS Code）
```

#### tag
```
git tag vx.x.x(版本号)
git push origin vx.x.x(版本号)
```

#### 发布

发布到 VS Code 插件市场已由 [.github/workflows/publish.yml](./.github/workflows/publish.yml) 自动化。

一次性配置：创建一个带 **Marketplace > Manage** 权限的 Azure DevOps 个人访问令牌，然后以 `VSCE_PAT` 为名添加到仓库密钥（Settings > Secrets and variables > Actions）。

发布流程：修改 `package.json` 里的 `version` 并提交，然后打一个与版本号一致的 tag：
```
git tag v0.0.6
git push origin v0.0.6
```
工作流会安装依赖、执行 lint 与单元测试、校验 tag 与 `package.json` 版本一致、打包 VSIX、以构建产物形式上传，并发布到插件市场（若该版本已存在则跳过而非报错）。

在 Actions 页面手动触发时，默认只打包，勾选 `publish` 输入才会发布。

##### Open VSX（可选）

工作流也可以发布到 [Open VSX](https://open-vsx.org)（VSCodium、code-server 等非微软发行版使用）。未配置 `OVSX_PAT` 密钥时会打印警告并跳过，不会影响插件市场的发布。

> **当前状态：卡在命名空间所有权上。** 命名空间叫 `fredu`，是因为它由 `package.json` 的 `publisher` 字段决定——Open VSX 的命名空间取自该字段，与 GitHub 账号名（`fred-hu`）无关。Open VSX 上的 `fredu` 命名空间是第三方搬运本扩展时创建的（`publishedBy.loginName = jdkcoder`，2024-07-18），目前**没有 owner**（`"verified": false`），且 `fred-hu` 不是其成员，因此发布会报 `Insufficient access rights for publisher: fredu`。
>
> 在拿到所有权之前，要么不要配置 `OVSX_PAT` 密钥（该步骤会自动跳过），要么把 Open VSX 步骤从工作流里去掉。

认领 `fredu` 所有权的步骤：

1. 在 https://accounts.eclipse.org/user/register 注册 Eclipse 账号，*GitHub Username* 一栏必须填**你登录 open-vsx.org 用的同一个 GitHub 账号**。
2. 打开 https://open-vsx.org/user-settings/profile，点 **Log in with Eclipse** 授权，再点 **Show Publisher Agreement** 并同意。
3. 用 [claim-namespace-ownership](https://github.com/EclipseFdn/open-vsx.org/issues/new/choose) 模板为命名空间 `fredu` 提交 issue。**只勾选适用项**（命名空间当前无 owner、GitHub 历史满 12 个月、*Option 1: VS Code Publisher with Repo* 及其子项），并在 *Claim evidence* 里填写证据——不填证据不会被批准。

> `npx ovsx create-namespace fredu -p <token>` 在这里行不通，它会返回 `Namespace already exists: fredu`。而且该命名空间没有 owner，没人有权限把你加为成员——所以上面那条认领 issue 是拿到 `fredu` 发布权的唯一途径。

可用的证据：

```
仓库（归属发起认领的 GitHub 账号）：
https://github.com/fred-hu/vscode-color-conversion

声明 publisher 字段的提交：
https://github.com/fred-hu/vscode-color-conversion/commit/cae368d1d87ed8220e1ac296c1f3f2c338b2f0c0

VS Code 插件市场发布者：https://marketplace.visualstudio.com/publishers/fredu
已发布扩展：https://marketplace.visualstudio.com/items?itemName=fredu.color-conversion
```

拿到所有权后，在 https://open-vsx.org/user-settings/tokens 创建令牌，自检通过后存为仓库密钥 `OVSX_PAT`：
```
npx ovsx verify-pat fredu -p <token>
```

手动发布依然可用：
```
npm install -g @vscode/vsce
vsce login <publisher-name>
vsce publish 或者 vsce publish [major|minor|patch]
```