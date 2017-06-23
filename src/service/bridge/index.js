import proxyRequirst from './proxyRequirst';
var callbacks = {},
  callbackIndex = 0,
  defaultEventHandlers = {},
  eventPrefix = "custom_event_",
  firstEnter = false,
  handlers = {},
  tage = 0,
  showWarning = false,
  apphash = __wxConfig__.apphash,
  appid = __wxConfig__.appid,
  appname = __wxConfig__.appname,
  webviewID = 10000,
  __id = 0;//指定固定值
function isLimitedApi(event) {
  var limitedApi = ['openAddress','chooseContact'];
  if(~limitedApi.indexOf(event)){
    return true;
  }
}
function isLockSDK(apiName) {
  return "navigateTo" === apiName || "redirectTo" === apiName;
}

function isSyncSDK(apiName) {
  return "getSystemInfo" === apiName || /Sync$/.test(apiName);
};

var callSystemCmd = function(sdkName, args, callbackID) {
  var config = {
    sdkName: sdkName,
    args: args,
    callbackID: callbackID
  };
  isSyncSDK(sdkName) ? doSyncCommand(config) : doCommand(config);
};
var doSyncCommand = function(config) {//通过prompt交互
  config.command = "COMMAND_FROM_ASJS";
  config.appid = appid;
  config.appname = appname;
  config.apphash = apphash;
  config.webviewID = webviewID;
  var res = systemBridge.doSyncCommand(config);
  var //command = res.command,//GET_ASSDK_RES
    msg = res.msg || {},
    ext = res.ext || {};
  invokeCallbackHandler(ext.callbackID, msg);
};

var doCommand = function(config) {//postMessage notice e
  config.to = "backgroundjs";
  config.comefrom = "webframe";
  config.command = "COMMAND_FROM_ASJS";
  config.appid = apphash;
  config.appname = appname;
  config.apphash = apphash;
  config.webviewID = webviewID;
  config.__id = __id;
  __id++;
  systemBridge.doCommand(config);
};
var userApi = {
  login: function(event, temp, sendMsg) {
    sendMsg({
      errMsg: "login:ok",
      code: "the code is a mock one"
    });
  },
  authorize: function(event, temp, sendMsg) {
    sendMsg({
      errMsg: "authorize:fail"
    });
  },
  operateWXData: function(event, temp, sendMsg) {
    var obj = __wxConfig__.userInfo;
    sendMsg({
      errMsg: "operateWXData:ok",
      data: {
        data: JSON.stringify({
          nickName: obj.nickName,
          avatarUrl: obj.headUrl,
          gender: "male" === obj.sex ? 1 : 2,
          province: obj.province,
          city: obj.city,
          country: obj.country
        })
      }
    });
  }
};
var invoke = function (eventName, params, callback) {
    if(~['reportKeyValue','reportIDKey'].indexOf(eventName)){
      return;
    }
    if(userApi.hasOwnProperty(eventName)){
      userApi[eventName](eventName,params,callback);
      return;
    }else if (!isLimitedApi(eventName)) {
      var lockSDK = isLockSDK(eventName),
        time = +new Date;
      if(!(lockSDK && time - tage < 200)){//非连续不到200ms切换页面及非受限接口
        tage = lockSDK ? time : 0

        if (proxyRequirst[eventName]) {
          proxyRequirst[eventName].apply(this, arguments);
        } else {

          var callbackId = ++callbackIndex;
          callbacks[callbackId] = callback,
            callSystemCmd(eventName, params, callbackId);//eventName->sdkName
        }
      }

    }else if(!showWarning){
      showWarning = true;
      var callbackId = ++callbackIndex;
      var callbackRes = function(params) {};
      callbacks[callbackId] = callbackRes;
      callSystemCmd('showModal', {
        title: '请注意，转成h5以后，依赖微信相关的接口调用将无法支持，请自行改造成h5的兼容方式',
        content: "",
        confirmText: "确定",
        cancelText: "取消",
        showCancel: !0,
        confirmColor: "#3CC51F",
        cancelColor: "#000000"
      }, callbackId);//eventName->sdkName

    }
  },
  invokeCallbackHandler = function (callbackId, params) {
    var callback = callbacks[callbackId];
    "function" == typeof callback && callback(params),
      delete callbacks[callbackId]
  },
  publish = function (eventName, data, webviewIds, flag) {
/*
    var filterEvent = ["appDataChange","pageInitData","__updateAppData"];
    filterEvent.indexOf(eventName)=== -1 || flag || doCommand({
      appData: __wxAppData,
      sdkName: "send_app_data"
    });
*/
    doCommand({
      eventName: eventPrefix + eventName,//对应view subscribe
      data: data,
      webviewIds: webviewIds,
      sdkName: "publish"
    });
  },
  on = function (eventName, handler) {
    if ("onAppEnterForeground" === eventName) {
      if (!firstEnter) {
        handler && handler({});
        firstEnter = true;
      }
    }

    defaultEventHandlers[eventName] = handler
  },
  subscribe = function (eventName, handler) {
    handlers[eventPrefix + eventName] = handler
  },
  subscribeHandler = function (eventName, data, webviewId, reportParams) { //执行注册的回调
    var handler;
    handler = eventName.indexOf(eventPrefix) != -1 ? handlers[eventName] : defaultEventHandlers[eventName],
    "function" == typeof handler && handler(data, webviewId, reportParams)
  };

window.DeviceOrientation = function(x, y, z) {
  defaultEventHandlers['onAccelerometerChange'] && defaultEventHandlers['onAccelerometerChange']({
    x: x,
    y: y,
    z: z
  });
};

window.ServiceJSBridge = {
  doCommand,
  invoke: invoke,
  invokeCallbackHandler: invokeCallbackHandler,
  on: on,
  publish: publish,
  subscribe: subscribe,
  subscribeHandler: subscribeHandler
}