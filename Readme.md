[![npm package](https://img.shields.io/npm/v/weweb-cli.svg)](https://www.npmjs.com/package/weweb-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

# weweb

## 简介

weweb是一个兼容小程序语法的前端框架，通过它你可以将你的小程序运行在浏览器中，如果你熟悉vue的语法，也可以使用wepy编写程序，使用其内置的转换工具可以将wepy应用转换成小程序应用，再通过weweb转换后将其运行在web端。

该项目是基于[wept]进行的二次开发，在开发的过程中我们还原了核心库WAService.js以及WAWebview.js，在理解了其中的含义后，我们对其核心逻辑进行了大幅修改，使其能真正作为一个前端开发框架来使用：

- 剔除了与Native交互的代码
- 将原有中间层代码转移至Service层，精为Service和View两层
- 页面逻辑、内置组件实现异步加载
- 支持自定义登录页面，代替微信登录功能
- 使用JavaScrtipt实现了wxml和wxss编译器

## 运行

> 请先在系统中安装了[node](https://nodejs.org/zh-cn/)，官方的安装包会同时为您装上依赖管理工具[npm](https://www.npmjs.com/)

### 方法一：使用cli命令行工具

安装：

```sh
npm install weweb-cli -g
```

运行示例：

```sh
weweb ./demos/demo20170111/
```

Options:

- -h, --help       输出帮助信息
- -V, --version    输出版本信息
- -o, --open       使用 Chrome 打开小程序，仅对 Mac 有效
- -l, --list       使用默认浏览器打开更新历史
- -p, --port \<port>   指定服务端口，默认 2000
- -d, --dist \<dir>   指定生成的路径
- -t, --transform  只转换小程序,不起web服务

### 方法二：手动构建并运行：

```sh
# 安装项目依赖
npm i

# 构建核心库：
npm run build

# 运行：
./bin/weweb ./demos/demo20170111/

# 使用环境变量 NODE_ENV=production 可以压缩app代码
NODE_ENV=production ./bin/weweb demos/demo20170111

# 当编译出错时使用环境变量 DFT_CMP=true 调用微信开发者工具自带的编译器
DFT_CMP=true ./bin/weweb demos/demo20170111

# 环境变量可以组合使用
NODE_ENV=production DFT_CMP=true ./bin/weweb demos/demo20170111
```

### 开发用命令

```sh
# 自动执行rebuild
npm run dev

# 自动重启服务器
npm run autostart
```

## 注意事项

因转换成H5后，会存在跨域访问接口及脱离微信环境带来的一些api无法支持的问题，我们可以通过在小程序的`app.json`增加`weweb`配置项来解决一些常见问题：

- 小程序访问的后端接口不支持JSONP时，可以在"weweb"项增加requestProxy这个配置项来配置服务器端代理地址，以实现跨域请求，配置如下：

``` js
// 此处/remoteProxy是weweb自带server实现的一个代理接口
// 实际项目中请改成自己的真实代理地址。建议接口支持返回jsonp格式，则无需做此配置
"weweb":{
  "requestProxy":"/remoteProxy"
}
```

- 转换成H5后将不支持小程序原生的登录方式，可以通过在"weweb"项增加loginUrl项来设置当调用wx.login时引导到设置好的H5登录页面，配置如下：

``` js
// 此处的loginUrl地址必须是在app.json里注册了的小程序地址
"weweb":{
  "loginUrl":"/page/H5login"
}
```

## 转换效果说明

- 转换成H5后，依赖微信环境的相关接口将无法支持，比如：登录等，需要自行改造为H5兼容方式
- 小程序转换为H5后，由于原来属于native的header与tabbar部分也变成了页面的一部分，所以页面若存在针对`<page>`根元素定位为fixed的元素，有可能会被header或tabbar遮挡，显示可能不正确，需自行调整

## 感谢

weweb前期参考了[wept]项目的实现，目前有部分代码也是沿用了[wept]的或在这基础上改造而来。在此，特别感谢[wept]的作者 chemzqm 的无私奉献

如果你有好的意见或建议，欢迎给我们提 [issue] 或 [PR]，为优化 [weweb] 贡献力量

## License

[MIT](http://opensource.org/licenses/MIT)

[微信小程序简易教程]: https://mp.weixin.qq.com/debug/wxadoc/dev/
[issue]: https://github.com/wdfe/weweb/issues/new
[PR]: https://github.com/wdfe/weweb/compare
[weweb]: https://github.com/wdfe/weweb
[wept]: https://chemzqm.github.io/wept/#/
