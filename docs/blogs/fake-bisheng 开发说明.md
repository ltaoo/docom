---
title: fake-bisheng 开发说明
---

`fake-bisheng` 是在 `bisheng` 和 `docz` 的启发下，想要开发出一个框架无关的，更加自由的组件展示站搭建工具。

现有的 `bisheng` 或者 `docz` 都是只能用于 `React`，并且自由度并不高，大部分人想要搭建出类似 `antd` 的官网，难度是非常大的，并且也限定了一些目录结构、文件名，非常不友好。

`fake-bisheng` 会比较自由，它有 `module` 这个概念，指「一类」`markdown` 文件，比如 `components`、`docs`等，每个 `module` 会生成一个 `nav` 链接，点击展示的是该 `module` 下的所有文件。