#!/bin/bash

# 可以将 app 替换成本地小程序的地址
app='demos/demo20170111'

# 加了 dev 参数就不编译 framwork
if [ "$1" != "dev" ]; then
  # 不压缩代码
  npm run dev:nowatch
fi

./bin/weweb $app

