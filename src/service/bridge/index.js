import proxyRequirst from './proxyRequirst'
import * as command from './command'
var callbacks = {},
  callbackIndex = 0,
  defaultEventHandlers = {},
  eventPrefix = 'custom_event_',
  firstEnter = false,
  handlers = {},
  showWarning = false
function isLimitedApi (event) {
  var limitedApi = ['openAddress', 'chooseContact']
  if (~limitedApi.indexOf(event)) {
    return true
  }
}

var callSystemCmd = function (sdkName, args, callbackID) {
  var config = {
    sdkName: sdkName,
    args: args,
    callbackID: callbackID
  }
  doCommand(config)
}

var doCommand = function (config) {
  // args webviewIds sdkName eventName res data
  let sdkName = config.sdkName
  if (command.hasOwnProperty(sdkName)) {
    command[sdkName](config)
  } else {
    console.warn(`Method ${sdkName} not implemented for command!`)
  }
}
var userApi = {
  login: function (event, temp, sendMsg) {
    sendMsg({
      errMsg: 'login:ok',
      code: 'the code is a mock one'
    })
  },
  authorize: function (event, temp, sendMsg) {
    sendMsg({
      errMsg: 'authorize:fail'
    })
  },
  operateWXData: function (event, temp, sendMsg) {
    var obj = __wxConfig__.userInfo
    sendMsg({
      errMsg: 'operateWXData:ok',
      data: {
        data: JSON.stringify({
          nickName: obj.nickName,
          avatarUrl: obj.headUrl,
          gender: obj.sex === 'male' ? 1 : 2,
          province: obj.province,
          city: obj.city,
          country: obj.country
        })
      }
    })
  }
}

function showSdk (msg) {
  if (msg) {
    let sdkName = msg.sdkName
    if (sdkName == 'showPickerView') {
      command.showPickerView(msg.args)
    } else if (sdkName == 'showDatePickerView') {
      command.showDatePickerView(msg.args)
    } else if (
      sdkName == 'onKeyboardComplete' ||
      sdkName == 'getPublicLibVersion' ||
      sdkName == 'onKeyboardConfirm' ||
      sdkName == 'disableScrollBounce' ||
      sdkName == 'onTextAreaHeightChange' ||
      sdkName == 'onKeyboardShow'
    ) {
      // do nothing
    } else {
      console.warn(`Ignored EXEC_JSSDK ${JSON.stringify(msg)}`)
    }
  }
}

var invoke = function (eventName, params, callback) {
    if (~['reportKeyValue', 'reportIDKey'].indexOf(eventName)) {
      return
    }
    if (userApi.hasOwnProperty(eventName)) {
      userApi[eventName](eventName, params, callback)
    } else if (!isLimitedApi(eventName)) {
      if (proxyRequirst[eventName]) {
        proxyRequirst[eventName].apply(this, arguments)
      } else {
        var callbackId = ++callbackIndex
        ;(callbacks[callbackId] = callback),
        callSystemCmd(eventName, params, callbackId) // eventName->sdkName
      }
    } else if (!showWarning) {
      showWarning = true
      var callbackId = ++callbackIndex
      var callbackRes = function (params) {}
      callbacks[callbackId] = callbackRes
      callSystemCmd(
        'showModal',
        {
          title: '请注意，转成h5以后，依赖微信相关的接口调用将无法支持，请自行改造成h5的兼容方式',
          content: '',
          confirmText: '确定',
          cancelText: '取消',
          showCancel: !0,
          confirmColor: '#3CC51F',
          cancelColor: '#000000'
        },
        callbackId
      ) // eventName->sdkName
    }
  },
  invokeCallbackHandler = function (callbackId, params) {
    var callback = callbacks[callbackId]
    typeof callback === 'function' && callback(params),
    delete callbacks[callbackId]
  },
  publish = function (eventName, data, webviewIds) {
    doCommand({
      eventName: eventPrefix + eventName, // 对应view subscribe
      data: data,
      webviewIds: webviewIds,
      sdkName: 'publish'
    })
  },
  on = function (eventName, handler) {
    if (eventName === 'onAppEnterForeground') {
      if (!firstEnter) {
        handler && handler({})
        firstEnter = true
      }
    }

    defaultEventHandlers[eventName] = handler
  },
  subscribe = function (eventName, handler) {
    handlers[eventPrefix + eventName] = handler
  },
  subscribeHandler = function (eventName, data, webviewId, reportParams) {
    // 执行注册的回调
    var handler
    ;(handler =
      eventName.indexOf(eventPrefix) != -1
        ? handlers[eventName]
        : defaultEventHandlers[eventName]),
    typeof handler === 'function' && handler(data, webviewId, reportParams)
  }

window.DeviceOrientation = function (x, y, z) {
  defaultEventHandlers['onAccelerometerChange'] &&
    defaultEventHandlers['onAccelerometerChange']({
      x: x,
      y: y,
      z: z
    })
}

window.ServiceJSBridge = {
  showSdk,
  doCommand,
  invoke: invoke,
  invokeCallbackHandler: invokeCallbackHandler,
  on: on,
  publish: publish,
  subscribe: subscribe,
  subscribeHandler: subscribeHandler
}
