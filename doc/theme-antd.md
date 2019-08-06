# theme-antd 详解

每一个主题就是一个完整的静态网站，既然是网站，那肯定有首页、路由、菜单这些基本元素。与普通网站不同的是，主题没有调用 `render` 方法，该方法在其他地方调用，主题只需要提供被渲染的页面即可。

```js
// 这段代码在其他包里
ReactDOM.render(<App />, document.getElementById('root'));
```

## 路由配置

`App.js` 是实际渲染的组件，不过它只负责路由配置，

```js
<Route
    path="/"
    render={props => <Layout {...props} {...this.props} />}
/>
```

这里参考了 `ant-pro` 的做法，最外层的路由只是渲染布局组件，布局组件内才是真正的页面路由配置。

```jsx
// src/template/Layout/index.js
const modules = Object.keys(source);
<Switch>
    {modules.map(module => (
        <Route
            path={`/${module}`}
            render={(props) => {
                const { pathname } = props.location;
                return (
                    <MainContent
                        nkey={pathname}
                        themeConfig={themeConfig}
                        {...props}
                        {...this.props}
                    />
                );
            }}
        />
    ))}
</Switch>
```

`source` 是解析 `md` 文件得到的 `markdownTree`，保存了所有的 `markdown` 信息，可以直接打开 `.docom/source.json` 查看。
如果我们的 `source` 变量的值为

```js
const source = {
    develop: {
        index: {
            meta: {
                title: '开发说明',
                filename: 'doc/develop.md',
            },
        },
        '第二个 md 文件': {
            meta: {
                title: '第二个',
                filename: 'doc/second.md',
            },
        },
    },
}
```

那么，就配置了 `/develop` 这个路由。

## 页面内容

当我们访问 `/develop` 路径时，就会访问该路由对应的组件，这里所有的路径都是同一个组件，即 `MainContent`。
该组件在 `componentDidMount` 时，会调用 `this.updatePage` 方法，该方法非常非常重要，它负责读取 `markdown` 文件。

```js
const {
    location: { pathname: prevPathname },
    imports,
} = this.props;
const pathname = prevPathname;
const paths = pathname.split('/').filter(Boolean);
let c = R.path(paths, imports);
if (typeof c === 'object') {
    const indexPaths = paths.concat('index');
    c = R.path(indexPaths, imports);
}
```

先获取当前路径，比如 `/develop`，然后根据这个路径，从 `imports` 变量上找到懒加载函数。

```js
const imports = {
    develop: {
        index: () => import('doc/develop.md'),
    },
};
let c = imports.develop;
// 如果 c 是个对象（我们希望是函数），尝试读取 imports.develop.index
```

```js
// 如果还是读不到，就 404
if (c === undefined && pathname !== '/') {
    this.state = {
        error: 404,
    };
    return;
}
// 否则就调用懒加载函数，加载 `md`
return c()
    .then((response) => {
        this.setState({
            ...response,
            markdownData: response,
        });
    })
    .catch(() => { })
    .finally(() => {
        this.setState({
            loading: false,
        });
    });
```
