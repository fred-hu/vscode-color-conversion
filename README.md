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
