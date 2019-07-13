# docom

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

命令行会列出当前版本，以及要求选择新版本号。
