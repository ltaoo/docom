# 如何使用 debug 库

`eslint` 使用了 `debug`，所以尝试在本项目中使用。

## Usage
我们现在有 `core`、`theme`、`plugin` 这些概念，为了能直观展示 `log` 信息是由哪个概念输出的，需要手动指定 `scope`，如我们想在 `core` 模块的某个节点打印信息，则首先在对应文件顶部引入 `debug`

```js
const debug = require('debug')('core:log');

// ...
debug('output info');
```

并在执行命令时使用 `--verbose` 参数。

## 注意事项
每增加一个新的 `scope`，需要在 `scripts/index.js` 中的 `process.env.DEBUG = ` 添加，添加方式如

```js
process.env.DEBUG = 'core:*,plugin:*';
```

## 进阶使用

可以手动指定 `DEBUG` 参数，如只想查看某个 `scope` 中的 `log`

```js
DEBUG=plugin:* docom dev
```

## 参考
详细使用见 

https://www.npmjs.com/package/debug
https://stackoverflow.com/questions/29407490/node-debug-how-to-set-debug-in-the-code