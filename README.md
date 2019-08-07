# docom

## 使用说明

每个模块必须包含 `index.md`，这是 `theme-antd` 要求的。

## 发布说明

在代码合并到 `master` 后，可以进行 `publish`，将包发布到 `npm` 上。
首先切换到 `master` 分支，执行 `lerna publish`。

```js
lerna notice cli v3.15.0
lerna info current version 0.0.0
lerna info Assuming all packages changed
? Select a new version (currently 0.0.0) (Use arrow keys)
❯ Patch (0.0.1) 
  Minor (0.1.0) 
  Major (1.0.0) 
  Prepatch (0.0.1-alpha.0) 
  Preminor (0.1.0-alpha.0) 
  Premajor (1.0.0-alpha.0) 
  Custom Prerelease 
  Custom Version 
```

命令行会列出当前版本，以及要求选择新版本号。选择好并确定后，会开始 `publish`。
出现如下提示，就表示发布成功。

```js
lerna http fetch PUT 200 https://registry.npmjs.org/docom-entry-react 49450ms
Successfully published:
 - docom-core@0.1.0
 - docom-entry-react@0.1.0
 - docom-theme-antd@0.1.0
 - docom-theme-one@0.1.0
lerna success published 4 packages
```

并且，会自动进行一次 `commit` 即打 `tag`。
