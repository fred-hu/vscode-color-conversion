# vscode-color-conversion
#### 项目说明

>
```
vscode 中 用于颜色转换的一个插件，支持hex、rgb、rgba、hsl、hsla的相互转换
```
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