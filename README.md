# fake-bisheng

首先，我们明确一点，`Node.js` 本身不存在「项目」、「目录」等的限制，它可以访问任何资源，只要能给出明确的路径。
`Webpack`、`webpack-dev-server` 是 `Node.js` 应用，所以它也是可以访问系统中任何地方的资源，所以，即使 `webpack-dev-server` 在 `node_modules` 文件夹中，并不影响它读取「项目文件」。

假设我们的目录结构是这样的

```js

```