import pullDownRefresh from './pullDownRefresh'
window.__WAWebviewStartTime__ = Date.now();
var callbacks = {},
  callbackIndex = 0,
  defaultEventHandlers = {},
  eventPrefix = "custom_event_",
  handlers = {},
  EXEC_JSSDK = "EXEC_JSSDK",
  TO_APP_SERVICE = "TO_APP_SERVICE",
  _id = 0,
  limitedApi = ['insertShareButton','updateShareButton','removeShareButton','insertContactButton','updateContactButton','removeContactButton','reportKeyValue','reportIDKey','systemLog'];


function callSystemCmd(to, msg, command, ext) {//postmessage notice
  var data = {
    to: to,
    msg: msg,
    command: command,
    ext: ext
  };
  data.comefrom = "webframe"
  data.webviewID = window.__wxConfig && window.__wxConfig.viewId || 0
  data = JSON.parse(JSON.stringify(data))
  "backgroundjs" === to && (data.__id = _id, _id++)
  systemBridge.doCommand(data);
}

function send(sdkName, args, isOn) {//send notice
  args = args || {}
  var sdk = {
      sdkName: sdkName,
      args: args
    },
    msg = {
      isOn: isOn,
      url: location.href,
      title: document.title,
      desc: document.title,
      img_url: document.images.length ? document.images[0].src : "http://mmbiz.qpic.cn/mmbiz/icTdbqWNOwNRt8Qia4lv7k3M9J1SKqKCImxJCt7j9rHYicKDI45jRPBxdzdyREWnk0ia0N5TMnMfth7SdxtzMvVgXg/0",
      link: void 0
    };

  callSystemCmd("backgroundjs", sdk, EXEC_JSSDK, msg)
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
    var data = {
      eventName: eventName,
      data: params
    };
    callSystemCmd("backgroundjs", data, TO_APP_SERVICE)//msg com
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
  var msg = {}, ext = {};
  callSystemCmd("backgroundjs", msg, "PULLDOWN_REFRESH", ext)
});
window.addEventListener("message", function (event) {//处理地图相关通讯
  var data = event.data;
  if (data && "object" === typeof(data) && ("geolocation" === data.module || "locationPicker" === data.module)) {
    if("geolocation" == data.module){
      data = {
        module: "locationPicker",
        latlng: {
          lat: data.lat,
          lng: data.lng
        },
        poiaddress: "" + data.province + data.city,
        poiname: data.addr,
        cityname: data.city
      }
    }
    if("locationPicker" == data.module){
      systemBridge.doCommand(data);
    }
    alert("map handle:" + JSON.stringify(data))
  }
})
window.WeixinJSBridge = {
  pullDownRefresh,
  invoke: invoke,
  invokeCallbackHandler: invokeCallbackHandler,
  on: on,
  publish: publish,
  subscribe: subscribe,
  subscribeHandler: subscribeHandler
}