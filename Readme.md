
[![npm package](https://img.shields.io/npm/v/weweb-cli.svg)](https://www.npmjs.com/package/weweb-cli)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)

# weweb

- [简介](#简介)
- [源码下载&运行](#源码下载&运行)
- [cli命令行工具安装](#cli命令行工具安装)
- [转换效果演示](#转换效果演示)
- [转换效果说明](#转换效果说明)
- [感谢](#感谢)
- [LICENCE](#LICENCE)


### 简介

weweb是在做一个尝试，尝试把小程序转换成H5，让同一份小程序代码，在浏览器里也能跑。在小程序大行其道的今天，这会是一件既现实又很有意义的事情，经过一段时间的努力，我们在这上面已经小有成绩，基本上实现了这一目标。当然，小程序目前发展迅速，新功能层出不穷，一些新api、新功能可能暂时还不支持。另外，由于时间关系，还有很多地方还没来得及优化。我们希望开源后，能和大家一起来完善它。

weweb的实现基于小程序开发者工具里包涵的WAService.js\WAWebview.js这二个库，这二个库官方做了混淆，我们花了大量的时间精力对他进行模块拆分整理，在理解了他的实现后做了相应的改造，在这过程中，我们参考了另一个开源项目wept, wept的作者写了几篇文章对小程序框架进行了深入的分析，让我们受益良多。在此特别感谢。



### 源码下载&运行
```
git clone https://github.com/wdfe/weweb.git
cd weweb
npm install

构建：
	gulp
运行：
	./bin/weweb ./demos/demo20170111/
```


### cli命令行工具安装

```
npm install weweb-cli -g

运行示例:
	#须确保./demos/demo20170111/这个位置存在你要转换的小程序,如果省略路径，则默认在当前目录查找小程序
	weweb ./demos/demo20170111/
```
访问 ：
	localhost:2000 预览转换后效果（默认端口为2000）

Options:

-    -h, --help       output usage information
-    -V, --version    output the version number
-    -o, --open       使用 Chrome 打开小程序，仅对 Mac 有效
-    -l, --list       使用默认浏览器打开更新历史
-    -p, --port <n>   指定服务端口，默认 2000
-    -d, --dist <n>   指定生成的路径
-    -t, --transform  只转换小程序,不起web服务


#### 注意事项
##### 因转换成h5后，会存在跨域访问接口及脱离微信环境带来的一些api无法支持的问题，我们可以通过在小程序的app.json增加"weweb"配置项来解决一些常见问题：
- 小程序访问的后端接口不支持JSONP时，可以在"weweb"项增加requestProxy这个配置项来配置服务器端代理地址，以实现跨域请求，配置如下：
```
"weweb":{
  "requestProxy":"/remoteProxy"
}
 //此处/remoteProxy是weweb自带server实现的一个代理接口，建议接口支持jsonp格式
```
- 转换成h5后将不支持小程序原生的登录方式，可以通过在"weweb"项增加loginUrl项来设置当调用wx.login时引导到设置好的h5登录页面，配置如下：
```
"weweb":{
  "loginUrl":"/page/h5login"
}
 //注：此处的loginUrl地址必须是在app.json里注册了的小程序地址
```



### 转换效果演示

##### 想一睹为快，可以移步到我们的[转换平台](http://shaomayou.com/weweb/)上传小程序，一键将小程序转成H5，即时预览转换后的效果并可以下载转换后的代码。


### 转换效果说明
- 1、转换成H5后，依赖微信环境的相关接口将无法支持，比如：登录等，需要自行改造为H5兼容方式
- 2、小程序转换为H5后，由于原来属于native的header与tabbar部分也变成了页面的一部分，所以页面若存在针对<page>根元素定位为fixed的元素，有可能会被header或tabbar遮挡，显示可能不正确，需自行调整。

### 感谢
weweb前期参考了[wept]项目的实现，目前有部分代码也是沿用了[wept]的或在这基础上改造而来。在此，特别感谢[wept]的作者chemzqm 的无私奉献

如果你有好的意见或建议，欢迎给我们提 [issue] 或 [PR]，为优化 [weweb] 贡献力量

### LICENSE

MIT

[微信小程序简易教程]: https://mp.weixin.qq.com/debug/wxadoc/dev/
[issue]: https://github.com/wdfe/weweb/issues/new
[PR]: https://github.com/wdfe/weweb/compare
[weweb]: https://github.com/wdfe/weweb
[wept]: https://chemzqm.github.io/wept/#/
