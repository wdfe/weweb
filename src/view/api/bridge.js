import pull from './pull'
const getCurrentViewId = function () {
  return (window.__wxConfig && window.__wxConfig.viewId) || 0
}
let defaultEventHandlers = {},
  eventPrefix = 'custom_event_',
  customEventHandlers = {},
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

function send(sdkName, args, isOn) {
  // send notice
  var sdk = {
    sdkName: sdkName,
    args: args || {}
  }
  ServiceJSBridge.callSDK(sdk)
}

function invoke(event, options = {}, callback) {

  if (limitedApi.indexOf(event) != -1) {
    console.log(event)
  } else {
    defaultEventHandlers[event] = callback
    if (/^private_/.test(event)) {
      return
    }
    event === 'disableScrollBounce'
      ? pull.togglePullDownRefresh(options.disable)
      : send(event, options)
  }
}

function on(eventName, handler) {
  defaultEventHandlers[eventName] = handler
  send(eventName, {}, true)
}

window.WeWebServiceJSBridge = {
  pull,
  invoke,
  on,
  publish: function (eventName, data, notCustomEvent) {
    eventName = notCustomEvent ? eventName : eventPrefix + eventName
    var msg = {
      eventName: eventName,
      data: data,
      webviewID: getCurrentViewId()
    }
    ServiceJSBridge.subscribeHandler(
      msg.eventName,
      msg.data || {},
      msg.webviewID
    )
  },
  subscribe: function (eventName, handler) {
    customEventHandlers[eventPrefix + eventName] = handler
  },
  subscribeHandler: function (eventName, data) {
    // 执行注册的回调
    let handler =
      eventName.indexOf(eventPrefix) != -1
        ? customEventHandlers[eventName]
        : defaultEventHandlers[eventName]
    typeof handler === 'function' && handler(data)
  }
}
// pull.register(function () {
//   ServiceJSBridge.subscribeHandler('onPullDownRefresh', {}, curViewId())
// })

function publish() {
  var params = Array.prototype.slice.call(arguments)
  params[1] = {
    data: params[1],
    options: {
      timestamp: Date.now()
    }
  }
  WeWebServiceJSBridge.publish.apply(WeWebServiceJSBridge, params)
}

function subscribe() {
  var params = Array.prototype.slice.call(arguments),
    callback = params[1]
  params[1] = function (args, ext) {
    var data = args.data
    typeof callback === 'function' && callback(data, ext)
  }
  WeWebServiceJSBridge.subscribe.apply(WeWebServiceJSBridge, params)
}

function invokeMethod(eventName, options = {}, hooks = {}) {
  // invoke 事件

  var callbacks = {}
  for (var optId in options) {
    typeof options[optId] === 'function' &&
      ((callbacks[optId] = options[optId]), delete options[optId])
  }
  invoke(eventName, options, function (res) {
    res.errMsg = res.errMsg || eventName + ':ok'
    let isOk = res.errMsg.indexOf(eventName + ':ok') === 0
    let isCancel = res.errMsg.indexOf(eventName + ':cancel') === 0
    let isFail = res.errMsg.indexOf(eventName + ':fail') === 0

    typeof hooks.beforeAll === 'function' && hooks.beforeAll(res)

    if (isOk) {
      typeof hooks.beforeSuccess === 'function' &&
        hooks.beforeSuccess(res)
      typeof callbacks.success === 'function' && callbacks.success(res)
      typeof hooks.afterSuccess === 'function' &&
        hooks.afterSuccess(res)
    } else if (isCancel) {
      typeof callbacks.cancel === 'function' && callbacks.cancel(res)
      typeof hooks.cancel === 'function' && hooks.cancel(res)
    } else if (isFail) {
      typeof callbacks.fail === 'function' && callbacks.fail(res)
      typeof hooks.fail === 'function' && hooks.fail(res)
    }


    typeof callbacks.complete === 'function' && callbacks.complete(res)
    typeof hooks.complete === 'function' && hooks.complete(res)
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
