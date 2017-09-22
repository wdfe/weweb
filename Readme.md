# weweb

[![npm package](https://img.shields.io/npm/v/weweb-cli.svg)](https://www.npmjs.com/package/weweb-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

## 简介

weweb是一个兼容小程序语法的前端框架，你可以用小程序的写法，来写web应用。如果你已经有小程序了，通过它你可以将你的小程序运行在浏览器中。如果你熟悉vue的语法，也可以使用wepy编写小程序，再通过weweb转换后将其运行在web端。

该项目基于小程序开发者工具内置的小程序运行框架来实现的，我们在仔细研究了小程序官方的底层框架后，实现了小程序运行在web端的service和view引擎，为了使weweb能适应web端的性能要求，相较小程序原生框架，主要有以下调整：
- 框架核心库进行了大量精减，剔除web不相关的部分,使核心库体积大大减小
- 将原有的三层架构精简为Service和View两层架构
- 页面资源、框架内置组件均使用异步加载，提升加载速度
- 支持自定义登录页面，代替微信登录功能
- 去除了小程序对页面层级的限制
- 实现了js版的wxml和wxss编译器以适应跨平台编译需求并无缝整合至weweb

## 适用场景
- 喜欢小程序的开发方式，或者只懂小程序开发，想通过小程序的开发方式来写web应用
- 开发出小程序后，同时想拥有同样功能的h5应用，并希望能复用小程序的代码
- 代替小程序开发者工具对小程序部分功能在浏览器端进行调试

## 运行
> 请先在系统中安装[node](https://nodejs.org/zh-cn/)，官方的安装包会同时为您装上依赖管理工具[npm](https://www.npmjs.com/)

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
# clone此项目后安装依赖
npm i

# 构建核心库：
npm run build

# 运行示例：
./bin/weweb ./demos/demo20170111/

# 压缩app代码：使用环境变量 NODE_ENV=production
NODE_ENV=production ./bin/weweb demos/demo20170111

# 替换编译器：当编译出错时使用环境变量 DFT_CMP=true 调用微信开发者工具自带的编译器
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


weweb默认使用我们自己写的编译器对wxml和wxss进行编译，但目前编译器还处于试用阶段，有些case可能没测全，使用weweb过程中如果发现一些异常情况，可以尝试切换成微信官方编译器，看看是不否能解决问题。出现类似问题欢迎大家给我们提issue。我们将尽快修正

```sh
# 切换成微信开发者工具自带的编译器：使用环境变量 DFT_CMP=true 如下：

DFT_CMP=true ./bin/weweb demos/demo20170111
```

转换成H5后，会存在跨域访问接口及脱离微信环境带来的一些api无法支持的问题。我们可以通过在小程序的`app.json`文件中增加`weweb`配置项来解决一些常见的问题：

- 登录：转换成H5后将不支持小程序原生的登录方式，可通过`loginUrl`项来设置调用`wx.login`时跳转到的登录页面

``` js
/**
 * 此处的loginUrl地址必须是在app.json里注册了的小程序地址
 */

"weweb":{
  "loginUrl":"/page/H5login"
}
```

- 跨域请求：当后端接口不支持JSONP时，可以增加requestProxy配置项来设置服务器端代理地址，以实现跨域请求

``` js
/**
 * 此处/remoteProxy是weweb自带server实现的一个代理接口
 * 实际项目中请改成自己的真实代理地址。如果接口支持返回jsonp格式，则无需做此配置
 */

"weweb":{
  "requestProxy":"/remoteProxy"
}
```

## 转换效果说明

- 转换成H5后，依赖微信环境的相关接口将无法支持，比如：登录等，需要自行改造为H5兼容方式
- 小程序转换为H5后，特殊情况下，个别样式可能会有些异常，得自行调整兼容

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
