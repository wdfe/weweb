import pullDownRefresh from './pullDownRefresh'
window.__WAWebviewStartTime__ = Date.now();
var callbacks = {},
  curViewId = window.__wxConfig && window.__wxConfig.viewId || 0,
  defaultEventHandlers = {},
  eventPrefix = "custom_event_",
  handlers = {},
  EXEC_JSSDK = "EXEC_JSSDK",
  TO_APP_SERVICE = "TO_APP_SERVICE",
  _id = 0,
  limitedApi = ['insertShareButton','updateShareButton','removeShareButton','insertContactButton','updateContactButton','removeContactButton','reportKeyValue','reportIDKey','systemLog'];


function send(sdkName, args, isOn) {//send notice
  var sdk = {
      sdkName: sdkName,
      args: args || {}
  };
  ServiceJSBridge.showSdk(sdk);
}

var invoke = function (event,args,callback) {
    if(!args){ args = {}; }
    if (limitedApi.indexOf(event)!=-1) {
      console.log(event);
      return;
    } else {
      /*
       var callbackId = ++callbackIndex;
       callbacks[callbackId] = callback;
       */
      defaultEventHandlers[event] = callback;
      if(/^private_/.test(event)){
        return;
      }
      "disableScrollBounce" === event?pullDownRefresh.togglePullDownRefresh(args.disable):send(event, args);
    }
  },
  invokeCallbackHandler = function (callbackId, params) {//没用了
    var callback = callbacks[callbackId];
    "function" == typeof callback && callback(params),
      delete callbacks[callbackId]
  },
  publish = function (eventName, params, isOn) {
    eventName = isOn ? eventName : eventPrefix + eventName;
    var msg = {
      eventName: eventName,
      data: params,
      webviewID: curViewId
    };
    ServiceJSBridge.subscribeHandler(msg.eventName,msg.data || {},msg.webviewID)
  },
  on = function (eventName, handler) {
    defaultEventHandlers[eventName] = handler
    send(eventName, {}, true)
  },
  subscribe = function (eventName, handler) {
    handlers[eventPrefix + eventName] = handler
  },
  subscribeHandler = function (eventName, data) { //执行注册的回调
    var handler;
    handler = eventName.indexOf(eventPrefix) != -1 ? handlers[eventName] : defaultEventHandlers[eventName],
    "function" == typeof handler && handler(data)
  };


var uiEvent = document.createEvent("UIEvent");
uiEvent.initEvent("WeixinJSBridgeReady", !1, !1)
document.dispatchEvent(uiEvent)
pullDownRefresh.register(function () {
  ServiceJSBridge.subscribeHandler('onPullDownRefresh',{},curViewId)
});

window.WeixinJSBridge = {
  pullDownRefresh,
  invoke: invoke,
  invokeCallbackHandler: invokeCallbackHandler,
  on: on,
  publish: publish,
  subscribe: subscribe,
  subscribeHandler: subscribeHandler
}