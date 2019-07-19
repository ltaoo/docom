# docom 本地开发说明

在开发 `npm` 包时，`npm` 提供了方便的 `link` 命令，类似 `sylink` 功能。
首先 `clone` 项目

```bash
git clone https://github.com/ltaoo/fake-bisheng.git ./docom
```

会在当前目录新增 `docom` 文件夹，并将代码下载到该文件夹内。

## link 说明
进入 `docom-core` 文件夹，将 `docom-core` 模块链接到全局

```bash
cd docom/packages/docom-core

npm link
# Mac 需要 sudo
```

该命令成功后，在命令行会有

```bash
# bin 命令支持全局使用
C:\Users\BG387066\AppData\Roaming\npm\docom -> C:\Users\BG387066\AppData\Roaming\npm\node_modules\docom-core\bin\index.js
# 包
C:\Users\BG387066\AppData\Roaming\npm\node_modules\docom-core -> E:\docom\packages\docom-core
```

类似这种结果，这表示全局的一个包，指向了我们当前目录(`docom-core`)，这样等同于 `npm i docom-core -g`。

该命令成功后，继续在命令行输入

```bash
docom --help # 暂时有问题，下面的先忽略，直接看 运行 example
```

不会包 `docom command not found` 即表示成功。

至此，我们完成了 `docom-core` 的本地调试准备工作，修改任意 `docom-core` 文件夹内的代码，再执行 `docom` 相关命令，都能以修改后的代码执行。

## 运行 example

返回到项目根目录，并进入示例文件夹

```bash
 cd ../../examples/default/
```

执行 `docom dev` ，正常来说会报错，下面依次将没有 `link` 的包 `link` 到全局。


```bash
cd ../../packages/
# 进入 packages 文件夹后，先 link entry-react 包
cd docom-entry-react
npm link
# C:\Users\BG387066\AppData\Roaming\npm\node_modules\docom-entry-react -> E:\docom\packages\docom-entry-react

cd ..
cd docom-theme-one
npm link
# C:\Users\BG387066\AppData\Roaming\npm\node_modules\docom-theme-one -> E:\docom\packages\docom-theme-one
```

都完成后，我们需要的包现在都全局了，然后再返回示例项目中。

```bash
cd ../../examples/default/

# 项目链接全局依赖
npm link docom-core docom-entry-react docom-theme-one
# E:\docom\examples\default\node_modules\docom-entry-react -> C:\Users\BG387066\AppData\Roaming\npm\node_modules\docom-entry-react -> E:\docom\packages\docom-entry-react
# E:\docom\examples\default\node_modules\docom-theme-one -> C:\Users\BG387066\AppData\Roaming\npm\node_modules\docom-theme-one -> E:\docom\packages\docom-theme-one
# E:\docom\examples\default\node_modules\docom-core -> C:\Users\BG387066\AppData\Roaming\npm\node_modules\docom-core -> E:\docom\packages\docom-core

docom dev
# 等待编译，提示 Compiled successfully! 就表示可以打开浏览器访问 http://127.0.0.1:3000
```

理论上项目就能运行了。由于没有处理端口占用及自定义端口，所以必须保证 3000 端口不被占用。


> Window 有个 bug，将 packages/docom-core/scripts/utils.js 103 行修改成 ???? 就可以了。

## 注意事项

在项目安装新依赖后，需要重新 `link`。

假设我现在在 `examples/default` 文件夹，执行

```bash
yarn add lodash
```

就需要重新执行


```bash
npm link docom-core docom-entry-react docom-theme-one
```
