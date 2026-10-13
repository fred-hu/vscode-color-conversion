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
```
npm install -g vsce
vsce package
vsce login <publisher-name>
vsce publish 或者 vsce publish [major|minor|patch]
```