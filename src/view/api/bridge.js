function execOnJSBridgeReady(callback) {
  "undefined" != typeof WeixinJSBridge ? callback() : document.addEventListener("WeixinJSBridgeReady", callback, !1)
}

function invoke() {
  var params = arguments;
  execOnJSBridgeReady(function () {
    WeixinJSBridge.invoke.apply(WeixinJSBridge, params)
  })
}

function on() {
  var params = arguments;
  execOnJSBridgeReady(function () {
    WeixinJSBridge.on.apply(WeixinJSBridge, params)
  })
}

function publish() {
  var params = Array.prototype.slice.call(arguments);
  params[1] = {
    data: params[1],
    options: {
      timestamp: Date.now()
    }
  }
  execOnJSBridgeReady(function () {
    WeixinJSBridge.publish.apply(WeixinJSBridge, params)
  })
}

function subscribe() {
  var params = Array.prototype.slice.call(arguments),
      callback = params[1];
  params[1] = function (args, ext) {
    var data = args.data,
        opt = args.options,
        timeMark = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
        timestamp = opt && opt.timestamp || 0,
        endTime = Date.now();
    "function" == typeof callback && callback(data, ext)
    Reporter.speedReport({
      key: "appService2Webview",
      data: data || {},
      timeMark: {
        startTime: timestamp,
        endTime: endTime,
        nativeTime: timeMark.nativeTime
      }
    })
  }
  execOnJSBridgeReady(function () {
    WeixinJSBridge.subscribe.apply(WeixinJSBridge, params)
  })
}

function invokeMethod(eventName) {//invoke 事件
  var params = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
      innerParams = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
      callbacks = {};
  for (var r in params) {
    "function" == typeof params[r] && (callbacks[r] = params[r], delete params[r]);
  }
  invoke(eventName, params, function (res) {
    res.errMsg = res.errMsg || eventName + ":ok";
    var isOk = 0 === res.errMsg.indexOf(eventName + ":ok"),
        isCancel = 0 === res.errMsg.indexOf(eventName + ":cancel"),
        isFail = 0 === res.errMsg.indexOf(eventName + ":fail");
    "function" == typeof innerParams.beforeAll && innerParams.beforeAll(res)
     isOk ?
         (
             "function" == typeof innerParams.beforeSuccess && innerParams.beforeSuccess(res),
             "function" == typeof callbacks.success && callbacks.success(res),
             "function" == typeof innerParams.afterSuccess && innerParams.afterSuccess(res)
         ) :
         isCancel ?
             (
                 "function" == typeof callbacks.cancel && callbacks.cancel(res),
                 "function" == typeof innerParams.cancel && innerParams.cancel(res)
             ) :
            isFail && (
                "function" == typeof callbacks.fail && callbacks.fail(res),
                "function" == typeof innerParams.fail && innerParams.fail(res)
            ),
     "function" == typeof callbacks.complete && callbacks.complete(res),
     "function" == typeof innerParams.complete && innerParams.complete(res)
  })
}

function onMethod(eventName, callback) {
  on(eventName, callback)
}

export default {
  invoke: invoke,
  on: on,
  publish: publish,
  subscribe: subscribe,
  invokeMethod: invokeMethod,
  onMethod: onMethod
}


