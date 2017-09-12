import pull from './pull'
var curViewId = window.__wxConfig && window.__wxConfig.viewId || 0,
  defaultEventHandlers = {},
  eventPrefix = "custom_event_",
  handlers = {},
  limitedApi = ['insertShareButton','updateShareButton','removeShareButton','insertContactButton','updateContactButton','removeContactButton','reportKeyValue','reportIDKey','systemLog'];

function send(sdkName, args, isOn) {//send notice
  var sdk = {
    sdkName: sdkName,
    args: args || {}
  };
  ServiceJSBridge.showSdk(sdk);
}

function invoke(event,args,callback) {
  if(!args){ args = {}; }
  if (limitedApi.indexOf(event)!=-1) {
    console.log(event);
    return;
  } else {

    defaultEventHandlers[event] = callback;
    if(/^private_/.test(event)){
      return;
    }
    "disableScrollBounce" === event?pull.togglePullDownRefresh(args.disable):send(event, args);
  }
}

function on(eventName, handler) {
  defaultEventHandlers[eventName] = handler
  send(eventName, {}, true)
}
window.WeixinJSBridge = {
  pull,
  invoke: invoke,
  on: on,
  publish: function (eventName, params, isOn) {
    eventName = isOn ? eventName : eventPrefix + eventName;
    var msg = {
      eventName: eventName,
      data: params,
      webviewID: curViewId
    };
    ServiceJSBridge.subscribeHandler(msg.eventName,msg.data || {},msg.webviewID)
  },
  subscribe: function (eventName, handler) {
    handlers[eventPrefix + eventName] = handler
  },
  subscribeHandler: function (eventName, data) { //执行注册的回调
    var handler;
    handler = eventName.indexOf(eventPrefix) != -1 ? handlers[eventName] : defaultEventHandlers[eventName],
    "function" == typeof handler && handler(data)
  }
}
pull.register(function () {
  ServiceJSBridge.subscribeHandler('onPullDownRefresh',{},curViewId)
});


function publish() {
  var params = Array.prototype.slice.call(arguments);
  params[1] = {
    data: params[1],
    options: {
      timestamp: Date.now()
    }
  }
  WeixinJSBridge.publish.apply(WeixinJSBridge, params)
}

function subscribe() {
  var params = Array.prototype.slice.call(arguments),
    callback = params[1];
  params[1] = function (args, ext) {
    var data = args.data;
    "function" == typeof callback && callback(data, ext)
  }
  WeixinJSBridge.subscribe.apply(WeixinJSBridge, params)
}

function invokeMethod(eventName,params,innerParams) {//invoke 事件
  params = params || {}
  innerParams = innerParams || {}
  var callbacks = {};
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

export default {
  invoke: invoke,
  on: on,
  publish: publish,
  subscribe: subscribe,
  invokeMethod: invokeMethod,
  onMethod: on
}


