# 谈谈weweb是怎样让小程序在浏览器里跑起来的

## 起源

首先让我介绍一下决定做weweb这个项目的起源，小程序刚一出世的时候，我们就已经关注上了，做为微信力推的一大功能，我们公司自然也不甘落后，小程序还未正式发布之前，我们就已经开始着手写我们公司的小程序了。在这过程中，我们发现小程序开发自成一体，没法和h5共用，这是很糟心的一点。意味着同一个功能要同时在小程序和h5里用，必须开发二套代码，基本上无法共用代码，这极大的增加了企业的开发成本。面对这种情况，靠微信官方打开局面是不太可能了，我们当时就在想是否可以找到一种方式，让h5代码也能跑在小程序里，或者让小程序的代码也能用浏览器来跑。对由前者，由于h5的技术栈、框架种类太多了，而小程序的开发模式和h5原有的开发模式相差太大，要完全实现转换并兼容现有的h5框架几乎是不太可能; 相对来说让小程序转成h5跑在浏览器里理论上是完全有可能实现的，因为小程序的开发者工具里的模拟器环境就和浏览器环境很类似，小程序既然能在那里跑，那就说明小程序框架有运行于浏览器的基因。确定了这一点，我们老大就决定让我们放手一博，让我和其它几个同事在完成业务需求的情况下，抽时间来研究实现方案。

## 方案调研
我们确定先从微信小程序开发者工具入手，调研一下它的实现，在mac里显示包内容进入Resources目录，可以在里面找到小程序底层框架的lib文件，比较关键的有WAService.js和WAWebview.js二个文件，对小程序稍有了解的人应该都知道，小程序底层框架主要分三层来实现，即控制层、service层、view层。很明显WAService.js是负责实现service层的库，WAWebview.js是负责view层的库，除了这二个库外还有其它的一些辅助库和页面模板，比较遗憾的是，这些框架库都是经过混淆压缩后的，所以可读性非常差，给我们的调研带来很大的麻烦。在这期间，我们也参考了一些其它关于小程序架构的资料和开源项目，发现已经有个叫wept的开源项目也在着手做类似的事情，但它的目标和我们的不太一样，它官方标示的目标是：为小程序开发提供高效、稳定、友好、无限制的运行环境。从它的目标可以看出，它主要是为了方便小程序开发时在浏览里进行调试。它通过iframe的方式在web端模拟了小程序的三层架构，基本上实现了小程序在浏览器上运行。不过它所依赖的核心库基本上都是抽取自微信开发者工具里的，没做太大的调整，所以框架体积过于庞大，只适合开发调试使用，这和它的定位也是比较匹配的，主要是方便开发调试小程序使用。尽管如此，对我们的启发也是很大的，最起码证实我们之前的猜想：小程序可以跑在浏览器端。

之后我们又对wept的实现进行了一番调研，确定我们的方向无误后便制定了小组开发计划，我们决定分以下几步骤走：

- 对小程序的底层混淆库进行模块拆分和代码还原
- 对框架进行调整，在单页面里实现小程序的三层架构
- 对三层架构的通讯机制进行调整
- 对整个架构进行调整，把三层架构改成二层架构



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

# 替换编译器：当默认编译出错时使用环境变量 DFT_CMP=true 可切换为微信开发者工具自带的编译器
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

## 在线演示demo

[demo源码]

[h5版在线demo]

![小程序二维码](https://raw.githubusercontent.com/pgfxm/bbxx/master/src/images/awm.jpg)

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

/**
 * 当登录成功后调wx.loginSuccess();
 * 这个api可以自动返回到来源页面
 */

success : function(rt){
  if(rt.result){
    var login = require("../../modules/login/index.js");
    app.globalData.userInfo = rt.result;
    login.setLoginInfo(rt.result);
    wx.loginSuccess();
  }else{
    toast.show(self,rt.status.status_reason||'登录失败');
  }
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

如果你有好的意见或建议，欢迎给我们提 [issue] 或 [PR]，为优化 [weweb] 贡献力量，如果觉得weweb不错，就请star起来吧

## License

[MIT](http://opensource.org/licenses/MIT)

[微信小程序简易教程]: https://mp.weixin.qq.com/debug/wxadoc/dev/
[issue]: https://github.com/wdfe/weweb/issues/new
[PR]: https://github.com/wdfe/weweb/compare
[weweb]: https://github.com/wdfe/weweb
[wept]: https://chemzqm.github.io/wept/#/
[h5版在线demo]: https://wxshow.vipsinaapp.com/bbxx/
[demo源码]: https://github.com/pgfxm/bbxx