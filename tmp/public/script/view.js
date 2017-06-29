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

	"use strict";

	var _typeof2 = __webpack_require__(5);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _pullDownRefresh = __webpack_require__(72);

	var _pullDownRefresh2 = _interopRequireDefault(_pullDownRefresh);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	window.__WAWebviewStartTime__ = Date.now();
	var callbacks = {},
	    callbackIndex = 0,
	    defaultEventHandlers = {},
	    eventPrefix = "custom_event_",
	    handlers = {},
	    EXEC_JSSDK = "EXEC_JSSDK",
	    TO_APP_SERVICE = "TO_APP_SERVICE",
	    _id = 0,
	    limitedApi = ['insertShareButton', 'updateShareButton', 'removeShareButton', 'insertContactButton', 'updateContactButton', 'removeContactButton', 'reportKeyValue', 'reportIDKey', 'systemLog'];

	function callSystemCmd(to, msg, command, ext) {
	  //postmessage notice
	  var data = {
	    to: to,
	    msg: msg,
	    command: command,
	    ext: ext
	  };
	  data.comefrom = "webframe";
	  data.webviewID = window.__wxConfig && window.__wxConfig.viewId || 0;
	  data = JSON.parse((0, _stringify2.default)(data));
	  "backgroundjs" === to && (data.__id = _id, _id++);
	  systemBridge.doCommand(data);
	}

	function send(sdkName, args, isOn) {
	  //send notice
	  args = args || {};
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

	  callSystemCmd("backgroundjs", sdk, EXEC_JSSDK, msg);
	}

	var invoke = function invoke(event, args, callback) {
	  if (!args) {
	    args = {};
	  }
	  if (limitedApi.indexOf(event) != -1) {
	    console.log(event);
	    return;
	  } else {
	    /*
	     var callbackId = ++callbackIndex;
	     callbacks[callbackId] = callback;
	     */
	    defaultEventHandlers[event] = callback;
	    if (/^private_/.test(event)) {
	      return;
	    }
	    "disableScrollBounce" === event ? _pullDownRefresh2.default.togglePullDownRefresh(args.disable) : send(event, args);
	  }
	},
	    invokeCallbackHandler = function invokeCallbackHandler(callbackId, params) {
	  //没用了
	  var callback = callbacks[callbackId];
	  "function" == typeof callback && callback(params), delete callbacks[callbackId];
	},
	    publish = function publish(eventName, params, isOn) {
	  eventName = isOn ? eventName : eventPrefix + eventName;
	  var data = {
	    eventName: eventName,
	    data: params
	  };
	  callSystemCmd("backgroundjs", data, TO_APP_SERVICE); //msg com
	},
	    on = function on(eventName, handler) {
	  defaultEventHandlers[eventName] = handler;
	  send(eventName, {}, true);
	},
	    subscribe = function subscribe(eventName, handler) {
	  handlers[eventPrefix + eventName] = handler;
	},
	    subscribeHandler = function subscribeHandler(eventName, data) {
	  //执行注册的回调
	  var handler;
	  handler = eventName.indexOf(eventPrefix) != -1 ? handlers[eventName] : defaultEventHandlers[eventName], "function" == typeof handler && handler(data);
	};

	var uiEvent = document.createEvent("UIEvent");
	uiEvent.initEvent("WeixinJSBridgeReady", !1, !1);
	document.dispatchEvent(uiEvent);
	_pullDownRefresh2.default.register(function () {
	  var msg = {},
	      ext = {};
	  callSystemCmd("backgroundjs", msg, "PULLDOWN_REFRESH", ext);
	});
	window.addEventListener("message", function (event) {
	  //处理地图相关通讯
	  var data = event.data;
	  if (data && "object" === (typeof data === "undefined" ? "undefined" : (0, _typeof3.default)(data)) && ("geolocation" === data.module || "locationPicker" === data.module)) {
	    if ("geolocation" == data.module) {
	      data = {
	        module: "locationPicker",
	        latlng: {
	          lat: data.lat,
	          lng: data.lng
	        },
	        poiaddress: "" + data.province + data.city,
	        poiname: data.addr,
	        cityname: data.city
	      };
	    }
	    if ("locationPicker" == data.module) {
	      systemBridge.doCommand(data);
	    }
	    //alert("map handle:" + JSON.stringify(data))
	  }
	});
	window.WeixinJSBridge = {
	  pullDownRefresh: _pullDownRefresh2.default,
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
/* 4 */,
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(6);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(56);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(7), __esModule: true };

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(8);
	__webpack_require__(51);
	module.exports = __webpack_require__(55).f('iterator');

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(9)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(12)(String, 'String', function(iterated){
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
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(10)
	  , defined   = __webpack_require__(11);
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
/* 10 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 11 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(13)
	  , $export        = __webpack_require__(14)
	  , redefine       = __webpack_require__(28)
	  , hide           = __webpack_require__(18)
	  , has            = __webpack_require__(29)
	  , Iterators      = __webpack_require__(30)
	  , $iterCreate    = __webpack_require__(31)
	  , setToStringTag = __webpack_require__(47)
	  , getPrototypeOf = __webpack_require__(49)
	  , ITERATOR       = __webpack_require__(48)('iterator')
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
/* 13 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(15)
	  , core      = __webpack_require__(3)
	  , ctx       = __webpack_require__(16)
	  , hide      = __webpack_require__(18)
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
/* 15 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(17);
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
/* 17 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(19)
	  , createDesc = __webpack_require__(27);
	module.exports = __webpack_require__(23) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(20)
	  , IE8_DOM_DEFINE = __webpack_require__(22)
	  , toPrimitive    = __webpack_require__(26)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(23) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(21);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(23) && !__webpack_require__(24)(function(){
	  return Object.defineProperty(__webpack_require__(25)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(24)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 24 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(21)
	  , document = __webpack_require__(15).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(21);
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
/* 27 */
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(18);

/***/ }),
/* 29 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 30 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(32)
	  , descriptor     = __webpack_require__(27)
	  , setToStringTag = __webpack_require__(47)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(18)(IteratorPrototype, __webpack_require__(48)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(20)
	  , dPs         = __webpack_require__(33)
	  , enumBugKeys = __webpack_require__(45)
	  , IE_PROTO    = __webpack_require__(42)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(25)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(46).appendChild(iframe);
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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(19)
	  , anObject = __webpack_require__(20)
	  , getKeys  = __webpack_require__(34);

	module.exports = __webpack_require__(23) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(35)
	  , enumBugKeys = __webpack_require__(45);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(29)
	  , toIObject    = __webpack_require__(36)
	  , arrayIndexOf = __webpack_require__(39)(false)
	  , IE_PROTO     = __webpack_require__(42)('IE_PROTO');

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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(37)
	  , defined = __webpack_require__(11);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(38);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 38 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(36)
	  , toLength  = __webpack_require__(40)
	  , toIndex   = __webpack_require__(41);
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
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(10)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(10)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(43)('keys')
	  , uid    = __webpack_require__(44);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(15)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 44 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 45 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15).document && document.documentElement;

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(19).f
	  , has = __webpack_require__(29)
	  , TAG = __webpack_require__(48)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(43)('wks')
	  , uid        = __webpack_require__(44)
	  , Symbol     = __webpack_require__(15).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(29)
	  , toObject    = __webpack_require__(50)
	  , IE_PROTO    = __webpack_require__(42)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(11);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(52);
	var global        = __webpack_require__(15)
	  , hide          = __webpack_require__(18)
	  , Iterators     = __webpack_require__(30)
	  , TO_STRING_TAG = __webpack_require__(48)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(53)
	  , step             = __webpack_require__(54)
	  , Iterators        = __webpack_require__(30)
	  , toIObject        = __webpack_require__(36);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(12)(Array, 'Array', function(iterated, kind){
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
/* 53 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 54 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(48);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(57), __esModule: true };

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(58);
	__webpack_require__(69);
	__webpack_require__(70);
	__webpack_require__(71);
	module.exports = __webpack_require__(3).Symbol;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(15)
	  , has            = __webpack_require__(29)
	  , DESCRIPTORS    = __webpack_require__(23)
	  , $export        = __webpack_require__(14)
	  , redefine       = __webpack_require__(28)
	  , META           = __webpack_require__(59).KEY
	  , $fails         = __webpack_require__(24)
	  , shared         = __webpack_require__(43)
	  , setToStringTag = __webpack_require__(47)
	  , uid            = __webpack_require__(44)
	  , wks            = __webpack_require__(48)
	  , wksExt         = __webpack_require__(55)
	  , wksDefine      = __webpack_require__(60)
	  , keyOf          = __webpack_require__(61)
	  , enumKeys       = __webpack_require__(62)
	  , isArray        = __webpack_require__(65)
	  , anObject       = __webpack_require__(20)
	  , toIObject      = __webpack_require__(36)
	  , toPrimitive    = __webpack_require__(26)
	  , createDesc     = __webpack_require__(27)
	  , _create        = __webpack_require__(32)
	  , gOPNExt        = __webpack_require__(66)
	  , $GOPD          = __webpack_require__(68)
	  , $DP            = __webpack_require__(19)
	  , $keys          = __webpack_require__(34)
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
	  __webpack_require__(67).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(64).f  = $propertyIsEnumerable;
	  __webpack_require__(63).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(13)){
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(18)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(44)('meta')
	  , isObject = __webpack_require__(21)
	  , has      = __webpack_require__(29)
	  , setDesc  = __webpack_require__(19).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(24)(function(){
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
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(15)
	  , core           = __webpack_require__(3)
	  , LIBRARY        = __webpack_require__(13)
	  , wksExt         = __webpack_require__(55)
	  , defineProperty = __webpack_require__(19).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(34)
	  , toIObject = __webpack_require__(36);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(34)
	  , gOPS    = __webpack_require__(63)
	  , pIE     = __webpack_require__(64);
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
/* 63 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 64 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(38);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(36)
	  , gOPN      = __webpack_require__(67).f
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
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(35)
	  , hiddenKeys = __webpack_require__(45).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(64)
	  , createDesc     = __webpack_require__(27)
	  , toIObject      = __webpack_require__(36)
	  , toPrimitive    = __webpack_require__(26)
	  , has            = __webpack_require__(29)
	  , IE8_DOM_DEFINE = __webpack_require__(22)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(23) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 69 */
/***/ (function(module, exports) {

	

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(60)('asyncIterator');

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(60)('observable');

/***/ }),
/* 72 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var utils = {
	  isAndroid: ~navigator.userAgent.indexOf("Android"),
	  isiPhone: ~navigator.userAgent.indexOf("iPhone")
	};
	var pullLoadingImgBlack = "data:image/gif;base64,R0lGODlhQAAMAMQZAPT09Orq6ubm5unp6dPT06ysrPz8/NbW1q+vr9fX1+vr687Ozv39/fr6+tXV1Z6ens3NzZ2dnZubm66urpycnKurq+Xl5czMzJmZmf///wAAAAAAAAAAAAAAAAAAAAAAACH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphODFiMWQ5My0wMDIwLTRiYmItYjVlMS04YjI4NTFkMzMzMjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6MjFEQzRGRkU4NkU4MTFFNjkwOTg4NjNGN0JEMzY0OTUiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6MjFEQzRGRkQ4NkU4MTFFNjkwOTg4NjNGN0JEMzY0OTUiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDplY2RjM2MyNC03NDBkLTQ1NzMtOTc0Ni1iZGQ2MzhlMjEyYjUiIHN0UmVmOmRvY3VtZW50SUQ9ImFkb2JlOmRvY2lkOnBob3Rvc2hvcDo3MGUzZDU2Ny1jZTk1LTExNzktYWFmZC04MmQ1NzRhYmI2YzIiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz4B//79/Pv6+fj39vX08/Lx8O/u7ezr6uno5+bl5OPi4eDf3t3c29rZ2NfW1dTT0tHQz87NzMvKycjHxsXEw8LBwL++vby7urm4t7a1tLOysbCvrq2sq6qpqKempaSjoqGgn56dnJuamZiXlpWUk5KRkI+OjYyLiomIh4aFhIOCgYB/fn18e3p5eHd2dXRzcnFwb25tbGtqaWhnZmVkY2JhYF9eXVxbWllYV1ZVVFNSUVBPTk1MS0pJSEdGRURDQkFAPz49PDs6OTg3NjU0MzIxMC8uLSwrKikoJyYlJCMiISAfHh0cGxoZGBcWFRQTEhEQDw4NDAsKCQgHBgUEAwIBAAAh+QQJFAAZACwAAAAAQAAMAAAFvmCWMQTyPAjBiGzrukOyLMnw3jegCIICtIACZkgs/HC3xuHCbB4ayJshYKlaA4aRkMgtZKOtZXPsALuo1nQgQ+C6MQSzaDCuX2xyQHpvASDeXAhyGQl2YwmDCnxpChKARBSDEIZNEIMCi1YCjo8YD5KUTAuXmVUCf52CcoWhiHKKpQptnXFydKF4ZnqlAAZbbxVfcg6UZYMZaHxrGUFvRscZSnYOUMdTysIkExEREyrQLAMHMwe54AABPAFHGSEAIfkECRQAGQAsAAAAAEAADAAABb9gJgKKICiAqK4syxDI8yAE097tkCxLMqyGgGVIDBhwOEABw2wWUshW43CpWg8NkZDIDURdy6a4cPyqqNa0IwPgui1QM0FMxxDMokF6fxko3lwKeBkIdWIIgwl8aQkCgEQCgxKGTRSDEItWEI6PFpF4k5QYD5eZVQt/nYJ4haKIeIqmCW2dcV9zond4eqY/W29egwZhdRVleA6ZaxlBwMd4SnVPgyJTfA5ZKgABJgG21C8TERETNdQrAwc8Bz8iIQAh+QQFFAAZACwAAAAAQAAMAAAFv2AmDsmyJIOormwLKIKgAG3dMgTyPAjBqI3DZUg8NGw2Q8DCbAYMyBqggKlaC7SMkMh1RFvLpjjwXTGo1nTBMOC6L6lyBiCuW7JlQnqPISTeXAlyGQp2YgqDCHxpCBCARBCDAoZNAoMSi1YUjo8XC5KUTJZymJkYD3+dgnKFoYhyiqYIbZ1xZXSheF96pgQZDo9egxlhdmSDBmh8FVBBbw5Hw0rGUMNTfFgrAwcmB7bDIgABMQG6wzgTERETPiIhADs=";
	var pullLoadingImgWhite = "data:image/gif;base64,R0lGODlhQAAMAIABAP///////yH/C05FVFNDQVBFMi4wAwEAAAAh/wtYTVAgRGF0YVhNUDw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNS1jMDIxIDc5LjE1NTc3MiwgMjAxNC8wMS8xMy0xOTo0NDowMCAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wTU09Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9tbS8iIHhtbG5zOnN0UmVmPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvc1R5cGUvUmVzb3VyY2VSZWYjIiB4bWxuczp4bXA9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8iIHhtcE1NOk9yaWdpbmFsRG9jdW1lbnRJRD0ieG1wLmRpZDphODFiMWQ5My0wMDIwLTRiYmItYjVlMS04YjI4NTFkMzMzMjIiIHhtcE1NOkRvY3VtZW50SUQ9InhtcC5kaWQ6M0Q5MjI2RkE4NkU1MTFFNkFDRDc5Mjc3OTE2NjVFRTMiIHhtcE1NOkluc3RhbmNlSUQ9InhtcC5paWQ6M0Q5MjI2Rjk4NkU1MTFFNkFDRDc5Mjc3OTE2NjVFRTMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIDIwMTQgKE1hY2ludG9zaCkiPiA8eG1wTU06RGVyaXZlZEZyb20gc3RSZWY6aW5zdGFuY2VJRD0ieG1wLmlpZDphODFiMWQ5My0wMDIwLTRiYmItYjVlMS04YjI4NTFkMzMzMjIiIHN0UmVmOmRvY3VtZW50SUQ9InhtcC5kaWQ6YTgxYjFkOTMtMDAyMC00YmJiLWI1ZTEtOGIyODUxZDMzMzIyIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+Af/+/fz7+vn49/b19PPy8fDv7u3s6+rp6Ofm5eTj4uHg397d3Nva2djX1tXU09LR0M/OzczLysnIx8bFxMPCwcC/vr28u7q5uLe2tbSzsrGwr66trKuqqainpqWko6KhoJ+enZybmpmYl5aVlJOSkZCPjo2Mi4qJiIeGhYSDgoGAf359fHt6eXh3dnV0c3JxcG9ubWxramloZ2ZlZGNiYWBfXl1cW1pZWFdWVVRTUlFQT05NTEtKSUhHRkVEQ0JBQD8+PTw7Ojk4NzY1NDMyMTAvLi0sKyopKCcmJSQjIiEgHx4dHBsaGRgXFhUUExIREA8ODQwLCgkIBwYFBAMCAQAAIfkECRQAAQAsAAAAAEAADAAAAkVMgInG7a7Wmy+CZhWlOe3ZLaH3YWEJnaOErhd6uCscj7Q8w+6Nn3re6nV4tp/QQvQFjxFaLeN8IqVNZzE5pbKi2SiVUQAAIfkECRQAAQAsAAAAAEAADAAAAkWMgWnL3QmBmy7KZSGlWe3aXeH1YSNZBqN6pkfrnjL6yS47h7cd53q/AvosO1hq2CkGj60l01kKQqM/ZYZBvGGvWpPGUAAAIfkEBRQAAQAsAAAAAEAADAAAAkWMgWnL7amcbBCuWufEVj+OHCDgfWDJjGqGBivZvm/rrrRsxzmKq/de6o1+Pp0QQxwah8Uk0smpnWjSKLVZDVFTrG02UgAAOw==";

	var m = 100,
	    leastHeight = 50,
	    tag = !1,
	    pageY = 0,
	    height = 0,
	    containerDiv = null,
	    touchendCallback = null,
	    isPullDown = !1;
	function CreateContainer() {
	  //生成下拉时看到的logo容器
	  if (!containerDiv) {
	    containerDiv = document.createElement("div");
	    var logoEle = document.createElement("i");
	    if ("dark" === __wxConfig.window.backgroundTextStyle) {
	      logoEle.style.backgroundImage = "url(" + pullLoadingImgBlack + ")";
	    } else {
	      logoEle.style.backgroundImage = "url(" + pullLoadingImgWhite + ")";
	    }
	    logoEle.style.width = "32px";
	    logoEle.style.position = "absolute";
	    logoEle.style.height = "6px";
	    logoEle.style.left = "50%";
	    logoEle.style.bottom = "20px";
	    logoEle.style.backgroundRepeat = "no-repeat";
	    logoEle.style.marginLeft = "-16px";
	    logoEle.style.backgroundSize = "cover";
	    containerDiv.appendChild(logoEle);
	    containerDiv.style.width = "100%";
	    containerDiv.style.position = "fixed";
	    containerDiv.style.top = "0px";
	    containerDiv.style.backgroundColor = __wxConfig.window.backgroundColor;
	    document.body.insertBefore(containerDiv, document.body.firstChild);
	  }
	}

	function handleTouchStart() {
	  window.addEventListener("touchstart", function (event) {
	    if (0 == window.scrollY) {
	      CreateContainer();
	      tag = !0;
	      pageY = event.touches[0].pageY;
	      window.document.body.style.transition = "all linear 0";
	      containerDiv.style.transition = "all linear 0";
	    }
	    // 0 == window.scrollY && (CreateContainer(), I = !0, h = event.touches[0].pageY, window.document.body.style.transition = "all linear 0", containerDiv.style.transition = "all linear 0")
	  }, !0);
	}

	function handleTouchMove() {
	  window.addEventListener("touchmove", function (e) {
	    if (tag && __wxConfig.window.enablePullDownRefresh && !isPullDown) {
	      height = e.touches[0].pageY - pageY;
	      height = Math.max(0, height);
	      height = Math.min(m, height);
	      window.document.body.style.marginTop = height + "px";
	      containerDiv.style.height = height + "px";
	    }
	    // I && __wxConfig.window.enablePullDownRefresh && !M && (v = e.touches[0].pageY - h, v = Math.max(0, v), v = Math.min(m, v), window.document.body.style.marginTop = v + "px", containerDiv.style.height = v + "px")
	  });
	}

	function handleTouchEnd() {
	  window.addEventListener("touchend", function (e) {
	    tag = !1;
	    if (height > leastHeight) {
	      "function" == typeof touchendCallback && touchendCallback();
	      height = leastHeight;
	      window.document.body.style.marginTop = height + "px";
	      containerDiv.style.height = height + "px";
	      setTimeout(reset, 3e3);
	    } else {
	      reset();
	    }
	    //I = !1, v > f ? ("function" == typeof y && y(), v = f, window.document.body.style.marginTop = v + "px", containerDiv.style.height = v + "px", setTimeout(reset, 3e3)) : reset()
	  });
	}

	function reset() {
	  window.document.body.style.transition = "all linear 0.3s";
	  window.document.body.style.marginTop = "0px";
	  if (containerDiv) {
	    containerDiv.style.transition = "all linear 0.3s";
	    containerDiv.style.height = "0px";
	  }
	  // window.document.body.style.transition = "all linear 0.3s", window.document.body.style.marginTop = "0px", containerDiv && (containerDiv.style.transition = "all linear 0.3s", containerDiv.style.height = "0px")
	}

	function togglePullDownRefresh(isPullDownAgs) {
	  //禁用回弹
	  isPullDown = isPullDownAgs;
	}

	exports.default = { // 下拉手势注册以及相关事件
	  register: function register(callback) {
	    if ((utils.isAndroid || utils.isiPhone) && window.__wxConfig && window.__wxConfig.window && window.__wxConfig.window.enablePullDownRefresh) {
	      touchendCallback = callback;
	      handleTouchStart();
	      handleTouchMove();
	      handleTouchEnd();
	    }
	  },
	  reset: reset,
	  togglePullDownRefresh: togglePullDownRefresh
	};

/***/ })
/******/ ])
});
;
var wx =
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

	var _bridge = __webpack_require__(90);

	var _bridge2 = _interopRequireDefault(_bridge);

	var _contactButton = __webpack_require__(91);

	var _contactButton2 = _interopRequireDefault(_contactButton);

	var _onAppStateChange = __webpack_require__(92);

	var _onAppStateChange2 = _interopRequireDefault(_onAppStateChange);

	var _utils = __webpack_require__(93);

	var _utils2 = _interopRequireDefault(_utils);

	__webpack_require__(113);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function injectAttr(attrName) {
	  isInDevtools ? wx[attrName] = apiObj[attrName] : wx.__defineGetter__(attrName, function () {
	    return function () {
	      try {
	        return apiObj[attrName].apply(this, arguments);
	      } catch (e) {
	        errReport(e);
	      }
	    };
	  });
	}

	function errReport(obj, extend) {
	  if ("[object Error]" === Object.prototype.toString.apply(obj)) {
	    if ("WebviewSdkKnownError" == obj.type) throw obj;
	    Reporter.errorReport({
	      key: "webviewSDKScriptError",
	      error: obj,
	      extend: extend
	    });
	  }
	}

	var localImgDataIng = !1,
	    imgData = [],
	    wx = {},
	    isInDevtools = "devtools" === _utils2.default.getPlatform(),
	    defInvoke = function defInvoke(name, args) {
	  //publish
	  _bridge2.default.publish("INVOKE_METHOD", {
	    name: name,
	    args: args
	  });
	},
	    apiObj = {
	  invoke: _bridge2.default.invoke,
	  on: _bridge2.default.on,
	  getPlatform: _utils2.default.getPlatform,
	  onAppEnterForeground: _onAppStateChange2.default.onAppEnterForeground,
	  onAppEnterBackground: _onAppStateChange2.default.onAppEnterBackground,
	  reportIDKey: function reportIDKey(e, t) {
	    console.warn("reportIDKey has been removed wx");
	  },
	  reportKeyValue: function reportKeyValue(e, t) {
	    console.warn("reportKeyValue has been removed from wx");
	  },
	  initReady: function initReady() {
	    _bridge2.default.invokeMethod("initReady");
	  },
	  redirectTo: function redirectTo(params) {
	    defInvoke("redirectTo", params);
	  },
	  navigateTo: function navigateTo(params) {
	    defInvoke("navigateTo", params);
	  },
	  switchTab: function switchTab(params) {
	    defInvoke("switchTab", params);
	  },
	  clearStorage: function clearStorage() {
	    defInvoke("clearStorage", {});
	  },
	  showKeyboard: function showKeyboard(params) {
	    _bridge2.default.invokeMethod("showKeyboard", params);
	  },
	  showDatePickerView: function showDatePickerView(params) {
	    _bridge2.default.invokeMethod("showDatePickerView", params);
	  },
	  hideKeyboard: function hideKeyboard(params) {
	    _bridge2.default.invokeMethod("hideKeyboard", params);
	  },
	  insertMap: function insertMap(params) {
	    _bridge2.default.invokeMethod("insertMap", params);
	  },
	  removeMap: function removeMap(params) {
	    _bridge2.default.invokeMethod("removeMap", params);
	  },
	  updateMapCovers: function updateMapCovers(params) {
	    _bridge2.default.invokeMethod("updateMapCovers", params);
	  },
	  insertContactButton: _contactButton2.default.insertContactButton,
	  updateContactButton: _contactButton2.default.updateContactButton,
	  removeContactButton: _contactButton2.default.removeContactButton,
	  enterContact: _contactButton2.default.enterContact,
	  getRealRoute: _utils2.default.getRealRoute,
	  getCurrentRoute: function getCurrentRoute(params) {
	    _bridge2.default.invokeMethod("getCurrentRoute", params, {
	      beforeSuccess: function beforeSuccess(res) {
	        res.route = res.route.split("?")[0];
	      }
	    });
	  },
	  getLocalImgData: function getLocalImgData(params) {
	    function beforeAllFn() {
	      localImgDataIng = !1;
	      if (imgData.length > 0) {
	        var item = imgData.shift();
	        apiObj.getLocalImgData(item);
	      }
	    }

	    if (localImgDataIng === !1) {
	      localImgDataIng = !0;
	      if ("string" == typeof params.path) {
	        apiObj.getCurrentRoute({
	          success: function success(res) {
	            var route = res.route;
	            params.path = _utils2.default.getRealRoute(route || "index.html", params.path);
	            _bridge2.default.invokeMethod("getLocalImgData", params, {
	              beforeAll: beforeAllFn
	            });
	          }
	        });
	      } else {
	        _bridge2.default.invokeMethod("getLocalImgData", params, {
	          beforeAll: beforeAllFn
	        });
	      }
	    } else {
	      imgData.push(params);
	    }
	  },
	  insertVideoPlayer: function insertVideoPlayer(e) {
	    _bridge2.default.invokeMethod("insertVideoPlayer", e);
	  },
	  removeVideoPlayer: function removeVideoPlayer(e) {
	    _bridge2.default.invokeMethod("removeVideoPlayer", e);
	  },
	  insertShareButton: function insertShareButton(e) {
	    _bridge2.default.invokeMethod("insertShareButton", e);
	  },
	  updateShareButton: function updateShareButton(e) {
	    _bridge2.default.invokeMethod("updateShareButton", e);
	  },
	  removeShareButton: function removeShareButton(e) {
	    _bridge2.default.invokeMethod("removeShareButton", e);
	  },
	  onAppDataChange: function onAppDataChange(callback) {
	    _bridge2.default.subscribe("appDataChange", function (params) {
	      callback(params);
	    });
	  },
	  publishPageEvent: function publishPageEvent(eventName, data) {
	    _bridge2.default.publish("PAGE_EVENT", {
	      eventName: eventName,
	      data: data
	    });
	  },
	  animationToStyle: _utils2.default.animationToStyle
	};

	for (var key in apiObj) {
	  injectAttr(key);
	} // export default wx
	module.exports = wx;

/***/ }),
/* 1 */,
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	var $Object = __webpack_require__(7).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(5)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(20)});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(6)
	  , core      = __webpack_require__(7)
	  , ctx       = __webpack_require__(8)
	  , hide      = __webpack_require__(10)
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
/* 6 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(9);
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
/* 9 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(11)
	  , createDesc = __webpack_require__(19);
	module.exports = __webpack_require__(15) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(12)
	  , IE8_DOM_DEFINE = __webpack_require__(14)
	  , toPrimitive    = __webpack_require__(18)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(15) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(13);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(15) && !__webpack_require__(16)(function(){
	  return Object.defineProperty(__webpack_require__(17)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(16)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(13)
	  , document = __webpack_require__(6).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(13);
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
/* 19 */
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(12)
	  , dPs         = __webpack_require__(21)
	  , enumBugKeys = __webpack_require__(36)
	  , IE_PROTO    = __webpack_require__(33)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(17)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(37).appendChild(iframe);
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(11)
	  , anObject = __webpack_require__(12)
	  , getKeys  = __webpack_require__(22);

	module.exports = __webpack_require__(15) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(23)
	  , enumBugKeys = __webpack_require__(36);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(24)
	  , toIObject    = __webpack_require__(25)
	  , arrayIndexOf = __webpack_require__(29)(false)
	  , IE_PROTO     = __webpack_require__(33)('IE_PROTO');

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
/* 24 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(26)
	  , defined = __webpack_require__(28);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(27);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(25)
	  , toLength  = __webpack_require__(30)
	  , toIndex   = __webpack_require__(32);
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(31)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(34)('keys')
	  , uid    = __webpack_require__(35);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(6)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6).document && document.documentElement;

/***/ }),
/* 38 */,
/* 39 */,
/* 40 */,
/* 41 */,
/* 42 */,
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(44), __esModule: true };

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(45);
	module.exports = __webpack_require__(7).Object.keys;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(46)
	  , $keys    = __webpack_require__(22);

	__webpack_require__(47)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(28);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(5)
	  , core    = __webpack_require__(7)
	  , fails   = __webpack_require__(16);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(49);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(66);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(50), __esModule: true };

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(51);
	__webpack_require__(61);
	module.exports = __webpack_require__(65).f('iterator');

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(52)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(53)(String, 'String', function(iterated){
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31)
	  , defined   = __webpack_require__(28);
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
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(54)
	  , $export        = __webpack_require__(5)
	  , redefine       = __webpack_require__(55)
	  , hide           = __webpack_require__(10)
	  , has            = __webpack_require__(24)
	  , Iterators      = __webpack_require__(56)
	  , $iterCreate    = __webpack_require__(57)
	  , setToStringTag = __webpack_require__(58)
	  , getPrototypeOf = __webpack_require__(60)
	  , ITERATOR       = __webpack_require__(59)('iterator')
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
/* 54 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(10);

/***/ }),
/* 56 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(20)
	  , descriptor     = __webpack_require__(19)
	  , setToStringTag = __webpack_require__(58)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(10)(IteratorPrototype, __webpack_require__(59)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(11).f
	  , has = __webpack_require__(24)
	  , TAG = __webpack_require__(59)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(34)('wks')
	  , uid        = __webpack_require__(35)
	  , Symbol     = __webpack_require__(6).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(24)
	  , toObject    = __webpack_require__(46)
	  , IE_PROTO    = __webpack_require__(33)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(62);
	var global        = __webpack_require__(6)
	  , hide          = __webpack_require__(10)
	  , Iterators     = __webpack_require__(56)
	  , TO_STRING_TAG = __webpack_require__(59)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(63)
	  , step             = __webpack_require__(64)
	  , Iterators        = __webpack_require__(56)
	  , toIObject        = __webpack_require__(25);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(53)(Array, 'Array', function(iterated, kind){
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
/* 63 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 64 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(59);

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(68);
	__webpack_require__(79);
	__webpack_require__(80);
	__webpack_require__(81);
	module.exports = __webpack_require__(7).Symbol;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(6)
	  , has            = __webpack_require__(24)
	  , DESCRIPTORS    = __webpack_require__(15)
	  , $export        = __webpack_require__(5)
	  , redefine       = __webpack_require__(55)
	  , META           = __webpack_require__(69).KEY
	  , $fails         = __webpack_require__(16)
	  , shared         = __webpack_require__(34)
	  , setToStringTag = __webpack_require__(58)
	  , uid            = __webpack_require__(35)
	  , wks            = __webpack_require__(59)
	  , wksExt         = __webpack_require__(65)
	  , wksDefine      = __webpack_require__(70)
	  , keyOf          = __webpack_require__(71)
	  , enumKeys       = __webpack_require__(72)
	  , isArray        = __webpack_require__(75)
	  , anObject       = __webpack_require__(12)
	  , toIObject      = __webpack_require__(25)
	  , toPrimitive    = __webpack_require__(18)
	  , createDesc     = __webpack_require__(19)
	  , _create        = __webpack_require__(20)
	  , gOPNExt        = __webpack_require__(76)
	  , $GOPD          = __webpack_require__(78)
	  , $DP            = __webpack_require__(11)
	  , $keys          = __webpack_require__(22)
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
	  __webpack_require__(77).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(74).f  = $propertyIsEnumerable;
	  __webpack_require__(73).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(54)){
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(10)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(35)('meta')
	  , isObject = __webpack_require__(13)
	  , has      = __webpack_require__(24)
	  , setDesc  = __webpack_require__(11).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(16)(function(){
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
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(6)
	  , core           = __webpack_require__(7)
	  , LIBRARY        = __webpack_require__(54)
	  , wksExt         = __webpack_require__(65)
	  , defineProperty = __webpack_require__(11).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(22)
	  , toIObject = __webpack_require__(25);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(22)
	  , gOPS    = __webpack_require__(73)
	  , pIE     = __webpack_require__(74);
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
/* 73 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 74 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(27);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(25)
	  , gOPN      = __webpack_require__(77).f
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
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(23)
	  , hiddenKeys = __webpack_require__(36).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(74)
	  , createDesc     = __webpack_require__(19)
	  , toIObject      = __webpack_require__(25)
	  , toPrimitive    = __webpack_require__(18)
	  , has            = __webpack_require__(24)
	  , IE8_DOM_DEFINE = __webpack_require__(14)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(15) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 79 */
/***/ (function(module, exports) {

	

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(70)('asyncIterator');

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(70)('observable');

/***/ }),
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */,
/* 86 */,
/* 87 */,
/* 88 */,
/* 89 */,
/* 90 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	function execOnJSBridgeReady(callback) {
	  "undefined" != typeof WeixinJSBridge ? callback() : document.addEventListener("WeixinJSBridgeReady", callback, !1);
	}

	function invoke() {
	  var params = arguments;
	  execOnJSBridgeReady(function () {
	    WeixinJSBridge.invoke.apply(WeixinJSBridge, params);
	  });
	}

	function on() {
	  var params = arguments;
	  execOnJSBridgeReady(function () {
	    WeixinJSBridge.on.apply(WeixinJSBridge, params);
	  });
	}

	function publish() {
	  var params = Array.prototype.slice.call(arguments);
	  params[1] = {
	    data: params[1],
	    options: {
	      timestamp: Date.now()
	    }
	  };
	  execOnJSBridgeReady(function () {
	    WeixinJSBridge.publish.apply(WeixinJSBridge, params);
	  });
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
	    "function" == typeof callback && callback(data, ext);
	    Reporter.speedReport({
	      key: "appService2Webview",
	      data: data || {},
	      timeMark: {
	        startTime: timestamp,
	        endTime: endTime,
	        nativeTime: timeMark.nativeTime
	      }
	    });
	  };
	  execOnJSBridgeReady(function () {
	    WeixinJSBridge.subscribe.apply(WeixinJSBridge, params);
	  });
	}

	function invokeMethod(eventName) {
	  //invoke 事件
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
	    "function" == typeof innerParams.beforeAll && innerParams.beforeAll(res);
	    isOk ? ("function" == typeof innerParams.beforeSuccess && innerParams.beforeSuccess(res), "function" == typeof callbacks.success && callbacks.success(res), "function" == typeof innerParams.afterSuccess && innerParams.afterSuccess(res)) : isCancel ? ("function" == typeof callbacks.cancel && callbacks.cancel(res), "function" == typeof innerParams.cancel && innerParams.cancel(res)) : isFail && ("function" == typeof callbacks.fail && callbacks.fail(res), "function" == typeof innerParams.fail && innerParams.fail(res)), "function" == typeof callbacks.complete && callbacks.complete(res), "function" == typeof innerParams.complete && innerParams.complete(res);
	  });
	}

	function onMethod(eventName, callback) {
	  on(eventName, callback);
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
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _bridge = __webpack_require__(90);

	var _bridge2 = _interopRequireDefault(_bridge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function insertContactButton(e) {
	  _bridge2.default.invokeMethod("insertContactButton", e);
	}

	function updateContactButton(e) {
	  _bridge2.default.invokeMethod("updateContactButton", e);
	}

	function removeContactButton(e) {
	  _bridge2.default.invokeMethod("removeContactButton", e);
	}

	function enterContact(e) {
	  _bridge2.default.invokeMethod("enterContact", e);
	}

	exports.default = {
	  insertContactButton: insertContactButton,
	  updateContactButton: updateContactButton,
	  removeContactButton: removeContactButton,
	  enterContact: enterContact
	};

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _bridge = __webpack_require__(90);

	var _bridge2 = _interopRequireDefault(_bridge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var foregroundCallbacks = [],
	    backgroundCallbacks = [],
	    onAppEnterForeground = function onAppEnterForeground(fn) {
	  foregroundCallbacks.push(fn);
	},
	    onAppEnterBackground = function onAppEnterBackground(fn) {
	  backgroundCallbacks.push(fn);
	};
	_bridge2.default.subscribe("onAppEnterForeground", function (e) {
	  foregroundCallbacks.forEach(function (fn) {
	    fn(e);
	  });
	});
	_bridge2.default.subscribe("onAppEnterBackground", function (e) {
	  backgroundCallbacks.forEach(function (fn) {
	    fn(e);
	  });
	});

	exports.default = {
	  onAppEnterForeground: onAppEnterForeground,
	  onAppEnterBackground: onAppEnterBackground
	};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(94);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(97);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _possibleConstructorReturn2 = __webpack_require__(98);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(99);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _keys = __webpack_require__(43);

	var _keys2 = _interopRequireDefault(_keys);

	var _from = __webpack_require__(104);

	var _from2 = _interopRequireDefault(_from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toArray(params) {
	  //用params生成一个新数组
	  if (Array.isArray(params)) {
	    for (var t = 0, n = Array(params.length); t < params.length; t++) {
	      n[t] = params[t];
	    }return n;
	  }
	  return (0, _from2.default)(params);
	}

	function getRealRoute() {
	  //格式化一个路径
	  var pathPrefix = arguments.length > 0 && void 0 !== arguments[0] ? arguments[0] : "",
	      pathname = arguments.length > 1 && void 0 !== arguments[1] ? arguments[1] : "";
	  if (0 === pathname.indexOf("/")) return pathname.substr(1);
	  if (0 === pathname.indexOf("./")) return getRealRoute(pathPrefix, pathname.substr(2));
	  var index,
	      folderLength,
	      folderArr = pathname.split("/");
	  for (index = 0, folderLength = folderArr.length; index < folderLength && ".." === folderArr[index]; index++) {}
	  folderArr.splice(0, index);
	  var prefixArr = pathPrefix.length > 0 ? pathPrefix.split("/") : [];
	  prefixArr.splice(prefixArr.length - index - 1, index + 1);
	  var pathArr = prefixArr.concat(folderArr);
	  return pathArr.join("/");
	}

	function animationToStyle(params) {
	  var animates = params.animates,
	      option = params.option,
	      opts = void 0 === option ? {} : option,
	      transformOrigin = opts.transformOrigin,
	      transition = opts.transition;
	  if ("undefined" == typeof transition || "undefined" == typeof animates) {
	    return {
	      transformOrigin: "",
	      transform: "",
	      transition: ""
	    };
	  }

	  var transform = animates.filter(function (animate) {
	    var type = animate.type;
	    return "style" !== type;
	  }).map(function (animate) {
	    var animateType = animate.type,
	        animateArgs = animate.args;
	    switch (animateType) {
	      case "matrix":
	        return "matrix(" + animateArgs.join(",") + ")";
	      case "matrix3d":
	        return "matrix3d(" + animateArgs.join(",") + ")";
	      case "rotate":
	        return animateArgs = animateArgs.map(addDegSuffix), "rotate(" + animateArgs[0] + ")";
	      case "rotate3d":
	        return animateArgs[3] = addDegSuffix(animateArgs[3]), "rotate3d(" + animateArgs.join(",") + ")";
	      case "rotateX":
	        return animateArgs = animateArgs.map(addDegSuffix), "rotateX(" + animateArgs[0] + ")";
	      case "rotateY":
	        return animateArgs = animateArgs.map(addDegSuffix), "rotateY(" + animateArgs[0] + ")";
	      case "rotateZ":
	        return animateArgs = animateArgs.map(addDegSuffix), "rotateZ(" + animateArgs[0] + ")";
	      case "scale":
	        return "scale(" + animateArgs.join(",") + ")";
	      case "scale3d":
	        return "scale3d(" + animateArgs.join(",") + ")";
	      case "scaleX":
	        return "scaleX(" + animateArgs[0] + ")";
	      case "scaleY":
	        return "scaleY(" + animateArgs[0] + ")";
	      case "scaleZ":
	        return "scaleZ(" + animateArgs[0] + ")";
	      case "translate":
	        return animateArgs = animateArgs.map(addPXSuffix), "translate(" + animateArgs.join(",") + ")";
	      case "translate3d":
	        return animateArgs = animateArgs.map(addPXSuffix), "translate3d(" + animateArgs.join(",") + ")";
	      case "translateX":
	        return animateArgs = animateArgs.map(addPXSuffix), "translateX(" + animateArgs[0] + ")";
	      case "translateY":
	        return animateArgs = animateArgs.map(addPXSuffix), "translateY(" + animateArgs[0] + ")";
	      case "translateZ":
	        return animateArgs = animateArgs.map(addPXSuffix), "translateZ(" + animateArgs[0] + ")";
	      case "skew":
	        return animateArgs = animateArgs.map(addDegSuffix), "skew(" + animateArgs.join(",") + ")";
	      case "skewX":
	        return animateArgs = animateArgs.map(addDegSuffix), "skewX(" + animateArgs[0] + ")";
	      case "skewY":
	        return animateArgs = animateArgs.map(addDegSuffix), "skewY(" + animateArgs[0] + ")";
	      default:
	        return "";
	    }
	  }).join(" ");

	  var style = animates.filter(function (animate) {
	    var type = animate.type;
	    return "style" === type;
	  }).reduce(function (res, cur) {
	    return res[cur.args[0]] = cur.args[1], res;
	  }, {});

	  var transitionProperty = ["transform"].concat(_toArray((0, _keys2.default)(style))).join(",");

	  return {
	    style: style,
	    transformOrigin: transformOrigin,
	    transform: transform,
	    transitionProperty: transitionProperty,
	    transition: transition.duration + "ms " + transition.timingFunction + " " + transition.delay + "ms"
	  };
	}

	function getPlatform() {
	  //var ua = window.navigator.userAgent.toLowerCase();
	  return "wechatdevtools"; ///wechatdevtools/.test(ua) ? "wechatdevtools" : /(iphone|ipad)/.test(ua) ? "ios" : /android/.test(ua) ? "android" : void 0
	}

	function addPXSuffix(num) {
	  return "number" == typeof num ? num + "px" : num;
	}

	function addDegSuffix(num) {
	  return num + "deg";
	}

	var WebviewSdkKnownError = function (_Error) {
	  (0, _inherits3.default)(WebviewSdkKnownError, _Error);

	  function WebviewSdkKnownError(str) {
	    (0, _classCallCheck3.default)(this, WebviewSdkKnownError);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (WebviewSdkKnownError.__proto__ || (0, _getPrototypeOf2.default)(WebviewSdkKnownError)).call(this, "Webview-SDK:" + str));

	    _this.type = "WebviewSdkKnownError";
	    return _this;
	  }

	  return WebviewSdkKnownError;
	}(Error);

	exports.default = {
	  getRealRoute: getRealRoute,
	  animationToStyle: animationToStyle,
	  getPlatform: getPlatform,
	  WebviewSdkKnownError: WebviewSdkKnownError
	};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(95), __esModule: true };

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(96);
	module.exports = __webpack_require__(7).Object.getPrototypeOf;

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(46)
	  , $getPrototypeOf = __webpack_require__(60);

	__webpack_require__(47)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ }),
/* 97 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(48);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(100);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(48);

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
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(101), __esModule: true };

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(102);
	module.exports = __webpack_require__(7).Object.setPrototypeOf;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(5);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(103).set});

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(13)
	  , anObject = __webpack_require__(12);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(8)(Function.call, __webpack_require__(78).f(Object.prototype, '__proto__').set, 2);
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
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(105), __esModule: true };

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(51);
	__webpack_require__(106);
	module.exports = __webpack_require__(7).Array.from;

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(8)
	  , $export        = __webpack_require__(5)
	  , toObject       = __webpack_require__(46)
	  , call           = __webpack_require__(107)
	  , isArrayIter    = __webpack_require__(108)
	  , toLength       = __webpack_require__(30)
	  , createProperty = __webpack_require__(109)
	  , getIterFn      = __webpack_require__(110);

	$export($export.S + $export.F * !__webpack_require__(112)(function(iter){ Array.from(iter); }), 'Array', {
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
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(12);
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
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(56)
	  , ITERATOR   = __webpack_require__(59)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(11)
	  , createDesc      = __webpack_require__(19);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(111)
	  , ITERATOR  = __webpack_require__(59)('iterator')
	  , Iterators = __webpack_require__(56);
	module.exports = __webpack_require__(7).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(27)
	  , TAG = __webpack_require__(59)('toStringTag')
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
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(59)('iterator')
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
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	var _bridge = __webpack_require__(90);

	var _bridge2 = _interopRequireDefault(_bridge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/*

	function execOnReady(callback) {
	  "loading" !== document.readyState ? callback() : document.addEventListener("DOMContentLoaded", callback)
	}

	*/

	var hasInitLogs = !1,
	    consoleMethods = ["log", "warn", "error", "info", "debug"]; // 20 log 相关

	consoleMethods.forEach(function (method) {
	  _bridge2.default.subscribe(method, function (params) {
	    var log = params.log;
	    console[method].apply(console, log);
	  });
	});
	_bridge2.default.subscribe("initLogs", function (params) {
	  var logs = params.logs;
	  if (hasInitLogs === !1) {
	    hasInitLogs = !0;
	    logs.forEach(function (args) {
	      var method = args.method,
	          log = args.log;
	      console[method].apply(console, log);
	    });
	    hasInitLogs = !0;
	  }
	});
	/*

	execOnReady(function () {
	    bridge.publish("DOMContentLoaded", {})
	})
	*/

/***/ })
/******/ ]);
var exparser =
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

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.removeGlobalErrorListener = exports.addGlobalErrorListener = exports.triggerEvent = exports.removeListenerFromElement = exports.addListenerToElement = exports.replaceChild = exports.removeChild = exports.insertBefore = exports.appendChild = exports.createVirtualNode = exports.createTextNode = exports.createElement = exports.registerElement = exports.registerBehavior = exports.globalOptions = exports.Observer = exports.Component = exports.VirtualNode = exports.TextNode = exports.Element = exports.Behavior = undefined;

	var _Events = __webpack_require__(1);

	var _Events2 = _interopRequireDefault(_Events);

	var _EventManager = __webpack_require__(38);

	var EventManager = _interopRequireWildcard(_EventManager);

	var _Behavior = __webpack_require__(39);

	var _Behavior2 = _interopRequireDefault(_Behavior);

	var _Element = __webpack_require__(40);

	var _Element2 = _interopRequireDefault(_Element);

	var _Component = __webpack_require__(42);

	var _Component2 = _interopRequireDefault(_Component);

	var _TextNode = __webpack_require__(89);

	var _TextNode2 = _interopRequireDefault(_TextNode);

	var _VirtualNode = __webpack_require__(88);

	var _VirtualNode2 = _interopRequireDefault(_VirtualNode);

	var _Observer = __webpack_require__(41);

	var _Observer2 = _interopRequireDefault(_Observer);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var globalOptions = {
	  renderingMode: 'full',
	  keepWhiteSpace: false,
	  parseTextContent: true,
	  throwGlobalError: false
	};

	_Component2.default._setGlobalOptionsGetter(function () {
	  return globalOptions;
	});
	_Events2.default._setGlobalOptionsGetter(function () {
	  return globalOptions;
	});

	// Expose all related class
	exports.Behavior = _Behavior2.default;
	exports.Element = _Element2.default;
	exports.TextNode = _TextNode2.default;
	exports.VirtualNode = _VirtualNode2.default;
	exports.Component = _Component2.default;
	exports.Observer = _Observer2.default;
	exports.globalOptions = globalOptions;

	// Register

	var registerBehavior = exports.registerBehavior = _Behavior2.default.create;
	var registerElement = exports.registerElement = _Component2.default.register;

	// Create node
	var createElement = exports.createElement = _Component2.default.create;
	var createTextNode = exports.createTextNode = _TextNode2.default.create;
	var createVirtualNode = exports.createVirtualNode = _VirtualNode2.default.create;

	// Dom manipulation
	var appendChild = exports.appendChild = _Element2.default.appendChild;
	var insertBefore = exports.insertBefore = _Element2.default.insertBefore;
	var removeChild = exports.removeChild = _Element2.default.removeChild;
	var replaceChild = exports.replaceChild = _Element2.default.replaceChild;

	// Event
	var addListenerToElement = exports.addListenerToElement = EventManager.addListenerToElement;
	var removeListenerFromElement = exports.removeListenerFromElement = EventManager.removeListenerFromElement;
	var triggerEvent = exports.triggerEvent = EventManager.triggerEvent;
	var addGlobalErrorListener = exports.addGlobalErrorListener = _Events2.default.addGlobalErrorListener;
	var removeGlobalErrorListener = exports.removeGlobalErrorListener = _Events2.default.removeGlobalErrorListener;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Events = function Events() {};
	var globalOptions = null;

	Events.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: Events,
	    writable: true,
	    configurable: true
	  }
	});

	Events._setGlobalOptionsGetter = function (opt) {
	  globalOptions = opt;
	};

	Events.create = function (type) {
	  var viewUtilObject = (0, _create2.default)(Events.prototype);
	  viewUtilObject.empty = true;
	  viewUtilObject._type = type;
	  viewUtilObject._arr = [];
	  viewUtilObject._index = 0;
	  return viewUtilObject;
	};

	Events.prototype.add = function (func) {
	  var id = this._index++;
	  this._arr.push({
	    id: id,
	    func: func
	  });
	  this.empty = false;
	  return id;
	};

	Events.prototype.remove = function (itemToRemove) {
	  var _arr = this._arr,
	      idx = 0;
	  if ('function' == typeof itemToRemove) {
	    for (idx = 0; idx < _arr.length; idx++) {
	      if (_arr[idx].func === itemToRemove) {
	        _arr.splice(idx, 1);
	        this.empty = !_arr.length;
	        return true;
	      }
	    }
	  } else {
	    for (idx = 0; idx < _arr.length; idx++) {
	      if (_arr[idx].id === itemToRemove) {
	        _arr.splice(idx, 1);
	        this.empty = !_arr.length;
	        return true;
	      }
	    }
	  }
	  return false;
	};

	Events.prototype.call = function (ele, args) {
	  var _arr = this._arr,
	      isCallFailed = false,
	      idx = 0;
	  for (; idx < _arr.length; idx++) {
	    var res = safeCallback(this._type, _arr[idx].func, ele, args);
	    res === false && (isCallFailed = true);
	  }
	  if (isCallFailed) {
	    return false;
	  }
	};

	var globalError = Events.create();
	var errHandle = function errHandle(err, errData) {
	  if (!errData.type || globalError.call(null, [err, errData]) !== false) {
	    console.error(errData.message);
	    if (globalOptions().throwGlobalError) {
	      throw err;
	    }
	    console.error(err.stack);
	  }
	};
	var safeCallback = function safeCallback(type, method, element, args) {
	  //以element执行注册的method
	  try {
	    return method.apply(element, args);
	  } catch (err) {
	    var message = 'Exparser ' + (type || 'Error Listener') + ' Error @ ';
	    element && (message += element.is);
	    message += '#' + (method.name || '(anonymous)');
	    errHandle(err, {
	      message: message,
	      type: type,
	      element: element,
	      method: method,
	      args: args
	    });
	  }
	};

	Events.safeCallback = safeCallback;

	Events.addGlobalErrorListener = function (func) {
	  return globalError.add(func);
	};

	Events.removeGlobalErrorListener = function (func) {
	  return globalError.remove(func);
	};

	exports.default = Events;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	var $Object = __webpack_require__(7).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(5)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(20)});

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(6)
	  , core      = __webpack_require__(7)
	  , ctx       = __webpack_require__(8)
	  , hide      = __webpack_require__(10)
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
/* 6 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(9);
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
/* 9 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(11)
	  , createDesc = __webpack_require__(19);
	module.exports = __webpack_require__(15) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(12)
	  , IE8_DOM_DEFINE = __webpack_require__(14)
	  , toPrimitive    = __webpack_require__(18)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(15) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(13);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 13 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(15) && !__webpack_require__(16)(function(){
	  return Object.defineProperty(__webpack_require__(17)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(16)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 16 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(13)
	  , document = __webpack_require__(6).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(13);
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
/* 19 */
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
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(12)
	  , dPs         = __webpack_require__(21)
	  , enumBugKeys = __webpack_require__(36)
	  , IE_PROTO    = __webpack_require__(33)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(17)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(37).appendChild(iframe);
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
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(11)
	  , anObject = __webpack_require__(12)
	  , getKeys  = __webpack_require__(22);

	module.exports = __webpack_require__(15) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(23)
	  , enumBugKeys = __webpack_require__(36);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(24)
	  , toIObject    = __webpack_require__(25)
	  , arrayIndexOf = __webpack_require__(29)(false)
	  , IE_PROTO     = __webpack_require__(33)('IE_PROTO');

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
/* 24 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(26)
	  , defined = __webpack_require__(28);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(27);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 28 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(25)
	  , toLength  = __webpack_require__(30)
	  , toIndex   = __webpack_require__(32);
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(31)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 31 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(34)('keys')
	  , uid    = __webpack_require__(35);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(6)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 36 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(6).document && document.documentElement;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	exports.triggerEvent = triggerEvent;
	exports.addListenerToElement = addListenerToElement;
	exports.removeListenerFromElement = removeListenerFromElement;

	var _Events = __webpack_require__(1);

	var _Events2 = _interopRequireDefault(_Events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var now = Date.now();

	function triggerEvent(target, type, detail, options) {
	  options = options || {};
	  var originalEvent = options.originalEvent,
	      bubbles = !options.bubbles,
	      composed = !options.composed,
	      extraFields = options.extraFields || {},
	      stopTarget = false,
	      timeStamp = Date.now() - now,
	      nTarget = target.__wxElement || target;

	  target === nTarget.shadowRoot && (nTarget = target);

	  var preventDefault = function preventDefault() {
	    originalEvent && originalEvent.preventDefault();
	  };

	  var stopPropagation = function stopPropagation() {
	    stopTarget = true;
	  };

	  var eventOpt = {
	    target: nTarget,
	    currentTarget: nTarget,
	    type: type,
	    timeStamp: timeStamp,
	    detail: detail,
	    preventDefault: preventDefault,
	    stopPropagation: stopPropagation
	  };

	  for (var f in extraFields) {
	    eventOpt[f] = extraFields[f];
	  }

	  var exeEvent = function exeEvent(event, targetEle) {
	    eventOpt.currentTarget = targetEle;
	    var res = event.call(targetEle, [eventOpt]);
	    if (res === !1) {
	      preventDefault();
	      stopTarget = !0;
	    }
	  };
	  var targetParent = nTarget.parentNode;
	  var targetEle = nTarget;

	  var goAhead = function goAhead() {
	    if (targetEle) {
	      targetParent === targetEle && (targetParent = targetEle.parentNode);
	      if (targetEle.__wxEvents) {
	        targetEle.__wxEvents[type] && exeEvent(targetEle.__wxEvents[type], targetEle);
	      }
	      return !bubbles && !stopTarget;
	    }
	    return false;
	  };

	  for (; goAhead();) {
	    if (targetEle.__host) {
	      if (composed) break;
	      if (!(targetParent && targetParent.__domElement)) {
	        targetParent = targetEle.__host;
	        eventOpt.target = targetParent;
	      }
	      targetEle = targetEle.__host;
	    } else {
	      var isDomOrVirtualEle = !0;
	      if (targetEle.__domElement || targetEle.__virtual) {
	        isDomOrVirtualEle = !1;
	      }
	      targetEle = isDomOrVirtualEle || composed ? targetEle.parentNode : targetEle.__slotParent;
	    }
	  }
	}

	function addListenerToElement(ele, eventName, handler) {
	  var targetEle = ele.__wxElement || ele;
	  ele === targetEle.shadowRoot && (targetEle = ele);
	  targetEle.__wxEvents || (targetEle.__wxEvents = (0, _create2.default)(null));
	  targetEle.__wxEvents[eventName] || (targetEle.__wxEvents[eventName] = _Events2.default.create('Event Listener'));
	  return targetEle.__wxEvents[eventName].add(handler);
	}

	function removeListenerFromElement(ele, eventName, handler) {
	  var targetEle = ele.__wxElement || ele;
	  ele === targetEle.shadowRoot && (targetEle = ele);
	  targetEle.__wxEvents && targetEle.__wxEvents[eventName] && targetEle.__wxEvents[eventName].remove(handler);
	}

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _Events = __webpack_require__(1);

	var _Events2 = _interopRequireDefault(_Events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Behavior = function Behavior() {};

	Behavior.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: Behavior,
	    writable: true,
	    configurable: true
	  }
	});

	var cycle = ['created', 'attached', 'detached'];
	var index = 1;

	// registerBehavior
	Behavior.create = function (opt) {
	  var id = String(index++);
	  var insBehavior = Behavior.list[opt.is || ''] = (0, _create2.default)(Behavior.prototype, {
	    is: {
	      value: opt.is || ''
	    },
	    _id: {
	      value: id
	    }
	  });
	  insBehavior.template = opt.template;
	  insBehavior.properties = (0, _create2.default)(null);
	  insBehavior.methods = (0, _create2.default)(null);
	  insBehavior.listeners = (0, _create2.default)(null);
	  var ancestors = insBehavior.ancestors = [],
	      prop = '',
	      idx = 0;
	  for (; idx < (opt.behaviors || []).length; idx++) {
	    var currBehavior = opt.behaviors[idx];
	    typeof currBehavior === 'string' && (currBehavior = Behavior.list[currBehavior]);
	    for (prop in currBehavior.properties) {
	      insBehavior.properties[prop] = currBehavior.properties[prop];
	    }
	    for (prop in currBehavior.methods) {
	      insBehavior.methods[prop] = currBehavior.methods[prop];
	    }
	    for (var ancestorIte = 0; ancestorIte < currBehavior.ancestors.length; ancestorIte++) {
	      if (ancestors.indexOf(currBehavior.ancestors[ancestorIte]) < 0) {
	        ancestors.push(currBehavior.ancestors[ancestorIte]);
	      }
	    }
	  }
	  for (prop in opt.properties) {
	    insBehavior.properties[prop] = opt.properties[prop];
	  }
	  for (prop in opt.listeners) {
	    insBehavior.listeners[prop] = opt.listeners[prop];
	  }
	  for (prop in opt) {
	    if (typeof opt[prop] === 'function') {
	      if (cycle.indexOf(prop) < 0) {
	        insBehavior.methods[prop] = opt[prop];
	      } else {
	        insBehavior[prop] = opt[prop];
	      }
	    }
	  }
	  ancestors.push(insBehavior);
	  return insBehavior;
	};

	Behavior.list = (0, _create2.default)(null);

	Behavior.prototype.hasBehavior = function (beh) {
	  for (var idx = 0; idx < this.ancestors.length; idx++) {
	    if (this.ancestors[idx].is === beh) {
	      return true;
	    }
	  }
	  return false;
	};

	Behavior.prototype.getAllListeners = function () {
	  var tempObj = (0, _create2.default)(null),
	      ancestors = this.ancestors,
	      idx = 0;
	  for (; idx < ancestors.length; idx++) {
	    var ancestor = this.ancestors[idx];
	    for (var listener in ancestor.listeners) {
	      if (tempObj[listener]) {
	        tempObj[listener].push(ancestor.listeners[listener]);
	      } else {
	        tempObj[listener] = [ancestor.listeners[listener]];
	      }
	    }
	  }
	  return tempObj;
	};

	Behavior.prototype.getAllLifeTimeFuncs = function () {
	  var tempObj = (0, _create2.default)(null),
	      ancestors = this.ancestors;
	  cycle.forEach(function (cyc) {
	    var lifeTimeFunc = tempObj[cyc] = _Events2.default.create('Lifetime Method'),
	        idx = 0;
	    for (; idx < ancestors.length; idx++) {
	      var ancestor = ancestors[idx];
	      ancestor[cyc] && lifeTimeFunc.add(ancestor[cyc]);
	    }
	  });
	  return tempObj;
	};

	exports.default = Behavior;

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _EventManager = __webpack_require__(38);

	var EventManager = _interopRequireWildcard(_EventManager);

	var _Observer = __webpack_require__(41);

	var _Observer2 = _interopRequireDefault(_Observer);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Element = function Element() {};
	Element.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: Element,
	    writable: true,
	    configurable: true
	  }
	});

	var componentSystem = null;
	Element._setCompnentSystem = function (componentSys) {
	  componentSystem = componentSys;
	};
	Element.initialize = function (ele) {
	  ele.__attached = false;
	  ele.parentNode = null;
	  ele.childNodes = [];
	  ele.__slotParent = null;
	  ele.__slotChildren = ele.childNodes;
	  ele.__subtreeObserversCount = 0;
	};

	var attachedElement = function attachedElement(ele) {
	  if (!ele.parentNode || ele.parentNode.__attached) {
	    var setAttachedRecursively = function setAttachedRecursively(ele) {
	      ele.__attached = !0;
	      ele.shadowRoot instanceof Element && setAttachedRecursively(ele.shadowRoot);
	      var childNodes = ele.childNodes;
	      if (childNodes) {
	        for (var idx = 0; idx < childNodes.length; idx++) {
	          setAttachedRecursively(childNodes[idx]);
	        }
	      }
	    };
	    setAttachedRecursively(ele);

	    var callAttachedLifeTimeFuncRecursively = function callAttachedLifeTimeFuncRecursively(ele) {
	      ele.__lifeTimeFuncs && componentSystem._callLifeTimeFuncs(ele, 'attached');
	      ele.shadowRoot instanceof Element && callAttachedLifeTimeFuncRecursively(ele.shadowRoot);
	      var childNodes = ele.childNodes;
	      if (childNodes) {
	        for (var idx = 0; idx < childNodes.length; idx++) {
	          callAttachedLifeTimeFuncRecursively(childNodes[idx]);
	        }
	      }
	    };
	    callAttachedLifeTimeFuncRecursively(ele);
	  }
	};
	var detachedElement = function detachedElement(ele) {
	  if (ele.__attached) {
	    var detachRecursively = function detachRecursively(ele) {
	      ele.__attached = !1;
	      ele.shadowRoot instanceof Element && detachRecursively(ele.shadowRoot);
	      var childNodes = ele.childNodes;
	      if (childNodes) {
	        for (var idx = 0; idx < childNodes.length; idx++) {
	          detachRecursively(childNodes[idx]);
	        }
	      }
	    };
	    detachRecursively(ele);

	    var callLifeTimeFuncRecursively = function callLifeTimeFuncRecursively(ele) {
	      ele.__lifeTimeFuncs && componentSystem._callLifeTimeFuncs(ele, 'detached');
	      ele.shadowRoot instanceof Element && callLifeTimeFuncRecursively(ele.shadowRoot);
	      var childNodes = ele.childNodes;
	      if (childNodes) {
	        for (var idx = 0; idx < childNodes.length; idx++) {
	          callLifeTimeFuncRecursively(childNodes[idx]);
	        }
	      }
	    };
	    callLifeTimeFuncRecursively(ele);
	  }
	};
	var childObserver = function childObserver(ele, observerName, targetNode) {
	  if (ele.__childObservers && !ele.__childObservers.empty || ele.__subtreeObserversCount) {
	    var opt = null;
	    if (observerName === 'add') {
	      opt = {
	        type: 'childList',
	        target: ele,
	        addedNodes: [targetNode]
	      };
	    } else {
	      opt = {
	        type: 'childList',
	        target: ele,
	        removedNodes: [targetNode]
	      };
	    }
	    _Observer2.default._callObservers(ele, '__childObservers', opt);
	  }
	};
	var attachShadowRoot = function attachShadowRoot(originalParentNode, newNode, oldNode, willRemoveOldNode) {
	  var copyOfOriginalElement = originalParentNode;
	  //从父节点中找出非virtual节点为copyOfOriginalElement
	  if (copyOfOriginalElement instanceof Element) {
	    for (; copyOfOriginalElement.__virtual;) {
	      var slotParent = copyOfOriginalElement.__slotParent;
	      if (!slotParent) {
	        return;
	      }
	      if (newNode && !oldNode) {
	        var oldNodeIdx = slotParent.__slotChildren.indexOf(copyOfOriginalElement);
	        oldNode = slotParent.__slotChildren[oldNodeIdx + 1];
	      }
	      copyOfOriginalElement = slotParent;
	    }
	    copyOfOriginalElement instanceof Element && (copyOfOriginalElement = copyOfOriginalElement.__domElement);
	  }

	  var newDomEle = null;
	  if (newNode) {
	    if (newNode.__virtual) {
	      var fragment = document.createDocumentFragment();
	      var appendDomElement = function appendDomElement(ele) {
	        for (var slotChildIdx = 0; slotChildIdx < ele.__slotChildren.length; slotChildIdx++) {
	          var slotChild = ele.__slotChildren[slotChildIdx];
	          slotChild.__virtual ? appendDomElement(slotChild) : fragment.appendChild(slotChild.__domElement);
	        }
	      };
	      appendDomElement(newNode);
	      newDomEle = fragment;
	    } else {
	      newDomEle = newNode.__domElement;
	    }
	  }

	  var oldDomEle = null;
	  if (oldNode) {
	    if (oldNode.__virtual) {
	      var origParentNode = originalParentNode;
	      var _oldNodeIdx = 0;
	      if (willRemoveOldNode) {
	        var removeDomElement = function removeDomElement(ele) {
	          for (var slotChildIdx = 0; slotChildIdx < ele.__slotChildren.length; slotChildIdx++) {
	            var slotChild = ele.__slotChildren[slotChildIdx];
	            slotChild.__virtual ? removeDomElement(slotChild) : copyOfOriginalElement.removeChild(slotChild.__domElement);
	          }
	        };
	        removeDomElement(oldNode);
	        willRemoveOldNode = !1;
	        _oldNodeIdx = originalParentNode.__slotChildren.indexOf(oldNode) + 1;
	      } else {
	        origParentNode = oldNode.__slotParent;
	        _oldNodeIdx = origParentNode.__slotChildren.indexOf(oldNode);
	      }
	      if (newNode) {
	        var findNonVirtualNode = function findNonVirtualNode(ele, idx) {
	          for (; idx < ele.__slotChildren.length; idx++) {
	            var slotChild = ele.__slotChildren[idx];
	            if (!slotChild.__virtual) {
	              return slotChild;
	            }
	            var childNode = findNonVirtualNode(slotChild, 0);
	            if (childNode) {
	              return childNode;
	            }
	          }
	        };
	        oldNode = null;
	        var nOrigParentNode = origParentNode;
	        for (; oldNode = findNonVirtualNode(nOrigParentNode, _oldNodeIdx), !oldNode && nOrigParentNode.__virtual; nOrigParentNode = nOrigParentNode.__slotParent) {
	          _oldNodeIdx = nOrigParentNode.__slotParent.__slotChildren.indexOf(nOrigParentNode) + 1;
	        }
	        oldNode && (oldDomEle = oldNode.__domElement); //??是否存在的!oldNode 但nOrigParentNode.__virtual为false?
	      }
	    } else {
	      oldDomEle = oldNode.__domElement;
	    }
	  }

	  if (willRemoveOldNode) {
	    newDomEle ? copyOfOriginalElement.replaceChild(newDomEle, oldDomEle) : copyOfOriginalElement.removeChild(oldDomEle);
	  } else {
	    newDomEle && (oldDomEle ? copyOfOriginalElement.insertBefore(newDomEle, oldDomEle) : copyOfOriginalElement.appendChild(newDomEle));
	  }
	};
	var updateSubtree = function updateSubtree(ele, newNode, oldNode, willRemoveOldNode) {
	  var oldNodeIndex = -1;

	  if (oldNode) {
	    oldNodeIndex = ele.childNodes.indexOf(oldNode);
	    if (oldNodeIndex < 0) {
	      return false;
	    }
	  }

	  if (willRemoveOldNode) {
	    if (newNode === oldNode) {
	      willRemoveOldNode = !1;
	    } else {
	      if (ele.__subtreeObserversCount) {
	        _Observer2.default._updateSubtreeCaches(oldNode, -ele.__subtreeObserversCount);
	      }
	      oldNode.parentNode = null;
	      oldNode.__slotParent = null;
	    }
	  }

	  var parentNode = null;
	  var originalParentNode = ele;
	  ele.__slots && (originalParentNode = ele.__slots['']);

	  if (newNode) {
	    parentNode = newNode.parentNode;
	    newNode.parentNode = ele;
	    newNode.__slotParent = originalParentNode;
	    var subtreeObserversCount = ele.__subtreeObserversCount;
	    if (parentNode) {
	      var originalIndexOfNewNode = parentNode.childNodes.indexOf(newNode);
	      parentNode.childNodes.splice(originalIndexOfNewNode, 1);
	      parentNode === ele && originalIndexOfNewNode < oldNodeIndex && oldNodeIndex--;
	      subtreeObserversCount -= parentNode.__subtreeObserversCount;
	    }
	    subtreeObserversCount && _Observer2.default._updateSubtreeCaches(newNode, subtreeObserversCount);
	  }
	  attachShadowRoot(originalParentNode, newNode, oldNode, willRemoveOldNode);
	  oldNodeIndex === -1 && (oldNodeIndex = ele.childNodes.length);
	  if (newNode) {
	    ele.childNodes.splice(oldNodeIndex, willRemoveOldNode ? 1 : 0, newNode);
	  } else {
	    ele.childNodes.splice(oldNodeIndex, willRemoveOldNode ? 1 : 0);
	  }
	  if (willRemoveOldNode) {
	    detachedElement(oldNode);
	    childObserver(ele, 'remove', oldNode);
	  }

	  if (newNode) {
	    if (parentNode) {
	      detachedElement(newNode);
	      childObserver(parentNode, 'remove', newNode);
	    }
	    attachedElement(newNode);
	    childObserver(ele, 'add', newNode);
	  }

	  return true;
	};
	var childHandle = function childHandle(element, newNode, oldNode, willRemoveOldNode) {
	  var retNode = willRemoveOldNode ? oldNode : newNode;
	  var isDone = updateSubtree(element, newNode, oldNode, willRemoveOldNode);
	  return isDone ? retNode : null;
	};

	Element._attachShadowRoot = function (ele, node) {
	  attachShadowRoot(ele, node, null, !1);
	};
	Element.appendChild = function (ele, newChild) {
	  return childHandle(ele, newChild, null, false);
	};
	Element.insertBefore = function (ele, newNode, refNode) {
	  return childHandle(ele, newNode, refNode, false);
	};
	Element.removeChild = function (ele, removedChild) {
	  return childHandle(ele, null, removedChild, true);
	};
	Element.replaceChild = function (ele, newNode, oldNode) {
	  return childHandle(ele, newNode, oldNode, true);
	};
	Element.replaceDocumentElement = function (ele, oldChild) {
	  if (!ele.__attached) {
	    oldChild.parentNode.replaceChild(ele.__domElement, oldChild);
	    attachedElement(ele);
	  }
	};

	Element.prototype.appendChild = function (child) {
	  return childHandle(this, child, null, false);
	};
	Element.prototype.insertBefore = function (newChild, targetChild) {
	  return childHandle(this, newChild, targetChild, false);
	};
	Element.prototype.removeChild = function (targetChild) {
	  return childHandle(this, null, targetChild, true);
	};
	Element.prototype.replaceChild = function (newChild, targetChild) {
	  return childHandle(this, newChild, targetChild, true);
	};
	Element.prototype.triggerEvent = function (type, detail, opt) {
	  EventManager.triggerEvent(this, type, detail, opt);
	};
	Element.prototype.addListener = function (eventName, handler) {
	  EventManager.addListenerToElement(this, eventName, handler);
	};
	Element.prototype.removeListener = function (eventName, handler) {
	  EventManager.removeListenerFromElement(this, eventName, handler);
	};
	Element.prototype.hasBehavior = function (behavior) {
	  return !!this.__behavior && this.__behavior.hasBehavior(behavior);
	};

	exports.default = Element;

/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _Events = __webpack_require__(1);

	var _Events2 = _interopRequireDefault(_Events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Observer = function Observer() {};

	Observer.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: Observer,
	    writable: true,
	    configurable: true
	  }
	});

	Observer.create = function (cb) {
	  var tempObj = (0, _create2.default)(Observer.prototype);
	  tempObj._cb = cb;
	  tempObj._noSubtreeCb = function (opt) {
	    opt.target === this && cb.call(this, opt);
	  };
	  tempObj._binded = [];
	  return tempObj;
	};

	var updateSubtreeCaches = Observer._updateSubtreeCaches = function (ele, count) {
	  ele.__subtreeObserversCount += count;
	  var childNodes = ele.childNodes;
	  if (childNodes) {
	    for (var idx = 0; idx < childNodes.length; idx++) {
	      updateSubtreeCaches(childNodes[idx], count);
	    }
	  }
	};

	Observer.prototype.observe = function (ele, opt) {
	  opt = opt || {};
	  var count = 0;
	  var subtree = opt.subtree ? this._cb : this._noSubtreeCb;
	  if (opt.properties) {
	    ele.__propObservers || (ele.__propObservers = _Events2.default.create('Observer Callback'));
	    this._binded.push({
	      funcArr: ele.__propObservers,
	      id: ele.__propObservers.add(subtree),
	      subtree: opt.subtree ? ele : null
	    });
	    count++;
	  }
	  if (opt.childList) {
	    ele.__childObservers || (ele.__childObservers = _Events2.default.create('Observer Callback'));
	    this._binded.push({
	      funcArr: ele.__childObservers,
	      id: ele.__childObservers.add(subtree),
	      subtree: opt.subtree ? ele : null
	    });
	    count++;
	  }

	  if (opt.characterData) {
	    ele.__textObservers || (ele.__textObservers = _Events2.default.create('Observer Callback'));
	    this._binded.push({
	      funcArr: ele.__textObservers,
	      id: ele.__textObservers.add(subtree),
	      subtree: opt.subtree ? ele : null
	    });
	    count++;
	  }
	  opt.subtree && updateSubtreeCaches(ele, count);
	};

	Observer.prototype.disconnect = function () {
	  var bound = this._binded;
	  var idx = 0;
	  for (; idx < bound.length; idx++) {
	    var boundObserver = bound[idx];
	    boundObserver.funcArr.remove(boundObserver.id);
	    boundObserver.subtree && updateSubtreeCaches(boundObserver.subtree, -1);
	  }
	  this._binded = [];
	};

	Observer._callObservers = function (ele, observeName, opt) {
	  do {
	    ele[observeName] && ele[observeName].call(ele, [opt]);
	    ele = ele.parentNode;
	  } while (ele && ele.__subtreeObserversCount);
	};

	exports.default = Observer;

/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(43);

	var _keys2 = _interopRequireDefault(_keys);

	var _typeof2 = __webpack_require__(48);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _stringify = __webpack_require__(82);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _Events = __webpack_require__(1);

	var _Events2 = _interopRequireDefault(_Events);

	var _EventManager = __webpack_require__(38);

	var EventManager = _interopRequireWildcard(_EventManager);

	var _Template = __webpack_require__(84);

	var _Template2 = _interopRequireDefault(_Template);

	var _Behavior = __webpack_require__(39);

	var _Behavior2 = _interopRequireDefault(_Behavior);

	var _Element = __webpack_require__(40);

	var _Element2 = _interopRequireDefault(_Element);

	var _Observer = __webpack_require__(41);

	var _Observer2 = _interopRequireDefault(_Observer);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function camelToDashed(txt) {
	  return txt.replace(/[A-Z]/g, function (ch) {
	    return '-' + ch.toLowerCase();
	  });
	}

	var addListenerToElement = EventManager.addListenerToElement;

	var Component = function Component() {};

	Component.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: Component,
	    writable: true,
	    configurable: true
	  }
	});

	Component.list = (0, _create2.default)(null);
	_Template2.default._setCompnentSystem(Component);
	_Element2.default._setCompnentSystem(Component);

	Component._setGlobalOptionsGetter = function (GlobalOptionsGetter) {
	  _Template2.default._setGlobalOptionsGetter(GlobalOptionsGetter);
	};

	// attribute(this, prop, propKey, value)
	var setAttribute = function setAttribute(ele, opt, propKey, value) {
	  var propName = camelToDashed(propKey);
	  if (opt.type === Boolean) {
	    value ? ele.__domElement.setAttribute(propName, '') : ele.__domElement.removeAttribute(propName);
	  } else {
	    if (opt.type !== Object) {
	      if (opt.type === Array) {
	        ele.__domElement.setAttribute(propName, (0, _stringify2.default)(value));
	      } else {
	        ele.__domElement.setAttribute(propName, value);
	      }
	    }
	  }
	};

	var normalizeValue = function normalizeValue(value, type) {
	  //根据type,格式化value
	  if (type === String) {
	    return value === null || undefined === value ? '' : String(value);
	  } else {
	    if (type === Number) {
	      return isFinite(value) ? Number(value) : false;
	    } else {
	      if (type === Boolean) {
	        return !!value;
	      } else {
	        if (type === Array) {
	          return value instanceof Array ? value : [];
	        } else {
	          return (typeof value === 'undefined' ? 'undefined' : (0, _typeof3.default)(value)) === 'object' ? value : null;
	        }
	      }
	    }
	  }
	};

	// registerElement
	Component.register = function (nElement) {
	  var opts = nElement.options || {};
	  var propDefination = {
	    is: {
	      value: nElement.is || ''
	    }
	  };
	  var componentBehavior = _Behavior2.default.create(nElement);
	  var behaviorProperties = (0, _create2.default)(null);

	  (0, _keys2.default)(componentBehavior.properties).forEach(function (propKey) {
	    var behaviorProperty = componentBehavior.properties[propKey];
	    behaviorProperty !== String && behaviorProperty !== Number && behaviorProperty !== Boolean && behaviorProperty !== Object && behaviorProperty !== Array || (behaviorProperty = {
	      type: behaviorProperty
	    });
	    if (undefined === behaviorProperty.value) {
	      behaviorProperty.type === String ? behaviorProperty.value = '' : behaviorProperty.type === Number ? behaviorProperty.value = 0 : behaviorProperty.type === Boolean ? behaviorProperty.value = !1 : behaviorProperty.type === Array ? behaviorProperty.value = [] : behaviorProperty.value = null;
	    }

	    behaviorProperties[propKey] = {
	      type: behaviorProperty.type,
	      value: behaviorProperty.value,
	      coerce: componentBehavior.methods[behaviorProperty.coerce],
	      observer: componentBehavior.methods[behaviorProperty.observer],
	      public: !!behaviorProperty.public
	    };

	    propDefination[propKey] = {
	      enumerable: true,
	      get: function get() {
	        var propData = this.__propData[propKey];
	        return void 0 === propData ? behaviorProperties[propKey].value : propData;
	      },
	      set: function set(value) {
	        var behProp = behaviorProperties[propKey];
	        value = normalizeValue(value, behProp.type);
	        var propData = this.__propData[propKey];

	        if (behProp.coerce) {
	          var realVal = _Events2.default.safeCallback('Property Filter', behProp.coerce, this, [value, propData]);
	          void 0 !== realVal && (value = realVal);
	        }

	        if (value !== propData) {
	          // value changed
	          this.__propData[propKey] = value;
	          behProp.public && setAttribute(this, behProp, propKey, value);
	          this.__templateInstance.updateValues(this, this.__propData, propKey);
	          behProp.observer && _Events2.default.safeCallback('Property Observer', behProp.observer, this, [value, propData]);
	          if (behProp.public) {
	            if (this.__propObservers && !this.__propObservers.empty || this.__subtreeObserversCount) {
	              _Observer2.default._callObservers(this, '__propObservers', {
	                type: 'properties',
	                target: this,
	                propertyName: propKey
	              });
	            }
	          }
	        }
	      }
	    };
	  });

	  var proto = (0, _create2.default)(_Element2.default.prototype, propDefination);
	  proto.__behavior = componentBehavior;
	  for (var methodName in componentBehavior.methods) {
	    proto[methodName] = componentBehavior.methods[methodName];
	  }
	  proto.__lifeTimeFuncs = componentBehavior.getAllLifeTimeFuncs();
	  var publicProps = (0, _create2.default)(null),
	      defaultValuesJSON = {};
	  for (var propName in behaviorProperties) {
	    defaultValuesJSON[propName] = behaviorProperties[propName].value;
	    publicProps[propName] = !!behaviorProperties[propName].public;
	  }

	  var insElement = document.getElementById(componentBehavior.is);
	  if (!componentBehavior.template && insElement && insElement.tagName === 'TEMPLATE') {} else {
	    insElement = document.createElement('template');
	    insElement.innerHTML = componentBehavior.template || '';
	  }

	  var template = _Template2.default.create(insElement, defaultValuesJSON, componentBehavior.methods, opts);
	  proto.__propPublic = publicProps;
	  var allListeners = componentBehavior.getAllListeners(),
	      innerEvents = (0, _create2.default)(null);
	  for (var listenerName in allListeners) {
	    var listener = allListeners[listenerName],
	        eventList = [],
	        idx = 0;
	    for (; idx < listener.length; idx++) {
	      eventList.push(componentBehavior.methods[listener[idx]]);
	    }
	    innerEvents[listenerName] = eventList;
	  }
	  Component.list[componentBehavior.is] = {
	    proto: proto,
	    template: template,
	    defaultValuesJSON: (0, _stringify2.default)(defaultValuesJSON),
	    innerEvents: innerEvents
	  };
	};

	// createElement
	Component.create = function (tagName) {
	  tagName = tagName ? tagName.toLowerCase() : 'virtual';
	  var newElement = document.createElement(tagName);
	  var sysComponent = Component.list[tagName] || Component.list[''];
	  var newComponent = (0, _create2.default)(sysComponent.proto);

	  _Element2.default.initialize(newComponent);
	  newComponent.__domElement = newElement;
	  newElement.__wxElement = newComponent;
	  newComponent.__propData = JSON.parse(sysComponent.defaultValuesJSON);
	  var templateInstance = newComponent.__templateInstance = sysComponent.template.createInstance(newComponent);

	  if (templateInstance.shadowRoot instanceof _Element2.default) {
	    //VirtualNode
	    _Element2.default._attachShadowRoot(newComponent, templateInstance.shadowRoot);
	    newComponent.shadowRoot = templateInstance.shadowRoot;
	    newComponent.__slotChildren = [templateInstance.shadowRoot];
	    templateInstance.shadowRoot.__slotParent = newComponent;
	  } else {
	    newComponent.__domElement.appendChild(templateInstance.shadowRoot);
	    newComponent.shadowRoot = newElement;
	    newComponent.__slotChildren = newElement.childNodes;
	  }

	  newComponent.shadowRoot.__host = newComponent;
	  newComponent.$ = templateInstance.idMap;
	  newComponent.$$ = newElement;
	  templateInstance.slots[''] || (templateInstance.slots[''] = newElement);
	  newComponent.__slots = templateInstance.slots;
	  newComponent.__slots[''].__slotChildren = newComponent.childNodes;

	  var innerEvents = sysComponent.innerEvents;
	  for (var innerEventName in innerEvents) {
	    var innerEventNameSlice = innerEventName.split('.', 2);
	    var listenerName = innerEventNameSlice[innerEventNameSlice.length - 1];
	    var nComponent = newComponent;
	    var isComponentNotTouched = true;
	    if (innerEventNameSlice.length === 2) {
	      if (innerEventNameSlice[0] !== '') {
	        isComponentNotTouched = !1;
	        innerEventNameSlice[0] !== 'this' && (nComponent = newComponent.$[innerEventNameSlice[0]]);
	      }
	    }
	    if (nComponent) {
	      var innerEvent = innerEvents[innerEventName],
	          listenerIdx = 0;
	      for (; listenerIdx < innerEvent.length; listenerIdx++) {
	        if (isComponentNotTouched) {
	          addListenerToElement(nComponent.shadowRoot, listenerName, innerEvent[listenerIdx].bind(newComponent));
	        } else {
	          addListenerToElement(nComponent, listenerName, innerEvent[listenerIdx].bind(newComponent));
	        }
	      }
	    }
	  }
	  Component._callLifeTimeFuncs(newComponent, 'created');
	  return newComponent;
	};
	Component.hasProperty = function (ele, propName) {
	  return undefined !== ele.__propPublic[propName];
	};
	Component.hasPublicProperty = function (ele, propName) {
	  return ele.__propPublic[propName] === !0;
	};
	Component._callLifeTimeFuncs = function (ele, funcName) {
	  var func = ele.__lifeTimeFuncs[funcName];
	  func.call(ele, []);
	};
	Component.register({
	  is: '',
	  template: '<wx-content></wx-content>',
	  properties: {}
	});

	exports.default = Component;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(44), __esModule: true };

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(45);
	module.exports = __webpack_require__(7).Object.keys;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(46)
	  , $keys    = __webpack_require__(22);

	__webpack_require__(47)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(28);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(5)
	  , core    = __webpack_require__(7)
	  , fails   = __webpack_require__(16);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(49);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(66);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(50), __esModule: true };

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(51);
	__webpack_require__(61);
	module.exports = __webpack_require__(65).f('iterator');

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(52)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(53)(String, 'String', function(iterated){
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
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(31)
	  , defined   = __webpack_require__(28);
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
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(54)
	  , $export        = __webpack_require__(5)
	  , redefine       = __webpack_require__(55)
	  , hide           = __webpack_require__(10)
	  , has            = __webpack_require__(24)
	  , Iterators      = __webpack_require__(56)
	  , $iterCreate    = __webpack_require__(57)
	  , setToStringTag = __webpack_require__(58)
	  , getPrototypeOf = __webpack_require__(60)
	  , ITERATOR       = __webpack_require__(59)('iterator')
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
/* 54 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(10);

/***/ }),
/* 56 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(20)
	  , descriptor     = __webpack_require__(19)
	  , setToStringTag = __webpack_require__(58)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(10)(IteratorPrototype, __webpack_require__(59)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(11).f
	  , has = __webpack_require__(24)
	  , TAG = __webpack_require__(59)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(34)('wks')
	  , uid        = __webpack_require__(35)
	  , Symbol     = __webpack_require__(6).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(24)
	  , toObject    = __webpack_require__(46)
	  , IE_PROTO    = __webpack_require__(33)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(62);
	var global        = __webpack_require__(6)
	  , hide          = __webpack_require__(10)
	  , Iterators     = __webpack_require__(56)
	  , TO_STRING_TAG = __webpack_require__(59)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(63)
	  , step             = __webpack_require__(64)
	  , Iterators        = __webpack_require__(56)
	  , toIObject        = __webpack_require__(25);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(53)(Array, 'Array', function(iterated, kind){
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
/* 63 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 64 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(59);

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(67), __esModule: true };

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(68);
	__webpack_require__(79);
	__webpack_require__(80);
	__webpack_require__(81);
	module.exports = __webpack_require__(7).Symbol;

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(6)
	  , has            = __webpack_require__(24)
	  , DESCRIPTORS    = __webpack_require__(15)
	  , $export        = __webpack_require__(5)
	  , redefine       = __webpack_require__(55)
	  , META           = __webpack_require__(69).KEY
	  , $fails         = __webpack_require__(16)
	  , shared         = __webpack_require__(34)
	  , setToStringTag = __webpack_require__(58)
	  , uid            = __webpack_require__(35)
	  , wks            = __webpack_require__(59)
	  , wksExt         = __webpack_require__(65)
	  , wksDefine      = __webpack_require__(70)
	  , keyOf          = __webpack_require__(71)
	  , enumKeys       = __webpack_require__(72)
	  , isArray        = __webpack_require__(75)
	  , anObject       = __webpack_require__(12)
	  , toIObject      = __webpack_require__(25)
	  , toPrimitive    = __webpack_require__(18)
	  , createDesc     = __webpack_require__(19)
	  , _create        = __webpack_require__(20)
	  , gOPNExt        = __webpack_require__(76)
	  , $GOPD          = __webpack_require__(78)
	  , $DP            = __webpack_require__(11)
	  , $keys          = __webpack_require__(22)
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
	  __webpack_require__(77).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(74).f  = $propertyIsEnumerable;
	  __webpack_require__(73).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(54)){
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(10)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(35)('meta')
	  , isObject = __webpack_require__(13)
	  , has      = __webpack_require__(24)
	  , setDesc  = __webpack_require__(11).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(16)(function(){
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
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(6)
	  , core           = __webpack_require__(7)
	  , LIBRARY        = __webpack_require__(54)
	  , wksExt         = __webpack_require__(65)
	  , defineProperty = __webpack_require__(11).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(22)
	  , toIObject = __webpack_require__(25);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(22)
	  , gOPS    = __webpack_require__(73)
	  , pIE     = __webpack_require__(74);
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
/* 73 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 74 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(27);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(25)
	  , gOPN      = __webpack_require__(77).f
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
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(23)
	  , hiddenKeys = __webpack_require__(36).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(74)
	  , createDesc     = __webpack_require__(19)
	  , toIObject      = __webpack_require__(25)
	  , toPrimitive    = __webpack_require__(18)
	  , has            = __webpack_require__(24)
	  , IE8_DOM_DEFINE = __webpack_require__(14)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(15) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 79 */
/***/ (function(module, exports) {

	

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(70)('asyncIterator');

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(70)('observable');

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(7)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _BoundProps = __webpack_require__(85);

	var _BoundProps2 = _interopRequireDefault(_BoundProps);

	var _TemplateExparser = __webpack_require__(86);

	var _TemplateExparser2 = _interopRequireDefault(_TemplateExparser);

	var _Element = __webpack_require__(40);

	var _Element2 = _interopRequireDefault(_Element);

	var _SlotNode = __webpack_require__(87);

	var _SlotNode2 = _interopRequireDefault(_SlotNode);

	var _VirtualNode = __webpack_require__(88);

	var _VirtualNode2 = _interopRequireDefault(_VirtualNode);

	var _TextNode = __webpack_require__(89);

	var _TextNode2 = _interopRequireDefault(_TextNode);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dollarSign = String.fromCharCode(36);

	function dashToCamel(txt) {
	  return txt.replace(/-([a-z])/g, function (match, p1) {
	    return p1.toUpperCase();
	  });
	}

	var Instance = function Instance() {};
	Instance.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: Instance,
	    writable: true,
	    configurable: true
	  }
	});

	function getAttributes(attributes) {
	  var tempObj = (0, _create2.default)(null);
	  var idx = 0;
	  for (; idx < attributes.length; idx++) {
	    tempObj[attributes[idx].name] = attributes[idx].value;
	  }
	  return tempObj;
	}

	var setObjAttr = function setObjAttr(obj, key, value) {
	  obj[key] = value;
	};

	function childrenAppend(nodes, shadowRoot, idMap, slots, binding) {
	  //把nodes追加到shadowRoot下
	  var newNode = null,
	      attrIdx = 0,
	      attr = null,
	      rootIdx = 0;
	  for (; rootIdx < nodes.length; rootIdx++) {
	    var node = nodes[rootIdx];
	    if (node.name === undefined) {
	      newNode = _TextNode2.default.create(node.text);
	      node.exp && binding.add(node.exp, newNode.__domElement, 'textContent', setObjAttr);
	      _Element2.default.appendChild(shadowRoot, newNode);
	    } else {
	      var attributes = node.attrs;
	      if (node.name === 'virtual') {
	        newNode = _VirtualNode2.default.create(node.virtual);
	      } else if (node.custom) {
	        newNode = componentSystem.create(node.name);
	        attrIdx = 0;
	        for (; attrIdx < attributes.length; attrIdx++) {
	          attr = attributes[attrIdx];
	          if (attr.updater) {
	            attr.updater(newNode, attr.name, attr.value);
	          } else {
	            if (newNode.__behavior.properties[attr.name].type === Boolean) {
	              newNode[attr.name] = !0;
	            } else {
	              newNode[attr.name] = attr.value;
	            }
	          }
	          attr.exp && binding.add(attr.exp, newNode, attr.name, attr.updater);
	        }
	      } else {
	        newNode = _SlotNode2.default.wrap(document.importNode(node.prerendered, !1));
	        attrIdx = 0;
	        for (; attrIdx < attributes.length; attrIdx++) {
	          attr = attributes[attrIdx];
	          binding.add(attr.exp, newNode.__domElement, attr.name, attr.updater);
	        }
	      }
	      _Element2.default.appendChild(shadowRoot, newNode);
	      node.id && (idMap[node.id] = newNode);
	      node.slot !== undefined && (slots[node.slot] = newNode);
	      childrenAppend(node.children, newNode, idMap, slots, binding);
	    }
	  }
	}

	function child(nodes, shadowRoot, idMap, slots, binding) {
	  var tempNode = null,
	      attrIdx = 0,
	      attr = null,
	      tagRootIdx = 0;
	  for (; tagRootIdx < nodes.length; tagRootIdx++) {
	    var treeRoot = nodes[tagRootIdx];
	    if (void 0 === treeRoot.name) {
	      tempNode = document.createTextNode(treeRoot.text);
	      treeRoot.exp && binding.add(treeRoot.exp, tempNode, 'textContent', setObjAttr);
	      shadowRoot.appendChild(tempNode);
	    } else {
	      var attributes = treeRoot.attrs;
	      tempNode = document.importNode(treeRoot.prerendered, false);
	      attrIdx = 0;
	      for (; attrIdx < attributes.length; attrIdx++) {
	        attr = attributes[attrIdx];
	        binding.add(attr.exp, tempNode, attr.name, attr.updater);
	      }
	      shadowRoot.appendChild(tempNode);
	      treeRoot.id && (idMap[treeRoot.id] = tempNode);
	      undefined !== treeRoot.slot && (slots[treeRoot.slot] = tempNode);
	      child(treeRoot.children, tempNode, idMap, slots, binding);
	    }
	  }
	}

	var Template = function Template() {};
	Template.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: Template,
	    writable: true,
	    configurable: true
	  }
	});

	var componentSystem = null;
	Template._setCompnentSystem = function (obj) {
	  componentSystem = obj;
	};

	var globalOptions = function globalOptions() {
	  return {
	    renderingMode: 'native',
	    keepWhiteSpace: false,
	    parseTextContent: false
	  };
	};
	Template._setGlobalOptionsGetter = function (opt) {
	  globalOptions = opt;
	};

	var toggleDomClassAttr = function toggleDomClassAttr(ele, attr, force) {
	  ele.__domElement.classList.toggle(attr, !!force);
	};

	var setDomStyle = function setDomStyle(ele, attr, value) {
	  ele.__domElement.style[attr] = value;
	};

	var setAttr = function setAttr(ele, attr, value) {
	  if (value === !0) {
	    ele.setAttribute(attr, '');
	  } else {
	    if (value === false || undefined === value || value === null) {
	      ele.removeAttribute(attr);
	    } else {
	      ele.setAttribute(attr, value);
	    }
	  }
	};

	var toggleClassAttr = function toggleClassAttr(ele, attr, force) {
	  ele.classList.toggle(attr, !!force);
	};

	var setStyle = function setStyle(ele, attr, value) {
	  ele.style[attr] = value;
	};

	var slot = {
	  name: 'virtual',
	  virtual: 'slot',
	  slot: '',
	  attrs: [],
	  children: []
	};
	var virtual = {
	  name: 'virtual',
	  slot: '',
	  attrs: [],
	  prerendered: document.createElement('virtual'),
	  children: []
	};

	// create(insElement, defaultValuesJSON, componentBehavior.methods, opts)
	Template.create = function (ele, defaultValuesJSON, behaviorMethods, opts) {
	  var globOpt = globalOptions();
	  var renderingMode = opts.renderingMode || globOpt.renderingMode;
	  var slotRef = slot;
	  if (renderingMode === 'native') {
	    slotRef = virtual;
	  }
	  var eleAttributes = getAttributes(ele.attributes);
	  var textParseOpt = {
	    parseTextContent: undefined !== eleAttributes['parse-text-content'] || opts.parseTextContent || globOpt.parseTextContent,
	    keepWhiteSpace: undefined !== eleAttributes['keep-white-space'] || opts.keepWhiteSpace || globOpt.keepWhiteSpace
	  };

	  var content = ele.content;
	  if (ele.tagName !== 'TEMPLATE') {
	    content = document.createDocumentFragment();
	    for (; ele.childNodes.length;) {
	      content.appendChild(ele.childNodes[0]);
	    }
	  }

	  var isSlotPused = false;

	  var childNodeFn = function childNodeFn(tagTree, contentChildNodes, tempArr, textParseOpt) {
	    var exp = void 0,
	        nodeIdx = 0;
	    for (; nodeIdx < contentChildNodes.length; nodeIdx++) {
	      var childNode = contentChildNodes[nodeIdx];
	      var treeLengthList = tempArr.concat(tagTree.length);
	      if (childNode.nodeType !== 8) {
	        // if not Node.COMMENT_NODE
	        if (childNode.nodeType !== 3) {
	          // if not Node.TEXT_NODE
	          if (childNode.tagName !== 'WX-CONTENT' && childNode.tagName !== 'SLOT') {
	            var isCustomEle = childNode.tagName.indexOf('-') >= 0 && renderingMode !== 'native';
	            var prerendered = null;
	            isCustomEle || (prerendered = document.createElement(childNode.tagName));
	            var id = '';
	            var childNodeAttributes = childNode.attributes;
	            var attrs = [];
	            if (childNodeAttributes) {
	              var pareOpts = {},
	                  attrIdx = 0;
	              for (; attrIdx < childNodeAttributes.length; attrIdx++) {
	                var childNodeAttr = childNodeAttributes[attrIdx];
	                if (childNodeAttr.name === 'id') {
	                  id = childNodeAttr.value;
	                } else if (childNodeAttr.name === 'parse-text-content') {
	                  pareOpts.parseTextContent = true;
	                } else if (childNodeAttr.name === 'keep-white-space') {
	                  pareOpts.keepWhiteSpace = true;
	                } else {
	                  exp = undefined;
	                  var attrSetter = void 0;
	                  var attrName = childNodeAttr.name;
	                  if (childNodeAttr.name.slice(-1) === dollarSign) {
	                    if (isCustomEle) {
	                      attrSetter = setObjAttr;
	                      attrName = dashToCamel(childNodeAttr.name.slice(0, -1));
	                    } else {
	                      // 需要计算的 class?
	                      attrSetter = setAttr;
	                      attrName = childNodeAttr.name.slice(0, -1);
	                    }
	                  } else {
	                    if (childNodeAttr.name.slice(-1) === ':') {
	                      attrSetter = isCustomEle ? setAttr : setObjAttr;
	                      attrName = dashToCamel(childNodeAttr.name.slice(0, -1));
	                    } else {
	                      if (childNodeAttr.name.slice(0, 6) === 'class.') {
	                        attrSetter = isCustomEle ? toggleDomClassAttr : toggleClassAttr;
	                        attrName = childNodeAttr.name.slice(6);
	                      } else {
	                        if (childNodeAttr.name.slice(0, 6) === 'style.') {
	                          attrSetter = isCustomEle ? setDomStyle : setStyle;
	                          attrName = childNodeAttr.name.slice(6);
	                        }
	                      }
	                    }
	                  }
	                  attrSetter && (exp = _TemplateExparser2.default.parse(childNodeAttr.value, behaviorMethods));
	                  var value = exp ? exp.calculate(null, defaultValuesJSON) : childNodeAttr.value;
	                  isCustomEle || (attrSetter || setAttr)(prerendered, attrName, value);
	                  (isCustomEle || exp) && attrs.push({
	                    name: attrName,
	                    value: value,
	                    updater: attrSetter,
	                    exp: exp
	                  });
	                }
	              }

	              var elementNode = {
	                name: childNode.tagName.toLowerCase(),
	                id: id,
	                custom: isCustomEle,
	                attrs: attrs,
	                prerendered: prerendered,
	                children: []
	              };
	              tagTree.push(elementNode);
	              childNode.tagName === 'VIRTUAL' && (elementNode.virtual = 'virtual');
	              childNode.childNodes && childNodeFn(elementNode.children, childNode.childNodes, treeLengthList, pareOpts);
	              if (elementNode.children.length === 1 && elementNode.children[0] === slotRef) {
	                elementNode.children.pop();
	                elementNode.slot = '';
	              }
	            }
	          } else {
	            isSlotPused = true;
	            tagTree.push(slotRef);
	          }
	        } else {
	          var text = childNode.textContent;
	          if (!textParseOpt.keepWhiteSpace) {
	            text = text.trim();
	            if (text === '') continue;
	            childNode.textContent = text;
	          }
	          exp = undefined;
	          textParseOpt.parseTextContent && (exp = _TemplateExparser2.default.parse(text, behaviorMethods));
	          tagTree.push({
	            exp: exp,
	            text: exp ? exp.calculate(null, defaultValuesJSON) : text
	          });
	        }
	      }
	    }
	  };

	  var tagTree = [];
	  childNodeFn(tagTree, content.childNodes, [], textParseOpt);
	  isSlotPused || tagTree.push(slotRef);
	  tagTree.length === 1 && tagTree[0] === slotRef && tagTree.pop();
	  var tempTemplate = (0, _create2.default)(Template.prototype);
	  tempTemplate._tagTreeRoot = tagTree;
	  tempTemplate._renderingMode = renderingMode;
	  return tempTemplate;
	};

	Template.prototype.createInstance = function () {
	  var ins = (0, _create2.default)(Instance.prototype);
	  var idMap = (0, _create2.default)(null);
	  var slots = (0, _create2.default)(null);
	  var _binding = _BoundProps2.default.create();
	  var shadowRoot = document.createDocumentFragment();

	  if (this._renderingMode === 'native') {
	    // console.log(this._tagTreeRoot, shadowRoot, idMap, slots, _binding)
	    child(this._tagTreeRoot, shadowRoot, idMap, slots, _binding);
	  } else {
	    shadowRoot = _VirtualNode2.default.create('shadow-root');
	    childrenAppend(this._tagTreeRoot, shadowRoot, idMap, slots, _binding);
	  }

	  ins.shadowRoot = shadowRoot;
	  ins.idMap = idMap;
	  ins.slots = slots;
	  ins._binding = _binding;
	  return ins;
	};

	Instance.prototype.updateValues = function (ele, propData, propKey) {
	  propKey && this._binding.update(ele, propData, propKey);
	};

	exports.default = Template;

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var BoundProps = function BoundProps() {};

	BoundProps.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: BoundProps,
	    writable: true,
	    configurable: true
	  }
	});

	BoundProps.create = function () {
	  var tempObj = (0, _create2.default)(BoundProps.prototype);
	  tempObj._bindings = (0, _create2.default)(null);
	  return tempObj;
	};

	BoundProps.prototype.add = function (exp, targetElem, targetProp, updateFunc) {
	  var propDes = {
	    exp: exp,
	    targetElem: targetElem,
	    targetProp: targetProp,
	    updateFunc: updateFunc
	  };

	  var bindings = this._bindings;
	  var bindedProps = exp.bindedProps;

	  for (var idx = 0; idx < bindedProps.length; idx++) {
	    var prop = bindedProps[idx];
	    bindings[prop] || (bindings[prop] = []);
	    bindings[prop].push(propDes);
	  }
	};

	BoundProps.prototype.update = function (ele, propData, propKey) {
	  var _binding = this._bindings[propKey];
	  if (_binding) {
	    for (var idx = 0; idx < _binding.length; idx++) {
	      var boundProp = _binding[idx];
	      boundProp.updateFunc(boundProp.targetElem, boundProp.targetProp, boundProp.exp.calculate(ele, propData));
	    }
	  }
	};
	exports.default = BoundProps;

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _Events = __webpack_require__(1);

	var _Events2 = _interopRequireDefault(_Events);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TemplateExparser = function TemplateExparser() {};
	TemplateExparser.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: TemplateExparser,
	    writable: true,
	    configurable: true
	  }
	});

	TemplateExparser.parse = function (value, methods) {
	  var tempObj = (0, _create2.default)(TemplateExparser.prototype);
	  var slices = value.split(/\{\{(.*?)\}\}/g);
	  var boundPropList = [];
	  for (var idx = 0; idx < slices.length; idx++) {
	    if (idx % 2) {
	      var methodSlices = slices[idx].match(/^(!?)([-_a-zA-Z0-9]+)(?:\((([-_a-zA-Z0-9]+)(,[-_a-zA-Z0-9]+)*)\))?$/) || [!1, ''];
	      var args = null;
	      if (methodSlices[3]) {
	        args = methodSlices[3].split(',');
	        for (var argIdx = 0; argIdx < args.length; argIdx++) {
	          boundPropList.indexOf(args[argIdx]) < 0 && boundPropList.push(args[argIdx]);
	        }
	      } else {
	        // single arg
	        boundPropList.indexOf(methodSlices[2]) < 0 && boundPropList.push(methodSlices[2]);
	      }
	      slices[idx] = {
	        not: !!methodSlices[1],
	        prop: methodSlices[2],
	        callee: args
	      };
	    }
	  }

	  tempObj.bindedProps = boundPropList;
	  tempObj.isSingleletiable = slices.length === 3 && slices[0] === '' && slices[2] === '';
	  tempObj._slices = slices;
	  tempObj._methods = methods;
	  return tempObj;
	};

	var propCalculate = function propCalculate(ele, defaultValues, methods, opt) {
	  var res = '';
	  if (opt.callee) {
	    var args = [],
	        idx = 0;
	    for (; idx < opt.callee.length; idx++) {
	      args[idx] = defaultValues[opt.callee[idx]];
	    }
	    res = _Events2.default.safeCallback('TemplateExparser Method', methods[opt.prop], ele, args);
	    undefined !== res && res !== null || (res = '');
	  } else {
	    res = defaultValues[opt.prop];
	  }
	  if (opt.not) {
	    return !res;
	  } else {
	    return res;
	  }
	};

	TemplateExparser.prototype.calculate = function (ele, defaultValues) {
	  var slices = this._slices;
	  var opt = null;
	  var value = '';
	  if (this.isSingleletiable) {
	    opt = slices[1];
	    value = propCalculate(ele, defaultValues, this._methods, opt);
	  } else {
	    for (var idx = 0; idx < slices.length; idx++) {
	      opt = slices[idx];
	      if (idx % 2) {
	        value += propCalculate(ele, defaultValues, this._methods, opt);
	      } else {
	        value += opt;
	      }
	    }
	  }
	  return value;
	};

	exports.default = TemplateExparser;

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _Element = __webpack_require__(40);

	var _Element2 = _interopRequireDefault(_Element);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var SlotNode = function SlotNode() {};

	SlotNode.prototype = (0, _create2.default)(_Element2.default.prototype, {
	  constructor: {
	    value: SlotNode,
	    writable: true,
	    configurable: true
	  }
	});

	SlotNode.wrap = function (ele) {
	  var tempObj = (0, _create2.default)(SlotNode.prototype);
	  _Element2.default.initialize(tempObj);
	  tempObj.__domElement = ele;
	  ele.__wxElement = tempObj;
	  tempObj.$$ = ele;
	  return tempObj;
	};

	exports.default = SlotNode;

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _Element = __webpack_require__(40);

	var _Element2 = _interopRequireDefault(_Element);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var VirtualNode = function VirtualNode() {};
	VirtualNode.prototype = (0, _create2.default)(_Element2.default.prototype, {
	  constructor: {
	    value: VirtualNode,
	    writable: true,
	    configurable: true
	  }
	});

	// createVirtualNode
	VirtualNode.create = function (is) {
	  var insVirtualNode = (0, _create2.default)(VirtualNode.prototype);
	  insVirtualNode.__virtual = true;
	  insVirtualNode.is = is;
	  _Element2.default.initialize(insVirtualNode, null);
	  return insVirtualNode;
	};

	exports.default = VirtualNode;

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(2);

	var _create2 = _interopRequireDefault(_create);

	var _Observer = __webpack_require__(41);

	var _Observer2 = _interopRequireDefault(_Observer);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TextNode = function TextNode() {};
	TextNode.prototype = (0, _create2.default)(Object.prototype, {
	  constructor: {
	    value: TextNode,
	    writable: true,
	    configurable: true
	  }
	});

	// createTextNode
	TextNode.create = function (txt) {
	  var tempObj = (0, _create2.default)(TextNode.prototype);
	  tempObj.$$ = tempObj.__domElement = document.createTextNode(txt || '');
	  tempObj.__domElement.__wxElement = tempObj;
	  tempObj.__subtreeObserversCount = 0;
	  tempObj.parentNode = null;
	  return tempObj;
	};

	Object.defineProperty(TextNode.prototype, 'textContent', {
	  get: function get() {
	    return this.__domElement.textContent;
	  },
	  set: function set(txt) {
	    this.__domElement.textContent = txt;
	    if (this.__textObservers && !this.__textObservers.empty || this.__subtreeObserversCount) {
	      _Observer2.default._callObservers(this, '__textObservers', {
	        type: 'characterData',
	        target: this
	      });
	    }
	  }
	});
	exports.default = TextNode;

/***/ })
/******/ ]);
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

	var _typeof2 = __webpack_require__(1);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _keys2 = __webpack_require__(69);

	var _keys3 = _interopRequireDefault(_keys2);

	var _create = __webpack_require__(73);

	var _create2 = _interopRequireDefault(_create);

	var _stringify = __webpack_require__(76);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _isIterable2 = __webpack_require__(78);

	var _isIterable3 = _interopRequireDefault(_isIterable2);

	var _getIterator2 = __webpack_require__(82);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _defineProperty2 = __webpack_require__(86);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _from = __webpack_require__(89);

	var _from2 = _interopRequireDefault(_from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function _toArray(args) {
	    return Array.isArray(args) ? args : (0, _from2.default)(args);
	}

	function _toCopyArray(args) {
	    if (Array.isArray(args)) {
	        for (var t = 0, res = new Array(args.length); t < args.length; t++) {
	            res[t] = args[t];
	        }
	        return res;
	    }
	    return (0, _from2.default)(args);
	}

	function _defineProperty(obj, key, value) {
	    // 重写e[t]值为n
	    key in obj ? (0, _defineProperty3.default)(obj, key, {
	        value: value,
	        enumerable: !0,
	        configurable: !0,
	        writable: !0
	    }) : obj[key] = value;
	    return obj;
	}

	var _slicedToArray = function () {
	    function sliceForIteratorObj(obj, length) {
	        var res = [];
	        var _iteratorNormalCompletion = true;
	        var _didIteratorError = false;
	        var _iteratorError = undefined;

	        try {
	            for (var _iterator = (0, _getIterator3.default)(obj), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                var val = _step.value;

	                res.push(val);
	                if (length && res.length === length) break;
	            }
	        } catch (err) {
	            _didIteratorError = true;
	            _iteratorError = err;
	        } finally {
	            try {
	                if (!_iteratorNormalCompletion && _iterator.return) {
	                    _iterator.return();
	                }
	            } finally {
	                if (_didIteratorError) {
	                    throw _iteratorError;
	                }
	            }
	        }

	        return res;
	    }

	    return function (obj, length) {
	        if (Array.isArray(obj)) return obj;
	        if ((0, _isIterable3.default)(Object(obj))) return sliceForIteratorObj(obj, length);
	        throw new TypeError('Invalid attempt to destructure non-iterable instance');
	    };
	}();
	function exeWhenWXJSbridgeReady(fn) {
	    window.__pageFrameEndTime__ //首次generateFuncReady加载完毕
	    ? fn() : document.addEventListener('generateFuncReady', fn);
	}

	// 转发 window 上的 animation 和 transition 相关的动画事件到 exparser
	!function (win) {
	    var getOpt = function getOpt(args) {
	        return {
	            animationName: args.animationName,
	            elapsedTime: args.elapsedTime
	        };
	    },
	        isWebkit = null;
	    var animationAPIList = ['webkitAnimationStart', 'webkitAnimationIteration', 'webkitAnimationEnd', 'animationstart', 'animationiteration', 'animationend', 'webkitTransitionEnd', 'transitionend'];
	    animationAPIList.forEach(function (key) {
	        isWebkit = key.slice(0, 6) === 'webkit';
	        if (isWebkit) {
	            key = key.slice(6).toLowerCase();
	        }

	        win.addEventListener(key, function (event) {
	            event.target.__wxElement && exparser.triggerEvent(event.target.__wxElement, key, getOpt(event));
	            document.dispatchEvent(new CustomEvent('pageReRender', {}));
	        }, !0);
	    });
	}(window);

	// 订阅并转发 WeixinJSBridge 提供的全局事件到 exparser
	!function (glob) {

	    exeWhenWXJSbridgeReady(function () {
	        WeixinJSBridge.subscribe('onAppRouteDone', function () {
	            window.__onAppRouteDone = !0;
	            exparser.triggerEvent(document, 'routeDone', {}, {
	                bubbles: !0
	            });
	            document.dispatchEvent(new CustomEvent('pageReRender', {}));
	        });
	        WeixinJSBridge.subscribe('setKeyboardValue', function (event) {
	            event && event.data && exparser.triggerEvent(document, 'setKeyboardValue', {
	                value: event.data.value,
	                cursor: event.data.cursor,
	                inputId: event.data.inputId
	            }, {
	                bubbles: !0
	            });
	        });
	        WeixinJSBridge.subscribe('hideKeyboard', function (e) {
	            exparser.triggerEvent(document, 'hideKeyboard', {}, {
	                bubbles: !0
	            });
	        });
	        WeixinJSBridge.on('onKeyboardComplete', function (event) {
	            exparser.triggerEvent(document, 'onKeyboardComplete', {
	                value: event.value,
	                inputId: event.inputId
	            }, {
	                bubbles: !0
	            });
	        });
	        WeixinJSBridge.on('onKeyboardConfirm', function (event) {
	            exparser.triggerEvent(document, 'onKeyboardConfirm', {
	                value: event.value,
	                inputId: event.inputId
	            }, {
	                bubbles: !0
	            });
	        });
	        WeixinJSBridge.on('onTextAreaHeightChange', function (event) {
	            exparser.triggerEvent(document, 'onTextAreaHeightChange', {
	                height: event.height,
	                lineCount: event.lineCount,
	                inputId: event.inputId
	            }, {
	                bubbles: !0
	            });
	        });
	        WeixinJSBridge.on('onKeyboardShow', function (event) {
	            exparser.triggerEvent(document, 'onKeyboardShow', {
	                inputId: event.inputId
	            }, {
	                bubbles: !0
	            });
	        });
	    });
	}(window);

	// 转发 window 上的 error 以及各种表单事件到 exparser
	!function (window) {
	    exparser.globalOptions.renderingMode = 'native';

	    window.addEventListener('change', function (event) {
	        exparser.triggerEvent(event.target, 'change', {
	            value: event.target.value
	        });
	    }, !0);

	    window.addEventListener('input', function (event) {
	        exparser.triggerEvent(event.target, 'input');
	    }, !0);

	    window.addEventListener('load', function (event) {
	        exparser.triggerEvent(event.target, 'load');
	    }, !0);

	    window.addEventListener('error', function (event) {
	        exparser.triggerEvent(event.target, 'error');
	    }, !0);

	    window.addEventListener('focus', function (event) {
	        exparser.triggerEvent(event.target, 'focus'), event.preventDefault();
	    }, !0);

	    window.addEventListener('blur', function (event) {
	        exparser.triggerEvent(event.target, 'blur');
	    }, !0);

	    window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
	    window.requestAnimationFrame || (window.requestAnimationFrame = function (func) {
	        typeof func === 'function' && setTimeout(function () {
	            func();
	        }, 17);
	    });
	}(window),

	// touch events
	function (win) {
	    var triggerEvent = function triggerEvent(event, name, params) {
	        exparser.triggerEvent(event.target, name, params, {
	            originalEvent: event,
	            bubbles: !0,
	            composed: !0,
	            extraFields: {
	                touches: event.touches,
	                changedTouches: event.changedTouches
	            }
	        });
	    },
	        distanceThreshold = 10,
	        longtapGapTime = 350,
	        wxScrollTimeLowestValue = 50,
	        setTouches = function setTouches(event, change) {
	        event[change ? "changedTouches" : "touches"] = [{
	            identifier: 0,
	            pageX: event.pageX,
	            pageY: event.pageY,
	            clientX: event.clientX,
	            clientY: event.clientY,
	            screenX: event.screenX,
	            screenY: event.screenY,
	            target: event.target
	        }];
	        return event;
	    },
	        isTouchstart = !1,
	        oriTimeStamp = 0,
	        curX = 0,
	        curY = 0,
	        curEvent = 0,
	        longtapTimer = null,
	        isCancletap = !1,
	        canceltap = function canceltap(node) {
	        for (; node; node = node.parentNode) {
	            var element = node.__wxElement || node;
	            if (element.__wxScrolling && Date.now() - element.__wxScrolling < wxScrollTimeLowestValue) return !0;
	        }
	        return !1;
	    },
	        triggerLongtap = function triggerLongtap() {
	        triggerEvent(curEvent, "longtap", {
	            x: curX,
	            y: curY
	        });
	    },
	        touchstart = function touchstart(event, x, y) {
	        if (!oriTimeStamp) {
	            oriTimeStamp = event.timeStamp;
	            curX = x;
	            curY = y;
	            if (canceltap(event.target)) {
	                longtapTimer = null;
	                isCancletap = !0;
	                triggerEvent(event, "canceltap", {
	                    x: x,
	                    y: y
	                });
	            } else {
	                longtapTimer = setTimeout(triggerLongtap, longtapGapTime);
	                isCancletap = !1;
	            }
	            curEvent = event;
	            event.defaultPrevented && (oriTimeStamp = 0);
	        }
	    },
	        touchmove = function touchmove(e, x, y) {
	        if (oriTimeStamp) {
	            if (!(Math.abs(x - curX) < distanceThreshold && Math.abs(y - curY) < distanceThreshold)) {
	                longtapTimer && (clearTimeout(longtapTimer), longtapTimer = null);
	                isCancletap = !0;
	                triggerEvent(curEvent, "canceltap", {
	                    x: x,
	                    y: y
	                });
	            }
	        }
	    },
	        touchend = function touchend(event, x, y, isTouchcancel) {
	        if (oriTimeStamp) {
	            oriTimeStamp = 0;
	            longtapTimer && (clearTimeout(longtapTimer), longtapTimer = null);
	            if (isTouchcancel) {
	                event = curEvent;
	                x = curX;
	                y = curY;
	            } else {
	                if (!isCancletap) {
	                    triggerEvent(curEvent, "tap", {
	                        x: x,
	                        y: y
	                    });
	                    readyAnalyticsReport(curEvent);
	                }
	            }
	        }
	    };
	    win.addEventListener("scroll", function (event) {
	        event.target.__wxScrolling = Date.now();
	    }, {
	        capture: !0,
	        passive: !1
	    });
	    win.addEventListener("touchstart", function (event) {
	        isTouchstart = !0;
	        triggerEvent(event, "touchstart");
	        1 === event.touches.length && touchstart(event, event.touches[0].pageX, event.touches[0].pageY);
	    }, {
	        capture: !0,
	        passive: !1
	    });
	    win.addEventListener("touchmove", function (event) {
	        triggerEvent(event, "touchmove");
	        1 === event.touches.length && touchmove(event, event.touches[0].pageX, event.touches[0].pageY);
	    }, {
	        capture: !0,
	        passive: !1
	    });
	    win.addEventListener("touchend", function (event) {
	        triggerEvent(event, "touchend");
	        0 === event.touches.length && touchend(event, event.changedTouches[0].pageX, event.changedTouches[0].pageY);
	    }, {
	        capture: !0,
	        passive: !1
	    });
	    win.addEventListener("touchcancel", function (event) {
	        triggerEvent(event, "touchcancel");
	        touchend(null, 0, 0, !0);
	    }, {
	        capture: !0,
	        passive: !1
	    });
	    window.addEventListener("blur", function () {
	        touchend(null, 0, 0, !0);
	    });
	    win.addEventListener("mousedown", function (event) {
	        if (!isTouchstart && !oriTimeStamp) {
	            setTouches(event, !1);
	            triggerEvent(event, "touchstart");
	            touchstart(event, event.pageX, event.pageY);
	        }
	    }, {
	        capture: !0,
	        passive: !1
	    });
	    win.addEventListener("mousemove", function (event) {
	        if (!isTouchstart && oriTimeStamp) {
	            setTouches(event, !1);
	            triggerEvent(event, "touchmove");
	            touchmove(event, event.pageX, event.pageY);
	        }
	    }, {
	        capture: !0,
	        passive: !1
	    });
	    win.addEventListener("mouseup", function (event) {
	        if (!isTouchstart && oriTimeStamp) {
	            setTouches(event, !0);
	            triggerEvent(event, "touchend");
	            touchend(event, event.pageX, event.pageY);
	        }
	    }, {
	        capture: !0,
	        passive: !1
	    });
	    var analyticsConfig = {},
	        readyAnalyticsReport = function readyAnalyticsReport(event) {
	        if (analyticsConfig.selector) {
	            for (var selector = analyticsConfig.selector, target = event.target; target;) {
	                if (target.tagName && 0 === target.tagName.indexOf("WX-")) {
	                    var classNames = target.className.split(" ").map(function (className) {
	                        return "." + className;
	                    });
	                    ["#" + target.id].concat(classNames).forEach(function (curSelector) {
	                        selector.indexOf(curSelector) > -1 && analyticsReport(target, curSelector);
	                    });
	                }
	                target = target.parentNode;
	            }
	        }
	    },
	        analyticsReport = function analyticsReport(ele, selector) {
	        for (var i = 0; i < analyticsConfig.data.length; i++) {
	            var curData = analyticsConfig.data[i];
	            if (curData.element === selector) {
	                var data = {
	                    eventID: curData.eventID,
	                    page: curData.page,
	                    element: curData.element,
	                    action: curData.action,
	                    time: Date.now()
	                };
	                0 === selector.indexOf(".") && (data.index = Array.prototype.indexOf.call(document.body.querySelectorAll(curData.element), ele));
	                exeWhenWXJSbridgeReady(function () {
	                    WeixinJSBridge.publish("analyticsReport", {
	                        data: data
	                    });
	                });
	                break;
	            }
	        }
	    };
	    exeWhenWXJSbridgeReady(function () {
	        WeixinJSBridge.subscribe("analyticsConfig", function (params) {
	            if ("[object Array]" === Object.prototype.toString.call(params.data)) {
	                analyticsConfig.data = params.data;
	                analyticsConfig.selector = [];
	                analyticsConfig.data.forEach(function (e) {
	                    e.element && analyticsConfig.selector.push(e.element);
	                });
	            }
	        });
	    });
	}(window),

	// wx-base
	window.exparser.registerBehavior({
	    // 使用 exparser.registerBehavior 和exparser.registerElement 方法注册各种以 wx- 做为标签开头的元素到 exparser
	    is: 'wx-base',
	    properties: {
	        id: {
	            type: String,
	            public: !0
	        },
	        hidden: {
	            type: Boolean,
	            public: !0
	        }
	    },
	    _isDevTools: function _isDevTools() {
	        return true;
	    },
	    debounce: function debounce(id, func, waitTime) {
	        var _this = this;
	        this.__debouncers = this.__debouncers || {};
	        this.__debouncers[id] && clearTimeout(this.__debouncers[id]);
	        this.__debouncers[id] = setTimeout(function () {
	            typeof func === 'function' && func();
	            _this.__debouncers[id] = void 0;
	        }, waitTime);
	    }
	});

	// wx-data-Component
	window.exparser.registerBehavior({
	    is: 'wx-data-Component',
	    properties: {
	        name: {
	            type: String,
	            public: !0
	        }
	    },
	    getFormData: function getFormData() {
	        return this.value || '';
	    },
	    resetFormData: function resetFormData() {}
	});

	// wx-disabled
	window.exparser.registerBehavior({
	    is: 'wx-disabled',
	    properties: {
	        disabled: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        }
	    }
	});

	// wx-group
	window.exparser.registerBehavior({
	    is: 'wx-group',
	    listeners: {
	        'this.wxItemValueChanged': '_handleItemValueChanged',
	        'this.wxItemCheckedChanged': '_handleItemCheckedChanged',
	        'this.wxItemAdded': '_handleItemAdded',
	        'this.wxItemRemoved': '_handleItemRemoved',
	        'this.wxItemChangedByTap': '_handleChangedByTap'
	    },
	    _handleItemValueChanged: function _handleItemValueChanged(event) {
	        this.renameItem(event.detail.item, event.detail.newVal, event.detail.oldVal);
	    },
	    _handleItemCheckedChanged: function _handleItemCheckedChanged(event) {
	        this.changed(event.detail.item);
	    },
	    _handleItemAdded: function _handleItemAdded(event) {
	        event.detail.item._relatedGroup = this;
	        this.addItem(event.detail.item);
	        return !1;
	    },
	    _handleItemRemoved: function _handleItemRemoved(event) {
	        this.removeItem(event.detail.item);
	        return !1;
	    },
	    _handleChangedByTap: function _handleChangedByTap() {
	        this.triggerEvent('change', {
	            value: this.value
	        });
	    },
	    addItem: function addItem() {},
	    removeItem: function removeItem() {},
	    renameItem: function renameItem() {},
	    changed: function changed() {},
	    resetFormData: function resetFormData() {
	        if (this.hasBehavior('wx-data-Component')) {
	            var checkChilds = function checkChilds(element) {
	                element.childNodes.forEach(function (childNode) {
	                    if (childNode instanceof exparser.Element && !childNode.hasBehavior('wx-group')) {
	                        return childNode.hasBehavior('wx-item') ? void childNode.resetFormData() : void checkChilds(childNode);
	                    }
	                });
	            };
	            checkChilds(this);
	        }
	    }
	});

	// wx-hover
	window.exparser.registerBehavior({
	    is: 'wx-hover',
	    properties: {
	        hoverStartTime: {
	            type: Number,
	            value: 50,
	            public: !0
	        },
	        hoverStayTime: {
	            type: Number,
	            value: 400,
	            public: !0
	        },
	        hoverClass: {
	            type: String,
	            value: '',
	            public: !0,
	            observer: '_hoverClassChange'
	        },
	        hoverStyle: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        hover: {
	            type: Boolean,
	            value: !1,
	            public: !0,
	            observer: '_hoverChanged'
	        }
	    },
	    attached: function attached() {
	        this.hover && this.hoverStyle != 'none' && this.hoverClass != 'none' && (this.bindHover(), this._hoverClassChange(this.hoverClass));
	    },
	    isScrolling: function isScrolling() {
	        for (var ele = this.$$; ele; ele = ele.parentNode) {
	            var wxElement = ele.__wxElement || ele;
	            if (wxElement.__wxScrolling && Date.now() - wxElement.__wxScrolling < 50) {
	                return !0;
	            }
	        }
	        return !1;
	    },
	    detached: function detached() {
	        this.unbindHover();
	    },
	    _hoverChanged: function _hoverChanged(bind, t) {
	        bind ? this.bindHover() : this.unbindHover();
	    },
	    _hoverClassChange: function _hoverClassChange(className) {
	        var classArr = className.split(/\s/);
	        this._hoverClass = [];
	        for (var n = 0; n < classArr.length; n++) {
	            classArr[n] && this._hoverClass.push(classArr[n]);
	        }
	    },
	    bindHover: function bindHover() {
	        this._hoverTouchStart = this.hoverTouchStart.bind(this);
	        this._hoverTouchEnd = this.hoverTouchEnd.bind(this);
	        this._hoverCancel = this.hoverCancel.bind(this);
	        this._hoverTouchMove = this.hoverTouchMove.bind(this);
	        this.$$.addEventListener('touchstart', this._hoverTouchStart);
	        window.__DOMTree__.addListener('canceltap', this._hoverCancel);
	        window.addEventListener('touchcancel', this._hoverCancel, !0);
	        window.addEventListener('touchmove', this._hoverTouchMove, !0);
	        window.addEventListener('touchend', this._hoverTouchEnd, !0);
	    },
	    unbindHover: function unbindHover() {
	        this.$$.removeEventListener('touchstart', this._hoverTouchStart);
	        window.__DOMTree__.removeListener('canceltap', this._hoverCancel);
	        window.removeEventListener('touchcancel', this._hoverCancel, !0);
	        window.removeEventListener('touchmove', this._hoverTouchMove, !0);
	        window.removeEventListener('touchend', this._hoverTouchEnd, !0);
	    },
	    hoverTouchMove: function hoverTouchMove(e) {
	        this.hoverCancel();
	    },
	    hoverTouchStart: function hoverTouchStart(event) {
	        var self = this;
	        if (!this.isScrolling()) {
	            this.__touch = !0;
	            if (this.hoverStyle == 'none' || this.hoverClass == 'none' || this.disabled) ;else {
	                if (event.touches.length > 1) return;
	                if (window.__hoverElement__) {
	                    window.__hoverElement__._hoverReset();
	                    window.__hoverElement__ = void 0;
	                }
	                this.__hoverStyleTimeId = setTimeout(function () {
	                    self.__hovering = !0;
	                    window.__hoverElement__ = self;
	                    if (self._hoverClass && self._hoverClass.length > 0) {
	                        for (var e = 0; e < self._hoverClass.length; e++) {
	                            self.$$.classList.add(self._hoverClass[e]);
	                        }
	                    } else {
	                        self.$$.classList.add(self.is.replace('wx-', '') + '-hover');
	                    }
	                    self.__touch || window.requestAnimationFrame(function () {
	                        clearTimeout(self.__hoverStayTimeId);
	                        self.__hoverStayTimeId = setTimeout(function () {
	                            self._hoverReset();
	                        }, self.hoverStayTime);
	                    });
	                }, this.hoverStartTime);
	            }
	        }
	    },
	    hoverTouchEnd: function hoverTouchEnd() {
	        var self = this;
	        this.__touch = !1;
	        if (this.__hovering) {
	            clearTimeout(this.__hoverStayTimeId);
	            window.requestAnimationFrame(function () {
	                self.__hoverStayTimeId = setTimeout(function () {
	                    self._hoverReset();
	                }, self.hoverStayTime);
	            });
	        }
	    },
	    hoverCancel: function hoverCancel() {
	        this.__touch = !1;
	        clearTimeout(this.__hoverStyleTimeId);
	        this.__hoverStyleTimeId = void 0;
	        this._hoverReset();
	    },
	    _hoverReset: function _hoverReset() {
	        if (this.__hovering) {
	            this.__hovering = !1;
	            window.__hoverElement__ = void 0;
	            if (this.hoverStyle == 'none' || this.hoverClass == 'none') ;else if (this._hoverClass && this._hoverClass.length > 0) {
	                for (var e = 0; e < this._hoverClass.length; e++) {
	                    this.$$.classList.contains(this._hoverClass[e]) && this.$$.classList.remove(this._hoverClass[e]);
	                }
	            } else {
	                this.$$.classList.remove(this.is.replace('wx-', '') + '-hover');
	            }
	        }
	    }
	});

	// wx-input-base
	window.exparser.registerBehavior({
	    is: 'wx-input-base',
	    properties: {
	        focus: {
	            type: Boolean,
	            value: 0,
	            coerce: '_focusChange',
	            public: !0
	        },
	        autoFocus: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        placeholder: {
	            type: String,
	            value: '',
	            observer: '_placeholderChange',
	            public: !0
	        },
	        placeholderStyle: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        placeholderClass: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        value: {
	            type: String,
	            value: '',
	            coerce: 'defaultValueChange',
	            public: !0
	        },
	        showValue: {
	            type: String,
	            value: ''
	        },
	        maxlength: {
	            type: Number,
	            value: 140,
	            observer: '_maxlengthChanged',
	            public: !0
	        },
	        type: {
	            type: String,
	            value: 'text',
	            public: !0
	        },
	        password: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        disabled: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        bindinput: {
	            type: String,
	            value: '',
	            public: !0
	        }
	    },
	    resetFormData: function resetFormData() {
	        this._keyboardShow && (this.__formResetCallback = !0, wx.hideKeyboard());
	        this.value = '';
	        this.showValue = '';
	    },
	    getFormData: function getFormData(callback) {
	        this._keyboardShow ? this.__formCallback = callback : typeof callback === 'function' && callback(this.value);
	    },
	    _formGetDataCallback: function _formGetDataCallback() {
	        typeof this.__formCallback === 'function' && this.__formCallback(this.value);
	        this.__formCallback = void 0;
	    },
	    _focusChange: function _focusChange(isFocusChange) {
	        this._couldFocus(isFocusChange);
	        return isFocusChange;
	    },
	    _couldFocus: function _couldFocus(isFocusChange) {
	        var self = this;
	        !this._keyboardShow && this._attached && isFocusChange && (window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame, window.requestAnimationFrame ? window.requestAnimationFrame(function () {
	            self._inputFocus();
	        }) : this._inputFocus());
	    },
	    _getPlaceholderClass: function _getPlaceholderClass(name) {
	        return 'input-placeholder ' + name;
	    },
	    _showValueFormate: function _showValueFormate(value) {
	        this.password || this.type == 'password' ? this.showValue = value ? new Array(value.length + 1).join('●') : '' : this.showValue = value || '';
	    },
	    _maxlengthChanged: function _maxlengthChanged(length, t) {
	        var curVal = this.value.slice(0, length);
	        curVal != this.value && (this.value = curVal);
	    },
	    _showValueChange: function _showValueChange(e) {
	        return e;
	    },
	    _placeholderChange: function _placeholderChange() {
	        this._checkPlaceholderStyle(this.value);
	    }
	});

	// wx-item
	window.exparser.registerBehavior({
	    is: 'wx-item',
	    properties: {
	        value: {
	            type: String,
	            public: !0,
	            observer: 'valueChange'
	        },
	        checked: {
	            type: Boolean,
	            value: !1,
	            observer: 'checkedChange',
	            public: !0
	        }
	    },
	    valueChange: function valueChange(newVal, oldVal) {
	        this._relatedGroup && this._relatedGroup.triggerEvent('wxItemValueChanged', {
	            item: this,
	            newVal: newVal,
	            oldVal: oldVal
	        });
	    },
	    checkedChange: function checkedChange(newVal, oldVal) {
	        newVal !== oldVal && this._relatedGroup && this._relatedGroup.triggerEvent('wxItemCheckedChanged', {
	            item: this
	        });
	    },
	    changedByTap: function changedByTap() {
	        this._relatedGroup && this._relatedGroup.triggerEvent('wxItemChangedByTap');
	    },
	    attached: function attached() {
	        this.triggerEvent('wxItemAdded', {
	            item: this
	        }, {
	            bubbles: !0
	        });
	    },
	    moved: function moved() {
	        this._relatedGroup && (this._relatedGroup.triggerEvent('wxItemRemoved'), this._relatedGroup = null), this.triggerEvent('wxItemAdded', { item: this }, { bubbles: !0 });
	    },
	    detached: function detached() {
	        this._relatedGroup && (this._relatedGroup.triggerEvent('wxItemRemoved', {
	            item: this
	        }), this._relatedGroup = null);
	    },
	    resetFormData: function resetFormData() {
	        this.checked = !1;
	    }
	});

	// wx-label-target
	window.exparser.registerBehavior({
	    is: 'wx-label-target',
	    properties: {},
	    handleLabelTap: function handleLabelTap(event) {}
	});

	// wx-mask-Behavior
	window.exparser.registerBehavior({
	    is: 'wx-mask-Behavior',
	    properties: {
	        mask: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        }
	    },
	    _getMaskStyle: function _getMaskStyle(showMask) {
	        return showMask ? '' : 'background-color: transparent';
	    }
	});

	// wx-native
	window.exparser.registerBehavior({
	    is: 'wx-native',
	    properties: {
	        hidden: {
	            type: Boolean,
	            value: !1,
	            public: !0,
	            observer: 'hiddenChanged'
	        },
	        _isReady: {
	            type: Boolean,
	            value: !1
	        },
	        _deferred: {
	            type: Array,
	            value: []
	        },
	        _isError: {
	            type: Boolean,
	            value: !1
	        },
	        _box: {
	            type: Object,
	            value: {
	                left: 0,
	                top: 0,
	                width: 0,
	                height: 0
	            }
	        }
	    },
	    _isiOS: function _isiOS() {
	        //转成h5后，此处统一返回false 不走native的处理方式
	        //var ua = window.navigator.userAgent.toLowerCase()
	        return false; ///iphone/.test(ua)
	    },
	    _isAndroid: function _isAndroid() {
	        //var ua = window.navigator.userAgent.toLowerCase()
	        return false; ///android/.test(ua)
	    },
	    _isMobile: function _isMobile() {
	        return this._isiOS() || this._isAndroid();
	    },
	    _getBox: function _getBox() {
	        var pos = this.$$.getBoundingClientRect(),
	            res = {
	            left: pos.left + window.scrollX,
	            top: pos.top + window.scrollY,
	            width: this.$$.offsetWidth,
	            height: this.$$.offsetHeight
	        };
	        return res;
	    },
	    _diff: function _diff() {
	        var pos = this._getBox();
	        for (var attr in pos) {
	            if (pos[attr] !== this._box[attr]) return !0;
	        }
	        return !1;
	    },
	    _ready: function _ready() {
	        this._isReady = !0;
	        this._deferred.forEach(function (e) {
	            this[e.callback].apply(this, e.args);
	        }, this);
	        this._deferred = [];
	    },
	    hiddenChanged: function hiddenChanged(e, t) {
	        if (!this._isError) {
	            return this._isReady ? void this._hiddenChanged(e, t) : void this._deferred.push({ callback: 'hiddenChanged', args: [e, t] });
	        }
	    },
	    _pageReRenderCallback: function _pageReRenderCallback() {
	        this._isError || this._diff() && (this._box = this._getBox(), this._updatePosition());
	    }
	});

	// wx-player
	window.exparser.registerBehavior({
	    is: 'wx-player',
	    isBackground: !1,
	    properties: {
	        src: {
	            type: String,
	            observer: 'srcChanged',
	            public: !0
	        },
	        poster: {
	            type: String,
	            observer: 'posterChanged',
	            public: !0
	        },
	        playing: {
	            type: Boolean,
	            value: !1
	        },
	        _buttonType: {
	            type: String,
	            value: 'play'
	        },
	        _currentTime: {
	            type: String,
	            value: '00:00'
	        },
	        _duration: {
	            type: String,
	            value: '00:00'
	        },
	        isLive: {
	            type: Boolean,
	            value: !1
	        }
	    },
	    _formatTime: function _formatTime(time) {
	        if (time === 1 / 0) return '00:00';
	        var hour = Math.floor(time / 3600),
	            min = Math.floor((time - 3600 * hour) / 60),
	            sencod = time - 3600 * hour - 60 * min;
	        return hour == 0 ? (min >= 10 ? min : '0' + min) + ':' + (sencod >= 10 ? sencod : '0' + sencod) : (hour >= 10 ? hour : '0' + hour) + ':' + (min >= 10 ? min : '0' + min) + ':' + (sencod >= 10 ? sencod : '0' + sencod);
	    },
	    _publish: function _publish(eventName, param) {
	        this.triggerEvent(eventName, param);
	    },
	    attached: function attached() {
	        var self = this,
	            playDom = this.$.player,
	            tmpObj = {};
	        for (var o in MediaError) {
	            tmpObj[MediaError[o]] = o;
	        }
	        playDom.onerror = function (event) {
	            event.stopPropagation();
	            if (event.srcElement.error) {
	                var t = event.srcElement.error.code;
	                self._publish('error', {
	                    errMsg: tmpObj[t]
	                });
	            }
	        };
	        playDom.onplay = function (event) {
	            self.playing = !0;
	            event.stopPropagation();
	            self._publish('play', {});
	            self._buttonType = 'pause';
	            typeof self.onPlay === 'function' && self.onPlay(event);
	        };
	        playDom.onpause = function (event) {
	            self.playing = !1;
	            event.stopPropagation();
	            self._publish('pause', {});
	            self._buttonType = 'play';
	            typeof self.onPause === 'function' && self.onPause(event);
	        };
	        playDom.onended = function (event) {
	            self.playing = !1;
	            event.stopPropagation();
	            self._publish('ended', {});
	            typeof self.onEnded === 'function' && self.onEnded(event);
	        };
	        playDom.tagName == 'AUDIO' && (playDom.onratechange = function (event) {
	            event.stopPropagation();
	            self._publish('ratechange', {
	                playbackRate: playDom.playbackRate
	            });
	        });
	        var prevTime = 0;
	        playDom.addEventListener('timeupdate', function (event) {
	            event.stopPropagation();
	            Math.abs(playDom.currentTime - prevTime) % playDom.duration >= 1 && (self._publish('timeupdate', {
	                currentTime: playDom.currentTime,
	                duration: playDom.duration
	            }), prevTime = 1e3 * playDom.currentTime);
	            self._currentTime = self._formatTime(Math.floor(playDom.currentTime));
	            typeof self.onTimeUpdate === 'function' && self.onTimeUpdate(event);
	        });
	        playDom.addEventListener('durationchange', function () {
	            playDom.duration === 1 / 0 ? self.isLive = !0 : self.isLive = !1;
	            NaN !== playDom.duration && self.duration === 0 && (self._duration = self._formatTime(Math.floor(playDom.duration)));
	        });
	    }
	});

	// wx-touchtrack
	exparser.registerBehavior({
	    is: 'wx-touchtrack',
	    touchtrack: function touchtrack(element, handlerName) {
	        var that = this,
	            startX = 0,
	            startY = 0,
	            dx = 0,
	            dy = 0,
	            handleEvent = function handleEvent(event, state, x, y) {
	            var res = that[handlerName].call(that, {
	                target: event.target,
	                currentTarget: event.currentTarget,
	                preventDefault: event.preventDefault,
	                stopPropagation: event.stopPropagation,
	                detail: {
	                    state: state,
	                    x: x,
	                    y: y,
	                    dx: x - startX,
	                    dy: y - startY,
	                    ddx: x - dx,
	                    ddy: y - dy
	                }
	            });
	            if (res === !1) return !1;
	        },
	            originalEvent = null;
	        exparser.addListenerToElement(element, 'touchstart', function (event) {
	            if (event.touches.length === 1 && !originalEvent) {
	                originalEvent = event;
	                startX = dx = event.touches[0].pageX;
	                startY = dy = event.touches[0].pageY;
	                return handleEvent(event, 'start', startX, startY);
	            }
	        });
	        exparser.addListenerToElement(element, 'touchmove', function (event) {
	            if (event.touches.length === 1 && originalEvent) {
	                var res = handleEvent(event, 'move', event.touches[0].pageX, event.touches[0].pageY);
	                dx = event.touches[0].pageX;
	                dy = event.touches[0].pageY;
	                return res;
	            }
	        });
	        exparser.addListenerToElement(element, 'touchend', function (event) {
	            if (event.touches.length === 0 && originalEvent) {
	                originalEvent = null;
	                return handleEvent(event, 'end', event.changedTouches[0].pageX, event.changedTouches[0].pageY);
	            }
	        });
	        exparser.addListenerToElement(element, 'touchcancel', function (event) {
	            if (event.touches.length === 0 && originalEvent) {
	                var t = originalEvent;
	                originalEvent = null;
	                return handleEvent(event, 'end', t.touches[0].pageX, t.touches[0].pageY);
	            }
	        });
	    }
	});

	// wx-action-sheet
	window.exparser.registerElement({
	    is: 'wx-action-sheet',
	    template: '\n    <div class="wx-action-sheet-mask" id="mask" style.z-index="1000" style="display: none;"></div>\n    <div class="wx-action-sheet" class.wx-action-sheet-show="{{!hidden}}">\n      <div class="wx-action-sheet-menu">\n        <slot></slot>\n      </div>\n    </div>\n  ',
	    behaviors: ['wx-base'],
	    properties: {
	        hidden: {
	            type: Boolean,
	            value: !0,
	            observer: 'hiddenChange',
	            public: !0
	        }
	    },
	    listeners: {
	        'mask.tap': 'hide',
	        'this.actionSheetCancel': 'cancel'
	    },
	    cancel: function cancel(e) {
	        this.hide();
	        return !1;
	    },
	    hide: function hide() {
	        this.triggerEvent('change');
	    },
	    hiddenChange: function hiddenChange(hidd) {
	        var mask = this.$.mask;
	        if (hidd) {
	            setTimeout(function () {
	                mask.style.display = 'none';
	            }, 300);
	            mask.style.backgroundColor = 'rgba(0,0,0,0)';
	        } else {
	            mask.style.display = 'block';
	            mask.focus();
	            mask.style.backgroundColor = 'rgba(0,0,0,0.6)';
	        }
	    }
	});

	// wx-action-sheet-cancel
	window.exparser.registerElement({
	    is: 'wx-action-sheet-cancel',
	    template: '\n    <div class="wx-action-sheet-middle" id="middle"></div>\n    <div class="wx-action-sheet-cancel" id="cancel">\n      <slot></slot>\n    </div>\n  ',
	    properties: {},
	    listeners: {
	        'middle.tap': 'handleMiddleTap',
	        'cancel.tap': 'handleCancelTap'
	    },
	    behaviors: ['wx-base'],
	    handleMiddleTap: function handleMiddleTap(e) {
	        return !1;
	    },
	    handleCancelTap: function handleCancelTap(e) {
	        this.triggerEvent('actionSheetCancel', void 0, {
	            bubbles: !0
	        });
	    }
	});

	// wx-action-sheet-item
	window.exparser.registerElement({
	    is: 'wx-action-sheet-item',
	    template: '\n    <slot></slot>\n  ',
	    properties: {},
	    behaviors: ['wx-base']
	});

	// wx-audio
	window.exparser.registerElement({
	    is: 'wx-audio',
	    behaviors: ['wx-base', 'wx-player'],
	    template: '<audio id="player" loop$="{{loop}}" style="display: none;"></audio>\n  <div id="default" class="wx-audio-default" style="display: none;">\n    <div id="poster" class="wx-audio-left">\n      <div id="button" class$="wx-audio-button {{_buttonType}}"></div>\n    </div>\n    <div class="wx-audio-right">\n      <div class="wx-audio-time" parse-text-content>{{_currentTime}}</div>\n      <div class="wx-audio-info">\n        <div class="wx-audio-name" parse-text-content>{{name}}</div>\n        <div class="wx-audio-author" parse-text-content>{{author}}</div>\n      </div>\n    </div>\n  </div>\n  <div id="fakebutton"></div>',
	    properties: {
	        action: {
	            type: Object,
	            observer: 'actionChanged',
	            public: !0
	        },
	        name: {
	            type: String,
	            value: '未知歌曲',
	            public: !0
	        },
	        author: {
	            type: String,
	            value: '未知作者',
	            public: !0
	        },
	        loop: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        controls: {
	            type: Boolean,
	            value: !1,
	            observer: 'controlsChanged',
	            public: !0
	        },
	        _srcTimer: {
	            type: Number
	        },
	        _actionTimer: {
	            type: Number
	        },
	        _canSrc: {
	            type: Boolean,
	            value: !0
	        },
	        _deferredSrc: {
	            type: String,
	            value: ''
	        },
	        _canAction: {
	            type: Boolean,
	            value: !1
	        },
	        _deferredAction: {
	            type: Array,
	            value: []
	        }
	    },
	    _reset: function _reset() {
	        ;this._buttonType = 'play', this._currentTime = '00:00', this._duration = '00:00';
	    },
	    _readySrc: function _readySrc() {
	        this._canSrc = !0;
	        this.srcChanged(this._deferredSrc);
	        this._deferredSrc = '';
	    },
	    _readyAction: function _readyAction() {
	        var self = this;
	        this._canAction = !0;
	        this._deferredAction.forEach(function (t) {
	            self.actionChanged(t);
	        }, this);
	        this._deferredAction = [];
	    },
	    srcChanged: function srcChanged(src, t) {
	        if (src) {
	            clearTimeout(this._srcTimer);
	            this._canAction = !1;
	            this.$.player.src = src;
	            var self = this;
	            this._srcTimer = setTimeout(function () {
	                self._reset();
	                self._readyAction();
	            }, 0);
	        }
	    },
	    posterChanged: function posterChanged(url, t) {
	        this.$.poster.style.backgroundImage = "url('" + url + "')";
	    },
	    controlsChanged: function controlsChanged(show, t) {
	        this.$.default.style.display = show ? '' : 'none';
	    },
	    actionChanged: function actionChanged(act, t) {
	        var self = this;
	        if (act) {
	            var method = act.method;
	            this.action = act;
	            if (!this._canAction && method !== 'setSrc') {
	                return void this._deferredAction.push(act);
	            }
	            var pattern = null;
	            if ((pattern = /^set([a-z|A-Z]*)/.exec(method)) != null) {
	                var mkey = pattern[1],
	                    data = act.data;
	                mkey = mkey[0].toLowerCase() + mkey.slice(1);
	                mkey == 'currentTime' ? this.$.player.readyState === 0 || this.$.player.readyState === 1 ? !function () {
	                    var fn = function fn() {
	                        self.$.player[mkey] = data;
	                        self.$.player.removeEventListener('canplay', fn, !1);
	                    };
	                    self.$.player.addEventListener('canplay', fn, !1);
	                }() : this.$.player[mkey] = data : mkey === 'src' ? this.srcChanged(data) : this.triggerEvent('error', {
	                    errMsg: method + ' is not an action'
	                });
	            } else if (method == 'play' || method == 'pause') {
	                if (this.isBackground === !0 && method === 'play') return;
	                this.$.fakebutton.click();
	            } else {
	                this.triggerEvent('error', {
	                    errMsg: method + ' is not an action'
	                });
	            }
	            this.action = null;
	        }
	    },
	    attached: function attached() {
	        var self = this,
	            player = this.$.player;
	        this.$.button.onclick = function (e) {
	            e.stopPropagation();
	            self.action = {
	                method: self._buttonType
	            };
	        };
	        this.$.fakebutton.onclick = function (event) {
	            event.stopPropagation();
	            self.action && typeof player[self.action.method] === 'function' && player[self.action.method]();
	        };
	        WeixinJSBridge.subscribe('audio_' + this.id + '_actionChanged', function (t) {
	            self.action = t;
	        });
	        WeixinJSBridge.publish('audioInsert', {
	            audioId: this.id
	        });
	        wx.onAppEnterBackground(function (t) {
	            self.$.player.pause();
	            self.isBackground = !0;
	        });
	        wx.onAppEnterForeground(function (t) {
	            self.isBackground = !1;
	        });
	    }
	});

	// wx-button
	window.exparser.registerElement({
	    is: 'wx-button',
	    template: '\n    <slot></slot>\n  ',
	    behaviors: ['wx-base', 'wx-hover', 'wx-label-target'],
	    properties: {
	        type: {
	            type: String,
	            value: 'default',
	            public: !0
	        },
	        size: {
	            type: String,
	            value: 'default',
	            public: !0
	        },
	        disabled: {
	            type: Boolean,
	            public: !0
	        },
	        plain: {
	            type: Boolean,
	            public: !0
	        },
	        loading: {
	            type: Boolean,
	            public: !0
	        },
	        formType: {
	            type: String,
	            public: !0
	        },
	        hover: {
	            type: Boolean,
	            value: !0
	        }
	    },
	    listeners: {
	        tap: '_preventTapOnDisabled',
	        longtap: '_preventTapOnDisabled',
	        canceltap: '_preventTapOnDisabled',
	        'this.tap': '_onThisTap'
	    },
	    _preventTapOnDisabled: function _preventTapOnDisabled() {
	        if (this.disabled) return !1;
	    },
	    _onThisTap: function _onThisTap() {
	        this.formType === 'submit' ? this.triggerEvent('formSubmit', void 0, { bubbles: !0 }) : this.formType === 'reset' && this.triggerEvent('formReset', void 0, { bubbles: !0 });
	    },
	    handleLabelTap: function handleLabelTap(event) {
	        exparser.triggerEvent(this.shadowRoot, 'tap', event.detail, {
	            bubbles: !0,
	            composed: !0,
	            extraFields: {
	                touches: event.touches,
	                changedTouches: event.changedTouches
	            }
	        });
	    }
	});

	var touchEventNames = ['touchstart', 'touchmove', 'touchend', 'touchcancel', 'longtap'],
	    touchEventMap = {
	    touchstart: 'onTouchStart',
	    touchmove: 'onTouchMove',
	    touchend: 'onTouchEnd',
	    touchcancel: 'onTouchCancel',
	    longtap: 'onLongPress'
	},
	    LONG_PRESS_TIME_THRESHOLD = 300,
	    LONG_PRESS_DISTANCE_THRESHOLD = 5,
	    format = function format(obj, method, arr, key) {
	    arr = Array.prototype.slice.call(arr);
	    var res = obj + '.' + method + '(' + arr.map(function (val) {
	        return typeof val === 'string' ? "'" + val + "'" : val;
	    }).join(', ') + ')';
	    key && (res = key + ' = ' + res);
	    return res;
	},
	    resolveColor = function resolveColor(color) {
	    var arr = color.slice(0);
	    arr[3] = arr[3] / 255;
	    return 'rgba(' + arr.join(',') + ')';
	},
	    getCanvasTouches = function getCanvasTouches(args) {
	    var self = this;
	    return [].concat(_toCopyArray(args)).map(function (e) {
	        return {
	            identifier: e.identifier,
	            x: e.pageX - self._box.left,
	            y: e.pageY - self._box.top
	        };
	    });
	},
	    calcDistance = function calcDistance(end, start) {
	    var dx = end.x - start.x,
	        dy = end.y - start.y;
	    return dx * dx + dy * dy;
	};

	// wx-canvas
	window.exparser.registerElement({
	    is: 'wx-canvas',
	    behaviors: ['wx-base', 'wx-native'],
	    template: '<canvas id="canvas" width="300" height="150"></canvas>',
	    properties: {
	        canvasId: {
	            type: String,
	            public: !0
	        },
	        bindtouchstart: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        bindtouchmove: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        bindtouchend: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        bindtouchcancel: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        bindlongtap: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        disableScroll: {
	            type: Boolean,
	            value: !1,
	            public: !0,
	            observer: 'disableScrollChanged'
	        }
	    },
	    _updatePosition: function _updatePosition() {
	        this.$.canvas.width = this._box.width;
	        this.$.canvas.height = this._box.height;
	        this._isMobile() ? WeixinJSBridge.invoke('updateCanvas', {
	            canvasId: this._canvasNumber,
	            position: this._box
	        }, function (e) {}) : this.actionsChanged(this.actions);
	    },
	    attached: function attached() {
	        var self = this;
	        this._images = {};
	        this._box = this._getBox();
	        this.$.canvas.width = this.$$.offsetWidth;
	        this.$.canvas.height = this.$$.offsetHeight;
	        if (!this.canvasId) {
	            this.triggerEvent('error', {
	                errMsg: 'canvas-id attribute is undefined'
	            });
	            this._isError = !0;
	            return void (this.$$.style.display = 'none');
	        }
	        window.__canvasNumbers__ = window.__canvasNumbers__ || {};
	        var canvasId = window.__webviewId__ + 'canvas' + this.canvasId;
	        return window.__canvasNumbers__.hasOwnProperty(canvasId) ? (this.triggerEvent('error', {
	            errMsg: 'canvas-id ' + self.canvasId + ' in this page has already existed'
	        }), this._isError = !0, void (this.$$.style.display = 'none')) : (window.__canvasNumber__ = window.__canvasNumber__ || 1e5, window.__canvasNumbers__[canvasId] = window.__canvasNumber__ + __webviewId__, window.__canvasNumber__ += 1e5, this._canvasNumber = window.__canvasNumbers__[canvasId], void (this._isMobile() ? !function () {
	            self._isReady = !1;
	            var eventObj = {
	                target: {
	                    target: self.$$.id,
	                    dataset: self.dataset,
	                    offsetTop: self.$$.offsetTop,
	                    offsetLeft: self.$$.offsetLeft
	                },
	                startTime: +new Date()
	            },
	                gesture = !1;
	            touchEventNames.forEach(function (eventKey) {
	                self['bind' + eventKey] && (eventObj[touchEventMap[eventKey]] = self['bind' + eventKey], gesture = !0);
	            });
	            WeixinJSBridge.invoke('insertCanvas', {
	                data: (0, _stringify2.default)({
	                    type: 'canvas',
	                    webviewId: window.__webviewId__,
	                    canvasNumber: self._canvasNumber
	                }),
	                gesture: gesture,
	                canvasId: self._canvasNumber,
	                position: self._box,
	                hide: self.hidden,
	                disableScroll: self.disableScroll
	            }, function (e) {
	                WeixinJSBridge.publish('canvasInsert', {
	                    canvasId: self.canvasId,
	                    canvasNumber: self._canvasNumber,
	                    data: eventObj
	                });
	                self._ready();
	                document.addEventListener('pageReRender', self._pageReRenderCallback.bind(self));
	            });
	        }() : (WeixinJSBridge.publish('canvasInsert', {
	            canvasId: self.canvasId,
	            canvasNumber: self._canvasNumber
	        }), WeixinJSBridge.subscribe('canvas' + self._canvasNumber + 'actionsChanged', function (params) {
	            var actions = params.actions,
	                reserve = params.reserve;
	            self.actions = actions;
	            self.actionsChanged(actions, reserve);
	        }), WeixinJSBridge.subscribe('invokeCanvasToDataUrl_' + self._canvasNumber, function () {
	            var dataUrl = self.$.canvas.toDataURL();
	            WeixinJSBridge.publish('onCanvasToDataUrl_' + self._canvasNumber, {
	                dataUrl: dataUrl
	            });
	        }), self._ready(), document.addEventListener('pageReRender', self._pageReRenderCallback.bind(self)), this.addTouchEventForWebview())));
	    },
	    detached: function detached() {
	        var canvasId = __webviewId__ + 'canvas' + this.canvasId;
	        delete window.__canvasNumbers__[canvasId];
	        this._isMobile() && WeixinJSBridge.invoke('removeCanvas', { canvasId: this._canvasNumber }, function (e) {});
	        WeixinJSBridge.publish('canvasRemove', {
	            canvasId: this.canvasId,
	            canvasNumber: this._canvasNumber
	        });
	    },
	    addTouchEventForWebview: function addTouchEventForWebview() {
	        var self = this;
	        touchEventNames.forEach(function (eventName) {
	            self.$$.addEventListener(eventName, function (event) {
	                var touches = getCanvasTouches.call(self, event.touches),
	                    changedTouches = getCanvasTouches.call(self, event.changedTouches);
	                self.bindlongtap && (self._touchInfo = self._touchInfo || {}, self._disableScroll = self._disableScroll || 0, eventName === 'touchstart' ? changedTouches.forEach(function (curEvent) {
	                    ;self._touchInfo[curEvent.identifier] = {}, self._touchInfo[curEvent.identifier].x = curEvent.x, self._touchInfo[curEvent.identifier].y = curEvent.y, self._touchInfo[curEvent.identifier].timeStamp = event.timeStamp, self._touchInfo[curEvent.identifier].handler = setTimeout(function () {
	                        if (self._touchInfo.hasOwnProperty(curEvent.identifier)) {
	                            ;self._touchInfo[curEvent.identifier].longPress = !0, ++self._disableScroll;
	                            var _touches = [],
	                                _changedTouches = [];
	                            for (var ide in self._touchInfo) {
	                                var curTouche = {
	                                    identifier: ide,
	                                    x: self._touchInfo[ide].x,
	                                    y: self._touchInfo[ide].y
	                                };
	                                _touches.push(curTouche);
	                                ide === String(curEvent.identifier) && _changedTouches.push(curTouche);
	                            }
	                            wx.publishPageEvent(self.bindlongtap, {
	                                type: 'bindlongtap',
	                                timeStamp: self._touchInfo[curEvent.identifier].timeStamp + LONG_PRESS_TIME_THRESHOLD,
	                                target: {
	                                    id: event.target.parentElement.id,
	                                    offsetLeft: event.target.offsetLeft,
	                                    offsetTop: event.target.offsetTop,
	                                    dataset: self.dataset
	                                },
	                                touches: _touches,
	                                changedTouches: _changedTouches
	                            });
	                        }
	                    }, LONG_PRESS_TIME_THRESHOLD);
	                }) : eventName === 'touchend' || eventName === 'touchcancel' ? changedTouches.forEach(function (n) {
	                    self._touchInfo.hasOwnProperty(n.identifier) || console.error('in ' + eventName + ', can not found ' + n.identifier + ' in ' + (0, _stringify2.default)(self._touchInfo)), self._touchInfo[n.identifier].longPress && --self._disableScroll, clearTimeout(self._touchInfo[n.identifier].handler), delete self._touchInfo[n.identifier];
	                }) : changedTouches.forEach(function (n) {
	                    self._touchInfo.hasOwnProperty(n.identifier) || console.error('in ' + eventName + ', can not found ' + n.identifier + ' in ' + (0, _stringify2.default)(self._touchInfo)), calcDistance(self._touchInfo[n.identifier], n) > LONG_PRESS_DISTANCE_THRESHOLD && !self._touchInfo[n.identifier].longPress && clearTimeout(self._touchInfo[n.identifier].handler), self._touchInfo[n.identifier].x = n.x, self._touchInfo[n.identifier].y = n.y;
	                })), self['bind' + eventName] && touches.length + changedTouches.length > 0 && wx.publishPageEvent(self['bind' + eventName], {
	                    type: eventName,
	                    timeStamp: event.timeStamp,
	                    target: {
	                        id: event.target.parentElement.id,
	                        offsetLeft: event.target.offsetLeft,
	                        offsetTop: event.target.offsetTop,
	                        dataset: self.dataset
	                    },
	                    touches: touches,
	                    changedTouches: changedTouches
	                });(self.disableScroll || self._disableScroll) && (event.preventDefault(), event.stopPropagation());
	            });
	        });
	    },
	    actionsChanged: function actionsChanged(actions) {
	        var flag = !(arguments.length <= 1 || void 0 === arguments[1]) && arguments[1];
	        if (!this._isMobile() && actions) {
	            var __canvas = this.$.canvas,
	                ctx = __canvas.getContext('2d');
	            if (flag === !1) {
	                ctx.fillStyle = '#000000';
	                ctx.strokeStyle = '#000000';
	                ctx.shadowColor = '#000000';
	                ctx.shadowBlur = 0;
	                ctx.shadowOffsetX = 0;
	                ctx.shadowOffsetY = 0;
	                ctx.setTransform(1, 0, 0, 1, 0, 0);
	                ctx.clearRect(0, 0, __canvas.width, __canvas.height);
	                actions.forEach(function (act) {
	                    var self = this,
	                        _method = act.method,
	                        _data = act.data;
	                    if (/^set/.test(_method)) {
	                        var styleKey = _method[3].toLowerCase() + _method.slice(4),
	                            styleVal = void 0;
	                        if (styleKey === 'fillStyle' || styleKey === 'strokeStyle') {
	                            if (_data[0] === 'normal') {
	                                styleVal = resolveColor(_data[1]);
	                            } else if (_data[0] === 'linear') {
	                                var _gradient = ctx.createLinearGradient.apply(ctx, _data[1]);
	                                _data[2].forEach(function (arr) {
	                                    var t = arr[0],
	                                        n = resolveColor(arr[1]);
	                                    _gradient.addColorStop(t, n);
	                                });
	                            } else if (_data[0] === 'radial') {
	                                var s = _data[1][0],
	                                    l = _data[1][1],
	                                    c = _data[1][2],
	                                    d = [s, l, 0, s, l, c],
	                                    _gradient = ctx.createRadialGradient.apply(ctx, d);
	                                _data[2].forEach(function (arr) {
	                                    var t = arr[0],
	                                        n = resolveColor(arr[1]);
	                                    _gradient.addColorStop(t, n);
	                                });
	                            }
	                            ctx[styleKey] = styleVal;
	                        } else if (styleKey === 'globalAlpha') {
	                            ctx[styleKey] = _data[0] / 255;
	                        } else if (styleKey === 'shadow') {
	                            var _keys = ['shadowOffsetX', 'shadowOffsetY', 'shadowBlur', 'shadowColor'];
	                            _data.forEach(function (e, t) {
	                                _keys[t] === 'shadowColor' ? ctx[_keys[t]] = resolveColor(e) : ctx[_keys[t]] = e;
	                            });
	                        } else {
	                            styleKey === 'fontSize' ? ctx.font = ctx.font.replace(/\d+\.?\d*px/, _data[0] + 'px') : ctx[styleKey] = _data[0];
	                        }
	                    } else {
	                        if (_method === 'fillPath' || _method === 'strokePath') {
	                            _method = _method.replace(/Path/, '');
	                            ctx.beginPath();
	                            _data.forEach(function (e) {
	                                ctx[e.method].apply(ctx, e.data);
	                            });
	                            ctx[_method]();
	                        } else {
	                            if (_method === 'fillText') {
	                                ctx.fillText.apply(ctx, _data);
	                            } else {
	                                if (_method === 'drawImage') {
	                                    !function () {
	                                        var _arr = _toArray(_data),
	                                            _url = _arr[0],
	                                            params = _arr.slice(1);
	                                        self._images = self._images || {};
	                                        /*
	                                                                                _url = _url.replace(
	                                                                                    'wdfile://',
	                                                                                    'http://wxfile.open.weixin.qq.com/'
	                                                                                )
	                                        */

	                                        if (self._images[_url]) {
	                                            ctx.drawImage.apply(ctx, [self._images[_url]].concat(_toCopyArray(params)));
	                                        } else {
	                                            self._images[_url] = new Image();
	                                            self._images[_url].src = _url;
	                                            self._images[_url].onload = function () {
	                                                ctx.drawImage.apply(ctx, [self._images[_url]].concat(_toCopyArray(params)));
	                                            };
	                                        }
	                                    }();
	                                } else {
	                                    ctx[_method].apply(ctx, _data);
	                                }
	                            }
	                        }
	                    }
	                }, this);
	            }
	        }
	    },
	    _hiddenChanged: function _hiddenChanged(hidden, t) {
	        this._isMobile() ? (this.$$.style.display = hidden ? 'none' : '', WeixinJSBridge.invoke('updateCanvas', { canvasId: this._canvasNumber, hide: hidden }, function (e) {})) : this.$$.style.display = hidden ? 'none' : '';
	    },
	    disableScrollChanged: function disableScrollChanged(disScroll, t) {
	        this._isMobile() && WeixinJSBridge.invoke('updateCanvas', {
	            canvasId: this._canvasNumber,
	            disableScroll: disScroll
	        }, function (e) {});
	    }
	});

	// wx-checkbox
	window.exparser.registerElement({
	    is: 'wx-checkbox',
	    template: '\n    <div class="wx-checkbox-wrapper">\n      <div id="input" class="wx-checkbox-input" class.wx-checkbox-input-checked="{{checked}}" class.wx-checkbox-input-disabled="{{disabled}}" style.color="{{_getColor(checked,color)}}"></div>\n      <slot></slot>\n    </div>\n  ',
	    behaviors: ['wx-base', 'wx-label-target', 'wx-item', 'wx-disabled'],
	    properties: {
	        color: {
	            type: String,
	            value: '#09BB07',
	            public: !0
	        }
	    },
	    listeners: {
	        tap: '_inputTap'
	    },
	    _getColor: function _getColor(notEmpty, def) {
	        return notEmpty ? def : '';
	    },
	    _inputTap: function _inputTap() {
	        return !this.disabled && (this.checked = !this.checked, void this.changedByTap());
	    },
	    handleLabelTap: function handleLabelTap() {
	        this._inputTap();
	    }
	});

	// wx-checkbox-group
	window.exparser.registerElement({
	    is: 'wx-checkbox-group',
	    template: '\n    <slot></slot>\n  ',
	    behaviors: ['wx-base', 'wx-data-Component', 'wx-group'],
	    properties: {
	        value: {
	            type: Array,
	            value: []
	        }
	    },
	    addItem: function addItem(checkbox) {
	        checkbox.checked && this.value.push(checkbox.value);
	    },
	    removeItem: function removeItem(checkbox) {
	        if (checkbox.checked) {
	            var index = this.value.indexOf(checkbox.value);
	            index >= 0 && this.value.splice(index, 1);
	        }
	    },
	    renameItem: function renameItem(checkbox, newVal, oldVal) {
	        if (checkbox.checked) {
	            var index = this.value.indexOf(oldVal);
	            index >= 0 && (this.value[index] = newVal);
	        }
	    },
	    changed: function changed(checkbox) {
	        if (checkbox.checked) {
	            this.value.push(checkbox.value);
	        } else {
	            var index = this.value.indexOf(checkbox.value);
	            index >= 0 && this.value.splice(index, 1);
	        }
	    }
	});

	var MAX_SIZE = 27,
	    MIN_SIZE = 18,
	    buttonTypes = {
	    'default-dark': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABRCAYAAABBuPE1AAAAAXNSR0IArs4c6QAAA1tJREFUeAHtm89rE0EcxZttbA00ePBc8CLkEEMlNId69uKtWKt/gqRevcejeBNRj/aiKNibHpVST4GQ5gc9F/RYEaE1BNLG9y1ZSNXa3eyb7Ya8hWUmuztv5vuZN9nJTnZqSpsIiIAIiIAIiMB4EEiVSqXLnU7neb/fv4Umz41Hs09t5X4qlfqYyWTK1Wr1+6lXOTiRHkBcdaB9HpJzMMQqYrK678bZAG/gxDjrdF7XecTkIapxH87/6pjYYzKQ2ggEBJIA0SQEUiBJBEgycqRAkgiQZORIgSQRIMnIkQJJIkCSkSMFkkSAJCNHCiSJAElGjhRIEgGSjBxJApkm6SRaJp/P9x008CsW2p41m80nSPty5OiE57E29LhQKDw0CYEcHeRxScB8IJARIQ6KzwskB+SxioY2CaZACiSJAElGjhRIEgGSjBwpkCQCJBk5UiBJBEgycqRAkgiQZORIIsh9klaSZGKPybPXKZJEgNSWD77OwsLCop93mXr2TgpgvkMlsfeig8AshrfZbLbsax8eHq75eZdpKox40LUPdMwv6K61Wq1XYfTZ18KNNwDyM55iX2BrD+u12+2Ui8WvnXQ6fader+8MVxZ3HhCvAuJ71xD9uKgg4cT1mZmZcq1WM0fGvhWLxUtHR0dXer3ebey2KHUxrkZQQEYdykG/Ms6C0u12z7rE2XkGyEQMZWeEAgpHmpDbUJ6dnV087+/DgLE6vWwkR9pQxl7GvwzWnbZujMRDgQS8b4jtB+7K9+TCk70camhPT09fy+Vy1wXxJET7FGpC/ndxzhHWXZvTmvAqNiEP5cjwVUxOCYEk9bVACiSJAElGjhRIEgGSTFIc+YUUT+wy+JGyZZUmAiR+ry+jQW+w/4ydxIgVWluxv8YKw7JJJGJCPmIsIxXD5P8+ADwN+sDXJttBKkqEI4M0lHUNwLyE1k3seyxN05k4kBY01pI28eBlEc5s2mfGNpEgDdz29vYuQC4huyGQEQngeeoB3Lnied4jSEV6O2xiHen3AVzZB9AKHhGuIH/gHw+bTjxIH1ij0djAnXwJMHf9Y2FSgRyihTt6E8vJdhPatMNIPw2d/m9WIP/AgzX5PcC06dELgLS1cW1RCFQqFZksCkCVFQEREAEREIHEEvgNdubEHW4rptkAAAAASUVORK5CYII=',
	    'default-light': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABRCAYAAABBuPE1AAAAAXNSR0IArs4c6QAAAsJJREFUeAHtm71KA0EUhbOijT8o6APY2FgoCFYW9nYK/pSWkvTaig9hrY2iYKmdIOgLWGgrqIUgIpKoIOh6RjMQgpid3bOb3cwZOEyMd86d++UmG3fdUklDBERABERABESgGAQCs80wDIcxbUNzUD9U5FHD5k+gchAET1kVYkEeIOFSVkkzynMIkMsZ5SpZkFUkLHonNjOrAeRA85Np/WxBhmklaKcvQP7Ul8UeurJI4kMOgSS9ygIpkCQCJBt1pECSCJBs1JECSSJAslFHCiSJAMlGHSmQJAIkG3WkQJIIkGzUkQJJIkCyUUcKpBsBXOBLY9zCdB36PRVvMrhtqxjRjZcaUq5xw5trNimDvBNI0ptLBxuBJBEg2agjBZJEgGSjjhRIEgGSjTpSIEkESDbqSIEkESDZqCMFkkSAZKOOJIM0dwJ02si0JtuR5naKThvHtiCci5y2j9Oau+vG5frcKffZGIi2JlNapV5ffiZzpjnieEXcart3jj3MQB8R9xw7zLnOiJmuEDfubE5egD2MQQ8R95wozHnrEbLtIKbX2Zi0ALkHoUloC3qHMhn2M5JRxhtMKrhytxPHzFQbZ11e1rBAXqOgRUA0s5fDfv1JUvwuFk/7DNHAS9KR5q1sbuU1IL0fcUDeg9oztOJ7FzZ2z88/CDQ+0eoxjglDiKkC4merWJffF/1g4wzSBY5LbNFBMg42Lrw6NlYgSS+tQAokiQDJRh0pkCQCJJs8deQFqaZ22JznCeQ8COxDL+0gETOn2eseZPbu38CX/zUo8llz/wg5VAyQs9Aj1HI42PoZCoKj0GUrkn7ScawaEPugo/9gOlr6Gw6IAbQJff0F1F8yMSsHxAWo1gwzpp3fywBxArpphOk3kQTVA+IIdFaHeZrASksBsQfahqZEIyEBQMzTX34Jq9FyERABERABERCBXwLfe8eGVVx752oAAAAASUVORK5CYII='
	};

	// wx-contact-button
	window.exparser.registerElement({
	    is: 'wx-contact-button',
	    behaviors: ['wx-base', 'wx-native'],
	    template: '\n    <div id="wrapper" class="wx-contact-button-wrapper">\n    </div>\n  ',
	    properties: _defineProperty({
	        sessionFrom: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        type: {
	            type: String,
	            value: 'default-dark',
	            public: !0,
	            observer: 'typeChanged'
	        },
	        size: {
	            type: Number,
	            value: 36,
	            public: !0,
	            observer: 'sizeChanged'
	        }
	    }, 'sessionFrom', {
	        type: String,
	        value: 'wxapp',
	        public: !0
	    }),
	    attached: function attached() {
	        var self = this;
	        this._isMobile();
	        if (1) {
	            var url = void 0;
	            url = buttonTypes[this.type] ? buttonTypes[this.type] : buttonTypes['default-dark'];
	            this.$.wrapper.style.backgroundImage = "url('" + url + "')";
	            this.$.wrapper.addEventListener('click', function () {
	                self._isMobile() ? wx.enterContact({
	                    sessionFrom: self.sessionFrom,
	                    complete: function complete(e) {
	                        console.log(e);
	                    }
	                }) : alert('进入客服会话，sessionFrom: ' + self.sessionFrom);
	            });
	        } else {
	            this._box = this._getBox();
	            console.log('insertContactButton', this._box);
	            wx.insertContactButton({
	                position: this._box,
	                buttonType: this.type,
	                sessionFrom: this.sessionFrom,
	                complete: function complete(res) {
	                    console.log('insertContactButton complete', res);
	                    self.contactButtonId = res.contactButtonId;
	                    document.addEventListener('pageReRender', self._pageReRender.bind(self), !1);
	                }
	            });
	        }
	    },
	    detached: function detached() {
	        this._isMobile(), 1;
	    },
	    sizeChanged: function sizeChanged(e, t) {
	        this._box = this._getBox();
	        this.$.wrapper.style.width = this._box.width + 'px';
	        this.$.wrapper.style.height = this._box.height + 'px';
	        this._updateContactButton();
	    },
	    typeChanged: function typeChanged(e, t) {
	        this._isMobile();
	        if (1) {
	            var url = void 0;
	            url = buttonTypes[this.type] ? buttonTypes[this.type] : buttonTypes['default-dark'];
	            this.$.wrapper.style.backgroundImage = "url('" + url + "')";
	        } else {
	            this._updateContactButton();
	        }
	    },
	    _updateContactButton: function _updateContactButton() {
	        this._isMobile(), 1;
	    },
	    _getBox: function _getBox() {
	        var pos = this.$.wrapper.getBoundingClientRect(),
	            size = this.size;
	        typeof size !== 'number' && (size = MIN_SIZE);
	        size = size > MAX_SIZE ? MAX_SIZE : size;
	        size = size < MIN_SIZE ? MIN_SIZE : size;
	        var res = {
	            left: pos.left + window.scrollX,
	            top: pos.top + window.scrollY,
	            width: size,
	            height: size
	        };
	        return res;
	    },
	    _pageReRender: function _pageReRender() {
	        this._updateContactButton();
	    }
	});

	// wx-form
	window.exparser.registerElement({
	    is: 'wx-form',
	    template: '\n    <span id="wrapper"><slot></slot></span>\n  ',
	    behaviors: ['wx-base'],
	    properties: {
	        reportSubmit: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        }
	    },
	    listeners: {
	        'this.formSubmit': 'submitHandler',
	        'this.formReset': 'resetHandler'
	    },
	    resetDfs: function resetDfs(element) {
	        if (element.childNodes) {
	            for (var i = 0; i < element.childNodes.length; ++i) {
	                var curChild = element.childNodes[i];
	                curChild instanceof exparser.Element && (curChild.hasBehavior('wx-data-Component') && curChild.resetFormData(), this.resetDfs(curChild));
	            }
	        }
	    },
	    getFormData: function getFormData(form, fn) {
	        return form.name && form.hasBehavior('wx-data-Component') ? form.__domElement.tagName === 'WX-INPUT' || form.__domElement.tagName === 'WX-PICKER' || form.__domElement.tagName === 'WX-TEXTAREA' ? form.getFormData(function (e) {
	            fn(e);
	        }) : fn(form.getFormData()) : fn();
	    },
	    asyncDfs: function asyncDfs(element, fn) {
	        var self = this,
	            resFn = function resFn() {
	            typeof fn === 'function' && fn();
	            fn = void 0;
	        };
	        if (!element.childNodes) {
	            return resFn();
	        }
	        for (var length = element.childNodes.length, i = 0; i < element.childNodes.length; ++i) {
	            var curChild = element.childNodes[i];
	            curChild instanceof exparser.Element ? !function (form) {
	                self.getFormData(form, function (val) {
	                    typeof val !== 'undefined' && (self._data[form.name] = val);
	                    self.asyncDfs(form, function () {
	                        --length == 0 && resFn();
	                    });
	                });
	            }(curChild) : --length;
	        }
	        length == 0 && resFn();
	    },
	    submitHandler: function submitHandler(event) {
	        var self = this,
	            _target = {
	            id: event.target.__domElement.id,
	            dataset: event.target.dataset,
	            offsetTop: event.target.__domElement.offsetTop,
	            offsetLeft: event.target.__domElement.offsetLeft
	        };
	        this._data = (0, _create2.default)(null);
	        return this.asyncDfs(this, function () {
	            self.reportSubmit ? self._isDevTools() ? self.triggerEvent('submit', {
	                value: self._data,
	                formId: 'the formId is subscribe mock one',
	                target: _target
	            }) : WeixinJSBridge.invoke('reportSubmitForm', {}, function (e) {
	                self.triggerEvent('submit', {
	                    value: self._data,
	                    formId: e.formId,
	                    target: _target
	                });
	            }) : self.triggerEvent('submit', { value: self._data, target: _target });
	        }), !1;
	    },
	    resetHandler: function resetHandler(event) {
	        var _target = {
	            id: event.target.__domElement.id,
	            dataset: event.target.dataset,
	            offsetTop: event.target.__domElement.offsetTop,
	            offsetLeft: event.target.__domElement.offsetLeft
	        };
	        this._data = (0, _create2.default)(null);
	        this.resetDfs(this);
	        this.triggerEvent('reset', { target: _target });
	        return !1;
	    }
	});

	// wx-icon
	window.exparser.registerElement({
	    is: 'wx-icon',
	    template: '<i class$="wx-icon-{{type}}" style.color="{{color}}" style.font-size="{{size}}px"></i>',
	    behaviors: ['wx-base'],
	    properties: {
	        type: {
	            type: String,
	            public: !0
	        },
	        size: {
	            type: Number,
	            value: 23,
	            public: !0
	        },
	        color: {
	            type: String,
	            public: !0
	        }
	    }
	});

	// wx-image
	window.exparser.registerElement({
	    is: 'wx-image',
	    template: '<div id="div"></div>',
	    behaviors: ['wx-base'],
	    properties: {
	        src: {
	            type: String,
	            observer: 'srcChanged',
	            public: !0
	        },
	        mode: {
	            type: String,
	            observer: 'modeChanged',
	            public: !0
	        },
	        _disableSizePositionRepeat: {
	            type: Boolean,
	            value: !1
	        },
	        backgroundSize: {
	            type: String,
	            observer: 'backgroundSizeChanged',
	            value: '100% 100%',
	            public: !0
	        },
	        backgroundPosition: {
	            type: String,
	            observer: 'backgroundPositionChanged',
	            public: !0
	        },
	        backgroundRepeat: {
	            type: String,
	            observer: 'backgroundRepeatChanged',
	            value: 'no-repeat',
	            public: !0
	        },
	        _img: {
	            type: Object
	        }
	    },
	    _publishError: function _publishError(errMsg) {
	        this.triggerEvent('error', errMsg);
	    },
	    _ready: function _ready() {
	        if (!(this._img && this._img instanceof Image)) {
	            this._img = new Image();
	            var self = this;
	            this._img.onerror = function (event) {
	                event.stopPropagation();
	                var data = {
	                    errMsg: 'GET ' + self._img.src + ' 404 (Not Found)'
	                };
	                self._publishError(data);
	            };
	            this._img.onload = function (event) {
	                event.stopPropagation();
	                self.triggerEvent('load', {
	                    width: this.width,
	                    height: this.height
	                });
	                if (self.mode === 'widthFix') {
	                    self.rate = this.width / this.height;
	                    self.$$.style.height = (self.$.div.offsetWidth || self.$$.offsetWidth) / self.rate + 'px';
	                }
	            };
	            document.addEventListener('pageReRender', this._pageReRenderCallback.bind(this));
	        }
	    },
	    attached: function attached() {
	        this._ready();
	        this.backgroundSizeChanged(this.backgroundSize);
	        this.backgroundRepeatChanged(this.backgroundRepeat);
	    },
	    detached: function detached() {
	        document.removeEventListener('pageReRender', this._pageReRenderCallback.bind(this));
	    },
	    _pageReRenderCallback: function _pageReRenderCallback() {
	        this.mode === 'widthFix' && typeof this.rate !== 'undefined' && (this.$$.style.height = this.$$.offsetWidth / this.rate + 'px');
	    },
	    _srcChanged: function _srcChanged(url) {
	        this._img.src = url;
	        this.$.div.style.backgroundImage = "url('" + url + "')";
	    },
	    srcChanged: function srcChanged(filePath, t) {
	        if (filePath) {
	            var ua = (this.$.div, window.navigator.userAgent.toLowerCase()),
	                self = this;
	            this._ready();
	            var opts = {
	                success: function success(e) {
	                    self._srcChanged(e.localData);
	                },
	                fail: function fail(e) {
	                    self._publishError(e);
	                }
	            }; //!/wechatdevtools/.test(ua)
	             false ? /^(http|https):\/\//.test(filePath) || /^\s*data:image\//.test(filePath) ? this._srcChanged(filePath) : /^wdfile:\/\//.test(filePath) ? (opts.filePath = filePath, wx.getLocalImgData(opts)) : (opts.path = filePath, wx.getLocalImgData(opts)) :  false ? /^wdfile:\/\//.test(filePath) || /^(http|https):\/\//.test(filePath) || /^\s*data:image\//.test(filePath) ? this._srcChanged(filePath) : wx.getCurrentRoute({
	                success: function success(t) {
	                    var n = wx.getRealRoute(t.route, filePath);
	                    self._srcChanged(n);
	                }
	            }) : this._srcChanged(filePath /*.replace(
	                                           'wdfile://',
	                                           'http://wxfile.open.weixin.qq.com/'
	                                           )*/
	            );
	        }
	    },
	    _checkMode: function _checkMode(styleKey) {
	        var styles = ['scaleToFill', 'aspectFit', 'aspectFill', 'top', 'bottom', 'center', 'left', 'right', 'top left', 'top right', 'bottom left', 'bottom right'],
	            res = !1,
	            i = 0;
	        for (; i < styles.length; i++) {
	            if (styleKey == styles[i]) {
	                res = !0;
	                break;
	            }
	        }
	        return res;
	    },
	    modeChanged: function modeChanged(mode, t) {
	        if (!this._checkMode(mode)) {
	            return void (this._disableSizePositionRepeat = !1);
	        }
	        this._disableSizePositionRepeat = !0;
	        this.$.div.style.backgroundSize = 'auto auto';
	        this.$.div.style.backgroundPosition = '0% 0%';
	        this.$.div.style.backgroundRepeat = 'no-repeat';
	        switch (mode) {
	            case 'scaleToFill':
	                this.$.div.style.backgroundSize = '100% 100%';
	                break;
	            case 'aspectFit':
	                this.$.div.style.backgroundSize = 'contain', this.$.div.style.backgroundPosition = 'center center';
	                break;
	            case 'aspectFill':
	                this.$.div.style.backgroundSize = 'cover', this.$.div.style.backgroundPosition = 'center center';
	                break;
	            case 'widthFix':
	                this.$.div.style.backgroundSize = '100% 100%';
	                break;
	            case 'top':
	                this.$.div.style.backgroundPosition = 'top center';
	                break;
	            case 'bottom':
	                this.$.div.style.backgroundPosition = 'bottom center';
	                break;
	            case 'center':
	                this.$.div.style.backgroundPosition = 'center center';
	                break;
	            case 'left':
	                this.$.div.style.backgroundPosition = 'center left';
	                break;
	            case 'right':
	                this.$.div.style.backgroundPosition = 'center right';
	                break;
	            case 'top left':
	                this.$.div.style.backgroundPosition = 'top left';
	                break;
	            case 'top right':
	                this.$.div.style.backgroundPosition = 'top right';
	                break;
	            case 'bottom left':
	                this.$.div.style.backgroundPosition = 'bottom left';
	                break;
	            case 'bottom right':
	                this.$.div.style.backgroundPosition = 'bottom right';
	        }
	    },
	    backgroundSizeChanged: function backgroundSizeChanged(value, t) {
	        this._disableSizePositionRepeat || (this.$.div.style.backgroundSize = value);
	    },
	    backgroundPositionChanged: function backgroundPositionChanged(value, t) {
	        this._disableSizePositionRepeat || (this.$.div.style.backgroundPosition = value);
	    },
	    backgroundRepeatChanged: function backgroundRepeatChanged(value, t) {
	        this._disableSizePositionRepeat || (this.$.div.style.backgroundRepeat = value);
	    }
	});

	// wx-input if in wechatdevtools
	!function () {
	    window.exparser.registerElement({
	        is: 'wx-input',
	        template: '\n      <div id="wrapper" disabled$="{{disabled}}">\n        <input id="input" type$="{{_getType(type,password)}}" maxlength$="{{maxlength}}" value$="{{showValue}}" disabled$="{{disabled}}" >\n        <div id="placeholder" class$="{{_getPlaceholderClass(placeholderClass)}}" style$="{{_getPlaceholderStyle(placeholderStyle)}}" parse-text-content>{{placeholder}}</p>\n      </div>\n      ',
	        behaviors: ['wx-base', 'wx-data-Component'],
	        properties: {
	            focus: {
	                type: Boolean,
	                value: 0,
	                coerce: '_focusChange',
	                public: !0
	            },
	            autoFocus: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            placeholder: {
	                type: String,
	                value: '',
	                observer: '_placeholderChange',
	                public: !0
	            },
	            placeholderStyle: {
	                type: String,
	                value: '',
	                public: !0
	            },
	            placeholderClass: {
	                type: String,
	                value: '',
	                public: !0,
	                observer: '_placeholderClassChange'
	            },
	            value: {
	                type: String,
	                value: '',
	                coerce: 'defaultValueChange',
	                public: !0
	            },
	            showValue: {
	                type: String,
	                value: ''
	            },
	            maxlength: {
	                type: Number,
	                value: 140,
	                observer: '_maxlengthChanged',
	                public: !0
	            },
	            type: {
	                type: String,
	                value: 'text',
	                public: !0
	            },
	            password: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            disabled: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            bindinput: {
	                type: String,
	                value: '',
	                public: !0
	            },
	            confirmHold: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            }
	        },
	        listeners: {
	            tap: '_inputFocus',
	            'input.focus': '_inputFocus',
	            'input.blur': '_inputBlur',
	            'input.input': '_inputKey'
	        },
	        resetFormData: function resetFormData() {
	            this._keyboardShow && (this.__formResetCallback = !0, wx.hideKeyboard()), this.value = '', this.showValue = '';
	        },
	        getFormData: function getFormData(callback) {
	            this._keyboardShow ? this.__formCallback = callback : typeof callback === 'function' && callback(this.value);
	        },
	        _formGetDataCallback: function _formGetDataCallback() {
	            typeof this.__formCallback === 'function' && this.__formCallback(this.value), this.__formCallback = void 0;
	        },
	        _focusChange: function _focusChange(getFocus) {
	            return this._couldFocus(getFocus), getFocus;
	        },
	        _couldFocus: function _couldFocus(getFocus) {
	            var self = this;
	            this._attached && (!this._keyboardShow && getFocus ? window.requestAnimationFrame(function () {
	                self._inputFocus();
	            }) : this._keyboardShow && !getFocus && this.$.input.blur());
	        },
	        _getPlaceholderClass: function _getPlaceholderClass(name) {
	            return 'input-placeholder ' + name;
	        },
	        _maxlengthChanged: function _maxlengthChanged(length, t) {
	            var vaildVal = this.value.slice(0, length);
	            vaildVal != this.value && (this.value = vaildVal);
	        },
	        _placeholderChange: function _placeholderChange() {
	            this._checkPlaceholderStyle(this.value);
	        },
	        attached: function attached() {
	            var self = this;
	            this._placeholderClassChange(this.placeholderClass), this._checkPlaceholderStyle(this.value), this._attached = !0, this._value = this.value, this.updateInput(), window.__onAppRouteDone && this._couldFocus(this.autoFocus || this.focus), this.__routeDoneId = exparser.addListenerToElement(document, 'routeDone', function () {
	                self._couldFocus(self.autoFocus || self.focus);
	            }), this.__setKeyboardValueId = exparser.addListenerToElement(document, 'setKeyboardValue', function (event) {
	                if (self._keyboardShow) {
	                    var value = event.detail.value,
	                        cursor = event.detail.cursor;
	                    typeof value !== 'undefined' && (self._value = value, self.value = value), typeof cursor !== 'undefined' && cursor != -1 && self.$.input.setSelectionRange(cursor, cursor);
	                }
	            }), this.__hideKeyboardId = exparser.addListenerToElement(document, 'hideKeyboard', function (t) {
	                self._keyboardShow && self.$.input.blur();
	            }), this.__onDocumentTouchStart = this.onDocumentTouchStart.bind(this), this.__updateInput = this.updateInput.bind(this), this.__inputKeyUp = this._inputKeyUp.bind(this), this.$.input.addEventListener('keyup', this.__inputKeyUp), document.addEventListener('touchstart', this.__onDocumentTouchStart), document.addEventListener('pageReRender', this.__updateInput), (this.autoFocus || this.focus) && setTimeout(function () {
	                self._couldFocus(self.autoFocus || self.focus);
	            }, 500);
	        },
	        detached: function detached() {
	            document.removeEventListener('pageReRender', this.__updateInput), document.removeEventListener('touchstart', this.__onDocumentTouchStart), this.$.input.removeEventListener('keyup', this.__inputKeyUp), exparser.removeListenerFromElement(document, 'routeDone', this.__routeDoneId), exparser.removeListenerFromElement(document, 'hideKeyboard', this.__hideKeyboardId), exparser.removeListenerFromElement(document, 'onKeyboardComplete', this.__onKeyboardCompleteId), exparser.removeListenerFromElement(document, 'setKeyboardValue', this.__setKeyboardValueId);
	        },
	        onDocumentTouchStart: function onDocumentTouchStart() {
	            this._keyboardShow && this.$.input.blur();
	        },
	        _getType: function _getType(type, isPswd) {
	            return isPswd || type == 'password' ? 'password' : 'text';
	        },
	        _showValueChange: function _showValueChange(value) {
	            this.$.input.value = value;
	        },
	        _inputFocus: function _inputFocus(e) {
	            this.disabled || this._keyboardShow || (this._keyboardShow = !0, this.triggerEvent('focus', {
	                value: this.value
	            }), this.$.input.focus());
	        },
	        _inputBlur: function _inputBlur(e) {
	            ;this._keyboardShow = !1, this.value = this._value, this._formGetDataCallback(), this.triggerEvent('change', { value: this.value }), this.triggerEvent('blur', {
	                value: this.value
	            }), this._checkPlaceholderStyle(this.value);
	        },
	        _inputKeyUp: function _inputKeyUp(event) {
	            if (event.keyCode == 13) {
	                this.triggerEvent('confirm', { value: this._value });
	                return void (this.confirmHold || (this.value = this._value, this.$.input.blur()));
	            }
	        },
	        _inputKey: function _inputKey(event) {
	            var value = event.target.value;
	            this._value = value;
	            this._checkPlaceholderStyle(value);
	            if (this.bindinput) {
	                var target = {
	                    id: this.$$.id,
	                    dataset: this.dataset,
	                    offsetTop: this.$$.offsetTop,
	                    offsetLeft: this.$$.offsetLeft
	                };
	                WeixinJSBridge.publish('SPECIAL_PAGE_EVENT', {
	                    eventName: this.bindinput,
	                    data: {
	                        ext: {
	                            setKeyboardValue: !0
	                        },
	                        data: {
	                            type: 'input',
	                            timestamp: Date.now(),
	                            detail: {
	                                value: event.target.value,
	                                cursor: this.$.input.selectionStart
	                            },
	                            target: target,
	                            currentTarget: target,
	                            touches: []
	                        },
	                        eventName: this.bindinput
	                    }
	                });
	            }
	            return !1;
	        },
	        updateInput: function updateInput() {
	            var styles = window.getComputedStyle(this.$$),
	                bounds = this.$$.getBoundingClientRect(),
	                pos = (['Left', 'Right'].map(function (type) {
	                return parseFloat(styles['border' + type + 'Width']) + parseFloat(styles['padding' + type]);
	            }), ['Top', 'Bottom'].map(function (type) {
	                return parseFloat(styles['border' + type + 'Width']) + parseFloat(styles['padding' + type]);
	            })),
	                inputObj = this.$.input,
	                height = bounds.height - pos[0] - pos[1];
	            height != this.__lastHeight && (inputObj.style.height = height + 'px', inputObj.style.lineHeight = height + 'px', this.__lastHeight = height), inputObj.style.color = styles.color;
	            var ele = this.$.placeholder;ele.style.height = bounds.height - pos[0] - pos[1] + 'px', ele.style.lineHeight = ele.style.height;
	        },
	        defaultValueChange: function defaultValueChange(value, t) {
	            this.maxlength > 0 && (value = value.slice(0, this.maxlength)), this._checkPlaceholderStyle(value), this._showValueChange(value), this._value = value;
	            return value;
	        },
	        _getPlaceholderStyle: function _getPlaceholderStyle(placeholderStyle) {
	            return placeholderStyle;
	        },
	        _placeholderClassChange: function _placeholderClassChange(className) {
	            var classs = className.split(/\s/);
	            this._placeholderClass = [];
	            for (var n = 0; n < classs.length; n++) {
	                classs[n] && this._placeholderClass.push(classs[n]);
	            }
	        },
	        _checkPlaceholderStyle: function _checkPlaceholderStyle(hide) {
	            var phClasss = this._placeholderClass || [],
	                placeholderNode = this.$.placeholder;
	            if (hide) {
	                if (this._placeholderShow && (placeholderNode.classList.remove('input-placeholder'), placeholderNode.setAttribute('style', ''), phClasss.length > 0)) {
	                    for (var i = 0; i < phClasss.length; i++) {
	                        placeholderNode.classList.contains(phClasss[i]) && placeholderNode.classList.remove(phClasss[i]);
	                    }
	                }
	                ;placeholderNode.style.display = 'none', this._placeholderShow = !1;
	            } else {
	                if (!this._placeholderShow && (placeholderNode.classList.add('input-placeholder'), this.placeholderStyle && placeholderNode.setAttribute('style', this.placeholderStyle), phClasss.length > 0)) {
	                    for (var i = 0; i < phClasss.length; i++) {
	                        placeholderNode.classList.add(phClasss[i]);
	                    }
	                }
	                ;placeholderNode.style.display = '', this.updateInput(), this._placeholderShow = !0;
	            }
	        }
	    });
	}();

	// wx-label
	window.exparser.registerElement({
	    is: 'wx-label',
	    template: '\n    <slot></slot>\n  ',
	    properties: {
	        for: {
	            type: String,
	            public: !0
	        }
	    },
	    listeners: {
	        tap: 'onTap'
	    },
	    behaviors: ['wx-base'],
	    _handleNode: function _handleNode(ele, event) {
	        return !!(ele instanceof exparser.Element && ele.hasBehavior('wx-label-target')) && (ele.handleLabelTap(event), !0);
	    },
	    dfs: function dfs(ele, event) {
	        if (this._handleNode(ele, event)) return !0;
	        if (!ele.childNodes) return !1;
	        for (var idx = 0; idx < ele.childNodes.length; ++idx) {
	            if (this.dfs(ele.childNodes[idx], event)) return !0;
	        }
	        return !1;
	    },
	    onTap: function onTap(event) {
	        for (var target = event.target; target instanceof exparser.Element && target !== this; target = target.parentNode) {
	            if (target.hasBehavior('wx-label-target')) return;
	        }
	        if (this.for) {
	            var boundEle = document.getElementById(this.for);
	            boundEle && this._handleNode(boundEle.__wxElement, event);
	        } else {
	            this.dfs(this, event);
	        }
	    }
	});

	// wx-loading
	window.exparser.registerElement({
	    is: 'wx-loading',
	    template: '\n    <div class="wx-loading-mask" style$="background-color: transparent;"></div>\n    <div class="wx-loading">\n      <i class="wx-loading-icon"></i><p class="wx-loading-content"><slot></slot></p>\n    </div>\n  ',
	    // template: '\n    <div class="wx-loading-mask" style$="background-color: transparent;"></div>\n    <div class="wx-loading">\n      <invoke class="wx-loading-icon"></invoke><p class="wx-loading-content"><slot></slot></p>\n    </div>\n  ',
	    behaviors: ['wx-base']
	});

	// add map sdk
	!function () {
	    window.addEventListener('DOMContentLoaded', function () {
	        if (window.__wxConfig__.weweb && window.__wxConfig__.weweb.nomap) return;
	        var script = document.createElement('script');
	        script.async = true;
	        script.type = 'text/javascript';
	        script.src = 'https://map.qq.com/api/js?v=2.exp&callback=__map_jssdk_init';
	        document.body.appendChild(script);
	    });
	    window.__map_jssdk_id = 0;
	    window.__map_jssdk_ready = !1;
	    window.__map_jssdk_callback = [];
	    window.__map_jssdk_init = function () {
	        for (__map_jssdk_ready = !0; __map_jssdk_callback.length;) {
	            var e = __map_jssdk_callback.pop();
	            e();
	        }
	    };
	}();

	// wx-map
	window.exparser.registerElement({
	    is: 'wx-map',
	    behaviors: ['wx-base', 'wx-native'],
	    template: '<div id="map" style="width: 100%; height: 100%;"></div>',
	    properties: {
	        latitude: {
	            type: Number,
	            public: !0,
	            observer: 'latitudeChanged',
	            value: 39.92
	        },
	        longitude: {
	            type: Number,
	            public: !0,
	            observer: 'longitudeChanged',
	            value: 116.46
	        },
	        scale: {
	            type: Number,
	            public: !0,
	            observer: 'scaleChanged',
	            scale: 16
	        },
	        markers: {
	            type: Array,
	            value: [],
	            public: !0,
	            observer: 'markersChanged'
	        },
	        covers: {
	            type: Array,
	            value: [],
	            public: !0,
	            observer: 'coversChanged'
	        },
	        includePoints: {
	            type: Array,
	            value: [],
	            public: !0,
	            observer: 'pointsChanged'
	        },
	        polyline: {
	            type: Array,
	            value: [],
	            public: !0,
	            observer: 'linesChanged'
	        },
	        circles: {
	            type: Array,
	            value: [],
	            public: !0,
	            observer: 'circlesChanged'
	        },
	        controls: {
	            type: Array,
	            value: [],
	            public: !0,
	            observer: 'controlsChanged'
	        },
	        showLocation: {
	            type: Boolean,
	            value: !1,
	            public: !0,
	            observer: 'showLocationChanged'
	        },
	        bindmarkertap: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        bindcontroltap: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        bindregionchange: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        bindtap: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        _mapId: {
	            type: Number
	        }
	    },
	    _delay: function _delay(cb, t, n) {
	        this._deferred.push({
	            callback: cb,
	            args: [t, n]
	        });
	    },
	    _update: function _update(opt, t) {
	        ;opt.mapId = this._mapId, opt.hide = this.hidden, WeixinJSBridge.invoke('updateMap', opt, function (e) {});
	    },
	    _updatePosition: function _updatePosition() {
	        this._isMobile() && (this._isiOS() && (this._box.width = this._box.width || 1, this._box.height = this._box.height || 1), WeixinJSBridge.invoke('updateMap', {
	            mapId: this._mapId,
	            position: this._box,
	            covers: this.covers || []
	        }, function (e) {}));
	    },
	    _transformPath: function _transformPath(path, t) {
	        return path.map(function (item) {
	            var tempObj = {};
	            return item.iconPath ? ((0, _keys3.default)(item).forEach(function (itemName) {
	                tempObj[itemName] = item[itemName];
	            }), tempObj.iconPath = wx.getRealRoute(t, tempObj.iconPath), tempObj) : item;
	        });
	    },
	    _hiddenChanged: function _hiddenChanged(hide, t) {
	        this._isMobile() ? (this.$$.style.display = hide ? 'none' : '', WeixinJSBridge.invoke('updateMap', {
	            mapId: this._mapId,
	            hide: hide
	        }, function (e) {})) : this.$$.style.display = hide ? 'none' : '';
	    },
	    _transformMarkers: function _transformMarkers(markers) {
	        var selof = this;
	        return (markers || []).map(function (marker) {
	            var tempObj = {};
	            return marker ? ((0, _keys3.default)(marker).forEach(function (t) {
	                tempObj[t] = marker[t];
	            }), marker.name && (tempObj.title = tempObj.title || tempObj.name), typeof marker.id !== 'undefined' && selof.bindmarkertap && (tempObj.data = (0, _stringify2.default)({
	                markerId: marker.id,
	                bindmarkertap: selof.bindmarkertap
	            })), tempObj) : tempObj;
	        });
	    },
	    _transformControls: function _transformControls(ctrls) {
	        var self = this;
	        return ctrls.map(function (ctrl) {
	            var tempObj = {};
	            (0, _keys3.default)(ctrl).forEach(function (t) {
	                tempObj[t] = ctrl[t];
	            });
	            typeof ctrl.id !== 'undefined' && self.bindcontroltap && ctrl.clickable && (tempObj.data = (0, _stringify2.default)({
	                controlId: ctrl.id,
	                bindcontroltap: self.bindcontroltap
	            }));
	            return tempObj;
	        });
	    },
	    _transformColor: function _transformColor(hexColor) {
	        hexColor.indexOf('#') === 0 && (hexColor = hexColor.substr(1));
	        var r = Number('0x' + hexColor.substr(0, 2)),
	            g = Number('0x' + hexColor.substr(2, 2)),
	            b = Number('0x' + hexColor.substr(4, 2)),
	            a = hexColor.substr(6, 2) ? Number('0x' + hexColor.substr(6, 2)) / 255 : 1;
	        return new qq.maps.Color(r, g, b, a);
	    },
	    _initFeatures: function _initFeatures() {
	        this._mapId && ((this.markers && this.markers.length > 0 || this.covers && this.covers.length > 0) && WeixinJSBridge.invoke('addMapMarkers', {
	            mapId: this._mapId,
	            markers: this._transformMarkers(this.markers).concat(this.covers)
	        }, function (e) {}), this.includePoints && this.includePoints.length > 0 && WeixinJSBridge.invoke('includeMapPoints', {
	            mapId: this._mapId,
	            points: this.includePoints
	        }, function (e) {}), this.polyline && this.polyline.length > 0 && WeixinJSBridge.invoke('addMapLines', {
	            mapId: this._mapId,
	            lines: this.polyline
	        }, function (e) {}), this.circles && this.circles.length > 0 && WeixinJSBridge.invoke('addMapCircles', {
	            mapId: this._mapId,
	            circles: this.circles
	        }, function (e) {}), this.controls && this.controls.length > 0 && WeixinJSBridge.invoke('addMapControls', {
	            mapId: this._mapId,
	            controls: this._transformControls(this.controls)
	        }, function (e) {}));
	    },
	    _insertNativeMap: function _insertNativeMap() {
	        var self = this;this._box.width = this._box.width || 1, this._box.height = this._box.height || 1;
	        var opt = {
	            position: this._box,
	            centerLongitude: this.longitude,
	            centerLatitude: this.latitude,
	            scale: this.scale,
	            covers: this.covers || [],
	            hide: this.hidden,
	            showLocation: this.showLocation
	        };
	        this._canInvokeNewFeature || (opt.markers = this.markers || []);
	        WeixinJSBridge.invoke('insertMap', opt, function (res) {
	            ;/ok/.test(res.errMsg) ? (self._mapId = res.mapId, self._ready(), self._canInvokeNewFeature && WeixinJSBridge.publish('mapInsert', {
	                domId: self.id,
	                mapId: self._mapId,
	                showLocation: self.showLocation,
	                bindregionchange: self.bindregionchange,
	                bindtap: self.bindtap
	            }), self.__pageReRenderCallback = self._pageReRenderCallback.bind(self), document.addEventListener('pageReRender', self.__pageReRenderCallback)) : self.triggerEvent('error', {
	                errMsg: res.errMsg
	            });
	        });
	    },
	    _insertIframeMap: function _insertIframeMap() {
	        var self = this,
	            map = this._map = new qq.maps.Map(this.$.map, {
	            zoom: this.scale,
	            center: new qq.maps.LatLng(this.latitude, this.longitude),
	            mapTypeId: qq.maps.MapTypeId.ROADMAP,
	            zoomControl: !1,
	            mapTypeControl: !1
	        }),
	            isDragging = !1,
	            stopedDragging = !1;
	        qq.maps.event.addListener(map, 'click', function () {
	            self.bindtap && wx.publishPageEvent(self.bindtap, {});
	        });
	        qq.maps.event.addListener(map, 'drag', function () {
	            self.bindregionchange && !isDragging && (wx.publishPageEvent(self.bindregionchange, {
	                type: 'begin'
	            }), isDragging = !0, stopedDragging = !1);
	        });
	        qq.maps.event.addListener(map, 'dragend', function () {
	            isDragging && (isDragging = !1, stopedDragging = !0);
	        });
	        qq.maps.event.addListener(map, 'bounds_changed', function () {
	            self.bindregionchange && stopedDragging && (wx.publishPageEvent(self.bindregionchange, {
	                type: 'end'
	            }), stopedDragging = !1);
	        });
	        var mapTitlesLoadedEvent = qq.maps.event.addListener(map, 'tilesloaded', function () {
	            self._mapId = __map_jssdk_id++;
	            self._ready();
	            WeixinJSBridge.subscribe('doMapAction' + self._mapId, function (res) {
	                if (self._map && self._mapId === res.data.mapId) {
	                    if (res.data.method === 'getMapCenterLocation') {
	                        var center = self._map.getCenter();
	                        WeixinJSBridge.publish('doMapActionCallback', {
	                            mapId: self._mapId,
	                            callbackId: res.data.callbackId,
	                            method: res.data.method,
	                            latitude: center.getLat(),
	                            longitude: center.getLng()
	                        });
	                    } else {
	                        res.data.method === 'moveToMapLocation' && self.showLocation && WeixinJSBridge.invoke('private_geolocation', {}, function (res) {
	                            try {
	                                res = JSON.parse(res);
	                            } catch (e) {
	                                res = {};
	                            }
	                            if (res.result && res.result.location) {
	                                var loc = res.result.location;
	                                self._posOverlay && self._posOverlay.setMap(null);
	                                self._posOverlay = new self.CustomOverlay(new qq.maps.LatLng(loc.lat, loc.lng));
	                                self._posOverlay.setMap(self._map);
	                                self._map.panTo(new qq.maps.LatLng(loc.lat, loc.lng));
	                            }
	                        });
	                    }
	                }
	            });
	            WeixinJSBridge.publish('mapInsert', {
	                domId: self.id,
	                mapId: self._mapId,
	                showLocation: self.showLocation,
	                bindregionchange: self.bindregionchange,
	                bindtap: self.bindtap
	            });
	            qq.maps.event.removeListener(mapTitlesLoadedEvent);
	            mapTitlesLoadedEvent = null;
	        });
	        var CustomOverlay = this.CustomOverlay = function (pos, idx) {
	            this.index = idx;
	            this.position = pos;
	        };
	        CustomOverlay.prototype = new qq.maps.Overlay();
	        CustomOverlay.prototype.construct = function () {
	            var div = this.div = document.createElement('div');
	            div.setAttribute('style', 'width: 32px;height: 32px;background: rgba(31, 154, 228,.3);border-radius: 20px;position: absolute;');
	            var div2 = document.createElement('div');
	            div2.setAttribute('style', 'position: absolute;width: 16px;height: 16px;background: white;border-radius: 8px;top: 8px;left: 8px;');
	            div.appendChild(div2);
	            var div3 = document.createElement('div');
	            div3.setAttribute('style', 'position: absolute;width: 12px;height: 12px;background: rgb(31, 154, 228);border-radius: 6px;top: 2px;left: 2px;');
	            div2.appendChild(div3);
	            var panes = this.getPanes();
	            panes.overlayMouseTarget.appendChild(div);
	        };
	        CustomOverlay.prototype.draw = function () {
	            var projection = this.getProjection(),
	                pixInfo = projection.fromLatLngToDivPixel(this.position),
	                style = this.div.style;style.left = pixInfo.x - 16 + 'px', style.top = pixInfo.y - 16 + 'px';
	        };
	        CustomOverlay.prototype.destroy = function () {
	            ;this.div.onclick = null, this.div.parentNode.removeChild(this.div), this.div = null;
	        };
	    },
	    latitudeChanged: function latitudeChanged(centerLatitude, t) {
	        if (centerLatitude) {
	            return this._isReady ? void (this._isMobile() ? this._update({
	                centerLatitude: centerLatitude,
	                centerLongitude: this.longitude
	            }, '纬度') : this._map.setCenter(new qq.maps.LatLng(centerLatitude, this.longitude))) : void this._delay('latitudeChanged', centerLatitude, t);
	        }
	    },
	    longitudeChanged: function longitudeChanged(centerLongitude, t) {
	        if (centerLongitude) {
	            return this._isReady ? void (this._isMobile() ? this._update({
	                centerLatitude: this.latitude,
	                centerLongitude: centerLongitude
	            }, '经度') : this._map.setCenter(new qq.maps.LatLng(this.latitude, centerLongitude))) : void this._delay('longitudeChanged', centerLongitude, t);
	        }
	    },
	    scaleChanged: function scaleChanged() {
	        var scale = arguments.length <= 0 || void 0 === arguments[0] ? 16 : arguments[0],
	            arg2 = arguments[1];
	        if (scale) {
	            return this._isReady ? void (this._isMobile() ? this._update({
	                centerLatitude: this.latitude,
	                centerLongitude: this.longitude,
	                scale: scale
	            }, '缩放') : this._map.zoomTo(scale)) : void this._delay('scaleChanged', scale, arg2);
	        }
	    },
	    coversChanged: function coversChanged() {
	        var self = this,
	            arg1 = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0],
	            arg2 = arguments[1];
	        return this._isReady ? void (this._isMobile() ? wx.getCurrentRoute({
	            success: function success(n) {
	                self._update({
	                    centerLatitude: self.latitude,
	                    centerLongitude: self.longitude,
	                    covers: self._transformPath(arg1, n.route)
	                }, '覆盖物');
	            }
	        }) : ((this._covers || []).forEach(function (e) {
	            e.setMap(null);
	        }), this._covers = arg1.map(function (t) {
	            var n = new qq.maps.Marker({
	                position: new qq.maps.LatLng(t.latitude, t.longitude),
	                map: self._map
	            });
	            return t.iconPath && n.setIcon(new qq.maps.MarkerImage(t.iconPath)), n;
	        }))) : void this._delay('coversChanged', arg1, arg2);
	    },
	    markersChanged: function markersChanged() {
	        var self = this,
	            markerArg = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0],
	            arg2 = arguments[1];
	        return this._isReady ? void (this._isMobile() ? wx.getCurrentRoute({
	            success: function success(res) {
	                var markers = self._transformPath(self._transformMarkers(markerArg), res.route);
	                self._canInvokeNewFeature ? WeixinJSBridge.invoke('addMapMarkers', {
	                    mapId: self._mapId,
	                    markers: markers
	                }, function (e) {}) : self._update({
	                    centerLatitude: self.latitude,
	                    centerLongitude: self.longitude,
	                    markers: markers
	                });
	            }
	        }) : ((this._markers || []).forEach(function (e) {
	            e.setMap(null);
	        }), this._markers = markerArg.map(function (markerItem) {
	            var markerIns = new qq.maps.Marker({
	                position: new qq.maps.LatLng(markerItem.latitude, markerItem.longitude),
	                map: self._map
	            });
	            return markerItem.iconPath && (Number(markerItem.width) && Number(markerItem.height) ? markerIns.setIcon(new qq.maps.MarkerImage(markerItem.iconPath, new qq.maps.Size(markerItem.width, markerItem.height), new qq.maps.Point(0, 0), new qq.maps.Point(markerItem.width / 2, markerItem.height), new qq.maps.Size(markerItem.width, markerItem.height))) : markerIns.setIcon(new qq.maps.MarkerImage(markerItem.iconPath))), (markerItem.title || markerItem.name) && markerIns.setTitle(markerItem.title || markerItem.name), self.bindmarkertap && typeof markerItem.id !== 'undefined' && qq.maps.event.addListener(markerIns, 'click', function (n) {
	                var event = n.event;
	                event instanceof TouchEvent ? event.type === 'touchend' && wx.publishPageEvent(self.bindmarkertap, {
	                    markerId: markerItem.id
	                }) : wx.publishPageEvent(self.bindmarkertap, {
	                    markerId: markerItem.id
	                });
	            }), markerIns;
	        }))) : void this._delay('markersChanged', markerArg, arg2);
	    },
	    linesChanged: function linesChanged() {
	        var self = this,
	            lines = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0],
	            arg2 = arguments[1];
	        return this._isReady ? void (this._isMobile() ? this._canInvokeNewFeature && WeixinJSBridge.invoke('addMapLines', {
	            mapId: this._mapId,
	            lines: lines
	        }, function (e) {}) : ((this._lines || []).forEach(function (e) {
	            e.setMap(null);
	        }), this._lines = lines.map(function (line) {
	            var path = line.points.map(function (point) {
	                return new qq.maps.LatLng(point.latitude, point.longitude);
	            });
	            return new qq.maps.Polyline({
	                map: self._map,
	                path: path,
	                strokeColor: self._transformColor(line.color) || '',
	                strokeWidth: line.width,
	                strokeDashStyle: line.dottedLine ? 'dash' : 'solid'
	            });
	        }))) : void this._delay('linesChanged', lines, arg2);
	    },
	    circlesChanged: function circlesChanged() {
	        var self = this,
	            circles = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0],
	            arg2 = arguments[1];
	        return this._isReady ? void (this._isMobile() ? this._canInvokeNewFeature && WeixinJSBridge.invoke('addMapCircles', {
	            mapId: this._mapId,
	            circles: circles
	        }, function (e) {}) : ((this._circles || []).forEach(function (circle) {
	            circle.setMap(null);
	        }), this._circles = circles.map(function (circle) {
	            return new qq.maps.Circle({
	                map: self._map,
	                center: new qq.maps.LatLng(circle.latitude, circle.longitude),
	                radius: circle.radius,
	                fillColor: self._transformColor(circle.fillColor) || '',
	                strokeColor: self._transformColor(circle.color) || '',
	                strokeWidth: circle.strokeWidth
	            });
	        }))) : void this._delay('circlesChanged', circles, arg2);
	    },
	    pointsChanged: function pointsChanged() {
	        var self = this,
	            points = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0],
	            n = arguments[1];
	        if (!this._isReady) return void this._delay('pointsChanged', points, n);
	        if (this._isMobile()) {
	            this._canInvokeNewFeature && WeixinJSBridge.invoke('includeMapPoints', {
	                mapId: this._mapId,
	                points: points
	            }, function (e) {});
	        } else {
	            var i = function () {
	                if (points.length <= 0) {
	                    return {
	                        v: void 0
	                    };
	                }
	                var LatLngBounds = new qq.maps.LatLngBounds();
	                points.forEach(function (point) {
	                    LatLngBounds.extend(new qq.maps.LatLng(point.latitude, point.longitude));
	                });
	                self._map.fitBounds(LatLngBounds);
	            }();
	            if ((typeof i === 'undefined' ? 'undefined' : (0, _typeof3.default)(i)) === 'object') return i.v;
	        }
	    },
	    controlsChanged: function controlsChanged() {
	        var self = this,
	            nCtrl = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0],
	            n = arguments[1];
	        return this._isReady ? void (this._isMobile() ? this._canInvokeNewFeature && wx.getCurrentRoute({
	            success: function success(res) {
	                var controls = self._transformPath(self._transformControls(nCtrl), res.route);
	                WeixinJSBridge.invoke('addMapControls', {
	                    mapId: self._mapId,
	                    controls: controls
	                }, function (e) {});
	            }
	        }) : !function () {
	            for (var ctrs = self._controls = self._controls || []; ctrs.length;) {
	                var ctr = ctrs.pop();
	                ctr.onclick = null;
	                ctr.parentNode.removeChild(ctr);
	            }
	            nCtrl.forEach(function (ctr) {
	                var img = document.createElement('img');
	                img.style.position = 'absolute';
	                img.style.left = (ctr.position && ctr.position.left || 0) + 'px';
	                img.style.top = (ctr.position && ctr.position.top || 0) + 'px';
	                img.style.width = (ctr.position && ctr.position.width || '') + 'px';
	                img.style.height = (ctr.position && ctr.position.height || '') + 'px';
	                img.style.zIndex = 9999;
	                img.src = ctr.iconPath;
	                ctr.clickable && typeof ctr.id !== 'undefined' && (img.onclick = function () {
	                    wx.publishPageEvent(self.bindcontroltap, {
	                        controlId: ctr.id
	                    });
	                });
	                ctrs.push(img);
	                self.$.map.appendChild(img);
	            });
	        }()) : void this._delay('controlsChanged', nCtrl, n);
	    },
	    showLocationChanged: function showLocationChanged() {
	        var self = this,
	            location = !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0],
	            arg2 = arguments[1];
	        return this._isReady ? void (this._isMobile() ? this._update({
	            showLocation: location
	        }) : (this._posOverlay && (this._posOverlay.setMap(null), this._posOverlay = null), location && WeixinJSBridge.invoke('private_geolocation', {}, function (res) {
	            try {
	                res = JSON.parse(res);
	            } catch (e) {
	                res = {};
	            }
	            if (res.result && res.result.location) {
	                var loc = res.result.location;self._posOverlay = new self.CustomOverlay(new qq.maps.LatLng(loc.lat, loc.lng)), self._posOverlay.setMap(self._map);
	            }
	        }))) : void this._delay('showLocationChanged', location, arg2);
	    },
	    attached: function attached() {
	        return this.latitude > 90 || this.latitude < -90 ? (console.group(new Date() + ' latitude 字段取值有误'), console.warn('纬度范围 -90 ~ 90'), void console.groupEnd()) : this.longitude > 180 || this.longitude < -180 ? (console.group(new Date() + ' longitude 字段取值有误'), console.warn('经度范围 -180 ~ 180'), void console.groupEnd()) : (this._canInvokeNewFeature = !0, this._box = this._getBox(), void (this._isMobile() ? this._insertNativeMap() : __map_jssdk_ready ? this._insertIframeMap() : __map_jssdk_callback.push(this._insertIframeMap.bind(this))));
	    },
	    detached: function detached() {
	        this._isMobile() && (WeixinJSBridge.invoke('removeMap', {
	            mapId: this._mapId
	        }, function (e) {}), this.__pageReRenderCallback && document.removeEventListener('pageReRender', this.__pageReRenderCallback));
	    }
	});

	// wx-mask
	window.exparser.registerElement({
	    is: 'wx-mask',
	    template: '\n    <div class="wx-mask" id="mask" style="display: none;">\n  ',
	    behaviors: ['wx-base'],
	    properties: {
	        hidden: {
	            type: Boolean,
	            value: !0,
	            observer: 'hiddenChange',
	            public: !0
	        }
	    },
	    hiddenChange: function hiddenChange(hide) {
	        var mask = this.$.mask;
	        hide === !0 ? (setTimeout(function () {
	            mask.style.display = 'none';
	        }, 300), this.$.mask.classList.add('wx-mask-transparent')) : (mask.style.display = 'block', mask.focus(), mask.classList.remove('wx-mask-transparent'));
	    }
	});

	// wx-modal
	window.exparser.registerElement({
	    is: 'wx-modal',
	    template: '\n    <div id="mask" class="wx-modal-mask"></div>\n    <div class="wx-modal-dialog">\n      <div class="wx-modal-dialog-hd">\n        <strong parse-text-content>{{title}}</strong>\n      </div>\n      <div class="wx-modal-dialog-bd">\n        <slot></slot>\n      </div>\n      <div class="wx-modal-dialog-ft">\n        <a hidden$="{{noCancel}}" id="cancel" class="wx-modal-btn-default" parse-text-content>{{cancelText}}</a>\n        <a id="confirm" class="wx-modal-btn-primary" parse-text-content>{{confirmText}}</a>\n      </div>\n    </div>\n  ',
	    behaviors: ['wx-base'],
	    properties: {
	        title: {
	            type: String,
	            public: !0
	        },
	        noCancel: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        confirmText: {
	            type: String,
	            value: '确定',
	            public: !0
	        },
	        cancelText: {
	            type: String,
	            value: '取消',
	            public: !0
	        }
	    },
	    listeners: {
	        'mask.tap': '_handleCancel',
	        'confirm.tap': '_handleConfirm',
	        'cancel.tap': '_handleCancel'
	    },
	    _handleConfirm: function _handleConfirm() {
	        this.triggerEvent('confirm');
	    },
	    _handleCancel: function _handleCancel() {
	        this.triggerEvent('cancel');
	    }
	});

	// wx-navigator
	window.exparser.registerElement({
	    is: 'wx-navigator',
	    behaviors: ['wx-base', 'wx-hover'],
	    template: '<slot></slot>',
	    properties: {
	        url: {
	            type: String,
	            public: !0
	        },
	        redirect: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        openType: {
	            type: String,
	            value: 'navigate',
	            public: !0
	        },
	        hoverClass: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        hoverStyle: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        hover: {
	            type: Boolean,
	            value: !0
	        },
	        hoverStayTime: {
	            type: Number,
	            value: 600,
	            public: !0
	        }
	    },
	    listeners: {
	        tap: 'navigateTo'
	    },
	    navigateTo: function navigateTo() {
	        if (!this.url) {
	            return void console.error('navigator should have url attribute');
	        }
	        if (this.redirect) {
	            return void wx.redirectTo({
	                url: this.url
	            });
	        }
	        switch (this.openType) {
	            case 'navigate':
	                return void wx.navigateTo({
	                    url: this.url
	                });
	            case 'redirect':
	                return void wx.redirectTo({
	                    url: this.url
	                });
	            case 'switchTab':
	                return void wx.switchTab({
	                    url: this.url
	                });
	            default:
	                return void console.error('navigator: invalid openType ' + this.openType);
	        }
	    }
	});

	// wx-picker
	window.exparser.registerElement({
	    is: 'wx-picker',
	    template: '<div id="wrapper"><slot></slot></div>',
	    behaviors: ['wx-base', 'wx-data-Component'],
	    properties: {
	        range: {
	            type: Array,
	            value: [],
	            public: !0
	        },
	        value: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        mode: {
	            type: String,
	            value: 'selector',
	            public: !0
	        },
	        fields: {
	            type: String,
	            value: 'day',
	            public: !0
	        },
	        start: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        end: {
	            type: String,
	            value: '',
	            public: !0
	        },
	        disabled: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        rangeKey: {
	            type: String,
	            value: '',
	            public: !0
	        }
	    },
	    listeners: {
	        'wrapper.tap': 'showPickerView'
	    },
	    resetFormData: function resetFormData() {
	        this.mode == 'selector' ? this.value = -1 : this.value = '';
	    },
	    getFormData: function getFormData(formCallback) {
	        this.__pickerShow ? this.__formCallback = formCallback : typeof formCallback === 'function' && formCallback(this.value);
	    },
	    formGetDataCallback: function formGetDataCallback() {
	        typeof this.__formCallback === 'function' && this.__formCallback(this.value);
	        this.__formCallback = void 0;
	    },
	    showPickerView: function showPickerView() {
	        this.mode == 'date' || this.mode == 'time' ? this.showDatePickerView() : this.mode === 'selector' && this.showSelector();
	    },
	    getCustomerStyle: function getCustomerStyle() {
	        var customerStyle = this.$.wrapper.getBoundingClientRect();
	        return {
	            width: customerStyle.width,
	            height: customerStyle.height,
	            left: customerStyle.left + window.scrollX,
	            top: customerStyle.top + window.scrollY
	        };
	    },
	    showSelector: function showSelector(e) {
	        var that = this;
	        if (!this.disabled) {
	            var _value = parseInt(this.value);(isNaN(_value) || _value >= this.range.length) && (_value = 0);

	            var pickerData = [];
	            if (this.rangeKey) {
	                for (var idx = 0; idx < this.range.length; idx++) {
	                    var r = this.range[idx];
	                    pickerData.push(r[this.rangeKey] + '');
	                }
	            } else {
	                for (var o = 0; o < this.range.length; o++) {
	                    pickerData.push(this.range[o] + '');
	                }
	            }

	            WeixinJSBridge.invoke('showPickerView', {
	                array: pickerData,
	                current: _value,
	                style: this.getCustomerStyle()
	            }, function (res) {
	                ;/:ok/.test(res.errMsg) && (that.value = res.index, that.triggerEvent('change', {
	                    value: that.value
	                }));
	                that.resetPickerState();
	                that.formGetDataCallback();
	            });

	            this.__pickerShow = !0;
	        }
	    },
	    showDatePickerView: function showDatePickerView() {
	        var _this = this;
	        if (!this.disabled) {
	            WeixinJSBridge.invoke('showDatePickerView', {
	                range: {
	                    start: this.start,
	                    end: this.end
	                },
	                mode: this.mode,
	                current: this.value,
	                fields: this.fields,
	                style: this.getCustomerStyle()
	            }, function (t) {
	                ;/:ok/.test(t.errMsg) && (_this.value = t.value, _this.triggerEvent('change', {
	                    value: _this.value
	                }));
	                _this.resetPickerState();
	                _this.formGetDataCallback();
	            });
	            this.__pickerShow = !0;
	        }
	    },
	    resetPickerState: function resetPickerState() {
	        this.__pickerShow = !1;
	    }
	});

	// wx-picker-view
	window.exparser.registerElement({
	    is: 'wx-picker-view',
	    template: '<div id="wrapper" class="wrapper"><slot></slot></div>',
	    behaviors: ['wx-base', 'wx-data-Component'],
	    properties: {
	        value: {
	            type: Array,
	            value: [],
	            public: !0,
	            observer: '_valueChanged'
	        },
	        indicatorStyle: {
	            type: String,
	            value: '',
	            public: !0
	        }
	    },
	    listeners: {
	        'this.wxPickerColumnValueChanged': '_columnValueChanged'
	    },
	    attached: function attached() {
	        this._initColumns();
	    },
	    _initColumns: function _initColumns() {
	        var _this = this,
	            columns = this._columns = [],
	            getColumns = function getColumns(rootNode) {
	            for (var i = 0; i < rootNode.childNodes.length; i++) {
	                var node = rootNode.childNodes[i];
	                node instanceof exparser.Element && (node.hasBehavior('wx-picker-view-column') ? columns.push(node) : getColumns(node));
	            }
	        };

	        getColumns(this);
	        var _value = Array.isArray(this.value) ? this.value : [];
	        columns.forEach(function (col, idx) {
	            col._setStyle(_this.indicatorStyle);
	            col._setHeight(_this.$$.offsetHeight);
	            col._setCurrent(_value[idx] || 0), col._init();
	        });
	    },
	    _columnValueChanged: function _columnValueChanged() {
	        var values = this._columns.map(function (column) {
	            return column._getCurrent();
	        });
	        this.triggerEvent('change', {
	            value: values
	        });
	    },
	    _valueChanged: function _valueChanged() {
	        var e = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0];(this._columns || []).forEach(function (column, n) {
	            column._setCurrent(e[n] || 0);
	            column._update();
	        });
	    }
	});

	// wx-picker-view-column
	!function () {
	    function _Animation(model, t, n) {
	        function i(t, n, o, r) {
	            if (!t || !t.cancelled) {
	                o(n);
	                var a = model.done();
	                a || t.cancelled || (t.id = requestAnimationFrame(i.bind(null, t, n, o, r))), a && r && r(n);
	            }
	        }

	        function cancelAnimation(e) {
	            e && e.id && cancelAnimationFrame(e.id);
	            e && (e.cancelled = !0);
	        }

	        var r = {
	            id: 0,
	            cancelled: !1
	        };

	        i(r, model, t, n);

	        return {
	            cancel: cancelAnimation.bind(null, r),
	            model: model
	        };
	    }

	    function Friction(drag) {
	        this._drag = drag;
	        this._dragLog = Math.log(drag);
	        this._x = 0;
	        this._v = 0;
	        this._startTime = 0;
	    }

	    function n(e, t, n) {
	        return e > t - n && e < t + n;
	    }

	    function i(e, t) {
	        return n(e, 0, t);
	    }

	    function Spring(m, k, c) {
	        this._m = m;
	        this._k = k;
	        this._c = c;
	        this._solution = null;
	        this._endPosition = 0;
	        this._startTime = 0;
	    }

	    function Scroll(extent) {
	        this._extent = extent;
	        this._friction = new Friction(0.01);
	        this._spring = new Spring(1, 90, 20);
	        this._startTime = 0;
	        this._springing = !1;
	        this._springOffset = 0;
	    }

	    function Handler(element, current, itemHeight) {
	        this._element = element;
	        this._extent = this._element.offsetHeight - this._element.parentElement.offsetHeight;
	        var disY = -current * itemHeight;
	        disY > 0 ? disY = 0 : disY < -this._extent && (disY = -this._extent);
	        this._position = disY;
	        this._scroll = new Scroll(this._extent);
	        this._onTransitionEnd = this.onTransitionEnd.bind(this);
	        this._itemHeight = itemHeight;
	        var transform = 'translateY(' + disY + 'px)';
	        this._element.style.webkitTransform = transform;
	        this._element.style.transform = transform;
	    }

	    Friction.prototype.set = function (x, v) {
	        this._x = x;
	        this._v = v;
	        this._startTime = new Date().getTime();
	    };
	    Friction.prototype.x = function (e) {
	        void 0 === e && (e = (new Date().getTime() - this._startTime) / 1e3);
	        var t;
	        return t = e === this._dt && this._powDragDt ? this._powDragDt : this._powDragDt = Math.pow(this._drag, e), this._dt = e, this._x + this._v * t / this._dragLog - this._v / this._dragLog;
	    };
	    Friction.prototype.dx = function (e) {
	        void 0 === e && (e = (new Date().getTime() - this._startTime) / 1e3);
	        var t;
	        return t = e === this._dt && this._powDragDt ? this._powDragDt : this._powDragDt = Math.pow(this._drag, e), this._dt = e, this._v * t;
	    };
	    Friction.prototype.done = function () {
	        return Math.abs(this.dx()) < 3;
	    };
	    Friction.prototype.reconfigure = function (e) {
	        var t = this.x(),
	            n = this.dx();this._drag = e, this._dragLog = Math.log(e), this.set(t, n);
	    };
	    Friction.prototype.configuration = function () {
	        var e = this;
	        return [{
	            label: 'Friction',
	            read: function read() {
	                return e._drag;
	            },
	            write: function write(t) {
	                e.reconfigure(t);
	            },
	            min: 0.001,
	            max: 0.1,
	            step: 0.001
	        }];
	    };
	    var s = 0.1;
	    Spring.prototype._solve = function (e, t) {
	        var n = this._c,
	            i = this._m,
	            o = this._k,
	            r = n * n - 4 * i * o;
	        if (r == 0) {
	            var a = -n / (2 * i),
	                s = e,
	                l = t / (a * e);
	            return {
	                x: function x(e) {
	                    return (s + l * e) * Math.pow(Math.E, a * e);
	                },
	                dx: function dx(e) {
	                    var t = Math.pow(Math.E, a * e);
	                    return a * (s + l * e) * t + l * t;
	                }
	            };
	        }
	        if (r > 0) {
	            var c = (-n - Math.sqrt(r)) / (2 * i),
	                d = (-n + Math.sqrt(r)) / (2 * i),
	                l = (t - c * e) / (d - c),
	                s = e - l;
	            return {
	                x: function x(e) {
	                    var t, n;
	                    return e === this._t && (t = this._powER1T, n = this._powER2T), this._t = e, t || (t = this._powER1T = Math.pow(Math.E, c * e)), n || (n = this._powER2T = Math.pow(Math.E, d * e)), s * t + l * n;
	                },
	                dx: function dx(e) {
	                    var t, n;
	                    return e === this._t && (t = this._powER1T, n = this._powER2T), this._t = e, t || (t = this._powER1T = Math.pow(Math.E, c * e)), n || (n = this._powER2T = Math.pow(Math.E, d * e)), s * c * t + l * d * n;
	                }
	            };
	        }
	        var u = Math.sqrt(4 * i * o - n * n) / (2 * i),
	            a = -(n / 2 * i),
	            s = e,
	            l = (t - a * e) / u;
	        return {
	            x: function x(e) {
	                return Math.pow(Math.E, a * e) * (s * Math.cos(u * e) + l * Math.sin(u * e));
	            },
	            dx: function dx(e) {
	                var t = Math.pow(Math.E, a * e),
	                    n = Math.cos(u * e),
	                    i = Math.sin(u * e);
	                return t * (l * u * n - s * u * i) + a * t * (l * i + s * n);
	            }
	        };
	    };
	    Spring.prototype.x = function (e) {
	        return void 0 == e && (e = (new Date().getTime() - this._startTime) / 1e3), this._solution ? this._endPosition + this._solution.x(e) : 0;
	    };
	    Spring.prototype.dx = function (e) {
	        return void 0 == e && (e = (new Date().getTime() - this._startTime) / 1e3), this._solution ? this._solution.dx(e) : 0;
	    };
	    Spring.prototype.setEnd = function (e, t, n) {
	        if (n || (n = new Date().getTime()), e != this._endPosition || !i(t, s)) {
	            t = t || 0;
	            var o = this._endPosition;
	            this._solution && (i(t, s) && (t = this._solution.dx((n - this._startTime) / 1e3)), o = this._solution.x((n - this._startTime) / 1e3), i(t, s) && (t = 0), i(o, s) && (o = 0), o += this._endPosition), this._solution && i(o - e, s) && i(t, s) || (this._endPosition = e, this._solution = this._solve(o - this._endPosition, t), this._startTime = n);
	        }
	    };
	    Spring.prototype.snap = function (e) {
	        ;this._startTime = new Date().getTime(), this._endPosition = e, this._solution = {
	            x: function x() {
	                return 0;
	            },
	            dx: function dx() {
	                return 0;
	            }
	        };
	    };
	    Spring.prototype.done = function (e) {
	        return e || (e = new Date().getTime()), n(this.x(), this._endPosition, s) && i(this.dx(), s);
	    };
	    Spring.prototype.reconfigure = function (e, t, n) {
	        ;this._m = e, this._k = t, this._c = n, this.done() || (this._solution = this._solve(this.x() - this._endPosition, this.dx()), this._startTime = new Date().getTime());
	    };
	    Spring.prototype.springConstant = function () {
	        return this._k;
	    };
	    Spring.prototype.damping = function () {
	        return this._c;
	    };
	    Spring.prototype.configuration = function () {
	        function e(e, t) {
	            e.reconfigure(1, t, e.damping());
	        }

	        function t(e, t) {
	            e.reconfigure(1, e.springConstant(), t);
	        }

	        return [{
	            label: 'Spring Constant',
	            read: this.springConstant.bind(this),
	            write: e.bind(this, this),
	            min: 100,
	            max: 1e3
	        }, {
	            label: 'Damping',
	            read: this.damping.bind(this),
	            write: t.bind(this, this),
	            min: 1,
	            max: 500
	        }];
	    };
	    Scroll.prototype.snap = function (e, t) {
	        ;this._springOffset = 0, this._springing = !0, this._spring.snap(e), this._spring.setEnd(t);
	    };
	    Scroll.prototype.set = function (e, t) {
	        this._friction.set(e, t);
	        if (e > 0 && t >= 0) {
	            ;this._springOffset = 0, this._springing = !0, this._spring.snap(e), this._spring.setEnd(0);
	        } else {
	            e < -this._extent && t <= 0 ? (this._springOffset = 0, this._springing = !0, this._spring.snap(e), this._spring.setEnd(-this._extent)) : this._springing = !1, this._startTime = new Date().getTime();
	        }
	    };
	    Scroll.prototype.x = function (e) {
	        if (!this._startTime) return 0;
	        if (e || (e = (new Date().getTime() - this._startTime) / 1e3), this._springing) {
	            return this._spring.x() + this._springOffset;
	        }
	        var t = this._friction.x(e),
	            n = this.dx(e);
	        return (t > 0 && n >= 0 || t < -this._extent && n <= 0) && (this._springing = !0, this._spring.setEnd(0, n), t < -this._extent ? this._springOffset = -this._extent : this._springOffset = 0, t = this._spring.x() + this._springOffset), t;
	    };
	    Scroll.prototype.dx = function (e) {
	        return this._springing ? this._spring.dx(e) : this._friction.dx(e);
	    };
	    Scroll.prototype.done = function () {
	        return this._springing ? this._spring.done() : this._friction.done();
	    };
	    Scroll.prototype.configuration = function () {
	        var e = this._friction.configuration();
	        return e.push.apply(e, this._spring.configuration()), e;
	    };
	    var l = 0.5;
	    Handler.prototype.onTouchStart = function () {
	        this._startPosition = this._position;
	        this._startPosition > 0 ? this._startPosition /= l : this._startPosition < -this._extent && (this._startPosition = (this._startPosition + this._extent) / l - this._extent);
	        this._animation && this._animation.cancel();
	        var pos = this._position,
	            transform = 'translateY(' + pos + 'px)';
	        this._element.style.webkitTransform = transform;
	        this._element.style.transform = transform;
	    };
	    Handler.prototype.onTouchMove = function (e, t) {
	        var pos = t + this._startPosition;
	        pos > 0 ? pos *= l : pos < -this._extent && (pos = (pos + this._extent) * l - this._extent);
	        this._position = pos;
	        var transform = 'translateY(' + pos + 'px) translateZ(0)';this._element.style.webkitTransform = transform, this._element.style.transform = transform;
	    };
	    Handler.prototype.onTouchEnd = function (t, n, i) {
	        var self = this;
	        if (this._position > -this._extent && this._position < 0) {
	            if (Math.abs(n) < 34 && Math.abs(i.y) < 300 || Math.abs(i.y) < 150) {
	                return void self.snap();
	            }
	        }

	        this._scroll.set(this._position, i.y);

	        this._animation = _Animation(this._scroll, function () {
	            var e = self._scroll.x();
	            self._position = e;
	            var t = 'translateY(' + e + 'px) translateZ(0)';
	            self._element.style.webkitTransform = t;
	            self._element.style.transform = t;
	        }, function () {
	            self.snap();
	        });

	        return void 0;
	    };

	    Handler.prototype.onTransitionEnd = function () {
	        ;this._snapping = !1, this._element.style.transition = '', this._element.style.webkitTransition = '', this._element.removeEventListener('transitionend', this._onTransitionEnd), this._element.removeEventListener('webkitTransitionEnd', this._onTransitionEnd), typeof this.snapCallback === 'function' && this.snapCallback(Math.floor(Math.abs(this._position) / this._itemHeight));
	    };
	    Handler.prototype.snap = function () {
	        var height = this._itemHeight,
	            t = this._position % height,
	            n = Math.abs(t) > 17 ? this._position - (height - Math.abs(t)) : this._position - t;
	        this._element.style.transition = 'transform .2s ease-out';
	        this._element.style.webkitTransition = '-webkit-transform .2s ease-out';
	        this._element.style.transform = 'translateY(' + n + 'px) translateZ(0)';
	        this._element.style.webkitTransform = 'translateY(' + n + 'px) translateZ(0)';
	        this._position = n;
	        this._snapping = !0;
	        this._element.addEventListener('transitionend', this._onTransitionEnd);
	        this._element.addEventListener('webkitTransitionEnd', this._onTransitionEnd);
	    };
	    Handler.prototype.update = function (e) {
	        var t = this._element.offsetHeight - this._element.parentElement.offsetHeight;
	        typeof e === 'number' && (this._position = -e * this._itemHeight), this._position < -t ? this._position = -t : this._position > 0 && (this._position = 0), this._element.style.transform = 'translateY(' + this._position + 'px) translateZ(0)', this._element.style.webkitTransform = 'translateY(' + this._position + 'px) translateZ(0)', this._extent = t, this._scroll._extent = t;
	    };
	    Handler.prototype.configuration = function () {
	        return this._scroll.configuration();
	    };

	    window.exparser.registerElement({
	        is: 'wx-picker-view-column',
	        template: '\n      <div id="main" class="wx-picker__group">\n        <div id="mask" class="wx-picker__mask"></div>\n        <div id="indicator" class="wx-picker__indicator"></div>\n        <div id="content" class="wx-picker__content"><slot></slot></div>\n      </div>\n    ',
	        attached: function attached() {
	            var self = this;
	            this._observer = exparser.Observer.create(function () {
	                self._handlers.update();
	            });
	            this._observer.observe(this, {
	                childList: !0,
	                subtree: !0
	            });
	        },
	        detached: function detached() {
	            this.$.main.removeEventListener('touchstart', this.__handleTouchStart);
	            document.body.removeEventListener('touchmove', this.__handleTouchMove);
	            document.body.removeEventListener('touchend', this.__handleTouchEnd);
	            document.body.removeEventListener('touchcancel', this.__handleTouchEnd);
	        },
	        _getCurrent: function _getCurrent() {
	            return this._current || 0;
	        },
	        _setCurrent: function _setCurrent(indicator) {
	            this._current = indicator;
	        },
	        _setStyle: function _setStyle(style) {
	            this.$.indicator.setAttribute('style', style);
	        },
	        _setHeight: function _setHeight(height) {
	            var indicatorHeight = this.$.indicator.offsetHeight,
	                contents = this.$.content.children,
	                idx = 0,
	                len = contents.length;
	            for (; idx < len; idx++) {
	                var contentItem = contents.item(idx);
	                contentItem.style.height = indicatorHeight + 'px';
	                contentItem.style.overflow = 'hidden';
	            }

	            this._itemHeight = indicatorHeight;
	            this.$.main.style.height = height + 'px';
	            var indicatorTopPos = (height - indicatorHeight) / 2;
	            this.$.mask.style.backgroundSize = '100% ' + indicatorTopPos + 'px';
	            this.$.indicator.style.top = indicatorTopPos + 'px';
	            this.$.content.style.padding = indicatorTopPos + 'px 0';
	        },
	        _init: function _init() {
	            var that = this;
	            this._touchInfo = {
	                trackingID: -1,
	                maxDy: 0,
	                maxDx: 0
	            };
	            this._handlers = new Handler(this.$.content, this._current, this._itemHeight);
	            this._handlers.snapCallback = function (idx) {
	                idx !== that._current && (that._current = idx, that.triggerEvent('wxPickerColumnValueChanged', {
	                    idx: idx
	                }, {
	                    bubbles: !0
	                }));
	            };
	            this.__handleTouchStart = this._handleTouchStart.bind(this);
	            this.__handleTouchMove = this._handleTouchMove.bind(this);
	            this.__handleTouchEnd = this._handleTouchEnd.bind(this);
	            this.$.main.addEventListener('touchstart', this.__handleTouchStart);
	            document.body.addEventListener('touchmove', this.__handleTouchMove);
	            document.body.addEventListener('touchend', this.__handleTouchEnd);
	            document.body.addEventListener('touchcancel', this.__handleTouchEnd);
	        },
	        _update: function _update() {
	            this._handlers.update(this._current);
	        },
	        _findDelta: function _findDelta(event) {
	            var touchInfo = this._touchInfo;
	            if (event.type != 'touchmove' && event.type != 'touchend') {
	                return {
	                    x: event.screenX - touchInfo.x,
	                    y: event.screenY - touchInfo.y
	                };
	            }
	            for (var touches = event.changedTouches || event.touches, i = 0; i < touches.length; i++) {
	                if (touches[i].identifier == touchInfo.trackingID) {
	                    return {
	                        x: touches[i].pageX - touchInfo.x,
	                        y: touches[i].pageY - touchInfo.y
	                    };
	                }
	            }
	            return null;
	        },
	        _handleTouchStart: function _handleTouchStart(event) {
	            var touchInfo = this._touchInfo;
	            if (touchInfo.trackingID == -1) {
	                var handlers = this._handlers;
	                if (handlers) {
	                    if (event.type == 'touchstart') {
	                        var touches = event.changedTouches || event.touches;
	                        touchInfo.trackingID = touches[0].identifier;
	                        touchInfo.x = touches[0].pageX;
	                        touchInfo.y = touches[0].pageY;
	                    } else {
	                        touchInfo.trackingID = 'mouse';
	                        touchInfo.x = event.screenX;
	                        touchInfo.y = event.screenY;
	                    }
	                    touchInfo.maxDx = 0;
	                    touchInfo.maxDy = 0;
	                    touchInfo.historyX = [0];
	                    touchInfo.historyY = [0];
	                    touchInfo.historyTime = [event.timeStamp];
	                    touchInfo.listener = handlers;
	                    handlers.onTouchStart && handlers.onTouchStart();
	                }
	            }
	        },
	        _handleTouchMove: function _handleTouchMove(event) {
	            var touchInfo = this._touchInfo;
	            if (touchInfo.trackingID != -1) {
	                event.preventDefault();
	                var delta = this._findDelta(event);
	                if (delta) {
	                    touchInfo.maxDy = Math.max(touchInfo.maxDy, Math.abs(delta.y));
	                    touchInfo.maxDx = Math.max(touchInfo.maxDx, Math.abs(delta.x));
	                    touchInfo.historyX.push(delta.x);
	                    touchInfo.historyY.push(delta.y);
	                    touchInfo.historyTime.push(event.timeStamp);
	                    for (; touchInfo.historyTime.length > 10;) {
	                        touchInfo.historyTime.shift();
	                        touchInfo.historyX.shift();
	                        touchInfo.historyY.shift();
	                    }
	                    touchInfo.listener && touchInfo.listener.onTouchMove && touchInfo.listener.onTouchMove(delta.x, delta.y, event.timeStamp);
	                }
	            }
	        },
	        _handleTouchEnd: function _handleTouchEnd(event) {
	            var touchInfo = this._touchInfo;
	            if (touchInfo.trackingID != -1) {
	                event.preventDefault();
	                var delta = this._findDelta(event);
	                if (delta) {
	                    var listener = touchInfo.listener;
	                    touchInfo.trackingID = -1;
	                    touchInfo.listener = null;
	                    var historyTimeLen = touchInfo.historyTime.length,
	                        r = {
	                        x: 0,
	                        y: 0
	                    };
	                    if (historyTimeLen > 2) {
	                        var lastIdx = touchInfo.historyTime.length - 1,
	                            lastHistoryTIme = touchInfo.historyTime[lastIdx],
	                            lastHistoryX = touchInfo.historyX[lastIdx],
	                            lastHistoryY = touchInfo.historyY[lastIdx];
	                        for (; lastIdx > 0;) {
	                            lastIdx--;
	                            var timeItem = touchInfo.historyTime[lastIdx],
	                                u = lastHistoryTIme - timeItem;
	                            if (u > 30 && u < 50) {
	                                r.x = (lastHistoryX - touchInfo.historyX[lastIdx]) / (u / 1e3);
	                                r.y = (lastHistoryY - touchInfo.historyY[lastIdx]) / (u / 1e3);
	                                break;
	                            }
	                        }
	                    }
	                    touchInfo.historyTime = [];
	                    touchInfo.historyX = [];
	                    touchInfo.historyY = [];
	                    listener && listener.onTouchEnd && listener.onTouchEnd(delta.x, delta.y, r);
	                }
	            }
	        }
	    });
	}();

	// wx-progress
	window.exparser.registerElement({
	    is: 'wx-progress',
	    template: '\n    <div class="wx-progress-bar" style.height="{{strokeWidth}}px">\n      <div class="wx-progress-inner-bar" style.width="{{curPercent}}%" style.background-color="{{color}}"></div>\n    </div>\n    <p class="wx-progress-info" parse-text-content hidden$="{{!showInfo}}">\n      {{curPercent}}%\n    </p>\n  ',
	    behaviors: ['wx-base'],
	    properties: {
	        percent: {
	            type: Number,
	            observer: 'percentChange',
	            public: !0
	        },
	        curPercent: {
	            type: Number
	        },
	        showInfo: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        strokeWidth: {
	            type: Number,
	            value: 6,
	            public: !0
	        },
	        color: {
	            type: String,
	            value: '#09BB07',
	            public: !0
	        },
	        active: {
	            type: Boolean,
	            value: !1,
	            public: !0,
	            observer: 'activeAnimation'
	        }
	    },
	    percentChange: function percentChange(percent) {
	        percent > 100 && (this.percent = 100), percent < 0 && (this.percent = 0), this.__timerId && clearInterval(this.__timerId), this.activeAnimation(this.active);
	    },
	    activeAnimation: function activeAnimation(active) {
	        if (!isNaN(this.percent)) {
	            if (active) {
	                var timeFunc = function timeFunc() {
	                    return this.percent <= this.curPercent + 1 ? (this.curPercent = this.percent, void clearInterval(this.__timerId)) : void ++this.curPercent;
	                };this.curPercent = 0, this.__timerId = setInterval(timeFunc.bind(this), 30), timeFunc.call(this);
	            } else {
	                this.curPercent = this.percent;
	            }
	        }
	    },
	    detached: function detached() {
	        this.__timerId && clearInterval(this.__timerId);
	    }
	});

	// wx-radio
	window.exparser.registerElement({
	    is: 'wx-radio',
	    template: '\n    <div class="wx-radio-wrapper">\n      <div id="input" class="wx-radio-input" class.wx-radio-input-checked="{{checked}}" class.wx-radio-input-disabled="{{disabled}}" style.background-color="{{_getColor(checked,color)}}" style.border-color="{{_getColor(checked,color)}}"></div>\n      <slot></slot>\n    </div>\n  ',
	    behaviors: ['wx-base', 'wx-label-target', 'wx-disabled', 'wx-item'],
	    properties: {
	        color: {
	            type: String,
	            value: '#09BB07',
	            public: !0
	        }
	    },
	    listeners: {
	        tap: '_inputTap'
	    },
	    _getColor: function _getColor(checked, color) {
	        return checked ? color : '';
	    },
	    _inputTap: function _inputTap() {
	        return !this.disabled && void (this.checked || (this.checked = !0, this.changedByTap()));
	    },
	    handleLabelTap: function handleLabelTap() {
	        this._inputTap();
	    }
	});

	// wx-radio-group
	window.exparser.registerElement({
	    is: 'wx-radio-group',
	    template: '\n    <slot></slot>\n  ',
	    behaviors: ['wx-base', 'wx-data-Component', 'wx-group'],
	    properties: {
	        value: {
	            type: String
	        }
	    },
	    created: function created() {
	        this._selectedItem = null;
	    },
	    addItem: function addItem(e) {
	        e.checked && (this._selectedItem && (this._selectedItem.checked = !1), this.value = e.value, this._selectedItem = e);
	    },
	    removeItem: function removeItem(e) {
	        this._selectedItem === e && (this.value = '', this._selectedItem = null);
	    },
	    renameItem: function renameItem(e, t) {
	        this._selectedItem === e && (this.value = t);
	    },
	    changed: function changed(e) {
	        this._selectedItem === e ? this.removeItem(e) : this.addItem(e);
	    }
	});

	// wx-scroll-view
	window.exparser.registerElement({
	    is: 'wx-scroll-view',
	    template: '\n    <div id="main" class="wx-scroll-view" style$="overflow-x: hidden; overflow-y: hidden;">\n      <slot></slot>\n    </div>\n  ',
	    behaviors: ['wx-base', 'wx-touchtrack'],
	    properties: {
	        scrollX: {
	            type: Boolean,
	            value: !1,
	            public: !0,
	            observer: '_scrollXChanged'
	        },
	        scrollY: {
	            type: Boolean,
	            value: !1,
	            public: !0,
	            observer: '_scrollYChanged'
	        },
	        upperThreshold: {
	            type: Number,
	            value: 50,
	            public: !0
	        },
	        lowerThreshold: {
	            type: Number,
	            value: 50,
	            public: !0
	        },
	        scrollTop: {
	            type: Number,
	            coerce: '_scrollTopChanged',
	            public: !0
	        },
	        scrollLeft: {
	            type: Number,
	            coerce: '_scrollLeftChanged',
	            public: !0
	        },
	        scrollIntoView: {
	            type: String,
	            coerce: '_srollIntoViewChanged',
	            public: !0
	        }
	    },
	    created: function created() {
	        this._lastScrollTop = this.scrollTop || 0;
	        this._lastScrollLeft = this.scrollLeft || 0;
	        this.touchtrack(this.$.main, '_handleTrack');
	    },
	    attached: function attached() {
	        var self = this;
	        this._scrollTopChanged(this.scrollTop);
	        this._scrollLeftChanged(this.scrollLeft);
	        this._srollIntoViewChanged(this.scrollIntoView);
	        this.__handleScroll = function (t) {
	            t.preventDefault(), t.stopPropagation(), self._handleScroll.bind(self, t)();
	        };
	        this.__handleTouchMove = function (t) {
	            self._checkBounce();
	            var py = t.touches[0].pageY,
	                main = self.$.main;
	            self.__touchStartY < py ? main.scrollTop > 0 && t.stopPropagation() : main.scrollHeight > main.offsetHeight + main.scrollTop && t.stopPropagation();
	        };
	        this.__handleTouchStart = function (t) {
	            ;self.__touchStartY = t.touches[0].pageY, WeixinJSBridge.invoke('disableScrollBounce', {
	                disable: !0
	            }, function () {});
	            var main = self.$.main;self._touchScrollTop = self.$.main.scrollTop, self._touchScrollLeft = self.$.main.scrollLeft, self._touchScrollBottom = self._touchScrollTop + main.offsetHeight === main.scrollHeight, self._touchScrollRight = self._touchScrollLeft + main.offsetWidth === main.scrollWidth;
	        };
	        this.__handleTouchEnd = function () {
	            WeixinJSBridge.invoke('disableScrollBounce', {
	                disable: !1
	            }, function () {});
	        };
	        this.$.main.addEventListener('touchstart', this.__handleTouchStart);
	        this.$.main.addEventListener('touchmove', this.__handleTouchMove);
	        this.$.main.addEventListener('touchend', this.__handleTouchEnd);
	        this.$.main.addEventListener('scroll', this.__handleScroll);
	        this.$.main.style.overflowX = this.scrollX ? 'auto' : 'hidden';
	        this.$.main.style.overflowY = this.scrollY ? 'auto' : 'hidden';
	        var ua = window.navigator.userAgent.toLowerCase();
	        if (/iphone/.test(ua)) {
	            document.getElementById('__scroll_view_hack') && document.body.removeChild(document.getElementById('__scroll_view_hack'));
	            var div = document.createElement('div');
	            div.setAttribute('style', 'position: fixed; left: 0; bottom: 0; line-height: 1; font-size: 1px; z-index: 10000; border-radius: 4px; box-shadow: 0 0 8px rgba(0,0,0,.4); width: 1px; height: 1px; overflow: hidden;');
	            div.innerText = '.';
	            div.id = '__scroll_view_hack';
	            document.body.appendChild(div);
	        }
	    },
	    detached: function detached() {
	        this.$.main.removeEventListener('scroll', this.__handleScroll), this.$.main.removeEventListener('touchstart', this.__handleTouchStart), this.$.main.removeEventListener('touchmove', this.__handleTouchMove), this.$.main.removeEventListener('touchend', this.__handleTouchEnd);
	    },
	    _getStyle: function _getStyle(e, t) {
	        var ox = e ? 'auto' : 'hidden',
	            oy = t ? 'auto' : 'hidden';
	        return 'overflow-x: ' + ox + '; overflow-y: ' + oy + ';';
	    },
	    _handleTrack: function _handleTrack(e) {
	        return e.detail.state === 'start' ? (this._x = e.detail.x, this._y = e.detail.y, void (this._noBubble = null)) : (e.detail.state === 'end' && (this._noBubble = !1), this._noBubble === null && this.scrollY && (Math.abs(this._y - e.detail.y) / Math.abs(this._x - e.detail.x) > 1 ? this._noBubble = !0 : this._noBubble = !1), this._noBubble === null && this.scrollX && (Math.abs(this._x - e.detail.x) / Math.abs(this._y - e.detail.y) > 1 ? this._noBubble = !0 : this._noBubble = !1), this._x = e.detail.x, this._y = e.detail.y, void (this._noBubble && e.stopPropagation()));
	    },
	    _handleScroll: function _handleScroll(e) {
	        this._bounce || (clearTimeout(this._timeout), this._timeout = setTimeout(function () {
	            var main = this.$.main;
	            if (this.triggerEvent('scroll', {
	                scrollLeft: main.scrollLeft,
	                scrollTop: main.scrollTop,
	                scrollHeight: main.scrollHeight,
	                scrollWidth: main.scrollWidth,
	                deltaX: this._lastScrollLeft - main.scrollLeft,
	                deltaY: this._lastScrollTop - main.scrollTop
	            }), this.scrollY) {
	                var goTop = this._lastScrollTop - main.scrollTop > 0,
	                    goBottom = this._lastScrollTop - main.scrollTop < 0;
	                main.scrollTop <= this.upperThreshold && goTop && this.triggerEvent('scrolltoupper', {
	                    direction: 'top'
	                });
	                main.scrollTop + main.offsetHeight + this.lowerThreshold >= main.scrollHeight && goBottom && this.triggerEvent('scrolltolower', {
	                    direction: 'bottom'
	                });
	            }
	            if (this.scrollX) {
	                var goLeft = this._lastScrollLeft - main.scrollLeft > 0,
	                    goRight = this._lastScrollLeft - main.scrollLeft < 0;
	                main.scrollLeft <= this.upperThreshold && goLeft && this.triggerEvent('scrolltoupper', {
	                    direction: 'left'
	                });
	                main.scrollLeft + main.offset__wxConfigWidth + this.lowerThreshold >= main.scrollWidth && goRight && this.triggerEvent('scrolltolower', {
	                    direction: 'right'
	                });
	            }
	            ;this.scrollTop = this._lastScrollTop = main.scrollTop, this.scrollLeft = this._lastScrollLeft = main.scrollLeft;
	        }.bind(this), 50));
	    },
	    _checkBounce: function _checkBounce() {
	        var self = this,
	            main = self.$.main;
	        self._touchScrollTop === 0 && (!self._bounce && main.scrollTop < 0 && (self._bounce = !0), self._bounce && main.scrollTop > 0 && (self._bounce = !1));
	        self._touchScrollLeft === 0 && (!self._bounce && main.scrollLeft < 0 && (self._bounce = !0), self._bounce && main.scrollLeft > 0 && (self._bounce = !1));
	        self._touchScrollBottom && (!self._bounce && main.scrollTop > self._touchScrollTop && (self._bounce = !0), self._bounce && main.scrollTop < self._touchScrollTop && (self._bounce = !1));
	        self._touchScrollRight && (!self._bounce && main.scrollLeft > self._touchScrollLeft && (self._bounce = !0), self._bounce && main.scrollLeft < self._touchScrollLeft && (self._bounce = !1));
	    },
	    _scrollXChanged: function _scrollXChanged(e) {
	        this.$.main.style.overflowX = e ? 'auto' : 'hidden';
	    },
	    _scrollYChanged: function _scrollYChanged(e) {
	        this.$.main.style.overflowY = e ? 'auto' : 'hidden';
	    },
	    _scrollTopChanged: function _scrollTopChanged(e) {
	        this.scrollY && (this.$.main.scrollTop = e);
	    },
	    _scrollLeftChanged: function _scrollLeftChanged(e) {
	        this.scrollX && (this.$.main.scrollLeft = e);
	    },
	    _srollIntoViewChanged: function _srollIntoViewChanged(id) {
	        if (id) {
	            if (Number(id[0]) >= 0 && Number(id[0]) <= 9) {
	                return console.group('scroll-into-view="' + id + '" 有误'), console.warn('id属性不能以数字开头'), void console.groupEnd();
	            }
	            var ele = this.$$.querySelector('#' + id);
	            ele && (this.$.main.scrollTop = ele.offsetTop);
	        }
	    }
	});

	// wx-slider
	window.exparser.registerElement({
	    is: 'wx-slider',
	    template: '\n    <div class="wx-slider-wrapper" class.wx-slider-disabled="{{disabled}}">\n      <div class="wx-slider-tap-area" id="wrapper">\n        <div class="wx-slider-handle-wrapper" style.background-color="{{color}}">\n          <div class="wx-slider-handle" style.left="{{_getValueWidth(value,min,max)}}" id="handle"></div>\n          <div class="wx-slider-track" style.width="{{_getValueWidth(value,min,max)}}" style.background-color="{{selectedColor}}"></div>\n          <div class="wx-slider-step" id="step"></div>\n        </div>\n      </div>\n      <span hidden$="{{!showValue}}" class="wx-slider-value">\n        <p parse-text-content>{{value}}</p>\n      </span>\n    </div>\n  ',
	    properties: {
	        min: {
	            type: Number,
	            value: 0,
	            public: !0,
	            observer: '_revalicateRange'
	        },
	        max: {
	            type: Number,
	            value: 100,
	            public: !0,
	            observer: '_revalicateRange'
	        },
	        step: {
	            type: Number,
	            value: 1,
	            public: !0
	        },
	        value: {
	            type: Number,
	            value: 0,
	            public: !0,
	            coerce: '_filterValue'
	        },
	        showValue: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        color: {
	            type: String,
	            value: '#e9e9e9'
	        },
	        selectedColor: {
	            type: String,
	            value: '#1aad19'
	        }
	    },
	    listeners: {
	        'wrapper.tap': '_onTap'
	    },
	    behaviors: ['wx-base', 'wx-data-Component', 'wx-disabled', 'wx-touchtrack'],
	    created: function created() {
	        this.touchtrack(this.$.handle, '_onTrack');
	    },
	    _filterValue: function _filterValue(val) {
	        if (val < this.min) return this.min;
	        if (val > this.max) return this.max;
	        var stepWidth = Math.round((val - this.min) / this.step);
	        return stepWidth * this.step + this.min;
	    },
	    _revalicateRange: function _revalicateRange() {
	        this.value = this._filterValue(this.value);
	    },
	    _getValueWidth: function _getValueWidth(val, min, max) {
	        return 100 * (val - min) / (max - min) + '%';
	    },
	    _getXPosition: function _getXPosition(ele) {
	        for (var width = ele.offsetLeft; ele; ele = ele.offsetParent) {
	            width += ele.offsetLeft;
	        }
	        return width - document.body.scrollLeft;
	    },
	    _onUserChangedValue: function _onUserChangedValue(event) {
	        var offsetWidth = this.$.step.offsetWidth,
	            currPos = this._getXPosition(this.$.step),
	            value = (event.detail.x - currPos) * (this.max - this.min) / offsetWidth + this.min;value = this._filterValue(value), this.value = value;
	    },
	    _onTrack: function _onTrack(event) {
	        if (!this.disabled) {
	            return event.detail.state === 'move' ? (this._onUserChangedValue(event), !1) : void (event.detail.state === 'end' && this.triggerEvent('change', {
	                value: this.value
	            }));
	        }
	    },
	    _onTap: function _onTap(event) {
	        this.disabled || (this._onUserChangedValue(event), this.triggerEvent('change', {
	            value: this.value
	        }));
	    },
	    resetFormData: function resetFormData() {
	        this.value = this.min;
	    }
	});

	// wx-swiper
	window.exparser.registerElement({
	    is: 'wx-swiper',
	    template: '\n    <div id="slidesWrapper" class="wx-swiper-wrapper">\n      <div id="slides" class="wx-swiper-slides">\n        <slot></slot>\n      </div>\n      <div id="slidesDots" hidden$="{{!indicatorDots}}" class="wx-swiper-dots" class.wx-swiper-dots-horizontal="{{!vertical}}" class.wx-swiper-dots-vertical="{{vertical}}">\n      </div>\n    </div>\n  ',
	    behaviors: ['wx-base', 'wx-touchtrack'],
	    properties: {
	        indicatorDots: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        vertical: {
	            type: Boolean,
	            value: !1,
	            observer: '_initSlides',
	            public: !0
	        },
	        autoplay: {
	            type: Boolean,
	            value: !1,
	            observer: '_autoplayChanged',
	            public: !0
	        },
	        circular: {
	            type: Boolean,
	            value: !1,
	            observer: '_initSlides',
	            public: !0
	        },
	        interval: {
	            type: Number,
	            value: 5e3,
	            public: !0,
	            observer: '_autoplayChanged'
	        },
	        duration: {
	            type: Number,
	            value: 500,
	            public: !0
	        },
	        current: {
	            type: Number,
	            value: 0,
	            observer: '_currentSlideChanged',
	            public: !0
	        }
	    },
	    listeners: {
	        'slidesDots.tap': '_handleDotTap',
	        'slides.canceltap': '_handleSlidesCancelTap',
	        'this.wxSwiperItemChanged': '_itemChanged'
	    },
	    created: function created() {
	        this.touchtrack(this.$.slides, '_handleContentTrack');
	    },
	    attached: function attached() {
	        ;this._attached = !0, this._initSlides(), this.autoplay && this._scheduleNextSlide();
	    },
	    detached: function detached() {
	        ;this._attached = !1, this._cancelSchedule();
	    },
	    _initSlides: function _initSlides() {
	        if (this._attached) {
	            this._cancelSchedule();
	            var items = this._items = [];
	            var getItems = function getItems(ele) {
	                for (var idx = 0; idx < ele.childNodes.length; idx++) {
	                    var child = ele.childNodes[idx];
	                    child instanceof exparser.Element && (child.hasBehavior('wx-swiper-item') ? items.push(child) : getItems(child));
	                }
	            };
	            getItems(this);
	            var itemLen = items.length;
	            this._slideCount = itemLen;
	            var pos = -1;
	            this._isCurrentSlideLegal(this.current) && (pos = this.current, this.autoplay && this._scheduleNextSlide());
	            this._viewport = pos;
	            this._itemPos = [];
	            for (var idx = 0; idx < items.length; idx++) {
	                items[idx]._clearTransform();
	                pos >= 0 ? this._updateItemPos(idx, idx - pos) : this._updateItemPos(idx, -1);
	            }
	            this._updateDots(pos);
	        }
	    },
	    _updateViewport: function _updateViewport(nViewPort, flag) {
	        var self = this,
	            oViewPort = this._viewport;
	        this._viewport = nViewPort;
	        var slideCount = this._slideCount;
	        var updateViewport = function updateViewport(nextViewport) {
	            var movingSlide = (nextViewport % slideCount + slideCount) % slideCount;
	            if (!(self.circular && self._slideCount > 1)) {
	                nextViewport = movingSlide;
	            }
	            var flag2 = !1;
	            if (flag) {
	                if (oViewPort <= nViewPort) {
	                    oViewPort - 1 <= nextViewport && nextViewport <= nViewPort + 1 && (flag2 = !0);
	                } else {
	                    nViewPort - 1 <= nextViewport && nextViewport <= oViewPort + 1 && (flag2 = !0);
	                }
	            }

	            if (flag2) {
	                self._updateItemPos(movingSlide, nextViewport - nViewPort, nextViewport - oViewPort);
	            } else {
	                self._updateItemPos(movingSlide, nextViewport - nViewPort);
	            }
	        };
	        if (oViewPort < nViewPort) {
	            for (var nextVieport = Math.ceil(nViewPort), idx = 0; idx < slideCount; idx++) {
	                updateViewport(idx + nextVieport - slideCount + 1);
	            }
	        } else {
	            for (var nextViewport = Math.floor(nViewPort), idx = 0; idx < slideCount; idx++) {
	                updateViewport(idx + nextViewport);
	            }
	        }
	    },
	    _updateDots: function _updateDots(next) {
	        var dotes = this.$.slidesDots;
	        dotes.innerHTML = '';
	        for (var fragment = document.createDocumentFragment(), idx = 0; idx < this._slideCount; idx++) {
	            var div = document.createElement('div');
	            div.setAttribute('data-dot-index', idx);
	            idx === next ? div.setAttribute('class', 'wx-swiper-dot wx-swiper-dot-active') : div.setAttribute('class', 'wx-swiper-dot');
	            fragment.appendChild(div);
	        }
	        dotes.appendChild(fragment);
	    },
	    _gotoSlide: function _gotoSlide(next, curr) {
	        if (this._slideCount) {
	            if (this._updateDots(next), this.circular && this._slideCount > 1) {
	                var currPos = Math.round(this._viewport),
	                    ratio = Math.floor(currPos / this._slideCount),
	                    nextPos = ratio * this._slideCount + next;
	                curr > 0 ? nextPos < currPos && (nextPos += this._slideCount) : curr < 0 && nextPos > currPos && (nextPos -= this._slideCount);
	                this._updateViewport(nextPos, !0);
	            } else {
	                this._updateViewport(next, !0);
	            }
	            this.autoplay && this._scheduleNextSlide();
	        }
	    },
	    _updateItemPos: function _updateItemPos(nextPos, dis1, dis2) {
	        if (void 0 !== dis2 || this._itemPos[nextPos] !== dis1) {
	            this._itemPos[nextPos] = dis1;
	            var duration = '0ms',
	                o = '',
	                r = '';
	            void 0 !== dis2 && (duration = this.duration + 'ms', r = this.vertical ? 'translate(0,' + 100 * dis2 + '%) translateZ(0)' : 'translate(' + 100 * dis2 + '%,0) translateZ(0)');
	            o = this.vertical ? 'translate(0,' + 100 * dis1 + '%) translateZ(0)' : 'translate(' + 100 * dis1 + '%,0) translateZ(0)';
	            this._items[nextPos]._setTransform(duration, o, r);
	        }
	    },
	    _stopItemsAnimation: function _stopItemsAnimation() {
	        for (var idx = 0; idx < this._slideCount; idx++) {
	            var item = this._items[idx];
	            item._clearTransform();
	        }
	    },
	    _scheduleNextSlide: function _scheduleNextSlide() {
	        var self = this;
	        this._cancelSchedule();
	        if (this._attached) {
	            this._scheduleTimeoutObj = setTimeout(function () {
	                self._scheduleTimeoutObj = null;
	                self._nextDirection = 1;
	                self.current = self._normalizeCurrentSlide(self.current + 1);
	            }, this.interval);
	        }
	    },
	    _cancelSchedule: function _cancelSchedule() {
	        this._scheduleTimeoutObj && (clearTimeout(this._scheduleTimeoutObj), this._scheduleTimeoutObj = null);
	    },
	    _normalizeCurrentSlide: function _normalizeCurrentSlide(nextSlide) {
	        if (this._slideCount) {
	            return (Math.round(nextSlide) % this._slideCount + this._slideCount) % this._slideCount;
	        } else {
	            return 0;
	        }
	    },
	    _isCurrentSlideLegal: function _isCurrentSlideLegal(slide) {
	        return this._slideCount ? slide === this._normalizeCurrentSlide(slide) : 0;
	    },
	    _autoplayChanged: function _autoplayChanged(autoplay) {
	        autoplay ? this._scheduleNextSlide() : this._cancelSchedule();
	    },
	    _currentSlideChanged: function _currentSlideChanged(next, curr) {
	        if (this._isCurrentSlideLegal(next) && this._isCurrentSlideLegal(curr)) {
	            this._gotoSlide(next, this._nextDirection || 0);
	            this._nextDirection = 0;

	            next !== curr && this.triggerEvent('change', {
	                current: this.current
	            });
	        } else {
	            this._initSlides();
	        }

	        return void 0;
	    },
	    _itemChanged: function _itemChanged(event) {
	        event.target._relatedSwiper = this;
	        this._initSlides();
	        return !1;
	    },
	    _getDirectionName: function _getDirectionName(isVertical) {
	        return isVertical ? 'vertical' : 'horizontal';
	    },
	    _handleDotTap: function _handleDotTap(event) {
	        if (this._isCurrentSlideLegal(this.current)) {
	            var dot = Number(event.target.dataset.dotIndex);
	            this.current = dot;
	        }
	    },
	    _handleSlidesCancelTap: function _handleSlidesCancelTap() {
	        this._userWaitingCancelTap = !1;
	    },
	    _handleTrackStart: function _handleTrackStart() {
	        this._cancelSchedule();
	        this._contentTrackViewport = this._viewport;
	        this._contentTrackSpeed = 0;
	        this._contentTrackT = Date.now();
	        this._stopItemsAnimation();
	    },
	    _handleTrackMove: function _handleTrackMove(event) {
	        var self = this;
	        var contentTrackT = this._contentTrackT;
	        this._contentTrackT = Date.now();
	        var slideCount = this._slideCount;
	        var calcRatio = function calcRatio(e) {
	            return 0.5 - 0.25 / (e + 0.5);
	        };
	        var calcViewport = function calcViewport(moveRatio, speed) {
	            var nextViewPort = self._contentTrackViewport + moveRatio;
	            self._contentTrackSpeed = 0.6 * self._contentTrackSpeed + 0.4 * speed;
	            if (!(self.circular && self._slideCount > 1)) {
	                if (nextViewPort < 0 || nextViewPort > slideCount - 1) {
	                    if (nextViewPort < 0) {
	                        nextViewPort = -calcRatio(-nextViewPort);
	                    } else {
	                        nextViewPort > slideCount - 1 && (nextViewPort = slideCount - 1 + calcRatio(nextViewPort - (slideCount - 1)));
	                    }
	                    self._contentTrackSpeed = 0;
	                }
	            }
	            self._updateViewport(nextViewPort, !1);
	        };

	        if (this.vertical) {
	            calcViewport(-event.dy / this.$.slidesWrapper.offsetHeight, -event.ddy / (this._contentTrackT - contentTrackT));
	        } else {
	            calcViewport(-event.dx / this.$.slidesWrapper.offsetWidth, -event.ddx / (this._contentTrackT - contentTrackT));
	        }
	    },
	    _handleTrackEnd: function _handleTrackEnd() {
	        this.autoplay && this._scheduleNextSlide();
	        this._tracking = !1;
	        var shifting = 0;
	        Math.abs(this._contentTrackSpeed) > 0.2 && (shifting = 0.5 * this._contentTrackSpeed / Math.abs(this._contentTrackSpeed));
	        var nextSlide = this._normalizeCurrentSlide(this._viewport + shifting);
	        if (this.current !== nextSlide) {
	            this._nextDirection = this._contentTrackSpeed;
	            this.current = nextSlide;
	        } else {
	            this._gotoSlide(nextSlide, 0);
	        }
	        this.autoplay && this._scheduleNextSlide();
	    },
	    _handleContentTrack: function _handleContentTrack(event) {
	        if (this._isCurrentSlideLegal(this.current)) {
	            if (event.detail.state === 'start') {
	                this._userTracking = !0;
	                this._userWaitingCancelTap = !1;
	                this._userDirectionChecked = !1;
	                return this._handleTrackStart();
	            }
	            if (this._userTracking) {
	                if (this._userWaitingCancelTap) return !1;
	                if (!this._userDirectionChecked) {
	                    this._userDirectionChecked = !0;
	                    var dx = Math.abs(event.detail.dx);
	                    var dy = Math.abs(event.detail.dy);
	                    dx >= dy && this.vertical ? this._userTracking = !1 : dx <= dy && !this.vertical && (this._userTracking = !1);
	                    if (!this._userTracking) {
	                        return void (this.autoplay && this._scheduleNextSlide());
	                    }
	                }
	                return event.detail.state === 'end' ? this._handleTrackEnd(event.detail) : (this._handleTrackMove(event.detail), !1);
	            }
	        }
	    }
	});

	// wx-swiper-item
	!function () {
	    var idIdx = 1;
	    var frameFunc = null;
	    var pendingList = [];
	    var computePendingTime = function computePendingTime(ele, func) {
	        var id = idIdx++;
	        pendingList.push({
	            id: id,
	            self: ele,
	            func: func,
	            frames: 2
	        });
	        var triggerFunc = function e() {
	            frameFunc = null;
	            for (var i = 0; i < pendingList.length; i++) {
	                var o = pendingList[i];
	                o.frames--, o.frames || (o.func.call(o.self), pendingList.splice(i--, 1));
	            }
	            frameFunc = pendingList.length ? requestAnimationFrame(e) : null;
	        };
	        frameFunc || (frameFunc = requestAnimationFrame(triggerFunc));
	        return id;
	    };
	    var removeFromPendingList = function removeFromPendingList(e) {
	        for (var t = 0; t < pendingList.length; t++) {
	            if (pendingList[t].id === e) return void pendingList.splice(t, 1);
	        }
	    };
	    window.exparser.registerElement({
	        is: 'wx-swiper-item',
	        template: '\n    <slot></slot>\n  ',
	        properties: {},
	        listeners: {
	            'this.wxSwiperItemChanged': '_invalidChild'
	        },
	        behaviors: ['wx-base'],
	        _invalidChild: function _invalidChild(chid) {
	            if (chid.target !== this) return !1;
	        },
	        _setDomStyle: function _setDomStyle() {
	            var selfEle = this.$$;
	            selfEle.style.position = 'absolute';
	            selfEle.style.width = '100%';
	            selfEle.style.height = '100%';
	        },
	        attached: function attached() {
	            this._setDomStyle();
	            this._pendingTimeoutId = 0;
	            this._pendingTransform = '';
	            this._relatedSwiper = null;
	            this.triggerEvent('wxSwiperItemChanged', void 0, {
	                bubbles: !0
	            });
	        },
	        detached: function detached() {
	            this._clearTransform();
	            this._relatedSwiper && (this._relatedSwiper.triggerEvent('wxSwiperItemChanged'), this._relatedSwiper = null);
	        },
	        _setTransform: function _setTransform(duration, transform, hasPending) {
	            hasPending ? (this.$$.style.transitionDuration = '0ms', this.$$.style['-webkit-transform'] = hasPending, this.$$.style.transform = hasPending, this._pendingTransform = transform, this._pendingTimeoutId = computePendingTime(this, function () {
	                ;this.$$.style.transitionDuration = duration, this.$$.style['-webkit-transform'] = transform, this.$$.style.transform = transform;
	            })) : (this._clearTransform(), this.$$.style.transitionDuration = duration, this.$$.style['-webkit-transform'] = transform, this.$$.style.transform = transform);
	        },
	        _clearTransform: function _clearTransform() {
	            this.$$.style.transitionDuration = '0ms';
	            this._pendingTimeoutId && (this.$$.style['-webkit-transform'] = this._pendingTransform, this.$$.style.transform = this._pendingTransform, removeFromPendingList(this._pendingTimeoutId), this._pendingTimeoutId = 0);
	        }
	    });
	}();

	// wx-switch
	window.exparser.registerElement({
	    is: 'wx-switch',
	    template: '\n    <div class="wx-switch-wrapper">\n      <div hidden$="{{!isSwitch(type)}}" id="switchInput" type="checkbox" class="wx-switch-input" class.wx-switch-input-checked="{{checked}}" class.wx-switch-input-disabled="{{disabled}}" style.background-color="{{color}}" style.border-color="{{_getSwitchBorderColor(checked,color)}}"></div>\n      <div hidden$="{{!isCheckbox(type)}}" id="checkboxInput" type="checkbox" class="wx-checkbox-input" class.wx-checkbox-input-checked="{{checked}}" class.wx-checkbox-input-disabled="{{disabled}}" style.color="{{color}}"></div>\n    </div>\n  ',
	    properties: {
	        checked: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        },
	        type: {
	            type: String,
	            value: 'switch',
	            public: !0
	        },
	        color: {
	            type: String,
	            value: '#04BE02',
	            public: !0
	        }
	    },
	    behaviors: ['wx-base', 'wx-label-target', 'wx-disabled', 'wx-data-Component'],
	    listeners: {
	        'switchInput.tap': 'onInputChange',
	        'checkboxInput.tap': 'onInputChange'
	    },
	    _getSwitchBorderColor: function _getSwitchBorderColor(checked, color) {
	        return checked ? color : '';
	    },
	    handleLabelTap: function handleLabelTap() {
	        this.disabled || (this.checked = !this.checked);
	    },
	    onInputChange: function onInputChange(e) {
	        this.checked = !this.checked;
	        return this.disabled ? void (this.checked = !this.checked) : void this.triggerEvent('change', {
	            value: this.checked
	        });
	    },
	    isSwitch: function isSwitch(type) {
	        return type !== 'checkbox';
	    },
	    isCheckbox: function isCheckbox(type) {
	        return type === 'checkbox';
	    },
	    getFormData: function getFormData() {
	        return this.checked;
	    },
	    resetFormData: function resetFormData() {
	        this.checked = !1;
	    }
	});

	// wx-text
	window.exparser.registerElement({
	    is: 'wx-text',
	    template: '\n    <span id="raw" style="display:none;"><slot></slot></span>\n    <span id="main"></span>\n  ',
	    behaviors: ['wx-base'],
	    properties: {
	        style: {
	            type: String,
	            public: !0,
	            observer: '_styleChanged'
	        },
	        class: {
	            type: String,
	            public: !0,
	            observer: '_classChanged'
	        },
	        selectable: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        }
	    },
	    _styleChanged: function _styleChanged(styles) {
	        this.$$.setAttribute('style', styles);
	    },
	    _classChanged: function _classChanged(cls) {
	        this.$$.setAttribute('class', cls);
	    },
	    _htmlEncode: function _htmlEncode(txt) {
	        return txt.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\"/g, '&quot;').replace(/\'/g, '&apos;');
	    },
	    _update: function _update() {
	        var rawEle = this.$.raw,
	            fragment = document.createDocumentFragment(),
	            idx = 0,
	            len = rawEle.childNodes.length;
	        for (; idx < len; idx++) {
	            var childNode = rawEle.childNodes.item(idx);
	            if (childNode.nodeType === childNode.TEXT_NODE) {
	                var spanEle = document.createElement('span');
	                spanEle.innerHTML = this._htmlEncode(childNode.textContent).replace(/\n/g, '<br>');
	                fragment.appendChild(spanEle);
	            } else {
	                childNode.nodeType === childNode.ELEMENT_NODE && childNode.tagName === 'WX-TEXT' && fragment.appendChild(childNode.cloneNode(!0));
	            }
	        }
	        this.$.main.innerHTML = '';
	        this.$.main.appendChild(fragment);
	    },
	    created: function created() {
	        this._observer = exparser.Observer.create(function () {
	            this._update();
	        });
	        this._observer.observe(this, {
	            childList: !0,
	            subtree: !0,
	            characterData: !0,
	            properties: !0
	        });
	    },
	    attached: function attached() {
	        this._update();
	    }
	});

	// wx-textarea in dev tool
	!function () {
	    window.exparser.registerElement({
	        is: 'wx-textarea',
	        behaviors: ['wx-base', 'wx-data-Component'],
	        template: '<div id="wrapped">\n      <div id="placeholder" parse-text-content>\n        {{placeholder}}\n      </div>\n      <textarea id="textarea" maxlength$="{{_getMaxlength(maxlength)}}" ></textarea>\n      <div id="compute" class="compute"></div>\n      <div id="stylecompute" class$="{{_getPlaceholderClass(placeholderClass)}}" style$="{{_getPlaceholderStyle(placeholderStyle)}}" ></div>\n    </div>\n    ',
	        properties: {
	            value: {
	                type: String,
	                value: '',
	                public: !0,
	                coerce: 'defaultValueChange'
	            },
	            maxlength: {
	                type: Number,
	                value: 140,
	                public: !0,
	                observer: 'maxlengthChanged'
	            },
	            placeholder: {
	                type: String,
	                value: '',
	                public: !0
	            },
	            hidden: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            disabled: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            focus: {
	                type: Number,
	                value: 0,
	                public: !0,
	                coerce: 'focusChanged'
	            },
	            autoFocus: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            placeholderClass: {
	                type: String,
	                value: 'textarea-placeholder',
	                observer: '_getComputePlaceholderStyle',
	                public: !0
	            },
	            placeholderStyle: {
	                type: String,
	                value: '',
	                observer: '_getComputePlaceholderStyle',
	                public: !0
	            },
	            autoHeight: {
	                type: Boolean,
	                value: !1,
	                public: !0,
	                observer: 'autoHeightChanged'
	            },
	            bindinput: {
	                type: String,
	                value: '',
	                public: !0
	            }
	        },
	        listeners: {
	            'textarea.input': 'onTextAreaInput',
	            'textarea.focus': 'onTextAreaFocus',
	            'textarea.blur': 'onTextAreaBlur'
	        },
	        resetFormData: function resetFormData() {
	            this.$.textarea.value = '';
	            this.value = '';
	        },
	        getFormData: function getFormData(cb) {
	            var self = this;
	            this.value = this.$.textarea.value;
	            setTimeout(function () {
	                typeof cb === 'function' && cb(self.value);
	            }, 0);
	        },
	        couldFocus: function couldFocus(focus) {
	            var self = this;
	            if (this.__attached) {
	                if (!this._keyboardShow && focus) {
	                    this.disabled || window.requestAnimationFrame(function () {
	                        self.$.textarea.focus();
	                    });
	                } else {
	                    this._keyboardShow && !focus && this.$.textarea.blur();
	                }
	            }
	        },
	        focusChanged: function focusChanged(focus, t) {
	            this.couldFocus(Boolean(focus));
	            return focus;
	        },
	        attached: function attached() {
	            var self = this;
	            this.__attached = !0;
	            this.__scale = 750 / window.innerWidth;
	            this.getComputedStyle();
	            this.checkRows(this.value);
	            this.__updateTextArea = this.updateTextArea.bind(this);
	            document.addEventListener('pageReRender', this.__updateTextArea);
	            this.__routeDoneId = exparser.addListenerToElement(document, 'routeDone', function () {
	                self.checkAutoFocus();
	            });
	            this.checkPlaceholderStyle(this.value);
	        },
	        checkAutoFocus: function checkAutoFocus() {
	            if (!this.__autoFocused) {
	                this.__autoFocused = !0;
	                this.couldFocus(this.autoFocus || this.focus);
	            }
	        },
	        detached: function detached() {
	            document.removeEventListener('pageReRender', this.__updateTextArea);
	            exparser.removeListenerFromElement(document, 'routeDone', this.__routeDoneId);
	        },
	        getHexColor: function getHexColor(colorValue) {
	            try {
	                var colorNums;
	                var decimal;
	                var hexValue = function () {
	                    if (colorValue.indexOf('#') >= 0) {
	                        return {
	                            v: colorValue
	                        };
	                    }
	                    colorNums = colorValue.match(/\d+/g);
	                    var ret = [];
	                    colorNums.map(function (num, idx) {
	                        if (idx < 3) {
	                            var decNum = parseInt(num);
	                            decNum = decNum > 9 ? decNum.toString(16) : '0' + decNum;
	                            ret.push(decNum);
	                        }
	                    });

	                    if (colorNums.length > 3) {
	                        decimal = parseFloat(colorNums.slice(3).join('.'));
	                        if (decimal == 0) {
	                            ret.push('00');
	                        } else {
	                            if (decimal >= 1) {
	                                ret.push('ff');
	                            } else {
	                                decimal = parseInt(255 * decimal);
	                                if (decimal = decimal > 9) {
	                                    decimal.toString(16);
	                                } else {
	                                    '0' + decimal;
	                                }
	                                ret.push(decimal);
	                            }
	                        }
	                    }
	                    return {
	                        v: '#' + ret.join('')
	                    };
	                }();
	                if ((typeof hexValue === 'undefined' ? 'undefined' : (0, _typeof3.default)(hexValue)) === 'object') return hexValue.v;
	            } catch (e) {
	                return '';
	            }
	        },
	        getComputedStyle: function getComputedStyle() {
	            var self = this;
	            window.requestAnimationFrame(function () {
	                var selfStyle = window.getComputedStyle(self.$$);
	                var selfSizeInfo = self.$$.getBoundingClientRect();
	                var lrSize = ['Left', 'Right'].map(function (side) {
	                    return parseFloat(selfStyle['border' + side + 'Width']) + parseFloat(selfStyle['padding' + side]);
	                });
	                var tbSize = ['Top', 'Bottom'].map(function (side) {
	                    return parseFloat(selfStyle['border' + side + 'Width']) + parseFloat(selfStyle['padding' + side]);
	                });
	                var textarea = self.$.textarea;
	                textarea.style.width = selfSizeInfo.width - lrSize[0] - lrSize[1] + 'px';
	                textarea.style.height = selfSizeInfo.height - tbSize[0] - tbSize[1] + 'px';
	                console.log(selfSizeInfo.height - tbSize[0] - tbSize[1] + 'px');
	                textarea.style.fontWeight = selfStyle.fontWeight;
	                textarea.style.fontSize = selfStyle.fontSize || '16px';
	                textarea.style.color = selfStyle.color;
	                self.$.compute.style.fontSize = selfStyle.fontSize || '16px';
	                self.$.compute.style.width = textarea.style.width;
	                self.$.placeholder.style.width = textarea.style.width;
	                self.$.placeholder.style.height = textarea.style.height;
	                self.disabled ? textarea.setAttribute('disabled', !0) : textarea.removeAttribute('disabled');
	            });
	        },
	        getCurrentRows: function getCurrentRows(txt) {
	            var computedStyle = window.getComputedStyle(this.$.compute);
	            var lineHeight = 1.2 * (parseFloat(computedStyle.fontSize) || 16);
	            this.$.compute.innerText = txt;
	            this.$.compute.appendChild(document.createElement('br'));
	            return {
	                height: Math.max(this.$.compute.scrollHeight, lineHeight),
	                heightRpx: this.__scale * this.$.compute.scrollHeight,
	                lineHeight: lineHeight,
	                lineCount: Math.ceil(this.$.compute.scrollHeight / lineHeight)
	            };
	        },
	        onTextAreaInput: function onTextAreaInput(event) {
	            this.value = event.target.value;
	            if (this.bindinput) {
	                var target = {
	                    id: this.$$.id,
	                    dataset: this.dataset,
	                    offsetTop: this.$$.offsetTop,
	                    offsetLeft: this.$$.offsetLeft
	                };
	                WeixinJSBridge.publish('SPECIAL_PAGE_EVENT', {
	                    eventName: this.bindinput,
	                    ext: {
	                        setKeyboardValue: !1
	                    },
	                    data: {
	                        data: {
	                            type: 'input',
	                            timestamp: Date.now(),
	                            detail: {
	                                value: event.target.value
	                            },
	                            target: target,
	                            currentTarget: target,
	                            touches: []
	                        },
	                        eventName: this.bindinput
	                    }
	                });
	            }
	            return !1;
	        },
	        onTextAreaFocus: function onTextAreaFocus(e) {
	            this._keyboardShow = !0;
	            this.triggerEvent('focus', {
	                value: this.value
	            });
	        },
	        onTextAreaBlur: function onTextAreaBlur(e) {
	            this._keyboardShow = !1;
	            this.triggerEvent('blur', {
	                value: this.value
	            });
	        },
	        updateTextArea: function updateTextArea() {
	            this.checkAutoFocus();
	            this.getComputedStyle();
	            this.autoHeightChanged(this.autoHeight);
	        },
	        hiddenChanged: function hiddenChanged(isHidden, t) {
	            this.$$.style.display = isHidden ? 'none' : '';
	        },
	        _getPlaceholderStyle: function _getPlaceholderStyle(placeholderStyle) {
	            return placeholderStyle + ';display:none;';
	        },
	        _getComputePlaceholderStyle: function _getComputePlaceholderStyle() {
	            var stylecomputeEle = this.$.stylecompute,
	                computedStyle = window.getComputedStyle(stylecomputeEle),
	                fontWight = parseInt(computedStyle.fontWeight);
	            isNaN(fontWight) ? fontWight = computedStyle.fontWeight : fontWight < 500 ? fontWight = 'normal' : fontWight >= 500 && (fontWight = 'bold');
	            this.placeholderStyle && this.placeholderStyle.split(';');
	            var placeHolder = this.$.placeholder;
	            placeHolder.style.position = 'absolute';
	            placeHolder.style.fontSize = (parseFloat(computedStyle.fontSize) || 16) + 'px';
	            placeHolder.style.fontWeight = fontWight;
	            placeHolder.style.color = this.getHexColor(computedStyle.color);
	        },
	        defaultValueChange: function defaultValueChange(val) {
	            this.maxlength > 0 && val.length > this.maxlength && (val = val.slice(0, this.maxlength));
	            this.checkPlaceholderStyle(val);
	            this.$.textarea.value = val;
	            this.__attached && this.checkRows(val);
	            return val;
	        },
	        autoHeightChanged: function autoHeightChanged(changed) {
	            if (changed) {
	                var rows = this.getCurrentRows(this.value);
	                var height = rows.height < rows.lineHeight ? rows.lineHeight : rows.height;
	                this.$$.style.height = height + 'px';
	                this.getComputedStyle();
	            }
	        },
	        checkRows: function checkRows(txt) {
	            var rowsInfo = this.getCurrentRows(txt);
	            if (this.lastRows != rowsInfo.lineCount) {
	                this.lastRows = rowsInfo.lineCount;
	                if (this.autoHeight) {
	                    var height = rowsInfo.height < rowsInfo.lineHeight ? rowsInfo.lineHeight : rowsInfo.height;
	                    this.$$.style.height = height + 'px';
	                    this.getComputedStyle();
	                }
	                this.triggerEvent('linechange', rowsInfo);
	            }
	        },
	        checkPlaceholderStyle: function checkPlaceholderStyle(hasPlaceHolder) {
	            if (hasPlaceHolder) {
	                this.$.placeholder.style.display = 'none';
	            } else {
	                this._getComputePlaceholderStyle();
	                this.$.placeholder.style.display = '';
	            }
	        },
	        _getPlaceholderClass: function _getPlaceholderClass(cls) {
	            return 'textarea-placeholder ' + cls;
	        },
	        _getMaxlength: function _getMaxlength(len) {
	            return len <= 0 ? -1 : len;
	        },
	        maxlengthChanged: function maxlengthChanged(len) {
	            len > 0 && this.value.length > len && (this.value = this.value.slice(0, len));
	        }
	    });
	}();

	// wx-toast
	window.exparser.registerElement({
	    is: 'wx-toast',
	    template: '\n    <div class="wx-toast-mask" id="mask" style$="{{_getMaskStyle(mask)}}"></div>\n    <div class="wx-toast">\n      <invoke class$="wx-toast-icon wx-icon-{{icon}}" style.color="#FFFFFF" style.font-size="55px" style.display="block"></invoke>\n      <p class="wx-toast-content"><slot></slot></p>\n    </div>\n  ',
	    behaviors: ['wx-base', 'wx-mask-Behavior'],
	    properties: {
	        icon: {
	            type: String,
	            value: 'success_no_circle',
	            public: !0
	        },
	        hidden: {
	            type: Boolean,
	            value: !1,
	            public: !0,
	            observer: 'hiddenChange'
	        },
	        duration: {
	            type: Number,
	            value: 1500,
	            public: !0,
	            observer: 'durationChange'
	        }
	    },
	    durationChange: function durationChange() {
	        this.timer && (clearTimeout(this.timer), this.hiddenChange(this.hidden));
	    },
	    hiddenChange: function hiddenChange(isHidden) {
	        if (!isHidden && this.duration != 0) {
	            var self = this;
	            this.timer = setTimeout(function () {
	                self.triggerEvent('change', {
	                    value: self.hidden
	                });
	            }, this.duration);
	        }
	    }
	});

	// wx-video not on ios
	if (wx.getPlatform() !== 'ios') {
	    window.exparser.registerElement({
	        is: 'wx-video',
	        behaviors: ['wx-base', 'wx-player'],
	        template: '\n      <div class="wx-video-container">\n        <video id="player" webkit-playsinline style="display: none;"></video>\n        <div id="default" class$="wx-video-bar {{_barType}}" style="display: none;">\n          <div id="controls" class="wx-video-controls">\n            <div id="button" class$="wx-video-button {{_buttonType}}"></div>\n            <div class="wx-video-time" parse-text-content>{{_currentTime}}</div>\n            <div id="progress" class="wx-video-progress">\n              <div id="ball" class="wx-video-ball" style$="left: {{_progressLeft}}px;">\n                <div class="wx-video-inner"></div>\n              </div>\n              <div class="wx-video-inner" style$="width: {{_progressLength}}px;"></div>\n            </div>\n            <div class="wx-video-time" parse-text-content>{{_duration}}</div>\n          </div>\n          <div id="danmuBtn" class$="wx-video-danmu-btn {{_danmuStatus}}" style="display: none">弹幕</div>\n          <div id="fullscreen" class="wx-video-fullscreen"></div>\n        </div>\n        <div id="danmu" class="wx-video-danmu" style="z-index: -9999">\n        </div>\n      </div>\n      <div id="fakebutton"></div>\n    ',
	        properties: {
	            hidden: {
	                type: Boolean,
	                value: !1,
	                public: !0,
	                observer: '_hiddenChanged'
	            },
	            autoplay: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            danmuBtn: {
	                type: Boolean,
	                value: !1,
	                public: !0,
	                observer: 'danmuBtnChanged'
	            },
	            enableDanmu: {
	                type: Boolean,
	                value: !1,
	                observer: 'enableDanmuChanged',
	                public: !0
	            },
	            enableFullScreen: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            controls: {
	                type: Boolean,
	                value: !0,
	                public: !0,
	                observer: 'controlsChanged'
	            },
	            danmuList: {
	                type: Array,
	                value: [],
	                public: !0
	            },
	            objectFit: {
	                type: String,
	                value: 'contain',
	                public: !0,
	                observer: 'objectFitChanged'
	            },
	            duration: {
	                type: Number,
	                value: 0,
	                public: !0,
	                observer: 'durationChanged'
	            },
	            _videoId: {
	                type: Number
	            },
	            _isLockTimeUpdateProgress: {
	                type: Boolean,
	                value: !1
	            },
	            _rate: {
	                type: Number,
	                value: 0
	            },
	            _progressLeft: {
	                type: Number,
	                value: -22
	            },
	            _progressLength: {
	                type: Number,
	                value: 0
	            },
	            _barType: {
	                type: String,
	                value: 'full'
	            },
	            _danmuStatus: {
	                type: String,
	                value: ''
	            }
	        },
	        listeners: {
	            'ball.touchstart': 'onBallTouchStart'
	        },
	        _reset: function _reset() {
	            this._buttonType = 'play';
	            this._currentTime = '00:00';
	            this._duration = this._formatTime(this.duration);
	            this._progressLeft = -22;
	            this._progressLength = 0;
	            this._barType = this.controls ? 'full' : 'part';
	        },
	        _hiddenChanged: function _hiddenChanged(isHidden, t) {
	            this.$.player.pause();
	            this.$$.style.display = isHidden ? 'none' : '';
	        },
	        posterChanged: function posterChanged(posterUrl, t) {
	            this._isError || (this.$.player.poster = posterUrl);
	        },
	        srcChanged: function srcChanged(srcURL, t) {
	            if (!this._isError && srcURL) {
	                var self = this;
	                /*
	                 if (wx.getPlatform() === 'wechatdevtools') {
	                 this.$.player.src = srcURL.replace(
	                 'wdfile://',
	                 'http://wxfile.open.weixin.qq.com/'
	                 )
	                 setTimeout(function () {
	                 self._reset()
	                 }, 0)
	                 } else {
	                 this.$.player.src = srcURL
	                 setTimeout(function () {
	                 self._reset()
	                 }, 0)
	                 }
	                 */
	                this.$.player.src = srcURL;
	                setTimeout(function () {
	                    self._reset();
	                }, 0);
	            }
	        },
	        controlsChanged: function controlsChanged(show, t) {
	            this.controls ? this._barType = 'full' : this.danmuBtn ? this._barType = 'part' : this._barType = 'none';
	            this.$.fullscreen.style.display = show ? 'block' : 'none';
	            this.$.controls.style.display = show ? 'flex' : 'none';
	        },
	        objectFitChanged: function objectFitChanged(objectFit, t) {
	            this.$.player.style.objectFit = objectFit;
	        },
	        durationChanged: function durationChanged(duration, t) {
	            console.log('durationChanged', duration);
	            duration > 0 && (this._duration = this._formatTime(Math.floor(duration)));
	        },
	        danmuBtnChanged: function danmuBtnChanged(isDanmuBtnShow, t) {
	            this.controls ? this._barType = 'full' : this.danmuBtn ? this._barType = 'part' : this._barType = 'none';
	            this.$.danmuBtn.style.display = isDanmuBtnShow ? '' : 'none';
	        },
	        enableDanmuChanged: function enableDanmuChanged(enableDanmu, t) {
	            this._danmuStatus = enableDanmu ? 'active' : '';
	            this.$.danmu.style.zIndex = enableDanmu ? '0' : '-9999';
	        },
	        actionChanged: function actionChanged(action, t) {
	            if ((typeof action === 'undefined' ? 'undefined' : (0, _typeof3.default)(action)) === 'object') {
	                var method = action.method,
	                    data = action.data;
	                if (method === 'play') {
	                    this.$.player.play();
	                } else if (method === 'pause') {
	                    this.$.player.pause();
	                } else if (method === 'seek') {
	                    ;this.$.player.currentTime = data[0], this._resetDanmu();
	                } else if (method === 'sendDanmu') {
	                    var danmuInfo = _slicedToArray(data, 2),
	                        txt = danmuInfo[0],
	                        color = danmuInfo[1],
	                        currentTime = parseInt(this.$.player.currentTime);
	                    this.danmuObject[currentTime] ? this.danmuObject[currentTime].push({
	                        text: txt,
	                        color: color,
	                        time: currentTime
	                    }) : this.danmuObject[currentTime] = [{
	                        text: txt,
	                        color: color,
	                        time: currentTime
	                    }];
	                }
	            }
	        },
	        onPlay: function onPlay() {
	            var self = this;
	            var damuItems = document.querySelectorAll('.wx-video-danmu-item');
	            Array.prototype.forEach.apply(damuItems, [function (damuItem) {
	                var transitionDuration = 3 * (parseInt(getComputedStyle(damuItem).left) + damuItem.offsetWidth) / (damuItem.offsetWidth + self.$$.offsetWidth);
	                damuItem.style.left = '-' + damuItem.offsetWidth + 'px';
	                damuItem.style.transitionDuration = transitionDuration + 's';
	                damuItem.style.webkitTransitionDuration = transitionDuration + 's';
	            }]);
	        },
	        onPause: function onPause(event) {
	            var danmuItems = document.querySelectorAll('.wx-video-danmu-item');
	            Array.prototype.forEach.apply(danmuItems, [function (danmu) {
	                danmu.style.left = getComputedStyle(danmu).left;
	            }]);
	        },
	        onEnded: function onEnded(event) {},
	        _computeRate: function _computeRate(targetPos) {
	            var elapsed = this.$.progress.getBoundingClientRect().left,
	                totalLen = this.$.progress.offsetWidth,
	                rate = (targetPos - elapsed) / totalLen;
	            rate < 0 ? rate = 0 : rate > 1 && (rate = 1);
	            return rate;
	        },
	        _setProgress: function _setProgress(rate) {
	            this._progressLength = Math.floor(this.$.progress.offsetWidth * rate);
	            this._progressLeft = this._progressLength - 22;
	        },
	        _sendDanmu: function _sendDanmu(data) {
	            if (this.playing && !data.flag) {
	                data.flag = !0;
	                var danmuItem = document.createElement('p');
	                danmuItem.className += 'wx-video-danmu-item';
	                danmuItem.textContent = data.text;
	                danmuItem.style.top = this._genDanmuPosition() + '%';
	                danmuItem.style.color = data.color;
	                this.$.danmu.appendChild(danmuItem);
	                danmuItem.style.left = '-' + danmuItem.offsetWidth + 'px';
	            }
	        },
	        _genDanmuPosition: function _genDanmuPosition() {
	            if (this.lastDanmuPosition) {
	                var danmuPos = 100 * Math.random();
	                Math.abs(danmuPos - this.lastDanmuPosition) < 10 ? this.lastDanmuPosition = (this.lastDanmuPosition + 50) % 100 : this.lastDanmuPosition = danmuPos;
	            } else {
	                this.lastDanmuPosition = 100 * Math.random();
	            }
	            return this.lastDanmuPosition;
	        },
	        attached: function attached() {
	            // var e = this
	            var self = this;
	            WeixinJSBridge.publish('videoPlayerInsert', {
	                domId: this.id,
	                videoPlayerId: 0
	            });
	            this.$.default.style.display = '';
	            this.$.player.style.display = '';
	            this.$.player.autoplay = this.autoplay;
	            this.$.player.style.objectFit = this.objectFit;
	            console.log('attached', this.objectFit);
	            this.danmuObject = this.danmuList.reduce(function (acc, danmu) {
	                if (typeof danmu.time === 'number' && danmu.time >= 0 && typeof danmu.text === 'string' && danmu.text.length > 0) {
	                    if (acc[danmu.time]) {
	                        acc[danmu.time].push({
	                            text: danmu.text,
	                            color: danmu.color || '#ffffff'
	                        });
	                    } else {
	                        acc[danmu.time] = [{
	                            text: danmu.text,
	                            color: danmu.color || '#ffffff'
	                        }];
	                    }
	                }
	                return acc;
	            }, {});
	            this.$.button.onclick = function (event) {
	                event.stopPropagation();
	                self.$.player[self._buttonType]();
	            };
	            this.$.progress.onclick = function (event) {
	                event.stopPropagation();
	                var rate = self._computeRate(event.clientX);
	                self.$.player.currentTime = self.$.player.duration * rate;
	                self._resetDanmu();
	            };
	            this.$.fullscreen.onclick = function (event) {
	                event.stopPropagation();
	                wx.getPlatform() === 'android' ? self.enableFullScreen = !0 : self.enableFullScreen = !self.enableFullScreen;
	                self.enableFullScreen && self.$.player.webkitEnterFullscreen();
	                self.triggerEvent('togglefullscreen', {
	                    enable: self.enableFullScreen
	                });
	            };
	            this.$.danmuBtn.onclick = function (event) {
	                event.stopPropagation();
	                self.enableDanmu = !self.enableDanmu;
	                self.triggerEvent('toggledanmu', {
	                    enable: self.enableDanmu
	                });
	            };

	            WeixinJSBridge.subscribe('video_' + this.id + '_actionChanged', function (res) {
	                self.action = res;
	                self.actionChanged(res);
	            });
	        },
	        onTimeUpdate: function onTimeUpdate(event) {
	            var self = this;
	            event.stopPropagation();
	            var rate = this.$.player.currentTime / this.$.player.duration;
	            this._isLockTimeUpdateProgress || this._setProgress(rate);
	            var danmuList = this.danmuObject[parseInt(this.$.player.currentTime)];
	            void 0 !== danmuList && danmuList.length > 0 && danmuList.forEach(function (danmu) {
	                self._sendDanmu(danmu);
	            });
	        },
	        detached: function detached() {},
	        onBallTouchStart: function onBallTouchStart() {
	            if (!this.isLive) {
	                var self = this;
	                self._isLockTimeUpdateProgress = !0;
	                var touchMoveHandler = function touchMoveHandler(event) {
	                    event.stopPropagation();
	                    event.preventDefault();
	                    self._rate = self._computeRate(event.touches[0].clientX);
	                    self._setProgress(self._rate);
	                };
	                var touchEndHandler = function touchEndHandler(event) {
	                    self.$.player.currentTime = self.$.player.duration * self._rate;
	                    document.removeEventListener('touchmove', touchMoveHandler);
	                    document.removeEventListener('touchend', touchEndHandler);
	                    self._isLockTimeUpdateProgress = !1;
	                    self._resetDanmu();
	                };
	                document.addEventListener('touchmove', touchMoveHandler);
	                document.addEventListener('touchend', touchEndHandler);
	            }
	        },
	        _resetDanmu: function _resetDanmu() {
	            var self = this;
	            this.$.danmu.innerHTML = '';
	            (0, _keys3.default)(this.danmuObject).forEach(function (danmuListKey) {
	                self.danmuObject[danmuListKey].forEach(function (danmu) {
	                    danmu.flag = !1;
	                });
	            });
	        }
	    });
	}

	// wx-video on ios
	if (wx.getPlatform() === 'ios') {
	    window.exparser.registerElement({
	        is: 'wx-video',
	        behaviors: ['wx-base', 'wx-player', 'wx-native'],
	        template: '\n      <div class="wx-video-container">\n        <video id="player" webkit-playsinline style="display: none;"></video>\n        <div id="default" class$="wx-video-bar {{_barType}}" style="display: none;">\n          <div id="controls" class="wx-video-controls">\n            <div id="button" class$="wx-video-button {{_buttonType}}"></div>\n            <div class="wx-video-time" parse-text-content>{{_currentTime}}</div>\n            <div id="progress" class="wx-video-progress">\n              <div id="ball" class="wx-video-ball" style$="left: {{_progressLeft}}px;">\n                <div class="wx-video-inner"></div>\n              </div>\n              <div class="wx-video-inner" style$="width: {{_progressLength}}px;"></div>\n            </div>\n            <div class="wx-video-time" parse-text-content>{{_duration}}</div>\n          </div>\n          <div id="danmuBtn" class$="wx-video-danmu-btn {{_danmuStatus}}" style="display: none">弹幕</div>\n          <div id="fullscreen" class="wx-video-fullscreen"></div>\n        </div>\n        <div id="danmu" class="wx-video-danmu" style="z-index: -9999">\n        </div>\n      </div>\n      <div id="fakebutton"></div>\n    ',
	        properties: {
	            autoplay: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            bindplay: {
	                type: String,
	                value: '',
	                public: !0
	            },
	            bindpause: {
	                type: String,
	                value: '',
	                public: !0,
	                observer: 'handlersChanged'
	            },
	            bindended: {
	                type: String,
	                value: '',
	                public: !0,
	                observer: 'handlersChanged'
	            },
	            bindtimeupdate: {
	                type: String,
	                value: '',
	                public: !0,
	                observer: 'handlersChanged'
	            },
	            danmuBtn: {
	                type: Boolean,
	                value: !1,
	                public: !0,
	                observer: 'danmuBtnChanged'
	            },
	            enableDanmu: {
	                type: Boolean,
	                value: !1,
	                observer: 'enableDanmuChanged',
	                public: !0
	            },
	            enableFullScreen: {
	                type: Boolean,
	                value: !1,
	                public: !0
	            },
	            controls: {
	                type: Boolean,
	                value: !0,
	                public: !0,
	                observer: 'controlsChanged'
	            },
	            danmuList: {
	                type: Array,
	                value: [],
	                public: !0
	            },
	            objectFit: {
	                type: String,
	                value: 'contain',
	                public: !0
	            },
	            duration: {
	                type: Number,
	                value: 0,
	                public: !0
	            },
	            _videoId: {
	                type: Number
	            },
	            _isLockTimeUpdateProgress: {
	                type: Boolean,
	                value: !1
	            },
	            _rate: {
	                type: Number,
	                value: 0
	            },
	            _progressLeft: {
	                type: Number,
	                value: -22
	            },
	            _progressLength: {
	                type: Number,
	                value: 0
	            },
	            _barType: {
	                type: String,
	                value: 'full'
	            },
	            _danmuStatus: {
	                type: String,
	                value: ''
	            }
	        },
	        listeners: {
	            'ball.touchstart': 'onBallTouchStart'
	        },
	        handlersChanged: function handlersChanged() {
	            this._update();
	        },
	        _reset: function _reset() {
	            this._buttonType = 'play';
	            this._currentTime = '00:00';
	            this._duration = '00:00';
	            this._progressLeft = -22;
	            this._progressLength = 0;
	            this._barType = this.controls ? 'full' : 'part';
	        },
	        _update: function _update() {
	            var opt = arguments.length <= 0 || void 0 === arguments[0] ? {} : arguments[0],
	                _this = this;
	            opt.videoPlayerId = this._videoId;
	            opt.hide = this.hidden;
	            var _data = this._getData();
	            opt.needEvent = (0, _keys3.default)(_data.handlers).length > 0;
	            opt.objectFit = this.objectFit;
	            opt.showBasicControls = this.controls;
	            opt.showDanmuBtn = this.danmuBtn;
	            opt.enableDanmu = this.enableDanmu;
	            opt.data = (0, _stringify2.default)(_data);
	            this.duration > 0 && (opt.duration = this.duration);
	            WeixinJSBridge.invoke('updateVideoPlayer', opt, function (data) {
	                ;/ok/.test(data.errMsg) || _this._publish('error', {
	                    errMsg: data.errMsg
	                });
	            });
	        },
	        _updatePosition: function _updatePosition() {
	            if (this._isiOS()) {
	                this._update({
	                    position: this._box
	                }, '位置');
	            } else {
	                this.$.player.width = this._box.width;
	                this.$.player.height = this._box.height;
	            }
	        },
	        _hiddenChanged: function _hiddenChanged(isHidden) {
	            if (this._isiOS()) {
	                this.$$.style.display = isHidden ? 'none' : '';
	                this._update({
	                    hide: isHidden
	                }, isHidden ? '隐藏' : '显示');
	            } else {
	                this.$.player.pause();
	                this.$$.style.display = isHidden ? 'none' : '';
	            }
	        },
	        posterChanged: function posterChanged(posterUrl, t) {
	            if (!this._isError) {
	                if (this._isReady) {
	                    this._isiOS() && (/http:\/\//.test(posterUrl) || /https:\/\//.test(posterUrl)) ? this._update({
	                        poster: posterUrl
	                    }, '封面') : this.$.player.poster = posterUrl;
	                    return void 0;
	                } else {
	                    this._deferred.push({
	                        callback: 'posterChanged',
	                        args: [posterUrl, t]
	                    });
	                    return void 0;
	                }
	            }
	        },
	        srcChanged: function srcChanged(srcUrl, t) {
	            if (!this._isError && srcUrl) {
	                if (!this._isReady) {
	                    return void this._deferred.push({
	                        callback: 'srcChanged',
	                        args: [srcUrl, t]
	                    });
	                }
	                if (this._isiOS()) {
	                    ;/wdfile:\/\//.test(srcUrl) || /http:\/\//.test(srcUrl) || /https:\/\//.test(srcUrl) ? this._update({
	                        filePath: srcUrl
	                    }, '资源') : this._publish('error', {
	                        errMsg: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
	                    });
	                } else if (this._isDevTools()) {
	                    this.$.player.src = srcUrl.replace('wdfile://', 'http://wxfile.open.weixin.qq.com/');
	                    var self = this;
	                    setTimeout(function () {
	                        self._reset();
	                    }, 0);
	                } else {
	                    this.$.player.src = srcUrl;
	                    var self = this;
	                    setTimeout(function () {
	                        self._reset();
	                    }, 0);
	                }
	            }
	        },
	        controlsChanged: function controlsChanged(show, t) {
	            this._update({});
	            this.$.controls.style.display = show ? 'flex' : 'none';
	        },
	        danmuBtnChanged: function danmuBtnChanged(show, t) {
	            this._update({});
	            this.$.danmuBtn.style.display = show ? '' : 'none';
	        },
	        enableDanmuChanged: function enableDanmuChanged(isActive, t) {
	            this._update({});
	            this._danmuStatus = isActive ? 'active' : '';
	            this.$.danmu.style.zIndex = isActive ? '0' : '-9999';
	        },
	        actionChanged: function actionChanged(action, t) {
	            if (this._isiOS()) {} else {
	                if ((typeof action === 'undefined' ? 'undefined' : (0, _typeof3.default)(action)) !== 'object') return;
	                var method = action.method,
	                    data = action.data;
	                if (method === 'play') {
	                    this.$.player.play();
	                } else if (method === 'pause') {
	                    this.$.player.pause();
	                } else if (method === 'seek') {
	                    this.$.player.currentTime = data[0];
	                    this._resetDanmu();
	                } else if (method === 'sendDanmu') {
	                    var danmuData = _slicedToArray(data, 2),
	                        txt = danmuData[0],
	                        color = danmuData[1],
	                        time = parseInt(this.$.player.currentTime);
	                    this.danmuObject[time] ? this.danmuObject[time].push({
	                        text: txt,
	                        color: color,
	                        time: time
	                    }) : this.danmuObject[time] = [{
	                        text: txt,
	                        color: color,
	                        time: time
	                    }];
	                }
	            }
	        },
	        onPlay: function onPlay(e) {
	            var self = this,
	                danmuItems = document.querySelectorAll('.wx-video-danmu-item');
	            Array.prototype.forEach.apply(danmuItems, [function (danmuItem) {
	                var transitionDuration = 3 * (parseInt(getComputedStyle(danmuItem).left) + danmuItem.offsetWidth) / (danmuItem.offsetWidth + self.$$.offsetWidth);
	                danmuItem.style.left = '-' + danmuItem.offsetWidth + 'px';
	                danmuItem.style.transitionDuration = transitionDuration + 'checkScrollBottom';
	                danmuItem.style.webkitTransitionDuration = transitionDuration + 'checkScrollBottom';
	            }]);
	            this.bindplay && wx.publishPageEvent(this.bindplay, {
	                type: 'play'
	            });
	        },
	        onPause: function onPause(e) {
	            var danmuItems = document.querySelectorAll('.wx-video-danmu-item');
	            Array.prototype.forEach.apply(danmuItems, [function (danmuItem) {
	                danmuItem.style.left = getComputedStyle(danmuItem).left;
	            }]), wx.publishPageEvent(this.bindpause, {
	                type: 'pause'
	            });
	        },
	        onEnded: function onEnded(e) {
	            wx.publishPageEvent(this.bindended, {
	                type: 'ended'
	            });
	        },
	        _computeRate: function _computeRate(targetPos) {
	            var elapsed = this.$.progress.getBoundingClientRect().left,
	                totalTime = this.$.progress.offsetWidth,
	                rate = (targetPos - elapsed) / totalTime;
	            rate < 0 ? rate = 0 : rate > 1 && (rate = 1);
	            return rate;
	        },
	        _setProgress: function _setProgress(rate) {
	            this._progressLength = Math.floor(this.$.progress.offsetWidth * rate);
	            this._progressLeft = this._progressLength - 22;
	        },
	        _sendDanmu: function _sendDanmu(data) {
	            if (this.playing && !data.flag) {
	                data.flag = !0;
	                var danmuEle = document.createElement('p');
	                danmuEle.className += 'wx-video-danmu-item';
	                danmuEle.textContent = data.text;
	                danmuEle.style.top = this._genDanmuPosition() + '%';
	                danmuEle.style.color = data.color;
	                this.$.danmu.appendChild(danmuEle);
	                danmuEle.style.left = '-' + danmuEle.offsetWidth + 'px';
	            }
	        },
	        _genDanmuPosition: function _genDanmuPosition() {
	            if (this.lastDanmuPosition) {
	                var danmuPos = 100 * Math.random();
	                Math.abs(danmuPos - this.lastDanmuPosition) < 10 ? this.lastDanmuPosition = (this.lastDanmuPosition + 50) % 100 : this.lastDanmuPosition = danmuPos;
	            } else {
	                this.lastDanmuPosition = 100 * Math.random();
	            }
	            return this.lastDanmuPosition;
	        },
	        attached: function attached() {
	            var self2 = this,
	                self = this;
	            if (this._isiOS()) {
	                this._box = this._getBox();
	                var data = this._getData();
	                var opt = {
	                    data: (0, _stringify2.default)(data),
	                    needEvent: (0, _keys3.default)(data.handlers).length > 0,
	                    position: this._box,
	                    hide: this.hidden,
	                    enableDanmu: this.enableDanmu,
	                    showDanmuBtn: this.danmuBtn,
	                    showBasicControls: this.controls,
	                    objectFit: this.objectFit,
	                    autoplay: this.autoplay,
	                    danmuList: this.danmuList
	                };
	                this.duration > 0 && (opt.duration = this.duration);
	                WeixinJSBridge.invoke('insertVideoPlayer', opt, function (res) {
	                    if (/ok/.test(res.errMsg)) {
	                        self._videoId = res.videoPlayerId;
	                        self._ready();
	                        self.createdTimestamp = Date.now();
	                        document.addEventListener('pageReRender', self._pageReRenderCallback.bind(self));
	                        WeixinJSBridge.publish('videoPlayerInsert', {
	                            domId: self.id,
	                            videoPlayerId: res.videoPlayerId
	                        });
	                    } else {
	                        self._isError = !0;
	                        self.$$.style.display = 'none';
	                        self._publish('error', {
	                            errMsg: res.errMsg
	                        });
	                    }
	                });
	            } else {
	                WeixinJSBridge.publish('videoPlayerInsert', {
	                    domId: this.id,
	                    videoPlayerId: 0
	                });
	            }
	            this.$.default.style.display = '';
	            this.$.player.style.display = '';
	            this.$.player.autoplay = this.autoplay;
	            this.danmuObject = this.danmuList.reduce(function (acc, danmuItem) {
	                if (typeof danmuItem.time === 'number' && danmuItem.time >= 0 && typeof danmuItem.text === 'string' && danmuItem.text.length > 0) {
	                    if (acc[danmuItem.time]) {
	                        acc[danmuItem.time].push({
	                            text: danmuItem.text,
	                            color: danmuItem.color || '#ffffff'
	                        });
	                    } else {
	                        acc[danmuItem.time] = [{
	                            text: danmuItem.text,
	                            color: danmuItem.color || '#ffffff'
	                        }];
	                    }
	                }

	                return acc;
	            }, {});
	            this.$.button.onclick = function (event) {
	                event.stopPropagation(), self.$.player[self._buttonType]();
	            };
	            this.$.progress.onclick = function (event) {
	                event.stopPropagation();
	                var rate = self._computeRate(event.clientX);
	                self.$.player.currentTime = self.$.player.duration * rate;
	                self._resetDanmu();
	            };
	            this.$.fullscreen.onclick = function (event) {
	                event.stopPropagation();
	                self.enableFullScreen = !self.enableFullScreen;
	                self.enableFullScreen && self.$.player.webkitEnterFullscreen();
	                self.triggerEvent('togglefullscreen', {
	                    enable: self.enableFullScreen
	                });
	            };
	            this.$.danmuBtn.onclick = function (event) {
	                event.stopPropagation();
	                self.enableDanmu = !self.enableDanmu;
	                self.triggerEvent('toggledanmu', {
	                    enable: self.enableDanmu
	                });
	            };
	            this._ready();
	            document.addEventListener('pageReRender', this._pageReRenderCallback.bind(this));
	            WeixinJSBridge.subscribe('video_' + this.id + '_actionChanged', function (res) {
	                self2.action = res;
	                self2.actionChanged(res);
	            });
	        },
	        onTimeUpdate: function onTimeUpdate(event) {
	            var self = this;
	            event.stopPropagation();
	            var rate = this.$.player.currentTime / this.$.player.duration;
	            this._isLockTimeUpdateProgress || this._setProgress(rate);
	            var danmuList = this.danmuObject[parseInt(this.$.player.currentTime)];
	            void 0 !== danmuList && danmuList.length > 0 && danmuList.forEach(function (danmu) {
	                self._sendDanmu(danmu);
	            });
	            this.bindtimeupdate && wx.publishPageEvent(this.bindtimeupdate, {
	                type: 'timeupdate',
	                detail: {
	                    currentTime: this.$.player.currentTime,
	                    duration: this.$.player.duration
	                }
	            });
	        },
	        detached: function detached() {
	            this._isiOS() && wx.removeVideoPlayer({
	                videoPlayerId: this._videoId,
	                success: function success(e) {}
	            }), WeixinJSBridge.publish('videoPlayerRemoved', {
	                domId: this.id,
	                videoPlayerId: this.videoPlayerId
	            });
	        },
	        onBallTouchStart: function onBallTouchStart() {
	            var self = this;
	            self._isLockTimeUpdateProgress = !0;
	            var touchmove = function touchmove(event) {
	                event.stopPropagation();
	                event.preventDefault();
	                self._rate = self._computeRate(event.touches[0].clientX);
	                self._setProgress(self._rate);
	            };
	            var touchend = function touchend(event) {
	                self.$.player.currentTime = self.$.player.duration * self._rate;
	                document.removeEventListener('touchmove', touchmove);
	                document.removeEventListener('touchend', touchend);
	                self._isLockTimeUpdateProgress = !1;
	                self._resetDanmu();
	            };
	            document.addEventListener('touchmove', touchmove);
	            document.addEventListener('touchend', touchend);
	        },
	        _resetDanmu: function _resetDanmu() {
	            var self = this;
	            this.$.danmu.innerHTML = '';
	            (0, _keys3.default)(this.danmuObject).forEach(function (danmuListKey) {
	                self.danmuObject[danmuListKey].forEach(function (danmu) {
	                    danmu.flag = !1;
	                });
	            });
	        },
	        _getData: function _getData() {
	            var self = this;
	            return {
	                handlers: ['bindplay', 'bindpause', 'bindended', 'bindtimeupdate'].reduce(function (acc, handlerName) {
	                    handlerName && (acc[handlerName] = self[handlerName]);
	                    return acc;
	                }, {}),
	                event: {
	                    target: {
	                        dataset: this.dataset,
	                        id: this.$$.id,
	                        offsetTop: this.$$.offsetTop,
	                        offsetLeft: this.$$.offsetLeft
	                    },
	                    currentTarget: {
	                        dataset: this.dataset,
	                        id: this.$$.id,
	                        offsetTop: this.$$.offsetTop,
	                        offsetLeft: this.$$.offsetLeft
	                    }
	                },
	                createdTimestamp: this.createdTimestamp
	            };
	        }
	    });
	}

	// prettier-ignore
	window.exparser.registerElement({
	    is: 'wx-view',
	    template: '<slot></slot>',
	    behaviors: ['wx-base', 'wx-hover'],
	    properties: {
	        inline: {
	            type: Boolean,
	            public: !0
	        },
	        hover: {
	            type: Boolean,
	            value: !1,
	            public: !0
	        }
	    }
	}); // eslint-disable-line

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(2);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(53);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	__webpack_require__(48);
	module.exports = __webpack_require__(52).f('iterator');

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(5)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(8)(String, 'String', function(iterated){
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(6)
	  , defined   = __webpack_require__(7);
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
/* 6 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(9)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(25)
	  , hide           = __webpack_require__(15)
	  , has            = __webpack_require__(26)
	  , Iterators      = __webpack_require__(27)
	  , $iterCreate    = __webpack_require__(28)
	  , setToStringTag = __webpack_require__(44)
	  , getPrototypeOf = __webpack_require__(46)
	  , ITERATOR       = __webpack_require__(45)('iterator')
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
/* 9 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , core      = __webpack_require__(12)
	  , ctx       = __webpack_require__(13)
	  , hide      = __webpack_require__(15)
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
/* 11 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(14);
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
/* 14 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(16)
	  , createDesc = __webpack_require__(24);
	module.exports = __webpack_require__(20) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(17)
	  , IE8_DOM_DEFINE = __webpack_require__(19)
	  , toPrimitive    = __webpack_require__(23)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(20) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(20) && !__webpack_require__(21)(function(){
	  return Object.defineProperty(__webpack_require__(22)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(21)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18)
	  , document = __webpack_require__(11).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(18);
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
/* 24 */
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15);

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(29)
	  , descriptor     = __webpack_require__(24)
	  , setToStringTag = __webpack_require__(44)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(15)(IteratorPrototype, __webpack_require__(45)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(17)
	  , dPs         = __webpack_require__(30)
	  , enumBugKeys = __webpack_require__(42)
	  , IE_PROTO    = __webpack_require__(39)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(22)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(43).appendChild(iframe);
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(16)
	  , anObject = __webpack_require__(17)
	  , getKeys  = __webpack_require__(31);

	module.exports = __webpack_require__(20) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(32)
	  , enumBugKeys = __webpack_require__(42);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(26)
	  , toIObject    = __webpack_require__(33)
	  , arrayIndexOf = __webpack_require__(36)(false)
	  , IE_PROTO     = __webpack_require__(39)('IE_PROTO');

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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(34)
	  , defined = __webpack_require__(7);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(35);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(33)
	  , toLength  = __webpack_require__(37)
	  , toIndex   = __webpack_require__(38);
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(6)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(6)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(40)('keys')
	  , uid    = __webpack_require__(41);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(11)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 42 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11).document && document.documentElement;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(16).f
	  , has = __webpack_require__(26)
	  , TAG = __webpack_require__(45)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(40)('wks')
	  , uid        = __webpack_require__(41)
	  , Symbol     = __webpack_require__(11).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(26)
	  , toObject    = __webpack_require__(47)
	  , IE_PROTO    = __webpack_require__(39)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(7);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(49);
	var global        = __webpack_require__(11)
	  , hide          = __webpack_require__(15)
	  , Iterators     = __webpack_require__(27)
	  , TO_STRING_TAG = __webpack_require__(45)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(50)
	  , step             = __webpack_require__(51)
	  , Iterators        = __webpack_require__(27)
	  , toIObject        = __webpack_require__(33);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(8)(Array, 'Array', function(iterated, kind){
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
/* 50 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 51 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(45);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(54), __esModule: true };

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(55);
	__webpack_require__(66);
	__webpack_require__(67);
	__webpack_require__(68);
	module.exports = __webpack_require__(12).Symbol;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(11)
	  , has            = __webpack_require__(26)
	  , DESCRIPTORS    = __webpack_require__(20)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(25)
	  , META           = __webpack_require__(56).KEY
	  , $fails         = __webpack_require__(21)
	  , shared         = __webpack_require__(40)
	  , setToStringTag = __webpack_require__(44)
	  , uid            = __webpack_require__(41)
	  , wks            = __webpack_require__(45)
	  , wksExt         = __webpack_require__(52)
	  , wksDefine      = __webpack_require__(57)
	  , keyOf          = __webpack_require__(58)
	  , enumKeys       = __webpack_require__(59)
	  , isArray        = __webpack_require__(62)
	  , anObject       = __webpack_require__(17)
	  , toIObject      = __webpack_require__(33)
	  , toPrimitive    = __webpack_require__(23)
	  , createDesc     = __webpack_require__(24)
	  , _create        = __webpack_require__(29)
	  , gOPNExt        = __webpack_require__(63)
	  , $GOPD          = __webpack_require__(65)
	  , $DP            = __webpack_require__(16)
	  , $keys          = __webpack_require__(31)
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
	  __webpack_require__(64).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(61).f  = $propertyIsEnumerable;
	  __webpack_require__(60).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(9)){
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(15)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(41)('meta')
	  , isObject = __webpack_require__(18)
	  , has      = __webpack_require__(26)
	  , setDesc  = __webpack_require__(16).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(21)(function(){
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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(11)
	  , core           = __webpack_require__(12)
	  , LIBRARY        = __webpack_require__(9)
	  , wksExt         = __webpack_require__(52)
	  , defineProperty = __webpack_require__(16).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(31)
	  , toIObject = __webpack_require__(33);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(31)
	  , gOPS    = __webpack_require__(60)
	  , pIE     = __webpack_require__(61);
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
/* 60 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 61 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(35);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(33)
	  , gOPN      = __webpack_require__(64).f
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
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(32)
	  , hiddenKeys = __webpack_require__(42).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(61)
	  , createDesc     = __webpack_require__(24)
	  , toIObject      = __webpack_require__(33)
	  , toPrimitive    = __webpack_require__(23)
	  , has            = __webpack_require__(26)
	  , IE8_DOM_DEFINE = __webpack_require__(19)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(20) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 66 */
/***/ (function(module, exports) {

	

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(57)('asyncIterator');

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(57)('observable');

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(70), __esModule: true };

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(71);
	module.exports = __webpack_require__(12).Object.keys;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(47)
	  , $keys    = __webpack_require__(31);

	__webpack_require__(72)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(10)
	  , core    = __webpack_require__(12)
	  , fails   = __webpack_require__(21);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(75);
	var $Object = __webpack_require__(12).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(10)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(29)});

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(77), __esModule: true };

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(12)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(79), __esModule: true };

/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(48);
	__webpack_require__(4);
	module.exports = __webpack_require__(80);

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(81)
	  , ITERATOR  = __webpack_require__(45)('iterator')
	  , Iterators = __webpack_require__(27);
	module.exports = __webpack_require__(12).isIterable = function(it){
	  var O = Object(it);
	  return O[ITERATOR] !== undefined
	    || '@@iterator' in O
	    || Iterators.hasOwnProperty(classof(O));
	};

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(35)
	  , TAG = __webpack_require__(45)('toStringTag')
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
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(83), __esModule: true };

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(48);
	__webpack_require__(4);
	module.exports = __webpack_require__(84);

/***/ }),
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(17)
	  , get      = __webpack_require__(85);
	module.exports = __webpack_require__(12).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ }),
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(81)
	  , ITERATOR  = __webpack_require__(45)('iterator')
	  , Iterators = __webpack_require__(27);
	module.exports = __webpack_require__(12).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(88);
	var $Object = __webpack_require__(12).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(10);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(20), 'Object', {defineProperty: __webpack_require__(16).f});

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(90), __esModule: true };

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	__webpack_require__(91);
	module.exports = __webpack_require__(12).Array.from;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(13)
	  , $export        = __webpack_require__(10)
	  , toObject       = __webpack_require__(47)
	  , call           = __webpack_require__(92)
	  , isArrayIter    = __webpack_require__(93)
	  , toLength       = __webpack_require__(37)
	  , createProperty = __webpack_require__(94)
	  , getIterFn      = __webpack_require__(85);

	$export($export.S + $export.F * !__webpack_require__(95)(function(iter){ Array.from(iter); }), 'Array', {
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
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(17);
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
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(27)
	  , ITERATOR   = __webpack_require__(45)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(16)
	  , createDesc      = __webpack_require__(24);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(45)('iterator')
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

/***/ })
/******/ ]);
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

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _WxVirtualNode = __webpack_require__(96);

	var _WxVirtualNode2 = _interopRequireDefault(_WxVirtualNode);

	var _Utils = __webpack_require__(99);

	var _Utils2 = _interopRequireDefault(_Utils);

	var _WxVirtualText = __webpack_require__(115);

	var _WxVirtualText2 = _interopRequireDefault(_WxVirtualText);

	var _AppData = __webpack_require__(116);

	var _AppData2 = _interopRequireDefault(_AppData);

	var _ErrorCatcher = __webpack_require__(118);

	var _ErrorCatcher2 = _interopRequireDefault(_ErrorCatcher);

	var _TouchEvents = __webpack_require__(119);

	var _TouchEvents2 = _interopRequireDefault(_TouchEvents);

	var _Init = __webpack_require__(120);

	var _Init2 = _interopRequireDefault(_Init);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_Init2.default.init();

	window.__mergeData__ = _AppData2.default.mergeData;
	window.__DOMTree__ = void 0;
	window.firstRender = 0;
	var domReady = '__DOMReady';
	var rootNode = void 0;

	var STATE_FLAGS = {
	    funcReady: !1,
	    dataReady: !1
	};
	var dataChangeEventQueue = [];
	var webViewInfo = {
	    webviewStartTime: Date.now(),
	    funcReady: 0
	};

	function speedReport(key, startTime, endTime, data) {
	    Reporter.speedReport({
	        key: key,
	        timeMark: {
	            startTime: startTime,
	            endTime: endTime
	        },
	        force: key !== 'reRenderTime',
	        data: data
	    });
	}
	function setGlobalPageAttr(name, value) {
	    window[name] = value;
	    window.__curPage__ = {
	        name: name,
	        value: value
	    };
	}
	function setRootNode(value) {
	    rootNode = value;
	    window.__curPage__ = {
	        name: 'rootNode',
	        value: value
	    };
	}

	var createWXVirtualNode = function createWXVirtualNode(tagName, props, newProps, wxkey, wxVkey, children) {
	    return new _WxVirtualNode2.default(tagName, props, newProps, wxkey, wxVkey, children);
	};
	var createWxVirtualText = function createWxVirtualText(txt) {
	    return new _WxVirtualText2.default(txt);
	};
	var createWXVirtualNodeRec = function createWXVirtualNodeRec(opt) {
	    // Recursively
	    if (_Utils2.default.isString(opt) || Number(opt) === opt && Number(opt) % 1 === 0) {
	        return createWxVirtualText(String(opt));
	    }
	    var children = [];
	    opt.children.forEach(function (child) {
	        children.push(createWXVirtualNodeRec(child));
	    });
	    return createWXVirtualNode(opt.tag, opt.attr, opt.n, opt.wxKey, opt.wxVkey, children);
	};
	var createBodyNode = function createBodyNode(data) {
	    window.__curPage__.envData || (window.__curPage__.envData = {});
	    var root = window.__generateFunc__(window.__curPage__.envData, //AppData.getAppData(),
	    data);
	    // t.tag = "body"
	    return createWXVirtualNodeRec(root);
	};

	var firstTimeRender = function firstTimeRender(event) {
	    if (event.ext) {
	        typeof event.ext.webviewId !== 'undefined' && (window.__webviewId__ = event.ext.webviewId);
	        event.ext.enablePullUpRefresh && setGlobalPageAttr('__enablePullUpRefresh__', !0);
	    }
	    setRootNode(createBodyNode(event.data));
	    setGlobalPageAttr('__DOMTree__', rootNode.render());
	    exparser.Element.replaceDocumentElement(window.__DOMTree__, document.querySelector('#view-body-' + window.__wxConfig.viewId));
	    setTimeout(function () {
	        wx.publishPageEvent(domReady, {});
	        wx.initReady();
	        _TouchEvents2.default.enablePullUpRefresh();
	    }, 0);
	};

	var reRender = function reRender(event) {
	    var newBodyNode = createBodyNode(event.data);
	    if (window.__curPage__ && window.__curPage__.rootNode != rootNode) {
	        rootNode = window.__curPage__.rootNode;
	    }
	    var patch = rootNode.diff(newBodyNode);
	    patch.apply(window.__DOMTree__);
	    setRootNode(newBodyNode);
	};

	var renderOnDataChange = function renderOnDataChange(event) {
	    if (window.firstRender) {
	        setTimeout(function () {
	            var timeStamp = Date.now();
	            reRender(event);
	            speedReport('reRenderTime', timeStamp, Date.now());
	            document.dispatchEvent(new CustomEvent('pageReRender', {}));
	        }, 0);
	    } else {
	        var timeStamp = Date.now();
	        speedReport('firstGetData', webViewInfo.funcReady, Date.now());
	        firstTimeRender(event);
	        speedReport('firstRenderTime', timeStamp, Date.now());
	        if (!(event.options && event.options.firstRender)) {
	            console.error('firstRender not the data from Page.data');
	            Reporter.errorReport({
	                key: 'webviewScriptError',
	                error: new Error('firstRender not the data from Page.data'),
	                extend: 'firstRender not the data from Page.data'
	            });
	        }
	        window.firstRender = !0;
	        document.dispatchEvent(new CustomEvent('pageReRender', {}));
	    }
	};

	window.onerror = function (messageOrEvent, source, lineno, colno, error) {
	    console.error(error && error.stack);
	    Reporter.errorReport({
	        key: 'webviewScriptError',
	        error: error
	    });
	};

	wx.onAppDataChange(_ErrorCatcher2.default.catchError(function (event) {
	    STATE_FLAGS.dataReady = !0;
	    STATE_FLAGS.funcReady ? renderOnDataChange(event) : dataChangeEventQueue.push(event);
	}));

	document.addEventListener('generateFuncReady', _ErrorCatcher2.default.catchError(function (event) {
	    console.log('generateFuncReady --- speedReports');
	    webViewInfo.funcReady = Date.now();
	    speedReport('funcReady', webViewInfo.webviewStartTime, webViewInfo.funcReady);
	    window.__pageFrameStartTime__ && window.__pageFrameEndTime__ && speedReport('pageframe', window.__pageFrameStartTime__, window.__pageFrameEndTime__);
	    window.__WAWebviewStartTime__ && window.__WAWebviewEndTime__ && speedReport('WAWebview', window.__WAWebviewStartTime__, window.__WAWebviewEndTime__);
	    STATE_FLAGS.funcReady = !0;
	    WeixinJSBridge.publish('DOMContentLoaded', {
	        data: {},
	        options: {
	            timestamp: Date.now()
	        }
	    });

	    if (STATE_FLAGS.dataReady) {
	        for (var eventName in dataChangeEventQueue) {
	            var _event = dataChangeEventQueue[eventName];
	            renderOnDataChange(_event);
	        }
	    }
	}));

	exports.default = {
	    reset: function reset() {
	        rootNode = void 0;
	        window.__DOMTree__ = void 0;
	        // nonsenselet = {}
	    }
	};

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(2);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(53);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(3), __esModule: true };

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	__webpack_require__(48);
	module.exports = __webpack_require__(52).f('iterator');

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(5)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(8)(String, 'String', function(iterated){
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
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(6)
	  , defined   = __webpack_require__(7);
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
/* 6 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 7 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(9)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(25)
	  , hide           = __webpack_require__(15)
	  , has            = __webpack_require__(26)
	  , Iterators      = __webpack_require__(27)
	  , $iterCreate    = __webpack_require__(28)
	  , setToStringTag = __webpack_require__(44)
	  , getPrototypeOf = __webpack_require__(46)
	  , ITERATOR       = __webpack_require__(45)('iterator')
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
/* 9 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(11)
	  , core      = __webpack_require__(12)
	  , ctx       = __webpack_require__(13)
	  , hide      = __webpack_require__(15)
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
/* 11 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 12 */
/***/ (function(module, exports) {

	var core = module.exports = {version: '2.4.0'};
	if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(14);
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
/* 14 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(16)
	  , createDesc = __webpack_require__(24);
	module.exports = __webpack_require__(20) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(17)
	  , IE8_DOM_DEFINE = __webpack_require__(19)
	  , toPrimitive    = __webpack_require__(23)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(20) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 18 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(20) && !__webpack_require__(21)(function(){
	  return Object.defineProperty(__webpack_require__(22)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(21)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 21 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(18)
	  , document = __webpack_require__(11).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(18);
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
/* 24 */
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
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(15);

/***/ }),
/* 26 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 27 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(29)
	  , descriptor     = __webpack_require__(24)
	  , setToStringTag = __webpack_require__(44)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(15)(IteratorPrototype, __webpack_require__(45)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(17)
	  , dPs         = __webpack_require__(30)
	  , enumBugKeys = __webpack_require__(42)
	  , IE_PROTO    = __webpack_require__(39)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(22)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(43).appendChild(iframe);
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
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(16)
	  , anObject = __webpack_require__(17)
	  , getKeys  = __webpack_require__(31);

	module.exports = __webpack_require__(20) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(32)
	  , enumBugKeys = __webpack_require__(42);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(26)
	  , toIObject    = __webpack_require__(33)
	  , arrayIndexOf = __webpack_require__(36)(false)
	  , IE_PROTO     = __webpack_require__(39)('IE_PROTO');

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
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(34)
	  , defined = __webpack_require__(7);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(35);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 35 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(33)
	  , toLength  = __webpack_require__(37)
	  , toIndex   = __webpack_require__(38);
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
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(6)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(6)
	  , max       = Math.max
	  , min       = Math.min;
	module.exports = function(index, length){
	  index = toInteger(index);
	  return index < 0 ? max(index + length, 0) : min(index, length);
	};

/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

	var shared = __webpack_require__(40)('keys')
	  , uid    = __webpack_require__(41);
	module.exports = function(key){
	  return shared[key] || (shared[key] = uid(key));
	};

/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

	var global = __webpack_require__(11)
	  , SHARED = '__core-js_shared__'
	  , store  = global[SHARED] || (global[SHARED] = {});
	module.exports = function(key){
	  return store[key] || (store[key] = {});
	};

/***/ }),
/* 41 */
/***/ (function(module, exports) {

	var id = 0
	  , px = Math.random();
	module.exports = function(key){
	  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
	};

/***/ }),
/* 42 */
/***/ (function(module, exports) {

	// IE 8- don't enum bug keys
	module.exports = (
	  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
	).split(',');

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(11).document && document.documentElement;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(16).f
	  , has = __webpack_require__(26)
	  , TAG = __webpack_require__(45)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(40)('wks')
	  , uid        = __webpack_require__(41)
	  , Symbol     = __webpack_require__(11).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(26)
	  , toObject    = __webpack_require__(47)
	  , IE_PROTO    = __webpack_require__(39)('IE_PROTO')
	  , ObjectProto = Object.prototype;

	module.exports = Object.getPrototypeOf || function(O){
	  O = toObject(O);
	  if(has(O, IE_PROTO))return O[IE_PROTO];
	  if(typeof O.constructor == 'function' && O instanceof O.constructor){
	    return O.constructor.prototype;
	  } return O instanceof Object ? ObjectProto : null;
	};

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(7);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(49);
	var global        = __webpack_require__(11)
	  , hide          = __webpack_require__(15)
	  , Iterators     = __webpack_require__(27)
	  , TO_STRING_TAG = __webpack_require__(45)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(50)
	  , step             = __webpack_require__(51)
	  , Iterators        = __webpack_require__(27)
	  , toIObject        = __webpack_require__(33);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(8)(Array, 'Array', function(iterated, kind){
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
/* 50 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 51 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(45);

/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(54), __esModule: true };

/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(55);
	__webpack_require__(66);
	__webpack_require__(67);
	__webpack_require__(68);
	module.exports = __webpack_require__(12).Symbol;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(11)
	  , has            = __webpack_require__(26)
	  , DESCRIPTORS    = __webpack_require__(20)
	  , $export        = __webpack_require__(10)
	  , redefine       = __webpack_require__(25)
	  , META           = __webpack_require__(56).KEY
	  , $fails         = __webpack_require__(21)
	  , shared         = __webpack_require__(40)
	  , setToStringTag = __webpack_require__(44)
	  , uid            = __webpack_require__(41)
	  , wks            = __webpack_require__(45)
	  , wksExt         = __webpack_require__(52)
	  , wksDefine      = __webpack_require__(57)
	  , keyOf          = __webpack_require__(58)
	  , enumKeys       = __webpack_require__(59)
	  , isArray        = __webpack_require__(62)
	  , anObject       = __webpack_require__(17)
	  , toIObject      = __webpack_require__(33)
	  , toPrimitive    = __webpack_require__(23)
	  , createDesc     = __webpack_require__(24)
	  , _create        = __webpack_require__(29)
	  , gOPNExt        = __webpack_require__(63)
	  , $GOPD          = __webpack_require__(65)
	  , $DP            = __webpack_require__(16)
	  , $keys          = __webpack_require__(31)
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
	  __webpack_require__(64).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(61).f  = $propertyIsEnumerable;
	  __webpack_require__(60).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(9)){
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(15)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 56 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(41)('meta')
	  , isObject = __webpack_require__(18)
	  , has      = __webpack_require__(26)
	  , setDesc  = __webpack_require__(16).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(21)(function(){
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
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(11)
	  , core           = __webpack_require__(12)
	  , LIBRARY        = __webpack_require__(9)
	  , wksExt         = __webpack_require__(52)
	  , defineProperty = __webpack_require__(16).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(31)
	  , toIObject = __webpack_require__(33);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(31)
	  , gOPS    = __webpack_require__(60)
	  , pIE     = __webpack_require__(61);
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
/* 60 */
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 61 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(35);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(33)
	  , gOPN      = __webpack_require__(64).f
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
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(32)
	  , hiddenKeys = __webpack_require__(42).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(61)
	  , createDesc     = __webpack_require__(24)
	  , toIObject      = __webpack_require__(33)
	  , toPrimitive    = __webpack_require__(23)
	  , has            = __webpack_require__(26)
	  , IE8_DOM_DEFINE = __webpack_require__(19)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(20) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 66 */
/***/ (function(module, exports) {

	

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(57)('asyncIterator');

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(57)('observable');

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(70), __esModule: true };

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(71);
	module.exports = __webpack_require__(12).Object.keys;

/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(47)
	  , $keys    = __webpack_require__(31);

	__webpack_require__(72)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 72 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(10)
	  , core    = __webpack_require__(12)
	  , fails   = __webpack_require__(21);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 73 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(74), __esModule: true };

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(75);
	var $Object = __webpack_require__(12).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(10)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(29)});

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(77), __esModule: true };

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	var core  = __webpack_require__(12)
	  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
	module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
	  return $JSON.stringify.apply($JSON, arguments);
	};

/***/ }),
/* 78 */,
/* 79 */,
/* 80 */,
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(35)
	  , TAG = __webpack_require__(45)('toStringTag')
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
/* 82 */,
/* 83 */,
/* 84 */,
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(81)
	  , ITERATOR  = __webpack_require__(45)('iterator')
	  , Iterators = __webpack_require__(27);
	module.exports = __webpack_require__(12).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(87), __esModule: true };

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(88);
	var $Object = __webpack_require__(12).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(10);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(20), 'Object', {defineProperty: __webpack_require__(16).f});

/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(90), __esModule: true };

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(4);
	__webpack_require__(91);
	module.exports = __webpack_require__(12).Array.from;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(13)
	  , $export        = __webpack_require__(10)
	  , toObject       = __webpack_require__(47)
	  , call           = __webpack_require__(92)
	  , isArrayIter    = __webpack_require__(93)
	  , toLength       = __webpack_require__(37)
	  , createProperty = __webpack_require__(94)
	  , getIterFn      = __webpack_require__(85);

	$export($export.S + $export.F * !__webpack_require__(95)(function(iter){ Array.from(iter); }), 'Array', {
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
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(17);
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
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(27)
	  , ITERATOR   = __webpack_require__(45)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(16)
	  , createDesc      = __webpack_require__(24);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(45)('iterator')
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
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(97);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(98);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _Utils = __webpack_require__(99);

	var _Utils2 = _interopRequireDefault(_Utils);

	var _Properties = __webpack_require__(108);

	var _Properties2 = _interopRequireDefault(_Properties);

	var _Diff = __webpack_require__(110);

	var _Diff2 = _interopRequireDefault(_Diff);

	var _WxVirtualText = __webpack_require__(115);

	var _WxVirtualText2 = _interopRequireDefault(_WxVirtualText);

	__webpack_require__(107);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var WxVirtualNode = function () {
	  function WxVirtualNode(tagName, props, newProps, wxKey, wxVkey, children) {
	    (0, _classCallCheck3.default)(this, WxVirtualNode);

	    this.tagName = tagName || 'div';
	    this.props = props || {};
	    this.children = children || [];
	    this.newProps = newProps || [];
	    this.wxVkey = wxVkey;
	    _Utils2.default.isUndefined(wxKey) ? this.wxKey = void 0 : this.wxKey = String(wxKey);
	    this.descendants = 0; //子节点数
	    for (var c = 0; c < this.children.length; ++c) {
	      var child = this.children[c];
	      if (_Utils2.default.isVirtualNode(child)) {
	        this.descendants += child.descendants;
	      } else {
	        if (_Utils2.default.isString(child)) {
	          this.children[c] = new _WxVirtualText2.default(child);
	        } else {
	          _Utils2.default.isVirtualText(child) || console.log('invalid child', tagName, props, children, child);
	        }
	      }
	      ++this.descendants;
	    }
	  }

	  (0, _createClass3.default)(WxVirtualNode, [{
	    key: 'render',
	    value: function render() {
	      var ele = this.tagName !== 'virtual' ? exparser.createElement(this.tagName) : exparser.VirtualNode.create('virtual');

	      _Properties2.default.applyProperties(ele, this.props);

	      this.children.forEach(function (child) {
	        var dom = child.render();
	        ele.appendChild(dom);
	      });

	      return ele;
	    }
	  }, {
	    key: 'diff',
	    value: function diff(newNode) {
	      return _Diff2.default.diff(this, newNode);
	    }
	  }]);
	  return WxVirtualNode;
	}();

	WxVirtualNode.prototype.type = 'WxVirtualNode';

	exports.default = WxVirtualNode;

/***/ }),
/* 97 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(86);

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
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _typeof2 = __webpack_require__(1);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _getPrototypeOf = __webpack_require__(100);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _assign = __webpack_require__(103);

	var _assign2 = _interopRequireDefault(_assign);

	var _Enums = __webpack_require__(107);

	var _Enums2 = _interopRequireDefault(_Enums);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var objAssign = _assign2.default || function (originObj) {
	  for (var idx = 1; idx < arguments.length; idx++) {
	    var argObj = arguments[idx];
	    for (var arg in argObj) {
	      Object.prototype.hasOwnProperty.call(argObj, arg) && (originObj[arg] = argObj[arg]);
	    }
	  }
	  return originObj;
	};

	var isString = function isString(target) {
	  return Object.prototype.toString.call(target) === '[object String]';
	};

	var isIphone = navigator.userAgent.match('iPhone');
	var screenWidth = window.screen.width || 375;
	var devicePixelRatio = window.devicePixelRatio || 2;
	var SMALL_NUM = 1e-4;
	var rpxToPxNum = function rpxToPxNum(rpxNum) {
	  rpxNum = rpxNum / _Enums2.default.BASE_DEVICE_WIDTH * screenWidth;
	  rpxNum = Math.floor(rpxNum + SMALL_NUM);
	  return rpxNum === 0 ? devicePixelRatio !== 1 && isIphone ? 0.5 : 1 : rpxNum;
	};
	var parseRpx = function parseRpx(matches) {
	  var num = 0,
	      decimalRadix = 1,
	      isHandlingDecimal = !1,
	      isNeg = !1,
	      idx = 0;
	  for (; idx < matches.length; ++idx) {
	    var ch = matches[idx];
	    if (ch >= '0' && ch <= '9') {
	      if (isHandlingDecimal) {
	        decimalRadix *= 0.1;
	        num += (ch - '0') * decimalRadix;
	      } else {
	        num = 10 * num + (ch - '0');
	      }
	    } else {
	      ch === '.' ? isHandlingDecimal = !0 : ch === '-' && (isNeg = !0);
	    }
	  }
	  isNeg && (num = -num);
	  return rpxToPxNum(num);
	};
	var rpxInTemplate = /%%\?[+-]?\d+(\.\d+)?rpx\?%%/g;
	var rpxInCSS = /(:|\s)[+-]?\d+(\.\d+)?rpx/g;

	exports.default = {
	  isString: isString,
	  isArray: function isArray(target) {
	    return Array.isArray ? Array.isArray(target) : Object.prototype.toString.call(target) === '[object Array]';
	  },
	  getPrototype: function getPrototype(obj) {
	    return _getPrototypeOf2.default ? (0, _getPrototypeOf2.default)(obj) : obj.__proto__ ? obj.__proto__ : obj.constructor ? obj.constructor.prototype : void 0;
	  },
	  isObject: function isObject(obj) {
	    return (typeof obj === 'undefined' ? 'undefined' : (0, _typeof3.default)(obj)) === 'object' && obj !== null;
	  },
	  isEmptyObject: function isEmptyObject(obj) {
	    for (var key in obj) {
	      return !1;
	    }
	    return !0;
	  },
	  isVirtualNode: function isVirtualNode(node) {
	    return node && node.type === 'WxVirtualNode';
	  },
	  isVirtualText: function isVirtualText(node) {
	    return node && node.type === 'WxVirtualText';
	  },
	  isUndefined: function isUndefined(obj) {
	    return Object.prototype.toString.call(obj) === '[object Undefined]';
	  },
	  transformRpx: function transformRpx(propValue, isInCSS) {
	    if (!isString(propValue)) return propValue;
	    var matches = void 0;
	    matches = isInCSS ? propValue.match(rpxInCSS) : propValue.match(rpxInTemplate);
	    matches && matches.forEach(function (match) {
	      var pxNum = parseRpx(match);
	      var cssValue = (isInCSS ? match[0] : '') + pxNum + 'px';
	      propValue = propValue.replace(match, cssValue);
	    });
	    return propValue;
	  },
	  uuid: function uuid() {
	    var uuidPart = function uuidPart() {
	      return Math.floor(65536 * (1 + Math.random())).toString(16).substring(1);
	    };
	    return uuidPart() + uuidPart() + '-' + uuidPart() + '-' + uuidPart() + '-' + uuidPart() + '-' + uuidPart() + uuidPart() + uuidPart();
	  },
	  getDataType: function getDataType(obj) {
	    return Object.prototype.toString.call(obj).split(' ')[1].split(']')[0];
	  },
	  getPageConfig: function getPageConfig() {
	    var configs = {};
	    if (window.__wxConfig && window.__wxConfig.window) {
	      configs = window.__wxConfig.window;
	    } else {
	      var globConfig = {};
	      window.__wxConfig && window.__wxConfig.global && window.__wxConfig.global.window && (globConfig = window.__wxConfig.global.window);

	      var pageConfig = {};
	      window.__wxConfig && window.__wxConfig.page && window.__wxConfig.page[window.__route__] && window.__wxConfig.page[window.__route__].window && (pageConfig = window.__wxConfig.page[window.__route__].window);
	      configs = objAssign({}, globConfig, pageConfig);
	    }
	    return configs;
	  }
	};

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(101), __esModule: true };

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(102);
	module.exports = __webpack_require__(12).Object.getPrototypeOf;

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(47)
	  , $getPrototypeOf = __webpack_require__(46);

	__webpack_require__(72)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(104), __esModule: true };

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(105);
	module.exports = __webpack_require__(12).Object.assign;

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(10);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(106)});

/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(31)
	  , gOPS     = __webpack_require__(60)
	  , pIE      = __webpack_require__(61)
	  , toObject = __webpack_require__(47)
	  , IObject  = __webpack_require__(34)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(21)(function(){
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
/* 107 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = {
	  PATCH_TYPE: {
	    NONE: 0,
	    TEXT: 1,
	    VNODE: 2,
	    PROPS: 3,
	    REORDER: 4,
	    INSERT: 5,
	    REMOVE: 6
	  },
	  WX_KEY: 'wxKey',
	  ATTRIBUTE_NAME: ['class', 'style'],
	  RPX_RATE: 20,
	  BASE_DEVICE_WIDTH: 750,
	  INLINE_STYLE: ['placeholderStyle', 'hoverStyle', 'style']
	};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _create = __webpack_require__(73);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(1);

	var _typeof3 = _interopRequireDefault(_typeof2);

	var _keys = __webpack_require__(69);

	var _keys2 = _interopRequireDefault(_keys);

	var _Utils = __webpack_require__(99);

	var _Utils2 = _interopRequireDefault(_Utils);

	var _Enums = __webpack_require__(107);

	var _Enums2 = _interopRequireDefault(_Enums);

	var _PropNameConverter = __webpack_require__(109);

	var _PropNameConverter2 = _interopRequireDefault(_PropNameConverter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var dataPrefixReg = /^data-/;

	function removeProperty(ele, props) {
	  var hasProp = exparser.Component.hasProperty(ele, props);
	  if (hasProp) {
	    ele[props] = void 0;
	  } else {
	    if (props.slice(0, 4) === 'bind') {
	      addEventHandler(ele, props.slice(4), '');
	    } else {
	      if (props.slice(0, 5) === 'catch') {
	        addEventHandler(ele, props.slice(5), '', !0);
	      } else {
	        if (props.slice(0, 2) === 'on') {
	          addEventHandler(ele, props.slice(2), '');
	        } else {
	          if (_Enums2.default.ATTRIBUTE_NAME.indexOf(props) !== -1 || dataPrefixReg.test(props)) {
	            ele.$$.removeAttribute(props);
	          }
	        }
	      }
	    }
	  }
	}
	//设置ele属性
	function applyProperties(ele, props) {
	  ele.dataset = ele.dataset || {};

	  var _loop = function _loop(propName) {
	    var propValue = props[propName],
	        propExist = exparser.Component.hasProperty(ele, propName);
	    if (/^data-/.test(propName)) {
	      var convertedPropName = _PropNameConverter2.default.dashToCamelCase(propName.substring(5).toLowerCase());
	      ele.dataset[convertedPropName] = propValue;
	    }

	    if (void 0 === propValue) {
	      removeProperty(ele, propName);
	    } else {
	      if (propExist) {
	        if (_Enums2.default.INLINE_STYLE.indexOf(propName) !== -1) {
	          ele[propName] = _Utils2.default.transformRpx(propValue, !0);
	        } else {
	          ele[propName] = propValue;
	        }
	      } else {
	        if (propName.slice(0, 4) === 'bind') {
	          addEventHandler(ele, propName.slice(4), propValue);
	        } else {
	          if (propName.slice(0, 5) === 'catch') {
	            addEventHandler(ele, propName.slice(5), propValue, !0);
	          } else {
	            if (propName.slice(0, 2) === 'on') {
	              addEventHandler(ele, propName.slice(2), propValue);
	            } else {
	              var isElementAttribute = _Enums2.default.ATTRIBUTE_NAME.indexOf(propName) !== -1 || dataPrefixReg.test(propName);
	              if (isElementAttribute) {
	                if (propName === 'style') {
	                  !function () {
	                    var animationStyle = ele.animationStyle || {},
	                        transition = animationStyle.transition,
	                        transform = animationStyle.transform,
	                        transitionProperty = animationStyle.transitionProperty,
	                        transformOrigin = animationStyle.transformOrigin,
	                        cssAttributes = {
	                      transition: transition,
	                      transform: transform,
	                      transitionProperty: transitionProperty,
	                      transformOrigin: transformOrigin
	                    };
	                    cssAttributes['-webkit-transition'] = cssAttributes.transition;
	                    cssAttributes['-webkit-transform'] = cssAttributes.transform;
	                    cssAttributes['-webkit-transition-property'] = cssAttributes.transitionProperty;
	                    cssAttributes['-webkit-transform-origin'] = cssAttributes.transformOrigin;

	                    var refinedAttrs = (0, _keys2.default)(cssAttributes).filter(function (attribute) {
	                      return !(/transform|transition/i.test(attribute) && cssAttributes[attribute] === '' || attribute.trim() === '' || void 0 === cssAttributes[attribute] || cssAttributes[attribute] === '' || !isNaN(parseInt(attribute)));
	                    }).map(function (attr) {
	                      var dashedProp = attr.replace(/([A-Z]{1})/g, function (str) {
	                        return '-' + str.toLowerCase();
	                      });
	                      return dashedProp + ':' + cssAttributes[attr];
	                    }).join(';');

	                    ele.$$.setAttribute(propName, _Utils2.default.transformRpx(propValue, !0) + refinedAttrs);
	                  }();
	                } else {
	                  ele.$$.setAttribute(propName, propValue);
	                }
	              } else {
	                var isAnimationProp = propName === 'animation' && (typeof propValue === 'undefined' ? 'undefined' : (0, _typeof3.default)(propValue)) === 'object';
	                var isPropHasActions = propValue.actions && propValue.actions.length > 0;
	                if (isAnimationProp && isPropHasActions) {
	                  !function () {
	                    var execAnimationAction = function execAnimationAction() {
	                      if (turns < actonsLen) {
	                        var styles = wx.animationToStyle(actons[turns]),
	                            transition = styles.transition,
	                            transitionProperty = styles.transitionProperty,
	                            transform = styles.transform,
	                            transformOrigin = styles.transformOrigin,
	                            style = styles.style;
	                        ele.$$.style.transition = transition;
	                        ele.$$.style.transitionProperty = transitionProperty;
	                        ele.$$.style.transform = transform;
	                        ele.$$.style.transformOrigin = transformOrigin;
	                        ele.$$.style.webkitTransition = transition;
	                        ele.$$.style.webkitTransitionProperty = transitionProperty;
	                        ele.$$.style.webkitTransform = transform;
	                        ele.$$.style.webkitTransformOrigin = transformOrigin;
	                        for (var idx in style) {
	                          ele.$$.style[idx] = _Utils2.default.transformRpx(' ' + style[idx], !0);
	                        }

	                        ele.animationStyle = {
	                          transition: transition,
	                          transform: transform,
	                          transitionProperty: transitionProperty,
	                          transformOrigin: transformOrigin
	                        };
	                      }
	                    };
	                    var turns = 0;
	                    var actons = propValue.actions;
	                    var actonsLen = propValue.actions.length;

	                    ele.addListener('transitionend', function () {
	                      turns += 1, execAnimationAction();
	                    });
	                    execAnimationAction();
	                  }();
	                }
	              }
	            }
	          }
	        }
	      }
	    }
	  };

	  for (var propName in props) {
	    _loop(propName);
	  }
	}

	var getEleInfo = function getEleInfo(ele) {
	  return {
	    id: ele.id,
	    offsetLeft: ele.$$.offsetLeft,
	    offsetTop: ele.$$.offsetTop,
	    dataset: ele.dataset
	  };
	};
	var getTouchInfo = function getTouchInfo(touches) {
	  if (touches) {
	    var touchInfo = [],
	        idx = 0;
	    for (; idx < touches.length; idx++) {
	      var touch = touches[idx];
	      touchInfo.push({
	        identifier: touch.identifier,
	        pageX: touch.pageX,
	        pageY: touch.pageY,
	        clientX: touch.clientX,
	        clientY: touch.clientY
	      });
	    }
	    return touchInfo;
	  }
	};
	//事件绑定
	var addEventHandler = function addEventHandler(ele, eventName, pageEventName, useCapture) {
	  ele.__wxEventHandleName || (ele.__wxEventHandleName = (0, _create2.default)(null));
	  void 0 === ele.__wxEventHandleName[eventName] && ele.addListener(eventName, function (event) {
	    if (ele.__wxEventHandleName[eventName]) {
	      window.wx.publishPageEvent(ele.__wxEventHandleName[eventName], {
	        type: event.type,
	        timeStamp: event.timeStamp,
	        target: getEleInfo(event.target),
	        currentTarget: getEleInfo(this),
	        detail: event.detail,
	        touches: getTouchInfo(event.touches),
	        changedTouches: getTouchInfo(event.changedTouches)
	      });
	      return !useCapture && void 0;
	    }
	  });
	  ele.__wxEventHandleName[eventName] = pageEventName;
	};

	exports.default = {
	  removeProperty: removeProperty,
	  applyProperties: applyProperties
	};

/***/ }),
/* 109 */
/***/ (function(module, exports) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	var cache = {};
	var regexDict = {
	  dashToCamel: /-[a-z]/g,
	  camelToDash: /([A-Z])/g
	};

	var dashToCamelCase = function dashToCamelCase(str) {
	  if (cache[str]) {
	    return cache[str];
	  } else {
	    if (str.indexOf('-') <= 0) {
	      cache[str] = str;
	    } else {
	      cache[str] = str.replace(regexDict.dashToCamel, function (match) {
	        return match[1].toUpperCase();
	      });
	    }
	    return cache[str];
	  }
	};

	var camelToDashCase = function camelToDashCase(str) {
	  return cache[str] || (cache[str] = str.replace(regexDict.camelToDash, '-$1').toLowerCase());
	};

	exports.default = {
	  dashToCamelCase: dashToCamelCase,
	  camelToDashCase: camelToDashCase
	};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _VPatch = __webpack_require__(111);

	var _VPatch2 = _interopRequireDefault(_VPatch);

	var _Patch = __webpack_require__(112);

	var _Patch2 = _interopRequireDefault(_Patch);

	var _Utils = __webpack_require__(99);

	var _Utils2 = _interopRequireDefault(_Utils);

	var _ListDiff = __webpack_require__(114);

	var _ListDiff2 = _interopRequireDefault(_ListDiff);

	var _Enums = __webpack_require__(107);

	var _Enums2 = _interopRequireDefault(_Enums);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var diff = function diff(oriEle, newEle) {
	  var patches = {};
	  diffNode(oriEle, newEle, patches, 0);
	  return new _Patch2.default(oriEle, patches);
	};

	var diffNode = function diffNode(oriEle, newEle, patches, index) {
	  if (oriEle !== newEle) {
	    var patch = patches[index];
	    if (newEle == null) {
	      patch = appendPatch(patch, new _VPatch2.default(_Enums2.default.PATCH_TYPE.REMOVE, oriEle));
	    } else if (_Utils2.default.isVirtualNode(newEle)) {
	      if (_Utils2.default.isVirtualNode(oriEle)) {
	        if (oriEle.tagName === newEle.tagName && oriEle.wxKey === newEle.wxKey) {
	          if (oriEle.tagName === 'virtual' && oriEle.wxVkey !== newEle.wxVkey) {
	            patch = appendPatch(patch, new _VPatch2.default(_Enums2.default.PATCH_TYPE.VNODE, oriEle, newEle));
	          } else {
	            var propPatches = diffProps(newEle.props, newEle.newProps);
	            propPatches && (patch = appendPatch(patch, new _VPatch2.default(_Enums2.default.PATCH_TYPE.PROPS, oriEle, propPatches)));
	            patch = diffChildren(oriEle, newEle, patches, patch, index);
	          }
	        } else {
	          patch = appendPatch(patch, new _VPatch2.default(_Enums2.default.PATCH_TYPE.VNODE, oriEle, newEle));
	        }
	      } else {
	        patch = appendPatch(patch, new _VPatch2.default(_Enums2.default.PATCH_TYPE.VNODE, oriEle, newEle));
	      }
	    } else {
	      if (!_Utils2.default.isVirtualText(newEle)) {
	        console.log('unknow node type', oriEle, newEle);
	        throw {
	          message: 'unknow node type',
	          node: newEle
	        };
	      }
	      newEle.text !== oriEle.text && (patch = appendPatch(patch, new _VPatch2.default(_Enums2.default.PATCH_TYPE.TEXT, oriEle, newEle)));
	    }
	    patch && (patches[index] = patch);
	  }
	};

	var diffChildren = function diffChildren(old, newEle, patches, patch, index) {
	  var oldChildren = old.children;
	  var orderedSet = _ListDiff2.default.listDiff(oldChildren, newEle.children);
	  var newChildren = orderedSet.children;
	  var len = oldChildren.length > newChildren.length ? oldChildren.length : newChildren.length;
	  var idx = 0;
	  for (; idx < len; ++idx) {
	    var oldChild = oldChildren[idx],
	        newChild = newChildren[idx];
	    ++index;

	    if (oldChild) {
	      diffNode(oldChild, newChild, patches, index);
	    } else {
	      if (newChild) {
	        patch = appendPatch(patch, new _VPatch2.default(_Enums2.default.PATCH_TYPE.INSERT, oldChild, newChild));
	      }
	    }
	    _Utils2.default.isVirtualNode(oldChild) && (index += oldChild.descendants);
	  }
	  orderedSet.moves && (patch = appendPatch(patch, new _VPatch2.default(_Enums2.default.PATCH_TYPE.REORDER, old, orderedSet.moves)));
	  return patch;
	};
	//设置属性
	var diffProps = function diffProps(props, propKeys) {
	  var tempObj = {};
	  for (var key in propKeys) {
	    var propName = propKeys[key];
	    tempObj[propName] = props[propName];
	  }
	  return _Utils2.default.isEmptyObject(tempObj) ? void 0 : tempObj;
	};
	//将newPatch加入到patches数组
	var appendPatch = function appendPatch(patches, newPatch) {
	  if (patches) {
	    patches.push(newPatch);
	    return patches;
	  } else {
	    return [newPatch];
	  }
	};

	exports.default = {
	  diff: diff,
	  diffChildren: diffChildren,
	  diffNode: diffNode,
	  diffProps: diffProps,
	  appendPatch: appendPatch
	};

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(97);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(98);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _Properties = __webpack_require__(108);

	var _Properties2 = _interopRequireDefault(_Properties);

	var _Enums = __webpack_require__(107);

	var _Enums2 = _interopRequireDefault(_Enums);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var VPatch = function () {
	  function VPatch(type, vNode, patch) {
	    (0, _classCallCheck3.default)(this, VPatch);

	    this.type = Number(type);
	    this.vNode = vNode;
	    this.patch = patch;
	  }

	  (0, _createClass3.default)(VPatch, [{
	    key: 'apply',
	    value: function apply(node) {
	      switch (this.type) {
	        case _Enums2.default.PATCH_TYPE.TEXT:
	          return VPatch.stringPatch(node, this.patch);
	        case _Enums2.default.PATCH_TYPE.VNODE:
	          return VPatch.vNodePatch(node, this.patch);
	        case _Enums2.default.PATCH_TYPE.PROPS:
	          return VPatch.applyProperties(node, this.patch, this.vNode.props);
	        case _Enums2.default.PATCH_TYPE.REORDER:
	          return VPatch.reorderChildren(node, this.patch);
	        case _Enums2.default.PATCH_TYPE.INSERT:
	          return VPatch.insertNode(node, this.patch);
	        case _Enums2.default.PATCH_TYPE.REMOVE:
	          return VPatch.removeNode(node);
	        default:
	          return node;
	      }
	    }
	  }], [{
	    key: 'stringPatch',
	    value: function stringPatch(node, patch) {
	      var parent = node.parentNode;
	      var newEle = patch.render();
	      parent && newEle !== node && parent.replaceChild(newEle, node);
	      return newEle;
	    }
	  }, {
	    key: 'vNodePatch',
	    value: function vNodePatch(node, patch) {
	      var parent = node.parentNode;
	      var newEle = patch.render();
	      parent && newEle !== node && parent.replaceChild(newEle, node);
	      return newEle;
	    }
	  }, {
	    key: 'applyProperties',
	    value: function applyProperties(node, patch, prop) {
	      _Properties2.default.applyProperties(node, patch, prop);
	      return node;
	    }
	  }, {
	    key: 'reorderChildren',
	    value: function reorderChildren(node, moves) {
	      var removes = moves.removes;
	      var inserts = moves.inserts;
	      var childNodes = node.childNodes;
	      var removedChildren = {};

	      removes.forEach(function (remove) {
	        var childNode = childNodes[remove.index];
	        remove.key && (removedChildren[remove.key] = childNode);
	        node.removeChild(childNode);
	      });

	      inserts.forEach(function (insert) {
	        var childNode = removedChildren[insert.key];
	        node.insertBefore(childNode, childNodes[insert.index]);
	      });

	      return node;
	    }
	  }, {
	    key: 'insertNode',
	    value: function insertNode(node, patch) {
	      var newEle = patch.render();
	      node && node.appendChild(newEle);
	      return node;
	    }
	  }, {
	    key: 'removeNode',
	    value: function removeNode(node) {
	      var parent = node.parentNode;
	      parent && parent.removeChild(node);
	      return null;
	    }
	  }]);
	  return VPatch;
	}();

	exports.default = VPatch;

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(69);

	var _keys2 = _interopRequireDefault(_keys);

	var _classCallCheck2 = __webpack_require__(97);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(98);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _DomIndex = __webpack_require__(113);

	var _DomIndex2 = _interopRequireDefault(_DomIndex);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Patch = function () {
	  function Patch(oldTree, patches) {
	    (0, _classCallCheck3.default)(this, Patch);

	    this.oldTree = oldTree;
	    this.patches = patches;
	    this.patchIndexes = (0, _keys2.default)(this.patches).map(function (idx) {
	      return Number(idx);
	    });
	  }

	  (0, _createClass3.default)(Patch, [{
	    key: 'apply',
	    value: function apply(rootNode) {
	      var that = this;
	      if (this.patchIndexes.length === 0) return rootNode;

	      var domIndex = _DomIndex2.default.getDomIndex(rootNode, this.oldTree, this.patchIndexes);

	      this.patchIndexes.forEach(function (patchIdx) {
	        var dom = domIndex[patchIdx];
	        if (dom) {
	          var patches = that.patches[patchIdx];
	          patches.forEach(function (vpatch) {
	            vpatch.apply(dom);
	          });
	        }
	      });
	      return rootNode;
	    }
	  }]);
	  return Patch;
	}();

	exports.default = Patch;

/***/ }),
/* 113 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	//通过遍历tree找出patchIndexs中相应索引对应的node,返回nodes
	var getDomIndex = function getDomIndex(rootNode, tree, patchIndexs) {
	  if (patchIndexs && patchIndexs.length != 0) {
	    patchIndexs = patchIndexs.sort(function (a, b) {
	      return a - b;
	    });
	    var nodes = {}; // real dom <-> vdom : key = nodeindex, value = real node
	    mapIndexToDom(rootNode, tree, patchIndexs, nodes, 0);
	    return nodes;
	  }
	  return {};
	};

	var mapIndexToDom = function mapIndexToDom(realDomRootNode, vDomRootNode, patchIndexs, nodes, rootIndex) {
	  if (realDomRootNode) {
	    // real place to add node to maps
	    oneOfIndexesInRange(patchIndexs, rootIndex, rootIndex) && (nodes[rootIndex] = realDomRootNode);
	    var vDomChildren = vDomRootNode.children;
	    if (vDomChildren) {
	      var realDomChildren = realDomRootNode.childNodes,
	          idx = 0;
	      for (; idx < vDomChildren.length; ++idx) {
	        var vChild = vDomChildren[idx];
	        ++rootIndex;
	        var lastIndex = rootIndex + (vChild.descendants || 0);
	        oneOfIndexesInRange(patchIndexs, rootIndex, lastIndex) && mapIndexToDom(realDomChildren[idx], vChild, patchIndexs, nodes, rootIndex);
	        rootIndex = lastIndex;
	      }
	    }
	  }
	};

	// Binary search for an index in the interval [left, right]
	var oneOfIndexesInRange = function oneOfIndexesInRange(indices, left, right) {
	  var index = 0,
	      length = indices.length - 1;
	  for (; index <= length;) {
	    var pivotKey = length + index >> 1,
	        pivotValue = indices[pivotKey];
	    if (pivotValue < left) {
	      index = pivotKey + 1;
	    } else {
	      if (!(pivotValue > right)) return !0;
	      length = pivotKey - 1;
	    }
	  }
	  return !1;
	};

	exports.default = { getDomIndex: getDomIndex, mapIndexToDom: mapIndexToDom, oneOfIndexesInRange: oneOfIndexesInRange };

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Utils = __webpack_require__(99);

	var _Utils2 = _interopRequireDefault(_Utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// a for old, b for new
	var listDiff = function listDiff(aChildren, bChildren) {
	  function remove(arr, index, key) {
	    arr.splice(index, 1);
	    return {
	      index: index,
	      key: key
	    };
	  }

	  var aChildIndex = makeKeyAndFreeIndexes(aChildren);
	  var aKeys = aChildIndex.keyIndexes;

	  // remove original child if it has no keyed child
	  if (_Utils2.default.isEmptyObject(aKeys)) {
	    return {
	      children: bChildren,
	      moves: null
	    };
	  }

	  var bChildIndex = makeKeyAndFreeIndexes(bChildren);
	  var bKeys = bChildIndex.keyIndexes;
	  var bFree = bChildIndex.freeIndexes;

	  // remove original child if newChild has no keyed child
	  if (_Utils2.default.isEmptyObject(bKeys)) {
	    return {
	      children: bChildren,
	      moves: null
	    };
	  }

	  var newChildren = [];
	  var freeIndex = 0;
	  var deletedItems = 0;

	  // Iterate through oldChs and match oldChs node in newChs
	  // O(N) time
	  for (var idx = 0; idx < aChildren.length; ++idx) {
	    var aItem = aChildren[idx];
	    var aItemKey = getItemKey(aItem);
	    if (aItemKey) {
	      if (bKeys.hasOwnProperty(aItemKey)) {
	        // Match up the old keys
	        var itemIndex = bKeys[aItemKey];
	        newChildren.push(bChildren[itemIndex]);
	      } else {
	        // Remove old keyed items
	        ++deletedItems;
	        newChildren.push(null);
	      }
	    } else if (freeIndex < bFree.length) {
	      // Match the item in a with the next free item in b
	      var _itemIndex = bFree[freeIndex];
	      newChildren.push(bChildren[_itemIndex]);
	      ++freeIndex;
	    } else {
	      // There are no free items in b to match with
	      // the free items in a, so the extra free nodes
	      // are deleted.
	      ++deletedItems;
	      newChildren.push(null);
	    }
	  }

	  var lastFreeIndex = bFree[freeIndex] || bChildren.length;

	  // Iterate through b and append any new keys
	  // O(M) time
	  for (var _idx = 0; _idx < bChildren.length; ++_idx) {
	    var newItem = bChildren[_idx],
	        bItemKey = getItemKey(newItem);
	    if (bItemKey) {
	      aKeys.hasOwnProperty(bItemKey) || newChildren.push(newItem);
	    } else if (_idx >= lastFreeIndex) {
	      newChildren.push(newItem);
	    }
	  }

	  var simulate = newChildren.slice(0);
	  var simulateIndex = 0;
	  var removes = [];
	  var inserts = [];

	  for (var _idx2 = 0; _idx2 < bChildren.length;) {
	    var wantedItem = bChildren[_idx2];
	    var bKeyOfWantedItem = getItemKey(wantedItem);

	    var simulateItem = simulate[simulateIndex];
	    var copyKeyOfSimulateItem = getItemKey(simulateItem);

	    // remove items
	    for (; simulateItem === null;) {
	      // if null remove it
	      removes.push(remove(simulate, simulateIndex, copyKeyOfSimulateItem));

	      // update simulateItem info
	      simulateItem = simulate[simulateIndex];
	      copyKeyOfSimulateItem = getItemKey(simulateItem);
	    }

	    if (copyKeyOfSimulateItem === bKeyOfWantedItem) {
	      ++simulateIndex;
	      ++_idx2;
	    } else {
	      // if we need a key in this position...
	      if (bKeyOfWantedItem) {
	        if (copyKeyOfSimulateItem) {
	          if (bKeys[copyKeyOfSimulateItem] === _idx2 + 1) {
	            inserts.push({
	              key: bKeyOfWantedItem,
	              index: _idx2
	            });
	          } else {
	            // if an insert doesn't put this key in place, it needs to move
	            removes.push(remove(simulate, simulateIndex, copyKeyOfSimulateItem));
	            simulateItem = simulate[simulateIndex];

	            // items are matching, so skip ahead
	            if (simulateItem && getItemKey(simulateItem) === bKeyOfWantedItem) {
	              ++simulateIndex;
	            } else {
	              // if the remove didn't put the wanted item in place, we need to insert it
	              inserts.push({
	                key: bKeyOfWantedItem,
	                index: _idx2
	              });
	            }
	          }
	        } else {
	          // insert a keyed wanted item
	          inserts.push({
	            key: bKeyOfWantedItem,
	            index: _idx2
	          });
	          ++_idx2;
	        }
	      } else {
	        // a key in simulate has no matching wanted key, remove it
	        removes.push(remove(simulate, simulateIndex, copyKeyOfSimulateItem));

	        // simulateItem will update at the beginning of  next iteration
	      }
	    }
	  }

	  // remove all the remaining nodes from simulate
	  for (; simulateIndex < simulate.length;) {
	    var _simulateItem = simulate[simulateIndex];
	    var itemKey = getItemKey(_simulateItem);
	    removes.push(remove(simulate, simulateIndex, itemKey));
	  }

	  if (removes.length === deletedItems && inserts.length == 0) {
	    return {
	      children: newChildren,
	      moves: null
	    };
	  } else {
	    return {
	      children: newChildren,
	      moves: {
	        removes: removes,
	        inserts: inserts
	      }
	    };
	  }
	};

	var makeKeyAndFreeIndexes = function makeKeyAndFreeIndexes(children) {
	  var keyIndexes = {},
	      freeIndexes = [];
	  for (var idx = 0; idx < children.length; ++idx) {
	    var child = children[idx];
	    var itemKeyOfChild = getItemKey(child);
	    itemKeyOfChild ? keyIndexes[itemKeyOfChild] = idx : freeIndexes.push(idx);
	  }
	  return {
	    keyIndexes: keyIndexes,
	    freeIndexes: freeIndexes
	  };
	};

	var getItemKey = function getItemKey(ele) {
	  if (ele) return ele.wxKey;
	};

	exports.default = {
	  listDiff: listDiff,
	  makeKeyAndFreeIndexes: makeKeyAndFreeIndexes,
	  getItemKey: getItemKey
	};

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _classCallCheck2 = __webpack_require__(97);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(98);

	var _createClass3 = _interopRequireDefault(_createClass2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var wxVirtualText = function () {
	  function wxVirtualText(txt) {
	    (0, _classCallCheck3.default)(this, wxVirtualText);

	    this.text = String(txt);
	  }

	  (0, _createClass3.default)(wxVirtualText, [{
	    key: 'render',
	    value: function render(global) {
	      var parser = global ? global.document || exparser : exparser;
	      return parser.createTextNode(this.text);
	    }
	  }]);
	  return wxVirtualText;
	}();

	wxVirtualText.prototype.type = 'WxVirtualText';

	exports.default = wxVirtualText;

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _stringify = __webpack_require__(76);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _classCallCheck2 = __webpack_require__(97);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(98);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _objPath = __webpack_require__(117);

	var _objPath2 = _interopRequireDefault(_objPath);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var data = {};

	var AppData = function () {
	  function AppData() {
	    (0, _classCallCheck3.default)(this, AppData);
	  }

	  (0, _createClass3.default)(AppData, null, [{
	    key: 'getAppData',
	    value: function getAppData() {
	      return data;
	    }
	  }, {
	    key: 'mergeData',
	    value: function mergeData(originObj, anotherObj) {
	      var originData = JSON.parse((0, _stringify2.default)(originObj));
	      for (var dataName in anotherObj) {
	        var paths = _objPath2.default.parsePath(dataName);
	        var _data = _objPath2.default.getObjectByPath(originObj, paths, !1);
	        var dObj = _data.obj,
	            dKey = _data.key,
	            sData = _objPath2.default.getObjectByPath(originData, paths, !0),
	            sObj = sData.obj,
	            sKey = sData.key,
	            sChanged = sData.changed;

	        dObj && (dObj[dKey] = anotherObj[dataName]);

	        if (sObj) {
	          if (sChanged) {
	            sObj[sKey] = anotherObj[dataName];
	          } else {
	            sObj[sKey] = {
	              __value__: anotherObj[dataName],
	              __wxspec__: !0
	            };
	          }
	        }
	      }
	      return originData;
	    }
	  }]);
	  return AppData;
	}();

	exports.default = AppData;

/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Utils = __webpack_require__(99);

	var _Utils2 = _interopRequireDefault(_Utils);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var parsePath = function parsePath(path) {
	  var pathLen = path.length,
	      strs = [],
	      tempstr = '',
	      numInBracket = 0,
	      haveNumber = !1,
	      inBracket = !1,
	      index = 0;
	  for (; index < pathLen; index++) {
	    var ch = path[index];
	    if (ch === '\\') {
	      if (index + 1 < pathLen) {
	        if (path[index + 1] === '.' || path[index + 1] === '[' || path[index + 1] === ']') {
	          tempstr += path[index + 1];
	          index++;
	        } else {
	          tempstr += '\\';
	        }
	      }
	    } else if (ch === '.') {
	      if (tempstr) {
	        strs.push(tempstr);
	        tempstr = '';
	      }
	    } else if (ch === '[') {
	      if (tempstr) {
	        strs.push(tempstr);
	        tempstr = '';
	      }

	      if (strs.length === 0) {
	        throw new Error('path can not start with []: ' + path);
	      }
	      inBracket = !0;
	      haveNumber = !1;
	    } else if (ch === ']') {
	      if (!haveNumber) {
	        throw new Error('must have number in []: ' + path);
	      }
	      inBracket = !1;
	      strs.push(numInBracket);
	      numInBracket = 0;
	    } else if (inBracket) {
	      if (ch < '0' || ch > '9') {
	        throw new Error('only number 0-9 could inside []: ' + path);
	      }
	      haveNumber = !0;
	      numInBracket = 10 * numInBracket + ch.charCodeAt(0) - 48;
	    } else {
	      tempstr += ch;
	    }
	  }
	  tempstr && strs.push(tempstr);
	  if (strs.length === 0) {
	    throw new Error('path can not be empty');
	  }
	  return strs;
	};

	var getObjectByPath = function getObjectByPath(obj, paths, spec) {
	  for (var tempObj = void 0, key = void 0, originObj = obj, changed = !1, idx = 0; idx < paths.length; idx++) {
	    if (Number(paths[idx]) === paths[idx] && paths[idx] % 1 === 0) {
	      if ("Array" !== _Utils2.default.getDataType(originObj)) {
	        if (spec && !changed) {
	          changed = !0;
	          tempObj[key] = { __value__: [], __wxspec__: !0 };
	          originObj = tempObj[key].__value__;
	        } else {
	          tempObj[key] = [];
	          originObj = tempObj[key];
	        }
	      }
	    } else {
	      if ("Object" !== _Utils2.default.getDataType(originObj)) {
	        if (spec && !changed) {
	          changed = !0;
	          tempObj[key] = { __value__: {}, __wxspec__: !0 };
	          originObj = tempObj[key].__value__;
	        } else {
	          tempObj[key] = {};
	          originObj = tempObj[key];
	        }
	      }
	    }
	    key = paths[idx];
	    tempObj = originObj;
	    originObj = originObj[paths[idx]];
	    originObj && originObj.__wxspec__ && (originObj = originObj.__value__, changed = !0);
	  }
	  return {
	    obj: tempObj,
	    key: key,
	    changed: changed
	  };
	};
	exports.default = {
	  parsePath: parsePath,
	  getObjectByPath: getObjectByPath
	};

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _from = __webpack_require__(89);

	var _from2 = _interopRequireDefault(_from);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var catchError = function catchError(func) {
	  return function () {
	    try {
	      func.apply(void 0, (0, _from2.default)(arguments));
	    } catch (err) {
	      console.error(err.stack);
	      Reporter.errorReport({
	        key: 'exparserScriptError',
	        error: err
	      });
	    }
	  };
	};

	exparser.addGlobalErrorListener(function (error, errData) {
	  Reporter.errorReport({
	    key: 'webviewScriptError',
	    error: error,
	    extend: errData.message
	  });
	});

	exports.default = { catchError: catchError };

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	__webpack_require__(99);

	var bottomCheckDistance = 20,
	    windowScrollY = 0,
	    stopedTouch = !1,
	    refreshFinish = !0;

	var getWindowHeight = function getWindowHeight() {
	  return document.compatMode === 'CSS1Compat' ? document.documentElement.clientHeight : document.body.clientHeight;
	};

	var getScrollHeight = function getScrollHeight() {
	  var bodyScrollHeight = 0,
	      documentElementScrollHeight = 0;
	  document.body && (bodyScrollHeight = document.body.scrollHeight);
	  document.documentElement && (documentElementScrollHeight = document.documentElement.scrollHeight);
	  return Math.max(bodyScrollHeight, documentElementScrollHeight);
	};

	var checkScrollBottom = function checkScrollBottom() {
	  var isGoingBottom = windowScrollY - window.scrollY <= 0;
	  windowScrollY = window.scrollY;
	  var ref = window.scrollY + getWindowHeight() + bottomCheckDistance;
	  return !!(ref >= getScrollHeight() && isGoingBottom);
	};

	var triggerPullUpRefresh = function triggerPullUpRefresh() {
	  if (refreshFinish && !stopedTouch) {
	    wx.publishPageEvent('onReachBottom', {});
	    refreshFinish = !1;
	    setTimeout(function () {
	      refreshFinish = !0;
	    }, 350);
	  }
	};

	var enablePullUpRefresh = function enablePullUpRefresh() {
	  if (window.__enablePullUpRefresh__) {
	    !function () {
	      window.onscroll = function () {
	        checkScrollBottom() && triggerPullUpRefresh();
	      };
	      var startPoint = 0;
	      window.__DOMTree__.addListener('touchstart', function (event) {
	        startPoint = event.touches[0].pageY;
	        stopedTouch = !1;
	      });
	      window.__DOMTree__.addListener('touchmove', function (event) {
	        if (!stopedTouch) {
	          var currentPoint = event.touches[0].pageY;
	          if (currentPoint < startPoint && checkScrollBottom()) {
	            triggerPullUpRefresh();
	            stopedTouch = !0;
	          }
	        }
	      });
	      window.__DOMTree__.addListener('touchend', function (event) {
	        stopedTouch = !1;
	      });
	    }();
	  }
	};

	exports.default = {
	  getScrollHeight: getScrollHeight,
	  getWindowHeight: getWindowHeight,
	  checkScrollBottom: checkScrollBottom,
	  triggerPullUpRefresh: triggerPullUpRefresh,
	  enablePullUpRefresh: enablePullUpRefresh
	};

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _Enums = __webpack_require__(107);

	var _Enums2 = _interopRequireDefault(_Enums);

	__webpack_require__(99);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var initFontSize = function initFontSize() {
	  document.addEventListener('DOMContentLoaded', function () {
	    var screenWidth = window.innerWidth > 0 ? window.innerWidth : screen.width;
	    screenWidth = screenWidth > 375 ? 375 : screenWidth;
	    document.documentElement.style.fontSize = screenWidth / _Enums2.default.RPX_RATE + 'px';
	  }, 1e3);
	};

	var init = function init() {
	  window.__webview_engine_version__ = 0.02;
	  initFontSize();
	};

	exports.default = { init: init };

/***/ })
/******/ ]);
!function(htmlTxt) {
    function insert2html() {
        var styleEle = document.createElement("style");
        document.getElementsByTagName("head")[0].insertBefore(styleEle, document.getElementsByTagName("head")[0].firstChild)
        if (styleEle.styleSheet) {
            styleEle.styleSheet.disabled || (styleEle.styleSheet.cssText = htmlTxt);
        } else{
            try {
                styleEle.innerHTML = htmlTxt
            } catch (n) {
                styleEle.innerText = htmlTxt
            }
        }
    }
    window.document && "complete" === window.document.readyState ? insert2html() : window.onload = insert2html
}('html {\n  -webkit-user-select: none;\n          user-select: none;\n  height: 100%;\n  width: 100%;\n}\nbody {\n  -webkit-user-select: none;\n          user-select: none;\n  width: 100%;\n  overflow-x: hidden;\n}\nwx-action-sheet-item {\n  background-color: #FFFFFF;\n  position: relative;\n  padding: 10px 0;\n  text-align: center;\n  font-size: 18px;\n  display: block;\n}\nwx-action-sheet-item:before {\n  content: " ";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 1px;\n  border-top: 1px solid #D9D9D9;\n  color: #D9D9D9;\n  -webkit-transform-origin: 0 0;\n  transform-origin: 0 0;\n  -webkit-transform: scaleY(0.5);\n  transform: scaleY(0.5);\n}\nwx-action-sheet-item:active {\n  background-color: #ECECEC;\n}\nwx-action-sheet .wx-action-sheet {\n  position: fixed;\n  left: 0;\n  bottom: 0;\n  -webkit-transform: translate(0, 100%);\n          transform: translate(0, 100%);\n  -webkit-backface-visibility: hidden;\n          backface-visibility: hidden;\n  z-index: 5000;\n  width: 100%;\n  background-color: #FFFFFF;\n  transition: -webkit-transform .3s;\n  transition: transform .3s;\n  transition: transform .3s, -webkit-transform .3s;\n}\nwx-action-sheet .wx-action-sheet-show {\n  -webkit-transform: translate(0, 0);\n          transform: translate(0, 0);\n}\nwx-action-sheet .wx-action-sheet-menu {\n  background-color: #FFFFFF;\n}\nwx-action-sheet .wx-action-sheet-mask {\n  position: fixed;\n  z-index: 1000;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  transition: background-color 0.3s;\n  background-color: rgba(0, 0, 0, 0.6);\n}\nwx-audio {\n  display: inline-block;\n  line-height: 0;\n}\nwx-audio[hidden] {\n  display: none;\n}\nwx-audio > .wx-audio-default {\n  max-width: 100%;\n  min-width: 302px;\n  height: 65px;\n  background: #fcfcfc;\n  border: 1px solid #e0e0e0;\n  border-radius: 2.5px;\n  display: inline-block;\n  overflow: hidden;\n}\nwx-audio > .wx-audio-default > .wx-audio-left {\n  width: 65px;\n  height: 65px;\n  float: left;\n  background-color: #e6e6e6;\n  background-size: 100% 100%;\n  background-position: 50% 50%;\n}\nwx-audio > .wx-audio-default > .wx-audio-left > .wx-audio-button {\n  width: 24px;\n  height: 24px;\n  margin: 20.5px;\n  background-size: cover;\n}\nwx-audio > .wx-audio-default > .wx-audio-left > .wx-audio-button.play {\n  background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAAB4dJREFUaAXNWg1MlVUYvpcfIRCJ+MnCaOBl8dOcOCEQZ9kmI5cQG5Yb6MifKbMaGVobOtlibTWHDpgpxBUwF07826iFsMkYJhg559JdGiQSkUzSBA0QkZ7n4/u+nXsvwf3jwru99/y/3/N+3znvec97rlbjABofH38GYtaAV4MjwDqwH9gHTBoE3wd3gA3gi+B6rVY7hHR2CKD9wFngs+BHYGuJYziWMqiscwgP8wLvBQ+AHUWURZle1mqhtXQAhLui7xZwPvgFsBENDg7+Drp069at2z09Pf03b978u6mpqZ+dVq1aFRAVFeW/aNGigNDQ0JfDwsISfXx8wowETBT+QpIPLsf0GpuomvrXIgUAPhhizoGXi+II+tq1az/o9fpLFRUVd8S26fJZWVkLN2/enBgTE/PW/PnzF5v0b0P5HSjxp0m9WXFaBQD+NYw6C1bf+vDwcF9DQ4N+/fr19ciPm0m1osLT01N76tSpNaD3PTw8FgpD+TXSoESrUGeWnVIBgM/EiDKwJ0eiPNrS0nJsw4YNNd3d3aOscxSFhIS4V1dXpyckJGRB5jxZ7jDSbVDiW7lslriY1cgVMvjjKErgR0dH/zl06NCuFStWfOdo8HwkZVL2wYMHP3ny5AlNLonPPi5jkSpMfyb9AhjAadMIlsBjrndmZ2fnnThxos9UwEyUMzIynj9y5EgB1gb3ExK/xBuTTSczBQCeC/ZnsDTnCR6f9YMbN25QiNMoOjras7W1tcjb2ztcfijXRKzpwjaaQgBPU0lrI4HntOGbdzZ4AuYzt2/fvm9sbOweyyBiOidjlCr4Y6QAyrTzkqlEx9GSkpJ9zpo2BGNKfHZRUdF+1D+W24iNGFVSpxAAcxekryK9/cuXLx/FoqpWe85iBlPpvbi4uB0yBE4lHabSvyyLX2AXyhJ42nmYytPsMBcI+80ZWKZeGQsxEqtEkgJ4+3Sm9sh1Gm5SM2EqFfnWpsRSV1dXIYzbI2NWv0AqGiXXl+4Bd1ihs0XZu3fvHhgYGNBXVVUlWDTAyk7p6ekNIyMj7fIwYiVmIwWkNvo2trgHAQEBy+CghW7cuPGLvr6+L3fu3PmSJNBBP8R09erVHwVxEwrgU/AwkqQ00DFT8lamqkEICgqKKy4u1sMU7li6dKnVLvL/Pbe0tLRFaEsidi1+UlB5ng3ctBYsWLBV6GRxFnJ4yjIj7CX36uvrS1NTU+uwEM3ara3Al/gaTl+EPC6Vi/hNRUhHR8dPSt5Rqbu7+3Nr1679rL+//3BBQYHyYJvFd3V1iTNkNRV4RZF2G6TkHZ36+vpG5uXlHcah59Pk5GSbj5AY3y1gi6ACisOk4UlKaJyJrBYnsuTa2trjzc3N7/r7+9N1sYo6OzsfCAN0VEB9GzwGCo0zlnV1dfVOTEzMhn3Xl5eXx1rzIBOMflRAsv8UopxhrRFoT18vL68QHCu/am9vz7FUjglGHyow6xQcHBxjKwgqwKCTRIweKHlnpZhGDfC7LP4CJhgH3QCUxzd/AmboA0kP8zNNcDt+w8ZUvHv37l+tedaSJUueFfrfpwJ0oSVLxLiN0DgjWWxsDxobG79JSUn53haXRafT+QrAOjiFDEoFg05K3tEpduoxg8FweuXKlRlJSUm1toAnpvDwcB55FTJQAdUFYMRMaXFkil34l9zc3K2RkZElV65ceWSPbCz414XxF6kAXWfpdMNwHyNmQge7skNDQ3dOnjy5PzAwMLewsLDLLmEYDJMb5ObmFiXLIeZ6FxzNGOK+IFeyk91f4enTpyNtbW3HIiIiNsHCNCmy7U1zcnKWCTIuEDu/AOn8RKLRMFbJcJ9StjRlBIN94Y40ZmZmboqNja3iScrS8dP1IyaEWt4W+kmYaYVILHA/8GGglbHKdevWqV+FHaYjOGofw811hcfZOV1fW9pxzE1wcXGJlscSq6SA+qZhJfai8nN2wNHtDhb0pt7eXoe9Qcq1lRg3hRvNkLtyytuHfAHlKVOI+UIwQxYaRolramrSmZ8LhLefJIAnRmKVSFUAHbiq8yeqNRpGiWE5XlXKs5WWlZUthu3/SHh+voxVqlKnEEuYRvTPee5czjKjxDCr2bMVnYNF9IO7fRRQAokHxIuPeCig3t4YKcAeUCIYiRrcffjwYUd8fPyHzo6PwuJ4XL9+/QAWrjILOHWmDu5SAWjHa500sBSNZoibUWKGvNnuDOKbNwFPLLytITYjUteAWIuOvNbZptQxxF1ZWXnYGWuCc57TRnjzhMFbGmIyI7MpJPbAdMpEuQzsKdc/hi+jT0tLO+NoE0tTSWsjL9h58vP45qe8YppSAQqBEmaXfAy0MlbJcJ+tXqUMUMMdlpsUIuE78JYVO89mznn7LvmUh8gL+xzKknVS6hmrZLiPETNrr1npmNG3oXsg7LCKaFobx1yzKhKhBE3sFnA+mCFuI4IyBuyWzYjb/MHQh+lFN09SPIxgirxIlxhepeIWiHL41vPBFl90i4MtykOROfVXA4tAT9YJisyJP3tMu4gnA29aB2UY4V4DXg1m/FMH9gMrMSd6jwwe8PxtAPMU6JC/2/wHuyI2cMsNBRIAAAAASUVORK5CYII=\');\n}\nwx-audio > .wx-audio-default > .wx-audio-left > .wx-audio-button.pause {\n  background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXNSR0IArs4c6QAABatJREFUaAXVWl1IpFUYnllZGUf3wlz6MXER1ES7s83VUDJw6KpdaSTDwMnYFSK6KNirooHullKQCNzQRjZ/wom1u9ALQ0mT1ktFdEBWXLdibaH1jwmx5zme83W+z2Hm+7bZmc8X3jl/73vO837n/z3j9aSBjo6O8lBNC7gZXAUuBxeCz4FJj8APwTHwCngaPOX1evcRZocAuhAcAt8G74KdEnWoyzpobGYIjfnBn4D/BqeLWBfr9Du1wmtXAZXnQPY9cBj8HNhEe3t7sbW1tfn19fW7m5ubD5aXl7dnZmYeUKipqel8dXV1UUlJyfmysrILFRUV9X6/n8PMSveREQYPYHgdWgsTpW0ZAPDPQ3kC/JJeCUEvLi7+NDg4+EskEvldL0sVD4VCz3Z1db1SW1v7egJj7kD/Coy4l6qelAYAfB0quQ02vno8Hr8/OTkZaWtrmzo4ODhK1Uiycp/P5x0fH28JBAKh3Nxcow3osDdaYcRCMv2kBgD8O1D+BuyTlcTn5+cj7e3t0Y2NjX+SVey0rLS09OzY2Fiwvr4+BN1cqX+A8CqM+E6mTwRnTuTIDAn+FpIC/OHh4V+9vb0fNzQ0jKYbPJtknaybbbAtCYNt35JYZJY5SNgDctj8DFEBfnd3d627u/vT4eHhP8zqTybV0dHxTH9//+f5+fkVsgX2xKuJhtMJAwCeE/Y3sBiPBF9XV/fh0tISK8kY1dTU+BYWFvo0IzgnLlontmkIATyXSq42Ajy7kl8+0+D5ldgm29aGEzFNSIwUEWQyADlc59VSGe/r6/ssU8PmGI75l20TA3LjsoTYiNEgYwjBMu6CPKuIr4/Vph+TasyQzGJkbm7ubaxO1yQEDqVyDKU9pvUe+AhpAZ7rPJbKHyjgBuKyTUwSCzESqyBhAL4+D1PXZZ6Hm9STWCpV/U5DYiEmTe+6xOwRQwiJEAq/pQCPB0VFRdf+7w7LutJJ3LG3t7dvaseOdzGMImoIXVaN8WzjNvDERkzEpnAiFJjP4OvzMhJQBTyYqbjdEDov7+/vf4+6pu0wZQcGBi7arV/JWbAFiN2Lnzcg8COFuGkVFBSo2a70UoYEhC5+OqWgJoAv+mdeXt5bWpat6M7Ozk1tc7vMIfSa0lxdXf1VxZ2ETsGz7sfRoV4sFtMxNtOAF1hAugs6jrn3lxcmDV0VDTBuRrxJaYWujFowltMA40LNa6ArUWugLBgLaYByfXjUHVaTd13UgvEcDTjVRAPodBJE74GKuzW0YHxEA+gxE0TXh4q7NbRgfEgDeIQWRL+Nirs1tGCM0YAVBZZOJxV3a2jBuEIDphVYesxU3EnIY4ETeco+jg71LBinacAUWNxueFSlx4yCTmh0dPRLJ4AoOzIy8oWTNihLbNpxmpin1H2AnrcrFJqdnf0KM901tzFiUoQ94M3GxsYPZHoC94FW9gBJnEYZoa8SBy1hGNNuIWIiNg2PwKwbIPYDdhF9lZqgK6LEpA0fYv3PAHQF94IbCikdrcXFxWdVOtsh/abEpOG4ITGbvBI9EBA3f3qJo9FoUFPIapROX81zTYzEKkgNIQ8s4qwOH2d7PPQS9/T0vKjS2QqJQXqsFYSwxCrSpsmK6yVdi7zx0APmoVuvs7Pz/Wx55+jkHRoa+jonJ+cp4gHdAV+CAcbrjckASsCI0+vcpQGw7h6CVrDwRvMCTS8xvwbLM0Fsy+KZJha+1hCbiYw5oOdCkM86V1UejWBXZmJOsA22pXkeCIOvNAmfmk4MIQWaIYZTwiemYDAY3dracsUTU1IDpBGn95FP9Yac2KfzmVUzgkssHxfCYOGGR2gQvXp0jNG3lOyh+wKosrLykmWMq3q4SYXBth+6laLtEL3hqr8a2AZuFYQhrvizR8pJbAWeKA1j6OFuATeDq8D09hWClc+Jp0ceGHn/5hWWt8C0/N3mX15C4bDnCIuAAAAAAElFTkSuQmCC\');\n}\nwx-audio > .wx-audio-default > .wx-audio-right {\n  box-sizing: border-box;\n  height: 65px;\n  margin-left: 65px;\n  padding: 11px 16.5px 13.5px 15px;\n  overflow: hidden;\n}\nwx-audio > .wx-audio-default > .wx-audio-right > .wx-audio-info {\n  margin-right: 70px;\n  overflow: hidden;\n}\nwx-audio > .wx-audio-default > .wx-audio-right > .wx-audio-info > .wx-audio-name {\n  height: 22.5px;\n  line-height: 22.5px;\n  margin-bottom: 3.5px;\n  font-size: 14px;\n  color: #353535;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\nwx-audio > .wx-audio-default > .wx-audio-right > .wx-audio-info > .wx-audio-author {\n  height: 14.5px;\n  line-height: 14.5px;\n  font-size: 12px;\n  color: #888888;\n  overflow: hidden;\n  white-space: nowrap;\n  text-overflow: ellipsis;\n}\nwx-audio > .wx-audio-default > .wx-audio-right > .wx-audio-time {\n  margin-top: 3.5px;\n  height: 16.5px;\n  font-size: 12px;\n  color: #888888;\n  float: right;\n}\nwx-button {\n  position: relative;\n  display: block;\n  margin-left: auto;\n  margin-right: auto;\n  padding-left: 14px;\n  padding-right: 14px;\n  box-sizing: border-box;\n  font-size: 18px;\n  text-align: center;\n  text-decoration: none;\n  line-height: 2.55555556;\n  border-radius: 5px;\n  -webkit-tap-highlight-color: transparent;\n  overflow: hidden;\n  color: #000000;\n  background-color: #F8F8F8;\n}\nwx-button[hidden] {\n  display: none !important;\n}\nwx-button:after {\n  content: " ";\n  width: 200%;\n  height: 200%;\n  position: absolute;\n  top: 0;\n  left: 0;\n  border: 1px solid rgba(0, 0, 0, 0.2);\n  -webkit-transform: scale(0.5);\n          transform: scale(0.5);\n  -webkit-transform-origin: 0 0;\n          transform-origin: 0 0;\n  box-sizing: border-box;\n  border-radius: 10px;\n}\nwx-button[type=default] {\n  color: #000000;\n  background-color: #F8F8F8;\n}\nwx-button[type=primary] {\n  color: #FFFFFF;\n  background-color: #1AAD19;\n}\nwx-button[type=warn] {\n  color: #FFFFFF;\n  background-color: #E64340;\n}\nwx-button[type=warn]:not([disabled]):visited {\n  color: #FFFFFF;\n}\nwx-button[type=warn]:not([disabled]):active {\n  color: rgba(255, 255, 255, 0.6);\n  background-color: #CE3C39;\n}\nwx-button[disabled] {\n  color: rgba(255, 255, 255, 0.6);\n}\nwx-button[disabled][type=default],\nwx-button[disabled]:not([type]) {\n  color: rgba(0, 0, 0, 0.3);\n  background-color: #F7F7F7;\n}\nwx-button[disabled][type=primary] {\n  background-color: #9ED99D;\n}\nwx-button[disabled][type=warn] {\n  background-color: #EC8B89;\n}\nwx-button[type=primary][plain] {\n  color: #1aad19;\n  border: 1px solid #1aad19;\n  background-color: transparent;\n}\nwx-button[type=primary][plain]:not([disabled]):active {\n  color: rgba(26, 173, 25, 0.6);\n  border-color: rgba(26, 173, 25, 0.6);\n  background-color: transparent;\n}\nwx-button[type=primary][plain][disabled] {\n  color: rgba(0, 0, 0, 0.2);\n  border-color: rgba(0, 0, 0, 0.2);\n}\nwx-button[type=primary][plain]:after {\n  border-width: 0;\n}\nwx-button[type=default][plain] {\n  color: #353535;\n  border: 1px solid #353535;\n  background-color: transparent;\n}\nwx-button[type=default][plain]:not([disabled]):active {\n  color: rgba(53, 53, 53, 0.6);\n  border-color: rgba(53, 53, 53, 0.6);\n  background-color: transparent;\n}\nwx-button[type=default][plain][disabled] {\n  color: rgba(0, 0, 0, 0.2);\n  border-color: rgba(0, 0, 0, 0.2);\n}\nwx-button[type=default][plain]:after {\n  border-width: 0;\n}\nwx-button[plain] {\n  color: #353535;\n  border: 1px solid #353535;\n  background-color: transparent;\n}\nwx-button[plain]:not([disabled]):active {\n  color: rgba(53, 53, 53, 0.6);\n  border-color: rgba(53, 53, 53, 0.6);\n  background-color: transparent;\n}\nwx-button[plain][disabled] {\n  color: rgba(0, 0, 0, 0.2);\n  border-color: rgba(0, 0, 0, 0.2);\n}\nwx-button[plain]:after {\n  border-width: 0;\n}\nwx-button[type=warn][plain] {\n  color: #e64340;\n  border: 1px solid #e64340;\n  background-color: transparent;\n}\nwx-button[type=warn][plain]:not([disabled]):active {\n  color: rgba(230, 67, 64, 0.6);\n  border-color: rgba(230, 67, 64, 0.6);\n  background-color: transparent;\n}\nwx-button[type=warn][plain][disabled] {\n  color: rgba(0, 0, 0, 0.2);\n  border-color: rgba(0, 0, 0, 0.2);\n}\nwx-button[type=warn][plain]:after {\n  border-width: 0;\n}\nwx-button[size=mini] {\n  display: inline-block;\n  line-height: 2.3;\n  font-size: 13px;\n  padding: 0 1.34em;\n}\nwx-button[loading]:before {\n  content: " ";\n  display: inline-block;\n  width: 18px;\n  height: 18px;\n  vertical-align: middle;\n  -webkit-animation: wx-button-loading-animate 1s steps(12, end) infinite;\n          animation: wx-button-loading-animate 1s steps(12, end) infinite;\n  background: transparent url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iciIgd2lkdGg9JzEyMHB4JyBoZWlnaHQ9JzEyMHB4JyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjRTlFOUU5JwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzk4OTY5NycKICAgICAgICAgIHRyYW5zZm9ybT0ncm90YXRlKDMwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4KICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyM5Qjk5OUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjQTNBMUEyJwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNBQkE5QUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCMkIyQjInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxNTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCQUI4QjknCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDMkMwQzEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyMTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDQkNCQ0InCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEMkQyRDInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEQURBREEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNFMkUyRTInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0Pgo8L3N2Zz4=) no-repeat;\n  background-size: 100%;\n}\nwx-button[loading][type=primary] {\n  color: rgba(255, 255, 255, 0.6);\n  background-color: #179B16;\n}\nwx-button[loading][type=primary][plain] {\n  color: #1aad19;\n  background-color: transparent;\n}\nwx-button[loading][type=default] {\n  color: rgba(0, 0, 0, 0.6);\n  background-color: #DEDEDE;\n}\nwx-button[loading][type=default][plain] {\n  color: #353535;\n  background-color: transparent;\n}\nwx-button[loading][type=warn] {\n  color: rgba(255, 255, 255, 0.6);\n  background-color: #CE3C39;\n}\nwx-button[loading][type=warn][plain] {\n  color: #e64340;\n  background-color: transparent;\n}\n@-webkit-keyframes wx-button-loading-animate {\n  0% {\n    -webkit-transform: rotate3d(0, 0, 1, 0deg);\n            transform: rotate3d(0, 0, 1, 0deg);\n  }\n  100% {\n    -webkit-transform: rotate3d(0, 0, 1, 360deg);\n            transform: rotate3d(0, 0, 1, 360deg);\n  }\n}\n@keyframes wx-button-loading-animate {\n  0% {\n    -webkit-transform: rotate3d(0, 0, 1, 0deg);\n            transform: rotate3d(0, 0, 1, 0deg);\n  }\n  100% {\n    -webkit-transform: rotate3d(0, 0, 1, 360deg);\n            transform: rotate3d(0, 0, 1, 360deg);\n  }\n}\n.button-hover {\n  background-color: rgba(0, 0, 0, 0.1);\n}\n.button-hover[type=primary] {\n  background-color: #179B16;\n}\n.button-hover[type=default] {\n  background-color: #DEDEDE;\n}\nwx-canvas {\n  width: 300px;\n  height: 150px;\n  display: block;\n}\nwx-checkbox {\n  -webkit-tap-highlight-color: transparent;\n  display: inline-block;\n}\nwx-checkbox[hidden] {\n  display: none;\n}\nwx-checkbox .wx-checkbox-wrapper {\n  display: -webkit-inline-flex;\n  display: inline-flex;\n  -webkit-align-items: center;\n          align-items: center;\n  vertical-align: middle;\n}\nwx-checkbox .wx-checkbox-input {\n  margin-right: 5px;\n  -webkit-appearance: none;\n          appearance: none;\n  outline: 0;\n  border: 1px solid #D1D1D1;\n  background-color: #FFFFFF;\n  border-radius: 3px;\n  width: 22px;\n  height: 22px;\n  position: relative;\n}\nwx-checkbox .wx-checkbox-input.wx-checkbox-input-checked {\n  color: #09BB07;\n}\nwx-checkbox .wx-checkbox-input.wx-checkbox-input-checked:before {\n  font: normal normal normal 14px/1 "weui";\n  content: "\\EA08";\n  font-size: 22px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -48%) scale(0.73);\n  -webkit-transform: translate(-50%, -48%) scale(0.73);\n}\nwx-checkbox .wx-checkbox-input.wx-checkbox-input-disabled {\n  background-color: #E1E1E1;\n}\nwx-checkbox .wx-checkbox-input.wx-checkbox-input-disabled:before {\n  color: #ADADAD;\n}\nwx-checkbox-group {\n  display: block;\n}\nwx-checkbox-group[hidden] {\n  display: none;\n}\nwx-icon {\n  display: inline-block;\n  font-size: 0;\n}\nwx-icon[hidden] {\n  display: none;\n}\nwx-icon i {\n  font: normal normal normal 14px/1 "weui";\n}\n@font-face {\n  font-weight: normal;\n  font-style: normal;\n  font-family: "weui";\n  src: url(\'data:application/octet-stream;base64,AAEAAAALAIAAAwAwR1NVQrD+s+0AAAE4AAAAQk9TLzJAKEx1AAABfAAAAFZjbWFw64JcfgAAAhQAAAI0Z2x5ZvCBJt8AAARsAAAHLGhlYWQIuM5WAAAA4AAAADZoaGVhCC0D+AAAALwAAAAkaG10eDqYAAAAAAHUAAAAQGxvY2EO3AzsAAAESAAAACJtYXhwAR4APgAAARgAAAAgbmFtZeNcHtgAAAuYAAAB5nBvc3RP98ExAAANgAAAANYAAQAAA+gAAABaA+gAAP//A+kAAQAAAAAAAAAAAAAAAAAAABAAAQAAAAEAAKZXmK1fDzz1AAsD6AAAAADS2MTEAAAAANLYxMQAAAAAA+kD6QAAAAgAAgAAAAAAAAABAAAAEAAyAAQAAAAAAAIAAAAKAAoAAAD/AAAAAAAAAAEAAAAKAB4ALAABREZMVAAIAAQAAAAAAAAAAQAAAAFsaWdhAAgAAAABAAAAAQAEAAQAAAABAAgAAQAGAAAAAQAAAAAAAQOqAZAABQAIAnoCvAAAAIwCegK8AAAB4AAxAQIAAAIABQMAAAAAAAAAAAAAAAAAAAAAAAAAAAAAUGZFZABA6gHqDwPoAAAAWgPpAAAAAAABAAAAAAAAAAAAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAPoAAAD6AAAA+gAAAAAAAUAAAADAAAALAAAAAQAAAFwAAEAAAAAAGoAAwABAAAALAADAAoAAAFwAAQAPgAAAAQABAABAADqD///AADqAf//AAAAAQAEAAAAAQACAAMABAAFAAYABwAIAAkACgALAAwADQAOAA8AAAEGAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAwAAAAAAMQAAAAAAAAADwAA6gEAAOoBAAAAAQAA6gIAAOoCAAAAAgAA6gMAAOoDAAAAAwAA6gQAAOoEAAAABAAA6gUAAOoFAAAABQAA6gYAAOoGAAAABgAA6gcAAOoHAAAABwAA6ggAAOoIAAAACAAA6gkAAOoJAAAACQAA6goAAOoKAAAACgAA6gsAAOoLAAAACwAA6gwAAOoMAAAADAAA6g0AAOoNAAAADQAA6g4AAOoOAAAADgAA6g8AAOoPAAAADwAAAAAALgBmAKIA3gEaAV4BtgHkAgoCRgKIAtIDFANOA5YAAAACAAAAAAOvA60ACwAXAAABDgEHHgEXPgE3LgEDLgEnPgE3HgEXDgEB9bz5BQX5vLv5BQX5u6zjBQXjrKvjBQXjA60F+by7+gQE+ru8+fy0BOSrq+QEBOSrq+QAAAIAAAAAA7MDswALACEAAAEOAQceARc+ATcuAQMHBiIvASY2OwERNDY7ATIWFREzMhYB7rn7BQX7ucL+BQX+JHYPJg92DgwYXQsHJggKXRgMA7MF/sK5+wUF+7nC/v31mhISmhIaARcICwsI/ukaAAADAAAAAAOtA6sACwAZACIAAAEOAQceARc+ATcuAQMUBisBIiY1ETY3MxYXJy4BNDYyFhQGAfC49gUF9ri++gUF+poKBxwHCgEILAgBHxMZGSYZGQOrBfq+uPYFBfa4vvr9dQcKCgcBGggBAQg5ARklGRklGQAAAAACAAAAAAOSA8IADQAfAAABDgEHERYEFzYkNxEuARMBBi8BJj8BNh8BFjclNh8BFgH0gchUCQEDkZEBAwlUyHr+vwQDlAMCFQMDegMEAScEAxMDA8IePRz+w9TwJCTw1AE9HD3+3f7DAgOZBAMcBANdAgL2AwMTBAADAAAAAAOCA7AADQAZACIAAAEOAQcRHgEXPgE3ES4BBzMWFQcGByMmLwE0EyImNDYyFhQGAfV7wVEJ+YuL+QlRwZIuCQoBBCIEAQogDhISHBISA7AdOxr+z8vnIyPnywExGjv3AQjYBAEBBNgI/rETHBISHBMAAAACAAAAAAO9A70AFwAjAAABLgE/AT4BHwEWMjclNhYXJxYUBwEGJiclJgAnBgAHFgAXNgABIAUCBQMFEAdiBxIGARMHEQYCBgb+0AYQBgIcBf79x77/AAUFAQC+xwEDAccGEQcEBwIFTAQF5QYBBgIGEAb+1QYBBqzHAQMFBf79x77/AAUFAQAABAAAAAADrwOtAAsAFwAtADEAAAEOAQceARc+ATcuAQMuASc+ATceARcOARMFDgEvASYGDwEGFh8BFjI3AT4BJiIXFjEXAfW8+QUF+by7+QUF+bus4wUF46yr4wUF4yv+9gcRBmAGDwUDBQEGfQUQBgElBQELDxQBAQOtBfm8u/oEBPq7vPn8tATkq6vkBATkq6vkAiLdBQEFSQUCBgQHEQaABgUBIQUPCwQBAQAAAAABAAAAAAO7AzoAFwAAEy4BPwE+AR8BFjY3ATYWFycWFAcBBiInPQoGBwUIGQzLDSALAh0MHgsNCgr9uQscCwGzCyEOCw0HCZMJAQoBvgkCCg0LHQv9sQsKAAAAAAIAAAAAA7gDuAALABEAAAEGAgceARc2JDcmABMhETMRMwHuvP0FBf28xQEABQX/ADr+2i35A7gF/wDFvP0FBf28xQEA/d4BTv7fAAAEAAAAAAOvA60AAwAPABsAIQAAARYxFwMOAQceARc+ATcuAQMuASc+ATceARcOAQMjFTM1IwLlAQHyvPkFBfm8u/kFBfm7rOMFBeOsq+MFBePZJP3ZAoMBAQEsBfm8u/oEBPq7vPn8tATkq6vkBATkq6vkAi39JAADAAAAAAPDA8MACwAbACQAAAEGAAcWABc2ADcmAAczMhYVAw4BKwEiJicDNDYTIiY0NjIWFAYB7sD+/AUFAQTAyQEHBQX++d42CAoOAQUEKgQFAQ4KIxMaGiYaGgPDBf75ycD+/AUFAQTAyQEH5woI/tMEBgYEASwIC/4oGicZGScaAAAEAAAAAAPAA8AACAASAB4AKgAAAT4BNCYiBhQWFyMVMxEjFTM1IwMGAAcWBBc+ATcmAgMuASc+ATceARcOAQH0GCEhMCEhUY85Ock6K83++AQEAQjNuf8FBf/Hq+MEBOOrq+MEBOMCoAEgMSAgMSA6Hf7EHBwCsQT++M25/wUF/7nNAQj8pwTjq6vjBATjq6vjAAAAAwAAAAADpwOnAAsAFwAjAAABBycHFwcXNxc3JzcDDgEHHgEXPgE3LgEDLgEnPgE3HgEXDgECjpqaHJqaHJqaHJqatrn1BQX1ubn1BQX1uajfBATfqKjfBATfAqqamhyamhyamhyamgEZBfW5ufUFBfW5ufX8xwTfqKjfBATfqKjfAAAAAwAAAAAD6QPpABEAHQAeAAABDgEjLgEnPgE3HgEXFAYHAQcBPgE3LgEnDgEHHgEXAo41gEmq4gQE4qqq4gQvKwEjOf3giLUDA7WIiLUDBLSIASMrLwTiqqriBATiqkmANP7dOQEZA7WIiLUDA7WIiLUDAAACAAAAAAPoA+gACwAnAAABBgAHFgAXNgA3JgADFg4BIi8BBwYuATQ/AScmPgEyHwE3Nh4BFA8BAfTU/uUFBQEb1NQBGwUF/uUDCgEUGwqiqAobEwqoogoBFBsKoqgKGxMKqAPoBf7l1NT+5QUFARvU1AEb/WgKGxMKqKIKARQbCqKoChsTCqiiCgEUGwqiAAAAABAAxgABAAAAAAABAAQAAAABAAAAAAACAAcABAABAAAAAAADAAQACwABAAAAAAAEAAQADwABAAAAAAAFAAsAEwABAAAAAAAGAAQAHgABAAAAAAAKACsAIgABAAAAAAALABMATQADAAEECQABAAgAYAADAAEECQACAA4AaAADAAEECQADAAgAdgADAAEECQAEAAgAfgADAAEECQAFABYAhgADAAEECQAGAAgAnAADAAEECQAKAFYApAADAAEECQALACYA+ndldWlSZWd1bGFyd2V1aXdldWlWZXJzaW9uIDEuMHdldWlHZW5lcmF0ZWQgYnkgc3ZnMnR0ZiBmcm9tIEZvbnRlbGxvIHByb2plY3QuaHR0cDovL2ZvbnRlbGxvLmNvbQB3AGUAdQBpAFIAZQBnAHUAbABhAHIAdwBlAHUAaQB3AGUAdQBpAFYAZQByAHMAaQBvAG4AIAAxAC4AMAB3AGUAdQBpAEcAZQBuAGUAcgBhAHQAZQBkACAAYgB5ACAAcwB2AGcAMgB0AHQAZgAgAGYAcgBvAG0AIABGAG8AbgB0AGUAbABsAG8AIABwAHIAbwBqAGUAYwB0AC4AaAB0AHQAcAA6AC8ALwBmAG8AbgB0AGUAbABsAG8ALgBjAG8AbQAAAAIAAAAAAAAACgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEAECAQMBBAEFAQYBBwEIAQkBCgELAQwBDQEOAQ8BEAERAAZjaXJjbGUIZG93bmxvYWQEaW5mbwxzYWZlX3N1Y2Nlc3MJc2FmZV93YXJuB3N1Y2Nlc3MOc3VjY2Vzc19jaXJjbGURc3VjY2Vzc19ub19jaXJjbGUHd2FpdGluZw53YWl0aW5nX2NpcmNsZQR3YXJuC2luZm9fY2lyY2xlBmNhbmNlbAZzZWFyY2gFY2xvc2UAAAAA\') format(\'truetype\');\n}\n[class^="wx-icon-"]:before,\n[class*=" wx-icon-"]:before {\n  margin: 0;\n}\n.wx-icon-success {\n  color: #09BB07;\n}\n.wx-icon-success:before {\n  content: "\\EA06";\n}\n.wx-icon-info {\n  color: #10AEFF;\n}\n.wx-icon-info:before {\n  content: "\\EA03";\n}\n.wx-icon-warn {\n  color: #F76260;\n}\n.wx-icon-warn:before {\n  content: "\\EA0B";\n}\n.wx-icon-waiting {\n  color: #10AEFF;\n}\n.wx-icon-waiting:before {\n  content: "\\EA09";\n}\n.wx-icon-safe_success {\n  color: #09BB07;\n}\n.wx-icon-safe_success:before {\n  content: "\\EA04";\n}\n.wx-icon-safe_warn {\n  color: #FFBE00;\n}\n.wx-icon-safe_warn:before {\n  content: "\\EA05";\n}\n.wx-icon-success_circle {\n  color: #09BB07;\n}\n.wx-icon-success_circle:before {\n  content: "\\EA07";\n}\n.wx-icon-success_no_circle {\n  color: #09BB07;\n}\n.wx-icon-success_no_circle:before {\n  content: "\\EA08";\n}\n.wx-icon-waiting_circle {\n  color: #10AEFF;\n}\n.wx-icon-waiting_circle:before {\n  content: "\\EA0A";\n}\n.wx-icon-circle {\n  color: #C9C9C9;\n}\n.wx-icon-circle:before {\n  content: "\\EA01";\n}\n.wx-icon-download {\n  color: #09BB07;\n}\n.wx-icon-download:before {\n  content: "\\EA02";\n}\n.wx-icon-info_circle {\n  color: #09BB07;\n}\n.wx-icon-info_circle:before {\n  content: "\\EA0C";\n}\n.wx-icon-cancel {\n  color: #F43530;\n}\n.wx-icon-cancel:before {\n  content: "\\EA0D";\n}\n.wx-icon-search {\n  color: #B2B2B2;\n}\n.wx-icon-search:before {\n  content: "\\EA0E";\n}\n.wx-icon-clear {\n  color: #B2B2B2;\n}\n.wx-icon-clear:before {\n  content: "\\EA0F";\n}\n[class^="wx-icon-"]:before,\n[class*=" wx-icon-"]:before {\n  box-sizing: border-box;\n}\nwx-image {\n  width: 320px;\n  height: 240px;\n  display: inline-block;\n  overflow: hidden;\n}\nwx-image[hidden] {\n  display: none;\n}\nwx-image > div {\n  width: 100%;\n  height: 100%;\n}\nwx-image > img {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  display: block;\n}\n.input-placeholder {\n  color: gray;\n}\nwx-input {\n  display: block;\n  height: 1.4rem;\n  text-overflow: clip;\n  overflow: hidden;\n  white-space: nowrap;\n  font-family: UICTFontTextStyleBody;\n  min-height: 1.4rem;\n}\nwx-input input {\n  position: relative;\n  min-height: 1.4rem;\n  border: none;\n  height: inherit;\n  width: 100%;\n  font-size: inherit;\n  font-weight: inherit;\n  font-family: UICTFontTextStyleBody;\n  color: inherit;\n  background: transparent;\n  display: inherit;\n  padding: 0;\n  margin: 0;\n  outline: none;\n  vertical-align: middle;\n  text-align: inherit;\n  overflow: inherit;\n  white-space: inherit;\n  text-overflow: inherit;\n  -webkit-tap-highlight-color: transparent;\n  z-index: 2;\n}\nwx-input[disabled] div {\n  color: grey;\n}\nwx-input[hidden] {\n  display: none;\n}\nwx-input div {\n  position: relative;\n  min-height: 1.4rem;\n  text-overflow: inherit;\n  border: none;\n  height: inherit;\n  width: inherit;\n  font-size: inherit;\n  font-weight: inherit;\n  font-family: UICTFontTextStyleBody;\n  color: inherit;\n  background: inherit;\n  padding: 0;\n  margin: 0;\n  outline: none;\n  text-align: inherit;\n  -webkit-tap-highlight-color: transparent;\n}\nwx-input div[type=password] div {\n  color: black;\n}\nwx-input div div {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n  line-height: 100%;\n  height: inherit;\n  min-height: 1.4rem;\n  white-space: nowrap;\n  text-align: inherit;\n  overflow: hidden;\n  vertical-align: middle;\n  z-index: 1;\n}\n.wx-loading {\n  position: fixed;\n  z-index: 2000000000;\n  width: 7.6em;\n  min-height: 7.6em;\n  top: 180px;\n  left: 50%;\n  margin-left: -3.8em;\n  background: rgba(40, 40, 40, 0.75);\n  text-align: center;\n  border-radius: 5px;\n  color: #FFFFFF;\n  font-size: 16px;\n  line-height: normal;\n}\n.wx-loading-icon {\n  margin: 30px 0 10px;\n  width: 38px;\n  height: 38px;\n  vertical-align: baseline;\n  display: inline-block;\n  -webkit-animation: weuiLoading 1s steps(12, end) infinite;\n          animation: weuiLoading 1s steps(12, end) infinite;\n  background: transparent url(data:image/svg+xml;base64,PHN2ZyBjbGFzcz0iciIgd2lkdGg9JzEyMHB4JyBoZWlnaHQ9JzEyMHB4JyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAxMDAgMTAwIj4KICAgIDxyZWN0IHg9IjAiIHk9IjAiIHdpZHRoPSIxMDAiIGhlaWdodD0iMTAwIiBmaWxsPSJub25lIiBjbGFzcz0iYmsiPjwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjRTlFOUU5JwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoMCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICA8L3JlY3Q+CiAgICA8cmVjdCB4PSc0Ni41JyB5PSc0MCcgd2lkdGg9JzcnIGhlaWdodD0nMjAnIHJ4PSc1JyByeT0nNScgZmlsbD0nIzk4OTY5NycKICAgICAgICAgIHRyYW5zZm9ybT0ncm90YXRlKDMwIDUwIDUwKSB0cmFuc2xhdGUoMCAtMzApJz4KICAgICAgICAgICAgICAgICByZXBlYXRDb3VudD0naW5kZWZpbml0ZScvPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyM5Qjk5OUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSg2MCA1MCA1MCkgdHJhbnNsYXRlKDAgLTMwKSc+CiAgICAgICAgICAgICAgICAgcmVwZWF0Q291bnQ9J2luZGVmaW5pdGUnLz4KICAgIDwvcmVjdD4KICAgIDxyZWN0IHg9JzQ2LjUnIHk9JzQwJyB3aWR0aD0nNycgaGVpZ2h0PScyMCcgcng9JzUnIHJ5PSc1JyBmaWxsPScjQTNBMUEyJwogICAgICAgICAgdHJhbnNmb3JtPSdyb3RhdGUoOTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNBQkE5QUEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxMjAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCMkIyQjInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxNTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNCQUI4QjknCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgxODAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDMkMwQzEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyMTAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNDQkNCQ0InCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEMkQyRDInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgyNzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNEQURBREEnCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMDAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0PgogICAgPHJlY3QgeD0nNDYuNScgeT0nNDAnIHdpZHRoPSc3JyBoZWlnaHQ9JzIwJyByeD0nNScgcnk9JzUnIGZpbGw9JyNFMkUyRTInCiAgICAgICAgICB0cmFuc2Zvcm09J3JvdGF0ZSgzMzAgNTAgNTApIHRyYW5zbGF0ZSgwIC0zMCknPgogICAgPC9yZWN0Pgo8L3N2Zz4=) no-repeat;\n  background-size: 100%;\n}\n.wx-loading-content {\n  margin: 0 0 15px;\n}\n.wx-loading-mask {\n  position: fixed;\n  z-index: 1000;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n}\n@-webkit-keyframes weuiLoading {\n  0% {\n    -webkit-transform: rotate3d(0, 0, 1, 0deg);\n  }\n  100% {\n    -webkit-transform: rotate3d(0, 0, 1, 360deg);\n  }\n}\n@keyframes weuiLoading {\n  0% {\n    -webkit-transform: rotate3d(0, 0, 1, 0deg);\n  }\n  100% {\n    -webkit-transform: rotate3d(0, 0, 1, 360deg);\n  }\n}\nwx-map {\n  position: relative;\n  width: 300px;\n  height: 150px;\n  display: block;\n}\n.wx-mask {\n  position: fixed;\n  z-index: inherit;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  transition: background-color 0.3s;\n  background-color: inherit;\n}\n.wx-mask[show=false] {\n  display: none;\n}\n.wx-mask-transparent {\n  background-color: rgba(0, 0, 0, 0);\n}\nwx-mask {\n  z-index: 1000;\n  position: fixed;\n  background-color: rgba(0, 0, 0, 0.6);\n}\nwx-modal .wx-modal-mask {\n  z-index: inherit;\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n  transition: background-color 0.3s;\n  background-color: inherit;\n  z-index: 1000;\n  position: fixed;\n  background-color: rgba(0, 0, 0, 0.6);\n  -webkit-animation: fadeIn ease .3s forwards;\n          animation: fadeIn ease .3s forwards;\n}\nwx-modal .wx-modal-dialog {\n  position: fixed;\n  z-index: 5000;\n  width: 85%;\n  top: 50%;\n  left: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  background-color: #FAFAFC;\n  text-align: center;\n  border-radius: 3px;\n  overflow: hidden;\n}\nwx-modal .wx-modal-dialog-hd {\n  padding: 1.2em 20px .5em;\n}\nwx-modal .wx-modal-dialog-hd strong {\n  font-weight: normal;\n  font-size: 17px;\n}\nwx-modal .wx-modal-dialog-bd {\n  text-align: left;\n  padding: 0 20px;\n  font-size: 15px;\n  color: #888;\n  word-wrap: break-word;\n  word-break: break-all;\n}\nwx-modal .wx-modal-dialog-ft {\n  position: relative;\n  line-height: 42px;\n  margin-top: 20px;\n  font-size: 17px;\n  display: -webkit-flex;\n  display: flex;\n}\nwx-modal .wx-modal-dialog-ft:before {\n  content: " ";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 1px;\n  border-top: 1px solid #D5D5D6;\n  color: #D5D5D6;\n  -webkit-transform-origin: 0 0;\n          transform-origin: 0 0;\n  -webkit-transform: scaleY(0.5);\n          transform: scaleY(0.5);\n}\nwx-modal .wx-modal-dialog-ft a {\n  position: relative;\n  display: block;\n  -webkit-flex: 1;\n          flex: 1;\n  text-decoration: none;\n  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\n}\nwx-modal .wx-modal-dialog-ft a[hidden] {\n  display: none;\n}\nwx-modal .wx-modal-dialog-ft a:active {\n  background-color: #eee;\n}\nwx-modal .wx-modal-btn-primary {\n  color: #3CC51F;\n}\nwx-modal .wx-modal-btn-default {\n  color: #000000;\n}\nwx-modal .wx-modal-btn-default:before {\n  content: " ";\n  position: absolute;\n  right: 0;\n  top: 0;\n  width: 1px;\n  height: 100%;\n  border-right: 1px solid #D5D5D6;\n  color: #D5D5D6;\n  -webkit-transform-origin: 100% 0;\n          transform-origin: 100% 0;\n  -webkit-transform: scaleX(0.5);\n          transform: scaleX(0.5);\n}\n@media screen and (min-width: 1024px) {\n  wx-modal .wx-modal-dialog {\n    width: 35%;\n  }\n}\n@-webkit-keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\n@keyframes fadeIn {\n  from {\n    opacity: 0;\n  }\n  to {\n    opacity: 1;\n  }\n}\nwx-picker {\n  display: block;\n}\nwx-picker-view {\n  display: block;\n}\nwx-picker-view .wrapper {\n  display: -webkit-flex;\n  display: flex;\n  position: relative;\n  overflow: hidden;\n}\nwx-picker-view[hidden] {\n  display: none;\n}\nwx-picker-view-column {\n  -webkit-flex: 1;\n  flex: 1;\n  position: relative;\n  height: 100%;\n  overflow: hidden;\n}\n.wx-picker__mask {\n  transform: translateZ(0);\n  -webkit-transform: translateZ(0);\n}\n.wx-picker__indicator,\n.wx-picker__mask {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  z-index: 3;\n}\n.wx-picker__mask {\n  top: 0;\n  height: 100%;\n  margin: 0 auto;\n  background: linear-gradient(180deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6)), linear-gradient(0deg, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.6));\n  background-position: top,bottom;\n  background-size: 100% 102px;\n  background-repeat: no-repeat;\n}\n.wx-picker__indicator {\n  height: 34px;\n  top: 102px;\n}\n.wx-picker__indicator,\n.wx-picker__mask {\n  position: absolute;\n  left: 0;\n  width: 100%;\n  z-index: 3;\n  pointer-events: none;\n}\n.wx-picker__content {\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 100%;\n}\n.wx-picker__indicator:after,\n.wx-picker__indicator:before {\n  content: " ";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 1px;\n  color: #e5e5e5;\n}\n.wx-picker__indicator:before {\n  top: 0;\n  border-top: 1px solid #e5e5e5;\n  -webkit-transform-origin: 0 0;\n  transform-origin: 0 0;\n  -webkit-transform: scaleY(0.5);\n  transform: scaleY(0.5);\n}\n.wx-picker__indicator:after {\n  bottom: 0;\n  border-bottom: 1px solid #e5e5e5;\n  -webkit-transform-origin: 0 100%;\n  transform-origin: 0 100%;\n  -webkit-transform: scaleY(0.5);\n  transform: scaleY(0.5);\n}\n.wx-picker__indicator:after,\n.wx-picker__indicator:before {\n  content: " ";\n  position: absolute;\n  left: 0;\n  right: 0;\n  height: 1px;\n  color: #e5e5e5;\n}\nwx-progress {\n  display: -webkit-flex;\n  display: flex;\n  -webkit-align-items: center;\n          align-items: center;\n}\nwx-progress[hidden] {\n  display: none;\n}\n.wx-progress-bar {\n  background-color: #EBEBEB;\n  -webkit-flex: 1;\n          flex: 1;\n}\n.wx-progress-inner-bar {\n  width: 0;\n  height: 100%;\n}\n.wx-progress-info {\n  margin-top: 0;\n  margin-bottom: 0;\n  min-width: 2em;\n  margin-left: 15px;\n  font-size: 16px;\n}\nwx-radio {\n  -webkit-tap-highlight-color: transparent;\n  display: inline-block;\n}\nwx-radio[hidden] {\n  display: none;\n}\nwx-radio .wx-radio-wrapper {\n  display: -webkit-inline-flex;\n  display: inline-flex;\n  -webkit-align-items: center;\n          align-items: center;\n  vertical-align: middle;\n}\nwx-radio .wx-radio-input {\n  -webkit-appearance: none;\n          appearance: none;\n  margin-right: 5px;\n  outline: 0;\n  border: 1px solid #D1D1D1;\n  background-color: #ffffff;\n  border-radius: 50%;\n  width: 22px;\n  height: 22px;\n  position: relative;\n}\nwx-radio .wx-radio-input.wx-radio-input-checked {\n  background-color: #09BB07;\n  border-color: #09BB07;\n}\nwx-radio .wx-radio-input.wx-radio-input-checked:before {\n  font: normal normal normal 14px/1 "weui";\n  content: "\\EA08";\n  color: #ffffff;\n  font-size: 18px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -48%) scale(0.73);\n  -webkit-transform: translate(-50%, -48%) scale(0.73);\n}\nwx-radio .wx-radio-input.wx-radio-input-disabled {\n  background-color: #E1E1E1;\n  border-color: #D1D1D1;\n}\nwx-radio .wx-radio-input.wx-radio-input-disabled:before {\n  color: #ADADAD;\n}\nwx-radio-group {\n  display: block;\n}\nwx-radio-group[hidden] {\n  display: none;\n}\nwx-scroll-view {\n  display: block;\n  width: 100%;\n}\nwx-scroll-view[hidden] {\n  display: none;\n}\n.wx-scroll-view {\n  position: relative;\n  -webkit-overflow-scrolling: touch;\n  height: 100%;\n}\nwx-swiper {\n  display: block;\n  height: 150px;\n}\nwx-swiper[hidden] {\n  display: none;\n}\nwx-swiper .wx-swiper-wrapper {\n  overflow: hidden;\n  position: relative;\n  width: 100%;\n  height: 100%;\n}\nwx-swiper .wx-swiper-slides {\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  height: 100%;\n}\nwx-swiper .wx-swiper-slides-tracking {\n  transition: none;\n}\nwx-swiper .wx-swiper-dots {\n  position: absolute;\n  font-size: 20px;\n  line-height: 20px;\n}\nwx-swiper .wx-swiper-dots-horizontal {\n  left: 50%;\n  bottom: 0;\n  text-align: center;\n  white-space: nowrap;\n  height: 24px;\n  -webkit-transform: translate(-50%, 0);\n  transform: translate(-50%, 0);\n}\nwx-swiper .wx-swiper-dots-vertical {\n  right: 0;\n  top: 50%;\n  text-align: right;\n  width: 24px;\n  -webkit-transform: translate(0, -50%);\n  transform: translate(0, -50%);\n}\nwx-swiper .wx-swiper-dot {\n  display: inline-block;\n  width: 24px;\n  text-align: center;\n  cursor: pointer;\n  color: grey;\n  transition-property: color;\n  transition-timing-function: ease;\n}\nwx-swiper .wx-swiper-dot-active {\n  color: black;\n}\nwx-swiper .wx-swiper-dot::before {\n  content: "\\2022";\n}\nwx-swiper-item {\n  display: block;\n  overflow: hidden;\n  transition-property: -webkit-transform;\n  transition-property: transform;\n  transition-property: transform, -webkit-transform;\n  transition-timing-function: ease;\n  will-change: transform;\n}\nwx-swiper-item[hidden] {\n  display: none;\n}\nwx-slider {\n  margin: 10px 18px;\n  padding: 0;\n  display: block;\n}\nwx-slider[hidden] {\n  display: none;\n}\nwx-slider .wx-slider-wrapper {\n  display: -webkit-flex;\n  display: flex;\n  -webkit-align-items: center;\n          align-items: center;\n  min-height: 16px;\n}\nwx-slider .wx-slider-tap-area {\n  -webkit-flex: 1;\n          flex: 1;\n  padding: 8px 0;\n}\nwx-slider .wx-slider-handle-wrapper {\n  position: relative;\n  height: 2px;\n  border-radius: 5px;\n  background-color: #e9e9e9;\n  cursor: pointer;\n  transition: background-color 0.3s ease;\n  -webkit-tap-highlight-color: transparent;\n}\nwx-slider .wx-slider-track {\n  height: 100%;\n  border-radius: 6px;\n  background-color: #1aad19;\n  transition: background-color 0.3s ease;\n}\nwx-slider .wx-slider-handle {\n  position: absolute;\n  width: 28px;\n  height: 28px;\n  left: 50%;\n  top: 50%;\n  margin-left: -14px;\n  margin-top: -14px;\n  cursor: pointer;\n  border-radius: 50%;\n  background-color: #fff;\n  z-index: 2;\n  transition: border-color 0.3s ease;\n  box-shadow: 0 0 4px rgba(0, 0, 0, 0.2);\n}\nwx-slider .wx-slider-step {\n  position: absolute;\n  width: 100%;\n  height: 2px;\n  background: transparent;\n  z-index: 1;\n}\nwx-slider .wx-slider-value {\n  color: #888;\n  font-size: 14px;\n  margin-left: 1em;\n}\nwx-slider .wx-slider-disabled .wx-slider-track {\n  background-color: #ccc;\n}\nwx-slider .wx-slider-disabled .wx-slider-handle {\n  background-color: #FFF;\n  border-color: #ccc;\n}\n* {\n  margin: 0;\n}\nwx-switch {\n  -webkit-tap-highlight-color: transparent;\n  display: inline-block;\n}\nwx-switch[hidden] {\n  display: none;\n}\nwx-switch .wx-switch-wrapper {\n  display: -webkit-inline-flex;\n  display: inline-flex;\n  -webkit-align-items: center;\n          align-items: center;\n  vertical-align: middle;\n}\nwx-switch .wx-switch-input {\n  -webkit-appearance: none;\n          appearance: none;\n  position: relative;\n  width: 52px;\n  height: 32px;\n  margin-right: 5px;\n  border: 1px solid #DFDFDF;\n  outline: 0;\n  border-radius: 16px;\n  box-sizing: border-box;\n  background-color: #DFDFDF;\n  transition: background-color 0.1s, border 0.1s;\n}\nwx-switch .wx-switch-input:before {\n  content: " ";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 50px;\n  height: 30px;\n  border-radius: 15px;\n  background-color: #FDFDFD;\n  transition: -webkit-transform .3s;\n  transition: transform .3s;\n  transition: transform .3s, -webkit-transform .3s;\n}\nwx-switch .wx-switch-input:after {\n  content: " ";\n  position: absolute;\n  top: 0;\n  left: 0;\n  width: 30px;\n  height: 30px;\n  border-radius: 15px;\n  background-color: #FFFFFF;\n  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.4);\n  transition: -webkit-transform .3s;\n  transition: transform .3s;\n  transition: transform .3s, -webkit-transform .3s;\n}\nwx-switch .wx-switch-input.wx-switch-input-checked {\n  border-color: #04BE02;\n  background-color: #04BE02;\n}\nwx-switch .wx-switch-input.wx-switch-input-checked:before {\n  -webkit-transform: scale(0);\n          transform: scale(0);\n}\nwx-switch .wx-switch-input.wx-switch-input-checked:after {\n  -webkit-transform: translateX(20px);\n          transform: translateX(20px);\n}\nwx-switch .wx-checkbox-input {\n  margin-right: 5px;\n  -webkit-appearance: none;\n          appearance: none;\n  outline: 0;\n  border: 1px solid #D1D1D1;\n  background-color: #FFFFFF;\n  border-radius: 3px;\n  width: 22px;\n  height: 22px;\n  position: relative;\n  color: #09BB07;\n}\nwx-switch .wx-checkbox-input.wx-checkbox-input-checked:before {\n  font: normal normal normal 14px/1 "weui";\n  content: "\\EA08";\n  color: inherit;\n  font-size: 22px;\n  position: absolute;\n  top: 50%;\n  left: 50%;\n  transform: translate(-50%, -48%) scale(0.73);\n  -webkit-transform: translate(-50%, -48%) scale(0.73);\n}\nwx-switch .wx-checkbox-input.wx-checkbox-input-disabled {\n  background-color: #E1E1E1;\n}\nwx-switch .wx-checkbox-input.wx-checkbox-input-disabled:before {\n  color: #ADADAD;\n}\nwx-text[selectable] {\n  user-select: text;\n  -webkit-user-select: text;\n}\n.wx-toast {\n  position: fixed;\n  z-index: 2000000000;\n  width: 7.6em;\n  min-height: 7.6em;\n  top: 180px;\n  left: 50%;\n  margin-left: -3.8em;\n  background: rgba(40, 40, 40, 0.75);\n  text-align: center;\n  border-radius: 5px;\n  color: #FFFFFF;\n  font-size: 16px;\n  line-height: normal;\n}\n.wx-toast-icon {\n  margin-top: 14px;\n  margin-bottom: 8px;\n  font-family: weui;\n  font-style: normal;\n}\n.wx-toast-content {\n  margin: 0 0 15px;\n}\n.wx-toast-mask {\n  position: fixed;\n  z-index: 1000;\n  background-color: rgba(0, 0, 0, 0.6);\n  width: 100%;\n  height: 100%;\n  top: 0;\n  left: 0;\n}\nwx-video {\n  width: 300px;\n  height: 225px;\n  display: inline-block;\n  line-height: 0;\n  overflow: hidden;\n}\nwx-video[hidden] {\n  display: none;\n}\nwx-video .wx-video-container {\n  width: 100%;\n  height: 100%;\n  background-color: black;\n  display: inline-block;\n  position: relative;\n}\nwx-video video {\n  width: 100%;\n  height: 100%;\n}\nwx-video .wx-video-bar {\n  height: 44px;\n  background-color: rgba(0, 0, 0, 0.5);\n  overflow: hidden;\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  display: -webkit-flex;\n  display: flex;\n  -webkit-align-items: center;\n          align-items: center;\n  padding: 0 10px;\n}\nwx-video .wx-video-bar.full {\n  left: 0;\n}\nwx-video .wx-video-bar.part {\n  margin: 5px;\n  border-radius: 5px;\n  height: 34px;\n}\nwx-video .wx-video-bar.none {\n  display: none;\n}\nwx-video .wx-video-bar > .wx-video-controls {\n  display: -webkit-flex;\n  display: flex;\n  -webkit-flex-grow: 1;\n          flex-grow: 1;\n  margin: 0 8.5px;\n}\nwx-video .wx-video-bar > .wx-video-controls > .wx-video-button {\n  width: 13px;\n  height: 15px;\n  margin: 14.5px 12.5px 14.5px 0;\n  background-size: cover;\n  background-position: 50% 50%;\n  background-repeat: no-repeat;\n}\nwx-video .wx-video-bar > .wx-video-controls > .wx-video-button.play {\n  background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABoAAAAeCAYAAAAy2w7YAAAAAXNSR0IArs4c6QAAAWhJREFUSA1j+P///0cgBoHjQGzCQCsAtgJB/AMy5wCxGNXtQ9iBwvoA5BUCMQvVLEQxHpNzDSjkRhXLMM3GKrIeKKpEkYVYjcUu+AMo3ALE3GRZiN1MvKKPgbIRJFuG10j8koeA0gZEW4jfLIKyf4EqpgOxMEELCRpFnIJ3QGU5QMyM00LizCFa1SWgSkeslhFtBGkKVwGVy6FYSJp+klR/A6quB2JOkIWMIK0oNlOf8xBoZDE9LAI7nYn6HsBq4l96WHQEaLUpAyiOaASeAM2NgvuPBpaACt82IEYtfKls0UagecpwXyAzqGTRdaA57sjmYrAptAjUsCkGYlYMg9EFyLQI1IiZB8Ti6Obh5JNh0QmgHlOcBuKSIMGi50C18UDMiMssvOJEWPQLqKYbiHnxGkRIkoBF24DyaoTMIEoeh0W3geI+RBlArCI0iz4D+RVAzEasfqLVAQ19AcSg5LoYiKWI1kiiQgCMBLnEEcfDSgAAAABJRU5ErkJggg==\');\n}\nwx-video .wx-video-bar > .wx-video-controls > .wx-video-button.pause {\n  background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABIAAAAgCAYAAAAffCjxAAAAAXNSR0IArs4c6QAAAFlJREFUSA3tksEKACAIQ7X//5zq98wOgQayum8QaGweHhMzG/6OujzKAymn+0LMqivu1XznWmX8/echTIyMyAgTwA72iIwwAexgj8gIE8CO3aMRbDPMaEy5BRGaKcZv8YxRAAAAAElFTkSuQmCC\');\n}\nwx-video .wx-video-bar > .wx-video-controls > .wx-video-progress {\n  height: 2px;\n  margin: 21px 12px;\n  background-color: rgba(255, 255, 255, 0.5);\n  position: relative;\n  -webkit-flex-grow: 2;\n          flex-grow: 2;\n}\nwx-video .wx-video-bar > .wx-video-controls > .wx-video-progress > .wx-video-ball {\n  width: 16px;\n  height: 16px;\n  padding: 14px;\n  position: absolute;\n  top: -21px;\n}\nwx-video .wx-video-bar > .wx-video-controls > .wx-video-progress > .wx-video-ball > .wx-video-inner {\n  width: 100%;\n  height: 100%;\n  background-color: #ffffff;\n  border-radius: 50%;\n}\nwx-video .wx-video-bar > .wx-video-controls > .wx-video-progress > .wx-video-inner {\n  width: 0;\n  height: 100%;\n  background-color: #ffffff;\n}\nwx-video .wx-video-bar > .wx-video-controls > .wx-video-time {\n  height: 14.5px;\n  line-height: 14.5px;\n  margin-top: 15px;\n  margin-bottom: 14.5px;\n  font-size: 12px;\n  color: #cbcbcb;\n}\nwx-video .wx-video-bar > .wx-video-danmu-btn {\n  white-space: nowrap;\n  line-height: 1;\n  padding: 2px 10px;\n  border: 1px solid #fff;\n  border-radius: 5px;\n  font-size: 13px;\n  color: #fff;\n  margin: 0 8.5px;\n}\nwx-video .wx-video-bar > .wx-video-danmu-btn.active {\n  border-color: #48c23d;\n  color: #48c23d;\n}\nwx-video .wx-video-bar > .wx-video-fullscreen {\n  width: 17px;\n  height: 17px;\n  /*margin: 13.5px 16px 13.5px 17px;*/\n  margin: 0 8.5px;\n  background-image: url(\'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACIAAAAiCAYAAAA6RwvCAAAAAXNSR0IArs4c6QAAAQRJREFUWAnt1d0NwiAQB/CmS7hHX5zFxLF0Ah2hE/lg7BT4PyMJUj6Oyt299BIioZT7ARYG59wLpTXmoXOMGO/QecxtwyWW4o42AupGALkFdX1MkHxE3Q7jIbQPqNthQogpJoZkMLRlsn/gFMQEk4OoY0oQVUwNoobhQFQwgMxUKFkt0C8+Zy61d8SeR5iHWCLOwF/MCb8Tp//ex3QFsE1HlCfKFUX2OijNFMnPKD7k76YcBoL402Zh8B77+MjlXrVvwfglXA32b0MrRgxCE2nBiEJaMOIQLkYFwsGoQWoYVUgJow4pYD4Weq4ayBqfwDYQmnUK0301kITujuawu65/l2B5A4z3Qe+Ut7EBAAAAAElFTkSuQmCC\');\n  background-size: cover;\n  background-position: 50% 50%;\n  background-repeat: no-repeat;\n}\nwx-video .wx-video-danmu {\n  position: absolute;\n  top: 0;\n  left: 0;\n  bottom: 0;\n  width: 100%;\n  margin-bottom: 44px;\n}\nwx-video .wx-video-danmu > .wx-video-danmu-item {\n  line-height: 1;\n  position: absolute;\n  color: #ffffff;\n  white-space: nowrap;\n  left: 100%;\n  transition: 3s linear;\n}\nwx-view {\n  display: block;\n}\nwx-view[hidden] {\n  display: none;\n}\n.navigator-hover {\n  background-color: rgba(0, 0, 0, 0.1);\n  opacity: 0.7;\n}\nwx-navigator {\n  height: auto;\n  width: auto;\n  display: block;\n}\nwx-navigator[hidden] {\n  display: none;\n}\nwx-action-sheet-cancel {\n  background-color: #FFFFFF;\n  font-size: 18px;\n}\nwx-action-sheet-cancel .wx-action-sheet-middle {\n  background-color: #EFEFF4;\n  height: 6px;\n  width: 100%;\n}\nwx-action-sheet-cancel .wx-action-sheet-cancel {\n  background-color: inherit;\n  position: relative;\n  padding: 10px 0;\n  text-align: center;\n  font-size: inherit;\n  display: block;\n}\nwx-action-sheet-cancel .wx-action-sheet-cancel:before {\n  content: " ";\n  position: absolute;\n  left: 0;\n  top: 0;\n  width: 100%;\n  border-top: 1px solid #D9D9D9;\n  color: #D9D9D9;\n  -webkit-transform-origin: 0 0;\n  transform-origin: 0 0;\n  -webkit-transform: scaleY(0.5);\n  transform: scaleY(0.5);\n}\nwx-action-sheet-cancel .wx-action-sheet-cancel:active {\n  background-color: #ECECEC;\n}\n.textarea-placeholder {\n  color: grey;\n}\nwx-textarea {\n  width: 300px;\n  height: 150px;\n  display: block;\n  position: relative;\n}\nwx-textarea[hidden] {\n  display: none;\n}\nwx-textarea textarea {\n  outline: none;\n  border: none;\n  resize: none;\n  background-color: transparent;\n  line-height: 1.2;\n  z-index: 2;\n  position: absolute;\n  padding: 0;\n  font-family: inherit;\n  background: transparent;\n}\nwx-textarea .compute {\n  color: transparent;\n  top: 0;\n  z-index: 0;\n}\nwx-textarea div {\n  word-break: break-all;\n  line-height: 1.2;\n  font-family: inherit;\n  position: absolute;\n}\n/*wx-share-button {*/\n/*display: inline-block;*/\n/*line-height: 0;*/\n/*z-index: 9999999999;*/\n/*-webkit-tap-highlight-color: transparent;*/\n/*>.wx-share-button-wrapper {*/\n/*width: 36px;*/\n/*height: 36px;*/\n/*display: inline-block;*/\n/*background-size: 100% 100%;*/\n/*background-repeat: no-repeat;*/\n/*-webkit-tap-highlight-color: transparent;*/\n/*}*/\n/*}*/\nwx-contact-button {\n  display: inline-block;\n  line-height: 0;\n  z-index: 9999999999;\n}\nwx-contact-button[hidden] {\n  display: none;\n}\nwx-contact-button > .wx-contact-button-wrapper {\n  width: 18px;\n  height: 18px;\n  display: inline-block;\n  background-size: 100% 100%;\n  background-repeat: no-repeat;\n  -webkit-tap-highlight-color: transparent;\n}\n\n/*# sourceMappingURL=wx-components.css.map */'),
    wx.version = {
        updateTime: "2017.1.4 22:02:06",
        info: "",
        version: 0
    }

__WAWebviewEndTime__ = Date.now();
