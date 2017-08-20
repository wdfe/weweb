# wxml-transpiler

> This package is auto-generated. For pull requests please see [src/entries/web-compiler.js](https://github.com/vuejs/vue/tree/dev/src/platforms/web/compiler).

This package can be used to pre-compile wxml templates.

## Usage

``` js
const compiler = require('./wxml-transpiler')

const fileList = [
    './pages/index/index.wxml',
    './common/head.wxml',
    './common/foot.wxml'
  ]

const res = compiler.wxmlCompile(fileList)
```