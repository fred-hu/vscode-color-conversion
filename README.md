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

Publishing to the VS Code Marketplace is automated by [.github/workflows/publish.yml](./.github/workflows/publish.yml).

One-time setup: create an Azure DevOps personal access token with the **Marketplace > Manage** scope, then add it as a repository secret named `VSCE_PAT` (Settings > Secrets and variables > Actions).

To release, bump `version` in `package.json`, commit it, then push a matching tag:
```
git tag v0.0.6
git push origin v0.0.6
```
The workflow installs dependencies, lints, runs the unit tests, verifies that the tag matches `package.json`, packages the VSIX, uploads it as a build artifact and publishes it (a version that is already on the Marketplace is skipped instead of failing).

A manual run from the Actions tab only builds the VSIX unless the `publish` input is ticked.

##### Open VSX (optional)

The workflow can also publish to [Open VSX](https://open-vsx.org), which is what VSCodium, code-server and other non-Microsoft builds use. It is skipped with a warning when the secret below is missing, so the Marketplace release is never blocked by it.

1. Sign in to https://open-vsx.org with GitHub.
2. Create the namespace `fredu` at https://open-vsx.org/user-settings/namespaces. It has to match the `publisher` field in `package.json`; a namespace that is not your GitHub login additionally needs the Eclipse publisher agreement.
3. Create an access token at https://open-vsx.org/user-settings/tokens.
4. Sanity check it, then store it as the `OVSX_PAT` repository secret:
```
npx ovsx verify-pat fredu -p <token>
```

Manual publishing still works:
```
npm install -g @vscode/vsce
vsce login <publisher-name>
vsce publish [major|minor|patch]
```
