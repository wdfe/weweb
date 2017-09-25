import pull from './pull'
var curViewId = function () {
    return (window.__wxConfig && window.__wxConfig.viewId) || 0
  },
  defaultEventHandlers = {},
  eventPrefix = 'custom_event_',
  handlers = {},
  limitedApi = [
    'insertShareButton',
    'updateShareButton',
    'removeShareButton',
    'insertContactButton',
    'updateContactButton',
    'removeContactButton',
    'reportKeyValue',
    'reportIDKey',
    'systemLog'
  ]

function send (sdkName, args, isOn) {
  // send notice
  var sdk = {
    sdkName: sdkName,
    args: args || {}
  }
  ServiceJSBridge.showSdk(sdk)
}

function invoke (event, args, callback) {
  if (!args) {
    args = {}
  }
  if (limitedApi.indexOf(event) != -1) {
    console.log(event)
  } else {
    defaultEventHandlers[event] = callback
    if (/^private_/.test(event)) {
      return
    }
    event === 'disableScrollBounce'
      ? pull.togglePullDownRefresh(args.disable)
      : send(event, args)
  }
}

function on (eventName, handler) {
  defaultEventHandlers[eventName] = handler
  send(eventName, {}, true)
}
window.WeixinJSBridge = {
  pull,
  invoke: invoke,
  on: on,
  publish: function (eventName, params, isOn) {
    eventName = isOn ? eventName : eventPrefix + eventName
    var msg = {
      eventName: eventName,
      data: params,
      webviewID: curViewId()
    }
    ServiceJSBridge.subscribeHandler(
      msg.eventName,
      msg.data || {},
      msg.webviewID
    )
  },
  subscribe: function (eventName, handler) {
    handlers[eventPrefix + eventName] = handler
  },
  subscribeHandler: function (eventName, data) {
    // 执行注册的回调
    var handler
    ;(handler =
      eventName.indexOf(eventPrefix) != -1
        ? handlers[eventName]
        : defaultEventHandlers[eventName]),
    typeof handler === 'function' && handler(data)
  }
}
pull.register(function () {
  ServiceJSBridge.subscribeHandler('onPullDownRefresh', {}, curViewId())
})

function publish () {
  var params = Array.prototype.slice.call(arguments)
  params[1] = {
    data: params[1],
    options: {
      timestamp: Date.now()
    }
  }
  WeixinJSBridge.publish.apply(WeixinJSBridge, params)
}

function subscribe () {
  var params = Array.prototype.slice.call(arguments),
    callback = params[1]
  params[1] = function (args, ext) {
    var data = args.data
    typeof callback === 'function' && callback(data, ext)
  }
  WeixinJSBridge.subscribe.apply(WeixinJSBridge, params)
}

function invokeMethod (eventName, params, innerParams) {
  // invoke 事件
  params = params || {}
  innerParams = innerParams || {}
  var callbacks = {}
  for (var r in params) {
    typeof params[r] === 'function' &&
      ((callbacks[r] = params[r]), delete params[r])
  }
  invoke(eventName, params, function (res) {
    res.errMsg = res.errMsg || eventName + ':ok'
    var isOk = res.errMsg.indexOf(eventName + ':ok') === 0,
      isCancel = res.errMsg.indexOf(eventName + ':cancel') === 0,
      isFail = res.errMsg.indexOf(eventName + ':fail') === 0
    typeof innerParams.beforeAll === 'function' && innerParams.beforeAll(res)
    isOk
      ? (typeof innerParams.beforeSuccess === 'function' &&
          innerParams.beforeSuccess(res),
        typeof callbacks.success === 'function' && callbacks.success(res),
        typeof innerParams.afterSuccess === 'function' &&
          innerParams.afterSuccess(res))
      : isCancel
        ? (typeof callbacks.cancel === 'function' && callbacks.cancel(res),
          typeof innerParams.cancel === 'function' && innerParams.cancel(res))
        : isFail &&
          (typeof callbacks.fail === 'function' && callbacks.fail(res),
            typeof innerParams.fail === 'function' && innerParams.fail(res)),
    typeof callbacks.complete === 'function' && callbacks.complete(res),
    typeof innerParams.complete === 'function' && innerParams.complete(res)
  })
}

export default {
  invoke: invoke,
  on: on,
  publish: publish,
  subscribe: subscribe,
  invokeMethod: invokeMethod,
  onMethod: on
}
