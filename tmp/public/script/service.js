(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else {
		var a = factory();
		for(var i in a) (typeof exports === 'object' ? exports : root)[i] = a[i];
	}
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _proxyRequirst = __webpack_require__(4);

	var _proxyRequirst2 = _interopRequireDefault(_proxyRequirst);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
	    __id = 0; //指定固定值
	function isLimitedApi(event) {
	  var limitedApi = ['openAddress', 'chooseContact'];
	  if (~limitedApi.indexOf(event)) {
	    return true;
	  }
	}
	function isLockSDK(apiName) {
	  return "navigateTo" === apiName || "redirectTo" === apiName;
	}

	function isSyncSDK(apiName) {
	  return "getSystemInfo" === apiName || /Sync$/.test(apiName);
	};

	var callSystemCmd = function callSystemCmd(sdkName, args, callbackID) {
	  var config = {
	    sdkName: sdkName,
	    args: args,
	    callbackID: callbackID
	  };
	  isSyncSDK(sdkName) ? doSyncCommand(config) : doCommand(config);
	};
	var doSyncCommand = function doSyncCommand(config) {
	  //通过prompt交互
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

	var doCommand = function doCommand(config) {
	  //postMessage notice e
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
	  login: function login(event, temp, sendMsg) {
	    sendMsg({
	      errMsg: "login:ok",
	      code: "the code is a mock one"
	    });
	  },
	  authorize: function authorize(event, temp, sendMsg) {
	    sendMsg({
	      errMsg: "authorize:fail"
	    });
	  },
	  operateWXData: function operateWXData(event, temp, sendMsg) {
	    var obj = __wxConfig__.userInfo;
	    sendMsg({
	      errMsg: "operateWXData:ok",
	      data: {
	        data: (0, _stringify2.default)({
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
	var invoke = function invoke(eventName, params, callback) {
	  if (~['reportKeyValue', 'reportIDKey'].indexOf(eventName)) {
	    return;
	  }
	  if (userApi.hasOwnProperty(eventName)) {
	    userApi[eventName](eventName, params, callback);
	    return;
	  } else if (!isLimitedApi(eventName)) {
	    var lockSDK = isLockSDK(eventName),
	        time = +new Date();
	    if (!(lockSDK && time - tage < 200)) {
	      //非连续不到200ms切换页面及非受限接口
	      tage = lockSDK ? time : 0;

	      if (_proxyRequirst2.default[eventName]) {
	        _proxyRequirst2.default[eventName].apply(this, arguments);
	      } else {

	        var callbackId = ++callbackIndex;
	        callbacks[callbackId] = callback, callSystemCmd(eventName, params, callbackId); //eventName->sdkName
	      }
	    }
	  } else if (!showWarning) {
	    showWarning = true;
	    var callbackId = ++callbackIndex;
	    var callbackRes = function callbackRes(params) {};
	    callbacks[callbackId] = callbackRes;
	    callSystemCmd('showModal', {
	      title: '请注意，转成h5以后，依赖微信相关的接口调用将无法支持，请自行改造成h5的兼容方式',
	      content: "",
	      confirmText: "确定",
	      cancelText: "取消",
	      showCancel: !0,
	      confirmColor: "#3CC51F",
	      cancelColor: "#000000"
	    }, callbackId); //eventName->sdkName
	  }
	},
	    invokeCallbackHandler = function invokeCallbackHandler(callbackId, params) {
	  var callback = callbacks[callbackId];
	  "function" == typeof callback && callback(params), delete callbacks[callbackId];
	},
	    publish = function publish(eventName, data, webviewIds, flag) {
	  /*
	      var filterEvent = ["appDataChange","pageInitData","__updateAppData"];
	      filterEvent.indexOf(eventName)=== -1 || flag || doCommand({
	        appData: __wxAppData,
	        sdkName: "send_app_data"
	      });
	  */
	  doCommand({
	    eventName: eventPrefix + eventName, //对应view subscribe
	    data: data,
	    webviewIds: webviewIds,
	    sdkName: "publish"
	  });
	},
	    on = function on(eventName, handler) {
	  if ("onAppEnterForeground" === eventName) {
	    if (!firstEnter) {
	      handler && handler({});
	      firstEnter = true;
	    }
	  }

	  defaultEventHandlers[eventName] = handler;
	},
	    subscribe = function subscribe(eventName, handler) {
	  handlers[eventPrefix + eventName] = handler;
	},
	    subscribeHandler = function subscribeHandler(eventName, data, webviewId, reportParams) {
	  //执行注册的回调
	  var handler;
	  handler = eventName.indexOf(eventPrefix) != -1 ? handlers[eventName] : defaultEventHandlers[eventName], "function" == typeof handler && handler(data, webviewId, reportParams);
	};

	window.DeviceOrientation = function (x, y, z) {
	  defaultEventHandlers['onAccelerometerChange'] && defaultEventHandlers['onAccelerometerChange']({
	    x: x,
	    y: y,
	    z: z
	  });
	};

	window.ServiceJSBridge = {
	  doCommand: doCommand,
	  invoke: invoke,
	  invokeCallbackHandler: invokeCallbackHandler,
	  on: on,
	  publish: publish,
	  subscribe: subscribe,
	  subscribeHandler: subscribeHandler
	};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(3)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var webSocket = null,
	    requestIndex = 0;
	var jsonp = function jsonp(params, callback, networkTimeout) {
	    var jsonpName = "jsonp_" + Date.now() + "_" + Math.random().toString().substr(2),
	        callbackName = "callback",
	        url = params.url,
	        timeOut,
	        script = document.createElement("script");

	    url += (url.indexOf("?") === -1 ? "?" : "&") + callbackName + "=" + jsonpName;
	    script.src = url;
	    if ("number" == typeof networkTimeout) {
	        timeOut = setTimeout(function () {
	            window[jsonpName] = function () {};
	            callback && callback({
	                errMsg: "request:fail"
	            });
	        }, networkTimeout);
	    }

	    window[jsonpName] = function (response) {
	        try {
	            timeOut && clearTimeout(timeOut);
	            callback && callback({
	                errMsg: "request:ok",
	                data: response,
	                statusCode: 200
	            });
	        } finally {
	            delete window[jsonpName];
	            script.parentNode.removeChild(script);
	        }
	    };
	    document.body.appendChild(script);
	};
	var request = function request(event, params, callback) {
	    requestIndex++;
	    var url = params.url,
	        header = params.header || {},
	        timeOut,
	        requestObj = new XMLHttpRequest(),
	        method = params.method || "POST",
	        networkTimeout = 3e4;
	    if (__wxConfig__ && __wxConfig__.weweb && __wxConfig__.weweb.requestProxy) {
	        requestObj.open(method, __wxConfig__.weweb.requestProxy, true);
	        requestObj.onreadystatechange = function () {
	            if (3 == requestObj.readyState, 4 == requestObj.readyState) {
	                requestObj.onreadystatechange = null;
	                var statusCode = requestObj.status;
	                if (0 != statusCode) {
	                    requestIndex--;
	                    timeOut && clearTimeout(timeOut);
	                    callback && callback({
	                        errMsg: "request:ok",
	                        data: requestObj.responseText,
	                        statusCode: statusCode
	                    });
	                }
	            }
	        };
	        requestObj.onerror = function () {
	            callback && callback({
	                errMsg: "request:fail"
	            });
	        };
	        requestObj.setRequestHeader('X-Remote', params.url);
	        var attrCount = 0;
	        for (var attr in header) {
	            "content-type" === attr.toLowerCase() && attrCount++;
	        }
	        attrCount >= 2 && delete header["content-type"];
	        var typeTag = false;
	        for (var headerAttr in header) {
	            if (header.hasOwnProperty(headerAttr)) {
	                var headerStr = headerAttr.toLowerCase();
	                typeTag = "content-type" == headerStr || typeTag;
	                if ("cookie" === headerStr) {
	                    requestObj.setRequestHeader("_Cookie", header[headerAttr]);
	                } else {
	                    requestObj.setRequestHeader(headerAttr, header[headerAttr]);
	                }
	            }
	        }"POST" != method || typeTag || requestObj.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
	        requestObj.setRequestHeader("X-Requested-With", "requestObj");
	        if ("number" == typeof networkTimeout) {
	            timeOut = setTimeout(function () {
	                requestObj.abort("timeout");
	                params.complete && params.complete();
	                params.complete = null;
	                requestIndex--;
	                callback && callback({
	                    errMsg: "request:fail"
	                });
	            }, networkTimeout);
	        }

	        var tempData = "string" == typeof params.data ? params.data : null;
	        try {
	            requestObj.send(tempData);
	        } catch (y) {
	            requestIndex--;
	            callback && callback({
	                errMsg: "request:fail"
	            });
	        }
	    } else {
	        jsonp(params, callback, networkTimeout);
	    }
	};

	var connectSocket = function connectSocket(event, temp, callback) {
	    var url = temp.url,
	        header = temp.header;
	    /*安全域名检测
	        if (!loadFile.checkUrl(url, "webscoket")) {
	            return void(callback && callback({
	                errMsg: "connectSocket:fail"
	            }));
	        }
	    */
	    webSocket = new WebSocket(url);
	    for (var attr in header) {
	        header.hasOwnProperty(attr);
	    };
	    webSocket.onopen = function (data) {
	        ServiceJSBridge.subscribeHandler("onSocketOpen", data);
	    };
	    webSocket.onmessage = function (data) {
	        ServiceJSBridge.subscribeHandler("onSocketMessage", {
	            data: data.data
	        });
	    };
	    webSocket.onclose = function (data) {
	        ServiceJSBridge.subscribeHandler("onSocketClose", data);
	    };
	    webSocket.onerror = function (data) {
	        ServiceJSBridge.subscribeHandler("onSocketError", data);
	    };
	    callback && callback({
	        errMsg: "connectSocket:ok"
	    });
	};
	var closeSocket = function closeSocket(event, temp, callback) {
	    if (webSocket) {
	        webSocket.close();
	        webSocket = null;
	        callback && callback({
	            errMsg: "closeSocket:ok"
	        });
	    } else {
	        callback && callback({
	            errMsg: "closeSocket:fail"
	        });
	    }
	};
	var sendSocketMessage = function sendSocketMessage(event, temp, callback) {
	    var data = temp.data;
	    if (webSocket) {
	        try {
	            webSocket.send(data);
	            callback && callback({
	                errMsg: "sendSocketMessage:ok"
	            });
	        } catch (Event) {
	            callback && callback({
	                errMsg: "sendSocketMessage:fail " + Event.message
	            });
	        }
	    } else {
	        callback && callback({
	            errMsg: "sendSocketMessage:fail"
	        });
	    }
	};
	exports.default = {
	    request: request,
	    connectSocket: connectSocket,
	    sendSocketMessage: sendSocketMessage,
	    closeSocket: closeSocket
	};

/***/ })
/******/ ])
});
;
var Reporter =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	var _errorType = __webpack_require__(38);

	var errorType = _interopRequireWildcard(_errorType);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var jsBridge = void 0,
	    bridgeName = void 0,
	    logEventName = void 0;
	if (typeof ServiceJSBridge !== 'undefined') {
	    jsBridge = ServiceJSBridge;
	    bridgeName = 'Service';
	    logEventName = 'service2app_error';
	} else if (typeof WeixinJSBridge !== 'undefined') {
	    jsBridge = WeixinJSBridge;
	    bridgeName = 'Weixin';
	    logEventName = 'view2app_error';
	}
	if (typeof __wxConfig == 'undefined') {
	    var _wxConfig = typeof __wxConfig__ !== 'undefined' && __wxConfig__ || {};
	}
	function onBridgeReady(fn) {
	    typeof jsBridge !== 'undefined' ? fn() : document.addEventListener(bridgeName + 'JSBridgeReady', fn, !1);
	}
	function invoke() {
	    // invoke
	    var args = arguments;
	    onBridgeReady(function () {
	        jsBridge.invoke.apply(jsBridge, args);
	    });
	}
	function publish() {
	    // publish
	    var args = arguments;
	    onBridgeReady(function () {
	        jsBridge.publish.apply(jsBridge, args);
	    });
	}
	function getUpdateTime() {
	    // get wx.version.updateTime
	    return typeof wx !== 'undefined' ? wx.version && wx.version.updateTime || '' : '';
	}
	function _reportKeyValue() {
	    //以key/value的形式上报日志
	    !reportKeyValues || reportKeyValues.length <= 0 || (invoke('reportKeyValue', { dataArray: reportKeyValues }), reportKeyValues = []);
	}
	function _reportIDKey() {
	    !reportIDKeys || reportIDKeys.length <= 0 || (invoke('reportIDKey', { dataArray: reportIDKeys }), reportIDKeys = []);
	}
	function systemLog() {
	    !systemLogs || systemLogs.length <= 0 || (invoke('systemLog', { dataArray: systemLogs }), systemLogs = []);
	}
	function getPlatName() {
	    // get platname
	    return "devtools";
	}
	function safeCall(fn) {
	    //
	    return function () {
	        try {
	            return fn.apply(fn, arguments);
	        } catch (e) {
	            console.error('reporter error:' + e.message);
	        }
	    };
	}
	function _defindGeter(key) {
	    defineObj.__defineGetter__(key, function () {
	        return safeCall(utils[key]);
	    });
	}
	var reportIDKeyLength = 1,
	    reportKeyValueLengthThreshold = 20,
	    systemLogLength = 50,
	    submitTLThreshold = 50,
	    reportKeyTLThreshold = 50,
	    reportIDKeyTLThreshold = 20,
	    logTLThreshold = 50,
	    speedReportThreshold = 500,
	    slowReportThreshold = 500,
	    errorReportTemp = 3,
	    errorReportSize = 3,
	    slowReportLength = 3,
	    errorReportLength = 50,
	    slowReportValueLength = 50,
	    reportKeyValues = [],
	    reportIDKeys = [],
	    systemLogs = [],
	    reportKeyTimePreTime = 0,
	    reportIDKeyPreTime = 0,
	    logPreTime = 0,
	    submitPreTime = 0,
	    slowReportTime = 0,
	    speedReportMap = {},
	    errorReportMap = {},
	    slowReportMap = {};
	typeof logxx === 'function' && logxx('reporter-sdk start');
	var isIOS = getPlatName() === 'ios';
	var errListenerFns = function errListenerFns() {};
	var utils = {
	    // log report obj
	    surroundThirdByTryCatch: function surroundThirdByTryCatch(fn, ext) {
	        return function () {
	            var res;
	            try {
	                var startTime = Date.now();
	                res = fn.apply(fn, arguments);
	                var doTime = Date.now() - startTime;
	                doTime > 1e3 && utils.slowReport({
	                    key: 'apiCallback',
	                    cost: doTime,
	                    extend: ext
	                });
	            } catch (e) {
	                utils.thirdErrorReport({
	                    error: e,
	                    extend: ext
	                });
	            }
	            return res;
	        };
	    },
	    slowReport: function slowReport(params) {
	        var key = params.key,
	            cost = params.cost,
	            extend = params.extend,
	            force = params.force,
	            slowValueType = errorType.SlowValueType[key],
	            now = Date.now();
	        //指定类型 强制或上报间隔大于＝指定阀值 extend类型数不超出阀值&当前extend上报数不超出阀值
	        var flag = slowValueType && (force || !(now - slowReportTime < slowReportThreshold)) && !((0, _keys2.default)(slowReportMap).length > slowReportValueLength || (slowReportMap[extend] || (slowReportMap[extend] = 0), slowReportMap[extend]++, slowReportMap[extend] > slowReportLength));
	        if (flag) {
	            slowReportTime = now;
	            var value = cost + ',' + encodeURIComponent(extend) + ',' + slowValueType;
	            utils.reportKeyValue({
	                key: 'Slow',
	                value: value,
	                force: !0
	            });
	        }
	    },
	    speedReport: function speedReport(params) {
	        var key = params.key,
	            data = params.data,
	            timeMark = params.timeMark,
	            force = params.force,
	            SpeedValueType = errorType.SpeedValueType[key],
	            now = Date.now(),
	            dataLength = 0,
	            nativeTime = timeMark.nativeTime,
	            flag = SpeedValueType && (force || !(now - (speedReportMap[SpeedValueType] || 0) < speedReportThreshold)) && timeMark.startTime && timeMark.endTime && (SpeedValueType != 1 && SpeedValueType != 2 || nativeTime);
	        if (flag) {
	            data && (dataLength = (0, _stringify2.default)(data).length);
	            speedReportMap[SpeedValueType] = now;
	            var value = SpeedValueType + ',' + timeMark.startTime + ',' + nativeTime + ',' + nativeTime + ',' + timeMark.endTime + ',' + dataLength;
	            utils.reportKeyValue({
	                key: 'Speed',
	                value: value,
	                force: true
	            });
	        }
	    },
	    reportKeyValue: function reportKeyValue(params) {
	        var key = params.key,
	            value = params.value,
	            force = params.force;
	        errorType.KeyValueType[key] && (!force && Date.now() - reportKeyTimePreTime < reportKeyTLThreshold || (reportKeyTimePreTime = Date.now(), reportKeyValues.push({ key: errorType.KeyValueType[key], value: value }), reportKeyValues.length >= reportKeyValueLengthThreshold && _reportKeyValue()));
	    },
	    reportIDKey: function reportIDKey(params) {
	        var id = params.id,
	            key = params.key,
	            force = params.force;
	        errorType.IDKeyType[key] && (!force && Date.now() - reportIDKeyPreTime < reportIDKeyTLThreshold || (reportIDKeyPreTime = Date.now(), reportIDKeys.push({
	            id: id || isIOS ? '356' : '358',
	            key: errorType.IDKeyType[key],
	            value: 1
	        }), reportIDKeys.length >= reportIDKeyLength && _reportIDKey()));
	    },
	    thirdErrorReport: function thirdErrorReport(params) {
	        var error = params.error,
	            extend = params.extend;
	        utils.errorReport({
	            key: 'thirdScriptError',
	            error: error,
	            extend: extend
	        });
	    },
	    errorReport: function errorReport(params) {
	        var key = params.key,
	            error = params.error,
	            extend = params.extend;
	        if (errorType.ErrorType[key]) {
	            var content = extend ? error.message + ';' + extend : error.message,
	                msg = key + '\n' + content + '\n' + error.stack;
	            console.error(msg);
	            typeof window !== 'undefined' && typeof window.__webviewId__ !== 'undefined' ? publish('WEBVIEW_ERROR_MSG', {
	                data: {
	                    msg: msg
	                },
	                options: {
	                    timestamp: Date.now()
	                }
	            }) : utils.triggerErrorMessage(msg);
	            if (!((0, _keys2.default)(errorReportMap).length > errorReportLength)) {
	                var value = errorType.ErrorType[key] + ',' + error.name + ',' + encodeURIComponent(content) + ',' + encodeURIComponent(error.stack) + ',' + encodeURIComponent(getUpdateTime());
	                errorReportMap[value] || (errorReportMap[value] = 0), errorReportMap[value]++, key === 'thirdScriptError' && errorReportMap[value] > errorReportTemp || errorReportMap[value] > errorReportSize || (utils.reportIDKey({
	                    key: key
	                }), utils.reportKeyValue({
	                    key: 'Error',
	                    value: value
	                }), _reportIDKey(), _reportKeyValue(), systemLog());
	            }
	        }
	    },
	    log: function log(_log, debug) {
	        _log && typeof _log === 'string' && (!debug && Date.now() - logPreTime < logTLThreshold || (logPreTime = Date.now(), systemLogs.push(_log + ''), systemLogs.length >= systemLogLength && systemLog()));
	    },
	    submit: function submit() {
	        Date.now() - submitPreTime < submitTLThreshold || (submitPreTime = Date.now(), _reportIDKey(), _reportKeyValue(), systemLog());
	    },
	    registerErrorListener: function registerErrorListener(fn) {
	        typeof fn === 'function' && (errListenerFns = fn);
	    },
	    unRegisterErrorListener: function unRegisterErrorListener() {
	        errListenerFns = function errListenerFns() {};
	    },
	    triggerErrorMessage: function triggerErrorMessage(params) {
	        errListenerFns(params);
	    }
	};
	var defineObj = {};
	for (var key in utils) {
	    _defindGeter(key);
	}

	typeof window !== 'undefined' && (window.onbeforeunload = function () {
	    utils.submit();
	});
	module.exports = defineObj;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(3)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	module.exports = __webpack_require__(3).Object.keys;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(7)
	  , $keys    = __webpack_require__(9);

	__webpack_require__(24)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(8);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(10)
	  , enumBugKeys = __webpack_require__(23);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(11)
	  , toIObject    = __webpack_require__(12)
	  , arrayIndexOf = __webpack_require__(15)(false)
	  , IE_PROTO     = __webpack_require__(19)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(13)
	  , defined = __webpack_require__(8);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(14);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(12)
	  , toLength  = __webpack_require__(16)
	  , toIndex   = __webpack_require__(18);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(17)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(17)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(20)('keys')
	  , uid    = __webpack_require__(22);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(21)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(25)
	  , core    = __webpack_require__(3)
	  , fails   = __webpack_require__(34);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(21)
	  , core      = __webpack_require__(3)
	  , ctx       = __webpack_require__(26)
	  , hide      = __webpack_require__(28)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(27);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(29)
	  , createDesc = __webpack_require__(37);
	module.exports = __webpack_require__(33) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(30)
	  , IE8_DOM_DEFINE = __webpack_require__(32)
	  , toPrimitive    = __webpack_require__(36)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(33) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(31);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(33) && !__webpack_require__(34)(function(){
	  return Object.defineProperty(__webpack_require__(35)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(34)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(31)
	  , document = __webpack_require__(21).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(31);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var IDKeyType = exports.IDKeyType = {
	    login: 1,
	    login_cancel: 2,
	    login_fail: 3,
	    request_fail: 4,
	    connectSocket_fail: 5,
	    closeSocket_fail: 6,
	    sendSocketMessage_fail: 7,
	    uploadFile_fail: 8,
	    downloadFile_fail: 9,
	    redirectTo_fail: 10,
	    navigateTo_fail: 11,
	    navigateBack_fail: 12,
	    appServiceSDKScriptError: 13,
	    webviewSDKScriptError: 14,
	    jsEnginScriptError: 15,
	    thirdScriptError: 16,
	    webviewScriptError: 17,
	    exparserScriptError: 18,
	    startRecord: 19,
	    startRecord_fail: 20,
	    getLocation: 21,
	    getLocation_fail: 22,
	    chooseLocation: 23,
	    chooseLocation_fail: 24,
	    openAddress: 25,
	    openAddress_fail: 26,
	    openLocation: 27,
	    openLocation_fail: 28,
	    makePhoneCall: 29,
	    makePhoneCall_fail: 30,
	    operateWXData: 31,
	    operateWXData_fail: 32,
	    checkLogin: 33,
	    checkLogin_fail: 34,
	    refreshSession: 35,
	    refreshSession_fail: 36,
	    chooseVideo: 37,
	    chooseVideo_fail: 38,
	    chooseImage: 39,
	    chooseImage_fail: 40,
	    verifyPaymentPassword: 41,
	    verifyPaymentPassword_fail: 42,
	    requestPayment: 43,
	    requestPayment_fail: 44,
	    bindPaymentCard: 45,
	    bindPaymentCard_fail: 46,
	    requestPaymentToBank: 47,
	    requestPaymentToBank_fail: 48,
	    openDocument: 49,
	    openDocument_fail: 50,
	    chooseContact: 51,
	    chooseContact_fail: 52,
	    operateMusicPlayer: 53,
	    operateMusicPlayer_fail: 54,
	    getMusicPlayerState_fail: 55,
	    playVoice_fail: 56,
	    setNavigationBarTitle_fail: 57,
	    switchTab_fail: 58,
	    getImageInfo_fail: 59,
	    enableCompass_fail: 60,
	    enableAccelerometer_fail: 61,
	    getStorage_fail: 62,
	    setStorage_fail: 63,
	    clearStorage_fail: 64,
	    removeStorage_fail: 65,
	    getStorageInfo_fail: 66,
	    getStorageSync_fail: 67,
	    setStorageSync_fail: 68,
	    addCard_fail: 69,
	    openCard_fail: 70
	};
	var KeyValueType = exports.KeyValueType = {
	    Speed: "13544",
	    Error: "13582",
	    Slow: "13968"
	};
	var SpeedValueType = exports.SpeedValueType = {
	    webview2AppService: 1,
	    appService2Webview: 2,
	    funcReady: 3,
	    firstGetData: 4,
	    firstRenderTime: 5,
	    reRenderTime: 6,
	    forceUpdateRenderTime: 7,
	    appRoute2newPage: 8,
	    newPage2pageReady: 9,
	    thirdScriptRunTime: 10,
	    pageframe: 11,
	    WAWebview: 12
	};
	var SlowValueType = exports.SlowValueType = {
	    apiCallback: 1,
	    pageInvoke: 2
	};
	var ErrorType = exports.ErrorType = {
	    appServiceSDKScriptError: 1,
	    webviewSDKScriptError: 2,
	    jsEnginScriptError: 3,
	    thirdScriptError: 4,
	    webviewScriptError: 5,
	    exparserScriptError: 6
	};

/***/ })
/******/ ]);
var wd =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	var _assign = __webpack_require__(79);

	var _assign2 = _interopRequireDefault(_assign);

	var _bridge = __webpack_require__(111);

	var _bridge2 = _interopRequireDefault(_bridge);

	var _utils = __webpack_require__(112);

	var _utils2 = _interopRequireDefault(_utils);

	var _Animation = __webpack_require__(122);

	var _Animation2 = _interopRequireDefault(_Animation);

	var _createAudio = __webpack_require__(123);

	var _createAudio2 = _interopRequireDefault(_createAudio);

	var _createVideo = __webpack_require__(138);

	var _createVideo2 = _interopRequireDefault(_createVideo);

	var _map = __webpack_require__(139);

	var _map2 = _interopRequireDefault(_map);

	var _configFlags = __webpack_require__(137);

	var _configFlags2 = _interopRequireDefault(_configFlags);

	var _context = __webpack_require__(140);

	var _context2 = _interopRequireDefault(_context);

	var _canvas = __webpack_require__(141);

	var _canvas2 = _interopRequireDefault(_canvas);

	var _appContextSwitch = __webpack_require__(143);

	var _appContextSwitch2 = _interopRequireDefault(_appContextSwitch);

	__webpack_require__(144);

	__webpack_require__(145);

	__webpack_require__(146);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function addGetterForWX(apiKey) {
	  WX.__defineGetter__(apiKey, function () {
	    return _utils2.default.surroundByTryCatchFactory(apiObj[apiKey], "wd." + apiKey);
	  });
	}

	function paramCheck(apiName, params, paramTpl) {
	  var res = _utils2.default.paramCheck(params, paramTpl);
	  return !res || (logErr(apiName, params, apiName + ":fail parameter error: " + res), !1);
	}

	function paramCheckFail(apiName) {
	  var res = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
	      n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "",
	      errMsg = apiName + ":fail " + n;
	  console.error(errMsg);
	  var fail = Reporter.surroundThirdByTryCatch(options.fail || emptyFn, "at api " + apiName + " fail callback function"),
	      complete = Reporter.surroundThirdByTryCatch(options.complete || emptyFn, "at api " + apiName + " complete callback function");
	  fail({
	    errMsg: errMsg
	  });
	  complete({
	    errMsg: errMsg
	  });
	}

	function checkUrl(apiName, params) {
	  //判断当前页面是否在app.json里
	  var matchArr = /^(.*)\.html/gi.exec(params.url);
	  return !matchArr || __wxConfig__.pages.indexOf(matchArr[1]) !== -1 || (logErr(apiName, params, apiName + ":fail url not in app.json"), !1);
	}

	"function" == typeof logxx && logxx("sdk start");

	var emptyFn = function emptyFn() {},
	    pageData = {},
	    currUrl = "",
	    SDKVersion = "1.4.2",
	    appRouteCallbacks = [],
	    appRouteDoneCallback = [],
	    pageEventFn = void 0,
	    WX = {},
	    hasInvokeEnableAccelerometer = !1,
	    hasInvokeEnableCompass = !1,
	    accelerometerChangeFns = [],
	    compassChangeFns = [],
	    refreshSessionTimeHander = void 0,
	    curWebViewId = void 0;

	_bridge2.default.subscribe("SPECIAL_PAGE_EVENT", function (params) {
	  var data = params.data,
	      eventName = params.eventName,
	      ext = params.ext,
	      webViewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	  if (data && "input" == data.type && "function" == typeof pageEventFn) {
	    var res = pageEventFn({
	      data: data,
	      eventName: eventName,
	      webviewId: webViewId
	    }),
	        value = data.detail.value;
	    if (ext && ext.setKeyboardValue) {} else if ("Object" === _utils2.default.getDataType(res)) {
	      var params = {};
	      value != res.value && (params.value = res.value + "");
	      isNaN(parseInt(res.cursor)) || (params.cursor = parseInt(res.cursor));
	      _bridge2.default.publish("setKeyboardValue", params, [webViewId]);
	    } else {
	      value != res && _bridge2.default.publish("setKeyboardValue", {
	        value: res + "",
	        cursor: -1
	      }, [webViewId]);
	    }
	  }
	});

	var logErr = function logErr(apiName) {
	  var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
	      errMsg = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "";
	  console.error(errMsg);
	  Reporter.triggerErrorMessage(errMsg);
	  var fail = Reporter.surroundThirdByTryCatch(options.fail || emptyFn, "at api " + apiName + " fail callback function"),
	      complete = Reporter.surroundThirdByTryCatch(options.complete || emptyFn, "at api " + apiName + " complete callback function");
	  fail({
	    errMsg: errMsg
	  });
	  complete({
	    errMsg: errMsg
	  });
	};

	var apiObj = { //wx对象
	  invoke: _bridge2.default.invoke,
	  on: _bridge2.default.on,
	  drawCanvas: _canvas2.default.drawCanvas,
	  createContext: _canvas2.default.createContext,
	  createCanvasContext: _canvas2.default.createCanvasContext,
	  canvasToTempFilePath: _canvas2.default.canvasToTempFilePath,
	  reportIDKey: function reportIDKey(e, t) {},
	  reportKeyValue: function reportKeyValue(e, t) {},
	  onPullDownRefresh: function onPullDownRefresh(e) {
	    console.log("onPullDownRefresh has been removed from api list");
	  },
	  setNavigationBarColor: function setNavigationBarColor() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    if (paramCheck('setNavigationBarColor', params, {
	      frontColor: '',
	      backgroundColor: ''
	    })) {
	      if (['#ffffff', '#000000'].indexOf(params.frontColor) === -1) {
	        logErr('setNavigationBarColor', params, 'invalid frontColor "' + params.frontColor + '"');
	      }

	      params.frontColor === '#ffffff' ? _bridge2.default.invokeMethod('setStatusBarStyle', {
	        color: 'white'
	      }) : params.frontColor === '#000000' && _bridge2.default.invokeMethod('setStatusBarStyle', {
	        color: 'black'
	      });

	      var t = (0, _assign2.default)({}, params);
	      delete t.alpha;
	      _bridge2.default.invokeMethod('setNavigationBarColor', t);
	    }
	  },
	  setNavigationBarTitle: function setNavigationBarTitle() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    paramCheck("setNavigationBarTitle", params, {
	      title: ""
	    }) && _bridge2.default.invokeMethod("setNavigationBarTitle", params);
	  },
	  showNavigationBarLoading: function showNavigationBarLoading(e) {
	    _bridge2.default.invokeMethod("showNavigationBarLoading", e);
	  },
	  hideNavigationBarLoading: function hideNavigationBarLoading(e) {
	    _bridge2.default.invokeMethod("hideNavigationBarLoading", e);
	  },
	  stopPullDownRefresh: function stopPullDownRefresh(e) {
	    _bridge2.default.invokeMethod("stopPullDownRefresh", e);
	  },
	  redirectTo: function redirectTo(params) {
	    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
	    if (paramCheck("redirectTo", params, { url: "" })) {
	      params.url = _utils2.default.getRealRoute(currUrl, params.url);
	      params.url = _utils2.default.encodeUrlQuery(params.url);
	      checkUrl("redirectTo", params) && _bridge2.default.invokeMethod("redirectTo", params, {
	        afterSuccess: function afterSuccess() {
	          currUrl = params.url;
	        }
	      });
	    }
	  },
	  //关闭所有页面，打开到应用内的某个页面
	  reLaunch: function reLaunch(params) {
	    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
	    if ("active" != _utils2.default.defaultRunningStatus) {
	      return paramCheckFail("reLaunch", params, "can not invoke reLaunch in background");
	    }
	    if (paramCheck("reLaunch", params, { url: "" })) {
	      params.url = _utils2.default.getRealRoute(currUrl, params.url);
	      params.url = _utils2.default.encodeUrlQuery(params.url);
	      checkUrl("reLaunch", params) && _bridge2.default.invokeMethod("reLaunch", params, {
	        afterSuccess: function afterSuccess() {
	          currUrl = params.url;
	        }, afterFail: function afterFail() {
	          console.log('failed');
	        }

	      });
	    }
	  },
	  createSelectorQuery: function createSelectorQuery(e) {
	    //返回一个SelectorQuery对象实例
	    var t = null;
	    if (e && e.page) {
	      t.e.page__wxWebViewId__;
	    } else {
	      var n = getCurrentPages();
	      t = n[n.length - 1].__wxWebviewId__;
	    }
	    console.log(111);
	    return new _utils2.default.wxQuerySelector(t);
	  },

	  pageScrollTo: function pageScrollTo(param) {
	    //将页面滚动到目标位置
	    var target = getCurrentPages(),
	        viewId = target[target.length - 1].__wxWebviewId__;
	    if (param.hasOwnProperty("page") && param.page.hasOwnProperty("__wxWebviewId__")) {
	      viewId = param.page.__wxWebviewId__;
	    }

	    _bridge2.default.invokeMethod("pageScrollTo", param, [viewId]);
	  },

	  navigateTo: function navigateTo(params) {
	    arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
	    if (paramCheck("navigateTo", params, { url: "" })) {
	      params.url = _utils2.default.getRealRoute(currUrl, params.url);
	      params.url = _utils2.default.encodeUrlQuery(params.url);
	      checkUrl("navigateTo", params) && _bridge2.default.invokeMethod("navigateTo", params, {
	        afterSuccess: function afterSuccess() {
	          currUrl = params.url;
	          _context2.default.notifyCurrentRoutetoContext(currUrl);
	        }
	      });
	    }
	  },
	  switchTab: function switchTab() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    if (paramCheck("switchTab", params, { url: "" })) {
	      /\?.*$/.test(params.url) && (console.warn("wd.switchTab: url 不支持 queryString"), params.url = params.url.replace(/\?.*$/, ""));
	      params.url = _utils2.default.getRealRoute(currUrl, params.url);
	      params.url = _utils2.default.encodeUrlQuery(params.url);
	      checkUrl("switchTab", params) && _bridge2.default.invokeMethod("switchTab", params, {
	        afterSuccess: function afterSuccess() {
	          currUrl = params.url;
	          _context2.default.notifyCurrentRoutetoContext(currUrl);
	        }
	      });
	    }
	  },
	  navigateBack: function navigateBack() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    "number" != typeof params.delta ? params.delta = 1 : (params.delta = parseInt(params.delta), params.delta < 1 && (params.delta = 1));
	    _bridge2.default.invokeMethod("navigateBack", params);
	  },
	  getStorage: function getStorage(params) {
	    if (paramCheck("getStorage", params, { key: "" })) {
	      _bridge2.default.invokeMethod("getStorage", params, {
	        beforeSuccess: function beforeSuccess(res) {
	          res.data = _utils2.default.stringToAnyType(res.data, res.dataType);
	          delete res.dataType;
	        },
	        afterFail: function afterFail() {
	          var res = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	          if (res.errMsg && res.errMsg.indexOf("data not found") > 0) return !1;
	        }
	      });
	    }
	  },
	  getStorageSync: function getStorageSync(key) {
	    if (paramCheck("getStorageSync", key, "")) {
	      var rt,
	          apiName = "ios" === _utils2.default.getPlatform() ? "getStorage" : "getStorageSync";
	      _bridge2.default.invokeMethod(apiName, { key: key }, {
	        beforeAll: function beforeAll() {
	          var res = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	          rt = _utils2.default.stringToAnyType(res.data, res.dataType);
	        },
	        afterFail: function afterFail() {
	          var res = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	          if (res.errMsg && res.errMsg.indexOf("data not found") > 0) return !1;
	        }
	      });
	      return rt;
	    }
	  },
	  setStorage: function setStorage(params) {
	    if (paramCheck("setStorage", params, { key: "" })) {
	      try {
	        var opt = _utils2.default.anyTypeToString(params.data),
	            data = opt.data,
	            dataType = opt.dataType;
	        _bridge2.default.invokeMethod("setStorage", {
	          key: params.key,
	          data: data,
	          dataType: dataType,
	          success: params.success,
	          fail: params.fail,
	          complete: params.complete
	        });
	      } catch (e) {
	        "function" == typeof params.fail && params.fail({
	          errMsg: "setStorage:fail " + e.message
	        }), "function" == typeof params.complete && params.complete({
	          errMsg: "setStorage:fail " + e.message
	        });
	      }
	    }
	  },
	  setStorageSync: function setStorageSync(key) {
	    var value = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
	    if (paramCheck("setStorage", key, "")) {
	      var apiName = "ios" === _utils2.default.getPlatform() ? "setStorage" : "setStorageSync",
	          dataObj = _utils2.default.anyTypeToString(value),
	          data = dataObj.data,
	          dataType = dataObj.dataType;
	      _bridge2.default.invokeMethod(apiName, {
	        key: key,
	        data: data,
	        dataType: dataType
	      });
	    }
	  },
	  removeStorage: function removeStorage(params) {
	    paramCheck("removeStorage", params, { key: "" }) && _bridge2.default.invokeMethod("removeStorage", params);
	  },
	  removeStorageSync: function removeStorageSync(key) {
	    paramCheck("removeStorageSync", key, "") && _bridge2.default.invokeMethod("removeStorageSync", {
	      key: key
	    });
	  },
	  clearStorage: function clearStorage(key) {
	    _bridge2.default.invokeMethod("clearStorage", key);
	  },
	  clearStorageSync: function clearStorageSync() {
	    var apiName = "ios" === _utils2.default.getPlatform() ? "clearStorage" : "clearStorageSync";
	    _bridge2.default.invokeMethod(apiName);
	  },
	  getStorageInfo: function getStorageInfo(key) {
	    _bridge2.default.invokeMethod("getStorageInfo", key);
	  },
	  getStorageInfoSync: function getStorageInfoSync() {
	    var rt = void 0;
	    _bridge2.default.invokeMethod("getStorageInfoSync", {}, {
	      beforeAll: function beforeAll(t) {
	        rt = t;
	        delete t.errMsg;
	      }
	    });
	    return rt;
	  },
	  request: function request() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    if (paramCheck("request", params, { url: "" })) {
	      if (_utils2.default.validateUrl(params.url) === !1) return logErr("request", params, 'request:fail invalid url "' + params.url + '"');
	      if ("function" === params.data) return logErr("request", params, "request:fail data should not be Function");
	      var headerType = _utils2.default.getDataType(params.header);
	      params.header = params.header || {};
	      params.header = _utils2.default.convertObjectValueToString(params.header);
	      "Undefined" !== headerType && "Object" !== headerType && (console.warn("wd.request: header must be an object"), params.header = {});
	      params.header = (0, _keys2.default)(params.header).reduce(function (res, cur) {
	        "content-type" === cur.toLowerCase() ? res[cur.toLowerCase()] = params.header[cur] : res[cur] = params.header[cur];
	        return res;
	      }, {});
	      params.method && (params.method = params.method.toUpperCase());
	      var headers = params.header || {},
	          requestMethod = "GET";
	      "string" == typeof params.method && (requestMethod = params.method.toUpperCase());
	      var data;
	      params.dataType = params.dataType || "json";
	      headers["content-type"] = headers["content-type"] || "application/json";
	      data = !params.data ? "" : "string" != typeof params.data ? headers["content-type"].indexOf("application/x-www-form-urlencoded") > -1 ? _utils2.default.urlEncodeFormData(params.data, !0) : headers["content-type"].indexOf("application/json") > -1 ? (0, _stringify2.default)(params.data) : "object" === (0, _typeof3.default)(params.data) ? (0, _stringify2.default)(params.data) : data.toString() : params.data;
	      ("GET" == requestMethod || !__wxConfig__.requestProxy) && (params.url = _utils2.default.addQueryStringToUrl(params.url, params.data));
	      _bridge2.default.invokeMethod("request", {
	        url: params.url,
	        data: data,
	        header: headers,
	        method: requestMethod,
	        success: params.success,
	        fail: params.fail,
	        complete: params.complete
	      }, {
	        beforeSuccess: function beforeSuccess(res) {
	          if ("json" === params.dataType) {
	            try {
	              res.data = JSON.parse(res.data);
	            } catch (e) {}
	          }
	          res.statusCode = parseInt(res.statusCode);
	        }
	      });
	    }
	  },
	  connectSocket: function connectSocket(params) {
	    if (paramCheck("connectSocket", params, { url: "" })) {
	      "object" !== (0, _typeof3.default)(params.header) && "undefined" != typeof params.header && (console.warn("connectSocket: header must be an object"), delete params.header);
	      var header = {};
	      params.header && (header = _utils2.default.convertObjectValueToString(params.header));

	      _bridge2.default.invokeMethod("connectSocket", _utils2.default.assign({}, params, {
	        header: header
	      }), {
	        beforeSuccess: function beforeSuccess(e) {
	          e.statusCode = parseInt(e.statusCode);
	        }
	      });
	    }
	  },
	  closeSocket: function closeSocket(e) {
	    _bridge2.default.invokeMethod("closeSocket", e);
	  },
	  sendSocketMessage: function sendSocketMessage(params) {
	    var paramType = _utils2.default.getDataType(params.data);
	    "devtools" === _utils2.default.getPlatform() ? _bridge2.default.invokeMethod("sendSocketMessage", params) : "String" === paramType ? _bridge2.default.invokeMethod("sendSocketMessage", params) : "ArrayBuffer" === paramType && _bridge2.default.invokeMethod("sendSocketMessage", _utils2.default.assign(params, {
	      data: _utils2.default.arrayBufferToBase64(params.data),
	      isBuffer: !0
	    }));
	  },
	  onSocketOpen: function onSocketOpen(callback) {
	    paramCheck("onSocketOpen", callback, emptyFn) && _bridge2.default.onMethod("onSocketOpen", Reporter.surroundThirdByTryCatch(callback, "at onSocketOpen callback function"));
	  },
	  onSocketClose: function onSocketClose(callback) {
	    paramCheck("onSocketClose", callback, emptyFn) && _bridge2.default.onMethod("onSocketClose", Reporter.surroundThirdByTryCatch(callback, "at onSocketClose callback function"));
	  },
	  onSocketMessage: function onSocketMessage(callback) {
	    if (paramCheck("onSocketMessage", callback, emptyFn)) {
	      callback = Reporter.surroundThirdByTryCatch(callback, "at onSocketMessage callback function");
	      _bridge2.default.onMethod("onSocketMessage", function (params) {
	        "devtools" !== _utils2.default.getPlatform() && params.isBuffer === !0 && (params.data = _utils2.default.base64ToArrayBuffer(params.data));
	        delete params.isBuffer;
	        "devtools" === _utils2.default.getPlatform() && "Blob" === _utils2.default.getDataType(params.data) ? _utils2.default.blobToArrayBuffer(params.data, function (data) {
	          params.data = data, callback(params);
	        }) : callback(params);
	      });
	    }
	  },
	  onSocketError: function onSocketError(callback) {
	    _bridge2.default.onMethod("onSocketError", Reporter.surroundThirdByTryCatch(callback, "at onSocketError callback function"));
	  },
	  uploadFile: function uploadFile(params) {
	    if (paramCheck("uploadFile", params, { url: "", filePath: "", name: "" })) {
	      "object" !== (0, _typeof3.default)(params.header) && "undefined" != typeof params.header && (console.warn("uploadFile: header must be an object"), delete params.header), "object" !== (0, _typeof3.default)(params.formData) && "undefined" != typeof params.formData && (console.warn("uploadFile: formData must be an object"), delete params.formData);
	      var header = {},
	          formData = {};
	      params.header && (header = _utils2.default.convertObjectValueToString(params.header));
	      params.formData && (formData = _utils2.default.convertObjectValueToString(params.formData));
	      _bridge2.default.invokeMethod("uploadFile", _utils2.default.assign({}, params, {
	        header: header,
	        formData: formData
	      }), {
	        beforeSuccess: function beforeSuccess(res) {
	          res.statusCode = parseInt(res.statusCode);
	        }
	      });
	    }
	  },
	  downloadFile: function downloadFile(params) {
	    paramCheck("downloadFile", params, { url: "" }) && _bridge2.default.invokeMethod("downloadFile", params, {
	      beforeSuccess: function beforeSuccess(res) {
	        res.statusCode = parseInt(res.statusCode);
	        var statusArr = [200, 304];
	        statusArr.indexOf(res.statusCode) === -1 && delete res.tempFilePath;
	      }
	    });
	  },
	  chooseImage: function chooseImage() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    _bridge2.default.invokeMethod("chooseImage", _utils2.default.assign({
	      count: 9,
	      sizeType: ["original", "compressed"],
	      sourceType: ["album", "camera"]
	    }, params));
	  },
	  previewImage: function previewImage(params) {
	    paramCheck("previewImage", params, { urls: [""] }) && _bridge2.default.invokeMethod("previewImage", params);
	  },
	  getImageInfo: function getImageInfo(params) {
	    paramCheck("getImageInfo", params, { src: "" }) && (/^(http|https):\/\//.test(params.src) ? _bridge2.default.invokeMethod("downloadFile", { url: params.src }, {
	      afterSuccess: function afterSuccess(res) {
	        params.src = res.tempFilePath;
	        _bridge2.default.invokeMethod("getImageInfo", params, {
	          beforeSuccess: function beforeSuccess(rt) {
	            rt.path = params.src;
	          }
	        });
	      },
	      afterFail: function afterFail() {
	        logErr("getImageInfo", params, "getImageInfo:fail download image fail");
	      }
	    }) : /^wdfile:\/\//.test(params.src) ? _bridge2.default.invokeMethod("getImageInfo", params, {
	      beforeSuccess: function beforeSuccess(rt) {
	        rt.path = params.src;
	      }
	    }) : (params.src = _utils2.default.getRealRoute(currUrl, params.src, !1), _bridge2.default.invokeMethod("getImageInfo", params, {
	      beforeSuccess: function beforeSuccess(rt) {
	        rt.path = params.src;
	      }
	    })));
	  },
	  startRecord: function startRecord(params) {
	    apiObj.appStatus === _configFlags2.default.AppStatus.BACK_GROUND && apiObj.hanged === !1 || _bridge2.default.invokeMethod("startRecord", params);
	  },
	  stopRecord: function stopRecord(params) {
	    _bridge2.default.invokeMethod("stopRecord", params);
	  },
	  playVoice: function playVoice(params) {
	    paramCheck("playVoice", params, { filePath: "" }) && _bridge2.default.invokeMethod("playVoice", params);
	  },
	  pauseVoice: function pauseVoice(e) {
	    _bridge2.default.invokeMethod("pauseVoice", e);
	  },
	  stopVoice: function stopVoice(e) {
	    _bridge2.default.invokeMethod("stopVoice", e);
	  },
	  onVoicePlayEnd: function onVoicePlayEnd(callback) {
	    _bridge2.default.onMethod("onVoicePlayEnd", Reporter.surroundThirdByTryCatch(callback, "at onVoicePlayEnd callback function"));
	  },
	  chooseVideo: function chooseVideo() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    params.sourceType = params.sourceType || ["album", "camera"];
	    params.camera = params.camera || ["front", "back"];
	    _bridge2.default.invokeMethod("chooseVideo", params);
	  },
	  getLocation: function getLocation(params) {
	    console.log("getLocation", params, apiObj.appStatus, apiObj.hanged);

	    apiObj.appStatus === _configFlags2.default.AppStatus.BACK_GROUND && apiObj.hanged === !1 || _bridge2.default.invokeMethod("getLocation", params);
	  },
	  openLocation: function openLocation() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    paramCheck("openLocation", params, { latitude: .1, longitude: .1 }) && _bridge2.default.invokeMethod("openLocation", params);
	  },
	  chooseLocation: function chooseLocation() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    _bridge2.default.invokeMethod("chooseLocation", params);
	  },
	  getNetworkType: function getNetworkType(params) {
	    _bridge2.default.invokeMethod("getNetworkType", params);
	  },
	  getSystemInfo: function getSystemInfo(params) {
	    var platform = _utils2.default.getPlatform();
	    _bridge2.default.invokeMethod("getSystemInfo", params, {
	      beforeSuccess: function beforeSuccess(rt) {
	        rt.platform = platform;
	      }
	    });
	  },
	  getSystemInfoSync: function getSystemInfoSync(params) {
	    var rt = {},
	        platform = _utils2.default.getPlatform();
	    _bridge2.default.invokeMethod("getSystemInfo", {}, {
	      beforeSuccess: function beforeSuccess() {
	        var res = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	        rt = res;
	        rt.platform = platform;
	        delete res.errMsg;
	      }
	    });
	    return rt;
	  },
	  onAccelerometerChange: function onAccelerometerChange(callback) {
	    hasInvokeEnableAccelerometer || (_bridge2.default.invokeMethod("enableAccelerometer", { enable: !0 }), hasInvokeEnableAccelerometer = !0);
	    accelerometerChangeFns.push(Reporter.surroundThirdByTryCatch(callback, "at onAccelerometerChange callback function"));
	  },
	  onCompassChange: function onCompassChange(callback) {
	    hasInvokeEnableCompass || (_bridge2.default.invokeMethod("enableCompass", { enable: !0 }), hasInvokeEnableCompass = !0);
	    compassChangeFns.push(Reporter.surroundThirdByTryCatch(callback, "at onCompassChange callback function"));
	  },
	  reportAction: function reportAction(params) {
	    _bridge2.default.invokeMethod("reportAction", params);
	  },
	  getBackgroundAudioPlayerState: function getBackgroundAudioPlayerState(params) {
	    _bridge2.default.invokeMethod("getMusicPlayerState", params, {
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("getBackgroundAudioPlayerState", "getMusicPlayerState");
	      }
	    });
	  },
	  playBackgroundAudio: function playBackgroundAudio() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    apiObj.appStatus === _configFlags2.default.AppStatus.BACK_GROUND && apiObj.hanged === !1 || _bridge2.default.invokeMethod("operateMusicPlayer", _utils2.default.assign({ operationType: "play" }, params), {
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("operateMusicPlayer", "playBackgroundAudio");
	      }
	    });
	  },
	  pauseBackgroundAudio: function pauseBackgroundAudio() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    _bridge2.default.invokeMethod("operateMusicPlayer", _utils2.default.assign({ operationType: "pause" }, params), {
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("operateMusicPlayer", "pauseBackgroundAudio");
	      }
	    });
	  },
	  seekBackgroundAudio: function seekBackgroundAudio() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    paramCheck("seekBackgroundAudio", params, { position: 1 }) && _bridge2.default.invokeMethod("operateMusicPlayer", _utils2.default.assign({ operationType: "seek" }, params), {
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("operateMusicPlayer", "seekBackgroundAudio");
	      }
	    });
	  },
	  stopBackgroundAudio: function stopBackgroundAudio() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    console.log("stopBackgroundAudio");
	    _bridge2.default.invokeMethod("operateMusicPlayer", _utils2.default.assign({ operationType: "stop" }, params), {
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("operateMusicPlayer", "stopBackgroundAudio");
	      }
	    });
	  },
	  onBackgroundAudioPlay: function onBackgroundAudioPlay(callback) {
	    _bridge2.default.onMethod("onMusicPlay", Reporter.surroundThirdByTryCatch(callback, "at onBackgroundAudioPlay callback function"));
	  },
	  onBackgroundAudioPause: function onBackgroundAudioPause(callback) {
	    _bridge2.default.onMethod("onMusicPause", Reporter.surroundThirdByTryCatch(callback, "at onBackgroundAudioPause callback function"));
	  },
	  onBackgroundAudioStop: function onBackgroundAudioStop(callback) {
	    _bridge2.default.onMethod("onMusicEnd", Reporter.surroundThirdByTryCatch(callback, "at onBackgroundAudioStop callback function"));
	  },
	  login: function login(params) {
	    if (__wxConfig__ && __wxConfig__.weweb && __wxConfig__.weweb.loginUrl) {
	      //引导到自定义的登录页面
	      if (__wxConfig__.weweb.loginUrl.indexOf('/') != 0) {
	        __wxConfig__.weweb.loginUrl = '/' + __wxConfig__.weweb.loginUrl;
	      }
	      apiObj.redirectTo({
	        url: __wxConfig__.weweb.loginUrl
	      });
	    } else {
	      _bridge2.default.invokeMethod("login", params);
	    }
	  },
	  checkLogin: function checkLogin(params) {
	    _bridge2.default.invokeMethod("checkLogin", params);
	  },
	  checkSession: function checkSession(params) {
	    refreshSessionTimeHander && clearTimeout(refreshSessionTimeHander);
	    _bridge2.default.invokeMethod("refreshSession", params, {
	      beforeSuccess: function beforeSuccess(res) {
	        refreshSessionTimeHander = setTimeout(function () {
	          _bridge2.default.invokeMethod("refreshSession");
	        }, 1e3 * res.expireIn);
	        delete res.err_code;
	        delete res.expireIn;
	      },
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("refreshSession", "checkSession");
	      }
	    });
	  },
	  authorize: function authorize(params) {
	    _bridge2.default.invokeMethod("authorize", params);
	  },
	  getUserInfo: function getUserInfo(params) {
	    _bridge2.default.invokeMethod("operateWXData", _utils2.default.assign({
	      data: {
	        api_name: "webapi_getuserinfo",
	        data: params.data || {}
	      }
	    }, params), {
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("operateWXData", "getUserInfo");
	      },
	      beforeSuccess: function beforeSuccess(res) {
	        //"android" ===  utils.getPlatform() && (res.data = JSON.parse(res.data))
	        res.rawData = res.data.data;
	        try {
	          res.userInfo = JSON.parse(res.data.data);
	          res.signature = res.data.signature;
	          res.data.encryptData && (console.group(new Date() + " encryptData 字段即将废除"), console.warn("请使用 encryptedData 和 iv 字段进行解密，详见：https://mp.weixin.qq.com/debug/wxadoc/dev/api/open.html"), console.groupEnd(), res.encryptData = res.data.encryptData);
	          res.data.encryptedData && (res.encryptedData = res.data.encryptedData, res.iv = res.data.iv);
	          delete res.data;
	        } catch (e) {}
	      }
	    });
	  },
	  getFriends: function getFriends(params) {
	    _bridge2.default.invokeMethod("operateWXData", {
	      data: {
	        api_name: "webapi_getfriends",
	        data: params.data || {}
	      },
	      success: params.success,
	      fail: params.fail,
	      complete: params.complete
	    }, {
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("operateWXData", "getFriends");
	      },
	      beforeSuccess: function beforeSuccess(res) {
	        //"android" ===  utils.getPlatform() && (res.data = JSON.parse(res.data))
	        res.rawData = res.data.data;
	        try {
	          res.friends = JSON.parse(res.data.data);
	          res.signature = res.data.signature;
	          delete res.data;
	        } catch (e) {}
	      }
	    });
	  },
	  requestPayment: function requestPayment(params) {
	    paramCheck("requestPayment", params, {
	      timeStamp: "",
	      nonceStr: "",
	      package: "",
	      signType: "",
	      paySign: ""
	    }) && _bridge2.default.invokeMethod("requestPayment", params);
	  },
	  verifyPaymentPassword: function verifyPaymentPassword(params) {
	    _bridge2.default.invokeMethod("verifyPaymentPassword", params);
	  },
	  bindPaymentCard: function bindPaymentCard(params) {
	    _bridge2.default.invokeMethod("bindPaymentCard", params);
	  },
	  requestPaymentToBank: function requestPaymentToBank(params) {
	    _bridge2.default.invokeMethod("requestPaymentToBank", params);
	  },
	  addCard: function addCard(params) {
	    paramCheck("addCard", params, { cardList: [] }) && _bridge2.default.invokeMethod("addCard", params);
	  },
	  openCard: function openCard(params) {
	    paramCheck("openCard", params, { cardList: [] }) && _bridge2.default.invokeMethod("openCard", params);
	  },
	  scanCode: function scanCode() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    paramCheck("scanCode", params, {}) && _bridge2.default.invokeMethod("scanCode", params, {
	      beforeSuccess: function beforeSuccess(res) {
	        "string" == typeof res.path && (res.path = res.path.replace(/\.html$/, ""), res.path = res.path.replace(/\.html\?/, "?"));
	      }
	    });
	  },
	  openAddress: function openAddress(params) {
	    _bridge2.default.invokeMethod("openAddress", params);
	  },
	  saveFile: function saveFile(params) {
	    paramCheck("saveFile", params, { tempFilePath: "" }) && _bridge2.default.invokeMethod("saveFile", params);
	  },
	  openDocument: function openDocument(params) {
	    paramCheck("openDocument", params, { filePath: "" }) && _bridge2.default.invokeMethod("openDocument", params);
	  },
	  chooseContact: function chooseContact(params) {
	    _bridge2.default.invokeMethod("chooseContact", params);
	  },
	  makePhoneCall: function makePhoneCall() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    paramCheck("makePhoneCall", params, { phoneNumber: "" }) && _bridge2.default.invokeMethod("makePhoneCall", params);
	  },
	  onAppRoute: function onAppRoute(params, t) {
	    appRouteCallbacks.push(params);
	  },
	  onAppRouteDone: function onAppRouteDone(params, t) {
	    appRouteDoneCallback.push(params);
	  },
	  onAppEnterBackground: function onAppEnterBackground(params) {
	    _appContextSwitch2.default.onAppEnterBackground.call(apiObj, params);
	  },
	  onAppEnterForeground: function onAppEnterForeground(params) {
	    _appContextSwitch2.default.onAppEnterForeground.call(apiObj, params);
	  },
	  onAppRunningStatusChange: function onAppRunningStatusChange(params) {
	    _appContextSwitch2.default.onAppRunningStatusChange.call(apiObj, params);
	  },
	  setAppData: function setAppData(data) {
	    var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
	        webviewIds = arguments[2];
	    arguments[3];
	    options.forceUpdate = "undefined" != typeof options.forceUpdate && options.forceUpdate;
	    if (_utils2.default.isObject(data) === !1) throw new _utils2.default.AppServiceSdkKnownError("setAppData:data should be an object");
	    !function () {
	      var hasUpdate = !1,
	          tmpData = {},
	          setCurData = function setCurData(key, value, type) {
	        hasUpdate = !0;
	        tmpData[key] = value;
	        "Array" === type || "Object" === type ? pageData[key] = JSON.parse((0, _stringify2.default)(value)) : pageData[key] = value;
	      };
	      for (var oKey in data) {
	        var curValue = data[oKey],
	            gValue = pageData[oKey],
	            gValueType = _utils2.default.getDataType(gValue),
	            curValueType = _utils2.default.getDataType(curValue);
	        gValueType !== curValueType ? setCurData(oKey, curValue, curValueType) : "Array" == gValueType || "Object" == gValueType ? (0, _stringify2.default)(gValue) !== (0, _stringify2.default)(curValue) && setCurData(oKey, curValue, curValueType) : "String" == gValueType || "Number" == gValueType || "Boolean" == gValueType ? gValue.toString() !== curValue.toString() && setCurData(oKey, curValue, curValueType) : "Date" == gValueType ? gValue.getTime().toString() !== curValue.getTime().toString() && setCurData(oKey, curValue, curValueType) : gValue !== curValue && setCurData(oKey, curValue, curValueType);
	      }
	      options.forceUpdate ? _bridge2.default.publish("appDataChange", {
	        data: data,
	        option: {
	          timestamp: Date.now(),
	          forceUpdate: !0
	        }
	      }, webviewIds) : hasUpdate && _bridge2.default.publish("appDataChange", {
	        data: tmpData
	      }, webviewIds);
	    }();
	  },
	  onPageEvent: function onPageEvent(e, t) {
	    console.warn("'onPageEvent' is deprecated, use 'Page[eventName]'");
	  },
	  createAnimation: function createAnimation() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    if (paramCheck("createAnimation", params, {})) return new _Animation2.default(params);
	  },
	  createAudioContext: function createAudioContext(e) {
	    return _createAudio2.default.call(apiObj, e, curWebViewId);
	  },
	  createVideoContext: function createVideoContext(e) {
	    return _createVideo2.default.call(apiObj, e, curWebViewId);
	  },
	  createMapContext: function createMapContext(e) {
	    return new _map2.default.MapContext(e);
	  },
	  onWebviewEvent: function onWebviewEvent(fn, t) {
	    pageEventFn = fn;
	    _bridge2.default.subscribe("PAGE_EVENT", function (params) {
	      var data = params.data,
	          eventName = params.eventName,
	          webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	      fn({
	        data: data,
	        eventName: eventName,
	        webviewId: webviewId
	      });
	    });
	  },
	  onNativeEvent: function onNativeEvent(fn) {
	    ["onCanvasTouchStart", "onCanvasTouchMove", "onCanvasTouchEnd"].forEach(function (key) {
	      _bridge2.default.onMethod(key, function (data, webviewId) {
	        fn({
	          data: data,
	          eventName: key,
	          webviewId: webviewId
	        });
	      });
	    });
	  },
	  hideKeyboard: function hideKeyboard(params) {
	    _bridge2.default.publish("hideKeyboard", {}); //"devtools" ==  utils.getPlatform() ? bridge.publish("hideKeyboard", {}) :  bridge.invokeMethod("hideKeyboard", params)
	  },
	  getPublicLibVersion: function getPublicLibVersion() {
	    var rt;
	    _bridge2.default.invokeMethod("getPublicLibVersion", {
	      complete: function complete(res) {
	        res.version ? rt = res.version : (rt = res, delete rt.errMsg);
	      }
	    });
	    return rt;
	  },
	  showModal: function showModal() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
	        options = {
	      title: "",
	      content: "",
	      confirmText: "确定",
	      cancelText: "取消",
	      showCancel: !0,
	      confirmColor: "#3CC51F",
	      cancelColor: "#000000"
	    };
	    options = _utils2.default.extend(options, params);
	    if (paramCheck("showModal", options, {
	      title: "",
	      content: "",
	      confirmText: "",
	      cancelText: "",
	      confirmColor: "",
	      cancelColor: ""
	    })) return options.confirmText.length > 4 ? void logErr("showModal", params, "showModal:fail confirmText length should not large then 4") : options.cancelText.length > 4 ? void logErr("showModal", params, "showModal:fail cancelText length should not large then 4") : _bridge2.default.invokeMethod("showModal", options, {
	      beforeSuccess: function beforeSuccess(rt) {
	        rt.confirm = Boolean(rt.confirm);
	      }
	    });
	  },
	  showToast: function showToast() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
	        options = {
	      duration: 1500,
	      title: "",
	      icon: "success",
	      mask: !1
	    };
	    options = _utils2.default.extend(options, params);
	    delete options.image;
	    ["success", "loading"].indexOf(options.icon) < 0 && (options.icon = "success");
	    options.duration > 1e4 && (options.duration = 1e4);
	    paramCheck("showToast", options, {
	      duration: 1,
	      title: "",
	      icon: ""
	    }) && _bridge2.default.invokeMethod("showToast", options);
	  },
	  hideToast: function hideToast(e) {
	    _bridge2.default.invokeMethod("hideToast", e);
	  },
	  showLoading: function showLoading() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
	        defaultArgs = { title: "", icon: "loading", mask: !1, duration: 1e8 };
	    defaultArgs = _utils2.default.extend(defaultArgs, params);
	    params.image && (defaultArgs.image = _utils2.default.getRealRoute(currUrl, params.image, !1));
	    paramCheck("showLoading", defaultArgs, {
	      duration: 1,
	      title: ""
	    }) && _bridge2.default.invokeMethod("showToast", defaultArgs, {
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("showToast", "showLoading");
	      }
	    });
	  },
	  hideLoading: function hideLoading(args) {
	    _bridge2.default.invokeMethod("hideToast", args, {
	      beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("hideToast", "hideLoading");
	      }
	    });
	  },
	  showActionSheet: function showActionSheet() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
	        options = {
	      itemList: [],
	      itemColor: "#000000"
	    };
	    options = _utils2.default.extend(options, params);
	    options.cancelText = "取消";
	    options.cancelColor = "#000000";
	    if (paramCheck("showActionSheet", options, { itemList: ["1"], itemColor: "" })) {
	      return params.itemList.length > 6 ? void logErr("showActionSheet", params, "showActionSheet:fail parameter error: itemList should not be large than 6") : _bridge2.default.invokeMethod("showActionSheet", options, {
	        beforeCancel: function beforeCancel(t) {
	          try {
	            "function" == typeof params.success && params.success({
	              errMsg: "showActionSheet:ok",
	              cancel: !0
	            });
	          } catch (e) {
	            Reporter.thirdErrorReport({
	              error: e,
	              extend: "showActionSheet success callback error"
	            });
	          }
	        }
	      });
	    }
	  },
	  getSavedFileList: function getSavedFileList() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    _bridge2.default.invokeMethod("getSavedFileList", params);
	  },
	  getSavedFileInfo: function getSavedFileInfo() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    paramCheck("getSavedFileInfo", params, { filePath: "" }) && _bridge2.default.invokeMethod("getSavedFileInfo", params);
	  },
	  removeSavedFile: function removeSavedFile() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    paramCheck("removeSavedFile", params, { filePath: "" }) && _bridge2.default.invokeMethod("removeSavedFile", params);
	  },
	  getExtConfig: function getExtConfig() {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	    setTimeout(function () {
	      var res = { errMsg: "getExtConfig: ok", extConfig: (0, apiObj.getExtConfigSync)() };
	      "function" == typeof params.success && params.success(res);
	      "function" == typeof params.complete && params.complete(res);
	    }, 0);
	  },
	  getExtConfigSync: function getExtConfigSync() {
	    if (!__wxConfig__.ext) return {};
	    try {
	      return JSON.parse((0, _stringify2.default)(__wxConfig__.ext));
	    } catch (e) {
	      return {};
	    }
	  },
	  chooseAddress: function chooseAddress(params) {
	    _bridge2.default.invokeMethod("openAddress", params, {
	      beforeSuccess: function beforeSuccess(res) {
	        _utils2.default.renameProperty(res, "addressPostalCode", "postalCode");
	        _utils2.default.renameProperty(res, "proviceFirstStageName", "provinceName");
	        _utils2.default.renameProperty(res, "addressCitySecondStageName", "cityName");
	        _utils2.default.renameProperty(res, "addressCountiesThirdStageName", "countyName");
	        _utils2.default.renameProperty(res, "addressDetailInfo", "detailInfo");
	      }, beforeAll: function beforeAll(res) {
	        res.errMsg = res.errMsg.replace("openAddress", "chooseAddress");
	        delete res.err_msg;
	      }
	    });
	  },
	  canIuse: function canIuse() {
	    var param1 = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
	        param2 = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : SDKVersion;
	    if ("string" != typeof param1) throw new _utils2.default.AppServiceSdkKnownError("canIUse: schema should be an object");
	    var params = param1.split(".");
	    return _utils2.default.canIUse(_utils2.default.toArray(params), param2);
	  }
	};

	apiObj.onAppEnterBackground(), apiObj.onAppEnterForeground(), apiObj.appStatus = _configFlags2.default.AppStatus.FORE_GROUND, apiObj.hanged = !1, _bridge2.default.subscribe("INVOKE_METHOD", function (params, t) {
	  var name = params.name,
	      args = params.args;
	  apiObj[name](args, !0);
	}), _bridge2.default.subscribe("WEBVIEW_ERROR_MSG", function (params, t) {
	  var msg = params.msg;
	  Reporter.triggerErrorMessage(msg);
	}), _bridge2.default.onMethod("onAppRoute", function (params) {
	  var webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	  params.path = params.path.substring(0, params.path.length - 5);
	  params.webviewId = params.webviewId ? params.webviewId : webviewId;
	  currUrl = params.path;
	  if ("appLaunch" !== params.openType) {
	    for (var n in params.query) {
	      params.query[n] = decodeURIComponent(params.query[n]);
	    }
	  }
	  if ("navigateBack" == params.openType || "redirectTo" == params.openType) {
	    _canvas2.default.clearOldWebviewCanvas();
	  }
	  _canvas2.default.notifyWebviewIdtoCanvas(params.webviewId);
	  _map2.default.notifyWebviewIdtoMap(params.webviewId);
	  curWebViewId = params.webviewId;
	  appRouteCallbacks.forEach(function (callback) {
	    callback(params);
	  });
	}), _bridge2.default.onMethod("onAppRouteDone", function (params) {
	  var webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	  params.path = params.path.substring(0, params.path.length - 5);
	  params.webviewId = "undefined" != typeof params.webviewId ? params.webviewId : webviewId;
	  currUrl = params.path;
	  appRouteDoneCallback.forEach(function (fn) {
	    fn(params);
	  });
	  _bridge2.default.publish("onAppRouteDone", {}, [webviewId]);
	}), _bridge2.default.onMethod("onKeyboardValueChange", function (params) {
	  var webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
	      pValue = params.value,
	      pCursor = params.cursor;
	  if (params.data && "function" == typeof pageEventFn) {
	    var data = JSON.parse(params.data);
	    if (data.bindinput) {
	      var peRes;
	      try {
	        peRes = pageEventFn({
	          data: {
	            type: "input",
	            target: data.target,
	            currentTarget: data.target,
	            timeStamp: Date.now(),
	            touches: [],
	            detail: {
	              value: params.value,
	              cursor: params.cursor
	            }
	          },
	          eventName: data.bindinput,
	          webviewId: webviewId
	        });
	      } catch (e) {
	        throw new _utils2.default.AppServiceSdkKnownError("bind key input error");
	      }
	      if (data.setKeyboardValue) if (void 0 === peRes || null === peRes || peRes === !1) ;else if ("Object" === _utils2.default.getDataType(peRes)) {
	        var opt = {
	          inputId: params.inputId
	        };
	        pValue != peRes.value && (opt.value = peRes.value + "");
	        isNaN(parseInt(peRes.cursor)) || (opt.cursor = parseInt(peRes.cursor), "undefined" == typeof opt.value && (opt.value = pValue), opt.cursor > opt.value.length && (opt.cursor = -1));
	        _bridge2.default.invokeMethod("setKeyboardValue", opt);
	      } else pValue != peRes && _bridge2.default.invokeMethod("setKeyboardValue", {
	        value: peRes + "",
	        cursor: -1,
	        inputId: params.inputId
	      });
	    }
	  }
	  _bridge2.default.publish("setKeyboardValue", {
	    value: pValue,
	    cursor: pCursor,
	    inputId: params.inputId
	  }, [webviewId]);
	});

	var getTouchInfo = function getTouchInfo(touchInfo, eventKey, eventInfo) {
	  //返回touch信息
	  var touches = [],
	      changedTouches = [];
	  if ("onTouchStart" === eventKey) {
	    for (var i in touchInfo) {
	      touches.push(touchInfo[i]);
	    }var touchObj = {
	      x: eventInfo.touch.x,
	      y: eventInfo.touch.y,
	      identifier: eventInfo.touch.id
	    };
	    changedTouches.push(touchObj);
	    touches.push(touchObj);
	  } else if ("onTouchMove" === eventKey) for (var s in touchInfo) {
	    var curTouchInfo = touchInfo[s],
	        hasUpdate = !1;
	    for (var f in eventInfo.touches) {
	      var touchObj = {
	        x: eventInfo.touches[f].x,
	        y: eventInfo.touches[f].y,
	        identifier: eventInfo.touches[f].id
	      };
	      if (touchObj.identifier === curTouchInfo.identifier && (curTouchInfo.x !== touchObj.x || curTouchInfo.y !== touchObj.y)) {
	        touches.push(touchObj);
	        changedTouches.push(touchObj);
	        hasUpdate = !0;
	        break;
	      }
	    }
	    hasUpdate || touches.push(curTouchInfo);
	  } else if ("onTouchEnd" === eventKey) {
	    var touchObj = {
	      x: eventInfo.touch.x,
	      y: eventInfo.touch.y,
	      identifier: eventInfo.touch.id
	    };
	    for (var p in touchInfo) {
	      var curTouchInfo = touchInfo[p];
	      curTouchInfo.identifier === touchObj.identifier ? changedTouches.push(touchObj) : touches.push(curTouchInfo);
	    }
	  } else if ("onTouchCancel" === eventKey) {
	    for (var v in eventInfo.touches) {
	      var touchObj = {
	        x: eventInfo.touches[v].x,
	        y: eventInfo.touches[v].y,
	        identifier: eventInfo.touches[v].id
	      };
	      changedTouches.push(touchObj);
	    }
	  } else if ("onLongPress" === eventKey) {
	    var touchObj = {
	      x: eventInfo.touch.x,
	      y: eventInfo.touch.y,
	      identifier: eventInfo.touch.id
	    };
	    for (var b in touchInfo) {
	      touchInfo[b].identifier === touchObj.identifier ? touches.push(touchObj) : touches.push(touchInfo[b]);
	    }
	    changedTouches.push(touchObj);
	  }
	  return {
	    touches: touches,
	    changedTouches: changedTouches
	  };
	},
	    touchEvents = {
	  onTouchStart: "touchstart",
	  onTouchMove: "touchmove",
	  onTouchEnd: "touchend",
	  onTouchCancel: "touchcancel",
	  onLongPress: "longtap"
	};

	["onTouchStart", "onTouchMove", "onTouchEnd", "onTouchCancel", "onLongPress"].forEach(function (eventName) {
	  _bridge2.default.onMethod(eventName, function (params) {
	    var webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
	        data = JSON.parse(params.data),
	        canvasNumber = data.canvasNumber;
	    _canvas2.default.canvasInfo.hasOwnProperty(canvasNumber) || console.error("No such canvas " + canvasNumber + " register in " + webviewId + ", but trigger " + eventName + " event.");
	    var canvasData = _canvas2.default.canvasInfo[canvasNumber].data;
	    if (canvasData[eventName] && "function" == typeof pageEventFn) {
	      var touchInfo = getTouchInfo(canvasData.lastTouches, eventName, params),
	          touches = touchInfo.touches,
	          changedTouches = touchInfo.changedTouches;
	      canvasData.lastTouches = touches, "onTouchMove" === eventName && 0 === changedTouches.length || pageEventFn({
	        data: {
	          type: touchEvents[eventName],
	          timeStamp: new Date() - canvasData.startTime,
	          target: canvasData.target,
	          touches: touches,
	          changedTouches: changedTouches
	        },
	        eventName: canvasData[eventName],
	        webviewId: webviewId
	      });
	    }
	  });
	}), ["onVideoPlay", "onVideoPause", "onVideoEnded", "onVideoTimeUpdate", "onVideoClickFullScreenBtn", "onVideoClickDanmuBtn"].forEach(function (eventName) {
	  _bridge2.default.onMethod(eventName, function () {
	    var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
	        webviewId = arguments[1],
	        bindEventName = "bind" + eventName.substring(7).toLowerCase(),
	        dataObj = JSON.parse(params.data),
	        handlers = dataObj.handlers,
	        event = dataObj.event,
	        createdTimestamp = dataObj.createdTimestamp;
	    if (handlers[bindEventName] && "function" == typeof pageEventFn) {
	      var data = {
	        type: bindEventName.substring(4),
	        target: event.target,
	        currentTarget: event.currentTarget,
	        timeStamp: Date.now() - createdTimestamp,
	        detail: {}
	      };
	      "bindtimeupdate" === bindEventName && (data.detail = { currentTime: params.position });
	      pageEventFn({
	        data: data,
	        eventName: handlers[bindEventName],
	        webviewId: webviewId
	      });
	    }
	  });
	}), _bridge2.default.onMethod("onAccelerometerChange", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	  arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	  accelerometerChangeFns.forEach(function (fn) {
	    "function" == typeof fn && fn(params);
	  });
	}), _bridge2.default.onMethod("onCompassChange", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	  arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	  compassChangeFns.forEach(function (fn) {
	    "function" == typeof fn && fn(params);
	  });
	}), _bridge2.default.onMethod("onError", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	  arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	  console.error("thirdScriptError", "\n", "sdk uncaught third Error", "\n", params.message, "\n", params.stack);
	}), _bridge2.default.onMethod("onMapMarkerClick", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
	      webViewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	  if (params.data && "function" == typeof pageEventFn) {
	    var data = JSON.parse(params.data);
	    data.bindmarkertap && pageEventFn({
	      data: {
	        markerId: data.markerId
	      },
	      eventName: data.bindmarkertap,
	      webviewId: webViewId
	    });
	  }
	}), _bridge2.default.onMethod("onMapControlClick", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
	      webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	  if (params.data && "function" == typeof pageEventFn) {
	    var data = JSON.parse(params.data);
	    data.bindcontroltap && pageEventFn({
	      data: {
	        controlId: data.controlId
	      },
	      eventName: data.bindcontroltap,
	      webviewId: webviewId
	    });
	  }
	}), _bridge2.default.onMethod("onMapRegionChange", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
	      webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
	      mapInfo = _map2.default.mapInfo[webviewId + "_" + params.mapId];
	  mapInfo && mapInfo.bindregionchange && "function" == typeof pageEventFn && pageEventFn({
	    data: {
	      type: params.type
	    },
	    eventName: mapInfo.bindregionchange,
	    webviewId: webviewId
	  });
	}), _bridge2.default.onMethod("onMapClick", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {},
	      webviewId = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
	      mapInfo = _map2.default.mapInfo[webviewId + "_" + params.mapId];
	  mapInfo && mapInfo.bindtap && "function" == typeof pageEventFn && pageEventFn({
	    data: {},
	    eventName: mapInfo.bindtap,
	    webviewId: webviewId
	  });
	});
	for (var key in apiObj) {
	  addGetterForWX(key);
	}module.exports = WX;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(3)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	module.exports = __webpack_require__(3).Object.keys;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(7)
	  , $keys    = __webpack_require__(9);

	__webpack_require__(24)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(8);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(10)
	  , enumBugKeys = __webpack_require__(23);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(11)
	  , toIObject    = __webpack_require__(12)
	  , arrayIndexOf = __webpack_require__(15)(false)
	  , IE_PROTO     = __webpack_require__(19)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(13)
	  , defined = __webpack_require__(8);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(14);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(12)
	  , toLength  = __webpack_require__(16)
	  , toIndex   = __webpack_require__(18);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(17)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(17)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(20)('keys')
	  , uid    = __webpack_require__(22);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(21)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(25)
	  , core    = __webpack_require__(3)
	  , fails   = __webpack_require__(34);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(21)
	  , core      = __webpack_require__(3)
	  , ctx       = __webpack_require__(26)
	  , hide      = __webpack_require__(28)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(27);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(29)
	  , createDesc = __webpack_require__(37);
	module.exports = __webpack_require__(33) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(30)
	  , IE8_DOM_DEFINE = __webpack_require__(32)
	  , toPrimitive    = __webpack_require__(36)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(33) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(31);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(33) && !__webpack_require__(34)(function(){
	  return Object.defineProperty(__webpack_require__(35)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(34)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(31)
	  , document = __webpack_require__(21).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(31);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 38 */,
/* 39 */,
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(41);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(61);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(42), __esModule: true };

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(43);
	__webpack_require__(56);
	module.exports = __webpack_require__(60).f('iterator');

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(44)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(45)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(17)
	  , defined   = __webpack_require__(8);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(46)
	  , $export        = __webpack_require__(25)
	  , redefine       = __webpack_require__(47)
	  , hide           = __webpack_require__(28)
	  , has            = __webpack_require__(11)
	  , Iterators      = __webpack_require__(48)
	  , $iterCreate    = __webpack_require__(49)
	  , setToStringTag = __webpack_require__(53)
	  , getPrototypeOf = __webpack_require__(55)
	  , ITERATOR       = __webpack_require__(54)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ }),
/* 46 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(28);

/***/ }),
/* 48 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(50)
	  , descriptor     = __webpack_require__(37)
	  , setToStringTag = __webpack_require__(53)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(28)(IteratorPrototype, __webpack_require__(54)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(30)
	  , dPs         = __webpack_require__(51)
	  , enumBugKeys = __webpack_require__(23)
	  , IE_PROTO    = __webpack_require__(19)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(35)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(52).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(29)
	  , anObject = __webpack_require__(30)
	  , getKeys  = __webpack_require__(9);

	module.exports = __webpack_require__(33) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(21).document && document.documentElement;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(29).f
	  , has = __webpack_require__(11)
	  , TAG = __webpack_require__(54)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(20)('wks')
	  , uid        = __webpack_require__(22)
	  , Symbol     = __webpack_require__(21).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(11)
	  , toObject    = __webpack_require__(7)
	  , IE_PROTO    = __webpack_require__(19)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(57);
	var global        = __webpack_require__(21)
	  , hide          = __webpack_require__(28)
	  , Iterators     = __webpack_require__(48)
	  , TO_STRING_TAG = __webpack_require__(54)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(58)
	  , step             = __webpack_require__(59)
	  , Iterators        = __webpack_require__(48)
	  , toIObject        = __webpack_require__(12);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(45)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ }),
/* 58 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 59 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(54);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(62), __esModule: true };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	__webpack_require__(74);
	__webpack_require__(75);
	__webpack_require__(76);
	module.exports = __webpack_require__(3).Symbol;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(21)
	  , has            = __webpack_require__(11)
	  , DESCRIPTORS    = __webpack_require__(33)
	  , $export        = __webpack_require__(25)
	  , redefine       = __webpack_require__(47)
	  , META           = __webpack_require__(64).KEY
	  , $fails         = __webpack_require__(34)
	  , shared         = __webpack_require__(20)
	  , setToStringTag = __webpack_require__(53)
	  , uid            = __webpack_require__(22)
	  , wks            = __webpack_require__(54)
	  , wksExt         = __webpack_require__(60)
	  , wksDefine      = __webpack_require__(65)
	  , keyOf          = __webpack_require__(66)
	  , enumKeys       = __webpack_require__(67)
	  , isArray        = __webpack_require__(70)
	  , anObject       = __webpack_require__(30)
	  , toIObject      = __webpack_require__(12)
	  , toPrimitive    = __webpack_require__(36)
	  , createDesc     = __webpack_require__(37)
	  , _create        = __webpack_require__(50)
	  , gOPNExt        = __webpack_require__(71)
	  , $GOPD          = __webpack_require__(73)
	  , $DP            = __webpack_require__(29)
	  , $keys          = __webpack_require__(9)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(72).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(69).f  = $propertyIsEnumerable;
	  __webpack_require__(68).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(46)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(28)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(22)('meta')
	  , isObject = __webpack_require__(31)
	  , has      = __webpack_require__(11)
	  , setDesc  = __webpack_require__(29).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(34)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(21)
	  , core           = __webpack_require__(3)
	  , LIBRARY        = __webpack_require__(46)
	  , wksExt         = __webpack_require__(60)
	  , defineProperty = __webpack_require__(29).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(9)
	  , toIObject = __webpack_require__(12);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(9)
	  , gOPS    = __webpack_require__(68)
	  , pIE     = __webpack_require__(69);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ }),
/* 68 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 69 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(14);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(12)
	  , gOPN      = __webpack_require__(72).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(10)
	  , hiddenKeys = __webpack_require__(23).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(69)
	  , createDesc     = __webpack_require__(37)
	  , toIObject      = __webpack_require__(12)
	  , toPrimitive    = __webpack_require__(36)
	  , has            = __webpack_require__(11)
	  , IE8_DOM_DEFINE = __webpack_require__(32)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(33) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 74 */
/***/ (function(module, exports) {

	

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(65)('asyncIterator');

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(65)('observable');

/***/ }),
/* 77 */,
/* 78 */,
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(80), __esModule: true };

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(81);
	module.exports = __webpack_require__(3).Object.assign;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(25);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(82)});

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(9)
	  , gOPS     = __webpack_require__(68)
	  , pIE      = __webpack_require__(69)
	  , toObject = __webpack_require__(7)
	  , IObject  = __webpack_require__(13)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(34)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(85);
	var $Object = __webpack_require__(3).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(25);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(33), 'Object', {defineProperty: __webpack_require__(29).f});

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(88);
	module.exports = __webpack_require__(3).Object.getPrototypeOf;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(7)
	  , $getPrototypeOf = __webpack_require__(55);

	__webpack_require__(24)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ }),
/* 89 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(92);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(96);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(93), __esModule: true };

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(94);
	module.exports = __webpack_require__(3).Object.setPrototypeOf;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(25);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(95).set});

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(31)
	  , anObject = __webpack_require__(30);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(26)(Function.call, __webpack_require__(73).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(97), __esModule: true };

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(98);
	var $Object = __webpack_require__(3).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(25)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(50)});

/***/ }),
/* 99 */,
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(83);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ }),
/* 101 */,
/* 102 */,
/* 103 */,
/* 104 */,
/* 105 */,
/* 106 */,
/* 107 */,
/* 108 */,
/* 109 */,
/* 110 */,
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _utils = __webpack_require__(112);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function invoke() {
	    //ServiceJSBridge.invoke
	    ServiceJSBridge.invoke.apply(ServiceJSBridge, arguments);
	}

	function on() {
	    //ServiceJSBridge.on
	    ServiceJSBridge.on.apply(ServiceJSBridge, arguments);
	}

	function publish() {
	    //ServiceJSBridge.publish
	    var args = Array.prototype.slice.call(arguments);
	    args[1] = {
	        data: args[1],
	        options: {
	            timestamp: Date.now()
	        }
	    };
	    ServiceJSBridge.publish.apply(ServiceJSBridge, args);
	}

	function subscribe() {
	    //ServiceJSBridge.subscribe
	    var args = Array.prototype.slice.call(arguments),
	        callback = args[1];
	    args[1] = function (params, viewId) {
	        var data = params.data,
	            options = params.options,
	            timeMark = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
	            timestamp = options && options.timestamp || 0,
	            curTime = Date.now();
	        "function" == typeof callback && callback(data, viewId);
	        Reporter.speedReport({
	            key: "webview2AppService",
	            data: data || {},
	            timeMark: {
	                startTime: timestamp,
	                endTime: curTime,
	                nativeTime: timeMark.nativeTime || 0
	            }
	        });
	    };
	    ServiceJSBridge.subscribe.apply(ServiceJSBridge, args);
	}

	function invokeMethod(apiName) {
	    var options = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : {},
	        innerFns = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : {},
	        params = {};
	    for (var i in options) {
	        "function" == typeof options[i] && (params[i] = Reporter.surroundThirdByTryCatch(options[i], "at api " + apiName + " " + i + " callback function"), delete options[i]);
	    }
	    var sysEventFns = {};
	    for (var s in innerFns) {
	        "function" == typeof innerFns[s] && (sysEventFns[s] = _utils2.default.surroundByTryCatchFactory(innerFns[s], "at api " + apiName + " " + s + " callback function"));
	    }
	    invoke(apiName, options, function (res) {
	        res.errMsg = res.errMsg || apiName + ":ok";
	        var isOk = 0 === res.errMsg.indexOf(apiName + ":ok"),
	            isCancel = 0 === res.errMsg.indexOf(apiName + ":cancel"),
	            isFail = 0 === res.errMsg.indexOf(apiName + ":fail");
	        if ("function" == typeof sysEventFns.beforeAll && sysEventFns.beforeAll(res), isOk) {
	            "function" == typeof sysEventFns.beforeSuccess && sysEventFns.beforeSuccess(res), "function" == typeof params.success && params.success(res), "function" == typeof sysEventFns.afterSuccess && sysEventFns.afterSuccess(res);
	        } else if (isCancel) {
	            res.errMsg = res.errMsg.replace(apiName + ":cancel", apiName + ":fail cancel"), "function" == typeof params.fail && params.fail(res), "function" == typeof sysEventFns.beforeCancel && sysEventFns.beforeCancel(res), "function" == typeof params.cancel && params.cancel(res), "function" == typeof sysEventFns.afterCancel && sysEventFns.afterCancel(res);
	        } else if (isFail) {
	            "function" == typeof sysEventFns.beforeFail && sysEventFns.beforeFail(res), "function" == typeof params.fail && params.fail(res);
	            var rt = !0;
	            "function" == typeof sysEventFns.afterFail && (rt = sysEventFns.afterFail(res)), rt !== !1 && Reporter.reportIDKey({
	                key: apiName + "_fail"
	            });
	        }
	        "function" == typeof params.complete && params.complete(res), "function" == typeof sysEventFns.afterAll && sysEventFns.afterAll(res);
	    });
	    Reporter.reportIDKey({
	        key: apiName
	    });
	}

	function onMethod(apiName, callback) {
	    //onMethod
	    on(apiName, _utils2.default.surroundByTryCatchFactory(callback, "at api " + apiName + " callback function"));
	}

	exports.default = {
	    invoke: invoke,
	    on: on,
	    publish: publish,
	    subscribe: subscribe,
	    invokeMethod: invokeMethod,
	    onMethod: onMethod
	};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _defineProperty = __webpack_require__(83);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	var _getPrototypeOf = __webpack_require__(86);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(90);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(91);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _from = __webpack_require__(113);

	var _from2 = _interopRequireDefault(_from);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function surroundByTryCatchFactory(func, funcName) {
	    //返回函数e
	    return function () {
	        try {
	            return func.apply(func, arguments);
	        } catch (e) {
	            if ("[object Error]" === Object.prototype.toString.apply(e)) {
	                if ("AppServiceSdkKnownError" == e.type) throw e;
	                Reporter.errorReport({
	                    key: "appServiceSDKScriptError",
	                    error: e,
	                    extend: funcName
	                });
	            }
	        }
	    };
	}

	function anyTypeToString(data) {
	    //把e转成string并返回一个对象
	    var dataType = Object.prototype.toString.call(data).split(" ")[1].split("]")[0];
	    if ("Array" == dataType || "Object" == dataType) {
	        try {
	            data = (0, _stringify2.default)(data);
	        } catch (e) {
	            e.type = "AppServiceSdkKnownError";
	            throw e;
	        }
	    } else {
	        data = "String" == dataType || "Number" == dataType || "Boolean" == dataType ? data.toString() : "Date" == dataType ? data.getTime().toString() : "Undefined" == dataType ? "undefined" : "Null" == dataType ? "null" : "";
	    }
	    return {
	        data: data,
	        dataType: dataType
	    };
	}

	function stringToAnyType(data, type) {
	    //把e解码回来，和前面a相对应

	    return data = "String" == type ? data : "Array" == type || "Object" == type ? JSON.parse(data) : "Number" == type ? parseFloat(data) : "Boolean" == type ? "true" == data : "Date" == type ? new Date(parseInt(data)) : "Undefined" == type ? void 0 : "Null" == type ? null : "";
	}

	function getDataType(data) {
	    //get data type
	    return Object.prototype.toString.call(data).split(" ")[1].split("]")[0];
	}

	function isObject(e) {
	    return "Object" === getDataType(e);
	}

	function paramCheck(params, paramTpl) {
	    //比较e\t
	    var result,
	        name = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "parameter",
	        tplTpye = getDataType(paramTpl),
	        pType = getDataType(params);
	    if (pType != tplTpye) return name + " should be " + tplTpye + " instead of " + pType + ";";
	    switch (result = "", tplTpye) {
	        case "Object":
	            for (var i in paramTpl) {
	                result += paramCheck(params[i], paramTpl[i], name + "." + i);
	            }break;
	        case "Array":
	            if (params.length < paramTpl.length) return name + " should have at least " + paramTpl.length + " item;";
	            for (var a = 0; a < paramTpl.length; ++a) {
	                result += paramCheck(params[a], paramTpl[a], name + "[" + a + "]");
	            }}
	    return result;
	}

	function getRealRoute(pathname, url) {
	    var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
	    if (n && (url = addHTMLSuffix(url)), 0 === url.indexOf("/")) return url.substr(1);
	    if (0 === url.indexOf("./")) return getRealRoute(pathname, url.substr(2), !1);
	    var index,
	        urlArrLength,
	        urlArr = url.split("/");
	    for (index = 0, urlArrLength = urlArr.length; index < urlArrLength && ".." === urlArr[index]; index++) {}
	    urlArr.splice(0, index);
	    var newUrl = urlArr.join("/"),
	        pathArr = pathname.length > 0 ? pathname.split("/") : [];
	    pathArr.splice(pathArr.length - index - 1, index + 1);
	    var newPathArr = pathArr.concat(urlArr);
	    return newPathArr.join("/");
	}

	function getPlatform() {
	    //return platform
	    return "devtools";
	}

	function urlEncodeFormData(data) {
	    //把对象生成queryString
	    var needEncode = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
	    if ("object" !== (typeof data === "undefined" ? "undefined" : (0, _typeof3.default)(data))) return data;
	    var tmpArr = [];
	    for (var o in data) {
	        if (data.hasOwnProperty(o)) {
	            if (needEncode) {
	                try {
	                    tmpArr.push(encodeURIComponent(o) + "=" + encodeURIComponent(data[o]));
	                } catch (t) {
	                    tmpArr.push(o + "=" + data[o]);
	                }
	            } else tmpArr.push(o + "=" + data[o]);
	        }
	    }return tmpArr.join("&");
	}

	function addQueryStringToUrl(originalUrl, newParams) {
	    //生成url t:param obj
	    if ("string" == typeof originalUrl && "object" === (typeof newParams === "undefined" ? "undefined" : (0, _typeof3.default)(newParams)) && (0, _keys2.default)(newParams).length > 0) {
	        var urlComponents = originalUrl.split("?"),
	            host = urlComponents[0],
	            oldParams = (urlComponents[1] || "").split("&").reduce(function (res, cur) {
	            if ("string" == typeof cur && cur.length > 0) {
	                var curArr = cur.split("="),
	                    key = curArr[0],
	                    value = curArr[1];
	                res[key] = value;
	            }
	            return res;
	        }, {}),
	            refinedNewParams = (0, _keys2.default)(newParams).reduce(function (res, cur) {
	            "object" === (0, _typeof3.default)(newParams[cur]) ? res[encodeURIComponent(cur)] = encodeURIComponent((0, _stringify2.default)(newParams[cur])) : res[encodeURIComponent(cur)] = encodeURIComponent(newParams[cur]);
	            return res;
	        }, {});
	        return host + "?" + urlEncodeFormData(assign(oldParams, refinedNewParams));
	    }
	    return originalUrl;
	}

	function validateUrl(url) {
	    return (/^(http|https):\/\/.*/i.test(url)
	    );
	}

	function assign() {
	    //endext 对象合并
	    for (var argLeng = arguments.length, args = Array(argLeng), n = 0; n < argLeng; n++) {
	        args[n] = arguments[n];
	    }
	    return args.reduce(function (res, cur) {
	        for (var n in cur) {
	            res[n] = cur[n];
	        }
	        return res;
	    }, {});
	}

	function encodeUrlQuery(url) {
	    //把url中的参数encode
	    if ("string" == typeof url) {
	        var urlArr = url.split("?"),
	            urlPath = urlArr[0],
	            queryParams = (urlArr[1] || "").split("&").reduce(function (res, cur) {
	            if ("string" == typeof cur && cur.length > 0) {
	                var curArr = cur.split("="),
	                    key = curArr[0],
	                    value = curArr[1];
	                res[key] = value;
	            }
	            return res;
	        }, {}),
	            urlQueryArr = [];
	        for (var i in queryParams) {
	            queryParams.hasOwnProperty(i) && urlQueryArr.push(i + "=" + encodeURIComponent(queryParams[i]));
	        }
	        return urlQueryArr.length > 0 ? urlPath + "?" + urlQueryArr.join("&") : url;
	    }
	    return url;
	}

	function addHTMLSuffix(url) {
	    //给url加上。html的扩展名
	    if ("string" != typeof url) throw new A("wd.redirectTo: invalid url:" + url);
	    var urlArr = url.split("?");
	    urlArr[0] += ".html";
	    return "undefined" != typeof urlArr[1] ? urlArr[0] + "?" + urlArr[1] : urlArr[0];
	}

	function extend(target, obj) {
	    //t合并到e对象
	    for (var n in obj) {
	        target[n] = obj[n];
	    }return target;
	}

	function arrayBufferToBase64(buffer) {
	    for (var res = "", arr = new Uint8Array(buffer), arrLeng = arr.byteLength, r = 0; r < arrLeng; r++) {
	        res += String.fromCharCode(arr[r]);
	    }
	    return btoa(res);
	}

	function base64ToArrayBuffer(str) {
	    for (var atobStr = atob(str), leng = atobStr.length, arr = new Uint8Array(leng), r = 0; r < leng; r++) {
	        arr[r] = atobStr.charCodeAt(r);
	    }return arr.buffer;
	}

	function blobToArrayBuffer(blobStr, callback) {
	    //readAsArrayBuffer t:callback
	    var fileReader = new FileReader();
	    fileReader.onload = function () {
	        callback(this.result);
	    };
	    fileReader.readAsArrayBuffer(blobStr);
	}

	function convertObjectValueToString(obj) {
	    //把对象元素都转成字符串
	    return (0, _keys2.default)(obj).reduce(function (res, cur) {
	        "string" == typeof obj[cur] ? res[cur] = obj[cur] : "number" == typeof obj[cur] ? res[cur] = obj[cur] + "" : res[cur] = Object.prototype.toString.apply(obj[cur]);
	        return res;
	    }, {});
	}
	function renameProperty(obj, oldName, newName) {
	    isObject(obj) !== !1 && oldName != newName && obj.hasOwnProperty(oldName) && (obj[newName] = obj[oldName], delete obj[oldName]);
	}

	function toArray(arg) {
	    // 把e转成array
	    if (Array.isArray(arg)) {
	        for (var t = 0, n = Array(arg.length); t < arg.length; t++) {
	            n[t] = arg[t];
	        }return n;
	    }
	    return (0, _from2.default)(arg);
	}

	var words = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
	    btoa = btoa || function (str) {
	    for (var curPosFlag, curCodeValue, text = String(str), res = "", i = 0, wordTpl = words; text.charAt(0 | i) || (wordTpl = "=", i % 1); res += wordTpl.charAt(63 & curPosFlag >> 8 - i % 1 * 8)) {
	        curCodeValue = text.charCodeAt(i += .75);
	        if (curCodeValue > 255) throw new Error('"btoa" failed');
	        curPosFlag = curPosFlag << 8 | curCodeValue;
	    }
	    return res;
	},
	    atob = atob || function (str) {
	    var text = String(str).replace(/=+$/, ""),
	        res = "";
	    if (text.length % 4 === 1) throw new Error('"atob" failed');
	    for (var curFlage, curValue, i = 0, a = 0; curValue = text.charAt(a++); ~curValue && (curFlage = i % 4 ? 64 * curFlage + curValue : curValue, i++ % 4) ? res += String.fromCharCode(255 & curFlage >> (-2 * i & 6)) : 0) {
	        curValue = words.indexOf(curValue);
	    }return res;
	};

	var AppServiceSdkKnownError = function (_Error) {
	    (0, _inherits3.default)(AppServiceSdkKnownError, _Error);

	    function AppServiceSdkKnownError(e) {
	        (0, _classCallCheck3.default)(this, AppServiceSdkKnownError);

	        var _this = (0, _possibleConstructorReturn3.default)(this, (AppServiceSdkKnownError.__proto__ || (0, _getPrototypeOf2.default)(AppServiceSdkKnownError)).call(this, "APP-SERVICE-SDK:" + e));

	        _this.type = "AppServiceSdkKnownError";
	        return _this;
	    }

	    return AppServiceSdkKnownError;
	}(Error);

	var Components = {
	    //components
	    audio: { "1.0.0": ["id", "src", "loop", "controls", "poster", "name", "author", "binderror", "bindplay", "bindpause", "bindtimeupdate", "bindended"] },
	    button: {
	        "1.0.0": [{ size: ["default", "mini"] }, { type: ["primary", "default", "warn"] }, "plain", "disabled", "loading", { "form-type": ["submit", "reset"] }, "hover-class", "hover-start-time", "hover-stay-time"],
	        "1.1.0": [{ "open-type": ["contact"] }],
	        "1.2.0": [{ "open-type": ["share"] }],
	        "1.4.0": ["session-from"],
	        "1.3.0": [{ "open-type": ["getUserInfo"] }]
	    },
	    canvas: { "1.0.0": ["canvas-id", "disable-scroll", "bindtouchstart", "bindtouchmove", "bindtouchend", "bindtouchcancel", "bindlongtap", "binderror"] },
	    "checkbox-group": { "1.0.0": ["bindchange"] },
	    checkbox: { "1.0.0": ["value", "disabled", "checked", "color"] },
	    "contact-button": { "1.0.0": ["size", { type: ["default-dark", "default-light"] }, "session-from"] },
	    "cover-view": { "1.4.0": [] },
	    "cover-image": { "1.4.0": ["src"] },
	    form: { "1.0.0": ["report-submit", "bindsubmit", "bindreset"], "1.2.0": ["bindautofill"] },
	    icon: { "1.0.0": [{ type: ["success", "success_no_circle", "info", "warn", "waiting", "cancel", "download", "search", "clear"] }, "size", "color"] },
	    image: { "1.0.0": ["src", { mode: ["scaleToFill", "aspectFit", "aspectFill", "widthFix", "top", "bottom", "center", "left", "right", "top left", "top right", "bottom left", "bottom right"] }, "binderror", "bindload"] },
	    input: {
	        "1.0.0": ["value", { type: ["text", "number", "idcard", "digit"] }, "password", "placeholder", "placeholder-style", "placeholder-class", "disabled", "maxlength", "cursor-spacing", "auto-focus", "focus", "bindinput", "bindfocus", "bindblur", "bindconfirm"],
	        "1.1.0": [{ "confirm-type": ["send", "search", "next", "go", "done"] }, "confirm-hold"],
	        "1.2.0": ["auto-fill"]
	    },
	    label: { "1.0.0": ["for"] },
	    map: {
	        "1.0.0": ["longitude", "latitude", "scale", { markers: ["id", "latitude", "longitude", "title", "iconPath", "rotate", "alpha", "width", "height"] }, "covers", { polyline: ["points", "color", "width", "dottedLine"] }, { circles: ["latitude", "longitude", "color", "fillColor", "radius", "strokeWidth"] }, { controls: ["id", "position", "iconPath", "clickable"] }, "include-points", "show-location", "bindmarkertap", "bindcontroltap", "bindregionchange", "bindtap"],
	        "1.2.0": [{ markers: ["callout", "label", "anchor"] }, { polyline: ["arrowLine", "borderColor", "borderWidth"] }, "bindcallouttap"]
	    },
	    modal: { "1.0.0": [] },
	    "movable-area": { "1.2.0": [] },
	    "movable-view": { "1.2.0": ["direction", "inertia", "out-of-bounds", "x", "y", "damping", "friction"] },
	    navigator: {
	        "1.0.0": ["url", { "open-type": ["navigate", "redirect", "switchTab"] }, "delta", "hover-class", "hover-start-time", "hover-stay-time"],
	        "1.1.0": [{ "open-type": ["reLaunch", "navigateBack"] }]
	    },
	    "open-data": { "1.4.0": [{ type: ["groupName"] }, "open-gid"] },
	    "picker-view": { "1.0.0": ["value", "indicator-style", "bindchange"], "1.1.0": ["indicator-class"] },
	    "picker-view-column": { "1.0.0": [] },
	    picker: {
	        "1.0.0": ["range", "range-key", "value", "bindchange", "disabled", "start", "end", { fields: ["year", "month", "day"] }, { mode: ["selector", "date", "time"] }],
	        "1.2.0": ["auto-fill"],
	        "1.4.0": ["bindcolumnchange", { mode: ["multiSelector", "region"] }]
	    },
	    progress: { "1.0.0": ["percent", "show-info", "stroke-width", "color", "activeColor", "backgroundColor", "active"] },
	    "radio-group": { "1.0.0": ["bindchange"] },
	    radio: { "1.0.0": ["value", "checked", "disabled", "color"] },
	    "rich-text": { "1.4.0": [{ nodes: ["name", "attrs", "children"] }] },
	    "scroll-view": { "1.0.0": ["scroll-x", "scroll-y", "upper-threshold", "lower-threshold", "scroll-top", "scroll-left", "scroll-into-view", "scroll-with-animation", "enable-back-to-top", "bindscrolltoupper", "bindscrolltolower", "bindscroll"] },
	    slider: { "1.0.0": ["min", "max", "step", "disabled", "value", "color", "selected-color", "activeColor", "backgroundColor", "show-value", "bindchange"] },
	    swiper: {
	        "1.0.0": ["indicator-dots", "autoplay", "current", "interval", "duration", "circular", "vertical", "bindchange"],
	        "1.1.0": ["indicator-color", "indicator-active-color"]
	    },
	    "swiper-item": { "1.0.0": [] },
	    "switch": { "1.0.0": ["checked", { type: ["switch", "checkbox"] }, "bindchange", "color"] },
	    text: { "1.0.0": [], "1.1.0": ["selectable"], "1.4.0": [{ space: ["ensp", "emsp", "nbsp"] }, "decode"] },
	    textarea: {
	        "1.0.0": ["value", "placeholder", "placeholder-style", "placeholder-class", "disabled", "maxlength", "auto-focus", "focus", "auto-height", "fixed", "cursor-spacing", "bindfocus", "bindblur", "bindlinechange", "bindinput", "bindconfirm"],
	        "1.2.0": ["auto-fill"]
	    },
	    video: {
	        "1.0.0": ["src", "controls", "danmu-list", "danmu-btn", "enable-danmu", "autoplay", "bindplay", "bindpause", "bindended", "bindtimeupdate", "objectFit", "poster"],
	        "1.1.0": ["duration"],
	        "1.4.0": ["loop", "muted", "bindfullscreenchange"]
	    },
	    view: { "1.0.0": ["hover-class", "hover-start-time", "hover-stay-time"] }
	};
	var APIs = {
	    //APIS
	    onAccelerometerChange: { "1.0.0": [{ callback: ["x", "y", "z"] }] },
	    startAccelerometer: { "1.1.0": [] },
	    stopAccelerometer: { "1.1.0": [] },
	    chooseAddress: { "1.1.0": [{ success: ["userName", "postalCode", "provinceName", "cityName", "countyName", "detailInfo", "nationalCode", "telNumber"] }] },
	    createAnimation: { "1.0.0": [{ object: ["duration", { timingFunction: ["linear", "ease", "ease-in", "ease-in-out", "ease-out", "step-start", "step-end"] }, "delay", "transformOrigin"] }] },
	    createAudioContext: { "1.0.0": [] },
	    canIUse: { "1.0.0": [] },
	    login: { "1.0.0": [{ success: ["code"] }] },
	    checkSession: { "1.0.0": [] },
	    createMapContext: { "1.0.0": [] },
	    requestPayment: { "1.0.0": [{ object: ["timeStamp", "nonceStr", "package", "signType", "paySign"] }] },
	    showToast: { "1.0.0": [{ object: ["title", "icon", "duration", "mask"] }], "1.1.0": [{ object: ["image"] }] },
	    showLoading: { "1.1.0": [{ object: ["title", "mask"] }] },
	    hideToast: { "1.0.0": [] },
	    hideLoading: { "1.1.0": [] },
	    showModal: {
	        "1.0.0": [{ object: ["title", "content", "showCancel", "cancelText", "cancelColor", "confirmText", "confirmColor"] }, { success: ["confirm"] }],
	        "1.1.0": [{ success: ["cancel"] }]
	    },
	    showActionSheet: { "1.0.0": [{ object: ["itemList", "itemColor"] }, { success: ["tapIndex"] }] },
	    arrayBufferToBase64: { "1.1.0": [] },
	    base64ToArrayBuffer: { "1.1.0": [] },
	    createVideoContext: { "1.0.0": [] },
	    authorize: { "1.2.0": [{ object: ["scope"] }] },
	    openBluetoothAdapter: { "1.1.0": [] },
	    closeBluetoothAdapter: { "1.1.0": [] },
	    getBluetoothAdapterState: { "1.1.0": [{ success: ["discovering", "available"] }] },
	    onBluetoothAdapterStateChange: { "1.1.0": [{ callback: ["available", "discovering"] }] },
	    startBluetoothDevicesDiscovery: { "1.1.0": [{ object: ["services", "allowDuplicatesKey", "interval"] }, { success: ["isDiscovering"] }] },
	    stopBluetoothDevicesDiscovery: { "1.1.0": [] },
	    getBluetoothDevices: { "1.1.0": [{ success: ["devices"] }] },
	    onBluetoothDeviceFound: { "1.1.0": [{ callback: ["devices"] }] },
	    getConnectedBluetoothDevices: { "1.1.0": [{ object: ["services"] }, { success: ["devices"] }] },
	    createBLEConnection: { "1.1.0": [{ object: ["deviceId"] }] },
	    closeBLEConnection: { "1.1.0": [{ object: ["deviceId"] }] },
	    getBLEDeviceServices: { "1.1.0": [{ object: ["deviceId"] }, { success: ["services"] }] },
	    getBLEDeviceCharacteristics: { "1.1.0": [{ object: ["deviceId", "serviceId"] }, { success: ["characteristics"] }] },
	    readBLECharacteristicValue: { "1.1.0": [{ object: ["deviceId", "serviceId", "characteristicId"] }, { success: ["characteristic"] }] },
	    writeBLECharacteristicValue: { "1.1.0": [{ object: ["deviceId", "serviceId", "characteristicId", "value"] }] },
	    notifyBLECharacteristicValueChange: { "1.1.1": [{ object: ["deviceId", "serviceId", "characteristicId", "state"] }] },
	    onBLEConnectionStateChange: { "1.1.1": [{ callback: ["deviceId", "connected"] }] },
	    onBLECharacteristicValueChange: { "1.1.0": [{ callback: ["deviceId", "serviceId", "characteristicId", "value"] }] },
	    captureScreen: { "1.4.0": [{ success: ["tempFilePath"] }] },
	    addCard: { "1.1.0": [{ object: ["cardList"] }, { success: ["cardList"] }] },
	    openCard: { "1.1.0": [{ object: ["cardList"] }] },
	    setClipboardData: { "1.1.0": [{ object: ["data"] }] },
	    getClipboardData: { "1.1.0": [{ success: ["data"] }] },
	    onCompassChange: { "1.0.0": [{ callback: ["direction"] }] },
	    startCompass: { "1.1.0": [] },
	    stopCompass: { "1.1.0": [] },
	    setStorage: { "1.0.0": [{ object: ["key", "data"] }] },
	    getStorage: { "1.0.0": [{ object: ["key"] }, { success: ["data"] }] },
	    getStorageSync: { "1.0.0": [] },
	    getStorageInfo: { "1.0.0": [{ success: ["keys", "currentSize", "limitSize"] }] },
	    removeStorage: { "1.0.0": [{ object: ["key"] }] },
	    removeStorageSync: { "1.0.0": [] },
	    clearStorage: { "1.0.0": [] },
	    clearStorageSync: { "1.0.0": [] },
	    getNetworkType: { "1.0.0": [{ success: ["networkType"] }] },
	    onNetworkStatusChange: { "1.1.0": [{ callback: ["isConnected", { networkType: ["wifi", "2g", "3g", "4g", "none", "unknown"] }] }] },
	    setScreenBrightness: { "1.2.0": [{ object: ["value"] }] },
	    getScreenBrightness: { "1.2.0": [{ success: ["value"] }] },
	    vibrateLong: { "1.2.0": [] },
	    vibrateShort: { "1.2.0": [] },
	    getExtConfig: { "1.1.0": [{ success: ["extConfig"] }] },
	    getExtConfigSync: { "1.1.0": [] },
	    saveFile: { "1.0.0": [{ object: ["tempFilePath"] }, { success: ["savedFilePath"] }] },
	    getSavedFileList: { "1.0.0": [{ success: ["fileList"] }] },
	    getSavedFileInfo: { "1.0.0": [{ object: ["filePath"] }, { success: ["size", "createTime"] }] },
	    removeSavedFile: { "1.0.0": [{ object: ["filePath"] }] },
	    openDocument: { "1.0.0": [{ object: ["filePath"] }], "1.4.0": [{ object: ["fileType"] }] },
	    getBackgroundAudioManager: { "1.2.0": [] },
	    getFileInfo: { "1.4.0": [{ object: ["filePath", { digestAlgorithm: ["md5", "sha1"] }] }, { success: ["size", "digest"] }] },
	    startBeaconDiscovery: { "1.2.0": [{ object: ["uuids"] }] },
	    stopBeaconDiscovery: { "1.2.0": [] },
	    getBeacons: { "1.2.0": [{ success: ["beacons"] }] },
	    onBeaconUpdate: { "1.2.0": [{ callback: ["beacons"] }] },
	    onBeaconServiceChange: { "1.2.0": [{ callback: ["available", "discovering"] }] },
	    getLocation: {
	        "1.0.0": [{ object: ["type"] }, { success: ["latitude", "longitude", "speed", "accuracy"] }],
	        "1.2.0": [{ success: ["altitude", "verticalAccuracy", "horizontalAccuracy"] }]
	    },
	    chooseLocation: { "1.0.0": [{ object: ["cancel"] }, { success: ["name", "address", "latitude", "longitude"] }] },
	    openLocation: { "1.0.0": [{ object: ["latitude", "longitude", "scale", "name", "address"] }] },
	    getBackgroundAudioPlayerState: { "1.0.0": [{ success: ["duration", "currentPosition", "status", "downloadPercent", "dataUrl"] }] },
	    playBackgroundAudio: { "1.0.0": [{ object: ["dataUrl", "title", "coverImgUrl"] }] },
	    pauseBackgroundAudio: { "1.0.0": [] },
	    seekBackgroundAudio: { "1.0.0": [{ object: ["position"] }] },
	    stopBackgroundAudio: { "1.0.0": [] },
	    onBackgroundAudioPlay: { "1.0.0": [] },
	    onBackgroundAudioPause: { "1.0.0": [] },
	    onBackgroundAudioStop: { "1.0.0": [] },
	    chooseImage: {
	        "1.0.0": [{ object: ["count", "sizeType", "sourceType"] }, { success: ["tempFilePaths"] }],
	        "1.2.0": [{ success: ["tempFiles"] }]
	    },
	    previewImage: { "1.0.0": [{ object: ["current", "urls"] }] },
	    getImageInfo: { "1.0.0": [{ object: ["src"] }, { success: ["width", "height", "path"] }] },
	    saveImageToPhotosAlbum: { "1.2.0": [{ object: ["filePath"] }] },
	    startRecord: { "1.0.0": [{ success: ["tempFilePath"] }] },
	    stopRecord: { "1.0.0": [] },
	    chooseVideo: { "1.0.0": [{ object: ["sourceType", "maxDuration", "camera"] }, { success: ["tempFilePath", "duration", "size", "height", "width"] }] },
	    saveVideoToPhotosAlbum: { "1.2.0": [{ object: ["filePath"] }] },
	    playVoice: { "1.0.0": [{ object: ["filePath"] }] },
	    pauseVoice: { "1.0.0": [] },
	    stopVoice: { "1.0.0": [] },
	    navigateBackMiniProgram: { "1.3.0": [{ object: ["extraData"] }] },
	    navigateToMiniProgram: { "1.3.0": [{ object: ["appId", "path", "extraData", "envVersion"] }] },
	    uploadFile: { "1.0.0": [{ object: ["url", "filePath", "name", "header", "formData"] }, { success: ["data", "statusCode"] }] },
	    downloadFile: { "1.0.0": [{ object: ["url", "header"] }] },
	    request: {
	        "1.0.0": [{ object: ["url", "data", "header", { method: ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"] }, "dataType"] }, { success: ["data", "statusCode"] }],
	        "1.2.0": [{ success: ["header"] }]
	    },
	    connectSocket: {
	        "1.0.0": [{ object: ["url", "data", "header", { method: ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"] }] }],
	        "1.4.0": [{ object: ["protocols"] }]
	    },
	    onSocketOpen: { "1.0.0": [] },
	    onSocketError: { "1.0.0": [] },
	    sendSocketMessage: { "1.0.0": [{ object: ["data"] }] },
	    onSocketMessage: { "1.0.0": [{ callback: ["data"] }] },
	    closeSocket: { "1.0.0": [], "1.4.0": [{ object: ["code", "reason"] }] },
	    onSocketClose: { "1.0.0": [] },
	    onUserCaptureScreen: { "1.4.0": [] },
	    chooseContact: { "1.0.0": [{ success: ["phoneNumber", "displayName"] }] },
	    getUserInfo: {
	        "1.0.0": [{ success: ["userInfo", "rawData", "signature", "encryptedData", "iv"] }],
	        "1.1.0": [{ object: ["withCredentials"] }],
	        "1.4.0": [{ object: ["lang"] }]
	    },
	    addPhoneContact: { "1.2.0": [{ object: ["photoFilePath", "nickName", "lastName", "middleName", "firstName", "remark", "mobilePhoneNumber", "weChatNumber", "addressCountry", "addressState", "addressCity", "addressStreet", "addressPostalCode", "organization", "title", "workFaxNumber", "workPhoneNumber", "hostNumber", "email", "url", "workAddressCountry", "workAddressState", "workAddressCity", "workAddressStreet", "workAddressPostalCode", "homeFaxNumber", "homePhoneNumber", "homeAddressCountry", "homeAddressState", "homeAddressCity", "homeAddressStreet", "homeAddressPostalCode"] }] },
	    makePhoneCall: { "1.0.0": [{ object: ["phoneNumber"] }] },
	    stopPullDownRefresh: { "1.0.0": [] },
	    scanCode: {
	        "1.0.0": [{ success: ["result", "scanType", "charSet", "path"] }],
	        "1.2.0": [{ object: ["onlyFromCamera"] }]
	    },
	    pageScrollTo: { "1.4.0": [{ object: ["scrollTop"] }] },
	    setEnableDebug: { "1.4.0": [{ object: ["enableDebug"] }] },
	    setKeepScreenOn: { "1.4.0": [{ object: ["keepScreenOn"] }] },
	    setNavigationBarColor: { "1.4.0": [{ object: ["frontColor", "backgroundColor", "animation", "animation.duration", { "animation.timingFunc": ["linear", "easeIn", "easeOut", "easeInOut"] }] }] },
	    openSetting: { "1.1.0": [{ success: ["authSetting"] }] },
	    getSetting: { "1.2.0": [{ success: ["authSetting"] }] },
	    showShareMenu: { "1.1.0": [{ object: ["withShareTicket"] }] },
	    hideShareMenu: { "1.1.0": [] },
	    updateShareMenu: { "1.2.0": [{ object: ["withShareTicket"] }], "1.4.0": [{ object: ["dynamic", "widget"] }] },
	    getShareInfo: { "1.1.0": [{ object: ["shareTicket"] }, { callback: ["encryptedData", "iv"] }] },
	    getSystemInfo: {
	        "1.0.0": [{ success: ["model", "pixelRatio", "windowWidth", "windowHeight", "language", "version", "system", "platform"] }],
	        "1.1.0": [{ success: ["screenWidth", "screenHeight", "SDKVersion"] }]
	    },
	    getSystemInfoSync: {
	        "1.0.0": [{ return: ["model", "pixelRatio", "windowWidth", "windowHeight", "language", "version", "system", "platform"] }],
	        "1.1.0": [{ return: ["screenWidth", "screenHeight", "SDKVersion"] }]
	    },
	    navigateTo: { "1.0.0": [{ object: ["url"] }] },
	    redirectTo: { "1.0.0": [{ object: ["url"] }] },
	    reLaunch: { "1.1.0": [{ object: ["url"] }] },
	    switchTab: { "1.0.0": [{ object: ["url"] }] },
	    navigateBack: { "1.0.0": [{ object: ["delta"] }] },
	    setNavigationBarTitle: { "1.0.0": [{ object: ["title"] }] },
	    showNavigationBarLoading: { "1.0.0": [] },
	    hideNavigationBarLoading: { "1.0.0": [] },
	    setTopBarText: { "1.4.2": [{ object: ["text"] }] },
	    getWeRunData: { "1.2.0": [{ success: ["encryptedData", "iv"] }] },
	    createSelectorQuery: { "1.4.0": [] },
	    createCanvasContext: { "1.0.0": [] },
	    canvasToTempFilePath: {
	        "1.0.0": [{ object: ["canvasId"] }],
	        "1.2.0": [{ object: ["x", "y", "width", "height", "destWidth", "destHeight"] }]
	    },
	    canvasContext: {
	        "1.0.0": ["addColorStop", "arc", "beginPath", "bezierCurveTo", "clearActions", "clearRect", "closePath", "createCircularGradient", "createLinearGradient", "drawImage", "draw", "fillRect", "fillText", "fill", "lineTo", "moveTo", "quadraticCurveTo", "rect", "rotate", "save", "scale", "setFillStyle", "setFontSize", "setGlobalAlpha", "setLineCap", "setLineJoin", "setLineWidth", "setMiterLimit", "setShadow", "setStrokeStyle", "strokeRect", "stroke", "translate"],
	        "1.1.0": ["setTextAlign"],
	        "1.4.0": ["setTextBaseline"]
	    },
	    animation: { "1.0.0": ["opacity", "backgroundColor", "width", "height", "top", "left", "bottom", "right", "rotate", "rotateX", "rotateY", "rotateZ", "rotate3d", "scale", "scaleX", "scaleY", "scaleZ", "scale3d", "translate", "translateX", "translateY", "translateZ", "translate3d", "skew", "skewX", "skewY", "matrix", "matrix3d"] },
	    audioContext: { "1.0.0": ["setSrc", "play", "pause", "seek"] },
	    mapContext: {
	        "1.0.0": ["getCenterLocation", "moveToLocation"],
	        "1.2.0": ["translateMarker", "includePoints"],
	        "1.4.0": ["getRegion", "getScale"]
	    },
	    videoContext: {
	        "1.0.0": ["play", "pause", "seek", "sendDanmu"],
	        "1.4.0": ["playbackRate", "requestFullScreen", "exitFullScreen"]
	    },
	    backgroundAudioManager: { "1.2.0": ["play", "pause", "stop", "seek", "onCanplay", "onPlay", "onPause", "onStop", "onEnded", "onTimeUpdate", "onPrev", "onNext", "onError", "onWaiting", "duration", "currentTime", "paused", "src", "startTime", "buffered", "title", "epname", "singer", "coverImgUrl", "webUrl"] },
	    uploadTask: { "1.4.0": ["onProgressUpdate", "abort"] },
	    downloadTask: { "1.4.0": ["onProgressUpdate", "abort"] },
	    requestTask: { "1.4.0": ["abort"] },
	    selectorQuery: { "1.4.0": ["select", "selectAll", "selectViewport", "exec"] },
	    onBLEConnectionStateChanged: { "1.1.0": [{ callback: ["deviceId", "connected"] }] },
	    notifyBLECharacteristicValueChanged: { "1.1.0": [{ object: ["deviceId", "serviceId", "characteristicId", "state"] }] },
	    sendBizRedPacket: { "1.2.0": [{ object: ["timeStamp", "nonceStr", "package", "signType", "paySign"] }] }
	};
	//检测组件相关是否存在
	function isComponentExist(params) {
	    var name = params[0],
	        //组件名
	    attribute = params[1],
	        //属性名
	    option = params[2],
	        //组件属性可选值
	    component = Components[name];
	    if (!attribute) {
	        return true;
	    } else {
	        for (var key in component) {
	            for (var i = 0; i < component[key].length; i++) {
	                if ("string" == typeof component[key][i] && component[key][i] == attribute) {
	                    return true;
	                } else if (component[key][i][attribute]) {
	                    if (!option) {
	                        return true;
	                    } else if (component[key][i][attribute].indexOf(option) > -1) {
	                        return true;
	                    }
	                }
	            }
	        }
	        return false;
	    }
	}

	//检测API相关是否存在
	function isAPIExist(params) {
	    var name = params[0],
	        //API名
	    method = params[1],
	        //调用方式：有效值为return, success, object, callback
	    param = params[2],
	        //组件属性可选值
	    options = params[3],
	        methods = ["return", "success", "object", "callback"],
	        api = APIs[name];
	    if (!method) {
	        return true;
	    } else if (methods.indexOf(method) < 0) {
	        return false;
	    } else {
	        for (var key in api) {
	            for (var i = 0; i < key.length; i++) {
	                if ("object" == (0, _typeof3.default)(api[key][i]) && api[key][i][method]) {
	                    if (!param) {
	                        return true;
	                    } else {
	                        for (var j = 0; j < api[key][i][method].length; j++) {
	                            if (typeof api[key][i][method][j] == "string" && api[key][i][method][j] == param) {
	                                return true;
	                            } else if ((0, _typeof3.default)(api[key][i][method][j]) == "object" && api[key][i][method][j][param]) {
	                                if (!options) {
	                                    return true;
	                                } else if (api[key][i][method][j][param].indexOf(options) > -1) {
	                                    return true;
	                                }
	                            }
	                        }
	                    }
	                }
	            }
	        }
	        return false;
	    }
	}
	function canIUse(params, version) {
	    var name = params[0]; //API或组件名
	    if (Components[name]) {
	        return isComponentExist(params);
	    } else if (APIs[name]) {
	        return isAPIExist(params);
	    } else {
	        return false;
	    }
	}

	function checkParam(e, t) {
	    if (!(e instanceof t)) throw new TypeError("Cannot call a class as a function");
	}

	var config = function () {
	    function e(e, t) {
	        for (var n = 0; n < t.length; n++) {
	            var obj = t[n];
	            obj.enumerable = obj.enumerable || !1, obj.configurable = !0, "value" in obj && (obj.writable = !0), (0, _defineProperty2.default)(e, obj.key, obj);
	        }
	    }
	    return function (t, n, obj) {
	        return n && e(t.prototype, n), obj && e(t, obj), t;
	    };
	}();
	var setSelect = function () {
	    function e(t, n, r) {
	        checkParam(this, e), this._selectorQuery = t, this._selector = n, this._single = r;
	    }
	    return config(e, [{
	        key: "fields",
	        value: function value(e, t) {
	            return this._selectorQuery._push(this._selector, this._single, e, t), this._selectorQuery;
	        }
	    }, {
	        key: "boundingClientRect",
	        value: function value(e) {
	            return this._selectorQuery._push(this._selector, this._single, {
	                id: !0,
	                dataset: !0,
	                rect: !0,
	                size: !0
	            }, e), this._selectorQuery;
	        }
	    }, {
	        key: "scrollOffset",
	        value: function value(e) {
	            return this._selectorQuery._push(this._selector, this._single, {
	                id: !0,
	                dataset: !0,
	                scrollOffset: !0
	            }, e), this._selectorQuery;
	        }
	    }]), e;
	}();
	var wxQuerySelector = function () {
	    function init(t) {
	        checkParam(this, init);
	        this._webviewId = t;
	        this._queue = [];
	        this._queueCb = [];
	    }
	    return config(init, [{
	        key: "select", value: function value(e) {
	            return new setSelect(this, e, !0);
	        }
	    }, {
	        key: "selectAll", value: function value(e) {
	            return new setSelect(this, e, !1);
	        }
	    }, {
	        key: "selectViewport", value: function value() {
	            return new setSelect(this, "viewport", !0);
	        }
	    }, {
	        key: "_push", value: function value(e, t, n, o) {
	            this._queue.push({ selector: e, single: t, fields: n }), this._queueCb.push(o || null);
	        }
	    }, {
	        key: "exec", value: function value(e) {
	            var t = this;
	            u(this._webviewId, this._queue, function (n) {
	                var o = t._queueCb;
	                n.forEach(function (e, n) {
	                    "function" == typeof o[n] && o[n].call(t, e);
	                }), "function" == typeof e && e.call(t, n);
	            });
	        }
	    }]), init;
	}();

	exports.default = {
	    surroundByTryCatchFactory: surroundByTryCatchFactory,
	    getDataType: getDataType,
	    isObject: isObject,
	    paramCheck: paramCheck,
	    getRealRoute: getRealRoute,
	    getPlatform: getPlatform,
	    urlEncodeFormData: urlEncodeFormData,
	    addQueryStringToUrl: addQueryStringToUrl,
	    validateUrl: validateUrl,
	    assign: assign,
	    encodeUrlQuery: encodeUrlQuery,
	    extend: extend,
	    arrayBufferToBase64: arrayBufferToBase64,
	    base64ToArrayBuffer: base64ToArrayBuffer,
	    blobToArrayBuffer: blobToArrayBuffer,
	    convertObjectValueToString: convertObjectValueToString,
	    anyTypeToString: surroundByTryCatchFactory(anyTypeToString, "anyTypeToString"),
	    stringToAnyType: surroundByTryCatchFactory(stringToAnyType, "stringToAnyType"),
	    AppServiceSdkKnownError: AppServiceSdkKnownError,
	    renameProperty: renameProperty,
	    defaultRunningStatus: "active",
	    toArray: toArray,
	    canIUse: canIUse,
	    wxQuerySelector: wxQuerySelector
	};

/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(114), __esModule: true };

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(43);
	__webpack_require__(115);
	module.exports = __webpack_require__(3).Array.from;

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(26)
	  , $export        = __webpack_require__(25)
	  , toObject       = __webpack_require__(7)
	  , call           = __webpack_require__(116)
	  , isArrayIter    = __webpack_require__(117)
	  , toLength       = __webpack_require__(16)
	  , createProperty = __webpack_require__(118)
	  , getIterFn      = __webpack_require__(119);

	$export($export.S + $export.F * !__webpack_require__(121)(function(iter){ Array.from(iter); }), 'Array', {
	  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
	  from: function from(arrayLike/*, mapfn = undefined, thisArg = undefined*/){
	    var O       = toObject(arrayLike)
	      , C       = typeof this == 'function' ? this : Array
	      , aLen    = arguments.length
	      , mapfn   = aLen > 1 ? arguments[1] : undefined
	      , mapping = mapfn !== undefined
	      , index   = 0
	      , iterFn  = getIterFn(O)
	      , length, result, step, iterator;
	    if(mapping)mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
	    // if object isn't iterable or it's array with default iterator - use simple case
	    if(iterFn != undefined && !(C == Array && isArrayIter(iterFn))){
	      for(iterator = iterFn.call(O), result = new C; !(step = iterator.next()).done; index++){
	        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
	      }
	    } else {
	      length = toLength(O.length);
	      for(result = new C(length); length > index; index++){
	        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
	      }
	    }
	    result.length = index;
	    return result;
	  }
	});


/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(30);
	module.exports = function(iterator, fn, value, entries){
	  try {
	    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
	  // 7.4.6 IteratorClose(iterator, completion)
	  } catch(e){
	    var ret = iterator['return'];
	    if(ret !== undefined)anObject(ret.call(iterator));
	    throw e;
	  }
	};

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(48)
	  , ITERATOR   = __webpack_require__(54)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(29)
	  , createDesc      = __webpack_require__(37);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(120)
	  , ITERATOR  = __webpack_require__(54)('iterator')
	  , Iterators = __webpack_require__(48);
	module.exports = __webpack_require__(3).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(14)
	  , TAG = __webpack_require__(54)('toStringTag')
	  // ES3 wrong here
	  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

	// fallback for IE11 Script Access Denied error
	var tryGet = function(it, key){
	  try {
	    return it[key];
	  } catch(e){ /* empty */ }
	};

	module.exports = function(it){
	  var O, T, B;
	  return it === undefined ? 'Undefined' : it === null ? 'Null'
	    // @@toStringTag case
	    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
	    // builtinTag case
	    : ARG ? cof(O)
	    // ES3 arguments fallback
	    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
	};

/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(54)('iterator')
	  , SAFE_CLOSING = false;

	try {
	  var riter = [7][ITERATOR]();
	  riter['return'] = function(){ SAFE_CLOSING = true; };
	  Array.from(riter, function(){ throw 2; });
	} catch(e){ /* empty */ }

	module.exports = function(exec, skipClosing){
	  if(!skipClosing && !SAFE_CLOSING)return false;
	  var safe = false;
	  try {
	    var arr  = [7]
	      , iter = arr[ITERATOR]();
	    iter.next = function(){ return {done: safe = true}; };
	    arr[ITERATOR] = function(){ return iter; };
	    exec(arr);
	  } catch(e){ /* empty */ }
	  return safe;
	};

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(100);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _utils = __webpack_require__(112);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Animation = function () {
	    function Animation() {
	        (0, _classCallCheck3.default)(this, Animation);

	        var option = arguments.length <= 0 ? undefined : arguments[0];
	        this.actions = [];
	        this.currentTransform = [];
	        this.currentStepAnimates = [];
	        this.option = {
	            transition: {
	                duration: typeof option.duration !== 'undefined' ? option.duration : 400,
	                timingFunction: typeof option.timingFunction !== 'undefined' ? option.timingFunction : 'linear',
	                delay: typeof option.delay !== 'undefined' ? option.delay : 0
	            },
	            transformOrigin: option.transformOrigin || '50% 50% 0'
	        };
	    }

	    (0, _createClass3.default)(Animation, [{
	        key: 'export',
	        value: function _export() {
	            var temp = this.actions;
	            this.actions = [];
	            return { actions: temp };
	        }
	    }, {
	        key: 'step',
	        value: function step() {
	            var that = this,
	                params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};

	            this.currentStepAnimates.forEach(function (animate) {
	                animate.type !== 'style' ? that.currentTransform[animate.type] = animate : that.currentTransform[animate.type + '.' + animate.args[0]] = animate;
	            });
	            this.actions.push({
	                animates: (0, _keys2.default)(this.currentTransform).reduce(function (res, cur) {
	                    return [].concat(_utils2.default.toArray(res), [that.currentTransform[cur]]);
	                }, []),
	                option: {
	                    transformOrigin: typeof params.transformOrigin !== 'undefined' ? params.transformOrigin : this.option.transformOrigin,
	                    transition: {
	                        duration: typeof params.duration !== 'undefined' ? params.duration : this.option.transition.duration,
	                        timingFunction: typeof params.timingFunction !== 'undefined' ? params.timingFunction : this.option.transition.timingFunction,
	                        delay: typeof params.delay !== 'undefined' ? params.delay : this.option.transition.delay
	                    }
	                }
	            });
	            this.currentStepAnimates = [];
	            return this;
	        }
	    }, {
	        key: 'matrix',
	        value: function matrix() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
	                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
	                n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
	                o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 1,
	                r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 1,
	                i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 1;
	            this.currentStepAnimates.push({
	                type: 'matrix',
	                args: [e, t, n, o, r, i]
	            });
	            return this;
	        }
	    }, {
	        key: 'matrix3d',
	        value: function matrix3d() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
	                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
	                n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
	                o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0,
	                r = arguments.length > 4 && void 0 !== arguments[4] ? arguments[4] : 0,
	                i = arguments.length > 5 && void 0 !== arguments[5] ? arguments[5] : 1,
	                a = arguments.length > 6 && void 0 !== arguments[6] ? arguments[6] : 0,
	                s = arguments.length > 7 && void 0 !== arguments[7] ? arguments[7] : 0,
	                c = arguments.length > 8 && void 0 !== arguments[8] ? arguments[8] : 0,
	                u = arguments.length > 9 && void 0 !== arguments[9] ? arguments[9] : 0,
	                f = arguments.length > 10 && void 0 !== arguments[10] ? arguments[10] : 1,
	                l = arguments.length > 11 && void 0 !== arguments[11] ? arguments[11] : 0,
	                d = arguments.length > 12 && void 0 !== arguments[12] ? arguments[12] : 0,
	                p = arguments.length > 13 && void 0 !== arguments[13] ? arguments[13] : 0,
	                h = arguments.length > 14 && void 0 !== arguments[14] ? arguments[14] : 0,
	                v = arguments.length > 15 && void 0 !== arguments[15] ? arguments[15] : 1;
	            this.currentStepAnimates.push({
	                type: 'matrix3d',
	                args: [e, t, n, o, r, i, a, s, c, u, f, l, d, p, h, v]
	            });
	            this.stepping = !1;
	            return this;
	        }
	    }, {
	        key: 'rotate',
	        value: function rotate() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
	            this.currentStepAnimates.push({
	                type: 'rotate',
	                args: [e]
	            });
	            return this;
	        }
	    }, {
	        key: 'rotate3d',
	        value: function rotate3d() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
	                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
	                n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0,
	                o = arguments.length > 3 && void 0 !== arguments[3] ? arguments[3] : 0;
	            this.currentStepAnimates.push({
	                type: 'rotate3d',
	                args: [e, t, n, o]
	            });
	            this.stepping = !1;
	            return this;
	        }
	    }, {
	        key: 'rotateX',
	        value: function rotateX() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
	            this.currentStepAnimates.push({
	                type: 'rotateX',
	                args: [e]
	            });
	            this.stepping = !1;
	            return this;
	        }
	    }, {
	        key: 'rotateY',
	        value: function rotateY() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
	            this.currentStepAnimates.push({
	                type: 'rotateY',
	                args: [e]
	            });
	            this.stepping = !1;
	            return this;
	        }
	    }, {
	        key: 'rotateZ',
	        value: function rotateZ() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
	            this.currentStepAnimates.push({
	                type: 'rotateZ',
	                args: [e]
	            });
	            this.stepping = !1;
	            return this;
	        }
	    }, {
	        key: 'scale',
	        value: function scale() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
	                t = arguments[1];
	            t = typeof t !== 'undefined' ? t : e;
	            this.currentStepAnimates.push({
	                type: 'scale',
	                args: [e, t]
	            });
	            return this;
	        }
	    }, {
	        key: 'scale3d',
	        value: function scale3d() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1,
	                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 1,
	                n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 1;
	            this.currentStepAnimates.push({
	                type: 'scale3d',
	                args: [e, t, n]
	            });
	            return this;
	        }
	    }, {
	        key: 'scaleX',
	        value: function scaleX() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
	            this.currentStepAnimates.push({
	                type: 'scaleX',
	                args: [e]
	            });
	            return this;
	        }
	    }, {
	        key: 'scaleY',
	        value: function scaleY() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
	            this.currentStepAnimates.push({
	                type: 'scaleY',
	                args: [e]
	            });
	            return this;
	        }
	    }, {
	        key: 'scaleZ',
	        value: function scaleZ() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 1;
	            this.currentStepAnimates.push({
	                type: 'scaleZ',
	                args: [e]
	            });
	            return this;
	        }
	    }, {
	        key: 'skew',
	        value: function skew() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
	                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	            this.currentStepAnimates.push({
	                type: 'skew',
	                args: [e, t]
	            });
	            return this;
	        }
	    }, {
	        key: 'skewX',
	        value: function skewX() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
	            this.currentStepAnimates.push({
	                type: 'skewX',
	                args: [e]
	            });
	            return this;
	        }
	    }, {
	        key: 'skewY',
	        value: function skewY() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
	            this.currentStepAnimates.push({
	                type: 'skewY',
	                args: [e]
	            });
	            return this;
	        }
	    }, {
	        key: 'translate',
	        value: function translate() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
	                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0;
	            this.currentStepAnimates.push({
	                type: 'translate',
	                args: [e, t]
	            });
	            return this;
	        }
	    }, {
	        key: 'translate3d',
	        value: function translate3d() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0,
	                t = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : 0,
	                n = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : 0;
	            this.currentStepAnimates.push({
	                type: 'translate3d',
	                args: [e, t, n]
	            });
	            return this;
	        }
	    }, {
	        key: 'translateX',
	        value: function translateX() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
	            this.currentStepAnimates.push({
	                type: 'translateX',
	                args: [e]
	            });
	            return this;
	        }
	    }, {
	        key: 'translateY',
	        value: function translateY() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
	            this.currentStepAnimates.push({
	                type: 'translateY',
	                args: [e]
	            });
	            return this;
	        }
	    }, {
	        key: 'translateZ',
	        value: function translateZ() {
	            var e = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : 0;
	            this.currentStepAnimates.push({
	                type: 'translateZ',
	                args: [e]
	            });
	            return this;
	        }
	    }, {
	        key: 'opacity',
	        value: function opacity(e) {
	            this.currentStepAnimates.push({
	                type: 'style',
	                args: ['opacity', e]
	            });
	            return this;
	        }
	    }, {
	        key: 'backgroundColor',
	        value: function backgroundColor(e) {
	            this.currentStepAnimates.push({
	                type: 'style',
	                args: ['backgroundColor', e]
	            });
	            return this;
	        }
	    }, {
	        key: 'width',
	        value: function width(e) {
	            typeof e === 'number' && (e += 'px');
	            this.currentStepAnimates.push({
	                type: 'style',
	                args: ['width', e]
	            });
	            return this;
	        }
	    }, {
	        key: 'height',
	        value: function height(e) {
	            typeof e === 'number' && (e += 'px');
	            this.currentStepAnimates.push({
	                type: 'style',
	                args: ['height', e]
	            });
	            return this;
	        }
	    }, {
	        key: 'left',
	        value: function left(e) {
	            typeof e === 'number' && (e += 'px');
	            this.currentStepAnimates.push({
	                type: 'style',
	                args: ['left', e]
	            });
	            return this;
	        }
	    }, {
	        key: 'right',
	        value: function right(e) {
	            typeof e === 'number' && (e += 'px');
	            this.currentStepAnimates.push({
	                type: 'style',
	                args: ['right', e]
	            });
	            return this;
	        }
	    }, {
	        key: 'top',
	        value: function top(e) {
	            typeof e === 'number' && (e += 'px');
	            this.currentStepAnimates.push({
	                type: 'style',
	                args: ['top', e]
	            });
	            return this;
	        }
	    }, {
	        key: 'bottom',
	        value: function bottom(e) {
	            typeof e === 'number' && (e += 'px');
	            this.currentStepAnimates.push({
	                type: 'style',
	                args: ['bottom', e]
	            });
	            return this;
	        }
	    }]);
	    return Animation;
	}();

	exports.default = Animation;

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(100);

	var _createClass3 = _interopRequireDefault(_createClass2);

	__webpack_require__(111);

	__webpack_require__(112);

	var _EventEmitter = __webpack_require__(124);

	var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

	var _configFlags = __webpack_require__(137);

	var _configFlags2 = _interopRequireDefault(_configFlags);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createAudio(e, t) {
	    var self = this,
	        audioObj = new Audio(e, t);
	    audioObj._getAppStatus = function () {
	        return self.appStatus;
	    };
	    audioObj._getHanged = function () {
	        return self.hanged;
	    };
	    this.onAppEnterBackground(function () {
	        audioObj.pause();
	    });
	    return audioObj;
	}

	var audioFlags = {},
	    eventEmitter2 = new _EventEmitter2.default.EventEmitter2();

	ServiceJSBridge.subscribe("audioInsert", function (params, webviewId) {
	    var audioId = params.audioId;
	    audioFlags[webviewId + "_" + audioId] = !0;
	    eventEmitter2.emit("audioInsert_" + webviewId + "_" + audioId);
	});

	var Audio = function () {
	    function Audio(audioId, webviewId) {
	        (0, _classCallCheck3.default)(this, Audio);

	        if ("string" != typeof audioId) throw new Error("audioId should be a String");
	        this.audioId = audioId;
	        this.webviewId = webviewId;
	    }

	    (0, _createClass3.default)(Audio, [{
	        key: 'setSrc',
	        value: function setSrc(data) {
	            this._sendAction({
	                method: "setSrc",
	                data: data
	            });
	        }
	    }, {
	        key: 'play',
	        value: function play() {
	            var status = this._getAppStatus();
	            this._getHanged();
	            status === _configFlags2.default.AppStatus.BACK_GROUND || this._sendAction({
	                method: "play"
	            });
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            this._sendAction({
	                method: "pause"
	            });
	        }
	    }, {
	        key: 'seek',
	        value: function seek(data) {
	            this._sendAction({
	                method: "setCurrentTime",
	                data: data
	            });
	        }
	    }, {
	        key: '_ready',
	        value: function _ready(fn) {
	            audioFlags[this.webviewId + "_" + this.audioId] ? fn() : eventEmitter2.on("audioInsert_" + this.webviewId + "_" + this.audioId, function () {
	                fn();
	            });
	        }
	    }, {
	        key: '_sendAction',
	        value: function _sendAction(params) {
	            var self = this;
	            this._ready(function () {
	                ServiceJSBridge.publish("audio_" + self.audioId + "_actionChanged", params, [self.webviewId]);
	            });
	        }
	    }]);
	    return Audio;
	}();

	exports.default = createAudio;

/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	var _promise = __webpack_require__(126);

	var _promise2 = _interopRequireDefault(_promise);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var isArray = Array.isArray ? Array.isArray : function _isArray(obj) {
	    return Object.prototype.toString.call(obj) === "[object Array]";
	};
	var defaultMaxListeners = 10;

	function init() {
	    this._events = {};
	    if (this._conf) {
	        configure.call(this, this._conf);
	    }
	}

	function configure(conf) {
	    if (conf) {
	        this._conf = conf;

	        conf.delimiter && (this.delimiter = conf.delimiter);
	        this._maxListeners = conf.maxListeners !== undefined ? conf.maxListeners : defaultMaxListeners;

	        conf.wildcard && (this.wildcard = conf.wildcard);
	        conf.newListener && (this.newListener = conf.newListener);
	        conf.verboseMemoryLeak && (this.verboseMemoryLeak = conf.verboseMemoryLeak);

	        if (this.wildcard) {
	            this.listenerTree = {};
	        }
	    } else {
	        this._maxListeners = defaultMaxListeners;
	    }
	}

	function logPossibleMemoryLeak(count, eventName) {
	    var errorMsg = '(node) warning: possible EventEmitter memory ' + 'leak detected. ' + count + ' listeners added. ' + 'Use emitter.setMaxListeners() to increase limit.';

	    if (this.verboseMemoryLeak) {
	        errorMsg += ' Event name: ' + eventName + '.';
	    }

	    if (typeof process !== 'undefined' && process.emitWarning) {
	        var e = new Error(errorMsg);
	        e.name = 'MaxListenersExceededWarning';
	        e.emitter = this;
	        e.count = count;
	        process.emitWarning(e);
	    } else {
	        console.error(errorMsg);

	        if (console.trace) {
	            console.trace();
	        }
	    }
	}

	function EventEmitter(conf) {
	    this._events = {};
	    this.newListener = false;
	    this.verboseMemoryLeak = false;
	    configure.call(this, conf);
	}
	EventEmitter.EventEmitter2 = EventEmitter; // backwards compatibility for exporting EventEmitter property

	//
	// Attention, function return type now is array, always !
	// It has zero elements if no any matches found and one or more
	// elements (leafs) if there are matches
	//
	function searchListenerTree(handlers, type, tree, i) {
	    if (!tree) {
	        return [];
	    }
	    var listeners = [],
	        leaf,
	        len,
	        branch,
	        xTree,
	        xxTree,
	        isolatedBranch,
	        endReached,
	        typeLength = type.length,
	        currentType = type[i],
	        nextType = type[i + 1];
	    if (i === typeLength && tree._listeners) {
	        //
	        // If at the end of the event(s) list and the tree has listeners
	        // invoke those listeners.
	        //
	        if (typeof tree._listeners === 'function') {
	            handlers && handlers.push(tree._listeners);
	            return [tree];
	        } else {
	            for (leaf = 0, len = tree._listeners.length; leaf < len; leaf++) {
	                handlers && handlers.push(tree._listeners[leaf]);
	            }
	            return [tree];
	        }
	    }

	    if (currentType === '*' || currentType === '**' || tree[currentType]) {
	        //
	        // If the event emitted is '*' at this part
	        // or there is a concrete match at this patch
	        //
	        if (currentType === '*') {
	            for (branch in tree) {
	                if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	                    listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i + 1));
	                }
	            }
	            return listeners;
	        } else if (currentType === '**') {
	            endReached = i + 1 === typeLength || i + 2 === typeLength && nextType === '*';
	            if (endReached && tree._listeners) {
	                // The next element has a _listeners, add it to the handlers.
	                listeners = listeners.concat(searchListenerTree(handlers, type, tree, typeLength));
	            }

	            for (branch in tree) {
	                if (branch !== '_listeners' && tree.hasOwnProperty(branch)) {
	                    if (branch === '*' || branch === '**') {
	                        if (tree[branch]._listeners && !endReached) {
	                            listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], typeLength));
	                        }
	                        listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	                    } else if (branch === nextType) {
	                        listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i + 2));
	                    } else {
	                        // No match on this one, shift into the tree but not in the type array.
	                        listeners = listeners.concat(searchListenerTree(handlers, type, tree[branch], i));
	                    }
	                }
	            }
	            return listeners;
	        }

	        listeners = listeners.concat(searchListenerTree(handlers, type, tree[currentType], i + 1));
	    }

	    xTree = tree['*'];
	    if (xTree) {
	        //
	        // If the listener tree will allow any match for this part,
	        // then recursively explore all branches of the tree
	        //
	        searchListenerTree(handlers, type, xTree, i + 1);
	    }

	    xxTree = tree['**'];
	    if (xxTree) {
	        if (i < typeLength) {
	            if (xxTree._listeners) {
	                // If we have a listener on a '**', it will catch all, so add its handler.
	                searchListenerTree(handlers, type, xxTree, typeLength);
	            }

	            // Build arrays of matching next branches and others.
	            for (branch in xxTree) {
	                if (branch !== '_listeners' && xxTree.hasOwnProperty(branch)) {
	                    if (branch === nextType) {
	                        // We know the next element will match, so jump twice.
	                        searchListenerTree(handlers, type, xxTree[branch], i + 2);
	                    } else if (branch === currentType) {
	                        // Current node matches, move into the tree.
	                        searchListenerTree(handlers, type, xxTree[branch], i + 1);
	                    } else {
	                        isolatedBranch = {};
	                        isolatedBranch[branch] = xxTree[branch];
	                        searchListenerTree(handlers, type, { '**': isolatedBranch }, i + 1);
	                    }
	                }
	            }
	        } else if (xxTree._listeners) {
	            // We have reached the end and still on a '**'
	            searchListenerTree(handlers, type, xxTree, typeLength);
	        } else if (xxTree['*'] && xxTree['*']._listeners) {
	            searchListenerTree(handlers, type, xxTree['*'], typeLength);
	        }
	    }

	    return listeners;
	}

	function growListenerTree(type, listener) {

	    type = typeof type === 'string' ? type.split(this.delimiter) : type.slice();

	    //
	    // Looks for two consecutive '**', if so, don't add the event at all.
	    //
	    for (var i = 0, len = type.length; i + 1 < len; i++) {
	        if (type[i] === '**' && type[i + 1] === '**') {
	            return;
	        }
	    }

	    var tree = this.listenerTree;
	    var name = type.shift();

	    while (name !== undefined) {

	        if (!tree[name]) {
	            tree[name] = {};
	        }

	        tree = tree[name];

	        if (type.length === 0) {

	            if (!tree._listeners) {
	                tree._listeners = listener;
	            } else {
	                if (typeof tree._listeners === 'function') {
	                    tree._listeners = [tree._listeners];
	                }

	                tree._listeners.push(listener);

	                if (!tree._listeners.warned && this._maxListeners > 0 && tree._listeners.length > this._maxListeners) {
	                    tree._listeners.warned = true;
	                    logPossibleMemoryLeak.call(this, tree._listeners.length, name);
	                }
	            }
	            return true;
	        }
	        name = type.shift();
	    }
	    return true;
	}

	// By default EventEmitters will print a warning if more than
	// 10 listeners are added to it. This is a useful default which
	// helps finding memory leaks.
	//
	// Obviously not all Emitters should be limited to 10. This function allows
	// that to be increased. Set to zero for unlimited.

	EventEmitter.prototype.delimiter = '.';

	EventEmitter.prototype.setMaxListeners = function (n) {
	    if (n !== undefined) {
	        this._maxListeners = n;
	        if (!this._conf) this._conf = {};
	        this._conf.maxListeners = n;
	    }
	};

	EventEmitter.prototype.event = '';

	EventEmitter.prototype.once = function (event, fn) {
	    return this._once(event, fn, false);
	};

	EventEmitter.prototype.prependOnceListener = function (event, fn) {
	    return this._once(event, fn, true);
	};

	EventEmitter.prototype._once = function (event, fn, prepend) {
	    this._many(event, 1, fn, prepend);
	    return this;
	};

	EventEmitter.prototype.many = function (event, ttl, fn) {
	    return this._many(event, ttl, fn, false);
	};

	EventEmitter.prototype.prependMany = function (event, ttl, fn) {
	    return this._many(event, ttl, fn, true);
	};

	EventEmitter.prototype._many = function (event, ttl, fn, prepend) {
	    var self = this;

	    if (typeof fn !== 'function') {
	        throw new Error('many only accepts instances of Function');
	    }

	    function listener() {
	        if (--ttl === 0) {
	            self.off(event, listener);
	        }
	        return fn.apply(this, arguments);
	    }

	    listener._origin = fn;

	    this._on(event, listener, prepend);

	    return self;
	};

	EventEmitter.prototype.emit = function () {

	    this._events || init.call(this);

	    var type = arguments[0];

	    if (type === 'newListener' && !this.newListener) {
	        if (!this._events.newListener) {
	            return false;
	        }
	    }

	    var al = arguments.length;
	    var args, l, i, j;
	    var handler;

	    if (this._all && this._all.length) {
	        handler = this._all.slice();
	        if (al > 3) {
	            args = new Array(al);
	            for (j = 0; j < al; j++) {
	                args[j] = arguments[j];
	            }
	        }

	        for (i = 0, l = handler.length; i < l; i++) {
	            this.event = type;
	            switch (al) {
	                case 1:
	                    handler[i].call(this, type);
	                    break;
	                case 2:
	                    handler[i].call(this, type, arguments[1]);
	                    break;
	                case 3:
	                    handler[i].call(this, type, arguments[1], arguments[2]);
	                    break;
	                default:
	                    handler[i].apply(this, args);
	            }
	        }
	    }

	    if (this.wildcard) {
	        handler = [];
	        var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	        searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	    } else {
	        handler = this._events[type];
	        if (typeof handler === 'function') {
	            this.event = type;
	            switch (al) {
	                case 1:
	                    handler.call(this);
	                    break;
	                case 2:
	                    handler.call(this, arguments[1]);
	                    break;
	                case 3:
	                    handler.call(this, arguments[1], arguments[2]);
	                    break;
	                default:
	                    args = new Array(al - 1);
	                    for (j = 1; j < al; j++) {
	                        args[j - 1] = arguments[j];
	                    }handler.apply(this, args);
	            }
	            return true;
	        } else if (handler) {
	            // need to make copy of handlers because list can change in the middle
	            // of emit call
	            handler = handler.slice();
	        }
	    }

	    if (handler && handler.length) {
	        if (al > 3) {
	            args = new Array(al - 1);
	            for (j = 1; j < al; j++) {
	                args[j - 1] = arguments[j];
	            }
	        }
	        for (i = 0, l = handler.length; i < l; i++) {
	            this.event = type;
	            switch (al) {
	                case 1:
	                    handler[i].call(this);
	                    break;
	                case 2:
	                    handler[i].call(this, arguments[1]);
	                    break;
	                case 3:
	                    handler[i].call(this, arguments[1], arguments[2]);
	                    break;
	                default:
	                    handler[i].apply(this, args);
	            }
	        }
	        return true;
	    } else if (!this._all && type === 'error') {
	        if (arguments[1] instanceof Error) {
	            throw arguments[1]; // Unhandled 'error' event
	        } else {
	            throw new Error("Uncaught, unspecified 'error' event.");
	        }
	        return false;
	    }

	    return !!this._all;
	};

	EventEmitter.prototype.emitAsync = function () {

	    this._events || init.call(this);

	    var type = arguments[0];

	    if (type === 'newListener' && !this.newListener) {
	        if (!this._events.newListener) {
	            return _promise2.default.resolve([false]);
	        }
	    }

	    var promises = [];

	    var al = arguments.length;
	    var args, l, i, j;
	    var handler;

	    if (this._all) {
	        if (al > 3) {
	            args = new Array(al);
	            for (j = 1; j < al; j++) {
	                args[j] = arguments[j];
	            }
	        }
	        for (i = 0, l = this._all.length; i < l; i++) {
	            this.event = type;
	            switch (al) {
	                case 1:
	                    promises.push(this._all[i].call(this, type));
	                    break;
	                case 2:
	                    promises.push(this._all[i].call(this, type, arguments[1]));
	                    break;
	                case 3:
	                    promises.push(this._all[i].call(this, type, arguments[1], arguments[2]));
	                    break;
	                default:
	                    promises.push(this._all[i].apply(this, args));
	            }
	        }
	    }

	    if (this.wildcard) {
	        handler = [];
	        var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	        searchListenerTree.call(this, handler, ns, this.listenerTree, 0);
	    } else {
	        handler = this._events[type];
	    }

	    if (typeof handler === 'function') {
	        this.event = type;
	        switch (al) {
	            case 1:
	                promises.push(handler.call(this));
	                break;
	            case 2:
	                promises.push(handler.call(this, arguments[1]));
	                break;
	            case 3:
	                promises.push(handler.call(this, arguments[1], arguments[2]));
	                break;
	            default:
	                args = new Array(al - 1);
	                for (j = 1; j < al; j++) {
	                    args[j - 1] = arguments[j];
	                }promises.push(handler.apply(this, args));
	        }
	    } else if (handler && handler.length) {
	        handler = handler.slice();
	        if (al > 3) {
	            args = new Array(al - 1);
	            for (j = 1; j < al; j++) {
	                args[j - 1] = arguments[j];
	            }
	        }
	        for (i = 0, l = handler.length; i < l; i++) {
	            this.event = type;
	            switch (al) {
	                case 1:
	                    promises.push(handler[i].call(this));
	                    break;
	                case 2:
	                    promises.push(handler[i].call(this, arguments[1]));
	                    break;
	                case 3:
	                    promises.push(handler[i].call(this, arguments[1], arguments[2]));
	                    break;
	                default:
	                    promises.push(handler[i].apply(this, args));
	            }
	        }
	    } else if (!this._all && type === 'error') {
	        if (arguments[1] instanceof Error) {
	            return _promise2.default.reject(arguments[1]); // Unhandled 'error' event
	        } else {
	            return _promise2.default.reject("Uncaught, unspecified 'error' event.");
	        }
	    }

	    return _promise2.default.all(promises);
	};

	EventEmitter.prototype.on = function (type, listener) {
	    return this._on(type, listener, false);
	};

	EventEmitter.prototype.prependListener = function (type, listener) {
	    return this._on(type, listener, true);
	};

	EventEmitter.prototype.onAny = function (fn) {
	    return this._onAny(fn, false);
	};

	EventEmitter.prototype.prependAny = function (fn) {
	    return this._onAny(fn, true);
	};

	EventEmitter.prototype.addListener = EventEmitter.prototype.on;

	EventEmitter.prototype._onAny = function (fn, prepend) {
	    if (typeof fn !== 'function') {
	        throw new Error('onAny only accepts instances of Function');
	    }

	    if (!this._all) {
	        this._all = [];
	    }

	    // Add the function to the event listener collection.
	    if (prepend) {
	        this._all.unshift(fn);
	    } else {
	        this._all.push(fn);
	    }

	    return this;
	};

	EventEmitter.prototype._on = function (type, listener, prepend) {
	    if (typeof type === 'function') {
	        this._onAny(type, listener);
	        return this;
	    }

	    if (typeof listener !== 'function') {
	        throw new Error('on only accepts instances of Function');
	    }
	    this._events || init.call(this);

	    // To avoid recursion in the case that type == "newListeners"! Before
	    // adding it to the listeners, first emit "newListeners".
	    this.emit('newListener', type, listener);

	    if (this.wildcard) {
	        growListenerTree.call(this, type, listener);
	        return this;
	    }

	    if (!this._events[type]) {
	        // Optimize the case of one listener. Don't need the extra array object.
	        this._events[type] = listener;
	    } else {
	        if (typeof this._events[type] === 'function') {
	            // Change to array.
	            this._events[type] = [this._events[type]];
	        }

	        // If we've already got an array, just add
	        if (prepend) {
	            this._events[type].unshift(listener);
	        } else {
	            this._events[type].push(listener);
	        }

	        // Check for listener leak
	        if (!this._events[type].warned && this._maxListeners > 0 && this._events[type].length > this._maxListeners) {
	            this._events[type].warned = true;
	            logPossibleMemoryLeak.call(this, this._events[type].length, type);
	        }
	    }

	    return this;
	};

	EventEmitter.prototype.off = function (type, listener) {
	    if (typeof listener !== 'function') {
	        throw new Error('removeListener only takes instances of Function');
	    }

	    var handlers,
	        leafs = [];

	    if (this.wildcard) {
	        var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	        leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);
	    } else {
	        // does not use listeners(), so no side effect of creating _events[type]
	        if (!this._events[type]) return this;
	        handlers = this._events[type];
	        leafs.push({ _listeners: handlers });
	    }

	    for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
	        var leaf = leafs[iLeaf];
	        handlers = leaf._listeners;
	        if (isArray(handlers)) {

	            var position = -1;

	            for (var i = 0, length = handlers.length; i < length; i++) {
	                if (handlers[i] === listener || handlers[i].listener && handlers[i].listener === listener || handlers[i]._origin && handlers[i]._origin === listener) {
	                    position = i;
	                    break;
	                }
	            }

	            if (position < 0) {
	                continue;
	            }

	            if (this.wildcard) {
	                leaf._listeners.splice(position, 1);
	            } else {
	                this._events[type].splice(position, 1);
	            }

	            if (handlers.length === 0) {
	                if (this.wildcard) {
	                    delete leaf._listeners;
	                } else {
	                    delete this._events[type];
	                }
	            }

	            this.emit("removeListener", type, listener);

	            return this;
	        } else if (handlers === listener || handlers.listener && handlers.listener === listener || handlers._origin && handlers._origin === listener) {
	            if (this.wildcard) {
	                delete leaf._listeners;
	            } else {
	                delete this._events[type];
	            }

	            this.emit("removeListener", type, listener);
	        }
	    }

	    function recursivelyGarbageCollect(root) {
	        if (root === undefined) {
	            return;
	        }
	        var keys = (0, _keys2.default)(root);
	        for (var i in keys) {
	            var key = keys[i];
	            var obj = root[key];
	            if (obj instanceof Function || (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) !== "object" || obj === null) continue;
	            if ((0, _keys2.default)(obj).length > 0) {
	                recursivelyGarbageCollect(root[key]);
	            }
	            if ((0, _keys2.default)(obj).length === 0) {
	                delete root[key];
	            }
	        }
	    }
	    recursivelyGarbageCollect(this.listenerTree);

	    return this;
	};

	EventEmitter.prototype.offAny = function (fn) {
	    var i = 0,
	        l = 0,
	        fns;
	    if (fn && this._all && this._all.length > 0) {
	        fns = this._all;
	        for (i = 0, l = fns.length; i < l; i++) {
	            if (fn === fns[i]) {
	                fns.splice(i, 1);
	                this.emit("removeListenerAny", fn);
	                return this;
	            }
	        }
	    } else {
	        fns = this._all;
	        for (i = 0, l = fns.length; i < l; i++) {
	            this.emit("removeListenerAny", fns[i]);
	        }this._all = [];
	    }
	    return this;
	};

	EventEmitter.prototype.removeListener = EventEmitter.prototype.off;

	EventEmitter.prototype.removeAllListeners = function (type) {
	    if (arguments.length === 0) {
	        !this._events || init.call(this);
	        return this;
	    }

	    if (this.wildcard) {
	        var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	        var leafs = searchListenerTree.call(this, null, ns, this.listenerTree, 0);

	        for (var iLeaf = 0; iLeaf < leafs.length; iLeaf++) {
	            var leaf = leafs[iLeaf];
	            leaf._listeners = null;
	        }
	    } else if (this._events) {
	        this._events[type] = null;
	    }
	    return this;
	};

	EventEmitter.prototype.listeners = function (type) {
	    if (this.wildcard) {
	        var handlers = [];
	        var ns = typeof type === 'string' ? type.split(this.delimiter) : type.slice();
	        searchListenerTree.call(this, handlers, ns, this.listenerTree, 0);
	        return handlers;
	    }

	    this._events || init.call(this);

	    if (!this._events[type]) this._events[type] = [];
	    if (!isArray(this._events[type])) {
	        this._events[type] = [this._events[type]];
	    }
	    return this._events[type];
	};

	EventEmitter.prototype.eventNames = function () {
	    return (0, _keys2.default)(this._events);
	};

	EventEmitter.prototype.listenerCount = function (type) {
	    return this.listeners(type).length;
	};

	EventEmitter.prototype.listenersAny = function () {

	    if (this._all) {
	        return this._all;
	    } else {
	        return [];
	    }
	};

	exports.default = EventEmitter;
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(125)))

/***/ }),
/* 125 */
/***/ (function(module, exports) {

	// shim for using process in browser
	var process = module.exports = {};

	// cached from whatever global is present so that test runners that stub it
	// don't break things.  But we need to wrap it in a try catch in case it is
	// wrapped in strict mode code which doesn't define any globals.  It's inside a
	// function because try/catches deoptimize in certain engines.

	var cachedSetTimeout;
	var cachedClearTimeout;

	function defaultSetTimout() {
	    throw new Error('setTimeout has not been defined');
	}
	function defaultClearTimeout () {
	    throw new Error('clearTimeout has not been defined');
	}
	(function () {
	    try {
	        if (typeof setTimeout === 'function') {
	            cachedSetTimeout = setTimeout;
	        } else {
	            cachedSetTimeout = defaultSetTimout;
	        }
	    } catch (e) {
	        cachedSetTimeout = defaultSetTimout;
	    }
	    try {
	        if (typeof clearTimeout === 'function') {
	            cachedClearTimeout = clearTimeout;
	        } else {
	            cachedClearTimeout = defaultClearTimeout;
	        }
	    } catch (e) {
	        cachedClearTimeout = defaultClearTimeout;
	    }
	} ())
	function runTimeout(fun) {
	    if (cachedSetTimeout === setTimeout) {
	        //normal enviroments in sane situations
	        return setTimeout(fun, 0);
	    }
	    // if setTimeout wasn't available but was latter defined
	    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
	        cachedSetTimeout = setTimeout;
	        return setTimeout(fun, 0);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedSetTimeout(fun, 0);
	    } catch(e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
	            return cachedSetTimeout.call(null, fun, 0);
	        } catch(e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
	            return cachedSetTimeout.call(this, fun, 0);
	        }
	    }


	}
	function runClearTimeout(marker) {
	    if (cachedClearTimeout === clearTimeout) {
	        //normal enviroments in sane situations
	        return clearTimeout(marker);
	    }
	    // if clearTimeout wasn't available but was latter defined
	    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
	        cachedClearTimeout = clearTimeout;
	        return clearTimeout(marker);
	    }
	    try {
	        // when when somebody has screwed with setTimeout but no I.E. maddness
	        return cachedClearTimeout(marker);
	    } catch (e){
	        try {
	            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
	            return cachedClearTimeout.call(null, marker);
	        } catch (e){
	            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
	            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
	            return cachedClearTimeout.call(this, marker);
	        }
	    }



	}
	var queue = [];
	var draining = false;
	var currentQueue;
	var queueIndex = -1;

	function cleanUpNextTick() {
	    if (!draining || !currentQueue) {
	        return;
	    }
	    draining = false;
	    if (currentQueue.length) {
	        queue = currentQueue.concat(queue);
	    } else {
	        queueIndex = -1;
	    }
	    if (queue.length) {
	        drainQueue();
	    }
	}

	function drainQueue() {
	    if (draining) {
	        return;
	    }
	    var timeout = runTimeout(cleanUpNextTick);
	    draining = true;

	    var len = queue.length;
	    while(len) {
	        currentQueue = queue;
	        queue = [];
	        while (++queueIndex < len) {
	            if (currentQueue) {
	                currentQueue[queueIndex].run();
	            }
	        }
	        queueIndex = -1;
	        len = queue.length;
	    }
	    currentQueue = null;
	    draining = false;
	    runClearTimeout(timeout);
	}

	process.nextTick = function (fun) {
	    var args = new Array(arguments.length - 1);
	    if (arguments.length > 1) {
	        for (var i = 1; i < arguments.length; i++) {
	            args[i - 1] = arguments[i];
	        }
	    }
	    queue.push(new Item(fun, args));
	    if (queue.length === 1 && !draining) {
	        runTimeout(drainQueue);
	    }
	};

	// v8 likes predictible objects
	function Item(fun, array) {
	    this.fun = fun;
	    this.array = array;
	}
	Item.prototype.run = function () {
	    this.fun.apply(null, this.array);
	};
	process.title = 'browser';
	process.browser = true;
	process.env = {};
	process.argv = [];
	process.version = ''; // empty string to avoid regexp issues
	process.versions = {};

	function noop() {}

	process.on = noop;
	process.addListener = noop;
	process.once = noop;
	process.off = noop;
	process.removeListener = noop;
	process.removeAllListeners = noop;
	process.emit = noop;
	process.prependListener = noop;
	process.prependOnceListener = noop;

	process.listeners = function (name) { return [] }

	process.binding = function (name) {
	    throw new Error('process.binding is not supported');
	};

	process.cwd = function () { return '/' };
	process.chdir = function (dir) {
	    throw new Error('process.chdir is not supported');
	};
	process.umask = function() { return 0; };


/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(127), __esModule: true };

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(74);
	__webpack_require__(43);
	__webpack_require__(56);
	__webpack_require__(128);
	module.exports = __webpack_require__(3).Promise;

/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY            = __webpack_require__(46)
	  , global             = __webpack_require__(21)
	  , ctx                = __webpack_require__(26)
	  , classof            = __webpack_require__(120)
	  , $export            = __webpack_require__(25)
	  , isObject           = __webpack_require__(31)
	  , aFunction          = __webpack_require__(27)
	  , anInstance         = __webpack_require__(129)
	  , forOf              = __webpack_require__(130)
	  , speciesConstructor = __webpack_require__(131)
	  , task               = __webpack_require__(132).set
	  , microtask          = __webpack_require__(134)()
	  , PROMISE            = 'Promise'
	  , TypeError          = global.TypeError
	  , process            = global.process
	  , $Promise           = global[PROMISE]
	  , process            = global.process
	  , isNode             = classof(process) == 'process'
	  , empty              = function(){ /* empty */ }
	  , Internal, GenericPromiseCapability, Wrapper;

	var USE_NATIVE = !!function(){
	  try {
	    // correct subclassing with @@species support
	    var promise     = $Promise.resolve(1)
	      , FakePromise = (promise.constructor = {})[__webpack_require__(54)('species')] = function(exec){ exec(empty, empty); };
	    // unhandled rejections tracking support, NodeJS Promise without it fails @@species test
	    return (isNode || typeof PromiseRejectionEvent == 'function') && promise.then(empty) instanceof FakePromise;
	  } catch(e){ /* empty */ }
	}();

	// helpers
	var sameConstructor = function(a, b){
	  // with library wrapper special case
	  return a === b || a === $Promise && b === Wrapper;
	};
	var isThenable = function(it){
	  var then;
	  return isObject(it) && typeof (then = it.then) == 'function' ? then : false;
	};
	var newPromiseCapability = function(C){
	  return sameConstructor($Promise, C)
	    ? new PromiseCapability(C)
	    : new GenericPromiseCapability(C);
	};
	var PromiseCapability = GenericPromiseCapability = function(C){
	  var resolve, reject;
	  this.promise = new C(function($$resolve, $$reject){
	    if(resolve !== undefined || reject !== undefined)throw TypeError('Bad Promise constructor');
	    resolve = $$resolve;
	    reject  = $$reject;
	  });
	  this.resolve = aFunction(resolve);
	  this.reject  = aFunction(reject);
	};
	var perform = function(exec){
	  try {
	    exec();
	  } catch(e){
	    return {error: e};
	  }
	};
	var notify = function(promise, isReject){
	  if(promise._n)return;
	  promise._n = true;
	  var chain = promise._c;
	  microtask(function(){
	    var value = promise._v
	      , ok    = promise._s == 1
	      , i     = 0;
	    var run = function(reaction){
	      var handler = ok ? reaction.ok : reaction.fail
	        , resolve = reaction.resolve
	        , reject  = reaction.reject
	        , domain  = reaction.domain
	        , result, then;
	      try {
	        if(handler){
	          if(!ok){
	            if(promise._h == 2)onHandleUnhandled(promise);
	            promise._h = 1;
	          }
	          if(handler === true)result = value;
	          else {
	            if(domain)domain.enter();
	            result = handler(value);
	            if(domain)domain.exit();
	          }
	          if(result === reaction.promise){
	            reject(TypeError('Promise-chain cycle'));
	          } else if(then = isThenable(result)){
	            then.call(result, resolve, reject);
	          } else resolve(result);
	        } else reject(value);
	      } catch(e){
	        reject(e);
	      }
	    };
	    while(chain.length > i)run(chain[i++]); // variable length - can't use forEach
	    promise._c = [];
	    promise._n = false;
	    if(isReject && !promise._h)onUnhandled(promise);
	  });
	};
	var onUnhandled = function(promise){
	  task.call(global, function(){
	    var value = promise._v
	      , abrupt, handler, console;
	    if(isUnhandled(promise)){
	      abrupt = perform(function(){
	        if(isNode){
	          process.emit('unhandledRejection', value, promise);
	        } else if(handler = global.onunhandledrejection){
	          handler({promise: promise, reason: value});
	        } else if((console = global.console) && console.error){
	          console.error('Unhandled promise rejection', value);
	        }
	      });
	      // Browsers should not trigger `rejectionHandled` event if it was handled here, NodeJS - should
	      promise._h = isNode || isUnhandled(promise) ? 2 : 1;
	    } promise._a = undefined;
	    if(abrupt)throw abrupt.error;
	  });
	};
	var isUnhandled = function(promise){
	  if(promise._h == 1)return false;
	  var chain = promise._a || promise._c
	    , i     = 0
	    , reaction;
	  while(chain.length > i){
	    reaction = chain[i++];
	    if(reaction.fail || !isUnhandled(reaction.promise))return false;
	  } return true;
	};
	var onHandleUnhandled = function(promise){
	  task.call(global, function(){
	    var handler;
	    if(isNode){
	      process.emit('rejectionHandled', promise);
	    } else if(handler = global.onrejectionhandled){
	      handler({promise: promise, reason: promise._v});
	    }
	  });
	};
	var $reject = function(value){
	  var promise = this;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  promise._v = value;
	  promise._s = 2;
	  if(!promise._a)promise._a = promise._c.slice();
	  notify(promise, true);
	};
	var $resolve = function(value){
	  var promise = this
	    , then;
	  if(promise._d)return;
	  promise._d = true;
	  promise = promise._w || promise; // unwrap
	  try {
	    if(promise === value)throw TypeError("Promise can't be resolved itself");
	    if(then = isThenable(value)){
	      microtask(function(){
	        var wrapper = {_w: promise, _d: false}; // wrap
	        try {
	          then.call(value, ctx($resolve, wrapper, 1), ctx($reject, wrapper, 1));
	        } catch(e){
	          $reject.call(wrapper, e);
	        }
	      });
	    } else {
	      promise._v = value;
	      promise._s = 1;
	      notify(promise, false);
	    }
	  } catch(e){
	    $reject.call({_w: promise, _d: false}, e); // wrap
	  }
	};

	// constructor polyfill
	if(!USE_NATIVE){
	  // 25.4.3.1 Promise(executor)
	  $Promise = function Promise(executor){
	    anInstance(this, $Promise, PROMISE, '_h');
	    aFunction(executor);
	    Internal.call(this);
	    try {
	      executor(ctx($resolve, this, 1), ctx($reject, this, 1));
	    } catch(err){
	      $reject.call(this, err);
	    }
	  };
	  Internal = function Promise(executor){
	    this._c = [];             // <- awaiting reactions
	    this._a = undefined;      // <- checked in isUnhandled reactions
	    this._s = 0;              // <- state
	    this._d = false;          // <- done
	    this._v = undefined;      // <- value
	    this._h = 0;              // <- rejection state, 0 - default, 1 - handled, 2 - unhandled
	    this._n = false;          // <- notify
	  };
	  Internal.prototype = __webpack_require__(135)($Promise.prototype, {
	    // 25.4.5.3 Promise.prototype.then(onFulfilled, onRejected)
	    then: function then(onFulfilled, onRejected){
	      var reaction    = newPromiseCapability(speciesConstructor(this, $Promise));
	      reaction.ok     = typeof onFulfilled == 'function' ? onFulfilled : true;
	      reaction.fail   = typeof onRejected == 'function' && onRejected;
	      reaction.domain = isNode ? process.domain : undefined;
	      this._c.push(reaction);
	      if(this._a)this._a.push(reaction);
	      if(this._s)notify(this, false);
	      return reaction.promise;
	    },
	    // 25.4.5.1 Promise.prototype.catch(onRejected)
	    'catch': function(onRejected){
	      return this.then(undefined, onRejected);
	    }
	  });
	  PromiseCapability = function(){
	    var promise  = new Internal;
	    this.promise = promise;
	    this.resolve = ctx($resolve, promise, 1);
	    this.reject  = ctx($reject, promise, 1);
	  };
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Promise: $Promise});
	__webpack_require__(53)($Promise, PROMISE);
	__webpack_require__(136)(PROMISE);
	Wrapper = __webpack_require__(3)[PROMISE];

	// statics
	$export($export.S + $export.F * !USE_NATIVE, PROMISE, {
	  // 25.4.4.5 Promise.reject(r)
	  reject: function reject(r){
	    var capability = newPromiseCapability(this)
	      , $$reject   = capability.reject;
	    $$reject(r);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * (LIBRARY || !USE_NATIVE), PROMISE, {
	  // 25.4.4.6 Promise.resolve(x)
	  resolve: function resolve(x){
	    // instanceof instead of internal slot check because we should fix it without replacement native Promise core
	    if(x instanceof $Promise && sameConstructor(x.constructor, this))return x;
	    var capability = newPromiseCapability(this)
	      , $$resolve  = capability.resolve;
	    $$resolve(x);
	    return capability.promise;
	  }
	});
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(121)(function(iter){
	  $Promise.all(iter)['catch'](empty);
	})), PROMISE, {
	  // 25.4.4.1 Promise.all(iterable)
	  all: function all(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , resolve    = capability.resolve
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      var values    = []
	        , index     = 0
	        , remaining = 1;
	      forOf(iterable, false, function(promise){
	        var $index        = index++
	          , alreadyCalled = false;
	        values.push(undefined);
	        remaining++;
	        C.resolve(promise).then(function(value){
	          if(alreadyCalled)return;
	          alreadyCalled  = true;
	          values[$index] = value;
	          --remaining || resolve(values);
	        }, reject);
	      });
	      --remaining || resolve(values);
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  },
	  // 25.4.4.4 Promise.race(iterable)
	  race: function race(iterable){
	    var C          = this
	      , capability = newPromiseCapability(C)
	      , reject     = capability.reject;
	    var abrupt = perform(function(){
	      forOf(iterable, false, function(promise){
	        C.resolve(promise).then(capability.resolve, reject);
	      });
	    });
	    if(abrupt)reject(abrupt.error);
	    return capability.promise;
	  }
	});

/***/ }),
/* 129 */
/***/ (function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ }),
/* 130 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(26)
	  , call        = __webpack_require__(116)
	  , isArrayIter = __webpack_require__(117)
	  , anObject    = __webpack_require__(30)
	  , toLength    = __webpack_require__(16)
	  , getIterFn   = __webpack_require__(119)
	  , BREAK       = {}
	  , RETURN      = {};
	var exports = module.exports = function(iterable, entries, fn, that, ITERATOR){
	  var iterFn = ITERATOR ? function(){ return iterable; } : getIterFn(iterable)
	    , f      = ctx(fn, that, entries ? 2 : 1)
	    , index  = 0
	    , length, step, iterator, result;
	  if(typeof iterFn != 'function')throw TypeError(iterable + ' is not iterable!');
	  // fast case for arrays with default iterator
	  if(isArrayIter(iterFn))for(length = toLength(iterable.length); length > index; index++){
	    result = entries ? f(anObject(step = iterable[index])[0], step[1]) : f(iterable[index]);
	    if(result === BREAK || result === RETURN)return result;
	  } else for(iterator = iterFn.call(iterable); !(step = iterator.next()).done; ){
	    result = call(iterator, f, step.value, entries);
	    if(result === BREAK || result === RETURN)return result;
	  }
	};
	exports.BREAK  = BREAK;
	exports.RETURN = RETURN;

/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(30)
	  , aFunction = __webpack_require__(27)
	  , SPECIES   = __webpack_require__(54)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(26)
	  , invoke             = __webpack_require__(133)
	  , html               = __webpack_require__(52)
	  , cel                = __webpack_require__(35)
	  , global             = __webpack_require__(21)
	  , process            = global.process
	  , setTask            = global.setImmediate
	  , clearTask          = global.clearImmediate
	  , MessageChannel     = global.MessageChannel
	  , counter            = 0
	  , queue              = {}
	  , ONREADYSTATECHANGE = 'onreadystatechange'
	  , defer, channel, port;
	var run = function(){
	  var id = +this;
	  if(queue.hasOwnProperty(id)){
	    var fn = queue[id];
	    delete queue[id];
	    fn();
	  }
	};
	var listener = function(event){
	  run.call(event.data);
	};
	// Node.js 0.9+ & IE10+ has setImmediate, otherwise:
	if(!setTask || !clearTask){
	  setTask = function setImmediate(fn){
	    var args = [], i = 1;
	    while(arguments.length > i)args.push(arguments[i++]);
	    queue[++counter] = function(){
	      invoke(typeof fn == 'function' ? fn : Function(fn), args);
	    };
	    defer(counter);
	    return counter;
	  };
	  clearTask = function clearImmediate(id){
	    delete queue[id];
	  };
	  // Node.js 0.8-
	  if(__webpack_require__(14)(process) == 'process'){
	    defer = function(id){
	      process.nextTick(ctx(run, id, 1));
	    };
	  // Browsers with MessageChannel, includes WebWorkers
	  } else if(MessageChannel){
	    channel = new MessageChannel;
	    port    = channel.port2;
	    channel.port1.onmessage = listener;
	    defer = ctx(port.postMessage, port, 1);
	  // Browsers with postMessage, skip WebWorkers
	  // IE8 has postMessage, but it's sync & typeof its postMessage is 'object'
	  } else if(global.addEventListener && typeof postMessage == 'function' && !global.importScripts){
	    defer = function(id){
	      global.postMessage(id + '', '*');
	    };
	    global.addEventListener('message', listener, false);
	  // IE8-
	  } else if(ONREADYSTATECHANGE in cel('script')){
	    defer = function(id){
	      html.appendChild(cel('script'))[ONREADYSTATECHANGE] = function(){
	        html.removeChild(this);
	        run.call(id);
	      };
	    };
	  // Rest old browsers
	  } else {
	    defer = function(id){
	      setTimeout(ctx(run, id, 1), 0);
	    };
	  }
	}
	module.exports = {
	  set:   setTask,
	  clear: clearTask
	};

/***/ }),
/* 133 */
/***/ (function(module, exports) {

	// fast apply, http://jsperf.lnkit.com/fast-apply/5
	module.exports = function(fn, args, that){
	  var un = that === undefined;
	  switch(args.length){
	    case 0: return un ? fn()
	                      : fn.call(that);
	    case 1: return un ? fn(args[0])
	                      : fn.call(that, args[0]);
	    case 2: return un ? fn(args[0], args[1])
	                      : fn.call(that, args[0], args[1]);
	    case 3: return un ? fn(args[0], args[1], args[2])
	                      : fn.call(that, args[0], args[1], args[2]);
	    case 4: return un ? fn(args[0], args[1], args[2], args[3])
	                      : fn.call(that, args[0], args[1], args[2], args[3]);
	  } return              fn.apply(that, args);
	};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(21)
	  , macrotask = __webpack_require__(132).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(14)(process) == 'process';

	module.exports = function(){
	  var head, last, notify;

	  var flush = function(){
	    var parent, fn;
	    if(isNode && (parent = process.domain))parent.exit();
	    while(head){
	      fn   = head.fn;
	      head = head.next;
	      try {
	        fn();
	      } catch(e){
	        if(head)notify();
	        else last = undefined;
	        throw e;
	      }
	    } last = undefined;
	    if(parent)parent.enter();
	  };

	  // Node.js
	  if(isNode){
	    notify = function(){
	      process.nextTick(flush);
	    };
	  // browsers with MutationObserver
	  } else if(Observer){
	    var toggle = true
	      , node   = document.createTextNode('');
	    new Observer(flush).observe(node, {characterData: true}); // eslint-disable-line no-new
	    notify = function(){
	      node.data = toggle = !toggle;
	    };
	  // environments with maybe non-completely correct, but existent Promise
	  } else if(Promise && Promise.resolve){
	    var promise = Promise.resolve();
	    notify = function(){
	      promise.then(flush);
	    };
	  // for other environments - macrotask based on:
	  // - setImmediate
	  // - MessageChannel
	  // - window.postMessag
	  // - onreadystatechange
	  // - setTimeout
	  } else {
	    notify = function(){
	      // strange IE + webpack dev server bug - use .call(global)
	      macrotask.call(global, flush);
	    };
	  }

	  return function(fn){
	    var task = {fn: fn, next: undefined};
	    if(last)last.next = task;
	    if(!head){
	      head = task;
	      notify();
	    } last = task;
	  };
	};

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(28);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(21)
	  , core        = __webpack_require__(3)
	  , dP          = __webpack_require__(29)
	  , DESCRIPTORS = __webpack_require__(33)
	  , SPECIES     = __webpack_require__(54)('species');

	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ }),
/* 137 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// module6

	exports.default = {
	    LOG_LIMIT: 1024,
	    AppStatus: {
	        FORE_GROUND: 0,
	        BACK_GROUND: 1,
	        LOCLOCKK: 2
	    }
	};

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(100);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _bridge = __webpack_require__(111);

	var _bridge2 = _interopRequireDefault(_bridge);

	var _utils = __webpack_require__(112);

	var _utils2 = _interopRequireDefault(_utils);

	var _EventEmitter = __webpack_require__(124);

	var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

	var _configFlags = __webpack_require__(137);

	var _configFlags2 = _interopRequireDefault(_configFlags);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createVideo(videoId, t) {
	    var self = this,
	        videoObj = new VideoControl(videoId, t);
	    videoObj._getAppStatus = function () {
	        return self.appStatus;
	    };
	    videoObj._getHanged = function () {
	        return self.hanged;
	    };
	    this.onAppEnterBackground(function () {
	        videoObj.pause();
	    });
	    return videoObj;
	}

	var notIOS = "ios" !== _utils2.default.getPlatform(),
	    videoPlayerIds = {},
	    EventEmitter = new _EventEmitter2.default.EventEmitter2();

	ServiceJSBridge.subscribe("videoPlayerInsert", function (params, t) {
	    var domId = params.domId,
	        videoPlayerId = params.videoPlayerId;
	    videoPlayerIds[domId] = videoPlayerIds[domId] || videoPlayerId;
	    EventEmitter.emit("videoPlayerInsert", domId);
	});

	ServiceJSBridge.subscribe("videoPlayerRemoved", function (params, t) {
	    var domId = params.domId;
	    params.videoPlayerId;
	    delete videoPlayerIds[domId];
	});

	var VideoControl = function () {
	    function VideoControl(videoId) {
	        (0, _classCallCheck3.default)(this, VideoControl);

	        if ("string" != typeof videoId) throw new Error("video ID should be a String");
	        this.domId = videoId;
	    }

	    (0, _createClass3.default)(VideoControl, [{
	        key: 'play',
	        value: function play() {
	            var appStatus = this._getAppStatus();
	            appStatus === _configFlags2.default.AppStatus.BACK_GROUND || appStatus === _configFlags2.default.AppStatus.LOCK || this._invokeMethod("play");
	        }
	    }, {
	        key: 'pause',
	        value: function pause() {
	            this._invokeMethod("pause");
	        }
	    }, {
	        key: 'seek',
	        value: function seek(e) {
	            this._invokeMethod("seek", [e]);
	        }
	    }, {
	        key: 'sendDanmu',
	        value: function sendDanmu(params) {
	            var text = params.text,
	                color = params.color;
	            this._invokeMethod("sendDanmu", [text, color]);
	        }
	    }, {
	        key: '_invokeMethod',
	        value: function _invokeMethod(type, data) {
	            function invoke() {
	                notIOS ? (this.action = { method: type, data: data }, this._sendAction()) : _bridge2.default.invokeMethod("operateVideoPlayer", {
	                    data: data,
	                    videoPlayerId: videoPlayerIds[this.domId],
	                    type: type
	                });
	            }

	            var self = this;
	            "number" == typeof videoPlayerIds[this.domId] ? invoke.apply(this) : EventEmitter.on("videoPlayerInsert", function (e) {
	                invoke.apply(self);
	            });
	        }
	    }, {
	        key: '_sendAction',
	        value: function _sendAction() {
	            ServiceJSBridge.publish("video_" + this.domId + "_actionChanged", this.action);
	        }
	    }]);
	    return VideoControl;
	}();

	exports.default = createVideo;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(100);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _bridge = __webpack_require__(111);

	var _bridge2 = _interopRequireDefault(_bridge);

	var _utils = __webpack_require__(112);

	var _utils2 = _interopRequireDefault(_utils);

	var _EventEmitter = __webpack_require__(124);

	var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function notifyWebviewIdtoMap(e) {
	    webviewID = e;
	} //1-8 map相关事件和方法

	var mapIds = {},
	    mapInfo = {},
	    EventEmitter = new _EventEmitter2.default.EventEmitter2(),
	    webviewID = 0,
	    callbackIndex = 0;

	ServiceJSBridge.subscribe("mapInsert", function (params, viewId) {
	    var domId = params.domId,
	        mapId = params.mapId,
	        bindregionchange = params.bindregionchange,
	        bindtap = params.bindtap,
	        showLocation = params.showLocation,
	        key = viewId + "_" + domId;
	    mapIds[key] = mapIds[key] || mapId;

	    mapInfo[viewId + "_" + mapId] = {
	        bindregionchange: bindregionchange,
	        bindtap: bindtap,
	        showLocation: showLocation
	    };
	    EventEmitter.emit("mapInsert");
	});

	var MapContext = function () {
	    function MapContext(mapId) {
	        (0, _classCallCheck3.default)(this, MapContext);

	        var that = this;
	        if ("string" != typeof mapId) throw new Error("map ID should be a String");
	        this.domId = mapId;

	        ServiceJSBridge.subscribe("doMapActionCallback", function (event, t) {
	            var callbackId = event.callbackId;
	            "getMapCenterLocation" === event.method && callbackId && "function" == typeof that[callbackId] && (that[callbackId]({
	                longitude: event.longitude,
	                latitude: event.latitude
	            }), delete that[callbackId]);
	        });
	    }

	    (0, _createClass3.default)(MapContext, [{
	        key: '_invoke',
	        value: function _invoke(methodName, params) {
	            var platform = _utils2.default.getPlatform();
	            if ("ios" === platform || "android" === platform) {
	                var curMapInfo = mapInfo[webviewID + "_" + params.mapId];
	                if ("moveToMapLocation" === methodName) {
	                    return void (curMapInfo && curMapInfo.showLocation ? _bridge2.default.invokeMethod(methodName, params) : console.error("only show-location set to true can invoke moveToLocation"));
	                }
	                _bridge2.default.invokeMethod(methodName, params);
	            } else {
	                params.method = methodName;
	                var callbackId = "callback" + webviewID + "_" + params.mapId + "_" + callbackIndex++;
	                this[callbackId] = params.success;
	                params.callbackId = callbackId;
	                _bridge2.default.publish("doMapAction" + params.mapId, params, [webviewID]);
	            }
	        }
	    }, {
	        key: '_invokeMethod',
	        value: function _invokeMethod(name, params) {
	            var self = this,
	                index = webviewID + "_" + this.domId;
	            "number" == typeof mapIds[index] || mapIds[index] ? (params.mapId = mapIds[index], this._invoke(name, params)) : EventEmitter.on("mapInsert", function () {
	                params.mapId = mapIds[index];
	                self._invoke(name, params);
	            });
	        }
	    }, {
	        key: 'getCenterLocation',
	        value: function getCenterLocation() {
	            var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	            this._invokeMethod("getMapCenterLocation", params);
	        }
	    }, {
	        key: 'moveToLocation',
	        value: function moveToLocation() {
	            var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	            this._invokeMethod("moveToMapLocation", params);
	        }
	    }]);
	    return MapContext;
	}();

	exports.default = {
	    notifyWebviewIdtoMap: notifyWebviewIdtoMap,
	    MapContext: MapContext, //class
	    mapInfo: mapInfo
	};

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(100);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _utils = __webpack_require__(112);

	var _utils2 = _interopRequireDefault(_utils);

	var _canvas = __webpack_require__(141);

	var _canvas2 = _interopRequireDefault(_canvas);

	var _predefinedColor = __webpack_require__(142);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function notifyCurrentRoutetoContext(url) {
	    curUrl = url;
	} // Canvas Context API


	function isNum(e) {
	    return "number" == typeof e;
	}

	function parseColorValue(colorStr) {
	    var matchArr = null;
	    if (null != (matchArr = /^#([0-9|A-F|a-f]{6})$/.exec(colorStr))) {
	        var red = parseInt(matchArr[1].slice(0, 2), 16),
	            green = parseInt(matchArr[1].slice(2, 4), 16),
	            blue = parseInt(matchArr[1].slice(4), 16);
	        return [red, green, blue, 255];
	    }

	    if (null != (matchArr = /^rgb\((.+)\)$/.exec(colorStr))) {
	        return matchArr[1].split(",").map(function (e) {
	            return parseInt(e.trim());
	        }).concat(255);
	    }

	    if (null != (matchArr = /^rgba\((.+)\)$/.exec(colorStr))) {
	        return matchArr[1].split(",").map(function (e, t) {
	            return 3 == t ? Math.floor(255 * parseFloat(e.trim())) : parseInt(e.trim());
	        });
	    }

	    var color = colorStr.toLowerCase();

	    if (_predefinedColor.predefinedColor.hasOwnProperty(color)) {
	        matchArr = /^#([0-9|A-F|a-f]{6})$/.exec(_predefinedColor.predefinedColor[color]);
	        var red = parseInt(matchArr[1].slice(0, 2), 16),
	            green = parseInt(matchArr[1].slice(2, 4), 16),
	            blue = parseInt(matchArr[1].slice(4), 16);
	        return [red, green, blue, 255];
	    }

	    console.group("非法颜色: " + colorStr);
	    console.error("不支持颜色：" + colorStr);
	    console.groupEnd();
	}

	function deepCopy(obj) {
	    //复制对象
	    if (Array.isArray(obj)) {
	        var res = [];
	        obj.forEach(function (e) {
	            res.push(deepCopy(e));
	        });
	        return res;
	    }
	    if ("object" == (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj))) {
	        var res = {};
	        for (var n in obj) {
	            res[n] = deepCopy(obj[n]);
	        }return res;
	    }
	    return obj;
	}

	var transformAndOthersAPI = ["scale", "rotate", "translate", "save", "restore"],
	    drawingAPI = ["drawImage", "fillText", "fill", "stroke", "fillRect", "strokeRect", "clearRect"],
	    drawPathAPI = ["beginPath", "moveTo", "lineTo", "rect", "arc", "quadraticCurveTo", "bezierCurveTo", "closePath"],
	    styleAPI = ["setFillStyle", "setStrokeStyle", "setGlobalAlpha", "setShadow", "setFontSize", "setLineCap", "setLineJoin", "setLineWidth", "setMiterLimit"],
	    curUrl = "";

	var ColorStop = function () {
	    function ColorStop(type, data) {
	        (0, _classCallCheck3.default)(this, ColorStop);

	        this.type = type;
	        this.data = data;
	        this.colorStop = [];
	    }

	    (0, _createClass3.default)(ColorStop, [{
	        key: 'addColorStop',
	        value: function addColorStop(e, t) {
	            this.colorStop.push([e, parseColorValue(t)]);
	        }
	    }]);
	    return ColorStop;
	}();

	var Context = function () {
	    function Context(t) {
	        (0, _classCallCheck3.default)(this, Context);

	        this.actions = [];
	        this.path = [];
	        this.canvasId = t;
	    }

	    (0, _createClass3.default)(Context, [{
	        key: 'getActions',
	        value: function getActions() {
	            var actions = deepCopy(this.actions);
	            this.actions = [];
	            this.path = [];
	            return actions;
	        }
	    }, {
	        key: 'clearActions',
	        value: function clearActions() {
	            this.actions = [];
	            this.path = [];
	        }
	    }, {
	        key: 'draw',
	        value: function draw() {
	            var reserve = arguments.length > 0 && void 0 !== arguments[0] && arguments[0],
	                canvasId = this.canvasId,
	                actions = deepCopy(this.actions);
	            this.actions = [];
	            this.path = [];
	            _canvas2.default.drawCanvas({
	                canvasId: canvasId,
	                actions: actions,
	                reserve: reserve
	            });
	        }
	    }, {
	        key: 'createLinearGradient',
	        value: function createLinearGradient(e, t, n, o) {
	            return new ColorStop("linear", [e, t, n, o]);
	        }
	    }, {
	        key: 'createCircularGradient',
	        value: function createCircularGradient(e, t, n) {
	            return new ColorStop("radial", [e, t, n]);
	        }
	    }]);
	    return Context;
	}();

	[].concat(transformAndOthersAPI, drawingAPI).forEach(function (apiName) {
	    "fill" == apiName || "stroke" == apiName ? Context.prototype[apiName] = function () {
	        this.actions.push({
	            method: apiName + "Path",
	            data: deepCopy(this.path)
	        });
	    } : "fillRect" === apiName ? Context.prototype[apiName] = function (e, t, n, o) {
	        this.actions.push({
	            method: "fillPath",
	            data: [{
	                method: "rect",
	                data: [e, t, n, o]
	            }]
	        });
	    } : "strokeRect" === apiName ? Context.prototype[apiName] = function (e, t, n, o) {
	        this.actions.push({
	            method: "strokePath",
	            data: [{
	                method: "rect",
	                data: [e, t, n, o]
	            }]
	        });
	    } : "fillText" == apiName ? Context.prototype[apiName] = function (t, n, o) {
	        this.actions.push({
	            method: apiName,
	            data: [t.toString(), n, o]
	        });
	    } : "drawImage" == apiName ? Context.prototype[apiName] = function (t, n, o, r, a) {
	        //"devtools" == utils.getPlatform() || /wdfile:\/\//.test(t) || (t = utils.getRealRoute(curUrl, t).replace(/.html$/, "")),
	        isNum(r) && isNum(a) ? data = [t, n, o, r, a] : data = [t, n, o], this.actions.push({
	            method: apiName,
	            data: data
	        });
	    } : Context.prototype[apiName] = function () {
	        this.actions.push({
	            method: apiName,
	            data: [].slice.apply(arguments)
	        });
	    };
	});
	drawPathAPI.forEach(function (apiName) {
	    "beginPath" == apiName ? Context.prototype[apiName] = function () {
	        this.path = [];
	    } : "lineTo" == apiName ? Context.prototype.lineTo = function () {
	        0 == this.path.length ? this.path.push({
	            method: "moveTo",
	            data: [].slice.apply(arguments)
	        }) : this.path.push({
	            method: "lineTo",
	            data: [].slice.apply(arguments)
	        });
	    } : Context.prototype[apiName] = function () {
	        this.path.push({
	            method: apiName,
	            data: [].slice.apply(arguments)
	        });
	    };
	});
	styleAPI.forEach(function (apiName) {
	    "setFillStyle" == apiName || "setStrokeStyle" == apiName ? Context.prototype[apiName] = function () {
	        var params = arguments[0];
	        "string" == typeof params ? this.actions.push({
	            method: apiName,
	            data: ["normal", parseColorValue(params)]
	        }) : "object" == (typeof params === 'undefined' ? 'undefined' : (0, _typeof3.default)(params)) && params instanceof ColorStop && this.actions.push({
	            method: apiName,
	            data: [params.type, params.data, params.colorStop]
	        });
	    } : "setGlobalAlpha" === apiName ? Context.prototype[apiName] = function () {
	        var data = [].slice.apply(arguments, [0, 1]);
	        data[0] = Math.floor(255 * parseFloat(data[0]));
	        this.actions.push({
	            method: apiName,
	            data: data
	        });
	    } : "setShadow" == apiName ? Context.prototype[apiName] = function () {
	        var data = [].slice.apply(arguments, [0, 4]);
	        data[3] = parseColorValue(data[3]);
	        this.actions.push({
	            method: apiName,
	            data: data
	        });
	    } : Context.prototype[apiName] = function () {
	        this.actions.push({
	            method: apiName,
	            data: [].slice.apply(arguments, [0, 1])
	        });
	    };
	});

	exports.default = {
	    notifyCurrentRoutetoContext: notifyCurrentRoutetoContext,
	    Context: Context
	};

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _bridge = __webpack_require__(111);

	var _bridge2 = _interopRequireDefault(_bridge);

	var _context = __webpack_require__(140);

	var _context2 = _interopRequireDefault(_context);

	var _utils = __webpack_require__(112);

	var _utils2 = _interopRequireDefault(_utils);

	var _EventEmitter = __webpack_require__(124);

	var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function canvasDesString(webviewID, canvasId) {
	    return webviewID + "canvas" + canvasId;
	}

	function clearOldWebviewCanvas() {
	    for (var key in canvasIDs) {
	        if (0 == key.indexOf(webviewID + "canvas")) {
	            canvasIDs[key];
	            delete canvasIDs[key];
	        }
	    }
	}

	function notifyWebviewIdtoCanvas(e) {
	    webviewID = e;
	}

	function invokeDrawCanvas(canvasId, actions) {
	    var reserve = arguments.length > 2 && void 0 !== arguments[2] && arguments[2];
	    /*
	            success = arguments[3],
	            fail = arguments[4],
	            complte = arguments[5],
	            platform = utils.getPlatform();
	        "ios" == platform || "android" == platform ?
	            ServiceJSBridge.invoke("drawCanvas", {
	                canvasId: canvasId,
	                reserve: reserve,
	                actions: actions
	            },
	            function (e) {
	                e.errMsg && /ok/.test(e.errMsg) ?
	                "function" == typeof success && success(e) :
	                "function" == typeof fail && fail(e)
	                "function" == typeof complte && complte(e)
	            }) :
	    */
	    ServiceJSBridge.publish("canvas" + canvasId + "actionsChanged", { actions: actions, reserve: reserve });
	}

	function drawCanvas(params) {
	    var canvasId = params.canvasId,
	        actions = params.actions,
	        reserve = params.reserve,
	        success = params.success,
	        fail = params.fail,
	        complete = params.complete;
	    if (canvasId && Array.isArray(actions)) {
	        var key = canvasDesString(webviewID, canvasId);
	        if ("number" == typeof canvasIDs[key]) {
	            var canvasId = canvasIDs[key];
	            invokeDrawCanvas(canvasId, actions, reserve, success, fail, complete);
	        } else {
	            canvasOptions[key] = canvasOptions[key] || [];
	            canvasOptions[key] = canvasOptions[key].concat({
	                actions: actions,
	                reserve: reserve,
	                success: success,
	                fail: fail,
	                complete: complete
	            });
	        }
	    }
	}

	function canvasToTempFilePathImpl(obj) {

	    ServiceJSBridge.subscribe("onCanvasToDataUrl_" + obj.canvasId, function (params) {
	        var dataUrl = params.dataUrl;
	        _bridge2.default.invokeMethod("base64ToTempFilePath", _utils2.default.assign({ base64Data: dataUrl }, obj), {
	            beforeAll: function beforeAll(res) {
	                res.errMsg = res.errMsg.replace("base64ToTempFilePath", "canvasToTempFilePath");
	            }
	        });
	    }), _bridge2.default.publish("invokeCanvasToDataUrl_" + obj.canvasId, { canvasId: obj.canvasId });
	}

	function canvasToTempFilePath(obj) {
	    if (obj.canvasId) {
	        var key = canvasDesString(webviewID, obj.canvasId);
	        if ("number" == typeof canvasIDs[key]) {
	            obj.canvasId = canvasIDs[key];
	            canvasToTempFilePathImpl(obj);
	        } else {
	            var res = {
	                errMsg: "canvasToTempFilePath: fail canvas is empty"
	            };
	            "function" == typeof obj.fail && obj.fail(res), "function" == typeof obj.complete && obj.complete(res);
	        }
	    }
	}

	var webviewID = (new _EventEmitter2.default.EventEmitter2(), 0),
	    canvasInfo = {},
	    canvasIDs = {},
	    canvasOptions = {};

	ServiceJSBridge.subscribe("canvasInsert", function (event, t) {
	    var canvasId = event.canvasId,
	        canvasNumber = event.canvasNumber,
	        data = event.data,
	        key = canvasDesString(webviewID, canvasId);

	    canvasInfo[canvasNumber] = {
	        lastTouches: [],
	        data: data
	    };

	    canvasIDs[key] = canvasIDs[key] || canvasNumber;

	    Array.isArray(canvasOptions[key]) && (canvasOptions[key].forEach(function (e) {
	        invokeDrawCanvas(canvasNumber, e.actions, e.reserve, e.success, e.fail, e.complete);
	    }), delete canvasOptions[key]);
	});

	ServiceJSBridge.subscribe("canvasRemove", function (params, t) {
	    var canvasId = params.canvasId,
	        canvasIndex = canvasDesString(webviewID, canvasId);
	    canvasIDs[canvasIndex] && delete canvasIDs[canvasIndex];
	});

	var createContext = function createContext() {
	    return new _context2.default.Context();
	},
	    createCanvasContext = function createCanvasContext(e) {
	    return new _context2.default.Context(e);
	};

	exports.default = {
	    canvasInfo: canvasInfo,
	    clearOldWebviewCanvas: clearOldWebviewCanvas,
	    notifyWebviewIdtoCanvas: notifyWebviewIdtoCanvas,
	    drawCanvas: drawCanvas,
	    canvasToTempFilePath: canvasToTempFilePath,
	    createContext: createContext,
	    createCanvasContext: createCanvasContext
	};

/***/ }),
/* 142 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	// module14 predefinedColor

	var predefinedColor = exports.predefinedColor = {
	    aliceblue: "#f0f8ff",
	    antiquewhite: "#faebd7",
	    aqua: "#00ffff",
	    aquamarine: "#7fffd4",
	    azure: "#f0ffff",
	    beige: "#f5f5dc",
	    bisque: "#ffe4c4",
	    black: "#000000",
	    blanchedalmond: "#ffebcd",
	    blue: "#0000ff",
	    blueviolet: "#8a2be2",
	    brown: "#a52a2a",
	    burlywood: "#deb887",
	    cadetblue: "#5f9ea0",
	    chartreuse: "#7fff00",
	    chocolate: "#d2691e",
	    coral: "#ff7f50",
	    cornflowerblue: "#6495ed",
	    cornsilk: "#fff8dc",
	    crimson: "#dc143c",
	    cyan: "#00ffff",
	    darkblue: "#00008b",
	    darkcyan: "#008b8b",
	    darkgoldenrod: "#b8860b",
	    darkgray: "#a9a9a9",
	    darkgrey: "#a9a9a9",
	    darkgreen: "#006400",
	    darkkhaki: "#bdb76b",
	    darkmagenta: "#8b008b",
	    darkolivegreen: "#556b2f",
	    darkorange: "#ff8c00",
	    darkorchid: "#9932cc",
	    darkred: "#8b0000",
	    darksalmon: "#e9967a",
	    darkseagreen: "#8fbc8f",
	    darkslateblue: "#483d8b",
	    darkslategray: "#2f4f4f",
	    darkslategrey: "#2f4f4f",
	    darkturquoise: "#00ced1",
	    darkviolet: "#9400d3",
	    deeppink: "#ff1493",
	    deepskyblue: "#00bfff",
	    dimgray: "#696969",
	    dimgrey: "#696969",
	    dodgerblue: "#1e90ff",
	    firebrick: "#b22222",
	    floralwhite: "#fffaf0",
	    forestgreen: "#228b22",
	    fuchsia: "#ff00ff",
	    gainsboro: "#dcdcdc",
	    ghostwhite: "#f8f8ff",
	    gold: "#ffd700",
	    goldenrod: "#daa520",
	    gray: "#808080",
	    grey: "#808080",
	    green: "#008000",
	    greenyellow: "#adff2f",
	    honeydew: "#f0fff0",
	    hotpink: "#ff69b4",
	    indianred: "#cd5c5c",
	    indigo: "#4b0082",
	    ivory: "#fffff0",
	    khaki: "#f0e68c",
	    lavender: "#e6e6fa",
	    lavenderblush: "#fff0f5",
	    lawngreen: "#7cfc00",
	    lemonchiffon: "#fffacd",
	    lightblue: "#add8e6",
	    lightcoral: "#f08080",
	    lightcyan: "#e0ffff",
	    lightgoldenrodyellow: "#fafad2",
	    lightgray: "#d3d3d3",
	    lightgrey: "#d3d3d3",
	    lightgreen: "#90ee90",
	    lightpink: "#ffb6c1",
	    lightsalmon: "#ffa07a",
	    lightseagreen: "#20b2aa",
	    lightskyblue: "#87cefa",
	    lightslategray: "#778899",
	    lightslategrey: "#778899",
	    lightsteelblue: "#b0c4de",
	    lightyellow: "#ffffe0",
	    lime: "#00ff00",
	    limegreen: "#32cd32",
	    linen: "#faf0e6",
	    magenta: "#ff00ff",
	    maroon: "#800000",
	    mediumaquamarine: "#66cdaa",
	    mediumblue: "#0000cd",
	    mediumorchid: "#ba55d3",
	    mediumpurple: "#9370db",
	    mediumseagreen: "#3cb371",
	    mediumslateblue: "#7b68ee",
	    mediumspringgreen: "#00fa9a",
	    mediumturquoise: "#48d1cc",
	    mediumvioletred: "#c71585",
	    midnightblue: "#191970",
	    mintcream: "#f5fffa",
	    mistyrose: "#ffe4e1",
	    moccasin: "#ffe4b5",
	    navajowhite: "#ffdead",
	    navy: "#000080",
	    oldlace: "#fdf5e6",
	    olive: "#808000",
	    olivedrab: "#6b8e23",
	    orange: "#ffa500",
	    orangered: "#ff4500",
	    orchid: "#da70d6",
	    palegoldenrod: "#eee8aa",
	    palegreen: "#98fb98",
	    paleturquoise: "#afeeee",
	    palevioletred: "#db7093",
	    papayawhip: "#ffefd5",
	    peachpuff: "#ffdab9",
	    peru: "#cd853f",
	    pink: "#ffc0cb",
	    plum: "#dda0dd",
	    powderblue: "#b0e0e6",
	    purple: "#800080",
	    rebeccapurple: "#663399",
	    red: "#ff0000",
	    rosybrown: "#bc8f8f",
	    royalblue: "#4169e1",
	    saddlebrown: "#8b4513",
	    salmon: "#fa8072",
	    sandybrown: "#f4a460",
	    seagreen: "#2e8b57",
	    seashell: "#fff5ee",
	    sienna: "#a0522d",
	    silver: "#c0c0c0",
	    skyblue: "#87ceeb",
	    slateblue: "#6a5acd",
	    slategray: "#708090",
	    slategrey: "#708090",
	    snow: "#fffafa",
	    springgreen: "#00ff7f",
	    steelblue: "#4682b4",
	    tan: "#d2b48c",
	    teal: "#008080",
	    thistle: "#d8bfd8",
	    tomato: "#ff6347",
	    turquoise: "#40e0d0",
	    violet: "#ee82ee",
	    wheat: "#f5deb3",
	    white: "#ffffff",
	    whitesmoke: "#f5f5f5",
	    yellow: "#ffff00",
	    yellowgreen: "#9acd32"
	};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _bridge = __webpack_require__(111);

	var _bridge2 = _interopRequireDefault(_bridge);

	var _EventEmitter = __webpack_require__(124);

	var _EventEmitter2 = _interopRequireDefault(_EventEmitter);

	var _configFlags = __webpack_require__(137);

	var _configFlags2 = _interopRequireDefault(_configFlags);

	var _utils = __webpack_require__(112);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	//1-15 绑定AppEnterForeground与AppEnterBackground

	var eventEmitter = new _EventEmitter2.default();
	_bridge2.default.onMethod("onAppEnterForeground", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	  eventEmitter.emit("onAppEnterForeground", params);
	});
	_bridge2.default.onMethod("onAppEnterBackground", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	  eventEmitter.emit("onAppEnterBackground", params);
	});
	_bridge2.default.onMethod("onAppRunningStatusChange", function () {
	  var params = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : {};
	  _utils2.default.defaultRunningStatus = params.status;
	  eventEmitter.emit("onAppRunningStatusChange", params);
	});

	var onAppEnterForeground = function onAppEnterForeground(fn) {
	  var self = this;
	  "function" == typeof fn && setTimeout(fn, 0);
	  eventEmitter.on("onAppEnterForeground", function (params) {
	    _bridge2.default.publish("onAppEnterForeground", params), self.appStatus = _configFlags2.default.AppStatus.FORE_GROUND, "function" == typeof fn && fn(params);
	  });
	};

	var onAppEnterBackground = function onAppEnterBackground(fn) {
	  var self = this;
	  eventEmitter.on("onAppEnterBackground", function (params) {
	    params = params || {};
	    _bridge2.default.publish("onAppEnterBackground", params);
	    "hide" === params.mode ? self.appStatus = _configFlags2.default.AppStatus.LOCK : self.appStatus = _configFlags2.default.AppStatus.BACK_GROUND, "close" === params.mode ? self.hanged = !1 : "hang" === params.mode && (self.hanged = !0), "function" == typeof fn && fn(params);
	  });
	};
	var onAppRunningStatusChange = function onAppRunningStatusChange(fn) {
	  eventEmitter.on("onAppRunningStatusChange", function (params) {
	    "function" == typeof fn && fn(params);
	  });
	};

	exports.default = {
	  onAppEnterForeground: onAppEnterForeground,
	  onAppEnterBackground: onAppEnterBackground,
	  onAppRunningStatusChange: onAppRunningStatusChange
	};

/***/ }),
/* 144 */
/***/ (function(module, exports) {

	"use strict";

	if ("undefined" == typeof navigator) {
	    try {
	        eval("const GeneratorFunction = Object.getPrototypeOf(function *() {}).constructor; const canvas = new GeneratorFunction('', 'console.log(0)'); canvas().__proto__.__proto__.next = () => {};");
	    } catch (e) {}
	}

/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// rewrite Function adn SetTimeout setInterval

	(function (exports) {

	    __webpack_require__(111);
	    /*
	        if ("undefined" != typeof Function) {
	            Function;
	            e = {},
	                Function.constructor = function () {
	                },
	                Function.prototype.constructor = function () {
	                },
	                Function = function () {
	                    if (arguments.length > 0 && "return this" === arguments[arguments.length - 1])
	                        return function () {
	                            return e
	                        }
	                },
	                Object.defineProperty(Function.constructor.__proto__, "apply", {
	                    writable: !1,
	                    configurable: !1,
	                    value: Function.prototype.constructor.apply
	                })
	        }
	    */
	    // "undefined" != typeof eval && (eval = void 0),
	    "undefined" != typeof navigator && !function () {
	        var originalSetTimeOut = setTimeout;
	        window.setTimeout = function (fn, timer) {
	            if ("function" != typeof fn) {
	                throw new TypeError("setTimetout expects a function as first argument but got " + (typeof fn === "undefined" ? "undefined" : (0, _typeof3.default)(fn)) + ".");
	            }
	            var callback = Reporter.surroundThirdByTryCatch(fn, "at setTimeout callback function");
	            return originalSetTimeOut(callback, timer);
	        };
	        var originalSetInterval = setInterval;
	        window.setInterval = function (fn, timer) {
	            if ("function" != typeof fn) {
	                throw new TypeError("setInterval expects a function as first argument but got " + (typeof fn === "undefined" ? "undefined" : (0, _typeof3.default)(fn)) + ".");
	            }
	            Reporter.surroundThirdByTryCatch(fn, "at setInterval callback function");
	            return originalSetInterval(fn, timer);
	        };
	    }();
	}).call(exports, function () {
	    return this;
	}());

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _bridge = __webpack_require__(111);

	var _bridge2 = _interopRequireDefault(_bridge);

	var _utils = __webpack_require__(112);

	var _utils2 = _interopRequireDefault(_utils);

	var _configFlags = __webpack_require__(137);

	var _configFlags2 = _interopRequireDefault(_configFlags);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	"undefined" != typeof __wxConfig__ && __wxConfig__.debug && "devtools" !== _utils2.default.getPlatform() && !function () {
	    var logQueue = [],
	        viewIds = [],
	        consoleMethods = ["log", "warn", "error", "info", "debug"];
	    consoleMethods.forEach(function (key) {
	        var consoleMethod = console[key];
	        console[key] = function () {
	            logQueue.length > _configFlags2.default.LOG_LIMIT && logQueue.shift();
	            var logArr = Array.prototype.slice.call(arguments);

	            logQueue.push({
	                method: key,
	                log: logArr
	            });

	            consoleMethod.apply(console, arguments), viewIds.length > 0 && _bridge2.default.publish(key, { log: logArr }, viewIds);
	        };
	    });
	    _bridge2.default.subscribe("DOMContentLoaded", function (n, viewId) {
	        viewIds.push(viewId);
	        _bridge2.default.publish("initLogs", { logs: logQueue }, [viewId]);
	    });
	}(), "undefined" == typeof console.group && (console.group = function () {}), "undefined" == typeof console.groupEnd && (console.groupEnd = function () {}); //1-11 线上针对debug相关函数做处理

/***/ })
/******/ ]);
var __appServiceEngine__ =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _pageInit = __webpack_require__(39);

	var _pageInit2 = _interopRequireDefault(_pageInit);

	var _initApp = __webpack_require__(110);

	var _initApp2 = _interopRequireDefault(_initApp);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	Object.defineProperty(exports, "Page", {
	    enumerable: true,
	    get: function get() {
	        return _pageInit2.default.pageHolder;
	    }
	});
	Object.defineProperty(exports, "getCurrentPages", {
	    enumerable: true,
	    get: function get() {
	        return _pageInit2.default.getCurrentPages;
	    }
	});
	Object.defineProperty(exports, "App", {
	    enumerable: true,
	    get: function get() {
	        return _initApp2.default.appHolder;
	    }
	});
	Object.defineProperty(exports, "getApp", {
	    enumerable: true,
	    get: function get() {
	        return _initApp2.default.getApp;
	    }
	});

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(2), __esModule: true };

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(3)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 3 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(5), __esModule: true };

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(6);
	module.exports = __webpack_require__(3).Object.keys;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(7)
	  , $keys    = __webpack_require__(9);

	__webpack_require__(24)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(8);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 8 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(10)
	  , enumBugKeys = __webpack_require__(23);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(11)
	  , toIObject    = __webpack_require__(12)
	  , arrayIndexOf = __webpack_require__(15)(false)
	  , IE_PROTO     = __webpack_require__(19)('IE_PROTO');

	module.exports = function(object, names){
	  var O      = toIObject(object)
	    , i      = 0
	    , result = []
	    , key;
	  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
	  // Don't enum bug & hidden keys
	  while(names.length > i)if(has(O, key = names[i++])){
	    ~arrayIndexOf(result, key) || result.push(key);
	  }
	  return result;
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(13)
	  , defined = __webpack_require__(8);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(14);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 14 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(12)
	  , toLength  = __webpack_require__(16)
	  , toIndex   = __webpack_require__(18);
	module.exports = function(IS_INCLUDES){
	  return function($this, el, fromIndex){
	    var O      = toIObject($this)
	      , length = toLength(O.length)
	      , index  = toIndex(fromIndex, length)
	      , value;
	    // Array#includes uses SameValueZero equality algorithm
	    if(IS_INCLUDES && el != el)while(length > index){
	      value = O[index++];
	      if(value != value)return true;
	    // Array#toIndex ignores holes, Array#includes - not
	    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
	      if(O[index] === el)return IS_INCLUDES || index || 0;
	    } return !IS_INCLUDES && -1;
	  };
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(17)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 17 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(17)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(20)('keys')
	  , uid    = __webpack_require__(22);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(21)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 22 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(25)
	  , core    = __webpack_require__(3)
	  , fails   = __webpack_require__(34);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(21)
	  , core      = __webpack_require__(3)
	  , ctx       = __webpack_require__(26)
	  , hide      = __webpack_require__(28)
	  , PROTOTYPE = 'prototype';

	var $export = function(type, name, source){
	  var IS_FORCED = type & $export.F
	    , IS_GLOBAL = type & $export.G
	    , IS_STATIC = type & $export.S
	    , IS_PROTO  = type & $export.P
	    , IS_BIND   = type & $export.B
	    , IS_WRAP   = type & $export.W
	    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
	    , expProto  = exports[PROTOTYPE]
	    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
	    , key, own, out;
	  if(IS_GLOBAL)source = name;
	  for(key in source){
	    // contains in native
	    own = !IS_FORCED && target && target[key] !== undefined;
	    if(own && key in exports)continue;
	    // export native or passed
	    out = own ? target[key] : source[key];
	    // prevent global pollution for namespaces
	    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
	    // bind timers to global for call from export context
	    : IS_BIND && own ? ctx(out, global)
	    // wrap global constructors for prevent change them in library
	    : IS_WRAP && target[key] == out ? (function(C){
	      var F = function(a, b, c){
	        if(this instanceof C){
	          switch(arguments.length){
	            case 0: return new C;
	            case 1: return new C(a);
	            case 2: return new C(a, b);
	          } return new C(a, b, c);
	        } return C.apply(this, arguments);
	      };
	      F[PROTOTYPE] = C[PROTOTYPE];
	      return F;
	    // make static versions for prototype methods
	    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
	    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
	    if(IS_PROTO){
	      (exports.virtual || (exports.virtual = {}))[key] = out;
	      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
	      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
	    }
	  }
	};
	// type bitmap
	$export.F = 1;   // forced
	$export.G = 2;   // global
	$export.S = 4;   // static
	$export.P = 8;   // proto
	$export.B = 16;  // bind
	$export.W = 32;  // wrap
	$export.U = 64;  // safe
	$export.R = 128; // real proto method for `library` 
	module.exports = $export;

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(27);
	module.exports = function(fn, that, length){
	  aFunction(fn);
	  if(that === undefined)return fn;
	  switch(length){
	    case 1: return function(a){
	      return fn.call(that, a);
	    };
	    case 2: return function(a, b){
	      return fn.call(that, a, b);
	    };
	    case 3: return function(a, b, c){
	      return fn.call(that, a, b, c);
	    };
	  }
	  return function(/* ...args */){
	    return fn.apply(that, arguments);
	  };
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(29)
	  , createDesc = __webpack_require__(37);
	module.exports = __webpack_require__(33) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(30)
	  , IE8_DOM_DEFINE = __webpack_require__(32)
	  , toPrimitive    = __webpack_require__(36)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(33) ? Object.defineProperty : function defineProperty(O, P, Attributes){
	  anObject(O);
	  P = toPrimitive(P, true);
	  anObject(Attributes);
	  if(IE8_DOM_DEFINE)try {
	    return dP(O, P, Attributes);
	  } catch(e){ /* empty */ }
	  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
	  if('value' in Attributes)O[P] = Attributes.value;
	  return O;
	};

/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(31);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(33) && !__webpack_require__(34)(function(){
	  return Object.defineProperty(__webpack_require__(35)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(34)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(31)
	  , document = __webpack_require__(21).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(31);
	// instead of the ES6 spec version, we didn't implement @@toPrimitive case
	// and the second argument - flag - preferred type is a string
	module.exports = function(it, S){
	  if(!isObject(it))return it;
	  var fn, val;
	  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
	  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
	  throw TypeError("Can't convert object to primitive value");
	};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	module.exports = function(bitmap, value){
	  return {
	    enumerable  : !(bitmap & 1),
	    configurable: !(bitmap & 2),
	    writable    : !(bitmap & 4),
	    value       : value
	  };
	};

/***/ }),
/* 38 */,
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _utils = __webpack_require__(77);

	var _utils2 = _interopRequireDefault(_utils);

	var _parsePage = __webpack_require__(99);

	var _parsePage2 = _interopRequireDefault(_parsePage);

	var _constants = __webpack_require__(108);

	var eventDefine = _interopRequireWildcard(_constants);

	var _logReport = __webpack_require__(109);

	var reportRealtimeAction = _interopRequireWildcard(_logReport);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var getRouteToPage;
	var getWebviewIdToPage;
	var setWxRouteBegin;
	var setWxRoute;
	var setWxConfig;
	var reset;
	var pageHolder;
	var getCurrentPages;
	var getCurrentPage;

	var pageStack = [];
	var tabBars = []; //tab栏url列表
	var currentPage;
	__wxConfig__.tabBar && __wxConfig__.tabBar.list && "object" === (0, _typeof3.default)(__wxConfig__.tabBar.list) && "function" == typeof __wxConfig__.tabBar.list.forEach && __wxConfig__.tabBar.list.forEach(function (item) {
	    tabBars.push(item.pagePath);
	});

	var app = {
	    appRouteTime: 0,
	    newPageTime: 0,
	    pageReadyTime: 0
	};

	var speedReport = function speedReport(key, startTime, endTime) {
	    Reporter.speedReport({
	        key: key,
	        timeMark: {
	            startTime: startTime,
	            endTime: endTime
	        }
	    });
	};

	var pageStackObjs = {};
	var pageRegObjs = {}; //key:pathname
	var pageIndex = 0;

	getCurrentPage = function getCurrentPage() {
	    return currentPage;
	};
	getCurrentPages = function getCurrentPages() {
	    var pageArr = [];
	    pageStack.forEach(function (pageObj) {
	        pageArr.push(pageObj.page);
	    });
	    return pageArr;
	};
	pageHolder = function pageHolder(pageObj) {
	    //Page 接口
	    if (!__wxRouteBegin) {
	        throw _utils2.default.error("Page 注册错误", "Please do not register multiple Pages in " + __wxRoute + ".js");
	        new _utils2.default.AppServiceEngineKnownError("Please do not register multiple Pages in " + __wxRoute + ".js");
	    }

	    __wxRouteBegin = !1;
	    var pages = __wxConfig__.pages,
	        pagePath = pages[pageIndex];
	    pageIndex++;
	    if ("Object" !== _utils2.default.getDataType(pageObj)) {
	        throw _utils2.default.error("Page 注册错误", "Options is not object: " + (0, _stringify2.default)(pageObj) + " in " + __wxRoute + ".js");
	        new _utils2.default.AppServiceEngineKnownError("Options is not object: " + (0, _stringify2.default)(pageObj) + " in " + __wxRoute + ".js");
	    }
	    _utils2.default.info("Register Page: " + pagePath);
	    pageRegObjs[pagePath] = pageObj;
	};
	var pageInitData = _utils2.default.surroundByTryCatch(function (pageObj, webviewId) {
	    _utils2.default.info("Update view with init data");
	    var ext = {};
	    ext.webviewId = webviewId, ext.enablePullUpRefresh = pageObj.hasOwnProperty("onReachBottom");
	    var params = {
	        data: {
	            data: pageObj.data,
	            ext: ext,
	            options: {
	                firstRender: !0
	            }
	        }
	    };
	    _utils2.default.publish("appDataChange", params, [webviewId]);
	    reportRealtimeAction.triggerAnalytics("pageReady", pageObj);
	});
	var pageParse = function pageParse(routePath, webviewId, params) {
	    //解析page e:pagepath t:webviewId params:
	    var curPageObj = undefined;
	    if (pageRegObjs.hasOwnProperty(routePath)) {
	        curPageObj = pageRegObjs[routePath];
	    } else {
	        _utils2.default.warn("Page route 错误", "Page[" + routePath + "] not found. May be caused by: 1. Forgot to add page route in app.json. 2. Invoking Page() in async task.");
	        curPageObj = {};
	    }
	    app.newPageTime = Date.now();
	    var page = new _parsePage2.default(curPageObj, webviewId, routePath);
	    pageInitData(page, webviewId);
	    if (_utils2.default.isDevTools()) {
	        __wxAppData[routePath] = page.data;
	        __wxAppData[routePath].__webviewId__ = webviewId;
	        _utils2.default.publish(eventDefine.UPDATE_APP_DATA);
	    }
	    currentPage = {
	        page: page,
	        webviewId: webviewId,
	        route: routePath
	    };
	    pageStack.push(currentPage);
	    page.onLoad(params);
	    page.onShow();
	    pageStackObjs[webviewId] = {
	        page: page,
	        route: routePath
	    };
	    reportRealtimeAction.triggerAnalytics("enterPage", page);
	    speedReport("appRoute2newPage", app.appRouteTime, app.newPageTime);
	};

	var pageHide = function pageHide(pageItem) {
	    //执行page hide event
	    pageItem.page.onHide();
	    reportRealtimeAction.triggerAnalytics("leavePage", pageItem.page);
	};

	var pageUnload = function pageUnload(pageItem) {
	    //do page unload
	    pageItem.page.onUnload();
	    _utils2.default.isDevTools() && (delete __wxAppData[pageItem.route], _utils2.default.publish(eventDefine.UPDATE_APP_DATA));
	    delete pageStackObjs[pageItem.webviewId];
	    pageStack = pageStack.slice(0, pageStack.length - 1);
	    reportRealtimeAction.triggerAnalytics("leavePage", pageItem.page);
	};

	var isTabBarsPage = function isTabBarsPage(pageItem) {
	    //
	    return tabBars.indexOf(pageItem.route) !== -1 || tabBars.indexOf(pageItem.route + ".html") !== -1;
	};

	var skipPage = function skipPage(routePath, pWebViewId, pageParams, pApiKey) {
	    //打开、跳转页面
	    _utils2.default.info("On app route: " + routePath);
	    app.appRouteTime = Date.now();
	    if ("navigateTo" === pApiKey) {
	        currentPage && pageHide(currentPage);
	        pageStackObjs.hasOwnProperty(pWebViewId) ? _utils2.default.error("Page route 错误(system error)", "navigateTo with an already exist webviewId " + pWebViewId) : pageParse(routePath, pWebViewId, pageParams);
	    } else if ("redirectTo" === pApiKey) {
	        currentPage && pageUnload(currentPage);
	        pageStackObjs.hasOwnProperty(pWebViewId) ? _utils2.default.error("Page route 错误(system error)", "redirectTo with an already exist webviewId " + pWebViewId) : pageParse(routePath, pWebViewId, pageParams);
	    } else if ("navigateBack" === pApiKey) {
	        for (var isExist = !1, i = pageStack.length - 1; i >= 0; i--) {
	            var pageItem = pageStack[i];
	            if (pageItem.webviewId === pWebViewId) {
	                isExist = !0;
	                currentPage = pageItem;
	                pageItem.page.onShow();
	                reportRealtimeAction.triggerAnalytics("enterPage", pageItem);
	                break;
	            }
	            pageUnload(pageItem);
	        }
	        isExist || _utils2.default.error("Page route 错误(system error)", "navigateBack with an unexist webviewId " + pWebViewId);
	    } else if ("reLaunch" === pApiKey) {
	        currentPage && pageUnload(currentPage);
	        pageStackObjs.hasOwnProperty(pWebViewId) ? _utils2.default.error("Page route 错误(system error)", "redirectTo with an already exist webviewId " + pWebViewId) : pageParse(routePath, pWebViewId, pageParams);
	    } else if ("switchTab" === pApiKey) {
	        for (var onlyOnePage = !0; pageStack.length > 1;) {
	            pageUnload(pageStack[pageStack.length - 1]);
	            onlyOnePage = !1;
	        }
	        if (pageStack[0].webviewId === pWebViewId) {
	            currentPage = pageStack[0];
	            onlyOnePage || currentPage.page.onShow();
	        } else if (isTabBarsPage(pageStack[0]) ? onlyOnePage && pageHide(pageStack[0]) : pageUnload(pageStack[0]), pageStackObjs.hasOwnProperty(pWebViewId)) {
	            var pageObj = pageStackObjs[pWebViewId].page;
	            currentPage = {
	                webviewId: pWebViewId,
	                route: routePath,
	                page: pageObj
	            };
	            pageStack = [currentPage];
	            pageObj.onShow();
	            reportRealtimeAction.triggerAnalytics("enterPage", pageObj);
	        } else {
	            pageStack = [];
	            pageParse(routePath, pWebViewId, pageParams);
	        }
	    } else {
	        "appLaunch" === pApiKey ? pageStackObjs.hasOwnProperty(pWebViewId) ? _utils2.default.error("Page route 错误(system error)", "appLaunch with an already exist webviewId " + pWebViewId) : pageParse(routePath, pWebViewId, pageParams) : _utils2.default.error("Page route 错误(system error)", "Illegal open type: " + pApiKey);
	    }
	};

	var doWebviewEvent = function doWebviewEvent(pWebviewId, pEvent, params) {
	    //do dom ready
	    if (!pageStackObjs.hasOwnProperty(pWebviewId)) {
	        return _utils2.default.warn("事件警告", "OnWebviewEvent: " + pEvent + ", WebviewId: " + pWebviewId + " not found");
	    }
	    var pageItem = pageStackObjs[pWebviewId],
	        pageObj = pageItem.page;
	    return pEvent === eventDefine.DOM_READY_EVENT ? (app.pageReadyTime = Date.now(), _utils2.default.info("Invoke event onReady in page: " + pageItem.route), pageObj.onReady(), void speedReport("newPage2pageReady", app.newPageTime, app.pageReadyTime)) : (_utils2.default.info("Invoke event " + pEvent + " in page: " + pageItem.route), pageObj.hasOwnProperty(pEvent) ? _utils2.default.safeInvoke.call(pageObj, pEvent, params) : _utils2.default.warn("事件警告", "Do not have " + pEvent + " handler in current page: " + pageItem.route + ". Please make sure that " + pEvent + " handler has been defined in " + pageItem.route + ", or " + pageItem.route + " has been added into app.json"));
	};

	var pullDownRefresh = function pullDownRefresh(pWebviewId) {
	    //do pulldownrefresh
	    pageStackObjs.hasOwnProperty(pWebviewId) || _utils2.default.warn("事件警告", "onPullDownRefresh WebviewId: " + pWebviewId + " not found");
	    var pageItem = pageStackObjs[pWebviewId],
	        pageObj = pageItem.page;
	    if (pageObj.hasOwnProperty("onPullDownRefresh")) {
	        _utils2.default.info("Invoke event onPullDownRefresh in page: " + pageItem.route);
	        _utils2.default.safeInvoke.call(pageObj, "onPullDownRefresh");
	        reportRealtimeAction.triggerAnalytics("pullDownRefresh", pageObj);
	    }
	};

	var invokeShareAppMessage = function invokeShareAppMessage(params, pWebviewId) {
	    //invoke event onShareAppMessage
	    var shareParams = params,
	        pageItem = pageStackObjs[pWebviewId],
	        pageObj = pageItem.page,
	        eventName = "onShareAppMessage";
	    if (pageObj.hasOwnProperty(eventName)) {
	        _utils2.default.info("Invoke event onShareAppMessage in page: " + pageItem.route);
	        var shareObj = _utils2.default.safeInvoke.call(pageObj, eventName) || {};
	        shareParams.title = shareObj.title || params.title;
	        shareParams.desc = shareObj.desc || params.desc;
	        shareParams.path = shareObj.path ? _utils2.default.addHtmlSuffixToUrl(shareObj.path) : params.path;
	        shareParams.path.length > 0 && "/" === shareParams.path[0] && (shareParams.path = shareParams.path.substr(1));
	        shareParams.success = shareObj.success;
	        shareParams.cancel = shareObj.cancel;
	        shareParams.fail = shareObj.fail;
	        shareParams.complete = shareObj.complete;
	    }
	    return shareParams;
	};
	wd.onAppRoute(_utils2.default.surroundByTryCatch(function (params) {
	    var path = params.path,
	        webviewId = params.webviewId,
	        query = params.query || {},
	        openType = params.openType;
	    skipPage(path, webviewId, query, openType);
	}), "onAppRoute");

	wd.onWebviewEvent(_utils2.default.surroundByTryCatch(function (params) {
	    var webviewId = params.webviewId,
	        eventName = params.eventName,
	        data = params.data;
	    return doWebviewEvent(webviewId, eventName, data);
	}, "onWebviewEvent"));

	ServiceJSBridge.on("onPullDownRefresh", _utils2.default.surroundByTryCatch(function (e, pWebViewId) {
	    pullDownRefresh(pWebViewId);
	}, "onPullDownRefresh"));

	var shareAppMessage = function shareAppMessage(params, webviewId) {
	    var shareInfo = invokeShareAppMessage(params, webviewId);
	    ServiceJSBridge.invoke("shareAppMessage", shareInfo, function (res) {
	        / ^shareAppMessage: ok /.test(res.errMsg) && "function" == typeof shareInfo.success ? shareInfo.success(res) : /^shareAppMessage:cancel/.test(res.errMsg) && "function" == typeof shareInfo.cancel ? shareInfo.cancel(res) : /^shareAppMessage:fail/.test(res.errMsg) && "function" == typeof shareInfo.fail && shareInfo.fail(res), //bug?? 原代码：shareInfo.fail && shareInfo.cancel(res)
	        "function" == typeof shareInfo.complete && shareInfo.complete(res);
	    });
	};

	ServiceJSBridge.on("onShareAppMessage", _utils2.default.surroundByTryCatch(shareAppMessage, "onShareAppMessage"));
	reset = function reset() {
	    currentPage = undefined;
	    pageStackObjs = {};
	    pageRegObjs = {};
	    pageStack = [];
	    pageIndex = 0;
	};
	setWxConfig = function setWxConfig(e) {
	    __wxConfig__ = e;
	};
	setWxRoute = function setWxRoute(e) {
	    __wxRoute = e;
	};
	setWxRouteBegin = function setWxRouteBegin(e) {
	    __wxRouteBegin = e;
	};
	getWebviewIdToPage = function getWebviewIdToPage() {
	    return pageStackObjs;
	};
	getRouteToPage = function getRouteToPage() {
	    return pageRegObjs;
	};

	exports.default = {
	    getRouteToPage: getRouteToPage,
	    getWebviewIdToPage: getWebviewIdToPage,
	    setWxRouteBegin: setWxRouteBegin,
	    setWxRoute: setWxRoute,
	    setWxConfig: setWxConfig,
	    reset: reset,
	    pageHolder: pageHolder,
	    getCurrentPages: getCurrentPages,
	    getCurrentPage: getCurrentPage
	};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(41);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(61);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(42), __esModule: true };

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(43);
	__webpack_require__(56);
	module.exports = __webpack_require__(60).f('iterator');

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(44)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(45)(String, 'String', function(iterated){
	  this._t = String(iterated); // target
	  this._i = 0;                // next index
	// 21.1.5.2.1 %StringIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , index = this._i
	    , point;
	  if(index >= O.length)return {value: undefined, done: true};
	  point = $at(O, index);
	  this._i += point.length;
	  return {value: point, done: false};
	});

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(17)
	  , defined   = __webpack_require__(8);
	// true  -> String#at
	// false -> String#codePointAt
	module.exports = function(TO_STRING){
	  return function(that, pos){
	    var s = String(defined(that))
	      , i = toInteger(pos)
	      , l = s.length
	      , a, b;
	    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
	    a = s.charCodeAt(i);
	    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
	      ? TO_STRING ? s.charAt(i) : a
	      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
	  };
	};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(46)
	  , $export        = __webpack_require__(25)
	  , redefine       = __webpack_require__(47)
	  , hide           = __webpack_require__(28)
	  , has            = __webpack_require__(11)
	  , Iterators      = __webpack_require__(48)
	  , $iterCreate    = __webpack_require__(49)
	  , setToStringTag = __webpack_require__(53)
	  , getPrototypeOf = __webpack_require__(55)
	  , ITERATOR       = __webpack_require__(54)('iterator')
	  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
	  , FF_ITERATOR    = '@@iterator'
	  , KEYS           = 'keys'
	  , VALUES         = 'values';

	var returnThis = function(){ return this; };

	module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
	  $iterCreate(Constructor, NAME, next);
	  var getMethod = function(kind){
	    if(!BUGGY && kind in proto)return proto[kind];
	    switch(kind){
	      case KEYS: return function keys(){ return new Constructor(this, kind); };
	      case VALUES: return function values(){ return new Constructor(this, kind); };
	    } return function entries(){ return new Constructor(this, kind); };
	  };
	  var TAG        = NAME + ' Iterator'
	    , DEF_VALUES = DEFAULT == VALUES
	    , VALUES_BUG = false
	    , proto      = Base.prototype
	    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
	    , $default   = $native || getMethod(DEFAULT)
	    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
	    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
	    , methods, key, IteratorPrototype;
	  // Fix native
	  if($anyNative){
	    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
	    if(IteratorPrototype !== Object.prototype){
	      // Set @@toStringTag to native iterators
	      setToStringTag(IteratorPrototype, TAG, true);
	      // fix for some old engines
	      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
	    }
	  }
	  // fix Array#{values, @@iterator}.name in V8 / FF
	  if(DEF_VALUES && $native && $native.name !== VALUES){
	    VALUES_BUG = true;
	    $default = function values(){ return $native.call(this); };
	  }
	  // Define iterator
	  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
	    hide(proto, ITERATOR, $default);
	  }
	  // Plug for library
	  Iterators[NAME] = $default;
	  Iterators[TAG]  = returnThis;
	  if(DEFAULT){
	    methods = {
	      values:  DEF_VALUES ? $default : getMethod(VALUES),
	      keys:    IS_SET     ? $default : getMethod(KEYS),
	      entries: $entries
	    };
	    if(FORCED)for(key in methods){
	      if(!(key in proto))redefine(proto, key, methods[key]);
	    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
	  }
	  return methods;
	};

/***/ }),
/* 46 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(28);

/***/ }),
/* 48 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(50)
	  , descriptor     = __webpack_require__(37)
	  , setToStringTag = __webpack_require__(53)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(28)(IteratorPrototype, __webpack_require__(54)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(30)
	  , dPs         = __webpack_require__(51)
	  , enumBugKeys = __webpack_require__(23)
	  , IE_PROTO    = __webpack_require__(19)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(35)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(52).appendChild(iframe);
	  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
	  // createDict = iframe.contentWindow.Object;
	  // html.removeChild(iframe);
	  iframeDocument = iframe.contentWindow.document;
	  iframeDocument.open();
	  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
	  iframeDocument.close();
	  createDict = iframeDocument.F;
	  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
	  return createDict();
	};

	module.exports = Object.create || function create(O, Properties){
	  var result;
	  if(O !== null){
	    Empty[PROTOTYPE] = anObject(O);
	    result = new Empty;
	    Empty[PROTOTYPE] = null;
	    // add "__proto__" for Object.getPrototypeOf polyfill
	    result[IE_PROTO] = O;
	  } else result = createDict();
	  return Properties === undefined ? result : dPs(result, Properties);
	};


/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(29)
	  , anObject = __webpack_require__(30)
	  , getKeys  = __webpack_require__(9);

	module.exports = __webpack_require__(33) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(21).document && document.documentElement;

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(29).f
	  , has = __webpack_require__(11)
	  , TAG = __webpack_require__(54)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(20)('wks')
	  , uid        = __webpack_require__(22)
	  , Symbol     = __webpack_require__(21).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(11)
	  , toObject    = __webpack_require__(7)
	  , IE_PROTO    = __webpack_require__(19)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(57);
	var global        = __webpack_require__(21)
	  , hide          = __webpack_require__(28)
	  , Iterators     = __webpack_require__(48)
	  , TO_STRING_TAG = __webpack_require__(54)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(58)
	  , step             = __webpack_require__(59)
	  , Iterators        = __webpack_require__(48)
	  , toIObject        = __webpack_require__(12);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(45)(Array, 'Array', function(iterated, kind){
	  this._t = toIObject(iterated); // target
	  this._i = 0;                   // next index
	  this._k = kind;                // kind
	// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
	}, function(){
	  var O     = this._t
	    , kind  = this._k
	    , index = this._i++;
	  if(!O || index >= O.length){
	    this._t = undefined;
	    return step(1);
	  }
	  if(kind == 'keys'  )return step(0, index);
	  if(kind == 'values')return step(0, O[index]);
	  return step(0, [index, O[index]]);
	}, 'values');

	// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
	Iterators.Arguments = Iterators.Array;

	addToUnscopables('keys');
	addToUnscopables('values');
	addToUnscopables('entries');

/***/ }),
/* 58 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 59 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(54);

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(62), __esModule: true };

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	__webpack_require__(74);
	__webpack_require__(75);
	__webpack_require__(76);
	module.exports = __webpack_require__(3).Symbol;

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(21)
	  , has            = __webpack_require__(11)
	  , DESCRIPTORS    = __webpack_require__(33)
	  , $export        = __webpack_require__(25)
	  , redefine       = __webpack_require__(47)
	  , META           = __webpack_require__(64).KEY
	  , $fails         = __webpack_require__(34)
	  , shared         = __webpack_require__(20)
	  , setToStringTag = __webpack_require__(53)
	  , uid            = __webpack_require__(22)
	  , wks            = __webpack_require__(54)
	  , wksExt         = __webpack_require__(60)
	  , wksDefine      = __webpack_require__(65)
	  , keyOf          = __webpack_require__(66)
	  , enumKeys       = __webpack_require__(67)
	  , isArray        = __webpack_require__(70)
	  , anObject       = __webpack_require__(30)
	  , toIObject      = __webpack_require__(12)
	  , toPrimitive    = __webpack_require__(36)
	  , createDesc     = __webpack_require__(37)
	  , _create        = __webpack_require__(50)
	  , gOPNExt        = __webpack_require__(71)
	  , $GOPD          = __webpack_require__(73)
	  , $DP            = __webpack_require__(29)
	  , $keys          = __webpack_require__(9)
	  , gOPD           = $GOPD.f
	  , dP             = $DP.f
	  , gOPN           = gOPNExt.f
	  , $Symbol        = global.Symbol
	  , $JSON          = global.JSON
	  , _stringify     = $JSON && $JSON.stringify
	  , PROTOTYPE      = 'prototype'
	  , HIDDEN         = wks('_hidden')
	  , TO_PRIMITIVE   = wks('toPrimitive')
	  , isEnum         = {}.propertyIsEnumerable
	  , SymbolRegistry = shared('symbol-registry')
	  , AllSymbols     = shared('symbols')
	  , OPSymbols      = shared('op-symbols')
	  , ObjectProto    = Object[PROTOTYPE]
	  , USE_NATIVE     = typeof $Symbol == 'function'
	  , QObject        = global.QObject;
	// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
	var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

	// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
	var setSymbolDesc = DESCRIPTORS && $fails(function(){
	  return _create(dP({}, 'a', {
	    get: function(){ return dP(this, 'a', {value: 7}).a; }
	  })).a != 7;
	}) ? function(it, key, D){
	  var protoDesc = gOPD(ObjectProto, key);
	  if(protoDesc)delete ObjectProto[key];
	  dP(it, key, D);
	  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
	} : dP;

	var wrap = function(tag){
	  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
	  sym._k = tag;
	  return sym;
	};

	var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
	  return typeof it == 'symbol';
	} : function(it){
	  return it instanceof $Symbol;
	};

	var $defineProperty = function defineProperty(it, key, D){
	  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
	  anObject(it);
	  key = toPrimitive(key, true);
	  anObject(D);
	  if(has(AllSymbols, key)){
	    if(!D.enumerable){
	      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
	      it[HIDDEN][key] = true;
	    } else {
	      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
	      D = _create(D, {enumerable: createDesc(0, false)});
	    } return setSymbolDesc(it, key, D);
	  } return dP(it, key, D);
	};
	var $defineProperties = function defineProperties(it, P){
	  anObject(it);
	  var keys = enumKeys(P = toIObject(P))
	    , i    = 0
	    , l = keys.length
	    , key;
	  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
	  return it;
	};
	var $create = function create(it, P){
	  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
	};
	var $propertyIsEnumerable = function propertyIsEnumerable(key){
	  var E = isEnum.call(this, key = toPrimitive(key, true));
	  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
	  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
	};
	var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
	  it  = toIObject(it);
	  key = toPrimitive(key, true);
	  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
	  var D = gOPD(it, key);
	  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
	  return D;
	};
	var $getOwnPropertyNames = function getOwnPropertyNames(it){
	  var names  = gOPN(toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
	  } return result;
	};
	var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
	  var IS_OP  = it === ObjectProto
	    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
	    , result = []
	    , i      = 0
	    , key;
	  while(names.length > i){
	    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
	  } return result;
	};

	// 19.4.1.1 Symbol([description])
	if(!USE_NATIVE){
	  $Symbol = function Symbol(){
	    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
	    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
	    var $set = function(value){
	      if(this === ObjectProto)$set.call(OPSymbols, value);
	      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
	      setSymbolDesc(this, tag, createDesc(1, value));
	    };
	    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
	    return wrap(tag);
	  };
	  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
	    return this._k;
	  });

	  $GOPD.f = $getOwnPropertyDescriptor;
	  $DP.f   = $defineProperty;
	  __webpack_require__(72).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(69).f  = $propertyIsEnumerable;
	  __webpack_require__(68).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(46)){
	    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
	  }

	  wksExt.f = function(name){
	    return wrap(wks(name));
	  }
	}

	$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

	for(var symbols = (
	  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
	  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
	).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

	for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

	$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
	  // 19.4.2.1 Symbol.for(key)
	  'for': function(key){
	    return has(SymbolRegistry, key += '')
	      ? SymbolRegistry[key]
	      : SymbolRegistry[key] = $Symbol(key);
	  },
	  // 19.4.2.5 Symbol.keyFor(sym)
	  keyFor: function keyFor(key){
	    if(isSymbol(key))return keyOf(SymbolRegistry, key);
	    throw TypeError(key + ' is not a symbol!');
	  },
	  useSetter: function(){ setter = true; },
	  useSimple: function(){ setter = false; }
	});

	$export($export.S + $export.F * !USE_NATIVE, 'Object', {
	  // 19.1.2.2 Object.create(O [, Properties])
	  create: $create,
	  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
	  defineProperty: $defineProperty,
	  // 19.1.2.3 Object.defineProperties(O, Properties)
	  defineProperties: $defineProperties,
	  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
	  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
	  // 19.1.2.7 Object.getOwnPropertyNames(O)
	  getOwnPropertyNames: $getOwnPropertyNames,
	  // 19.1.2.8 Object.getOwnPropertySymbols(O)
	  getOwnPropertySymbols: $getOwnPropertySymbols
	});

	// 24.3.2 JSON.stringify(value [, replacer [, space]])
	$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
	  var S = $Symbol();
	  // MS Edge converts symbol values to JSON as {}
	  // WebKit converts symbol values to JSON as null
	  // V8 throws on boxed symbols
	  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
	})), 'JSON', {
	  stringify: function stringify(it){
	    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
	    var args = [it]
	      , i    = 1
	      , replacer, $replacer;
	    while(arguments.length > i)args.push(arguments[i++]);
	    replacer = args[1];
	    if(typeof replacer == 'function')$replacer = replacer;
	    if($replacer || !isArray(replacer))replacer = function(key, value){
	      if($replacer)value = $replacer.call(this, key, value);
	      if(!isSymbol(value))return value;
	    };
	    args[1] = replacer;
	    return _stringify.apply($JSON, args);
	  }
	});

	// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(28)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(22)('meta')
	  , isObject = __webpack_require__(31)
	  , has      = __webpack_require__(11)
	  , setDesc  = __webpack_require__(29).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(34)(function(){
	  return isExtensible(Object.preventExtensions({}));
	});
	var setMeta = function(it){
	  setDesc(it, META, {value: {
	    i: 'O' + ++id, // object ID
	    w: {}          // weak collections IDs
	  }});
	};
	var fastKey = function(it, create){
	  // return primitive with prefix
	  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return 'F';
	    // not necessary to add metadata
	    if(!create)return 'E';
	    // add missing metadata
	    setMeta(it);
	  // return object ID
	  } return it[META].i;
	};
	var getWeak = function(it, create){
	  if(!has(it, META)){
	    // can't set metadata to uncaught frozen object
	    if(!isExtensible(it))return true;
	    // not necessary to add metadata
	    if(!create)return false;
	    // add missing metadata
	    setMeta(it);
	  // return hash weak collections IDs
	  } return it[META].w;
	};
	// add metadata on freeze-family methods calling
	var onFreeze = function(it){
	  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
	  return it;
	};
	var meta = module.exports = {
	  KEY:      META,
	  NEED:     false,
	  fastKey:  fastKey,
	  getWeak:  getWeak,
	  onFreeze: onFreeze
	};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(21)
	  , core           = __webpack_require__(3)
	  , LIBRARY        = __webpack_require__(46)
	  , wksExt         = __webpack_require__(60)
	  , defineProperty = __webpack_require__(29).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(9)
	  , toIObject = __webpack_require__(12);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(9)
	  , gOPS    = __webpack_require__(68)
	  , pIE     = __webpack_require__(69);
	module.exports = function(it){
	  var result     = getKeys(it)
	    , getSymbols = gOPS.f;
	  if(getSymbols){
	    var symbols = getSymbols(it)
	      , isEnum  = pIE.f
	      , i       = 0
	      , key;
	    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
	  } return result;
	};

/***/ }),
/* 68 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 69 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(14);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(12)
	  , gOPN      = __webpack_require__(72).f
	  , toString  = {}.toString;

	var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
	  ? Object.getOwnPropertyNames(window) : [];

	var getWindowNames = function(it){
	  try {
	    return gOPN(it);
	  } catch(e){
	    return windowNames.slice();
	  }
	};

	module.exports.f = function getOwnPropertyNames(it){
	  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
	};


/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(10)
	  , hiddenKeys = __webpack_require__(23).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(69)
	  , createDesc     = __webpack_require__(37)
	  , toIObject      = __webpack_require__(12)
	  , toPrimitive    = __webpack_require__(36)
	  , has            = __webpack_require__(11)
	  , IE8_DOM_DEFINE = __webpack_require__(32)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(33) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 74 */
/***/ (function(module, exports) {

	

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(65)('asyncIterator');

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(65)('observable');

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _extends2 = __webpack_require__(78);

	var _extends3 = _interopRequireDefault(_extends2);

	var _defineProperty = __webpack_require__(83);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	var _getPrototypeOf = __webpack_require__(86);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(90);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(91);

	var _inherits3 = _interopRequireDefault(_inherits2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var isDevTools = function isDevTools() {
	  return true;
	};
	var addHtmlSuffixToUrl = function addHtmlSuffixToUrl(url) {
	  //给url增加.html后缀
	  if ("string" != typeof url) {
	    return url;
	  }
	  var uri = url.split("?")[0],
	      query = url.split("?")[1];
	  uri += ".html";
	  if ("undefined" != typeof query) {
	    return uri + "?" + query;
	  } else {
	    return uri;
	  }
	};
	var removeHtmlSuffixFromUrl = function removeHtmlSuffixFromUrl(url) {
	  //去除url后面的.html
	  if ("string" == typeof url && url.indexOf(".html") === url.length - 4) {
	    return url.substring(0, url.length - 5);
	  } else {
	    return url;
	  }
	};

	var hasOwnProperty = Object.prototype.hasOwnProperty;

	var toString = Object.prototype.toString;

	var AppServiceEngineKnownError = function (_Error) {
	  (0, _inherits3.default)(AppServiceEngineKnownError, _Error);

	  function AppServiceEngineKnownError(e) {
	    (0, _classCallCheck3.default)(this, AppServiceEngineKnownError);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (AppServiceEngineKnownError.__proto__ || (0, _getPrototypeOf2.default)(AppServiceEngineKnownError)).call(this, "APP-SERVICE-Engine:" + e));

	    _this.type = "AppServiceEngineKnownError";
	    return _this;
	  }

	  return AppServiceEngineKnownError;
	}(Error);

	var pageEngine = {
	  getPlatform: function getPlatform() {
	    //get platform
	    return "devtools";
	  },
	  safeInvoke: function safeInvoke() {
	    //do page method
	    var res = void 0,
	        args = Array.prototype.slice.call(arguments),
	        fn = args[0];
	    args = args.slice(1);
	    try {
	      var startTime = Date.now();
	      res = this[fn].apply(this, args);
	      var doTime = Date.now() - startTime;
	      doTime > 1e3 && Reporter.slowReport({
	        key: "pageInvoke",
	        cost: doTime,
	        extend: "at " + this.__route__ + " page " + fn + " function"
	      });
	    } catch (e) {
	      Reporter.thirdErrorReport({
	        error: e,
	        extend: 'at "' + this.__route__ + '" page ' + fn + " function"
	      });
	    }
	    return res;
	  },
	  isEmptyObject: function isEmptyObject(obj) {
	    for (var t in obj) {
	      if (obj.hasOwnProperty(t)) {
	        return false;
	      }
	    }
	    return true;
	  },
	  extend: function extend(target, obj) {
	    for (var keys = (0, _keys2.default)(obj), o = keys.length; o--;) {
	      target[keys[o]] = obj[keys[o]];
	    }
	    return target;
	  },
	  noop: function noop() {},
	  getDataType: function getDataType(param) {
	    return Object.prototype.toString.call(param).split(" ")[1].split("]")[0];
	  },
	  isObject: function isObject(param) {
	    return null !== param && "object" === (typeof param === "undefined" ? "undefined" : (0, _typeof3.default)(param));
	  },
	  hasOwn: function hasOwn(obj, attr) {
	    return hasOwnProperty.call(obj, attr);
	  },
	  def: function def(obj, attr, value, enumerable) {
	    (0, _defineProperty2.default)(obj, attr, {
	      value: value,
	      enumerable: !!enumerable,
	      writable: true,
	      configurable: true
	    });
	  },
	  isPlainObject: function isPlainObject(e) {
	    return toString.call(e) === "[object Object]";
	  },
	  error: function error(title, err) {
	    console.group(new Date() + " " + title);
	    console.error(err);
	    console.groupEnd();
	  },
	  warn: function warn(title, _warn) {
	    console.group(new Date() + " " + title);
	    console.warn(_warn);
	    console.groupEnd();
	  },
	  info: function info(msg) {
	    __wxConfig__ && __wxConfig__.debug && console.info(msg);
	  },
	  surroundByTryCatch: function surroundByTryCatch(fn, extend) {
	    var self = this;
	    return function () {
	      try {
	        return fn.apply(fn, arguments);
	      } catch (e) {
	        self.errorReport(e, extend);
	        return function () {};
	      }
	    };
	  },
	  errorReport: function errorReport(err, extend) {
	    //d
	    if ("[object Error]" === Object.prototype.toString.apply(err)) {
	      if ("AppServiceEngineKnownError" === err.type) {
	        throw err;
	      }
	      Reporter.errorReport({
	        key: "jsEnginScriptError",
	        error: err,
	        extend: extend
	      });
	    }
	  },
	  publish: function publish() {
	    var params = Array.prototype.slice.call(arguments),
	        defaultOpt = {
	      options: {
	        timestamp: Date.now()
	      }
	    };
	    params[1] ? params[1].options = this.extend(params[1].options || {}, defaultOpt.options) : params[1] = defaultOpt;
	    ServiceJSBridge.publish.apply(ServiceJSBridge, params);
	  },
	  AppServiceEngineKnownError: AppServiceEngineKnownError
	};

	// export default Object.assi{},{},pageEngine,htmlSuffix);
	exports.default = (0, _extends3.default)({}, pageEngine, {
	  isDevTools: isDevTools,
	  addHtmlSuffixToUrl: addHtmlSuffixToUrl,
	  removeHtmlSuffixFromUrl: removeHtmlSuffixFromUrl
	});

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _assign = __webpack_require__(79);

	var _assign2 = _interopRequireDefault(_assign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = _assign2.default || function (target) {
	  for (var i = 1; i < arguments.length; i++) {
	    var source = arguments[i];

	    for (var key in source) {
	      if (Object.prototype.hasOwnProperty.call(source, key)) {
	        target[key] = source[key];
	      }
	    }
	  }

	  return target;
	};

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(80), __esModule: true };

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(81);
	module.exports = __webpack_require__(3).Object.assign;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(25);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(82)});

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(9)
	  , gOPS     = __webpack_require__(68)
	  , pIE      = __webpack_require__(69)
	  , toObject = __webpack_require__(7)
	  , IObject  = __webpack_require__(13)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(34)(function(){
	  var A = {}
	    , B = {}
	    , S = Symbol()
	    , K = 'abcdefghijklmnopqrst';
	  A[S] = 7;
	  K.split('').forEach(function(k){ B[k] = k; });
	  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
	}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
	  var T     = toObject(target)
	    , aLen  = arguments.length
	    , index = 1
	    , getSymbols = gOPS.f
	    , isEnum     = pIE.f;
	  while(aLen > index){
	    var S      = IObject(arguments[index++])
	      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
	      , length = keys.length
	      , j      = 0
	      , key;
	    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
	  } return T;
	} : $assign;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(84), __esModule: true };

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(85);
	var $Object = __webpack_require__(3).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(25);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(33), 'Object', {defineProperty: __webpack_require__(29).f});

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(88);
	module.exports = __webpack_require__(3).Object.getPrototypeOf;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(7)
	  , $getPrototypeOf = __webpack_require__(55);

	__webpack_require__(24)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ }),
/* 89 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(92);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(96);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (subClass, superClass) {
	  if (typeof superClass !== "function" && superClass !== null) {
	    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
	  }

	  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
	    constructor: {
	      value: subClass,
	      enumerable: false,
	      writable: true,
	      configurable: true
	    }
	  });
	  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
	};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(93), __esModule: true };

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(94);
	module.exports = __webpack_require__(3).Object.setPrototypeOf;

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(25);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(95).set});

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(31)
	  , anObject = __webpack_require__(30);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(26)(Function.call, __webpack_require__(73).f(Object.prototype, '__proto__').set, 2);
	        set(test, []);
	        buggy = !(test instanceof Array);
	      } catch(e){ buggy = true; }
	      return function setPrototypeOf(O, proto){
	        check(O, proto);
	        if(buggy)O.__proto__ = proto;
	        else set(O, proto);
	        return O;
	      };
	    }({}, false) : undefined),
	  check: check
	};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(97), __esModule: true };

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(98);
	var $Object = __webpack_require__(3).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(25)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(50)});

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(100);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _utils = __webpack_require__(77);

	var _utils2 = _interopRequireDefault(_utils);

	var _parsePath = __webpack_require__(101);

	var parsePath = _interopRequireWildcard(_parsePath);

	var _toAppView = __webpack_require__(102);

	var _toAppView2 = _interopRequireDefault(_toAppView);

	var _iteratorHandle = __webpack_require__(103);

	var _iteratorHandle2 = _interopRequireDefault(_iteratorHandle);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var sysEventKeys = ["onLoad", "onReady", "onShow", "onRouteEnd", "onHide", "onUnload"];
	var isSysAttr = function isSysAttr(key) {
	    //校验e是否为系统事件或属性
	    for (var i = 0; i < sysEventKeys.length; ++i) {
	        if (sysEventKeys[i] === key) {
	            return true;
	        }
	    }
	    return "data" === key;
	};
	var baseAttrs = ["__wxWebviewId__", "__route__"];

	var isBaseAttr = function isBaseAttr(name) {
	    return baseAttrs.indexOf(name) !== -1;
	};

	var parsePage = function () {
	    function parsePage() {
	        (0, _classCallCheck3.default)(this, parsePage);

	        var pageObj = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
	            curPage = this,
	            webviewId = arguments[1],
	            routePath = arguments[2];

	        var pageBaseAttr = {
	            __wxWebviewId__: webviewId,
	            __route__: routePath
	        };
	        baseAttrs.forEach(function (key) {
	            curPage.__defineSetter__(key, function () {
	                _utils2.default.warn("关键字保护", "should not change the protected attribute " + key);
	            });
	            curPage.__defineGetter__(key, function () {
	                return pageBaseAttr[key];
	            });
	        });
	        pageObj.data = pageObj.data || {};
	        _utils2.default.isPlainObject(pageObj.data) || _utils2.default.error("Page data error", "data must be an object, your data is " + (0, _stringify2.default)(pageObj.data));
	        this.data = JSON.parse((0, _stringify2.default)(pageObj.data));
	        sysEventKeys.forEach(function (eventName) {
	            //定义页面事件
	            curPage[eventName] = function () {
	                var eventFun = (pageObj[eventName] || _utils2.default.noop).bind(this),
	                    res;
	                _utils2.default.info(this.__route__ + ": " + eventName + " have been invoked");
	                try {
	                    var startTime = Date.now();
	                    res = eventFun.apply(this, arguments);
	                    var runTime = Date.now() - startTime;
	                    runTime > 1e3 && Reporter.slowReport({
	                        key: "pageInvoke",
	                        cost: runTime,
	                        extend: 'at "' + this.__route__ + '" page lifeCycleMethod ' + eventName + " function"
	                    });
	                } catch (err) {
	                    Reporter.thirdErrorReport({
	                        error: err,
	                        extend: 'at "' + this.__route__ + '" page lifeCycleMethod ' + eventName + " function"
	                    });
	                }
	                return res;
	            }.bind(curPage);
	        });
	        var copyPageObjByKey = function copyPageObjByKey(attrName) {
	            //定义页面其它方法与属性
	            isBaseAttr(attrName) ? _utils2.default.warn("关键字保护", "Page's " + attrName + " is write-protected") : isSysAttr(attrName) || ("Function" === _utils2.default.getDataType(pageObj[attrName]) ? curPage[attrName] = function () {
	                var res;
	                try {
	                    var startTime = Date.now();
	                    res = pageObj[attrName].apply(this, arguments);
	                    var runTime = Date.now() - startTime;
	                    runTime > 1e3 && Reporter.slowReport({
	                        key: "pageInvoke",
	                        cost: runTime,
	                        extend: "at " + this.__route__ + " page " + attrName + " function"
	                    });
	                } catch (err) {
	                    Reporter.thirdErrorReport({
	                        error: err,
	                        extend: 'at "' + this.__route__ + '" page ' + attrName + " function"
	                    });
	                }
	                return res;
	            }.bind(curPage) : curPage[attrName] = (0, _iteratorHandle2.default)(pageObj[attrName]));
	        };
	        for (var key in pageObj) {
	            copyPageObjByKey(key);
	        }
	        "function" == typeof pageObj.onShareAppMessage && ServiceJSBridge.invoke("showShareMenu", {}, _utils2.default.info);
	    }

	    (0, _createClass3.default)(parsePage, [{
	        key: 'update',
	        value: function update() {
	            _utils2.default.warn("将被废弃", "Page.update is deprecated, setData updates the view implicitly. [It will be removed in 2016.11]");
	        }
	    }, {
	        key: 'forceUpdate',
	        value: function forceUpdate() {
	            _utils2.default.warn("将被废弃", "Page.forceUpdate is deprecated, setData updates the view implicitly. [It will be removed in 2016.11]");
	        }
	    }, {
	        key: 'setData',
	        value: function setData(dataObj) {
	            try {
	                var type = _utils2.default.getDataType(dataObj);
	                "Object" !== type && _utils2.default.error("类型错误", "setData accepts an Object rather than some " + type);
	                for (var key in dataObj) {
	                    var curValue = parsePath.getObjectByPath(this.data, key),
	                        curObj = curValue.obj,
	                        curKey = curValue.key;
	                    curObj && (curObj[curKey] = (0, _iteratorHandle2.default)(dataObj[key]));
	                }
	                _toAppView2.default.emit(dataObj, this.__wxWebviewId__);
	            } catch (e) {
	                _utils2.default.errorReport(e);
	            }
	        }
	    }]);
	    return parsePage;
	}();

	exports.default = parsePage;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(83);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function () {
	  function defineProperties(target, props) {
	    for (var i = 0; i < props.length; i++) {
	      var descriptor = props[i];
	      descriptor.enumerable = descriptor.enumerable || false;
	      descriptor.configurable = true;
	      if ("value" in descriptor) descriptor.writable = true;
	      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
	    }
	  }

	  return function (Constructor, protoProps, staticProps) {
	    if (protoProps) defineProperties(Constructor.prototype, protoProps);
	    if (staticProps) defineProperties(Constructor, staticProps);
	    return Constructor;
	  };
	}();

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.parsePath = parsePath;
	exports.getObjectByPath = getObjectByPath;

	var _utils = __webpack_require__(77);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function parsePath(pathStr) {
	    //解析data path
	    for (var length = pathStr.length, paths = [], key = "", arrKey = 0, hasNum = false, arrStartFlag = false, index = 0; index < length; index++) {
	        var curStr = pathStr[index];
	        if ("\\" === curStr) {
	            index + 1 < length && ("." === pathStr[index + 1] || "[" === pathStr[index + 1] || "]" === pathStr[index + 1]) ? (key += pathStr[index + 1], index++) : key += "\\";
	        } else if ("." === curStr) {
	            key && (paths.push(key), key = "");
	        } else if ("[" === curStr) {
	            if (key && (paths.push(key), key = ""), 0 === paths.length) {
	                throw _utils2.default.error("数据路径错误", "Path can not start with []: " + pathStr);
	                new _utils2.default.AppServiceEngineKnownError("Path can not start with []: " + pathStr);
	            }
	            arrStartFlag = true;
	            hasNum = false;
	        } else if ("]" === curStr) {
	            if (!hasNum) {
	                throw _utils2.default.error("数据路径错误", "Must have number in []: " + pathStr);
	                new _utils2.default.AppServiceEngineKnownError("Must have number in []: " + pathStr);
	            }
	            arrStartFlag = false;
	            paths.push(arrKey);
	            arrKey = 0;
	        } else if (arrStartFlag) {
	            if (curStr < "0" || curStr > "9") {
	                throw _utils2.default.error("数据路径错误", "Only number 0-9 could inside []: " + pathStr);
	                new _utils2.default.AppServiceEngineKnownError("Only number 0-9 could inside []: " + pathStr);
	            }
	            hasNum = true;
	            arrKey = 10 * arrKey + curStr.charCodeAt(0) - 48;
	        } else {
	            key += curStr;
	        }
	    }
	    if (key && paths.push(key), 0 === paths.length) {
	        throw _utils2.default.error("数据路径错误", "Path can not be empty");
	        new _utils2.default.AppServiceEngineKnownError("Path can not be empty");
	    }
	    return paths;
	}
	function getObjectByPath(data, pathString) {
	    var paths = parsePath(pathString),
	        obj,
	        curKey,
	        curData = data;
	    for (var index = 0; index < paths.length; index++) {
	        Number(paths[index]) === paths[index] && paths[index] % 1 === 0 ? //isint
	        Array.isArray(curData) || (curData = []) : _utils2.default.isPlainObject(curData) || (curData = {});
	        curKey = paths[index]; //key
	        obj = curData; //parentObj
	        curData = curData[paths[index]]; //node value
	    }
	    return {
	        obj: obj,
	        key: curKey
	    };
	};

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(100);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _utils = __webpack_require__(77);

	var _utils2 = _interopRequireDefault(_utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var toAppView = function () {
	    function toAppView() {
	        (0, _classCallCheck3.default)(this, toAppView);
	    }

	    (0, _createClass3.default)(toAppView, null, [{
	        key: "emit",
	        value: function emit(data, webviewId) {
	            _utils2.default.publish("appDataChange", {
	                data: {
	                    data: data
	                }
	            }, [webviewId]);
	        }
	    }]);
	    return toAppView;
	}();

	exports.default = toAppView;

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _copyUtils = __webpack_require__(104);

	var _copyUtils2 = _interopRequireDefault(_copyUtils);

	var _symbolHandle = __webpack_require__(105);

	var _symbolHandle2 = _interopRequireDefault(_symbolHandle);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function emptyFn(e) {}
	function copyHandle(data) {
	    var method = arguments.length <= 1 || undefined === arguments[1] ? emptyFn : arguments[1];
	    if (null === data) {
	        return null;
	    }
	    var value = _copyUtils2.default.copyValue(data);
	    if (null !== value) {
	        return value;
	    }
	    var coll = _copyUtils2.default.copyCollection(data, method),
	        newAttr = null !== coll ? coll : data,
	        attrArr = [data],
	        newAttrArr = [newAttr];
	    return iteratorHandle(data, method, newAttr, attrArr, newAttrArr);
	}
	function iteratorHandle(data, method, newAttr, attrArr, newAttrArr) {
	    //处理对象循环引用情况
	    if (null === data) {
	        return null;
	    }
	    var value = _copyUtils2.default.copyValue(data);
	    if (null !== value) {
	        return value;
	    }
	    var keys = _symbolHandle2.default.getKeys(data).concat(_symbolHandle2.default.getSymbols(data));
	    var index, length, key, attrValue, attrValueIndex, newAttrValue, curAttrValue, tmpObj;
	    for (index = 0, length = keys.length; index < length; ++index) {
	        key = keys[index];
	        attrValue = data[key];
	        attrValueIndex = _symbolHandle2.default.indexOf(attrArr, attrValue); //确定data的子属性有没引用自身
	        tmpObj = undefined;
	        curAttrValue = undefined;
	        newAttrValue = undefined;
	        attrValueIndex === -1 ? (newAttrValue = _copyUtils2.default.copy(attrValue, method), curAttrValue = null !== newAttrValue ? newAttrValue : attrValue, null !== attrValue && /^(?:function|object)$/.test(typeof attrValue === 'undefined' ? 'undefined' : (0, _typeof3.default)(attrValue)) && (attrArr.push(attrValue), newAttrArr.push(curAttrValue))) : tmpObj = newAttrArr[attrValueIndex];
	        newAttr[key] = tmpObj || iteratorHandle(attrValue, method, curAttrValue, attrArr, newAttrArr);
	    }
	    return newAttr;
	}

	exports.default = copyHandle;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function copy(obj, customizerFn) {
	    var res = copyValue(obj);
	    return null !== res ? res : copyCollection(obj, customizerFn);
	}
	function copyCollection(obj, customizerFn) {
	    if ("function" != typeof customizerFn) {
	        throw new TypeError("customizer is must be a Function");
	    }
	    if ("function" == typeof obj) {
	        return obj;
	    }
	    var typeString = toString.call(obj);
	    if ("[object Array]" === typeString) {
	        return [];
	    }
	    if ("[object Object]" === typeString && obj.constructor === Object) {
	        return {};
	    }
	    if ("[object Date]" === typeString) {
	        return new Date(obj.getTime());
	    }
	    if ("[object RegExp]" === typeString) {
	        var toStr = String(obj),
	            pos = toStr.lastIndexOf("/");
	        return new RegExp(toStr.slice(1, pos), toStr.slice(pos + 1));
	    }
	    var res = customizerFn(obj);
	    return undefined !== res ? res : null;
	}
	function copyValue(param) {
	    var type = typeof param === "undefined" ? "undefined" : (0, _typeof3.default)(param);
	    return null !== param && "object" !== type && "function" !== type ? param : null;
	}
	var toString = Object.prototype.toString;
	exports.default = {
	    copy: copy,
	    copyCollection: copyCollection,
	    copyValue: copyValue
	};

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _getOwnPropertySymbols = __webpack_require__(106);

	var _getOwnPropertySymbols2 = _interopRequireDefault(_getOwnPropertySymbols);

	var _symbol = __webpack_require__(61);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof2 = __webpack_require__(40);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _keys = __webpack_require__(4);

	var _keys2 = _interopRequireDefault(_keys);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function indexOf(arr, element) {
	    if ("[object Array]" !== toString.call(arr)) {
	        throw new TypeError("array must be an Array");
	    }
	    var index = void 0,
	        arrLen = void 0,
	        cur = void 0;
	    for (index = 0, arrLen = arr.length; index < arrLen; ++index) {
	        cur = arr[index];
	        if (cur === element || cur !== cur && element !== element) {
	            return index;
	        }
	    }
	    return -1;
	}

	var toString = Object.prototype.toString;
	var getKeys = "function" == typeof _keys2.default ? function (obj) {
	    return (0, _keys2.default)(obj);
	} : function (obj) {
	    var type = typeof obj === "undefined" ? "undefined" : (0, _typeof3.default)(obj);
	    if (null === obj || "function" !== type && "object" !== type) throw new TypeError("obj must be an Object");
	    var res = [],
	        key;
	    for (key in obj) {
	        Object.prototype.hasOwnProperty.call(obj, key) && res.push(key);
	    }
	    return res;
	};
	var getSymbols = "function" == typeof _symbol2.default ? function (e) {
	    return (0, _getOwnPropertySymbols2.default)(e);
	} : function () {
	    return [];
	};

	exports.default = {
	    getKeys: getKeys,
	    getSymbols: getSymbols,
	    indexOf: indexOf
	};

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(107), __esModule: true };

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(63);
	module.exports = __webpack_require__(3).Object.getOwnPropertySymbols;

/***/ }),
/* 108 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var DOM_READY_EVENT = "__DOMReady";
	var UPDATE_APP_DATA = "__updateAppData";

	exports.DOM_READY_EVENT = DOM_READY_EVENT;
	exports.UPDATE_APP_DATA = UPDATE_APP_DATA;

/***/ }),
/* 109 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	var triggerAnalytics = exports.triggerAnalytics = function triggerAnalytics(eventName, pageObj, desc) {
	    var data = {};
	    if (pageObj) {
	        data.pageRoute = pageObj.__route__;
	    }
	    if (desc) {
	        data.desc = desc;
	    }
	    ServiceJSBridge.publish("H5_LOG_MSG", { event: eventName, desc: data }, [pageObj && pageObj.__wxWebviewId__ || '']);
	};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _classCallCheck2 = __webpack_require__(89);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(100);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _utils = __webpack_require__(77);

	var _utils2 = _interopRequireDefault(_utils);

	var _pageInit = __webpack_require__(39);

	var _pageInit2 = _interopRequireDefault(_pageInit);

	var _logReport = __webpack_require__(109);

	var reportRealtimeAction = _interopRequireWildcard(_logReport);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var events = ["onLaunch", "onShow", "onHide", "onUnlaunch"];

	var firstRender = true;

	var isSysEvent = function isSysEvent(key) {
	    //判断是否为app 事件
	    for (var index = 0; index < events.length; ++index) {
	        if (events[index] === key) {
	            return true;
	        }
	    }
	    return false;
	};
	var isGetCurrentPage = function isGetCurrentPage(key) {
	    return "getCurrentPage" === key;
	};

	var appClass = function () {
	    function appClass(appObj) {
	        (0, _classCallCheck3.default)(this, appClass);
	        //t:app
	        var self = this;
	        events.forEach(function (eventKey) {
	            //给app绑定事件
	            var tempFun = function tempFun() {
	                var eventFun = (appObj[eventKey] || _utils2.default.noop).bind(this);
	                _utils2.default.info("App: " + eventKey + " have been invoked");
	                try {
	                    eventFun.apply(this, arguments);
	                } catch (t) {
	                    Reporter.thirdErrorReport({
	                        error: t,
	                        extend: "App catch error in lifeCycleMethod " + eventKey + " function"
	                    });
	                }
	            };
	            self[eventKey] = tempFun.bind(self);
	        });
	        var bindApp = function bindApp(attrKey) {
	            //给app绑定其它方法与属性
	            isGetCurrentPage(attrKey) ? _utils2.default.warn("关键字保护", "App's " + attrKey + " is write-protected") : isSysEvent(attrKey) || ("[object Function]" === Object.prototype.toString.call(appObj[attrKey]) ? self[attrKey] = function () {
	                var method;
	                try {
	                    method = appObj[attrKey].apply(this, arguments);
	                } catch (t) {
	                    Reporter.thirdErrorReport({
	                        error: t,
	                        extend: "App catch error in  " + attrKey + " function"
	                    });
	                }
	                return method;
	            }.bind(self) : self[attrKey] = appObj[attrKey]);
	        };
	        for (var attrKey in appObj) {
	            bindApp(attrKey);
	        }
	        this.onError && Reporter.registerErrorListener(this.onError);
	        this.onLaunch();
	        reportRealtimeAction.triggerAnalytics("launch", null, '小程序启动');
	        var hide = function hide() {
	            //hide
	            var pages = _pageInit2.default.getCurrentPages();
	            pages.length && pages[pages.length - 1].onHide();
	            this.onHide();
	            reportRealtimeAction.triggerAnalytics("background", null, '小程序转到后台');
	        };
	        var show = function show() {
	            //show
	            this.onShow();
	            if (firstRender) {
	                firstRender = false;
	            } else {
	                var pages = _pageInit2.default.getCurrentPages();
	                pages.length && (pages[pages.length - 1].onShow(), reportRealtimeAction.triggerAnalytics("foreground", null, '小程序转到前台'));
	            }
	        };
	        wd.onAppEnterBackground(hide.bind(this));
	        wd.onAppEnterForeground(show.bind(this));
	    }

	    (0, _createClass3.default)(appClass, [{
	        key: 'getCurrentPage',
	        value: function getCurrentPage() {
	            _utils2.default.warn("将被废弃", "App.getCurrentPage is deprecated, please use getCurrentPages. [It will be removed in 2016.11]");
	            var currentPage = _pageInit2.default.getCurrentPage();
	            if (currentPage) {
	                return currentPage.page;
	            }
	        }
	    }]);
	    return appClass;
	}();

	var tempObj;

	var appHolder = _utils2.default.surroundByTryCatch(function (appObj) {
	    tempObj = new appClass(appObj);
	}, "create app instance");
	var getApp = function getApp() {
	    return tempObj;
	};

	exports.default = { appHolder: appHolder, getApp: getApp };

/***/ })
/******/ ]);
!(function () {
  var statusDefineFlag = 1
  var statusRequireFlag = 2
  var moduleArr = {}

  define = function (path, fun) {
    moduleArr[path] = {
      status: statusDefineFlag,
      factory: fun
    }
  }

  var getPathPrefix = function (pathname) {
    // 返回path
    var res = pathname.match(/(.*)\/([^/]+)?$/)
    return res && res[1] ? res[1] : './'
  }

  var getRequireFun = function (pathname) {
    // e:path 返回相对e的require
    var pathPrefix = getPathPrefix(pathname)
    return function (path) {
      if (typeof path !== 'string') {
        throw new Error('require args must be a string')
      }
      var floderArr = []
      var folders = (pathPrefix + '/' + path).split('/')
      var pathLength = folders.length
      for (var i = 0; i < pathLength; ++i) {
        var folder = folders[i]
        if (folder != '' && folder != '.') {
          if (folder == '..') {
            if (floderArr.length == 0) {
              throw new Error("can't find module : " + path)
            }
            floderArr.pop()
          } else {
            i + 1 < pathLength && folders[i + 1] == '..'
              ? i++
              : floderArr.push(folder)
          }
        }
      }
      try {
        var pathname = floderArr.join('/')
        if (!/\.js$/.test(pathname)) {
          pathname += '.js'
        }
        return require(pathname)
      } catch (e) {
        throw e
      }
    }
  }
  require = function (path) {
    // exports o
    if (typeof path !== 'string') {
      throw new Error('require args must be a string')
    }
    var moduleObj = moduleArr[path]
    if (!moduleObj) throw new Error('module "' + path + '" is not defined')
    if (moduleObj.status === statusDefineFlag) {
      var factoryFun = moduleObj.factory
      var module = {
        exports: {}
      }
      var exports
      if (factoryFun) {
        exports = factoryFun(getRequireFun(path), module, module.exports)
      }

      moduleObj.exports = module.exports || exports
      moduleObj.status = statusRequireFlag
    }
    return moduleObj.exports
  }
})()

wd.version = {
  updateTime: '2017.1.13 16:51:56',
  info: '',
  version: 32
}
window.Page = __appServiceEngine__.Page
window.App = __appServiceEngine__.App
window.getApp = __appServiceEngine__.getApp
window.getCurrentPages = __appServiceEngine__.getCurrentPages
window.__WAServiceEndTime__ = Date.now()
