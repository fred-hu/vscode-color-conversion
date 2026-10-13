# vscode-color-conversion
<p align="center">
  <img width="100" src="https://github.com/fred-hu/vscode-color-conversion/raw/master/static/colors.png" />
</p>
<p align="center">
  English | <a href="/i18n/README.zh-CN.md">简体中文</a>
</p>


#### Project Description
A plugin for color conversion in vscode, supporting mutual conversion among hex, rgb, rgba, hsl, and hsla.

#### Installation
>1.Plugin Marketplace Installation
>
```
Search for color conversion
```
>2.VSIX Installation Method
>
```
Download color-conversion.vsix
VS Code Extensions -> Install from VSIX
```

#### Usage
>1.Command
>
```
Select color -> ctrl shift p -> color conversion
```
>2.Shortcut
>
```
Select color -> ctrl+f1 (mac: cmd+f1)
```
>3.Cursor
>
```
You can also place the cursor on a color (hex, rgb()/hsl() or color keyword) without selecting it.
```
>4.Hover / Code Action
>
```
Hover a color to preview all formats, or use the light bulb (Refactor) to convert a color in place.
```
>5.Right-click menu
>
```
Select a color (or just put the cursor on it / right-click it) and choose Color Conversion from the context menu to convert it straight to hex, rgb, rgba, hsl or hsla. The submenu only appears when a color is actually recognized.
```

#### Settings

| Setting | Default | Description |
| --- | --- | --- |
| `color-conversion.defaultFormat` | `ask` | Target format of the command. `ask` shows a quick pick every time. |
| `color-conversion.spacing` | `false` | Add a space after commas, for example `rgb(255, 0, 0)`. |
| `color-conversion.hexCase` | `lower` | `lower`, `upper`, or `preserve` (keep the case of the original hex value). |

#### Marketplace URL
>
[vscode marketplace](https://marketplace.visualstudio.com/items?itemName=fredu.color-conversion)


#### Demo
>
![color-conversion](https://i.imgur.com/OR38BQy.gif)

#### Running
```
1. npm i
2. After completion, enter VS Code, press F5, you will immediately see a development host window running the plugin.
```

#### Development checks
```
# Node 20 is pinned in package.json ("volta") and .nvmrc; ESLint 9 requires Node >= 18
npm run lint        # ESLint
npm run test:unit   # unit tests (pure libs + extension logic with a stubbed vscode module)
npm test            # VS Code integration tests (downloads VS Code)
```

#### Tagging
```
git tag vx.x.x(version number)
git push origin vx.x.x(version number)
```

#### Publishing
```
npm install -g vsce
vsce package
vsce login <publisher-name>
vsce publish or vsce publish [major|minor|patch]
```
