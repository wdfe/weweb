# weweb

- [简介](##简介)
- [安装&使用方法](##安装&使用方法)
- [转换效果说明](##转换效果说明)
- [贡献](##贡献)
- [LICENCE](##LICENCE)


## 简介

weweb是在做一个尝试，尝试把小程序转换成H5，让同一份小程序代码，在浏览器里也能跑。在小程序大行其道的今天，这会是一件既现实又很有意义的事情，经过一段时间的努力，我们在这上面已经小有成绩，基本上实现了这一目标。当然，小程序目前发展迅速，新功能层出不穷，一些新api、新功能可能暂时还不支持。另外，由于时间关系，还有很多地方还没来得及优化。我们希望开源后，能和大家一起来完善它。

weweb的实现基于小程序开发者工具里包涵的WAService.js\WAWebview.js这二个库，这二个库官方做了混淆，我们花了大量的时间精力对他进行模块拆分整理，在理解了他的实现后做了相应的改造，在这过程中，我们参考了另一个开源项目wept, wept的作者写了几篇文章对小程序框架进行了深入的分析，让我们受益良多。在此特别感谢。


##安装 & 使用方法

### 源码下载 & 运行
```
git clone https://github.com/wdfe/weweb.git
npm install

构建：
	gulp
运行：
	./bin/weweb 小程序路径
```


### cli命令行工具安装

```
npm install weweb_cli -g

运行示例:
	weweb 小程序路径

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


> ** 注意事项 **
小程序访问的后端接口不支持JSONP时，需在小程序配置文件`app.json`中添加服务器端代理地址，以实现跨域请求，配置如下：

  "requestProxy":"/remoteProxy"

 //此处/remoteProxy是weweb自带server实现的一个代理接口


### 转换平台
##### 想一睹为快，可以移步到我们的[转换平台](http://shaomayou.com/weweb/)上传小程序，一键将小程序转成H5，即时预览转换后的效果并可以下载转换后的代码。


## 转换效果说明
- 1、转换成H5后，依赖微信环境的相关接口将无法支持，比如：登录等，需要自行改造为H5兼容方式
- 2、小程序转换为H5后，由于原来属于native的header与tabbar部分也变成了页面的一部分，所以页面若存在针对<page>根元素定位为fixed的元素，有可能会被header或tabbar遮挡，显示可能不正确，需自行调整。

## 感谢
weweb前期参考了wept项目的实现，目前有部分代码也是沿用了wept的或在这基础上改造而来。在此，特别感谢wept的作者chemzqm 的无私奉献

如果你有好的意见或建议，欢迎给我们提 [issue] 或 [PR]，为优化 [weweb] 贡献力量

## LICENSE

MIT

[微信小程序简易教程]: https://mp.weixin.qq.com/debug/wxadoc/dev/
[issue]: https://github.com/wdfe/weweb/issues/new
[PR]: https://github.com/wdfe/weweb/compare
[weweb]: https://github.com/wdfe/weweb
[wept]: https://chemzqm.github.io/wept/#/