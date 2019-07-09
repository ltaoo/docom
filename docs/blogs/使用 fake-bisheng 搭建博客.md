---
title: 使用 fake-bisheng 搭建博客
---

`fake-bisheng` 不仅可以用来搭建组件展示站，还可以用作个人博客，只需要简单配置就可直接生成博客。

## 使用

```bash
yarn add fake-bisheng fake-bisheng-theme-blog
```

安装好这两个包后，在项目根目录增加配置文件：

```js
module.exports = {
    modules: {
        blog: {
            path: './docs/blogs',
        },
    },
};
```

然后运行即可

```bash
yarn run fake-bisheng start
```
