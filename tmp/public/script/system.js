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

	var _nprogress = __webpack_require__(4);

	var _nprogress2 = _interopRequireDefault(_nprogress);

	var _util = __webpack_require__(5);

	var util = _interopRequireWildcard(_util);

	var _header = __webpack_require__(9);

	var _header2 = _interopRequireDefault(_header);

	var _bus = __webpack_require__(46);

	var _bus2 = _interopRequireDefault(_bus);

	var _viewManage = __webpack_require__(61);

	var _service = __webpack_require__(133);

	var _command = __webpack_require__(134);

	var command = _interopRequireWildcard(_command);

	var _tabbar = __webpack_require__(204);

	var _tabbar2 = _interopRequireDefault(_tabbar);

	var _native = __webpack_require__(205);

	var nativeMethods = _interopRequireWildcard(_native);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	_header2.default.init();
	_tabbar2.default.init();

	_nprogress2.default.start();

	_bus2.default.on('back', function () {
	  var curr = (0, _viewManage.currentView)();
	  (0, _viewManage.navigateBack)();
	  if (!curr.external) (0, _service.onBack)();
	});

	_tabbar2.default.on('active', function (pagePath) {
	  var curr = (0, _viewManage.currentView)();
	  if (curr && curr.url == pagePath) return;

	  var _util$parsePath = util.parsePath(pagePath),
	      path = _util$parsePath.path,
	      query = _util$parsePath.query;

	  (0, _viewManage.navigateTo)(pagePath, true);
	  (0, _service.lifeSycleEvent)(path, query, 'switchTab');
	});

	_bus2.default.on('route', function (n, curr) {
	  _tabbar2.default.show(curr.url);
	});

	function sdk(data) {
	  var msg = data.msg;
	  if (msg) {
	    var sdkName = msg.sdkName;
	    if (sdkName == 'showPickerView') {
	      command.showPickerView(data, msg.args);
	    } else if (sdkName == 'showDatePickerView') {
	      command.showDatePickerView(data, msg.args);
	    } else if (sdkName == 'onKeyboardComplete') {
	      showConsole(msg.sdkName, 'REGISTER_SDK');
	    } else if (sdkName == 'getPublicLibVersion' || sdkName == 'onKeyboardConfirm' || sdkName == 'disableScrollBounce' || sdkName == 'onTextAreaHeightChange' || sdkName == 'onKeyboardShow') {
	      //do nothing
	    } else {
	      console.warn('Ignored EXEC_JSSDK ' + (0, _stringify2.default)(data.msg));
	    }
	  }
	}

	function showConsole(sdkName, type) {
	  var view = (0, _viewManage.currentView)();
	  view.postMessage({
	    msg: {
	      act: "JSSDKLOG",
	      isErr: false,
	      sdkName: sdkName,
	      type: type,
	      inputArgs: {},
	      sdkRes: {}
	    },
	    command: "SHOW_CONSOLE_LOG"
	  });
	}

	var systemBridge = {
	  doSyncCommand: function doSyncCommand(params) {
	    var method = params.sdkName;
	    if (nativeMethods.hasOwnProperty(method)) {
	      return nativeMethods[method](params);
	    } else {
	      console.warn(method + ' not found on native.js');
	    }
	  },
	  doCommand: function doCommand(data) {
	    data = data || {};
	    var cmd = data.command;
	    var msg = data.msg;
	    // location picker of map
	    if (data.module == 'locationPicker') {
	      (0, _viewManage.currentView)().setLocation(data);
	      return;
	    }
	    if (data.to != "backgroundjs") return;

	    if (data.command == 'EXEC_JSSDK') {
	      //from view
	      sdk(data);
	    } else if (cmd == 'TO_APP_SERVICE') {
	      //from view
	      delete data.command;
	      if (msg && msg.eventName == 'custom_event_DOMContentLoaded') {
	        _bus2.default.emit('ready', data.webviewID);
	        _nprogress2.default.done();
	      }
	      (0, _service.toAppService)(data);
	    } else if (cmd == 'COMMAND_FROM_ASJS') {
	      //from service
	      var sdkName = data.sdkName;
	      if (command.hasOwnProperty(sdkName)) {
	        command[sdkName](data);
	      } else {
	        console.warn('Method ' + sdkName + ' not implemented for command!');
	      }
	    } else if (cmd == 'PULLDOWN_REFRESH') {
	      command['PULLDOWN_REFRESH'](data);
	    } else if (cmd == 'WEBVIEW_READY') {
	      // TODO figure out WTF is this
	    } else {
	      console.warn('Command ' + cmd + ' not recognized!');
	    }
	  }
	};

	window.systemBridge = systemBridge;

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

	var __WEBPACK_AMD_DEFINE_FACTORY__, __WEBPACK_AMD_DEFINE_RESULT__;/* NProgress, (c) 2013, 2014 Rico Sta. Cruz - http://ricostacruz.com/nprogress
	 * @license MIT */

	;(function(root, factory) {

	  if (true) {
	    !(__WEBPACK_AMD_DEFINE_FACTORY__ = (factory), __WEBPACK_AMD_DEFINE_RESULT__ = (typeof __WEBPACK_AMD_DEFINE_FACTORY__ === 'function' ? (__WEBPACK_AMD_DEFINE_FACTORY__.call(exports, __webpack_require__, exports, module)) : __WEBPACK_AMD_DEFINE_FACTORY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	  } else if (typeof exports === 'object') {
	    module.exports = factory();
	  } else {
	    root.NProgress = factory();
	  }

	})(this, function() {
	  var NProgress = {};

	  NProgress.version = '0.2.0';

	  var Settings = NProgress.settings = {
	    minimum: 0.08,
	    easing: 'ease',
	    positionUsing: '',
	    speed: 200,
	    trickle: true,
	    trickleRate: 0.02,
	    trickleSpeed: 800,
	    showSpinner: true,
	    barSelector: '[role="bar"]',
	    spinnerSelector: '[role="spinner"]',
	    parent: 'body',
	    template: '<div class="bar" role="bar"><div class="peg"></div></div><div class="spinner" role="spinner"><div class="spinner-icon"></div></div>'
	  };

	  /**
	   * Updates configuration.
	   *
	   *     NProgress.configure({
	   *       minimum: 0.1
	   *     });
	   */
	  NProgress.configure = function(options) {
	    var key, value;
	    for (key in options) {
	      value = options[key];
	      if (value !== undefined && options.hasOwnProperty(key)) Settings[key] = value;
	    }

	    return this;
	  };

	  /**
	   * Last number.
	   */

	  NProgress.status = null;

	  /**
	   * Sets the progress bar status, where `n` is a number from `0.0` to `1.0`.
	   *
	   *     NProgress.set(0.4);
	   *     NProgress.set(1.0);
	   */

	  NProgress.set = function(n) {
	    var started = NProgress.isStarted();

	    n = clamp(n, Settings.minimum, 1);
	    NProgress.status = (n === 1 ? null : n);

	    var progress = NProgress.render(!started),
	        bar      = progress.querySelector(Settings.barSelector),
	        speed    = Settings.speed,
	        ease     = Settings.easing;

	    progress.offsetWidth; /* Repaint */

	    queue(function(next) {
	      // Set positionUsing if it hasn't already been set
	      if (Settings.positionUsing === '') Settings.positionUsing = NProgress.getPositioningCSS();

	      // Add transition
	      css(bar, barPositionCSS(n, speed, ease));

	      if (n === 1) {
	        // Fade out
	        css(progress, { 
	          transition: 'none', 
	          opacity: 1 
	        });
	        progress.offsetWidth; /* Repaint */

	        setTimeout(function() {
	          css(progress, { 
	            transition: 'all ' + speed + 'ms linear', 
	            opacity: 0 
	          });
	          setTimeout(function() {
	            NProgress.remove();
	            next();
	          }, speed);
	        }, speed);
	      } else {
	        setTimeout(next, speed);
	      }
	    });

	    return this;
	  };

	  NProgress.isStarted = function() {
	    return typeof NProgress.status === 'number';
	  };

	  /**
	   * Shows the progress bar.
	   * This is the same as setting the status to 0%, except that it doesn't go backwards.
	   *
	   *     NProgress.start();
	   *
	   */
	  NProgress.start = function() {
	    if (!NProgress.status) NProgress.set(0);

	    var work = function() {
	      setTimeout(function() {
	        if (!NProgress.status) return;
	        NProgress.trickle();
	        work();
	      }, Settings.trickleSpeed);
	    };

	    if (Settings.trickle) work();

	    return this;
	  };

	  /**
	   * Hides the progress bar.
	   * This is the *sort of* the same as setting the status to 100%, with the
	   * difference being `done()` makes some placebo effect of some realistic motion.
	   *
	   *     NProgress.done();
	   *
	   * If `true` is passed, it will show the progress bar even if its hidden.
	   *
	   *     NProgress.done(true);
	   */

	  NProgress.done = function(force) {
	    if (!force && !NProgress.status) return this;

	    return NProgress.inc(0.3 + 0.5 * Math.random()).set(1);
	  };

	  /**
	   * Increments by a random amount.
	   */

	  NProgress.inc = function(amount) {
	    var n = NProgress.status;

	    if (!n) {
	      return NProgress.start();
	    } else {
	      if (typeof amount !== 'number') {
	        amount = (1 - n) * clamp(Math.random() * n, 0.1, 0.95);
	      }

	      n = clamp(n + amount, 0, 0.994);
	      return NProgress.set(n);
	    }
	  };

	  NProgress.trickle = function() {
	    return NProgress.inc(Math.random() * Settings.trickleRate);
	  };

	  /**
	   * Waits for all supplied jQuery promises and
	   * increases the progress as the promises resolve.
	   *
	   * @param $promise jQUery Promise
	   */
	  (function() {
	    var initial = 0, current = 0;

	    NProgress.promise = function($promise) {
	      if (!$promise || $promise.state() === "resolved") {
	        return this;
	      }

	      if (current === 0) {
	        NProgress.start();
	      }

	      initial++;
	      current++;

	      $promise.always(function() {
	        current--;
	        if (current === 0) {
	            initial = 0;
	            NProgress.done();
	        } else {
	            NProgress.set((initial - current) / initial);
	        }
	      });

	      return this;
	    };

	  })();

	  /**
	   * (Internal) renders the progress bar markup based on the `template`
	   * setting.
	   */

	  NProgress.render = function(fromStart) {
	    if (NProgress.isRendered()) return document.getElementById('nprogress');

	    addClass(document.documentElement, 'nprogress-busy');
	    
	    var progress = document.createElement('div');
	    progress.id = 'nprogress';
	    progress.innerHTML = Settings.template;

	    var bar      = progress.querySelector(Settings.barSelector),
	        perc     = fromStart ? '-100' : toBarPerc(NProgress.status || 0),
	        parent   = document.querySelector(Settings.parent),
	        spinner;
	    
	    css(bar, {
	      transition: 'all 0 linear',
	      transform: 'translate3d(' + perc + '%,0,0)'
	    });

	    if (!Settings.showSpinner) {
	      spinner = progress.querySelector(Settings.spinnerSelector);
	      spinner && removeElement(spinner);
	    }

	    if (parent != document.body) {
	      addClass(parent, 'nprogress-custom-parent');
	    }

	    parent.appendChild(progress);
	    return progress;
	  };

	  /**
	   * Removes the element. Opposite of render().
	   */

	  NProgress.remove = function() {
	    removeClass(document.documentElement, 'nprogress-busy');
	    removeClass(document.querySelector(Settings.parent), 'nprogress-custom-parent');
	    var progress = document.getElementById('nprogress');
	    progress && removeElement(progress);
	  };

	  /**
	   * Checks if the progress bar is rendered.
	   */

	  NProgress.isRendered = function() {
	    return !!document.getElementById('nprogress');
	  };

	  /**
	   * Determine which positioning CSS rule to use.
	   */

	  NProgress.getPositioningCSS = function() {
	    // Sniff on document.body.style
	    var bodyStyle = document.body.style;

	    // Sniff prefixes
	    var vendorPrefix = ('WebkitTransform' in bodyStyle) ? 'Webkit' :
	                       ('MozTransform' in bodyStyle) ? 'Moz' :
	                       ('msTransform' in bodyStyle) ? 'ms' :
	                       ('OTransform' in bodyStyle) ? 'O' : '';

	    if (vendorPrefix + 'Perspective' in bodyStyle) {
	      // Modern browsers with 3D support, e.g. Webkit, IE10
	      return 'translate3d';
	    } else if (vendorPrefix + 'Transform' in bodyStyle) {
	      // Browsers without 3D support, e.g. IE9
	      return 'translate';
	    } else {
	      // Browsers without translate() support, e.g. IE7-8
	      return 'margin';
	    }
	  };

	  /**
	   * Helpers
	   */

	  function clamp(n, min, max) {
	    if (n < min) return min;
	    if (n > max) return max;
	    return n;
	  }

	  /**
	   * (Internal) converts a percentage (`0..1`) to a bar translateX
	   * percentage (`-100%..0%`).
	   */

	  function toBarPerc(n) {
	    return (-1 + n) * 100;
	  }


	  /**
	   * (Internal) returns the correct CSS for changing the bar's
	   * position given an n percentage, and speed and ease from Settings
	   */

	  function barPositionCSS(n, speed, ease) {
	    var barCSS;

	    if (Settings.positionUsing === 'translate3d') {
	      barCSS = { transform: 'translate3d('+toBarPerc(n)+'%,0,0)' };
	    } else if (Settings.positionUsing === 'translate') {
	      barCSS = { transform: 'translate('+toBarPerc(n)+'%,0)' };
	    } else {
	      barCSS = { 'margin-left': toBarPerc(n)+'%' };
	    }

	    barCSS.transition = 'all '+speed+'ms '+ease;

	    return barCSS;
	  }

	  /**
	   * (Internal) Queues a function to be executed.
	   */

	  var queue = (function() {
	    var pending = [];
	    
	    function next() {
	      var fn = pending.shift();
	      if (fn) {
	        fn(next);
	      }
	    }

	    return function(fn) {
	      pending.push(fn);
	      if (pending.length == 1) next();
	    };
	  })();

	  /**
	   * (Internal) Applies css properties to an element, similar to the jQuery 
	   * css method.
	   *
	   * While this helper does assist with vendor prefixed property names, it 
	   * does not perform any manipulation of values prior to setting styles.
	   */

	  var css = (function() {
	    var cssPrefixes = [ 'Webkit', 'O', 'Moz', 'ms' ],
	        cssProps    = {};

	    function camelCase(string) {
	      return string.replace(/^-ms-/, 'ms-').replace(/-([\da-z])/gi, function(match, letter) {
	        return letter.toUpperCase();
	      });
	    }

	    function getVendorProp(name) {
	      var style = document.body.style;
	      if (name in style) return name;

	      var i = cssPrefixes.length,
	          capName = name.charAt(0).toUpperCase() + name.slice(1),
	          vendorName;
	      while (i--) {
	        vendorName = cssPrefixes[i] + capName;
	        if (vendorName in style) return vendorName;
	      }

	      return name;
	    }

	    function getStyleProp(name) {
	      name = camelCase(name);
	      return cssProps[name] || (cssProps[name] = getVendorProp(name));
	    }

	    function applyCss(element, prop, value) {
	      prop = getStyleProp(prop);
	      element.style[prop] = value;
	    }

	    return function(element, properties) {
	      var args = arguments,
	          prop, 
	          value;

	      if (args.length == 2) {
	        for (prop in properties) {
	          value = properties[prop];
	          if (value !== undefined && properties.hasOwnProperty(prop)) applyCss(element, prop, value);
	        }
	      } else {
	        applyCss(element, args[1], args[2]);
	      }
	    }
	  })();

	  /**
	   * (Internal) Determines if an element or space separated list of class names contains a class name.
	   */

	  function hasClass(element, name) {
	    var list = typeof element == 'string' ? element : classList(element);
	    return list.indexOf(' ' + name + ' ') >= 0;
	  }

	  /**
	   * (Internal) Adds a class to an element.
	   */

	  function addClass(element, name) {
	    var oldList = classList(element),
	        newList = oldList + name;

	    if (hasClass(oldList, name)) return; 

	    // Trim the opening space.
	    element.className = newList.substring(1);
	  }

	  /**
	   * (Internal) Removes a class from an element.
	   */

	  function removeClass(element, name) {
	    var oldList = classList(element),
	        newList;

	    if (!hasClass(element, name)) return;

	    // Replace the class name.
	    newList = oldList.replace(' ' + name + ' ', ' ');

	    // Trim the opening and closing spaces.
	    element.className = newList.substring(1, newList.length - 1);
	  }

	  /**
	   * (Internal) Gets a space separated list of the class names on the element. 
	   * The list is wrapped with a single space on each end to facilitate finding 
	   * matches within the list.
	   */

	  function classList(element) {
	    return (' ' + (element.className || '') + ' ').replace(/\s+/gi, ' ');
	  }

	  /**
	   * (Internal) Removes an element from the DOM.
	   */

	  function removeElement(element) {
	    element && element.parentNode && element.parentNode.removeChild(element);
	  }

	  return NProgress;
	});



/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.uid = uid;
	exports.createFrame = createFrame;
	exports.parsePath = parsePath;
	exports.validPath = validPath;
	exports.isTabbar = isTabbar;
	exports.reload = reload;
	exports.navigateHome = navigateHome;
	exports.redirectTo = redirectTo;
	exports.getRedirectData = getRedirectData;
	exports.dataURItoBlob = dataURItoBlob;
	exports.range = range;
	exports.toNumber = toNumber;

	var _querystring = __webpack_require__(6);

	var _querystring2 = _interopRequireDefault(_querystring);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var id = 0;
	function uid() {
	  return id++;
	}

	function createFrame(id, src, hidden) {
	  var parent = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : document.body;

	  var el = document.createElement('iframe');
	  el.setAttribute('src', src);
	  el.setAttribute('id', id);
	  el.setAttribute('seamless', "seamless");
	  el.setAttribute('sandbox', "allow-scripts allow-same-origin allow-forms allow-modals");
	  el.setAttribute('frameborder', "0");
	  el.setAttribute('width', hidden ? "0" : "100%");
	  el.setAttribute('height', hidden ? "0" : "100%");
	  if (hidden) {
	    el.setAttribute('style', 'width:0;height:0;border:0; display:none;');
	  }
	  parent.appendChild(el);
	  return el;
	}

	function parsePath(path) {
	  var parts = path.split(/\?/);
	  return {
	    path: parts[0],
	    query: _querystring2.default.parse(parts[1])
	  };
	}

	function validPath(p) {
	  //是否是有效页面地址
	  var pages = window.__wxConfig__.pages;

	  var _parsePath = parsePath(p),
	      path = _parsePath.path;

	  return pages.indexOf(path) !== -1;
	}

	function isTabbar(url) {
	  var list = window.__wxConfig__.tabBar && window.__wxConfig__.tabBar.list;
	  if (!list) return;
	  var pages = list.map(function (o) {
	    return o.pagePath;
	  });
	  return pages.indexOf(url) !== -1;
	}

	function reload() {
	  location.reload();
	}

	function navigateHome() {
	  var home = location.protocol + '//' + location.host + location.pathname;
	  if (typeof location.replace == 'function') {
	    location.replace(home);
	  } else if (typeof history.replaceState == 'function') {
	    window.history.replaceState({}, '', home);
	    location.reload();
	  } else {
	    location.hash = '#';
	    location.reload();
	  }
	}

	function redirectTo(url) {
	  var home = location.protocol + '//' + location.host + location.pathname;
	  if (typeof history.replaceState == 'function') {
	    history.replaceState({}, '', home + '#!' + url);
	  }
	}

	function getRedirectData(url, webviewID) {
	  return {
	    to: 'backgroundjs',
	    msg: {
	      eventName: 'custom_event_INVOKE_METHOD',
	      data: {
	        data: {
	          name: 'navigateTo',
	          args: {
	            url: url
	          }
	        },
	        options: {
	          timestamp: Date.now()
	        }
	      }
	    },
	    comefrom: 'webframe',
	    webviewID: webviewID
	  };
	}

	function dataURItoBlob(dataURI) {
	  // convert base64 to raw binary data held in a string
	  // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
	  var byteString = atob(dataURI.split(',')[1]);

	  // separate out the mime component
	  var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];

	  // write the bytes of the string to an ArrayBuffer
	  var ab = new ArrayBuffer(byteString.length);
	  var ia = new Uint8Array(ab);
	  for (var i = 0; i < byteString.length; i++) {
	    ia[i] = byteString.charCodeAt(i);
	  }

	  // write the ArrayBuffer to a blob, and you're done
	  var bb = new Blob([ab], { type: mimeString });
	  return URL.createObjectURL(bb);
	}

	function range(n) {
	  var start = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;
	  var suffix = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : '';

	  var arr = [];
	  for (var i = start; i <= n; i++) {
	    arr.push(i < 10 ? '0' + i + suffix : '' + i + suffix);
	  }
	  return arr;
	}

	function toNumber(arr) {
	  if (Array.isArray(arr)) return arr.map(function (n) {
	    return Number(n);
	  });
	  if (typeof arr === 'string') return Number(arr);
	  return arr;
	}

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var trim = __webpack_require__(7);
	var type = __webpack_require__(8);

	var pattern = /(\w+)\[(\d+)\]/

	/**
	 * Safely encode the given string
	 * 
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	var encode = function(str) {
	  try {
	    return encodeURIComponent(str);
	  } catch (e) {
	    return str;
	  }
	};

	/**
	 * Safely decode the string
	 * 
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	var decode = function(str) {
	  try {
	    return decodeURIComponent(str.replace(/\+/g, ' '));
	  } catch (e) {
	    return str;
	  }
	}

	/**
	 * Parse the given query `str`.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api public
	 */

	exports.parse = function(str){
	  if ('string' != typeof str) return {};

	  str = trim(str);
	  if ('' == str) return {};
	  if ('?' == str.charAt(0)) str = str.slice(1);

	  var obj = {};
	  var pairs = str.split('&');
	  for (var i = 0; i < pairs.length; i++) {
	    var parts = pairs[i].split('=');
	    var key = decode(parts[0]);
	    var m;

	    if (m = pattern.exec(key)) {
	      obj[m[1]] = obj[m[1]] || [];
	      obj[m[1]][m[2]] = decode(parts[1]);
	      continue;
	    }

	    obj[parts[0]] = null == parts[1]
	      ? ''
	      : decode(parts[1]);
	  }

	  return obj;
	};

	/**
	 * Stringify the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api public
	 */

	exports.stringify = function(obj){
	  if (!obj) return '';
	  var pairs = [];

	  for (var key in obj) {
	    var value = obj[key];

	    if ('array' == type(value)) {
	      for (var i = 0; i < value.length; ++i) {
	        pairs.push(encode(key + '[' + i + ']') + '=' + encode(value[i]));
	      }
	      continue;
	    }

	    pairs.push(encode(key) + '=' + encode(obj[key]));
	  }

	  return pairs.join('&');
	};


/***/ }),
/* 7 */
/***/ (function(module, exports) {

	
	exports = module.exports = trim;

	function trim(str){
	  return str.replace(/^\s*|\s*$/g, '');
	}

	exports.left = function(str){
	  return str.replace(/^\s*/, '');
	};

	exports.right = function(str){
	  return str.replace(/\s*$/, '');
	};


/***/ }),
/* 8 */
/***/ (function(module, exports) {

	/**
	 * toString ref.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Return the type of `val`.
	 *
	 * @param {Mixed} val
	 * @return {String}
	 * @api public
	 */

	module.exports = function(val){
	  switch (toString.call(val)) {
	    case '[object Date]': return 'date';
	    case '[object RegExp]': return 'regexp';
	    case '[object Arguments]': return 'arguments';
	    case '[object Array]': return 'array';
	    case '[object Error]': return 'error';
	  }

	  if (val === null) return 'null';
	  if (val === undefined) return 'undefined';
	  if (val !== val) return 'nan';
	  if (val && val.nodeType === 1) return 'element';

	  val = val.valueOf
	    ? val.valueOf()
	    : Object.prototype.valueOf.apply(val)

	  return typeof val;
	};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(10);

	var _assign2 = _interopRequireDefault(_assign);

	var _bus = __webpack_require__(46);

	var _bus2 = _interopRequireDefault(_bus);

	var _actionsheet = __webpack_require__(48);

	var _actionsheet2 = _interopRequireDefault(_actionsheet);

	var _viewManage = __webpack_require__(61);

	var _storage = __webpack_require__(125);

	var _storage2 = _interopRequireDefault(_storage);

	var _toast = __webpack_require__(126);

	var _toast2 = _interopRequireDefault(_toast);

	var _util = __webpack_require__(5);

	var util = _interopRequireWildcard(_util);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var win = window.__wxConfig__['window'];
	var header = {
	  dom: null,
	  init: function init() {
	    this.state = {
	      backgroundColor: win.navigationBarBackgroundColor,
	      color: win.navigationBarTextStyle,
	      title: win.navigationBarTitleText,
	      loading: false,
	      backText: '返回',
	      back: false,
	      sendText: false
	    };
	    if (!this.dom) {
	      this.dom = {
	        head: this.$('.jshook-ws-head'),
	        headBack: this.$('.jshook-ws-head-back'),
	        headBackText: this.$('.jshook-ws-head-back-text'),
	        headHome: this.$('.jshook-ws-head-home'),
	        headTitle: this.$('.jshook-ws-head-title'),
	        headOption: this.$('.jshook-ws-head-option')
	      };
	      this.dom.headBackSpan = this.dom.headBack.querySelector('span');
	      this.dom.headTitleSpan = this.dom.headTitle.querySelector('span');
	      this.dom.headBackI = this.dom.headBack.querySelector('i');
	      this.dom.headHomeI = this.dom.headHome.querySelector('i');
	      this.dom.headTitleI = this.dom.headTitle.querySelector('i');
	      this.dom.headBack.onclick = this.onBack.bind(null);
	      this.dom.headHome.onclick = this.onHome.bind(null);
	      this.dom.headOption.onclick = this.onOptions.bind(null);
	    }
	    this.dom.head.style.display = 'block';
	    _bus2.default.on('route', this.reset.bind(this));
	    this.setState();
	  },
	  $: function $(name) {
	    return document.querySelector(name);
	  },
	  reset: function reset() {
	    var d = {
	      backgroundColor: win.navigationBarBackgroundColor,
	      color: win.navigationBarTextStyle,
	      title: win.navigationBarTitleText,
	      loading: false,
	      back: false
	    };
	    var curr = (0, _viewManage.currentView)();

	    var winConfig = win.pages[curr.path] || {};
	    var tabBar = window.__wxConfig__.tabBar;

	    var top = tabBar && tabBar.position == 'top';
	    var hide = top && util.isTabbar(curr.url);
	    if (curr.isMap) {
	      this.setState({
	        hide: false,
	        backgroundColor: 'rgb(0, 0, 0)',
	        color: '#ffffff',
	        title: '位置',
	        loading: false,
	        backText: '取消',
	        sendText: true
	      });
	    } else {
	      this.setState({
	        hide: hide,
	        backgroundColor: winConfig.navigationBarBackgroundColor || d.backgroundColor,
	        color: winConfig.navigationBarTextStyle || d.color,
	        title: winConfig.navigationBarTitleText || d.title,
	        loading: false,
	        backText: '返回',
	        sendText: false,
	        back: curr.pid != null
	      });
	    }
	  },
	  onBack: function onBack(e) {
	    e.preventDefault();
	    _bus2.default.emit('back');
	  },
	  onSend: function onSend(e) {
	    // TODO send location
	    e.stopPropagation();
	    _bus2.default.emit('location', (0, _viewManage.currentView)().location);
	    this.onBack(e);
	  },
	  onOptions: function onOptions(e) {
	    e.preventDefault();
	    (0, _actionsheet2.default)({
	      refresh: {
	        text: '回主页',
	        callback: function callback() {
	          window.sessionStorage.removeItem('routes');
	          util.navigateHome();
	        }
	      },
	      clear: {
	        text: '清除数据缓存',
	        callback: function callback() {
	          if (window.localStorage != null) {
	            _storage2.default.clear();
	            (0, _toast2.default)('数据缓存已清除', { type: 'success' });
	          }
	        }
	      },
	      cancel: {
	        text: '取消'
	      }
	    }).then(function () {
	      header.sheetShown = true;
	    });
	  },
	  setTitle: function setTitle(title) {
	    this.dom.headTitleSpan.innerHTML = title;
	  },
	  showLoading: function showLoading() {
	    this.dom.headTitleI.style.display = 'inline-block';
	  },
	  hideLoading: function hideLoading() {
	    this.dom.headTitleI.style.display = 'none';
	  },
	  onHome: function onHome() {
	    util.navigateHome();
	  },
	  setState: function setState(data) {
	    if (data) (0, _assign2.default)(this.state, data);
	    var state = this.state;
	    this.dom.head.style.backgroundColor = state.backgroundColor;
	    this.dom.head.style.display = state.hide ? 'none' : 'flex';
	    this.dom.headBack.style.display = state.back ? 'flex' : 'none';
	    this.dom.headBackSpan.style.color = state.color;
	    this.dom.headTitle.style.color = state.color;
	    this.dom.headBackSpan.innerHTML = state.backText;
	    this.dom.headTitleSpan.innerHTML = state.title;
	    this.dom.headBackI.style.display = !state.sendText ? 'inline-block' : 'none';
	    this.dom.headTitleI.style.display = state.loading ? 'inline-block' : 'none';
	    this.dom.headBackI.style.borderLeft = '1px solid ' + state.color;
	    this.dom.headBackI.style.borderBottom = '1px solid ' + state.color;
	    this.dom.headHome.style.display = state.back ? 'none' : 'flex';
	    this.dom.headHomeI.className = state.color == 'white' ? 'head-home-icon white' : 'head-home-icon';
	    this.dom.headHomeI.style.display = state.back ? 'none' : 'flex';
	    if (state.sendText) {
	      this.dom.headOption.innerHTML = '<div>发送</div>';
	      this.dom.headOption.querySelector('div').onclick = this.onSend.bind(this);
	    } else {
	      this.dom.headOption.innerHTML = '<i class="head-option-icon' + (state.color == 'white' ? ' white' : '') + '"></i>';
	    }
	  }
	};
	exports.default = header;

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(11), __esModule: true };

/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(12);
	module.exports = __webpack_require__(3).Object.assign;

/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.1 Object.assign(target, source)
	var $export = __webpack_require__(13);

	$export($export.S + $export.F, 'Object', {assign: __webpack_require__(27)});

/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(14)
	  , core      = __webpack_require__(3)
	  , ctx       = __webpack_require__(15)
	  , hide      = __webpack_require__(17)
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
/* 14 */
/***/ (function(module, exports) {

	// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
	var global = module.exports = typeof window != 'undefined' && window.Math == Math
	  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
	if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef

/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

	// optional / simple context binding
	var aFunction = __webpack_require__(16);
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
/* 16 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
	  return it;
	};

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

	var dP         = __webpack_require__(18)
	  , createDesc = __webpack_require__(26);
	module.exports = __webpack_require__(22) ? function(object, key, value){
	  return dP.f(object, key, createDesc(1, value));
	} : function(object, key, value){
	  object[key] = value;
	  return object;
	};

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject       = __webpack_require__(19)
	  , IE8_DOM_DEFINE = __webpack_require__(21)
	  , toPrimitive    = __webpack_require__(25)
	  , dP             = Object.defineProperty;

	exports.f = __webpack_require__(22) ? Object.defineProperty : function defineProperty(O, P, Attributes){
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
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(20);
	module.exports = function(it){
	  if(!isObject(it))throw TypeError(it + ' is not an object!');
	  return it;
	};

/***/ }),
/* 20 */
/***/ (function(module, exports) {

	module.exports = function(it){
	  return typeof it === 'object' ? it !== null : typeof it === 'function';
	};

/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = !__webpack_require__(22) && !__webpack_require__(23)(function(){
	  return Object.defineProperty(__webpack_require__(24)('div'), 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

	// Thank's IE8 for his funny defineProperty
	module.exports = !__webpack_require__(23)(function(){
	  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
	});

/***/ }),
/* 23 */
/***/ (function(module, exports) {

	module.exports = function(exec){
	  try {
	    return !!exec();
	  } catch(e){
	    return true;
	  }
	};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

	var isObject = __webpack_require__(20)
	  , document = __webpack_require__(14).document
	  // in old IE typeof document.createElement is 'object'
	  , is = isObject(document) && isObject(document.createElement);
	module.exports = function(it){
	  return is ? document.createElement(it) : {};
	};

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.1 ToPrimitive(input [, PreferredType])
	var isObject = __webpack_require__(20);
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
/* 26 */
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
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// 19.1.2.1 Object.assign(target, source, ...)
	var getKeys  = __webpack_require__(28)
	  , gOPS     = __webpack_require__(43)
	  , pIE      = __webpack_require__(44)
	  , toObject = __webpack_require__(45)
	  , IObject  = __webpack_require__(32)
	  , $assign  = Object.assign;

	// should work with symbols and should have deterministic property order (V8 bug)
	module.exports = !$assign || __webpack_require__(23)(function(){
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
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 / 15.2.3.14 Object.keys(O)
	var $keys       = __webpack_require__(29)
	  , enumBugKeys = __webpack_require__(42);

	module.exports = Object.keys || function keys(O){
	  return $keys(O, enumBugKeys);
	};

/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

	var has          = __webpack_require__(30)
	  , toIObject    = __webpack_require__(31)
	  , arrayIndexOf = __webpack_require__(35)(false)
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
/* 30 */
/***/ (function(module, exports) {

	var hasOwnProperty = {}.hasOwnProperty;
	module.exports = function(it, key){
	  return hasOwnProperty.call(it, key);
	};

/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

	// to indexed object, toObject with fallback for non-array-like ES3 strings
	var IObject = __webpack_require__(32)
	  , defined = __webpack_require__(34);
	module.exports = function(it){
	  return IObject(defined(it));
	};

/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for non-array-like ES3 and non-enumerable old V8 strings
	var cof = __webpack_require__(33);
	module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
	  return cof(it) == 'String' ? it.split('') : Object(it);
	};

/***/ }),
/* 33 */
/***/ (function(module, exports) {

	var toString = {}.toString;

	module.exports = function(it){
	  return toString.call(it).slice(8, -1);
	};

/***/ }),
/* 34 */
/***/ (function(module, exports) {

	// 7.2.1 RequireObjectCoercible(argument)
	module.exports = function(it){
	  if(it == undefined)throw TypeError("Can't call method on  " + it);
	  return it;
	};

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

	// false -> Array#indexOf
	// true  -> Array#includes
	var toIObject = __webpack_require__(31)
	  , toLength  = __webpack_require__(36)
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
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.15 ToLength
	var toInteger = __webpack_require__(37)
	  , min       = Math.min;
	module.exports = function(it){
	  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
	};

/***/ }),
/* 37 */
/***/ (function(module, exports) {

	// 7.1.4 ToInteger
	var ceil  = Math.ceil
	  , floor = Math.floor;
	module.exports = function(it){
	  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
	};

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(37)
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

	var global = __webpack_require__(14)
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
/***/ (function(module, exports) {

	exports.f = Object.getOwnPropertySymbols;

/***/ }),
/* 44 */
/***/ (function(module, exports) {

	exports.f = {}.propertyIsEnumerable;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.1.13 ToObject(argument)
	var defined = __webpack_require__(34);
	module.exports = function(it){
	  return Object(defined(it));
	};

/***/ }),
/* 46 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _emitter = __webpack_require__(47);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = new _emitter2.default();

/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Expose `Emitter`.
	 */

	if (true) {
	  module.exports = Emitter;
	}

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

	var tap = __webpack_require__(49)
	var domify = __webpack_require__(50)
	var template = __webpack_require__(51)
	var classes = __webpack_require__(52)
	var event = __webpack_require__(54)
	var detect = __webpack_require__(55)
	var transitionEnd = detect.transitionend

	var hasTouch = __webpack_require__(60)


	document.addEventListener('touchstart', function(){}, true)
	var shown

	/**
	 * create action sheet
	 * option contains key for actions.
	 * action should contain text and callback
	 *
	 * @public
	 * @param {Object} option
	 * @returns {Promise}
	 */
	module.exports = function (option) {
	  if (shown) return
	  var el = domify(template)
	  var body = el.querySelector('.actionsheet-body')
	  Object.keys(option).forEach(function (key) {
	    if (key == 'cancel') return
	    var o = option[key]
	    if (o.hide === true) return
	    body.appendChild(domify('<div class="actionsheet-item" data-action="' + key + '">' + o.text + '</div>'))
	  })
	  if (option.cancel) {
	    var text = option.cancel.text || 'cancel'
	    body.parentNode.appendChild(domify('<div class="actionsheet-foot"><div class="actionsheet-item cancel">' + text + '</div></div>'))
	  }
	  document.body.appendChild(el)
	  shown = true

	  function onClick(e) {
	    var target = e.target
	    if (target.hasAttribute('data-action')){
	      var action = target.dataset.action
	      var opt = option[action]
	      var cb = opt.callback
	      if (opt.redirect) cb = function () {
	        window.location.href = opt.redirect
	      }
	      var nowait = opt.nowait
	      if (!cb) return
	      if (nowait) {
	        cleanUp()
	        cb()
	      } else {
	        if (cb) cleanUp().then(cb)
	      }
	    } else {
	      cleanUp()
	    }
	  }
	  var ontap = tap(onClick)
	  if (hasTouch) {
	    event.bind(el, 'touchstart', ontap)
	  } else {
	    event.bind(el, 'click', onClick)
	  }


	  function cleanUp() {
	    return new Promise(function (resolve) {
	      event.unbind(el, 'touchstart', ontap)
	      event.unbind(el, 'click', onClick)
	      event.bind(el, transitionEnd, end)
	      classes(el).remove('active')
	      function end() {
	        shown = false
	        event.unbind(el, transitionEnd, end)
	        if (el.parentNode) el.parentNode.removeChild(el)
	        resolve()
	      }
	    })
	  }
	  return new Promise(function (resolve) {
	    setTimeout(function () {
	      classes(el).add('active')
	      resolve()
	    }, 20)
	  })
	}


/***/ }),
/* 49 */
/***/ (function(module, exports) {

	var endEvents = [
	  'touchend'
	]

	module.exports = Tap

	// default tap timeout in ms
	Tap.timeout = 200

	function Tap(callback, options) {
	  options = options || {}
	  // if the user holds his/her finger down for more than 200ms,
	  // then it's not really considered a tap.
	  // however, you can make this configurable.
	  var timeout = options.timeout || Tap.timeout

	  // to keep track of the original listener
	  listener.handler = callback

	  return listener

	  // el.addEventListener('touchstart', listener)
	  function listener(e1) {
	    // tap should only happen with a single finger
	    if (!e1.touches || e1.touches.length > 1) return

	    var el = e1.target
	    var context = this
	    var args = arguments;

	    var timeout_id = setTimeout(cleanup, timeout)

	    el.addEventListener('touchmove', cleanup)

	    endEvents.forEach(function (event) {
	      el.addEventListener(event, done)
	    })

	    function done(e2) {
	      // since touchstart is added on the same tick
	      // and because of bubbling,
	      // it'll execute this on the same touchstart.
	      // this filters out the same touchstart event.
	      if (e1 === e2) return

	      cleanup()

	      // already handled
	      if (e2.defaultPrevented) return

	      // overwrite these functions so that they all to both start and events.
	      var preventDefault = e1.preventDefault
	      var stopPropagation = e1.stopPropagation

	      e1.stopPropagation = function () {
	        stopPropagation.call(e1)
	        stopPropagation.call(e2)
	      }

	      e1.preventDefault = function () {
	        //preventDefault.call(e1)
	        preventDefault.call(e2)
	      }

	      // calls the handler with the `end` event,
	      // but i don't think it matters.
	      callback.apply(context, args)
	    }

	    // cleanup end events
	    // to cancel the tap, just run this early
	    function cleanup(e2) {
	      // if it's the same event as the origin,
	      // then don't actually cleanup.
	      // hit issues with this - don't remember
	      if (e1 === e2) return

	      clearTimeout(timeout_id)

	      el.removeEventListener('touchmove', cleanup)

	      endEvents.forEach(function (event) {
	        el.removeEventListener(event, done)
	      })
	    }
	  }
	}


/***/ }),
/* 50 */
/***/ (function(module, exports) {

	
	/**
	 * Expose `parse`.
	 */

	module.exports = parse;

	/**
	 * Tests for browser support.
	 */

	var innerHTMLBug = false;
	var bugTestDiv;
	if (typeof document !== 'undefined') {
	  bugTestDiv = document.createElement('div');
	  // Setup
	  bugTestDiv.innerHTML = '  <link/><table></table><a href="/a">a</a><input type="checkbox"/>';
	  // Make sure that link elements get serialized correctly by innerHTML
	  // This requires a wrapper element in IE
	  innerHTMLBug = !bugTestDiv.getElementsByTagName('link').length;
	  bugTestDiv = undefined;
	}

	/**
	 * Wrap map from jquery.
	 */

	var map = {
	  legend: [1, '<fieldset>', '</fieldset>'],
	  tr: [2, '<table><tbody>', '</tbody></table>'],
	  col: [2, '<table><tbody></tbody><colgroup>', '</colgroup></table>'],
	  // for script/link/style tags to work in IE6-8, you have to wrap
	  // in a div with a non-whitespace character in front, ha!
	  _default: innerHTMLBug ? [1, 'X<div>', '</div>'] : [0, '', '']
	};

	map.td =
	map.th = [3, '<table><tbody><tr>', '</tr></tbody></table>'];

	map.option =
	map.optgroup = [1, '<select multiple="multiple">', '</select>'];

	map.thead =
	map.tbody =
	map.colgroup =
	map.caption =
	map.tfoot = [1, '<table>', '</table>'];

	map.polyline =
	map.ellipse =
	map.polygon =
	map.circle =
	map.text =
	map.line =
	map.path =
	map.rect =
	map.g = [1, '<svg xmlns="http://www.w3.org/2000/svg" version="1.1">','</svg>'];

	/**
	 * Parse `html` and return a DOM Node instance, which could be a TextNode,
	 * HTML DOM Node of some kind (<div> for example), or a DocumentFragment
	 * instance, depending on the contents of the `html` string.
	 *
	 * @param {String} html - HTML string to "domify"
	 * @param {Document} doc - The `document` instance to create the Node for
	 * @return {DOMNode} the TextNode, DOM Node, or DocumentFragment instance
	 * @api private
	 */

	function parse(html, doc) {
	  if ('string' != typeof html) throw new TypeError('String expected');

	  // default to the global `document` object
	  if (!doc) doc = document;

	  // tag name
	  var m = /<([\w:]+)/.exec(html);
	  if (!m) return doc.createTextNode(html);

	  html = html.replace(/^\s+|\s+$/g, ''); // Remove leading/trailing whitespace

	  var tag = m[1];

	  // body support
	  if (tag == 'body') {
	    var el = doc.createElement('html');
	    el.innerHTML = html;
	    return el.removeChild(el.lastChild);
	  }

	  // wrap map
	  var wrap = map[tag] || map._default;
	  var depth = wrap[0];
	  var prefix = wrap[1];
	  var suffix = wrap[2];
	  var el = doc.createElement('div');
	  el.innerHTML = prefix + html + suffix;
	  while (depth--) el = el.lastChild;

	  // one element
	  if (el.firstChild == el.lastChild) {
	    return el.removeChild(el.firstChild);
	  }

	  // several elements
	  var fragment = doc.createDocumentFragment();
	  while (el.firstChild) {
	    fragment.appendChild(el.removeChild(el.firstChild));
	  }

	  return fragment;
	}


/***/ }),
/* 51 */
/***/ (function(module, exports) {

	module.exports = "<div class=\"actionsheet-overlay\">\n  <div class=\"actionsheet\">\n    <div class=\"actionsheet-body\">\n    </div>\n  </div>\n</div>\n";

/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	try {
	  var index = __webpack_require__(53);
	} catch (err) {
	  var index = __webpack_require__(53);
	}

	/**
	 * Whitespace regexp.
	 */

	var re = /\s+/;

	/**
	 * toString reference.
	 */

	var toString = Object.prototype.toString;

	/**
	 * Wrap `el` in a `ClassList`.
	 *
	 * @param {Element} el
	 * @return {ClassList}
	 * @api public
	 */

	module.exports = function(el){
	  return new ClassList(el);
	};

	/**
	 * Initialize a new ClassList for `el`.
	 *
	 * @param {Element} el
	 * @api private
	 */

	function ClassList(el) {
	  if (!el || !el.nodeType) {
	    throw new Error('A DOM element reference is required');
	  }
	  this.el = el;
	  this.list = el.classList;
	}

	/**
	 * Add class `name` if not already present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.add = function(name){
	  // classList
	  if (this.list) {
	    this.list.add(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (!~i) arr.push(name);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove class `name` when present, or
	 * pass a regular expression to remove
	 * any which match.
	 *
	 * @param {String|RegExp} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.remove = function(name){
	  if ('[object RegExp]' == toString.call(name)) {
	    return this.removeMatching(name);
	  }

	  // classList
	  if (this.list) {
	    this.list.remove(name);
	    return this;
	  }

	  // fallback
	  var arr = this.array();
	  var i = index(arr, name);
	  if (~i) arr.splice(i, 1);
	  this.el.className = arr.join(' ');
	  return this;
	};

	/**
	 * Remove all classes matching `re`.
	 *
	 * @param {RegExp} re
	 * @return {ClassList}
	 * @api private
	 */

	ClassList.prototype.removeMatching = function(re){
	  var arr = this.array();
	  for (var i = 0; i < arr.length; i++) {
	    if (re.test(arr[i])) {
	      this.remove(arr[i]);
	    }
	  }
	  return this;
	};

	/**
	 * Toggle class `name`, can force state via `force`.
	 *
	 * For browsers that support classList, but do not support `force` yet,
	 * the mistake will be detected and corrected.
	 *
	 * @param {String} name
	 * @param {Boolean} force
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.toggle = function(name, force){
	  // classList
	  if (this.list) {
	    if ("undefined" !== typeof force) {
	      if (force !== this.list.toggle(name, force)) {
	        this.list.toggle(name); // toggle again to correct
	      }
	    } else {
	      this.list.toggle(name);
	    }
	    return this;
	  }

	  // fallback
	  if ("undefined" !== typeof force) {
	    if (!force) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  } else {
	    if (this.has(name)) {
	      this.remove(name);
	    } else {
	      this.add(name);
	    }
	  }

	  return this;
	};

	/**
	 * Return an array of classes.
	 *
	 * @return {Array}
	 * @api public
	 */

	ClassList.prototype.array = function(){
	  var className = this.el.getAttribute('class') || '';
	  var str = className.replace(/^\s+|\s+$/g, '');
	  var arr = str.split(re);
	  if ('' === arr[0]) arr.shift();
	  return arr;
	};

	/**
	 * Check if class `name` is present.
	 *
	 * @param {String} name
	 * @return {ClassList}
	 * @api public
	 */

	ClassList.prototype.has =
	ClassList.prototype.contains = function(name){
	  return this.list
	    ? this.list.contains(name)
	    : !! ~index(this.array(), name);
	};


/***/ }),
/* 53 */
/***/ (function(module, exports) {

	module.exports = function(arr, obj){
	  if (arr.indexOf) return arr.indexOf(obj);
	  for (var i = 0; i < arr.length; ++i) {
	    if (arr[i] === obj) return i;
	  }
	  return -1;
	};

/***/ }),
/* 54 */
/***/ (function(module, exports) {

	var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
	    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
	    prefix = bind !== 'addEventListener' ? 'on' : '';

	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, type, fn, capture){
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};

	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

	var transform = null
	;(function () {
	  var styles = [
	    'webkitTransform',
	    'MozTransform',
	    'msTransform',
	    'OTransform',
	    'transform'
	  ];

	  var el = document.createElement('p');

	  for (var i = 0; i < styles.length; i++) {
	    if (null != el.style[styles[i]]) {
	      transform = styles[i];
	      break;
	    }
	  }
	})()

	/**
	 * Transition-end mapping
	 */
	var transitionEnd = null
	;(function () {
	  var map = {
	    'WebkitTransition' : 'webkitTransitionEnd',
	    'MozTransition' : 'transitionend',
	    'OTransition' : 'oTransitionEnd',
	    'msTransition' : 'MSTransitionEnd',
	    'transition' : 'transitionend'
	  };

	  /**
	  * Expose `transitionend`
	  */

	  var el = document.createElement('p');

	  for (var transition in map) {
	    if (null != el.style[transition]) {
	      transitionEnd = map[transition];
	      break;
	    }
	  }
	})()

	exports.transitionend = transitionEnd

	exports.transition = __webpack_require__(56)

	exports.transform = transform

	exports.touchAction = __webpack_require__(57)

	exports.has3d = __webpack_require__(58)


/***/ }),
/* 56 */
/***/ (function(module, exports) {

	var styles = [
	  'webkitTransition',
	  'MozTransition',
	  'OTransition',
	  'msTransition',
	  'transition'
	]

	var el = document.createElement('p')
	var style

	for (var i = 0; i < styles.length; i++) {
	  if (null != el.style[styles[i]]) {
	    style = styles[i]
	    break
	  }
	}
	el = null

	module.exports = style


/***/ }),
/* 57 */
/***/ (function(module, exports) {

	
	/**
	 * Module exports.
	 */

	module.exports = touchActionProperty();

	/**
	 * Returns "touchAction", "msTouchAction", or null.
	 */

	function touchActionProperty(doc) {
	  if (!doc) doc = document;
	  var div = doc.createElement('div');
	  var prop = null;
	  if ('touchAction' in div.style) prop = 'touchAction';
	  else if ('msTouchAction' in div.style) prop = 'msTouchAction';
	  div = null;
	  return prop;
	}


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

	
	var prop = __webpack_require__(59);

	// IE <=8 doesn't have `getComputedStyle`
	if (!prop || !window.getComputedStyle) {
	  module.exports = false;

	} else {
	  var map = {
	    webkitTransform: '-webkit-transform',
	    OTransform: '-o-transform',
	    msTransform: '-ms-transform',
	    MozTransform: '-moz-transform',
	    transform: 'transform'
	  };

	  // from: https://gist.github.com/lorenzopolidori/3794226
	  var el = document.createElement('div');
	  el.style[prop] = 'translate3d(1px,1px,1px)';
	  document.body.insertBefore(el, null);
	  var val = getComputedStyle(el).getPropertyValue(map[prop]);
	  document.body.removeChild(el);
	  module.exports = null != val && val.length && 'none' != val;
	}


/***/ }),
/* 59 */
/***/ (function(module, exports) {

	
	var styles = [
	  'webkitTransform',
	  'MozTransform',
	  'msTransform',
	  'OTransform',
	  'transform'
	];

	var el = document.createElement('p');
	var style;

	for (var i = 0; i < styles.length; i++) {
	  style = styles[i];
	  if (null != el.style[style]) {
	    module.exports = style;
	    break;
	  }
	}


/***/ }),
/* 60 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {module.exports = 'ontouchstart' in global || (global.DocumentTouch && document instanceof DocumentTouch)
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _keys = __webpack_require__(62);

	var _keys2 = _interopRequireDefault(_keys);

	exports.redirectTo = redirectTo;
	exports.navigateTo = navigateTo;
	exports.switchTo = switchTo;
	exports.navigateBack = navigateBack;
	exports.openExternal = openExternal;
	exports.currentView = currentView;
	exports.getViewById = getViewById;
	exports.getViewIds = getViewIds;
	exports.eachView = eachView;

	var _util = __webpack_require__(5);

	var util = _interopRequireWildcard(_util);

	var _bus = __webpack_require__(46);

	var _bus2 = _interopRequireDefault(_bus);

	var _view = __webpack_require__(66);

	var _view2 = _interopRequireDefault(_view);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var curr = null;
	var views = {};
	var tabViews = {};
	Object.defineProperty(window.console, 'warn', {
	    get: function get() {
	        return function () {};
	    }
	});
	Object.defineProperty(window, '__wxConfig', {
	    get: function get() {
	        return curr ? curr.getConfig() : __wxConfig__;
	    }
	});
	Object.defineProperty(window, '__curPage__', {
	    get: function get() {
	        return curr;
	    },
	    set: function set(obj) {
	        curr[obj.name] = obj.value;
	    }
	});
	function onRoute() {
	    util.redirectTo(curr.url); //改变地址栏
	    _bus2.default.emit('route', getViewIds().length, curr); //tabbar状态变化
	    var arr = [];
	    var view = curr;
	    while (view) {
	        arr.push(view.url);
	        if (view.pid != null) {
	            view = getViewById(view.pid);
	        } else {
	            view = null;
	        }
	    }
	    var str = arr.reverse().join('|');
	    sessionStorage.setItem('routes', str);
	}

	function redirectTo(path) {
	    path = normalize(path);
	    if (!curr) throw new Error('Current view not exists');
	    var pid = curr.pid;
	    curr.destroy();
	    delete views[curr.id];
	    var v = curr = new _view2.default(path);
	    curr.pid = pid;
	    views[curr.id] = v;
	    onRoute();
	}

	function navigateTo(path) {
	    path = normalize(path);
	    var exists = tabViews[path];
	    if (curr) curr.hide();
	    if (exists) {
	        curr = exists;
	        exists.show();
	    } else {
	        var isTabView = util.isTabbar(path);
	        var pid = curr ? curr.id : null;
	        var v = curr = new _view2.default(path);
	        curr.pid = isTabView ? null : pid;
	        views[v.id] = v;
	        if (isTabView) tabViews[path] = curr;
	    }
	    onRoute();
	}

	function switchTo(path) {
	    path = normalize(path);
	    if (util.isTabbar(curr.path)) curr.hide();
	    var exists = tabViews[path];
	    (0, _keys2.default)(views).forEach(function (key) {
	        var view = views[key];
	        if (!util.isTabbar(view.path)) {
	            view.destroy();
	            delete views[key];
	        }
	    });
	    if (exists) {
	        curr = exists;
	        exists.show();
	    } else {
	        var isTabView = util.isTabbar(path);
	        var pid = curr ? curr.id : null;
	        var v = curr = new _view2.default(path);
	        curr.pid = isTabView ? null : pid;
	        views[v.id] = v;
	        if (isTabView) tabViews[path] = curr;
	        //return Toast(`无法找到存在的 ${path} 页面`, {type: 'error'})
	    }
	    onRoute();
	}

	function navigateBack() {
	    var delta = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 1;
	    var onBack = arguments[1];

	    if (!curr) throw new Error('Current page not exists');
	    if (curr.pid == null) return;
	    for (var i = delta; i > 0; i--) {
	        if (curr.pid == null) break;
	        curr.destroy();
	        delete views[curr.id];
	        curr = views[curr.pid];
	        if (onBack) onBack();
	    }
	    curr.show();
	    onRoute();
	}

	function openExternal(url) {
	    console.log('openExternal start!!!');
	    if (curr) curr.hide();
	    var pid = curr ? curr.id : null;
	    var v = curr = new _view2.default(url);
	    views[v.id] = v;
	    v.pid = pid;
	    v.show();
	    onRoute();
	}

	function currentView() {
	    return curr;
	}

	function getViewById(id) {
	    return views[id];
	}

	function getViewIds() {
	    var ids = (0, _keys2.default)(views).map(function (id) {
	        return Number(id);
	    });
	    return ids;
	}

	function eachView(fn) {
	    var ids = getViewIds();
	    ids.forEach(function (id) {
	        fn.call(null, views[id]);
	    });
	}

	function normalize(p) {
	    return p.replace(/\.html/, '').replace(/^\.?\//, '');
	}

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(63), __esModule: true };

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(64);
	module.exports = __webpack_require__(3).Object.keys;

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.14 Object.keys(O)
	var toObject = __webpack_require__(45)
	  , $keys    = __webpack_require__(28);

	__webpack_require__(65)('keys', function(){
	  return function keys(it){
	    return $keys(toObject(it));
	  };
	});

/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

	// most Object methods by ES6 should accept primitives
	var $export = __webpack_require__(13)
	  , core    = __webpack_require__(3)
	  , fails   = __webpack_require__(23);
	module.exports = function(KEY, exec){
	  var fn  = (core.Object || {})[KEY] || Object[KEY]
	    , exp = {};
	  exp[KEY] = exec(fn);
	  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
	};

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});

	var _keys = __webpack_require__(62);

	var _keys2 = _interopRequireDefault(_keys);

	var _getIterator2 = __webpack_require__(67);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	var _getPrototypeOf = __webpack_require__(89);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(92);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(93);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(97);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(116);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _bus = __webpack_require__(46);

	var _bus2 = _interopRequireDefault(_bus);

	var _emitter = __webpack_require__(47);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _util = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	__webpack_require__(124);
	function isMap(path) {
	    return (/^http(s)?:\/\/(apis\.map|3gimg\.qq\.com)/.test(path)
	    );
	}
	var loadedApp = false;

	var BASE_DEVICE_WIDTH = 750;
	var EPS = 0.0001;
	var RPXRE = /%%\?[+-]?\d+(\.\d+)?rpx\?%%/g;
	var widthScreen = window.innerWidth > 375 ? 375 : window.innerWidth;
	var ratio = window.devicePixelRatio;
	function transformByDPR(a, width, dpr) {
	    a = a / BASE_DEVICE_WIDTH * width;
	    a = Math.floor(a + EPS);
	    if (a === 0) {
	        if (dpr === 1) {
	            return 1;
	        } else {
	            return 0.5;
	        }
	    }
	    return a;
	}

	function getNumber(e, width, ratio) {
	    var g = 0;
	    var d = 1;
	    var a = false;
	    var f = false;
	    for (var b = 0; b < e.length; ++b) {
	        var h = e[b];
	        if (h >= "0" && h <= "9") {
	            if (a) {
	                d *= 0.1;
	                g += (h - "0") * d;
	            } else {
	                g = g * 10 + (h - "0");
	            }
	        } else {
	            if (h === ".") {
	                a = true;
	            } else {
	                if (h === "-") {
	                    f = true;
	                }
	            }
	        }
	    }
	    if (f) {
	        g = -g;
	    }
	    return transformByDPR(g, width, ratio);
	}
	function bridgeReady(fn) {
	    typeof WeixinJSBridge !== 'undefined' ? fn() : document.addEventListener('WeixinJSBridgeReady', fn, !1);
	}

	var View = function (_Emitter) {
	    (0, _inherits3.default)(View, _Emitter);

	    function View(path) {
	        (0, _classCallCheck3.default)(this, View);

	        if (!path) throw new Error('path required for view');

	        var _this = (0, _possibleConstructorReturn3.default)(this, (View.__proto__ || (0, _getPrototypeOf2.default)(View)).call(this));

	        var id = _this.id = (0, _util.uid)();
	        var o = (0, _util.parsePath)(path);
	        _this.url = path;
	        _this.path = o.path;
	        _this.query = o.query;
	        _this.isMap = isMap(path);
	        var external = _this.external = /^http(s)?:\/\//.test(path);
	        var root = document.querySelector('.scrollable');
	        _this.ready = false;
	        if (external) {
	            _this.el = (0, _util.createFrame)('view-' + id, path, false, root);
	            if (_this.isMap) {
	                _this.el.contentWindow.addEventListener('load', function () {
	                    _this._onReady();
	                });
	            }
	        } else {
	            window.__pageFrameStartTime__ = Date.now();
	            _this.el = _this.createPage(id, false, root);
	            _this.loadWxml();
	            if (!loadedApp) {
	                loadedApp = true;
	                _this.loadWxss('./css/app.css');
	            }
	            //this.loadWxss()
	            _bus2.default.on('ready', function (viewId) {
	                if (viewId == id) {
	                    _this._onReady();
	                }
	            });
	        }
	        _this.readyCallbacks = [];
	        return _this;
	    }

	    (0, _createClass3.default)(View, [{
	        key: '_onReady',
	        value: function _onReady() {
	            this.ready = true;
	            var cbs = this.readyCallbacks;
	            var _iteratorNormalCompletion = true;
	            var _didIteratorError = false;
	            var _iteratorError = undefined;

	            try {
	                for (var _iterator = (0, _getIterator3.default)(cbs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	                    var cb = _step.value;

	                    cb();
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

	            this.readyCallbacks = null;
	        }
	    }, {
	        key: 'onReady',
	        value: function onReady(cb) {
	            if (!cb) return;
	            if (this.ready) return cb();
	            this.readyCallbacks.push(cb);
	        }
	    }, {
	        key: 'setLocation',
	        value: function setLocation(data) {
	            this.location = {
	                name: data.poiname,
	                address: data.poiaddress,
	                latitude: data.latlng.lat,
	                longitude: data.latlng.lng
	            };
	            console.log(this.location);
	        }
	    }, {
	        key: 'getConfig',
	        value: function getConfig() {
	            var win = window.__wxConfig__.window;
	            var obj = {
	                backgroundTextStyle: win.backgroundTextStyle || 'dark',
	                backgroundColor: win.backgroundColor || '#fff',
	                enablePullDownRefresh: win.enablePullDownRefresh || false
	            };
	            var winConfig = win.pages[this.path] || {};
	            (0, _keys2.default)(obj).forEach(function (key) {
	                if (winConfig.hasOwnProperty(key)) {
	                    obj[key] = winConfig[key];
	                }
	            });
	            return { window: obj, viewId: this.id };
	        }
	    }, {
	        key: 'hide',
	        value: function hide() {
	            //this.el.style.display = 'none'
	            //移除当前页面css
	            if (this.el) {
	                this.elParent.removeChild(this.el);
	            }
	        }
	    }, {
	        key: 'show',
	        value: function show() {
	            if (this.el && !this.el.parentNode) {
	                this.elParent.appendChild(this.el);
	            } //增加当前页面css
	            //this.el.style.display = 'block'
	            window.__webviewId__ = this.id;
	            this.__DOMTree__ && (window.__DOMTree__ = this.__DOMTree__);
	            window.__enablePullUpRefresh__ = !!this.__enablePullUpRefresh__;
	            window.__generateFunc__ = this.__generateFunc__;
	        }
	    }, {
	        key: 'destroy',
	        value: function destroy() {
	            this.emit('destroy');
	            /*
	                    let cssObj = this.cssDom//document.querySelector('#view-css-'+this.id)
	                    if(cssObj){
	                        document.querySelector('head').removeChild(cssObj)
	                    }
	            */
	            this.el.parentNode.removeChild(this.el);
	        }
	    }, {
	        key: 'postMessage',
	        value: function postMessage(data) {
	            this.onReady(function () {
	                data.msg = data.msg || {};

	                var msg = data.msg,
	                    command = data.command,
	                    ext = data.ext;

	                if ("MSG_FROM_APPSERVICE" === command) {
	                    WeixinJSBridge.subscribeHandler(msg.eventName, msg.data);
	                } else if ("GET_JSSDK_RES" == command || "INVOKE_SDK" == command || /^private_/.test(msg.sdkName)) {
	                    WeixinJSBridge.subscribeHandler(msg.sdkName, msg.res, ext); //ext其实也没用 了
	                } else if ("STOP_PULL_DOWN_REFRESH" === command) {
	                    WeixinJSBridge.pullDownRefresh.reset();
	                }
	            });
	        }
	    }, {
	        key: 'loadWxss',
	        value: function loadWxss(path) {
	            var p = path || this.path;
	            var self = this;
	            var width = widthScreen;
	            var ratio = window.devicePixelRatio;
	            fetch(path).then(function (response) {
	                return response.text();
	            }).then(function (cssBody) {
	                self.inlineCss(cssBody, width, ratio, p);
	            });
	        }
	    }, {
	        key: 'resizeWxss',
	        value: function resizeWxss() {}
	    }, {
	        key: 'createPage',
	        value: function createPage(id, hidden) {
	            var parent = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : document.body;

	            var el = document.createElement('div');
	            el.setAttribute('id', 'weweb-view-' + id);
	            el.setAttribute('view-id', id);
	            el.style.height = '100%';
	            if (hidden) {
	                el.style.display = 'none';
	            }
	            parent.appendChild(el);
	            this.elParent = parent;
	            el.innerHTML = '<div id="view-body-' + id + '"></div>';
	            return el;
	        }
	    }, {
	        key: 'inlineCss',
	        value: function inlineCss(content, width, ratio, path) {
	            var b,
	                self = this;
	            b = content.match(RPXRE);
	            if (b) {
	                b.forEach(function (c) {
	                    var d = getNumber(c, width, ratio);
	                    var e = d + "px";
	                    content = content.replace(c, e);
	                });
	            }
	            if (!content) return;
	            /*
	                    content = content.split('\n').map(function(value){
	                        return value==''?value:"#weweb-view-"+self.id+" "+value.replace(/([^\{]+?,)([^\{]+?)/g,"$1#weweb-view-"+self.id+" $2")
	                    }).join('\n');
	            */

	            var link = document.createElement('style');
	            link.setAttribute('type', 'text/css');
	            link.setAttribute('page', path);
	            link.appendChild(document.createTextNode(content));
	            if (path != './css/app.css') {
	                link.id = 'view-css-' + this.id;
	                link.setAttribute('scoped', '');
	                this.el.appendChild(link);
	            } else {
	                document.querySelector('head').appendChild(link);
	            }
	        }
	    }, {
	        key: 'loadWxml',
	        value: function loadWxml() {
	            // load generateFn and notify view
	            //this.el.contentWindow.__gen()
	            var self = this;
	            var p = './src/' + this.path + '.js';
	            fetch(p).then(function (response) {
	                return response.text();
	            }).then(function (res) {
	                if (window.__curPage__.id != self.id) {
	                    return;
	                }
	                var resArr = res.split('@css-body-start:');
	                var func = new Function(resArr[0] + '\n return $gwx("./' + self.path + '.wxml")');

	                self.__generateFunc__ = window.__generateFunc__ = func();
	                if (window.firstRender) {
	                    //非首次加载
	                    window.firstRender = 0;
	                    WeixinJSBridge.publish('DOMContentLoaded', {
	                        data: {},
	                        options: {
	                            timestamp: Date.now()
	                        }
	                    });
	                } else {
	                    bridgeReady(function () {
	                        document.dispatchEvent(new CustomEvent("generateFuncReady", {}));
	                        window.__pageFrameEndTime__ = Date.now();
	                    });
	                }

	                if (resArr[1]) {
	                    self.inlineCss(resArr[1], widthScreen, ratio, self.path);
	                }
	            });
	        }
	    }]);
	    return View;
	}(_emitter2.default);

	exports.default = View;

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(68), __esModule: true };

/***/ }),
/* 68 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(69);
	__webpack_require__(84);
	module.exports = __webpack_require__(86);

/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(70);
	var global        = __webpack_require__(14)
	  , hide          = __webpack_require__(17)
	  , Iterators     = __webpack_require__(73)
	  , TO_STRING_TAG = __webpack_require__(82)('toStringTag');

	for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
	  var NAME       = collections[i]
	    , Collection = global[NAME]
	    , proto      = Collection && Collection.prototype;
	  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
	  Iterators[NAME] = Iterators.Array;
	}

/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var addToUnscopables = __webpack_require__(71)
	  , step             = __webpack_require__(72)
	  , Iterators        = __webpack_require__(73)
	  , toIObject        = __webpack_require__(31);

	// 22.1.3.4 Array.prototype.entries()
	// 22.1.3.13 Array.prototype.keys()
	// 22.1.3.29 Array.prototype.values()
	// 22.1.3.30 Array.prototype[@@iterator]()
	module.exports = __webpack_require__(74)(Array, 'Array', function(iterated, kind){
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
/* 71 */
/***/ (function(module, exports) {

	module.exports = function(){ /* empty */ };

/***/ }),
/* 72 */
/***/ (function(module, exports) {

	module.exports = function(done, value){
	  return {value: value, done: !!done};
	};

/***/ }),
/* 73 */
/***/ (function(module, exports) {

	module.exports = {};

/***/ }),
/* 74 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY        = __webpack_require__(75)
	  , $export        = __webpack_require__(13)
	  , redefine       = __webpack_require__(76)
	  , hide           = __webpack_require__(17)
	  , has            = __webpack_require__(30)
	  , Iterators      = __webpack_require__(73)
	  , $iterCreate    = __webpack_require__(77)
	  , setToStringTag = __webpack_require__(81)
	  , getPrototypeOf = __webpack_require__(83)
	  , ITERATOR       = __webpack_require__(82)('iterator')
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
/* 75 */
/***/ (function(module, exports) {

	module.exports = true;

/***/ }),
/* 76 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(17);

/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var create         = __webpack_require__(78)
	  , descriptor     = __webpack_require__(26)
	  , setToStringTag = __webpack_require__(81)
	  , IteratorPrototype = {};

	// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
	__webpack_require__(17)(IteratorPrototype, __webpack_require__(82)('iterator'), function(){ return this; });

	module.exports = function(Constructor, NAME, next){
	  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
	  setToStringTag(Constructor, NAME + ' Iterator');
	};

/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	var anObject    = __webpack_require__(19)
	  , dPs         = __webpack_require__(79)
	  , enumBugKeys = __webpack_require__(42)
	  , IE_PROTO    = __webpack_require__(39)('IE_PROTO')
	  , Empty       = function(){ /* empty */ }
	  , PROTOTYPE   = 'prototype';

	// Create object with fake `null` prototype: use iframe Object with cleared prototype
	var createDict = function(){
	  // Thrash, waste and sodomy: IE GC bug
	  var iframe = __webpack_require__(24)('iframe')
	    , i      = enumBugKeys.length
	    , lt     = '<'
	    , gt     = '>'
	    , iframeDocument;
	  iframe.style.display = 'none';
	  __webpack_require__(80).appendChild(iframe);
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
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

	var dP       = __webpack_require__(18)
	  , anObject = __webpack_require__(19)
	  , getKeys  = __webpack_require__(28);

	module.exports = __webpack_require__(22) ? Object.defineProperties : function defineProperties(O, Properties){
	  anObject(O);
	  var keys   = getKeys(Properties)
	    , length = keys.length
	    , i = 0
	    , P;
	  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
	  return O;
	};

/***/ }),
/* 80 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(14).document && document.documentElement;

/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

	var def = __webpack_require__(18).f
	  , has = __webpack_require__(30)
	  , TAG = __webpack_require__(82)('toStringTag');

	module.exports = function(it, tag, stat){
	  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
	};

/***/ }),
/* 82 */
/***/ (function(module, exports, __webpack_require__) {

	var store      = __webpack_require__(40)('wks')
	  , uid        = __webpack_require__(41)
	  , Symbol     = __webpack_require__(14).Symbol
	  , USE_SYMBOL = typeof Symbol == 'function';

	var $exports = module.exports = function(name){
	  return store[name] || (store[name] =
	    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
	};

	$exports.store = store;

/***/ }),
/* 83 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
	var has         = __webpack_require__(30)
	  , toObject    = __webpack_require__(45)
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
/* 84 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $at  = __webpack_require__(85)(true);

	// 21.1.3.27 String.prototype[@@iterator]()
	__webpack_require__(74)(String, 'String', function(iterated){
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
/* 85 */
/***/ (function(module, exports, __webpack_require__) {

	var toInteger = __webpack_require__(37)
	  , defined   = __webpack_require__(34);
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
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

	var anObject = __webpack_require__(19)
	  , get      = __webpack_require__(87);
	module.exports = __webpack_require__(3).getIterator = function(it){
	  var iterFn = get(it);
	  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
	  return anObject(iterFn.call(it));
	};

/***/ }),
/* 87 */
/***/ (function(module, exports, __webpack_require__) {

	var classof   = __webpack_require__(88)
	  , ITERATOR  = __webpack_require__(82)('iterator')
	  , Iterators = __webpack_require__(73);
	module.exports = __webpack_require__(3).getIteratorMethod = function(it){
	  if(it != undefined)return it[ITERATOR]
	    || it['@@iterator']
	    || Iterators[classof(it)];
	};

/***/ }),
/* 88 */
/***/ (function(module, exports, __webpack_require__) {

	// getting tag from 19.1.3.6 Object.prototype.toString()
	var cof = __webpack_require__(33)
	  , TAG = __webpack_require__(82)('toStringTag')
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
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(90), __esModule: true };

/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(91);
	module.exports = __webpack_require__(3).Object.getPrototypeOf;

/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.9 Object.getPrototypeOf(O)
	var toObject        = __webpack_require__(45)
	  , $getPrototypeOf = __webpack_require__(83);

	__webpack_require__(65)('getPrototypeOf', function(){
	  return function getPrototypeOf(it){
	    return $getPrototypeOf(toObject(it));
	  };
	});

/***/ }),
/* 92 */
/***/ (function(module, exports) {

	"use strict";

	exports.__esModule = true;

	exports.default = function (instance, Constructor) {
	  if (!(instance instanceof Constructor)) {
	    throw new TypeError("Cannot call a class as a function");
	  }
	};

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(94);

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
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(95), __esModule: true };

/***/ }),
/* 95 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(96);
	var $Object = __webpack_require__(3).Object;
	module.exports = function defineProperty(it, key, desc){
	  return $Object.defineProperty(it, key, desc);
	};

/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(13);
	// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
	$export($export.S + $export.F * !__webpack_require__(22), 'Object', {defineProperty: __webpack_require__(18).f});

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _typeof2 = __webpack_require__(98);

	var _typeof3 = _interopRequireDefault(_typeof2);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (self, call) {
	  if (!self) {
	    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
	  }

	  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
	};

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _iterator = __webpack_require__(99);

	var _iterator2 = _interopRequireDefault(_iterator);

	var _symbol = __webpack_require__(102);

	var _symbol2 = _interopRequireDefault(_symbol);

	var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
	  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
	} : function (obj) {
	  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
	};

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(100), __esModule: true };

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(84);
	__webpack_require__(69);
	module.exports = __webpack_require__(101).f('iterator');

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

	exports.f = __webpack_require__(82);

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(103), __esModule: true };

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(104);
	__webpack_require__(113);
	__webpack_require__(114);
	__webpack_require__(115);
	module.exports = __webpack_require__(3).Symbol;

/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	// ECMAScript 6 symbols shim
	var global         = __webpack_require__(14)
	  , has            = __webpack_require__(30)
	  , DESCRIPTORS    = __webpack_require__(22)
	  , $export        = __webpack_require__(13)
	  , redefine       = __webpack_require__(76)
	  , META           = __webpack_require__(105).KEY
	  , $fails         = __webpack_require__(23)
	  , shared         = __webpack_require__(40)
	  , setToStringTag = __webpack_require__(81)
	  , uid            = __webpack_require__(41)
	  , wks            = __webpack_require__(82)
	  , wksExt         = __webpack_require__(101)
	  , wksDefine      = __webpack_require__(106)
	  , keyOf          = __webpack_require__(107)
	  , enumKeys       = __webpack_require__(108)
	  , isArray        = __webpack_require__(109)
	  , anObject       = __webpack_require__(19)
	  , toIObject      = __webpack_require__(31)
	  , toPrimitive    = __webpack_require__(25)
	  , createDesc     = __webpack_require__(26)
	  , _create        = __webpack_require__(78)
	  , gOPNExt        = __webpack_require__(110)
	  , $GOPD          = __webpack_require__(112)
	  , $DP            = __webpack_require__(18)
	  , $keys          = __webpack_require__(28)
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
	  __webpack_require__(111).f = gOPNExt.f = $getOwnPropertyNames;
	  __webpack_require__(44).f  = $propertyIsEnumerable;
	  __webpack_require__(43).f = $getOwnPropertySymbols;

	  if(DESCRIPTORS && !__webpack_require__(75)){
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
	$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(17)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
	// 19.4.3.5 Symbol.prototype[@@toStringTag]
	setToStringTag($Symbol, 'Symbol');
	// 20.2.1.9 Math[@@toStringTag]
	setToStringTag(Math, 'Math', true);
	// 24.3.3 JSON[@@toStringTag]
	setToStringTag(global.JSON, 'JSON', true);

/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

	var META     = __webpack_require__(41)('meta')
	  , isObject = __webpack_require__(20)
	  , has      = __webpack_require__(30)
	  , setDesc  = __webpack_require__(18).f
	  , id       = 0;
	var isExtensible = Object.isExtensible || function(){
	  return true;
	};
	var FREEZE = !__webpack_require__(23)(function(){
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
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

	var global         = __webpack_require__(14)
	  , core           = __webpack_require__(3)
	  , LIBRARY        = __webpack_require__(75)
	  , wksExt         = __webpack_require__(101)
	  , defineProperty = __webpack_require__(18).f;
	module.exports = function(name){
	  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
	  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
	};

/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

	var getKeys   = __webpack_require__(28)
	  , toIObject = __webpack_require__(31);
	module.exports = function(object, el){
	  var O      = toIObject(object)
	    , keys   = getKeys(O)
	    , length = keys.length
	    , index  = 0
	    , key;
	  while(length > index)if(O[key = keys[index++]] === el)return key;
	};

/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

	// all enumerable object keys, includes symbols
	var getKeys = __webpack_require__(28)
	  , gOPS    = __webpack_require__(43)
	  , pIE     = __webpack_require__(44);
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
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.2.2 IsArray(argument)
	var cof = __webpack_require__(33);
	module.exports = Array.isArray || function isArray(arg){
	  return cof(arg) == 'Array';
	};

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

	// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
	var toIObject = __webpack_require__(31)
	  , gOPN      = __webpack_require__(111).f
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
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
	var $keys      = __webpack_require__(29)
	  , hiddenKeys = __webpack_require__(42).concat('length', 'prototype');

	exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
	  return $keys(O, hiddenKeys);
	};

/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

	var pIE            = __webpack_require__(44)
	  , createDesc     = __webpack_require__(26)
	  , toIObject      = __webpack_require__(31)
	  , toPrimitive    = __webpack_require__(25)
	  , has            = __webpack_require__(30)
	  , IE8_DOM_DEFINE = __webpack_require__(21)
	  , gOPD           = Object.getOwnPropertyDescriptor;

	exports.f = __webpack_require__(22) ? gOPD : function getOwnPropertyDescriptor(O, P){
	  O = toIObject(O);
	  P = toPrimitive(P, true);
	  if(IE8_DOM_DEFINE)try {
	    return gOPD(O, P);
	  } catch(e){ /* empty */ }
	  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
	};

/***/ }),
/* 113 */
/***/ (function(module, exports) {

	

/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(106)('asyncIterator');

/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(106)('observable');

/***/ }),
/* 116 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _setPrototypeOf = __webpack_require__(117);

	var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

	var _create = __webpack_require__(121);

	var _create2 = _interopRequireDefault(_create);

	var _typeof2 = __webpack_require__(98);

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
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(118), __esModule: true };

/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(119);
	module.exports = __webpack_require__(3).Object.setPrototypeOf;

/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

	// 19.1.3.19 Object.setPrototypeOf(O, proto)
	var $export = __webpack_require__(13);
	$export($export.S, 'Object', {setPrototypeOf: __webpack_require__(120).set});

/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

	// Works with __proto__ only. Old v8 can't work with null proto objects.
	/* eslint-disable no-proto */
	var isObject = __webpack_require__(20)
	  , anObject = __webpack_require__(19);
	var check = function(O, proto){
	  anObject(O);
	  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
	};
	module.exports = {
	  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
	    function(test, buggy, set){
	      try {
	        set = __webpack_require__(15)(Function.call, __webpack_require__(112).f(Object.prototype, '__proto__').set, 2);
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
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(122), __esModule: true };

/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(123);
	var $Object = __webpack_require__(3).Object;
	module.exports = function create(P, D){
	  return $Object.create(P, D);
	};

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

	var $export = __webpack_require__(13)
	// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
	$export($export.S, 'Object', {create: __webpack_require__(78)});

/***/ }),
/* 124 */
/***/ (function(module, exports) {

	(function(self) {
	  'use strict';

	  if (self.fetch) {
	    return
	  }

	  var support = {
	    searchParams: 'URLSearchParams' in self,
	    iterable: 'Symbol' in self && 'iterator' in Symbol,
	    blob: 'FileReader' in self && 'Blob' in self && (function() {
	      try {
	        new Blob()
	        return true
	      } catch(e) {
	        return false
	      }
	    })(),
	    formData: 'FormData' in self,
	    arrayBuffer: 'ArrayBuffer' in self
	  }

	  if (support.arrayBuffer) {
	    var viewClasses = [
	      '[object Int8Array]',
	      '[object Uint8Array]',
	      '[object Uint8ClampedArray]',
	      '[object Int16Array]',
	      '[object Uint16Array]',
	      '[object Int32Array]',
	      '[object Uint32Array]',
	      '[object Float32Array]',
	      '[object Float64Array]'
	    ]

	    var isDataView = function(obj) {
	      return obj && DataView.prototype.isPrototypeOf(obj)
	    }

	    var isArrayBufferView = ArrayBuffer.isView || function(obj) {
	      return obj && viewClasses.indexOf(Object.prototype.toString.call(obj)) > -1
	    }
	  }

	  function normalizeName(name) {
	    if (typeof name !== 'string') {
	      name = String(name)
	    }
	    if (/[^a-z0-9\-#$%&'*+.\^_`|~]/i.test(name)) {
	      throw new TypeError('Invalid character in header field name')
	    }
	    return name.toLowerCase()
	  }

	  function normalizeValue(value) {
	    if (typeof value !== 'string') {
	      value = String(value)
	    }
	    return value
	  }

	  // Build a destructive iterator for the value list
	  function iteratorFor(items) {
	    var iterator = {
	      next: function() {
	        var value = items.shift()
	        return {done: value === undefined, value: value}
	      }
	    }

	    if (support.iterable) {
	      iterator[Symbol.iterator] = function() {
	        return iterator
	      }
	    }

	    return iterator
	  }

	  function Headers(headers) {
	    this.map = {}

	    if (headers instanceof Headers) {
	      headers.forEach(function(value, name) {
	        this.append(name, value)
	      }, this)
	    } else if (Array.isArray(headers)) {
	      headers.forEach(function(header) {
	        this.append(header[0], header[1])
	      }, this)
	    } else if (headers) {
	      Object.getOwnPropertyNames(headers).forEach(function(name) {
	        this.append(name, headers[name])
	      }, this)
	    }
	  }

	  Headers.prototype.append = function(name, value) {
	    name = normalizeName(name)
	    value = normalizeValue(value)
	    var oldValue = this.map[name]
	    this.map[name] = oldValue ? oldValue+','+value : value
	  }

	  Headers.prototype['delete'] = function(name) {
	    delete this.map[normalizeName(name)]
	  }

	  Headers.prototype.get = function(name) {
	    name = normalizeName(name)
	    return this.has(name) ? this.map[name] : null
	  }

	  Headers.prototype.has = function(name) {
	    return this.map.hasOwnProperty(normalizeName(name))
	  }

	  Headers.prototype.set = function(name, value) {
	    this.map[normalizeName(name)] = normalizeValue(value)
	  }

	  Headers.prototype.forEach = function(callback, thisArg) {
	    for (var name in this.map) {
	      if (this.map.hasOwnProperty(name)) {
	        callback.call(thisArg, this.map[name], name, this)
	      }
	    }
	  }

	  Headers.prototype.keys = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push(name) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.values = function() {
	    var items = []
	    this.forEach(function(value) { items.push(value) })
	    return iteratorFor(items)
	  }

	  Headers.prototype.entries = function() {
	    var items = []
	    this.forEach(function(value, name) { items.push([name, value]) })
	    return iteratorFor(items)
	  }

	  if (support.iterable) {
	    Headers.prototype[Symbol.iterator] = Headers.prototype.entries
	  }

	  function consumed(body) {
	    if (body.bodyUsed) {
	      return Promise.reject(new TypeError('Already read'))
	    }
	    body.bodyUsed = true
	  }

	  function fileReaderReady(reader) {
	    return new Promise(function(resolve, reject) {
	      reader.onload = function() {
	        resolve(reader.result)
	      }
	      reader.onerror = function() {
	        reject(reader.error)
	      }
	    })
	  }

	  function readBlobAsArrayBuffer(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsArrayBuffer(blob)
	    return promise
	  }

	  function readBlobAsText(blob) {
	    var reader = new FileReader()
	    var promise = fileReaderReady(reader)
	    reader.readAsText(blob)
	    return promise
	  }

	  function readArrayBufferAsText(buf) {
	    var view = new Uint8Array(buf)
	    var chars = new Array(view.length)

	    for (var i = 0; i < view.length; i++) {
	      chars[i] = String.fromCharCode(view[i])
	    }
	    return chars.join('')
	  }

	  function bufferClone(buf) {
	    if (buf.slice) {
	      return buf.slice(0)
	    } else {
	      var view = new Uint8Array(buf.byteLength)
	      view.set(new Uint8Array(buf))
	      return view.buffer
	    }
	  }

	  function Body() {
	    this.bodyUsed = false

	    this._initBody = function(body) {
	      this._bodyInit = body
	      if (!body) {
	        this._bodyText = ''
	      } else if (typeof body === 'string') {
	        this._bodyText = body
	      } else if (support.blob && Blob.prototype.isPrototypeOf(body)) {
	        this._bodyBlob = body
	      } else if (support.formData && FormData.prototype.isPrototypeOf(body)) {
	        this._bodyFormData = body
	      } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	        this._bodyText = body.toString()
	      } else if (support.arrayBuffer && support.blob && isDataView(body)) {
	        this._bodyArrayBuffer = bufferClone(body.buffer)
	        // IE 10-11 can't handle a DataView body.
	        this._bodyInit = new Blob([this._bodyArrayBuffer])
	      } else if (support.arrayBuffer && (ArrayBuffer.prototype.isPrototypeOf(body) || isArrayBufferView(body))) {
	        this._bodyArrayBuffer = bufferClone(body)
	      } else {
	        throw new Error('unsupported BodyInit type')
	      }

	      if (!this.headers.get('content-type')) {
	        if (typeof body === 'string') {
	          this.headers.set('content-type', 'text/plain;charset=UTF-8')
	        } else if (this._bodyBlob && this._bodyBlob.type) {
	          this.headers.set('content-type', this._bodyBlob.type)
	        } else if (support.searchParams && URLSearchParams.prototype.isPrototypeOf(body)) {
	          this.headers.set('content-type', 'application/x-www-form-urlencoded;charset=UTF-8')
	        }
	      }
	    }

	    if (support.blob) {
	      this.blob = function() {
	        var rejected = consumed(this)
	        if (rejected) {
	          return rejected
	        }

	        if (this._bodyBlob) {
	          return Promise.resolve(this._bodyBlob)
	        } else if (this._bodyArrayBuffer) {
	          return Promise.resolve(new Blob([this._bodyArrayBuffer]))
	        } else if (this._bodyFormData) {
	          throw new Error('could not read FormData body as blob')
	        } else {
	          return Promise.resolve(new Blob([this._bodyText]))
	        }
	      }

	      this.arrayBuffer = function() {
	        if (this._bodyArrayBuffer) {
	          return consumed(this) || Promise.resolve(this._bodyArrayBuffer)
	        } else {
	          return this.blob().then(readBlobAsArrayBuffer)
	        }
	      }
	    }

	    this.text = function() {
	      var rejected = consumed(this)
	      if (rejected) {
	        return rejected
	      }

	      if (this._bodyBlob) {
	        return readBlobAsText(this._bodyBlob)
	      } else if (this._bodyArrayBuffer) {
	        return Promise.resolve(readArrayBufferAsText(this._bodyArrayBuffer))
	      } else if (this._bodyFormData) {
	        throw new Error('could not read FormData body as text')
	      } else {
	        return Promise.resolve(this._bodyText)
	      }
	    }

	    if (support.formData) {
	      this.formData = function() {
	        return this.text().then(decode)
	      }
	    }

	    this.json = function() {
	      return this.text().then(JSON.parse)
	    }

	    return this
	  }

	  // HTTP methods whose capitalization should be normalized
	  var methods = ['DELETE', 'GET', 'HEAD', 'OPTIONS', 'POST', 'PUT']

	  function normalizeMethod(method) {
	    var upcased = method.toUpperCase()
	    return (methods.indexOf(upcased) > -1) ? upcased : method
	  }

	  function Request(input, options) {
	    options = options || {}
	    var body = options.body

	    if (input instanceof Request) {
	      if (input.bodyUsed) {
	        throw new TypeError('Already read')
	      }
	      this.url = input.url
	      this.credentials = input.credentials
	      if (!options.headers) {
	        this.headers = new Headers(input.headers)
	      }
	      this.method = input.method
	      this.mode = input.mode
	      if (!body && input._bodyInit != null) {
	        body = input._bodyInit
	        input.bodyUsed = true
	      }
	    } else {
	      this.url = String(input)
	    }

	    this.credentials = options.credentials || this.credentials || 'omit'
	    if (options.headers || !this.headers) {
	      this.headers = new Headers(options.headers)
	    }
	    this.method = normalizeMethod(options.method || this.method || 'GET')
	    this.mode = options.mode || this.mode || null
	    this.referrer = null

	    if ((this.method === 'GET' || this.method === 'HEAD') && body) {
	      throw new TypeError('Body not allowed for GET or HEAD requests')
	    }
	    this._initBody(body)
	  }

	  Request.prototype.clone = function() {
	    return new Request(this, { body: this._bodyInit })
	  }

	  function decode(body) {
	    var form = new FormData()
	    body.trim().split('&').forEach(function(bytes) {
	      if (bytes) {
	        var split = bytes.split('=')
	        var name = split.shift().replace(/\+/g, ' ')
	        var value = split.join('=').replace(/\+/g, ' ')
	        form.append(decodeURIComponent(name), decodeURIComponent(value))
	      }
	    })
	    return form
	  }

	  function parseHeaders(rawHeaders) {
	    var headers = new Headers()
	    rawHeaders.split(/\r?\n/).forEach(function(line) {
	      var parts = line.split(':')
	      var key = parts.shift().trim()
	      if (key) {
	        var value = parts.join(':').trim()
	        headers.append(key, value)
	      }
	    })
	    return headers
	  }

	  Body.call(Request.prototype)

	  function Response(bodyInit, options) {
	    if (!options) {
	      options = {}
	    }

	    this.type = 'default'
	    this.status = 'status' in options ? options.status : 200
	    this.ok = this.status >= 200 && this.status < 300
	    this.statusText = 'statusText' in options ? options.statusText : 'OK'
	    this.headers = new Headers(options.headers)
	    this.url = options.url || ''
	    this._initBody(bodyInit)
	  }

	  Body.call(Response.prototype)

	  Response.prototype.clone = function() {
	    return new Response(this._bodyInit, {
	      status: this.status,
	      statusText: this.statusText,
	      headers: new Headers(this.headers),
	      url: this.url
	    })
	  }

	  Response.error = function() {
	    var response = new Response(null, {status: 0, statusText: ''})
	    response.type = 'error'
	    return response
	  }

	  var redirectStatuses = [301, 302, 303, 307, 308]

	  Response.redirect = function(url, status) {
	    if (redirectStatuses.indexOf(status) === -1) {
	      throw new RangeError('Invalid status code')
	    }

	    return new Response(null, {status: status, headers: {location: url}})
	  }

	  self.Headers = Headers
	  self.Request = Request
	  self.Response = Response

	  self.fetch = function(input, init) {
	    return new Promise(function(resolve, reject) {
	      var request = new Request(input, init)
	      var xhr = new XMLHttpRequest()

	      xhr.onload = function() {
	        var options = {
	          status: xhr.status,
	          statusText: xhr.statusText,
	          headers: parseHeaders(xhr.getAllResponseHeaders() || '')
	        }
	        options.url = 'responseURL' in xhr ? xhr.responseURL : options.headers.get('X-Request-URL')
	        var body = 'response' in xhr ? xhr.response : xhr.responseText
	        resolve(new Response(body, options))
	      }

	      xhr.onerror = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.ontimeout = function() {
	        reject(new TypeError('Network request failed'))
	      }

	      xhr.open(request.method, request.url, true)

	      if (request.credentials === 'include') {
	        xhr.withCredentials = true
	      }

	      if ('responseType' in xhr && support.blob) {
	        xhr.responseType = 'blob'
	      }

	      request.headers.forEach(function(value, name) {
	        xhr.setRequestHeader(name, value)
	      })

	      xhr.send(typeof request._bodyInit === 'undefined' ? null : request._bodyInit)
	    })
	  }
	  self.fetch.polyfill = true
	})(typeof self !== 'undefined' ? self : this);


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _keys = __webpack_require__(62);

	var _keys2 = _interopRequireDefault(_keys);

	var _stringify = __webpack_require__(1);

	var _stringify2 = _interopRequireDefault(_stringify);

	var _emitter = __webpack_require__(47);

	var _emitter2 = _interopRequireDefault(_emitter);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// 5MB
	var LIMIT_SIZE = 5 * 1024;

	var directory = '__weweb__storage__';

	function currentSize() {
	  var total = 0;
	  for (var x in localStorage) {
	    var amount = localStorage[x].length * 2 / 1024;
	    total += amount;
	  }
	  return Math.ceil(total);
	}

	function getType(key) {
	  var str = localStorage.getItem(directory + '_type');
	  if (!str) return;
	  var obj = JSON.parse(str);
	  return obj[key];
	}

	function getTypes() {
	  var str = localStorage.getItem(directory + '_type');
	  if (!str) return {};
	  return JSON.parse(str);
	}

	var storage = {
	  set: function set(key, value, dataType) {
	    if (window.localStorage == null) return console.error('localStorage not supported');
	    var str = localStorage.getItem(directory);
	    var obj = void 0;
	    obj = str ? JSON.parse(str) : {};
	    obj[key] = value;
	    localStorage.setItem(directory, (0, _stringify2.default)(obj));
	    var types = getTypes();
	    types[key] = dataType;
	    localStorage.setItem(directory + '_type', (0, _stringify2.default)(types));
	    this.emit('change');
	  },
	  get: function get(key) {
	    if (window.localStorage == null) return console.error('localStorage not supported');
	    var str = localStorage.getItem(directory);
	    var obj = void 0;
	    obj = str ? JSON.parse(str) : {};
	    return {
	      data: obj[key],
	      dataType: getType(key)
	    };
	  },
	  remove: function remove(key) {
	    if (window.localStorage == null) return console.error('localStorage not supported');
	    var str = localStorage.getItem(directory);
	    if (!str) return;
	    var obj = JSON.parse(str);
	    var data = obj[key];
	    delete obj[key];
	    localStorage.setItem(directory, (0, _stringify2.default)(obj));
	    var types = getTypes();
	    delete types[key];
	    localStorage.setItem(directory + '_type', (0, _stringify2.default)(types));
	    this.emit('change');
	    return data;
	  },
	  clear: function clear() {
	    if (window.localStorage == null) return console.error('localStorage not supported');
	    localStorage.removeItem(directory);
	    localStorage.removeItem(directory + '_type');
	    this.emit('change');
	  },
	  getAll: function getAll() {
	    if (window.localStorage == null) return console.error('localStorage not supported');
	    var str = localStorage.getItem(directory);
	    var obj = str ? JSON.parse(str) : {};
	    var res = {};
	    (0, _keys2.default)(obj).forEach(function (key) {
	      res[key] = {
	        data: obj[key],
	        dataType: getType(key)
	      };
	    });
	    return res;
	  },
	  info: function info() {
	    if (window.localStorage == null) return console.error('localStorage not supported');
	    var str = localStorage.getItem(directory);
	    var obj = str ? JSON.parse(str) : {};
	    return {
	      keys: (0, _keys2.default)(obj),
	      limitSize: LIMIT_SIZE,
	      currentSize: currentSize()
	    };
	  }
	};

	(0, _emitter2.default)(storage);

	exports.default = storage;

/***/ }),
/* 126 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _tween = __webpack_require__(127);

	var _tween2 = _interopRequireDefault(_tween);

	var _raf = __webpack_require__(131);

	var _raf2 = _interopRequireDefault(_raf);

	var _classes = __webpack_require__(52);

	var _classes2 = _interopRequireDefault(_classes);

	var _propDetect = __webpack_require__(55);

	var _event = __webpack_require__(132);

	var _event2 = _interopRequireDefault(_event);

	var _tapEvent = __webpack_require__(49);

	var _tapEvent2 = _interopRequireDefault(_tapEvent);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var parentEl = void 0;
	var tween = void 0;

	function dismiss(el) {
	  if ((0, _classes2.default)(el).has('fadeout')) return;
	  if (el != parentEl.children[0]) {
	    (0, _classes2.default)(el).add('fadeout');
	    setTimeout(function () {
	      if (el.parentNode) parentEl.removeChild(el);
	    }, 200);
	    return;
	  }
	  if (tween) {
	    tween.on('end', function () {
	      dismiss(el);
	    });
	    return;
	  }
	  (0, _classes2.default)(el).add('fadeout');
	  tween = (0, _tween2.default)({ y: 0 }).ease('in-expo').to({ y: -40 }).duration(200);

	  tween.update(function (o) {
	    setTransform(o.y);
	  });

	  tween.on('end', function () {
	    animate = function animate() {}; //eslint-disable-line
	    tween = null;
	    if (el.parentNode) parentEl.removeChild(el);
	    setTransform(0);
	  });

	  function animate() {
	    (0, _raf2.default)(animate);
	    if (tween) tween.update();
	  }
	  animate();
	}

	function setTransform(y) {
	  if (typeof _propDetect.transform === 'string') {
	    if (_propDetect.has3d) {
	      parentEl.style[_propDetect.transform] = 'translate3d(0, ' + y + 'px, 0) ';
	    } else {
	      parentEl.style[_propDetect.transform] = 'translateY(' + y + 'px)';
	    }
	  } else {
	    parentEl.style.top = y + 'px';
	  }
	}

	function Toast(msg) {
	  var _ref = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {},
	      duration = _ref.duration,
	      type = _ref.type,
	      sticky = _ref.sticky;

	  if (!parentEl) {
	    parentEl = (0, _domify2.default)('<div id="toast-container"></div>');
	    document.body.appendChild(parentEl);
	  }
	  var el = (0, _domify2.default)('<div>' + msg + '</div>');
	  el.className = 'toast ' + type || '';
	  parentEl.appendChild(el);
	  var ontap = (0, _tapEvent2.default)(function () {
	    _event2.default.unbind(el, 'touchstart', ontap);
	    dismiss(el);
	  });
	  _event2.default.bind(el, 'touchstart', ontap);
	  if (type == 'error' && !sticky && !duration) duration = 5000;
	  if (duration) {
	    setTimeout(function () {
	      if (el.parentNode) dismiss(el);
	    }, duration);
	  } else if (type !== 'error' && !sticky) {
	    setTimeout(function () {
	      if (el.parentNode) dismiss(el);
	    }, 3000);
	  }
	  return function () {
	    dismiss(el);
	  };
	}

	exports.default = Toast;

/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(128);
	var clone = __webpack_require__(129);
	var type = __webpack_require__(8);
	var ease = __webpack_require__(130);

	/**
	 * Expose `Tween`.
	 */

	module.exports = Tween;

	/**
	 * Initialize a new `Tween` with `obj`.
	 *
	 * @param {Object|Array} obj
	 * @api public
	 */

	function Tween(obj) {
	  if (!(this instanceof Tween)) return new Tween(obj);
	  this._from = obj;
	  this.ease('linear');
	  this.duration(500);
	}

	/**
	 * Mixin emitter.
	 */

	Emitter(Tween.prototype);

	/**
	 * Reset the tween.
	 *
	 * @api public
	 */

	Tween.prototype.reset = function(){
	  this.isArray = 'array' === type(this._from);
	  this._curr = clone(this._from);
	  this._done = false;
	  this._start = Date.now();
	  return this;
	};

	/**
	 * Tween to `obj` and reset internal state.
	 *
	 *    tween.to({ x: 50, y: 100 })
	 *
	 * @param {Object|Array} obj
	 * @return {Tween} self
	 * @api public
	 */

	Tween.prototype.to = function(obj){
	  this.reset();
	  this._to = obj;
	  return this;
	};

	/**
	 * Set duration to `ms` [500].
	 *
	 * @param {Number} ms
	 * @return {Tween} self
	 * @api public
	 */

	Tween.prototype.duration = function(ms){
	  this._duration = ms;
	  return this;
	};

	/**
	 * Set easing function to `fn`.
	 *
	 *    tween.ease('in-out-sine')
	 *
	 * @param {String|Function} fn
	 * @return {Tween}
	 * @api public
	 */

	Tween.prototype.ease = function(fn){
	  fn = 'function' == typeof fn ? fn : ease[fn];
	  if (!fn) throw new TypeError('invalid easing function');
	  this._ease = fn;
	  return this;
	};

	/**
	 * Stop the tween and immediately emit "stop" and "end".
	 *
	 * @return {Tween}
	 * @api public
	 */

	Tween.prototype.stop = function(){
	  this.stopped = true;
	  this._done = true;
	  this.emit('stop');
	  this.emit('end');
	  return this;
	};

	/**
	 * Perform a step.
	 *
	 * @return {Tween} self
	 * @api private
	 */

	Tween.prototype.step = function(){
	  if (this._done) return;

	  // duration
	  var duration = this._duration;
	  var now = Date.now();
	  var delta = now - this._start;
	  var done = delta >= duration;

	  // complete
	  if (done) {
	    this._from = this._to;
	    this._update(this._to);
	    this._done = true;
	    this.emit('end');
	    return this;
	  }

	  // tween
	  var from = this._from;
	  var to = this._to;
	  var curr = this._curr;
	  var fn = this._ease;
	  var p = (now - this._start) / duration;
	  var n = fn(p);

	  // array
	  if (this.isArray) {
	    for (var i = 0; i < from.length; ++i) {
	      curr[i] = from[i] + (to[i] - from[i]) * n;
	    }

	    this._update(curr);
	    return this;
	  }

	  // objech
	  for (var k in from) {
	    curr[k] = from[k] + (to[k] - from[k]) * n;
	  }

	  this._update(curr);
	  return this;
	};

	/**
	 * Set update function to `fn` or
	 * when no argument is given this performs
	 * a "step".
	 *
	 * @param {Function} fn
	 * @return {Tween} self
	 * @api public
	 */

	Tween.prototype.update = function(fn){
	  if (0 == arguments.length) return this.step();
	  this._update = fn;
	  return this;
	};

/***/ }),
/* 128 */
/***/ (function(module, exports) {

	
	/**
	 * Expose `Emitter`.
	 */

	module.exports = Emitter;

	/**
	 * Initialize a new `Emitter`.
	 *
	 * @api public
	 */

	function Emitter(obj) {
	  if (obj) return mixin(obj);
	};

	/**
	 * Mixin the emitter properties.
	 *
	 * @param {Object} obj
	 * @return {Object}
	 * @api private
	 */

	function mixin(obj) {
	  for (var key in Emitter.prototype) {
	    obj[key] = Emitter.prototype[key];
	  }
	  return obj;
	}

	/**
	 * Listen on the given `event` with `fn`.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.on =
	Emitter.prototype.addEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};
	  (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
	    .push(fn);
	  return this;
	};

	/**
	 * Adds an `event` listener that will be invoked a single
	 * time then automatically removed.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.once = function(event, fn){
	  function on() {
	    this.off(event, on);
	    fn.apply(this, arguments);
	  }

	  on.fn = fn;
	  this.on(event, on);
	  return this;
	};

	/**
	 * Remove the given callback for `event` or all
	 * registered callbacks.
	 *
	 * @param {String} event
	 * @param {Function} fn
	 * @return {Emitter}
	 * @api public
	 */

	Emitter.prototype.off =
	Emitter.prototype.removeListener =
	Emitter.prototype.removeAllListeners =
	Emitter.prototype.removeEventListener = function(event, fn){
	  this._callbacks = this._callbacks || {};

	  // all
	  if (0 == arguments.length) {
	    this._callbacks = {};
	    return this;
	  }

	  // specific event
	  var callbacks = this._callbacks['$' + event];
	  if (!callbacks) return this;

	  // remove all handlers
	  if (1 == arguments.length) {
	    delete this._callbacks['$' + event];
	    return this;
	  }

	  // remove specific handler
	  var cb;
	  for (var i = 0; i < callbacks.length; i++) {
	    cb = callbacks[i];
	    if (cb === fn || cb.fn === fn) {
	      callbacks.splice(i, 1);
	      break;
	    }
	  }
	  return this;
	};

	/**
	 * Emit `event` with the given args.
	 *
	 * @param {String} event
	 * @param {Mixed} ...
	 * @return {Emitter}
	 */

	Emitter.prototype.emit = function(event){
	  this._callbacks = this._callbacks || {};
	  var args = [].slice.call(arguments, 1)
	    , callbacks = this._callbacks['$' + event];

	  if (callbacks) {
	    callbacks = callbacks.slice(0);
	    for (var i = 0, len = callbacks.length; i < len; ++i) {
	      callbacks[i].apply(this, args);
	    }
	  }

	  return this;
	};

	/**
	 * Return array of callbacks for `event`.
	 *
	 * @param {String} event
	 * @return {Array}
	 * @api public
	 */

	Emitter.prototype.listeners = function(event){
	  this._callbacks = this._callbacks || {};
	  return this._callbacks['$' + event] || [];
	};

	/**
	 * Check if this emitter has `event` handlers.
	 *
	 * @param {String} event
	 * @return {Boolean}
	 * @api public
	 */

	Emitter.prototype.hasListeners = function(event){
	  return !! this.listeners(event).length;
	};


/***/ }),
/* 129 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var type;
	try {
	  type = __webpack_require__(8);
	} catch (_) {
	  type = __webpack_require__(8);
	}

	/**
	 * Module exports.
	 */

	module.exports = clone;

	/**
	 * Clones objects.
	 *
	 * @param {Mixed} any object
	 * @api public
	 */

	function clone(obj){
	  switch (type(obj)) {
	    case 'object':
	      var copy = {};
	      for (var key in obj) {
	        if (obj.hasOwnProperty(key)) {
	          copy[key] = clone(obj[key]);
	        }
	      }
	      return copy;

	    case 'array':
	      var copy = new Array(obj.length);
	      for (var i = 0, l = obj.length; i < l; i++) {
	        copy[i] = clone(obj[i]);
	      }
	      return copy;

	    case 'regexp':
	      // from millermedeiros/amd-utils - MIT
	      var flags = '';
	      flags += obj.multiline ? 'm' : '';
	      flags += obj.global ? 'g' : '';
	      flags += obj.ignoreCase ? 'i' : '';
	      return new RegExp(obj.source, flags);

	    case 'date':
	      return new Date(obj.getTime());

	    default: // string, number, boolean, …
	      return obj;
	  }
	}


/***/ }),
/* 130 */
/***/ (function(module, exports) {

	
	// easing functions from "Tween.js"

	exports.linear = function(n){
	  return n;
	};

	exports.inQuad = function(n){
	  return n * n;
	};

	exports.outQuad = function(n){
	  return n * (2 - n);
	};

	exports.inOutQuad = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n;
	  return - 0.5 * (--n * (n - 2) - 1);
	};

	exports.inCube = function(n){
	  return n * n * n;
	};

	exports.outCube = function(n){
	  return --n * n * n + 1;
	};

	exports.inOutCube = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n * n;
	  return 0.5 * ((n -= 2 ) * n * n + 2);
	};

	exports.inQuart = function(n){
	  return n * n * n * n;
	};

	exports.outQuart = function(n){
	  return 1 - (--n * n * n * n);
	};

	exports.inOutQuart = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n * n * n;
	  return -0.5 * ((n -= 2) * n * n * n - 2);
	};

	exports.inQuint = function(n){
	  return n * n * n * n * n;
	}

	exports.outQuint = function(n){
	  return --n * n * n * n * n + 1;
	}

	exports.inOutQuint = function(n){
	  n *= 2;
	  if (n < 1) return 0.5 * n * n * n * n * n;
	  return 0.5 * ((n -= 2) * n * n * n * n + 2);
	};

	exports.inSine = function(n){
	  return 1 - Math.cos(n * Math.PI / 2 );
	};

	exports.outSine = function(n){
	  return Math.sin(n * Math.PI / 2);
	};

	exports.inOutSine = function(n){
	  return .5 * (1 - Math.cos(Math.PI * n));
	};

	exports.inExpo = function(n){
	  return 0 == n ? 0 : Math.pow(1024, n - 1);
	};

	exports.outExpo = function(n){
	  return 1 == n ? n : 1 - Math.pow(2, -10 * n);
	};

	exports.inOutExpo = function(n){
	  if (0 == n) return 0;
	  if (1 == n) return 1;
	  if ((n *= 2) < 1) return .5 * Math.pow(1024, n - 1);
	  return .5 * (-Math.pow(2, -10 * (n - 1)) + 2);
	};

	exports.inCirc = function(n){
	  return 1 - Math.sqrt(1 - n * n);
	};

	exports.outCirc = function(n){
	  return Math.sqrt(1 - (--n * n));
	};

	exports.inOutCirc = function(n){
	  n *= 2
	  if (n < 1) return -0.5 * (Math.sqrt(1 - n * n) - 1);
	  return 0.5 * (Math.sqrt(1 - (n -= 2) * n) + 1);
	};

	exports.inBack = function(n){
	  var s = 1.70158;
	  return n * n * (( s + 1 ) * n - s);
	};

	exports.outBack = function(n){
	  var s = 1.70158;
	  return --n * n * ((s + 1) * n + s) + 1;
	};

	exports.inOutBack = function(n){
	  var s = 1.70158 * 1.525;
	  if ( ( n *= 2 ) < 1 ) return 0.5 * ( n * n * ( ( s + 1 ) * n - s ) );
	  return 0.5 * ( ( n -= 2 ) * n * ( ( s + 1 ) * n + s ) + 2 );
	};

	exports.inBounce = function(n){
	  return 1 - exports.outBounce(1 - n);
	};

	exports.outBounce = function(n){
	  if ( n < ( 1 / 2.75 ) ) {
	    return 7.5625 * n * n;
	  } else if ( n < ( 2 / 2.75 ) ) {
	    return 7.5625 * ( n -= ( 1.5 / 2.75 ) ) * n + 0.75;
	  } else if ( n < ( 2.5 / 2.75 ) ) {
	    return 7.5625 * ( n -= ( 2.25 / 2.75 ) ) * n + 0.9375;
	  } else {
	    return 7.5625 * ( n -= ( 2.625 / 2.75 ) ) * n + 0.984375;
	  }
	};

	exports.inOutBounce = function(n){
	  if (n < .5) return exports.inBounce(n * 2) * .5;
	  return exports.outBounce(n * 2 - 1) * .5 + .5;
	};

	// aliases

	exports['in-quad'] = exports.inQuad;
	exports['out-quad'] = exports.outQuad;
	exports['in-out-quad'] = exports.inOutQuad;
	exports['in-cube'] = exports.inCube;
	exports['out-cube'] = exports.outCube;
	exports['in-out-cube'] = exports.inOutCube;
	exports['in-quart'] = exports.inQuart;
	exports['out-quart'] = exports.outQuart;
	exports['in-out-quart'] = exports.inOutQuart;
	exports['in-quint'] = exports.inQuint;
	exports['out-quint'] = exports.outQuint;
	exports['in-out-quint'] = exports.inOutQuint;
	exports['in-sine'] = exports.inSine;
	exports['out-sine'] = exports.outSine;
	exports['in-out-sine'] = exports.inOutSine;
	exports['in-expo'] = exports.inExpo;
	exports['out-expo'] = exports.outExpo;
	exports['in-out-expo'] = exports.inOutExpo;
	exports['in-circ'] = exports.inCirc;
	exports['out-circ'] = exports.outCirc;
	exports['in-out-circ'] = exports.inOutCirc;
	exports['in-back'] = exports.inBack;
	exports['out-back'] = exports.outBack;
	exports['in-out-back'] = exports.inOutBack;
	exports['in-bounce'] = exports.inBounce;
	exports['out-bounce'] = exports.outBounce;
	exports['in-out-bounce'] = exports.inOutBounce;


/***/ }),
/* 131 */
/***/ (function(module, exports) {

	/**
	 * Expose `requestAnimationFrame()`.
	 */

	exports = module.exports = window.requestAnimationFrame
	  || window.webkitRequestAnimationFrame
	  || window.mozRequestAnimationFrame
	  || fallback;

	/**
	 * Fallback implementation.
	 */

	var prev = new Date().getTime();
	function fallback(fn) {
	  var curr = new Date().getTime();
	  var ms = Math.max(0, 16 - (curr - prev));
	  var req = setTimeout(fn, ms);
	  prev = curr;
	  return req;
	}

	/**
	 * Cancel.
	 */

	var cancel = window.cancelAnimationFrame
	  || window.webkitCancelAnimationFrame
	  || window.mozCancelAnimationFrame
	  || window.clearTimeout;

	exports.cancel = function(id){
	  cancel.call(window, id);
	};


/***/ }),
/* 132 */
/***/ (function(module, exports) {

	var bind, unbind, prefix;

	function detect () {
	  bind = window.addEventListener ? 'addEventListener' : 'attachEvent';
	  unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent';
	  prefix = bind !== 'addEventListener' ? 'on' : '';
	}

	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, type, fn, capture){
	  if (!bind) detect();
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};

	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  if (!unbind) detect();
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};


/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(10);

	var _assign2 = _interopRequireDefault(_assign);

	exports.toAppService = toAppService;
	exports.reload = reload;
	exports.lifeSycleEvent = lifeSycleEvent;
	exports.onLaunch = onLaunch;
	exports.onBack = onBack;
	exports.onNavigate = onNavigate;

	var _util = __webpack_require__(5);

	var _bus = __webpack_require__(46);

	var _bus2 = _interopRequireDefault(_bus);

	var _viewManage = __webpack_require__(61);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var serviceReady = false;
	var SERVICE_ID = 100000;

	_bus2.default.once('APP_SERVICE_COMPLETE', function () {
	  serviceReady = true;
	  window.postMessage({
	    to: 'devtools',
	    sdkName: 'APP_SERVICE_COMPLETE'
	  }, '*');
	});

	function message(obj) {
	  var msg = obj.msg || {},
	      ext = obj.ext || {};
	  if (obj.command == 'GET_ASSDK_RES') {
	    ServiceJSBridge.invokeCallbackHandler(ext.callbackID, msg);
	  } else if (obj.command == 'MSG_FROM_WEBVIEW') {
	    ServiceJSBridge.subscribeHandler(msg.eventName, msg.data || {}, msg.webviewID);
	  } else if (obj.command == 'WRITE_APP_DATA') {
	    for (var message in msg) {
	      var detail = msg[message],
	          webviewId = detail.__webviewId__;
	      ServiceJSBridge.publish("appDataChange", {
	        data: {
	          data: detail
	        }
	      }, [webviewId], true);
	    }
	  }
	}

	function toAppService(data) {
	  data.to = 'appservice';
	  var obj = (0, _assign2.default)({
	    command: 'MSG_FROM_WEBVIEW',
	    webviewID: SERVICE_ID
	  }, data);
	  if (obj.msg && obj.command !== 'GET_ASSDK_RES') {
	    var view = (0, _viewManage.currentView)();
	    var id = view ? view.id : 0;
	    obj.msg.webviewID = data.webviewID || id;
	    obj.msg.options = obj.msg.options || {};
	    obj.msg.options.timestamp = Date.now();
	  }
	  if (serviceReady) {
	    message(obj);
	  } else {
	    _bus2.default.once('APP_SERVICE_COMPLETE', function () {
	      message(obj);
	    });
	  }
	}

	function reload(path) {
	  toAppService({
	    msg: {
	      data: { path: path },
	      eventName: 'reload'
	    }
	  });
	}

	function lifeSycleEvent(path, query, openType) {
	  toAppService({
	    msg: {
	      eventName: 'onAppRoute',
	      type: 'ON_APPLIFECYCLE_EVENT',
	      data: {
	        path: path + '.wxml',
	        query: query,
	        openType: openType
	      }
	    }
	  });
	}

	function onLaunch(rootPath) {
	  var _parsePath = (0, _util.parsePath)(rootPath),
	      path = _parsePath.path,
	      query = _parsePath.query;

	  lifeSycleEvent(path, query, 'appLaunch');
	}

	function onBack() {
	  var view = (0, _viewManage.currentView)();
	  lifeSycleEvent(view.path, view.query, 'navigateBack');
	}

	function onNavigate(data) {
	  var type = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'navigateTo';

	  if (!data.args.url) throw new Error('url not found');
	  var view = (0, _viewManage.currentView)();
	  if ((type == 'navigateTo' || type == 'redirectTo') && (0, _util.isTabbar)(view.url)) {
	    console.error('wx.navigateTo wx.redirectTo 不允许跳转到 tabbar 页面，请使用 wx.switchTab');
	    return;
	  }
	  //message({
	  //  to: 'appservice',
	  //  msg: {
	  //    errMsg: `${data.sdkName}:ok`,
	  //    url: data.args.url,
	  //    webviewId: view.id
	  //  },
	  //  command: 'GET_ASSDK_RES',
	  //  ext: merge.recursive(true, {}, data),
	  //  webviewID: SERVICE_ID
	  //})
	  view.onReady(function () {
	    lifeSycleEvent(view.path, view.query, type);
	  });
	}

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(10);

	var _assign2 = _interopRequireDefault(_assign);

	var _getIterator2 = __webpack_require__(67);

	var _getIterator3 = _interopRequireDefault(_getIterator2);

	exports.getPublicLibVersion = getPublicLibVersion;
	exports.systemLog = systemLog;
	exports.switchTab = switchTab;
	exports.shareAppMessage = shareAppMessage;
	exports.requestPayment = requestPayment;
	exports.previewImage = previewImage;
	exports.PULLDOWN_REFRESH = PULLDOWN_REFRESH;
	exports.stopPullDownRefresh = stopPullDownRefresh;
	exports.publish = publish;
	exports.scanCode = scanCode;
	exports.WEBVIEW_READY = WEBVIEW_READY;
	exports.redirectTo = redirectTo;
	exports.navigateTo = navigateTo;
	exports.navigateBack = navigateBack;
	exports.APP_SERVICE_COMPLETE = APP_SERVICE_COMPLETE;
	exports.GET_APP_DATA = GET_APP_DATA;
	exports.WRITE_APP_DATA = WRITE_APP_DATA;
	exports.GET_APP_STORAGE = GET_APP_STORAGE;
	exports.DELETE_APP_STORAGE = DELETE_APP_STORAGE;
	exports.SET_APP_STORAGE = SET_APP_STORAGE;
	exports.send_app_data = send_app_data;
	exports.setNavigationBarTitle = setNavigationBarTitle;
	exports.showNavigationBarLoading = showNavigationBarLoading;
	exports.hideNavigationBarLoading = hideNavigationBarLoading;
	exports.chooseImage = chooseImage;
	exports.chooseVideo = chooseVideo;
	exports.saveFile = saveFile;
	exports.enableCompass = enableCompass;
	exports.enableAccelerometer = enableAccelerometer;
	exports.getNetworkType = getNetworkType;
	exports.getLocation = getLocation;
	exports.openLocation = openLocation;
	exports.chooseLocation = chooseLocation;
	exports.setStorage = setStorage;
	exports.getStorage = getStorage;
	exports.clearStorage = clearStorage;
	exports.startRecord = startRecord;
	exports.stopRecord = stopRecord;
	exports.playVoice = playVoice;
	exports.pauseVoice = pauseVoice;
	exports.stopVoice = stopVoice;
	exports.getMusicPlayerState = getMusicPlayerState;
	exports.operateMusicPlayer = operateMusicPlayer;
	exports.uploadFile = uploadFile;
	exports.downloadFile = downloadFile;
	exports.getSavedFileList = getSavedFileList;
	exports.removeSavedFile = removeSavedFile;
	exports.getSavedFileInfo = getSavedFileInfo;
	exports.openDocument = openDocument;
	exports.getStorageInfo = getStorageInfo;
	exports.removeStorage = removeStorage;
	exports.showToast = showToast;
	exports.hideToast = hideToast;
	exports.showModal = showModal;
	exports.showActionSheet = showActionSheet;
	exports.getImageInfo = getImageInfo;
	exports.base64ToTempFilePath = base64ToTempFilePath;
	exports.refreshSession = refreshSession;
	exports.showPickerView = showPickerView;
	exports.showDatePickerView = showDatePickerView;

	var _nprogress = __webpack_require__(4);

	var _nprogress2 = _interopRequireDefault(_nprogress);

	var _filePicker = __webpack_require__(135);

	var _filePicker2 = _interopRequireDefault(_filePicker);

	var _merge = __webpack_require__(137);

	var _merge2 = _interopRequireDefault(_merge);

	var _upload = __webpack_require__(139);

	var _upload2 = _interopRequireDefault(_upload);

	var _nodeSerial = __webpack_require__(140);

	var _nodeSerial2 = _interopRequireDefault(_nodeSerial);

	var _bus = __webpack_require__(46);

	var _bus2 = _interopRequireDefault(_bus);

	var _viewManage = __webpack_require__(61);

	var viewManage = _interopRequireWildcard(_viewManage);

	var _service = __webpack_require__(133);

	var _header = __webpack_require__(9);

	var _header2 = _interopRequireDefault(_header);

	var _throttleit = __webpack_require__(145);

	var _throttleit2 = _interopRequireDefault(_throttleit);

	var _record = __webpack_require__(146);

	var _record2 = _interopRequireDefault(_record);

	var _compass = __webpack_require__(163);

	var _compass2 = _interopRequireDefault(_compass);

	var _storage = __webpack_require__(125);

	var _storage2 = _interopRequireDefault(_storage);

	var _picker = __webpack_require__(164);

	var _picker2 = _interopRequireDefault(_picker);

	var _timePicker = __webpack_require__(173);

	var _timePicker2 = _interopRequireDefault(_timePicker);

	var _datePicker = __webpack_require__(178);

	var _datePicker2 = _interopRequireDefault(_datePicker);

	var _fileList = __webpack_require__(179);

	var fileList = _interopRequireWildcard(_fileList);

	var _toast = __webpack_require__(183);

	var _toast2 = _interopRequireDefault(_toast);

	var _image = __webpack_require__(187);

	var _image2 = _interopRequireDefault(_image);

	var _modal = __webpack_require__(188);

	var _modal2 = _interopRequireDefault(_modal);

	var _actionsheet = __webpack_require__(189);

	var _actionsheet2 = _interopRequireDefault(_actionsheet);

	var _event = __webpack_require__(190);

	var _preview = __webpack_require__(191);

	var _preview2 = _interopRequireDefault(_preview);

	var _confirm = __webpack_require__(200);

	var _confirm2 = _interopRequireDefault(_confirm);

	var _toast3 = __webpack_require__(126);

	var _toast4 = _interopRequireDefault(_toast3);

	var _mask = __webpack_require__(201);

	var _mask2 = _interopRequireDefault(_mask);

	var _qrscan = __webpack_require__(203);

	var _qrscan2 = _interopRequireDefault(_qrscan);

	var _util = __webpack_require__(5);

	function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var appData = {}; //eslint-disable-line
	var fileIndex = 0;
	var fileStore = {};

	function getPublicLibVersion() {
	  //ignore
	}

	function systemLog() {
	  //ignore
	}

	function switchTab(data) {
	  var url = data.args.url;
	  _nprogress2.default.start();
	  viewManage.switchTo(url);
	  (0, _service.onNavigate)(data, 'switchTab');
	}

	function shareAppMessage(data) {
	  var _data$args = data.args,
	      desc = _data$args.desc,
	      imgUrl = _data$args.imgUrl,
	      path = _data$args.path,
	      title = _data$args.title;

	  (0, _modal2.default)({
	    title: title,
	    imgUrl: imgUrl,
	    content: desc
	  }).then(function (confirm) {
	    onSuccess(data, { confirm: confirm });
	  });
	}

	function requestPayment(data) {
	  (0, _confirm2.default)('确认支付吗？').then(function () {
	    onSuccess(data, { statusCode: 200 });
	  }, function () {
	    onError(data);
	  });
	}

	function previewImage(data) {
	  var args = data.args;
	  var urls = args.urls;
	  var current = args.current;
	  var preview = new _preview2.default(urls, {});
	  preview.show();
	  preview.active(current);
	  onSuccess(data);
	}

	function PULLDOWN_REFRESH(data) {
	  (0, _service.toAppService)({
	    msg: {
	      data: {},
	      eventName: "onPullDownRefresh",
	      webviewID: data.webviewID
	    }
	  });
	}

	function stopPullDownRefresh(data) {
	  var curr = viewManage.currentView();
	  if (curr) {
	    curr.postMessage({
	      command: "STOP_PULL_DOWN_REFRESH"
	    });
	  }
	  data.sdkName = 'stopPullDownRefresh';
	  onSuccess(data);
	}

	// publish event to views
	function publish(data) {
	  var all_ids = viewManage.getViewIds();
	  var ids = (0, _util.toNumber)(data.webviewIds) || all_ids;
	  data.act = 'sendMsgFromAppService';
	  var obj = {
	    msg: data,
	    command: 'MSG_FROM_APPSERVICE'
	  };
	  viewManage.eachView(function (view) {
	    if (ids.indexOf(view.id) !== -1) {
	      view.postMessage(obj);
	    }
	  });
	}

	function scanCode(data) {
	  (0, _qrscan2.default)().then(function (val) {
	    onSuccess(data, {
	      result: val
	    });
	  }, function () {
	    onCancel(data);
	  });
	}

	function WEBVIEW_READY(data) {
	  console.log(data);
	}

	function redirectTo(data) {
	  _nprogress2.default.start();
	  viewManage.redirectTo(data.args.url);
	  (0, _service.onNavigate)(data, 'redirectTo');
	}

	function navigateTo(data) {
	  var str = sessionStorage.getItem('routes');
	  if (str && str.split('|').length >= 5) {
	    return (0, _toast4.default)('页面栈已达上线 5 个，无法继续创建！', { type: 'error' });
	  }
	  _nprogress2.default.start();
	  viewManage.navigateTo(data.args.url);
	  (0, _service.onNavigate)(data, 'navigateTo');
	}

	function navigateBack(data) {
	  data.args = data.args || {};
	  data.args.url = viewManage.currentView().path + '.html';
	  var delta = data.args.delta ? Number(data.args.delta) : 1;
	  if (isNaN(delta)) return (0, _toast4.default)('Delta 必须为数字', { type: 'error' });
	  viewManage.navigateBack(delta, function () {
	    (0, _service.onBack)();
	  });
	  (0, _service.onNavigate)(data, 'navigateBack');
	}

	function getRoutes() {
	  var root = window.__root__;
	  var path = location.hash.replace(/^#!/, '');
	  if (sessionStorage == null) return path ? [path] : [root];
	  var str = sessionStorage.getItem('routes');
	  if (!str) return path ? [path] : [root];
	  var routes = str.split('|');
	  if (routes.indexOf(path) !== routes.length - 1) {
	    //当前的页面不是路由表中最后一个 每次进入都可以到退出时的页面
	    return path ? [path] : [root];
	  }
	  return routes;
	}

	function APP_SERVICE_COMPLETE(data) {
	  //eslint-disable-line
	  _bus2.default.emit('APP_SERVICE_COMPLETE');
	  var routes = getRoutes();
	  var first = routes.shift();
	  var valid = (0, _util.validPath)(first);
	  if (!valid) console.warn('Invalid route: ' + first + ', redirect to root');
	  // make sure root is valid page
	  var root = valid ? first : window.__root__;
	  viewManage.navigateTo(root); //页面切换，路由表更新
	  (0, _service.onLaunch)(root); //
	  if (!valid) return;
	  if (routes.length) {
	    _mask2.default.show();
	    var cid = viewManage.currentView().id;
	    _bus2.default.once('ready', function (id) {
	      if (id !== cid) return _mask2.default.hide();
	      var serial = new _nodeSerial2.default(); //顺序执行注册函数
	      serial.timeout(10000);
	      var _iteratorNormalCompletion = true;
	      var _didIteratorError = false;
	      var _iteratorError = undefined;

	      try {
	        var _loop = function _loop() {
	          var route = _step.value;
	          //为路由表中的页面注册ready事件
	          // check if in pages
	          valid = (0, _util.validPath)(route);
	          if (!valid) {
	            console.warn('\u65E0\u6CD5\u5728 pages \u914D\u7F6E\u4E2D\u627E\u5230 ' + route + '\uFF0C\u505C\u6B62\u8DEF\u7531');
	            return 'break';
	          }
	          serial.add(function (cb) {
	            var data = (0, _util.getRedirectData)('/' + route, viewManage.currentView().id); //获取到路由数据
	            (0, _service.toAppService)(data);
	            _bus2.default.once('ready', function () {
	              return cb();
	            });
	          });
	        };

	        for (var _iterator = (0, _getIterator3.default)(routes), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
	          var _ret = _loop();

	          if (_ret === 'break') break;
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

	      serial.done(function (err) {
	        _mask2.default.hide();
	        if (err) {
	          console.error(err.stack);
	          (0, _toast4.default)(err.message, { type: 'error' });
	          return;
	        }
	      });
	    });
	  }
	}

	function GET_APP_DATA(data) {
	  window.postMessage({
	    to: data.comefrom,
	    comefrom: 'backgroundjs',
	    msg: {
	      appData: appData
	    },
	    command: 'SEND_APP_DATA'
	  }, '*');
	}

	function WRITE_APP_DATA(data) {
	  appData = data.data;
	  (0, _service.toAppService)({
	    command: 'WRITE_APP_DATA',
	    msg: appData
	  });
	}

	function GET_APP_STORAGE(data) {
	  var res = _storage2.default.getAll();
	  window.postMessage({
	    to: data.comefrom,
	    msg: {
	      storage: res
	    },
	    command: 'SET_APP_STORAGE'
	  }, '*');
	}

	function DELETE_APP_STORAGE(data) {
	  if (!data.data || !data.data.key) return console.error('key not found');
	  _storage2.default.remove(data.data.key);
	}

	function SET_APP_STORAGE(data) {
	  var d = data.data;
	  if (!d || !d.key || !d.type) return console.error('wrong arguments');
	  _storage2.default.set(d.key, d.value, d.type);
	}

	_storage2.default.on('change', function () {
	  var res = _storage2.default.getAll();
	  window.postMessage({
	    to: 'devtools-storage',
	    msg: {
	      storage: res
	    },
	    command: 'SET_APP_STORAGE'
	  }, '*');
	});

	function send_app_data(data) {
	  appData = data.appData;
	  window.postMessage({
	    to: 'devtools-appdata',
	    msg: {
	      appData: appData
	    },
	    command: 'SEND_APP_DATA'
	  }, '*');
	}

	function setNavigationBarTitle(data) {
	  var title = data.args.title;
	  if (title) _header2.default.setTitle(title);
	}

	function showNavigationBarLoading() {
	  _header2.default.showLoading();
	}

	function hideNavigationBarLoading() {
	  _header2.default.hideLoading();
	}

	function chooseImage(data) {
	  var URL = window.URL || window.webkitURL;
	  (0, _filePicker2.default)({ multiple: true, accept: 'image/*' }, function (files) {
	    files = [].slice.call(files);
	    var paths = files.map(function (file) {
	      var blob = URL.createObjectURL(file);
	      fileStore[blob] = file;
	      return blob;
	    });
	    onSuccess(data, { tempFilePaths: paths });
	  });
	}

	function chooseVideo(data) {
	  var URL = window.URL || window.webkitURL;
	  (0, _filePicker2.default)({ accept: 'video/*' }, function (files) {
	    var path = URL.createObjectURL(files[0]);
	    fileStore[path] = files[0];
	    var video = document.createElement('video');
	    video.preload = 'metadata';
	    video.onloadedmetadata = function () {
	      var duration = video.duration;
	      var size = files[0].size;
	      onSuccess(data, {
	        duration: duration,
	        size: size,
	        height: video.videoHeight,
	        width: video.videoWidth,
	        tempFilePath: path
	      });
	    };
	    video.src = path;
	  });
	}

	function saveFile(data) {
	  var blob = data.args.tempFilePath;
	  if (!blob) return onError(data, 'file path required');
	  var file = fileStore[blob];
	  if (!file) return onError(data, 'file not found');
	  var upload = new _upload2.default(file);
	  upload.to('/upload');
	  upload.on('end', function (xhr) {
	    if (xhr.status / 100 | 0 == 2) {
	      var result = JSON.parse(xhr.responseText);
	      onSuccess(data, {
	        statusCode: xhr.status,
	        savedFilePath: result.file_path
	      });
	    } else {
	      onError(data, 'request error ' + xhr.status);
	    }
	  });
	  upload.on('error', function (err) {
	    onError(data, err.message);
	  });
	}

	function enableCompass() {
	  var id = _compass2.default.watch((0, _throttleit2.default)(function (head) {
	    (0, _service.toAppService)({
	      msg: {
	        eventName: 'onCompassChange',
	        type: 'ON_APPLIFECYCLE_EVENT',
	        data: {
	          direction: head
	        }
	      }
	    });
	  }, 200));
	  viewManage.currentView().on('destroy', function () {
	    _compass2.default.unwatch(id);
	  });
	}

	function enableAccelerometer() {
	  if (window.DeviceMotionEvent) {
	    var handler = (0, _throttleit2.default)(function (event) {
	      var _x$y$z = {
	        x: event.accelerationIncludingGravity.x,
	        y: event.accelerationIncludingGravity.y,
	        z: event.accelerationIncludingGravity.z
	      },
	          x = _x$y$z.x,
	          y = _x$y$z.y,
	          z = _x$y$z.z;

	      if (x == null || y == null || z == null) return;
	      (0, _service.toAppService)({
	        msg: {
	          eventName: 'onAccelerometerChange',
	          type: 'ON_APPLIFECYCLE_EVENT',
	          data: { x: x, y: y, z: z }
	        }
	      });
	    }, 200);
	    window.addEventListener("devicemotion", handler, false);
	    viewManage.currentView().on('destroy', function () {
	      window.removeEventListener("devicemotion", handler, false);
	    });
	  } else {
	    console.warn("DeviceMotionEvent is not supported");
	  }
	}

	function getNetworkType(data) {
	  var type = navigator.connection == null ? 'WIFI' : navigator.connection.type;
	  onSuccess(data, {
	    networkType: type
	  });
	}

	function getLocation(data) {
	  if ("geolocation" in navigator) {
	    navigator.geolocation.getCurrentPosition(function (position) {
	      var coords = position.coords;
	      onSuccess(data, {
	        longitude: coords.longitude,
	        latitude: coords.latitude
	      });
	    });
	  } else {
	    onError(data, {
	      message: 'geolocation not supported'
	    });
	  }
	}

	function openLocation(data) {
	  var args = data.args;
	  var url = "http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:" + args.latitude + "," + args.longitude + "&key=JMRBZ-R4HCD-X674O-PXLN4-B7CLH-42BSB&referer=wxdevtools";
	  viewManage.openExternal(url);
	  _nprogress2.default.done();
	  onSuccess(data, {
	    latitude: args.latitude,
	    longitude: args.longitude
	  });
	}

	function chooseLocation(data) {
	  var url = 'https://3gimg.qq.com/lightmap/components/locationPicker2/index.html?search=1&type=1&coord=39.90403%2C116.407526&key=JMRBZ-R4HCD-X674O-PXLN4-B7CLH-42BSB&referer=wxdevtools';
	  viewManage.openExternal(url);
	  _nprogress2.default.done();
	  var called = false;
	  _bus2.default.once('back', function () {
	    if (!called) {
	      called = true;
	      onCancel(data);
	    }
	  });
	  _bus2.default.once('location', function (location) {
	    if (!called) {
	      called = true;
	      if (location) {
	        onSuccess(data, location);
	      } else {
	        onCancel(data);
	      }
	    }
	  });
	}

	function setStorage(data) {
	  var args = data.args;
	  _storage2.default.set(args.key, args.data, args.dataType);
	  if (args.key == null || args.key == '') {
	    return onError(data, 'key required');
	  }
	  onSuccess(data);
	}

	function getStorage(data) {
	  var args = data.args;
	  if (args.key == null || args.key == '') {
	    return onError(data, 'key required');
	  }
	  var res = _storage2.default.get(args.key);
	  onSuccess(data, {
	    data: res.data,
	    dataType: res.dataType
	  });
	}

	function clearStorage(data) {
	  _storage2.default.clear();
	  onSuccess(data);
	}

	function startRecord(data) {
	  _record2.default.startRecord({
	    success: function success(url) {
	      onSuccess(data, {
	        tempFilePath: url
	      });
	    },
	    fail: function fail(err) {
	      return onError(data, err.message);
	    }
	  }).catch(function (e) {
	    console.warn('Audio record failed: ' + e.message);
	  });
	}

	function stopRecord() {

	  _record2.default.stopRecord().then(function (blob) {
	    var filename = 'audio' + fileIndex;
	    fileIndex++;
	    var file = new File([blob], filename, { type: 'audio/x-wav', lastModified: Date.now() });
	    fileStore[blob] = file;
	  });
	}

	function playVoice(data) {
	  var url = data.args.filePath;
	  var audio = document.getElementById("audio");
	  if (audio.src == url && audio.paused && !audio.ended) {
	    // resume
	    audio.play();
	  } else {
	    audio.src = url;
	    audio.load();
	    audio.play();
	    (0, _event.once)(audio, 'error', function (e) {
	      onError(data, e.message);
	    });
	    (0, _event.once)(audio, 'ended', function () {
	      onSuccess(data);
	    });
	  }
	}

	function pauseVoice() {
	  var audio = document.getElementById("audio");
	  audio.pause();
	}

	function stopVoice() {
	  var audio = document.getElementById("audio");
	  audio.pause();
	  audio.currentTime = 0;
	  audio.src = '';
	}

	window.addEventListener('DOMContentLoaded', function () {
	  var audio = document.getElementById("background-audio");
	  audio.addEventListener('error', function () {
	    (0, _service.toAppService)({
	      msg: {
	        eventName: 'onMusicError',
	        type: 'ON_MUSIC_EVENT'
	      }
	    });
	  }, false);
	}, false);

	function getMusicPlayerState(data) {
	  var a = document.getElementById("background-audio");
	  var obj = {
	    status: a.src ? a.paused ? 0 : 1 : 2,
	    currentPosition: Math.floor(a.currentTime) || -1
	  };
	  if (a.src && !a.paused) {
	    obj.duration = a.duration || 0;
	    try {
	      obj.downloadPercent = Math.round(100 * a.buffered.end(0) / a.duration);
	    } catch (e) {}
	    obj.dataUrl = a.currentSrc;
	  }
	  onSuccess(data, obj);
	}

	function operateMusicPlayer(data) {
	  var args = data.args;
	  var a = document.getElementById("background-audio");
	  switch (args.operationType) {
	    case 'play':
	      if (a.src == args.dataUrl && a.paused && !a.ended) {
	        a.play();
	      } else {
	        a.src = args.dataUrl;
	        a.load();
	        a.loop = true;
	        a.play();
	      }
	      (0, _service.toAppService)({
	        msg: {
	          eventName: 'onMusicPlay',
	          type: 'ON_MUSIC_EVENT'
	        }
	      });
	      break;
	    case 'pause':
	      a.pause();
	      (0, _service.toAppService)({
	        msg: {
	          eventName: 'onMusicPause',
	          type: 'ON_MUSIC_EVENT'
	        }
	      });
	      break;
	    case 'seek':
	      a.currentTime = args.position;
	      break;
	    case 'stop':
	      a.pause();
	      a.currentTime = 0;
	      a.src = '';
	      (0, _service.toAppService)({
	        msg: {
	          eventName: 'onMusicEnd',
	          type: 'ON_MUSIC_EVENT'
	        }
	      });
	      break;
	  }
	  onSuccess(data);
	}

	function uploadFile(data) {
	  var args = data.args;
	  if (!args.filePath || !args.url || !args.name) {
	    return onError(data, 'filePath, url and name required');
	  }
	  var file = fileStore[args.filePath];
	  if (!file) return onError(data, args.filePath + ' not found');

	  var headers = args.header || {};
	  if (headers.Referer || headers.rederer) {
	    console.warn('请注意，微信官方不允许设置请求 Referer');
	  }
	  var formData = args.formData || {};
	  var xhr = new XMLHttpRequest();
	  xhr.open('POST', '/remoteProxy');
	  xhr.onload = function () {
	    if (xhr.status / 100 | 0 == 2) {
	      onSuccess(data, { statusCode: xhr.status, data: xhr.responseText });
	    } else {
	      onError(data, 'request error ' + xhr.status);
	    }
	  };
	  xhr.onerror = function (e) {
	    onError(data, 'request error ' + e.message);
	  };
	  var key = void 0;
	  for (key in headers) {
	    xhr.setRequestHeader(key, headers[key]);
	  }
	  xhr.setRequestHeader('X-Remote', args.url);
	  var body = new FormData();
	  body.append(args.name, file);
	  for (key in formData) {
	    body.append(key, formData[key]);
	  }
	  xhr.send(body);
	}

	function downloadFile(data) {
	  var URL = window.URL || window.webkitURL;
	  var args = data.args;
	  if (!args.url) return onError(data, 'url required');
	  var xhr = new XMLHttpRequest();
	  xhr.responseType = 'arraybuffer';
	  var headers = args.header || {};
	  xhr.open('GET', '/remoteProxy?' + encodeURIComponent(args.url), true);
	  xhr.onload = function () {
	    if (xhr.status / 100 | 0 == 2 || xhr.status == 304) {
	      var b = new Blob([xhr.response], { type: xhr.getResponseHeader("Content-Type") });
	      var blob = URL.createObjectURL(b);
	      fileStore[blob] = b;
	      onSuccess(data, {
	        statusCode: xhr.status,
	        tempFilePath: blob
	      });
	    } else {
	      onError(data, 'request error ' + xhr.status);
	    }
	  };
	  xhr.onerror = function (e) {
	    onError(data, 'request error ' + e.message);
	  };
	  var key = void 0;
	  for (key in headers) {
	    xhr.setRequestHeader(key, headers[key]);
	  }
	  xhr.setRequestHeader('X-Remote', args.url);
	  xhr.send(null);
	}

	function getSavedFileList(data) {
	  fileList.getFileList().then(function (list) {
	    onSuccess(data, {
	      fileList: list
	    });
	  }, function (err) {
	    onError(data, err.message);
	  });
	}

	function removeSavedFile(data) {
	  var args = data.args;
	  if (requiredArgs(['filePath'], data)) return;
	  fileList.removeFile(args.filePath).then(function () {
	    onSuccess(data, {});
	  }, function (err) {
	    onError(data, err.message);
	  });
	}

	function getSavedFileInfo(data) {
	  var args = data.args;
	  if (requiredArgs(['filePath'], data)) return;
	  fileList.getFileInfo(args.filePath).then(function (info) {
	    onSuccess(data, info);
	  }, function (err) {
	    onError(data, err.message);
	  });
	}

	function openDocument(data) {
	  var args = data.args;
	  if (requiredArgs(['filePath'], data)) return;
	  console.warn('没有判定文件格式，返回为模拟返回');
	  onSuccess(data);
	  (0, _confirm2.default)('<div>openDocument</div> ' + args.filePath, true).then(function () {}, function () {});
	}

	function getStorageInfo(data) {
	  var info = _storage2.default.info();
	  onSuccess(data, info);
	}

	function removeStorage(data) {
	  var args = data.args;
	  if (requiredArgs(['key'], data)) return;

	  var o = _storage2.default.remove(args.key);
	  onSuccess(data, { data: o });
	}

	function showToast(data) {
	  if (requiredArgs(['title'], data)) return;
	  _toast2.default.show(data.args);
	  onSuccess(data);
	}

	function hideToast(data) {
	  _toast2.default.hide();
	  onSuccess(data);
	}

	function showModal(data) {
	  if (requiredArgs(['title', 'content'], data)) return;
	  (0, _modal2.default)(data.args).then(function (confirm) {
	    onSuccess(data, { confirm: confirm });
	  });
	}

	function showActionSheet(data) {
	  var args = data.args;
	  if (requiredArgs(['itemList'], data)) return;
	  if (!Array.isArray(args.itemList)) return onError(data, 'itemList must be Array');
	  args.itemList = args.itemList.slice(0, 6);
	  (0, _actionsheet2.default)(args).then(function (res) {
	    onSuccess(data, res);
	  });
	}

	function getImageInfo(data) {
	  if (requiredArgs(['src'], data)) return;
	  (0, _image2.default)(data.args.src).then(function (res) {
	    onSuccess(data, res);
	  }, function (err) {
	    onError(data, err.message);
	  });
	}

	function base64ToTempFilePath(data) {
	  var uri = data.args.base64Data;
	  // args.canvasId
	  onSuccess(data, {
	    filePath: (0, _util.dataURItoBlob)(uri)
	  });
	}

	function refreshSession(data) {
	  onSuccess(data);
	}

	function showPickerView(data, args) {
	  var picker = new _picker2.default(args);
	  picker.show();
	  //picker.on('cancel', () => {})
	  picker.on('select', function (n) {
	    publishPagEevent('bindPickerChange', {
	      type: 'change',
	      detail: {
	        value: n + ''
	      }
	    });
	  });
	}

	function showDatePickerView(data, args) {
	  var picker = void 0;
	  var eventName = void 0;
	  if (args.mode == 'time') {
	    eventName = 'bindTimeChange';
	    picker = new _timePicker2.default(args);
	  } else {
	    eventName = 'bindDateChange';
	    picker = new _datePicker2.default(args);
	  }
	  picker.show();
	  picker.on('select', function (val) {
	    publishPagEevent(eventName, {
	      type: 'change',
	      detail: {
	        value: val
	      }
	    });
	  });
	}

	function requiredArgs(keys, data) {
	  var args = data.args;
	  for (var i = 0, l = keys.length; i < l; i++) {
	    if (!args.hasOwnProperty(keys[i])) {
	      onError(data, 'key ' + keys[i] + ' required for ' + data.sdkName);
	      return true;
	    }
	  }
	  return false;
	}

	function onError(data, message) {
	  var obj = {
	    command: "GET_ASSDK_RES",
	    ext: (0, _assign2.default)({}, data),
	    msg: {
	      errMsg: data.sdkName + ':fail'
	    }
	  };
	  if (message) obj.msg.message = message;
	  (0, _service.toAppService)(obj);
	}

	function onSuccess(data) {
	  var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  if (!data.sdkName) throw new Error('sdkName not found');
	  var obj = {
	    command: "GET_ASSDK_RES",
	    ext: (0, _assign2.default)({}, data),
	    msg: {
	      errMsg: data.sdkName + ':ok'
	    }
	  };
	  obj.msg = (0, _assign2.default)(obj.msg, extra);
	  (0, _service.toAppService)(obj);
	}

	function onCancel(data) {
	  var extra = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

	  var obj = {
	    command: "GET_ASSDK_RES",
	    ext: (0, _assign2.default)({}, data),
	    msg: {
	      errMsg: data.sdkName + ':cancel'
	    }
	  };
	  obj.msg = (0, _assign2.default)(obj.msg, extra);
	  (0, _service.toAppService)(obj);
	}

	function publishPagEevent(eventName, extra) {
	  var obj = {
	    command: 'MSG_FROM_WEBVIEW',
	    msg: {
	      data: {
	        data: {
	          data: extra,
	          eventName: eventName
	        }
	      },
	      eventName: 'custom_event_PAGE_EVENT'
	    }
	  };
	  (0, _service.toAppService)(obj);
	}

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */

	var event = __webpack_require__(136);

	/**
	 * Expose `FilePicker`
	 */

	module.exports = FilePicker;

	/**
	 * Input template
	 */

	var form = document.createElement('form');
	form.innerHTML = '<input type="file" style="top: -1000px; position: absolute" aria-hidden="true">';
	document.body.appendChild(form);
	var input = form.childNodes[0];

	/**
	 * Already bound
	 */

	var bound = false;

	/**
	 * Opens a file picker dialog.
	 *
	 * @param {Object} options (optional)
	 * @param {Function} fn callback function
	 * @api public
	 */

	function FilePicker(opts, fn){
	  if ('function' == typeof opts) {
	    fn = opts;
	    opts = {};
	  }
	  opts = opts || {};

	  // multiple files support
	  input.multiple = !!opts.multiple;

	  // directory support
	  input.webkitdirectory = input.mozdirectory = input.directory = !!opts.directory;

	  // accepted file types support
	  if (null == opts.accept) {
	    delete input.accept;
	  } else if (opts.accept.join) {
	    // got an array
	    input.accept = opts.accept.join(',');
	  } else if (opts.accept) {
	    // got a regular string
	    input.accept = opts.accept;
	  }

	  // listen to change event (unbind old one if already listening)
	  if (bound) event.unbind(input, 'change', bound);
	  event.bind(input, 'change', onchange);
	  bound = onchange;

	  function onchange(e) {
	    fn(input.files, e, input);
	    event.unbind(input, 'change', onchange);
	    bound = false;
	  }

	  // reset the form
	  form.reset();

	  // trigger input dialog
	  input.click();
	}


/***/ }),
/* 136 */
/***/ (function(module, exports) {

	var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
	    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
	    prefix = bind !== 'addEventListener' ? 'on' : '';

	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, type, fn, capture){
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};

	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};

/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module) {/*!
	 * @name JavaScript/NodeJS Merge v1.2.0
	 * @author yeikos
	 * @repository https://github.com/yeikos/js.merge

	 * Copyright 2014 yeikos - MIT license
	 * https://raw.github.com/yeikos/js.merge/master/LICENSE
	 */

	;(function(isNode) {

		/**
		 * Merge one or more objects 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		var Public = function(clone) {

			return merge(clone === true, false, arguments);

		}, publicName = 'merge';

		/**
		 * Merge two or more objects recursively 
		 * @param bool? clone
		 * @param mixed,... arguments
		 * @return object
		 */

		Public.recursive = function(clone) {

			return merge(clone === true, true, arguments);

		};

		/**
		 * Clone the input removing any reference
		 * @param mixed input
		 * @return mixed
		 */

		Public.clone = function(input) {

			var output = input,
				type = typeOf(input),
				index, size;

			if (type === 'array') {

				output = [];
				size = input.length;

				for (index=0;index<size;++index)

					output[index] = Public.clone(input[index]);

			} else if (type === 'object') {

				output = {};

				for (index in input)

					output[index] = Public.clone(input[index]);

			}

			return output;

		};

		/**
		 * Merge two objects recursively
		 * @param mixed input
		 * @param mixed extend
		 * @return mixed
		 */

		function merge_recursive(base, extend) {

			if (typeOf(base) !== 'object')

				return extend;

			for (var key in extend) {

				if (typeOf(base[key]) === 'object' && typeOf(extend[key]) === 'object') {

					base[key] = merge_recursive(base[key], extend[key]);

				} else {

					base[key] = extend[key];

				}

			}

			return base;

		}

		/**
		 * Merge two or more objects
		 * @param bool clone
		 * @param bool recursive
		 * @param array argv
		 * @return object
		 */

		function merge(clone, recursive, argv) {

			var result = argv[0],
				size = argv.length;

			if (clone || typeOf(result) !== 'object')

				result = {};

			for (var index=0;index<size;++index) {

				var item = argv[index],

					type = typeOf(item);

				if (type !== 'object') continue;

				for (var key in item) {

					var sitem = clone ? Public.clone(item[key]) : item[key];

					if (recursive) {

						result[key] = merge_recursive(result[key], sitem);

					} else {

						result[key] = sitem;

					}

				}

			}

			return result;

		}

		/**
		 * Get type of variable
		 * @param mixed input
		 * @return string
		 *
		 * @see http://jsperf.com/typeofvar
		 */

		function typeOf(input) {

			return ({}).toString.call(input).slice(8, -1).toLowerCase();

		}

		if (isNode) {

			module.exports = Public;

		} else {

			window[publicName] = Public;

		}

	})(typeof module === 'object' && module && typeof module.exports === 'object' && module.exports);
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(138)(module)))

/***/ }),
/* 138 */
/***/ (function(module, exports) {

	module.exports = function(module) {
		if(!module.webpackPolyfill) {
			module.deprecate = function() {};
			module.paths = [];
			// module.parent = undefined by default
			module.children = [];
			module.webpackPolyfill = 1;
		}
		return module;
	}


/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(47);

	/**
	 * Expose `Upload`.
	 */

	module.exports = Upload;

	/**
	 * Initialize a new `Upload` file`.
	 * This represents a single file upload.
	 *
	 * Events:
	 *
	 *   - `error` an error occurred
	 *   - `abort` upload was aborted
	 *   - `progress` upload in progress (`e.percent` etc)
	 *   - `end` upload is complete
	 *
	 * @param {File} file
	 * @api private
	 */

	function Upload(file) {
	  if (!(this instanceof Upload)) return new Upload(file);
	  Emitter.call(this);
	  this.file = file;
	  file.slice = file.slice || file.webkitSlice;
	}

	/**
	 * Mixin emitter.
	 */

	Emitter(Upload.prototype);

	/**
	 * Upload to the given `path`.
	 *
	 * @param {String} options
	 * @param {Function} [fn]
	 * @api public
	 */

	Upload.prototype.to = function(options, fn){
	  // TODO: x-browser
	  var path;
	  if (typeof options == 'string') {
	    path = options;
	    options = {};
	  } else {
	    path = options.path;
	  }
	  var self = this;
	  fn = fn || function(){};
	  var req = this.req = new XMLHttpRequest;
	  req.open('POST', path);
	  req.onload = this.onload.bind(this);
	  req.onerror = this.onerror.bind(this);
	  req.upload.onprogress = this.onprogress.bind(this);
	  req.onreadystatechange = function(){
	    if (4 == req.readyState) {
	      var type = req.status / 100 | 0;
	      if (2 == type) return fn(null, req);
	      var err = new Error(req.statusText + ': ' + req.response);
	      err.status = req.status;
	      fn(err);
	    }
	  };
	  var key, headers = options.headers || {};
	  for (key in headers) {
	    req.setRequestHeader(key, headers[key]);
	  }
	  var body = new FormData;
	  body.append(options.name || 'file', this.file);
	  var data = options.data || {};
	  for (key in data) {
	    body.append(key, data[key]);
	  }
	  req.send(body);
	};

	/**
	 * Abort the XHR.
	 *
	 * @api public
	 */

	Upload.prototype.abort = function(){
	  this.emit('abort');
	  this.req.abort();
	};

	/**
	 * Error handler.
	 *
	 * @api private
	 */

	Upload.prototype.onerror = function(e){
	  this.emit('error', e);
	};

	/**
	 * Onload handler.
	 *
	 * @api private
	 */

	Upload.prototype.onload = function(e){
	  this.emit('end', this.req);
	};

	/**
	 * Progress handler.
	 *
	 * @api private
	 */

	Upload.prototype.onprogress = function(e){
	  e.percent = e.loaded / e.total * 100;
	  this.emit('progress', e);
	};


/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

	var nextTick = __webpack_require__(141);
	/**
	 * Parallel Class
	 * @api public
	 */
	function Serial () {
	  if (! (this instanceof Serial)) return new Serial();
	  this.ctx = {};
	  this.t = 10000;
	  this.cbs = [];
	  return this;
	}

	/**
	 * Set timeout `ms`
	 *
	 * @param {Number} ms
	 * @api public
	 */
	Serial.prototype.timeout = function(ms){
	  this.t = ms;
	  return this;
	}

	/**
	 * add `fn` as a callback
	 * `fn` is called with a `callback` and `ctx`
	 * `callback` should be called like `done(err, res)` when `fn` finished.
	 *
	 * @param {String} fn
	 * @api public
	 */
	Serial.prototype.add = function(fn){
	  var self = this;
	  this.cbs.push(function() {
	    var cb = timeout(function(err, res) {
	      if (err) return self.cb(err, self.ctx);
	      self.ctx.res = res;
	      self.next();
	    }, self.t);
	    fn(function() {
	      var args = arguments;
	      nextTick(function() {
	        cb.apply(null, args);
	      })
	    }, self.ctx);
	  })
	  return this;
	}

	/**
	 * `cb(err, ctx)` when serial finished
	 *
	 * @param {String} cb
	 * @api public
	 */
	Serial.prototype.done = function(cb){
	  if(this.cb) throw new Error('Callback exist');
	  var self = this;
	  this.cb = function() {
	    self.finished = true;
	    cb.apply(null, arguments);
	    delete self.cbs;
	  }
	  this.next();
	}

	Serial.prototype.next = function() {
	  if (this.finished) return;
	  var fn = this.cbs.shift();
	  if (fn) {
	    fn();
	  } else if (this.cb) {
	    this.cb(null, this.ctx);
	  }
	}

	function timeout (fn, ms) {
	  var called;
	  var id = setTimeout(function(){
	    fn(new Error('Timeout ' + ms + ' reached'));
	    called = true;
	  }, ms);
	  var cb = function() {
	    if (called) return;
	    clearTimeout(id);
	    fn.apply(null, arguments);
	  }
	  return cb;
	}

	module.exports = Serial;


/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {'use strict';

	if ((typeof process !== 'undefined') && process &&
			(typeof process.nextTick === 'function')) {

		// Node.js
		module.exports = process.nextTick;

	} else if (typeof setImmediate === 'function') {

		// W3C Draft
		// https://dvcs.w3.org/hg/webperf/raw-file/tip/specs/setImmediate/Overview.html
		module.exports = function (cb) { setImmediate(cb); };

	} else {

		// Wide available standard
		module.exports = function (cb) { setTimeout(cb, 0); };
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(142), __webpack_require__(143).setImmediate))

/***/ }),
/* 142 */
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
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

	var apply = Function.prototype.apply;

	// DOM APIs, for completeness

	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) {
	  if (timeout) {
	    timeout.close();
	  }
	};

	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};

	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};

	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};

	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);

	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};

	// setimmediate attaches itself to the global object
	__webpack_require__(144);
	exports.setImmediate = setImmediate;
	exports.clearImmediate = clearImmediate;


/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
	    "use strict";

	    if (global.setImmediate) {
	        return;
	    }

	    var nextHandle = 1; // Spec says greater than zero
	    var tasksByHandle = {};
	    var currentlyRunningATask = false;
	    var doc = global.document;
	    var registerImmediate;

	    function setImmediate(callback) {
	      // Callback can either be a function or a string
	      if (typeof callback !== "function") {
	        callback = new Function("" + callback);
	      }
	      // Copy function arguments
	      var args = new Array(arguments.length - 1);
	      for (var i = 0; i < args.length; i++) {
	          args[i] = arguments[i + 1];
	      }
	      // Store and register the task
	      var task = { callback: callback, args: args };
	      tasksByHandle[nextHandle] = task;
	      registerImmediate(nextHandle);
	      return nextHandle++;
	    }

	    function clearImmediate(handle) {
	        delete tasksByHandle[handle];
	    }

	    function run(task) {
	        var callback = task.callback;
	        var args = task.args;
	        switch (args.length) {
	        case 0:
	            callback();
	            break;
	        case 1:
	            callback(args[0]);
	            break;
	        case 2:
	            callback(args[0], args[1]);
	            break;
	        case 3:
	            callback(args[0], args[1], args[2]);
	            break;
	        default:
	            callback.apply(undefined, args);
	            break;
	        }
	    }

	    function runIfPresent(handle) {
	        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
	        // So if we're currently running a task, we'll need to delay this invocation.
	        if (currentlyRunningATask) {
	            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
	            // "too much recursion" error.
	            setTimeout(runIfPresent, 0, handle);
	        } else {
	            var task = tasksByHandle[handle];
	            if (task) {
	                currentlyRunningATask = true;
	                try {
	                    run(task);
	                } finally {
	                    clearImmediate(handle);
	                    currentlyRunningATask = false;
	                }
	            }
	        }
	    }

	    function installNextTickImplementation() {
	        registerImmediate = function(handle) {
	            process.nextTick(function () { runIfPresent(handle); });
	        };
	    }

	    function canUsePostMessage() {
	        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
	        // where `global.postMessage` means something completely different and can't be used for this purpose.
	        if (global.postMessage && !global.importScripts) {
	            var postMessageIsAsynchronous = true;
	            var oldOnMessage = global.onmessage;
	            global.onmessage = function() {
	                postMessageIsAsynchronous = false;
	            };
	            global.postMessage("", "*");
	            global.onmessage = oldOnMessage;
	            return postMessageIsAsynchronous;
	        }
	    }

	    function installPostMessageImplementation() {
	        // Installs an event handler on `global` for the `message` event: see
	        // * https://developer.mozilla.org/en/DOM/window.postMessage
	        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

	        var messagePrefix = "setImmediate$" + Math.random() + "$";
	        var onGlobalMessage = function(event) {
	            if (event.source === global &&
	                typeof event.data === "string" &&
	                event.data.indexOf(messagePrefix) === 0) {
	                runIfPresent(+event.data.slice(messagePrefix.length));
	            }
	        };

	        if (global.addEventListener) {
	            global.addEventListener("message", onGlobalMessage, false);
	        } else {
	            global.attachEvent("onmessage", onGlobalMessage);
	        }

	        registerImmediate = function(handle) {
	            global.postMessage(messagePrefix + handle, "*");
	        };
	    }

	    function installMessageChannelImplementation() {
	        var channel = new MessageChannel();
	        channel.port1.onmessage = function(event) {
	            var handle = event.data;
	            runIfPresent(handle);
	        };

	        registerImmediate = function(handle) {
	            channel.port2.postMessage(handle);
	        };
	    }

	    function installReadyStateChangeImplementation() {
	        var html = doc.documentElement;
	        registerImmediate = function(handle) {
	            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
	            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
	            var script = doc.createElement("script");
	            script.onreadystatechange = function () {
	                runIfPresent(handle);
	                script.onreadystatechange = null;
	                html.removeChild(script);
	                script = null;
	            };
	            html.appendChild(script);
	        };
	    }

	    function installSetTimeoutImplementation() {
	        registerImmediate = function(handle) {
	            setTimeout(runIfPresent, 0, handle);
	        };
	    }

	    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
	    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
	    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

	    // Don't get fooled by e.g. browserify environments.
	    if ({}.toString.call(global.process) === "[object process]") {
	        // For Node.js before 0.9
	        installNextTickImplementation();

	    } else if (canUsePostMessage()) {
	        // For non-IE10 modern browsers
	        installPostMessageImplementation();

	    } else if (global.MessageChannel) {
	        // For web workers, where supported
	        installMessageChannelImplementation();

	    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
	        // For IE 6–8
	        installReadyStateChangeImplementation();

	    } else {
	        // For older browsers
	        installSetTimeoutImplementation();
	    }

	    attachTo.setImmediate = setImmediate;
	    attachTo.clearImmediate = clearImmediate;
	}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }()), __webpack_require__(142)))

/***/ }),
/* 145 */
/***/ (function(module, exports) {

	module.exports = throttle;

	/**
	 * Returns a new function that, when invoked, invokes `func` at most once per `wait` milliseconds.
	 *
	 * @param {Function} func Function to wrap.
	 * @param {Number} wait Number of milliseconds that must elapse between `func` invocations.
	 * @return {Function} A new function that wraps the `func` function passed in.
	 */

	function throttle (func, wait) {
	  var ctx, args, rtn, timeoutID; // caching
	  var last = 0;

	  return function throttled () {
	    ctx = this;
	    args = arguments;
	    var delta = new Date() - last;
	    if (!timeoutID)
	      if (delta >= wait) call();
	      else timeoutID = setTimeout(call, wait - delta);
	    return rtn;
	  };

	  function call () {
	    timeoutID = 0;
	    last = +new Date();
	    rtn = func.apply(ctx, args);
	    ctx = null;
	    args = null;
	  }
	}


/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(147);

	var _promise2 = _interopRequireDefault(_promise);

	var _Recorder = __webpack_require__(161);

	var _Recorder2 = _interopRequireDefault(_Recorder);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	/* global Recorder */
	window.AudioContext = window.AudioContext || window.webkitAudioContext;

	var audioContext = window.AudioContext && new AudioContext();
	var audioInput = null,
	    realAudioInput = null,
	    inputPoint = null,
	    audioRecorder = null;
	var analyserNode;

	function initAudio() {
	  if (!navigator.getUserMedia) {
	    navigator.getUserMedia = navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
	  }
	  return new _promise2.default(function (resolve, reject) {
	    if (audioRecorder) return resolve();
	    navigator.getUserMedia({
	      'audio': {
	        'mandatory': {
	          'googEchoCancellation': 'false',
	          'googAutoGainControl': 'false',
	          'googNoiseSuppression': 'false',
	          'googHighpassFilter': 'false'
	        },
	        'optional': []
	      }
	    }, function (stream) {
	      inputPoint = audioContext.createGain();
	      // Create an AudioNode from the stream.
	      realAudioInput = audioContext.createMediaStreamSource(stream);
	      audioInput = realAudioInput;
	      audioInput.connect(inputPoint);
	      // audioInput = convertToMono( input );
	      analyserNode = audioContext.createAnalyser();
	      analyserNode.fftSize = 2048;
	      inputPoint.connect(analyserNode);

	      audioRecorder = new _Recorder2.default(inputPoint);

	      var zeroGain = audioContext.createGain();
	      zeroGain.gain.value = 0.0;
	      inputPoint.connect(zeroGain);
	      zeroGain.connect(audioContext.destination);
	      resolve();
	    }, function (e) {
	      reject(e);
	    });
	  });
	}

	function emptyFn() {}

	var recording = false;

	exports.default = {
	  startRecord: function startRecord(o) {
	    var _this = this;

	    var fail = o.fail || emptyFn;
	    if (!window.AudioContext) {
	      fail(new Error('No audio API detected'));
	      return _promise2.default.reject();
	    }
	    return initAudio().then(function () {
	      _this.success = o.success;
	      _this.stopRecord().then(function () {
	        recording = true;
	        audioRecorder.clear();
	        audioRecorder.record();
	      });
	      setTimeout(function () {
	        _this.stopRecord();
	      }, 60000);
	    }, fail);
	  },
	  stopRecord: function stopRecord() {
	    var _this2 = this;

	    if (!recording) return _promise2.default.resolve(null);
	    recording = false;
	    audioRecorder.stop();
	    return new _promise2.default(function (resolve) {
	      audioRecorder.exportWAV(function (blob) {
	        var url = (window.URL || window.webkitURL).createObjectURL(blob);
	        if (_this2.success) _this2.success(url);
	        resolve(url);
	      });
	    });
	  }
	};

/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(148), __esModule: true };

/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(113);
	__webpack_require__(84);
	__webpack_require__(69);
	__webpack_require__(149);
	module.exports = __webpack_require__(3).Promise;

/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var LIBRARY            = __webpack_require__(75)
	  , global             = __webpack_require__(14)
	  , ctx                = __webpack_require__(15)
	  , classof            = __webpack_require__(88)
	  , $export            = __webpack_require__(13)
	  , isObject           = __webpack_require__(20)
	  , aFunction          = __webpack_require__(16)
	  , anInstance         = __webpack_require__(150)
	  , forOf              = __webpack_require__(151)
	  , speciesConstructor = __webpack_require__(154)
	  , task               = __webpack_require__(155).set
	  , microtask          = __webpack_require__(157)()
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
	      , FakePromise = (promise.constructor = {})[__webpack_require__(82)('species')] = function(exec){ exec(empty, empty); };
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
	  Internal.prototype = __webpack_require__(158)($Promise.prototype, {
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
	__webpack_require__(81)($Promise, PROMISE);
	__webpack_require__(159)(PROMISE);
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
	$export($export.S + $export.F * !(USE_NATIVE && __webpack_require__(160)(function(iter){
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
/* 150 */
/***/ (function(module, exports) {

	module.exports = function(it, Constructor, name, forbiddenField){
	  if(!(it instanceof Constructor) || (forbiddenField !== undefined && forbiddenField in it)){
	    throw TypeError(name + ': incorrect invocation!');
	  } return it;
	};

/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx         = __webpack_require__(15)
	  , call        = __webpack_require__(152)
	  , isArrayIter = __webpack_require__(153)
	  , anObject    = __webpack_require__(19)
	  , toLength    = __webpack_require__(36)
	  , getIterFn   = __webpack_require__(87)
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
/* 152 */
/***/ (function(module, exports, __webpack_require__) {

	// call something on iterator step with safe closing on error
	var anObject = __webpack_require__(19);
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
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

	// check on default Array iterator
	var Iterators  = __webpack_require__(73)
	  , ITERATOR   = __webpack_require__(82)('iterator')
	  , ArrayProto = Array.prototype;

	module.exports = function(it){
	  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
	};

/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

	// 7.3.20 SpeciesConstructor(O, defaultConstructor)
	var anObject  = __webpack_require__(19)
	  , aFunction = __webpack_require__(16)
	  , SPECIES   = __webpack_require__(82)('species');
	module.exports = function(O, D){
	  var C = anObject(O).constructor, S;
	  return C === undefined || (S = anObject(C)[SPECIES]) == undefined ? D : aFunction(S);
	};

/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

	var ctx                = __webpack_require__(15)
	  , invoke             = __webpack_require__(156)
	  , html               = __webpack_require__(80)
	  , cel                = __webpack_require__(24)
	  , global             = __webpack_require__(14)
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
	  if(__webpack_require__(33)(process) == 'process'){
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
/* 156 */
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
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

	var global    = __webpack_require__(14)
	  , macrotask = __webpack_require__(155).set
	  , Observer  = global.MutationObserver || global.WebKitMutationObserver
	  , process   = global.process
	  , Promise   = global.Promise
	  , isNode    = __webpack_require__(33)(process) == 'process';

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
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

	var hide = __webpack_require__(17);
	module.exports = function(target, src, safe){
	  for(var key in src){
	    if(safe && target[key])target[key] = src[key];
	    else hide(target, key, src[key]);
	  } return target;
	};

/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var global      = __webpack_require__(14)
	  , core        = __webpack_require__(3)
	  , dP          = __webpack_require__(18)
	  , DESCRIPTORS = __webpack_require__(22)
	  , SPECIES     = __webpack_require__(82)('species');

	module.exports = function(KEY){
	  var C = typeof core[KEY] == 'function' ? core[KEY] : global[KEY];
	  if(DESCRIPTORS && C && !C[SPECIES])dP.f(C, SPECIES, {
	    configurable: true,
	    get: function(){ return this; }
	  });
	};

/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

	var ITERATOR     = __webpack_require__(82)('iterator')
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
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	    value: true
	});
	exports.Recorder = undefined;

	var _assign = __webpack_require__(10);

	var _assign2 = _interopRequireDefault(_assign);

	var _classCallCheck2 = __webpack_require__(92);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(93);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _inlineWorker = __webpack_require__(162);

	var _inlineWorker2 = _interopRequireDefault(_inlineWorker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Recorder = exports.Recorder = function () {
	    function Recorder(source, cfg) {
	        var _this = this;

	        (0, _classCallCheck3.default)(this, Recorder);
	        this.config = {
	            bufferLen: 4096,
	            numChannels: 2,
	            mimeType: 'audio/wav'
	        };
	        this.recording = false;
	        this.callbacks = {
	            getBuffer: [],
	            exportWAV: []
	        };

	        (0, _assign2.default)(this.config, cfg);
	        this.context = source.context;
	        this.node = (this.context.createScriptProcessor || this.context.createJavaScriptNode).call(this.context, this.config.bufferLen, this.config.numChannels, this.config.numChannels);

	        this.node.onaudioprocess = function (e) {
	            if (!_this.recording) return;

	            var buffer = [];
	            for (var channel = 0; channel < _this.config.numChannels; channel++) {
	                buffer.push(e.inputBuffer.getChannelData(channel));
	            }
	            _this.worker.postMessage({
	                command: 'record',
	                buffer: buffer
	            });
	        };

	        source.connect(this.node);
	        this.node.connect(this.context.destination); //this should not be necessary

	        var self = {};
	        this.worker = new _inlineWorker2.default(function () {
	            var recLength = 0,
	                recBuffers = [],
	                sampleRate = void 0,
	                numChannels = void 0;

	            this.onmessage = function (e) {
	                switch (e.data.command) {
	                    case 'init':
	                        init(e.data.config);
	                        break;
	                    case 'record':
	                        record(e.data.buffer);
	                        break;
	                    case 'exportWAV':
	                        exportWAV(e.data.type);
	                        break;
	                    case 'getBuffer':
	                        getBuffer();
	                        break;
	                    case 'clear':
	                        clear();
	                        break;
	                }
	            };

	            function init(config) {
	                sampleRate = config.sampleRate;
	                numChannels = config.numChannels;
	                initBuffers();
	            }

	            function record(inputBuffer) {
	                for (var channel = 0; channel < numChannels; channel++) {
	                    recBuffers[channel].push(inputBuffer[channel]);
	                }
	                recLength += inputBuffer[0].length;
	            }

	            function exportWAV(type) {
	                var buffers = [];
	                for (var channel = 0; channel < numChannels; channel++) {
	                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
	                }
	                var interleaved = void 0;
	                if (numChannels === 2) {
	                    interleaved = interleave(buffers[0], buffers[1]);
	                } else {
	                    interleaved = buffers[0];
	                }
	                var dataview = encodeWAV(interleaved);
	                var audioBlob = new Blob([dataview], { type: type });

	                this.postMessage({ command: 'exportWAV', data: audioBlob });
	            }

	            function getBuffer() {
	                var buffers = [];
	                for (var channel = 0; channel < numChannels; channel++) {
	                    buffers.push(mergeBuffers(recBuffers[channel], recLength));
	                }
	                this.postMessage({ command: 'getBuffer', data: buffers });
	            }

	            function clear() {
	                recLength = 0;
	                recBuffers = [];
	                initBuffers();
	            }

	            function initBuffers() {
	                for (var channel = 0; channel < numChannels; channel++) {
	                    recBuffers[channel] = [];
	                }
	            }

	            function mergeBuffers(recBuffers, recLength) {
	                var result = new Float32Array(recLength);
	                var offset = 0;
	                for (var i = 0; i < recBuffers.length; i++) {
	                    result.set(recBuffers[i], offset);
	                    offset += recBuffers[i].length;
	                }
	                return result;
	            }

	            function interleave(inputL, inputR) {
	                var length = inputL.length + inputR.length;
	                var result = new Float32Array(length);

	                var index = 0,
	                    inputIndex = 0;

	                while (index < length) {
	                    result[index++] = inputL[inputIndex];
	                    result[index++] = inputR[inputIndex];
	                    inputIndex++;
	                }
	                return result;
	            }

	            function floatTo16BitPCM(output, offset, input) {
	                for (var i = 0; i < input.length; i++, offset += 2) {
	                    var s = Math.max(-1, Math.min(1, input[i]));
	                    output.setInt16(offset, s < 0 ? s * 0x8000 : s * 0x7FFF, true);
	                }
	            }

	            function writeString(view, offset, string) {
	                for (var i = 0; i < string.length; i++) {
	                    view.setUint8(offset + i, string.charCodeAt(i));
	                }
	            }

	            function encodeWAV(samples) {
	                var buffer = new ArrayBuffer(44 + samples.length * 2);
	                var view = new DataView(buffer);

	                /* RIFF identifier */
	                writeString(view, 0, 'RIFF');
	                /* RIFF chunk length */
	                view.setUint32(4, 36 + samples.length * 2, true);
	                /* RIFF type */
	                writeString(view, 8, 'WAVE');
	                /* format chunk identifier */
	                writeString(view, 12, 'fmt ');
	                /* format chunk length */
	                view.setUint32(16, 16, true);
	                /* sample format (raw) */
	                view.setUint16(20, 1, true);
	                /* channel count */
	                view.setUint16(22, numChannels, true);
	                /* sample rate */
	                view.setUint32(24, sampleRate, true);
	                /* byte rate (sample rate * block align) */
	                view.setUint32(28, sampleRate * 4, true);
	                /* block align (channel count * bytes per sample) */
	                view.setUint16(32, numChannels * 2, true);
	                /* bits per sample */
	                view.setUint16(34, 16, true);
	                /* data chunk identifier */
	                writeString(view, 36, 'data');
	                /* data chunk length */
	                view.setUint32(40, samples.length * 2, true);

	                floatTo16BitPCM(view, 44, samples);

	                return view;
	            }
	        }, self);

	        this.worker.postMessage({
	            command: 'init',
	            config: {
	                sampleRate: this.context.sampleRate,
	                numChannels: this.config.numChannels
	            }
	        });

	        this.worker.onmessage = function (e) {
	            var cb = _this.callbacks[e.data.command].pop();
	            if (typeof cb == 'function') {
	                cb(e.data.data);
	            }
	        };
	    }

	    (0, _createClass3.default)(Recorder, [{
	        key: 'record',
	        value: function record() {
	            this.recording = true;
	        }
	    }, {
	        key: 'stop',
	        value: function stop() {
	            this.recording = false;
	        }
	    }, {
	        key: 'clear',
	        value: function clear() {
	            this.worker.postMessage({ command: 'clear' });
	        }
	    }, {
	        key: 'getBuffer',
	        value: function getBuffer(cb) {
	            cb = cb || this.config.callback;
	            if (!cb) throw new Error('Callback not set');

	            this.callbacks.getBuffer.push(cb);

	            this.worker.postMessage({ command: 'getBuffer' });
	        }
	    }, {
	        key: 'exportWAV',
	        value: function exportWAV(cb, mimeType) {
	            mimeType = mimeType || this.config.mimeType;
	            cb = cb || this.config.callback;
	            if (!cb) throw new Error('Callback not set');

	            this.callbacks.exportWAV.push(cb);

	            this.worker.postMessage({
	                command: 'exportWAV',
	                type: mimeType
	            });
	        }
	    }], [{
	        key: 'forceDownload',
	        value: function forceDownload(blob, filename) {
	            var url = (window.URL || window.webkitURL).createObjectURL(blob);
	            var link = window.document.createElement('a');
	            link.href = url;
	            link.download = filename || 'output.wav';
	            var click = document.createEvent("Event");
	            click.initEvent("click", true, true);
	            link.dispatchEvent(click);
	        }
	    }]);
	    return Recorder;
	}();

	exports.default = Recorder;

/***/ }),
/* 162 */
/***/ (function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';

	var WORKER_ENABLED = !!(global === global.window && global.URL && global.Blob && global.Worker);

	function InlineWorker(func, self) {
	  var _this = this;
	  var functionBody;

	  self = self || {};

	  if (WORKER_ENABLED) {
	    functionBody = func.toString().trim().match(/^function\s*\w*\s*\([\w\s,]*\)\s*{([\w\W]*?)}$/)[1];

	    return new global.Worker(global.URL.createObjectURL(new global.Blob([functionBody], { type: 'text/javascript' })));
	  }

	  function postMessage(data) {
	    setTimeout(function () {
	      _this.onmessage({ data: data });
	    }, 0);
	  }

	  this.self = self;
	  this.self.postMessage = postMessage;

	  setTimeout(func.bind(self, self), 0);
	}

	InlineWorker.prototype.postMessage = function postMessage(data) {
	  var _this = this;

	  setTimeout(function () {
	    _this.self.onmessage({ data: data });
	  }, 0);
	};

	module.exports = InlineWorker;
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ }),
/* 163 */
/***/ (function(module, exports) {

	"use strict";

	(function (e) {
	  "use strict";

	  var t = function t(_t) {
	    return _t != null || _t != e;
	  },
	      n = function n(e, t) {
	    var n = i._callbacks[e];
	    for (var r = 0; r < n.length; r++) {
	      n[r].apply(window, t);
	    }
	  },
	      r = function r(e) {
	    var t = 0;
	    for (var n = e.length - 1; n > e.length - 6; n--) {
	      t += e[n];
	    }return t / 5;
	  },
	      i = module.exports = {
	    method: e,
	    watch: function watch(e) {
	      var t = ++i._lastId;
	      return i.init(function (n) {
	        if (n == "phonegap") i._watchers[t] = i._nav.compass.watchHeading(e);else if (n == "webkitOrientation") {
	          var r = function r(t) {
	            e(t.webkitCompassHeading);
	          };
	          i._win.addEventListener("deviceorientation", r), i._watchers[t] = r;
	        } else if (n == "orientationAndGPS") {
	          var s,
	              d = function d(t) {
	            s = -t.alpha + i._gpsDiff, s < 0 ? s += 360 : s > 360 && (s -= 360), e(s);
	          };
	          i._win.addEventListener("deviceorientation", d), i._watchers[t] = d;
	        }
	      }), t;
	    },
	    unwatch: function unwatch(e) {
	      return i.init(function (t) {
	        t == "phonegap" ? i._nav.compass.clearWatch(i._watchers[e]) : (t == "webkitOrientation" || t == "orientationAndGPS") && i._win.removeEventListener("deviceorientation", i._watchers[e]), delete i._watchers[e];
	      }), i;
	    },
	    needGPS: function needGPS(e) {
	      return i._callbacks.needGPS.push(e), i;
	    },
	    needMove: function needMove(e) {
	      return i._callbacks.needMove.push(e), i;
	    },
	    noSupport: function noSupport(e) {
	      return i.method === !1 ? e() : t(i.method) || i._callbacks.noSupport.push(e), i;
	    },
	    init: function init(e) {
	      if (t(i.method)) {
	        e(i.method);
	        return;
	      }
	      i._callbacks.init.push(e);
	      if (i._initing) return;
	      return i._initing = !0, i._nav.compass ? i._start("phonegap") : i._win.DeviceOrientationEvent ? (i._checking = 0, i._win.addEventListener("deviceorientation", i._checkEvent), setTimeout(function () {
	        i._checking !== !1 && i._start(!1);
	      }, 500)) : i._start(!1), i;
	    },
	    _lastId: 0,
	    _watchers: {},
	    _win: window,
	    _nav: navigator,
	    _callbacks: {
	      init: [],
	      noSupport: [],
	      needGPS: [],
	      needMove: []
	    },
	    _initing: !1,
	    _gpsDiff: e,
	    _start: function _start(e) {
	      i.method = e, i._initing = !1, n("init", [e]), i._callbacks.init = [], e === !1 && n("noSupport", []), i._callbacks.noSupport = [];
	    },
	    _checking: !1,
	    _checkEvent: function _checkEvent(e) {
	      i._checking += 1;
	      var n = !1;
	      t(e.webkitCompassHeading) ? i._start("webkitOrientation") : t(e.alpha) && i._nav.geolocation ? i._gpsHack() : i._checking > 1 ? i._start(!1) : n = !0, n || (i._checking = !1, i._win.removeEventListener("deviceorientation", i._checkEvent));
	    },
	    _gpsHack: function _gpsHack() {
	      var e = !0,
	          s = [],
	          o = [];
	      n("needGPS");
	      var u = function u(e) {
	        s.push(e.alpha);
	      };
	      i._win.addEventListener("deviceorientation", u);
	      var a = function a(_a) {
	        var f = _a.coords;
	        if (!t(f.heading)) return;
	        e && (e = !1, n("needMove")), f.speed > 1 ? (o.push(f.heading), o.length >= 5 && s.length >= 5 && (i._win.removeEventListener("deviceorientation", u), i._nav.geolocation.clearWatch(l), i._gpsDiff = r(o) + r(s), i._start("orientationAndGPS"))) : o = [];
	      },
	          f = function f() {
	        i._win.removeEventListener("deviceorientation", u), i._start(!1);
	      },
	          l = i._nav.geolocation.watchPosition(a, f, {
	        enableHighAccuracy: !0
	      });
	    }
	  };
	})();

/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _getPrototypeOf = __webpack_require__(89);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(92);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(93);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(97);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(116);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _emitter = __webpack_require__(47);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _events = __webpack_require__(165);

	var _events2 = _interopRequireDefault(_events);

	var _scrollable = __webpack_require__(171);

	var _scrollable2 = _interopRequireDefault(_scrollable);

	var _picker = __webpack_require__(172);

	var _picker2 = _interopRequireDefault(_picker);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Picker = function (_Emitter) {
	  (0, _inherits3.default)(Picker, _Emitter);

	  function Picker(opts) {
	    (0, _classCallCheck3.default)(this, Picker);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (Picker.__proto__ || (0, _getPrototypeOf2.default)(Picker)).call(this));

	    _this.opts = opts;
	    _this.root = document.createElement('div');
	    document.body.appendChild(_this.root);
	    _this.events = (0, _events2.default)(_this.root, _this);
	    _this.events.bind('click .cancel', 'cancel');
	    _this.events.bind('click .confirm', 'confirm');
	    return _this;
	  }

	  (0, _createClass3.default)(Picker, [{
	    key: 'show',
	    value: function show() {
	      this.root.appendChild((0, _domify2.default)('<div class="wx-picker-mask"></div>'));
	      var items = this.opts.array.map(function (text) {
	        return { text: text, value: text };
	      });
	      var el = (0, _domify2.default)((0, _picker2.default)({ group: [items] }));
	      this.root.appendChild(el);
	      var container = this.root.querySelector('.wx-picker-content');
	      this.scrollable = new _scrollable2.default(container, this.opts.current);
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.events.unbind();
	      this.scrollable.unbind();
	      document.body.removeChild(this.root);
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel(e) {
	      e.preventDefault();
	      this.hide();
	      this.emit('cancel');
	    }
	  }, {
	    key: 'confirm',
	    value: function confirm(e) {
	      var index = this.scrollable.current();
	      e.preventDefault();
	      this.hide();
	      this.emit('select', index);
	    }
	  }]);
	  return Picker;
	}(_emitter2.default);

	exports.default = Picker;

/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

	
	/**
	 * Module dependencies.
	 */

	try {
	  var events = __webpack_require__(166);
	} catch(err) {
	  var events = __webpack_require__(166);
	}

	try {
	  var delegate = __webpack_require__(167);
	} catch(err) {
	  var delegate = __webpack_require__(167);
	}

	/**
	 * Expose `Events`.
	 */

	module.exports = Events;

	/**
	 * Initialize an `Events` with the given
	 * `el` object which events will be bound to,
	 * and the `obj` which will receive method calls.
	 *
	 * @param {Object} el
	 * @param {Object} obj
	 * @api public
	 */

	function Events(el, obj) {
	  if (!(this instanceof Events)) return new Events(el, obj);
	  if (!el) throw new Error('element required');
	  if (!obj) throw new Error('object required');
	  this.el = el;
	  this.obj = obj;
	  this._events = {};
	}

	/**
	 * Subscription helper.
	 */

	Events.prototype.sub = function(event, method, cb){
	  this._events[event] = this._events[event] || {};
	  this._events[event][method] = cb;
	};

	/**
	 * Bind to `event` with optional `method` name.
	 * When `method` is undefined it becomes `event`
	 * with the "on" prefix.
	 *
	 * Examples:
	 *
	 *  Direct event handling:
	 *
	 *    events.bind('click') // implies "onclick"
	 *    events.bind('click', 'remove')
	 *    events.bind('click', 'sort', 'asc')
	 *
	 *  Delegated event handling:
	 *
	 *    events.bind('click li > a')
	 *    events.bind('click li > a', 'remove')
	 *    events.bind('click a.sort-ascending', 'sort', 'asc')
	 *    events.bind('click a.sort-descending', 'sort', 'desc')
	 *
	 * @param {String} event
	 * @param {String|function} [method]
	 * @return {Function} callback
	 * @api public
	 */

	Events.prototype.bind = function(event, method){
	  var e = parse(event);
	  var el = this.el;
	  var obj = this.obj;
	  var name = e.name;
	  var method = method || 'on' + name;
	  var args = [].slice.call(arguments, 2);

	  // callback
	  function cb(){
	    var a = [].slice.call(arguments).concat(args);
	    obj[method].apply(obj, a);
	  }

	  // bind
	  if (e.selector) {
	    cb = delegate.bind(el, e.selector, name, cb);
	  } else {
	    events.bind(el, name, cb);
	  }

	  // subscription for unbinding
	  this.sub(name, method, cb);

	  return cb;
	};

	/**
	 * Unbind a single binding, all bindings for `event`,
	 * or all bindings within the manager.
	 *
	 * Examples:
	 *
	 *  Unbind direct handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * Unbind delegate handlers:
	 *
	 *     events.unbind('click', 'remove')
	 *     events.unbind('click')
	 *     events.unbind()
	 *
	 * @param {String|Function} [event]
	 * @param {String|Function} [method]
	 * @api public
	 */

	Events.prototype.unbind = function(event, method){
	  if (0 == arguments.length) return this.unbindAll();
	  if (1 == arguments.length) return this.unbindAllOf(event);

	  // no bindings for this event
	  var bindings = this._events[event];
	  if (!bindings) return;

	  // no bindings for this method
	  var cb = bindings[method];
	  if (!cb) return;

	  events.unbind(this.el, event, cb);
	};

	/**
	 * Unbind all events.
	 *
	 * @api private
	 */

	Events.prototype.unbindAll = function(){
	  for (var event in this._events) {
	    this.unbindAllOf(event);
	  }
	};

	/**
	 * Unbind all events for `event`.
	 *
	 * @param {String} event
	 * @api private
	 */

	Events.prototype.unbindAllOf = function(event){
	  var bindings = this._events[event];
	  if (!bindings) return;

	  for (var method in bindings) {
	    this.unbind(event, method);
	  }
	};

	/**
	 * Parse `event`.
	 *
	 * @param {String} event
	 * @return {Object}
	 * @api private
	 */

	function parse(event) {
	  var parts = event.split(/ +/);
	  return {
	    name: parts.shift(),
	    selector: parts.join(' ')
	  }
	}


/***/ }),
/* 166 */
/***/ (function(module, exports) {

	var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
	    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
	    prefix = bind !== 'addEventListener' ? 'on' : '';

	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, type, fn, capture){
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};

	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};

/***/ }),
/* 167 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	try {
	  var closest = __webpack_require__(168);
	} catch(err) {
	  var closest = __webpack_require__(168);
	}

	try {
	  var event = __webpack_require__(132);
	} catch(err) {
	  var event = __webpack_require__(132);
	}

	/**
	 * Delegate event `type` to `selector`
	 * and invoke `fn(e)`. A callback function
	 * is returned which may be passed to `.unbind()`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, selector, type, fn, capture){
	  return event.bind(el, type, function(e){
	    var target = e.target || e.srcElement;
	    e.delegateTarget = closest(target, selector, true, el);
	    if (e.delegateTarget) fn.call(el, e);
	  }, capture);
	};

	/**
	 * Unbind event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  event.unbind(el, type, fn, capture);
	};


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module Dependencies
	 */

	try {
	  var matches = __webpack_require__(169)
	} catch (err) {
	  var matches = __webpack_require__(169)
	}

	/**
	 * Export `closest`
	 */

	module.exports = closest

	/**
	 * Closest
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @param {Element} scope (optional)
	 */

	function closest (el, selector, scope) {
	  scope = scope || document.documentElement;

	  // walk up the dom
	  while (el && el !== scope) {
	    if (matches(el, selector)) return el;
	    el = el.parentNode;
	  }

	  // check scope for match
	  return matches(el, selector) ? el : null;
	}


/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	try {
	  var query = __webpack_require__(170);
	} catch (err) {
	  var query = __webpack_require__(170);
	}

	/**
	 * Element prototype.
	 */

	var proto = Element.prototype;

	/**
	 * Vendor function.
	 */

	var vendor = proto.matches
	  || proto.webkitMatchesSelector
	  || proto.mozMatchesSelector
	  || proto.msMatchesSelector
	  || proto.oMatchesSelector;

	/**
	 * Expose `match()`.
	 */

	module.exports = match;

	/**
	 * Match `el` to `selector`.
	 *
	 * @param {Element} el
	 * @param {String} selector
	 * @return {Boolean}
	 * @api public
	 */

	function match(el, selector) {
	  if (!el || el.nodeType !== 1) return false;
	  if (vendor) return vendor.call(el, selector);
	  var nodes = query.all(selector, el.parentNode);
	  for (var i = 0; i < nodes.length; ++i) {
	    if (nodes[i] == el) return true;
	  }
	  return false;
	}


/***/ }),
/* 170 */
/***/ (function(module, exports) {

	function one(selector, el) {
	  return el.querySelector(selector);
	}

	exports = module.exports = function(selector, el){
	  el = el || document;
	  return one(selector, el);
	};

	exports.all = function(selector, el){
	  el = el || document;
	  return el.querySelectorAll(selector);
	};

	exports.engine = function(obj){
	  if (!obj.one) throw new Error('.one callback required');
	  if (!obj.all) throw new Error('.all callback required');
	  one = obj.one;
	  exports.all = obj.all;
	  return exports;
	};


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(147);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(89);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(92);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(93);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(97);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(116);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _emitter = __webpack_require__(47);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _tween = __webpack_require__(127);

	var _tween2 = _interopRequireDefault(_tween);

	var _raf = __webpack_require__(131);

	var _raf2 = _interopRequireDefault(_raf);

	var _events = __webpack_require__(165);

	var _events2 = _interopRequireDefault(_events);

	var _propDetect = __webpack_require__(55);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var Scrollable = function (_Emitter) {
	  (0, _inherits3.default)(Scrollable, _Emitter);

	  function Scrollable(root, curr) {
	    (0, _classCallCheck3.default)(this, Scrollable);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (Scrollable.__proto__ || (0, _getPrototypeOf2.default)(Scrollable)).call(this));

	    if (root.firstElementChild) {
	      _this.el = root;
	      _this.touchAction('none');
	      _this.itemHeight = root.firstElementChild.clientHeight;
	      _this.events = (0, _events2.default)(root.parentNode.querySelector('.wx-picker-mask2'), _this);
	      _this.events.bind('touchstart');
	      _this.events.bind('touchmove');
	      _this.events.bind('touchend');
	      _this.docEvents = (0, _events2.default)(document, _this);
	      _this.docEvents.bind('touchend');
	      _this.maxY = _this.itemHeight * 3;
	      _this.minY = (4 - root.children.length) * _this.itemHeight;
	      var n = 3 - (curr || 0);
	      _this.translate(n * _this.itemHeight);
	    }
	    return _this;
	  }

	  (0, _createClass3.default)(Scrollable, [{
	    key: 'current',
	    value: function current() {
	      return 3 - Math.floor(this.y / this.itemHeight);
	    }
	  }, {
	    key: 'currentValue',
	    value: function currentValue() {
	      var n = this.current();
	      var el = this.el.children[n];
	      return el.getAttribute('data-value');
	    }
	  }, {
	    key: 'unbind',
	    value: function unbind() {
	      if (!this.el) return;
	      this.events.unbind();
	      this.docEvents.unbind();
	    }
	  }, {
	    key: 'ontouchstart',
	    value: function ontouchstart(e) {
	      if (this.tween) this.tween.stop();
	      e.preventDefault();
	      var touch = this.getTouch(e);
	      this.down = {
	        sy: this.y,
	        x: touch.clientX,
	        y: touch.clientY,
	        at: Date.now()
	      };
	    }
	  }, {
	    key: 'ontouchmove',
	    value: function ontouchmove(e) {
	      if (!this.down || this.tween) return;
	      e.preventDefault();
	      var touch = this.getTouch(e);
	      var y = touch.clientY;
	      var down = this.down;
	      var dy = y - down.y;
	      var dest = down.sy + dy;
	      this.translate(dest);
	    }
	  }, {
	    key: 'ontouchend',
	    value: function ontouchend(e) {
	      if (!this.down) return;
	      this.down = null;
	      e.preventDefault();
	      var n = Math.round(this.y / this.itemHeight);
	      this.select(n);
	    }
	  }, {
	    key: 'select',
	    value: function select(index) {
	      var y = index * this.itemHeight;
	      this.scrollTo(y, 200, 'inQuad');
	    }
	    /**
	    * Scroll to potions y with optional duration and ease function
	    *
	    * @param {Number} y
	    * @param {Number} duration
	    * @param {String} easing
	    * @api public
	    */

	  }, {
	    key: 'scrollTo',
	    value: function scrollTo(y, duration, easing) {
	      var _this2 = this;

	      if (this.tween) this.tween.stop();
	      var transition = duration > 0 && y !== this.y;
	      if (!transition) {
	        this.direction = 0;
	        this.translate(y);
	        return;
	      }

	      this.direction = y > this.y ? -1 : 1;

	      easing = easing || 'out-circ';
	      var tween = this.tween = (0, _tween2.default)({
	        y: this.y
	      }).ease(easing).to({
	        y: y
	      }).duration(duration);

	      var self = this;
	      tween.update(function (o) {
	        self.translate(o.y);
	      });
	      var promise = new _promise2.default(function (resolve) {
	        tween.on('end', function () {
	          _this2.emit('end');
	          resolve();
	          self.tween = null;
	          self.animating = false;
	          animate = function animate() {}; // eslint-disable-line
	        });
	      });

	      function animate() {
	        (0, _raf2.default)(animate);
	        tween.update();
	      }

	      animate();
	      this.animating = true;
	      return promise;
	    }
	  }, {
	    key: 'getTouch',
	    value: function getTouch(e) {
	      // "mouse" and "Pointer" events just use the event object itself
	      var touch = e;
	      if (e.changedTouches && e.changedTouches.length > 0) {
	        // W3C "touch" events use the `changedTouches` array
	        touch = e.changedTouches[0];
	      }
	      return touch;
	    }

	    /**
	     * Translate to `y`.
	     *
	     *
	     * @api private
	     */

	  }, {
	    key: 'translate',
	    value: function translate(y) {
	      var s = this.el.style;
	      if (isNaN(y)) return;
	      y = Math.min(y, this.maxY);
	      y = Math.max(y, this.minY);
	      this.y = y;
	      s[_propDetect.transform] = 'translate3d(0, ' + y + 'px, 0)';
	    }
	    /**
	    * Sets the "touchAction" CSS style property to `value`.
	    *
	    * @api private
	    */

	  }, {
	    key: 'touchAction',
	    value: function touchAction(value) {
	      var s = this.el.style;
	      if (_propDetect.touchAction) {
	        s[_propDetect.touchAction] = value;
	      }
	    }
	  }]);
	  return Scrollable;
	}(_emitter2.default);

	exports.default = Scrollable;

/***/ }),
/* 172 */
/***/ (function(module, exports) {

	module.exports = function anonymous(_, filters, escape
	/**/) {
	escape = escape || function escape(html){
	  html = html == null ? '': html;
	  return String(html)
	    .replace(/&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/'/g, '&#39;')
	    .replace(/"/g, '&quot;');
	};
	var _str="";
	_str += '<div class="wx-picker">\n';
	_str += '  <div class="wx-picker-hd">\n';
	_str += '    <a class="wx-picker-action cancel">取消</a>\n';
	_str += '    <a class="wx-picker-action confirm">确定</a>\n';
	_str += '  </div>\n';
	_str += '  <div class="wx-picker-bd">\n';
	_.group.forEach(function(items,i){
	_str += '    <div class="wx-picker-group">\n';
	_str += '      <div class="wx-picker-mask2" data-index="';
	_str+=escape(i);
	_str += '"></div>';
	_str +='\n'
	_str += '      <div class="wx-picker-indicator"></div>\n';
	_str += '      <div class="wx-picker-content">\n';
	items.forEach(function(item,j){
	_str += '        <div class="wx-picker-item" data-value="';
	_str+=escape(item.value);
	_str += '">';
	_str +='\n'
	_str += '          ';
	_str+=escape(item.text);
	_str +='\n'
	_str += '        </div>\n';
	})
	_str += '      </div>\n';
	_str += '    </div>\n';
	})
	_str += '  </div>\n';
	_str += '</div>\n';
	_str += '';
	return _str

	}

/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _from = __webpack_require__(174);

	var _from2 = _interopRequireDefault(_from);

	var _getPrototypeOf = __webpack_require__(89);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(92);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(93);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(97);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(116);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _emitter = __webpack_require__(47);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _events = __webpack_require__(165);

	var _events2 = _interopRequireDefault(_events);

	var _scrollable = __webpack_require__(171);

	var _scrollable2 = _interopRequireDefault(_scrollable);

	var _picker = __webpack_require__(172);

	var _picker2 = _interopRequireDefault(_picker);

	var _util = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var TimePicker = function (_Emitter) {
	  (0, _inherits3.default)(TimePicker, _Emitter);

	  function TimePicker(opts) {
	    (0, _classCallCheck3.default)(this, TimePicker);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (TimePicker.__proto__ || (0, _getPrototypeOf2.default)(TimePicker)).call(this));

	    _this.opts = opts;
	    _this.root = document.createElement('div');
	    document.body.appendChild(_this.root);
	    _this.events = (0, _events2.default)(_this.root, _this);
	    _this.events.bind('click .cancel', 'cancel');
	    _this.events.bind('click .confirm', 'confirm');
	    return _this;
	  }

	  (0, _createClass3.default)(TimePicker, [{
	    key: 'show',
	    value: function show() {
	      var _this2 = this;

	      this.root.appendChild((0, _domify2.default)('<div class="wx-picker-mask"></div>'));
	      var group = [];
	      group.push((0, _util.range)(23, 0).map(function (o) {
	        return { text: o, value: o };
	      }));
	      group.push((0, _util.range)(59, 0).map(function (o) {
	        return { text: o, value: o };
	      }));
	      var el = (0, _domify2.default)((0, _picker2.default)({ group: group }));
	      this.root.appendChild(el);

	      var ps = (0, _from2.default)(this.root.querySelectorAll('.wx-picker-content'));
	      var curr = this.getCurrent();
	      this.scrollables = ps.map(function (el, i) {
	        var s = new _scrollable2.default(el, curr[i]);
	        s.on('end', function () {
	          _this2.checkValue(s, s.currentValue());
	        });
	        return s;
	      });
	    }
	  }, {
	    key: 'checkValue',
	    value: function checkValue(s, value) {
	      // TODO validate value
	    }
	  }, {
	    key: 'getCurrent',
	    value: function getCurrent() {
	      var str = this.opts.current;
	      var parts = str.split(':');
	      return [Number(parts[0]), Number(parts[1])];
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.events.unbind();
	      this.scrollables.forEach(function (s) {
	        s.unbind();
	      });
	      document.body.removeChild(this.root);
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel(e) {
	      e.preventDefault();
	      this.hide();
	      this.emit('cancel');
	    }
	  }, {
	    key: 'confirm',
	    value: function confirm(e) {
	      e.preventDefault();
	      var vals = this.scrollables.map(function (s) {
	        return s.currentValue();
	      });
	      this.hide();
	      this.emit('select', vals.join(':'));
	    }
	  }]);
	  return TimePicker;
	}(_emitter2.default);

	exports.default = TimePicker;

/***/ }),
/* 174 */
/***/ (function(module, exports, __webpack_require__) {

	module.exports = { "default": __webpack_require__(175), __esModule: true };

/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

	__webpack_require__(84);
	__webpack_require__(176);
	module.exports = __webpack_require__(3).Array.from;

/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var ctx            = __webpack_require__(15)
	  , $export        = __webpack_require__(13)
	  , toObject       = __webpack_require__(45)
	  , call           = __webpack_require__(152)
	  , isArrayIter    = __webpack_require__(153)
	  , toLength       = __webpack_require__(36)
	  , createProperty = __webpack_require__(177)
	  , getIterFn      = __webpack_require__(87);

	$export($export.S + $export.F * !__webpack_require__(160)(function(iter){ Array.from(iter); }), 'Array', {
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
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';
	var $defineProperty = __webpack_require__(18)
	  , createDesc      = __webpack_require__(26);

	module.exports = function(object, index, value){
	  if(index in object)$defineProperty.f(object, index, createDesc(0, value));
	  else object[index] = value;
	};

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _from = __webpack_require__(174);

	var _from2 = _interopRequireDefault(_from);

	var _getPrototypeOf = __webpack_require__(89);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(92);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(93);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(97);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(116);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _emitter = __webpack_require__(47);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _events = __webpack_require__(165);

	var _events2 = _interopRequireDefault(_events);

	var _scrollable = __webpack_require__(171);

	var _scrollable2 = _interopRequireDefault(_scrollable);

	var _picker = __webpack_require__(172);

	var _picker2 = _interopRequireDefault(_picker);

	var _util = __webpack_require__(5);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var DatePicker = function (_Emitter) {
	  (0, _inherits3.default)(DatePicker, _Emitter);

	  function DatePicker(opts) {
	    (0, _classCallCheck3.default)(this, DatePicker);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (DatePicker.__proto__ || (0, _getPrototypeOf2.default)(DatePicker)).call(this));

	    _this.opts = opts;
	    _this.root = document.createElement('div');
	    document.body.appendChild(_this.root);
	    _this.events = (0, _events2.default)(_this.root, _this);
	    _this.events.bind('click .cancel', 'cancel');
	    _this.events.bind('click .confirm', 'confirm');
	    var r = opts.range;
	    _this.sy = Number(r.start.split('-')[0]);
	    _this.ey = Number(r.end.split('-')[0]);
	    return _this;
	  }

	  (0, _createClass3.default)(DatePicker, [{
	    key: 'show',
	    value: function show() {
	      var _this2 = this;

	      this.root.appendChild((0, _domify2.default)('<div class="wx-picker-mask"></div>'));
	      var group = [];
	      group.push((0, _util.range)(this.ey, this.sy).map(function (o) {
	        return { text: o + '\u5E74', value: o };
	      }));
	      group.push((0, _util.range)(12, 1).map(function (o) {
	        return { text: o + '\u6708', value: o };
	      }));
	      group.push((0, _util.range)(31, 1).map(function (o) {
	        return { text: o + '\u65E5', value: o };
	      }));
	      console.log(group);
	      var el = (0, _domify2.default)((0, _picker2.default)({ group: group }));
	      this.root.appendChild(el);

	      var ps = (0, _from2.default)(this.root.querySelectorAll('.wx-picker-content'));
	      var curr = this.getCurrent();
	      this.scrollables = ps.map(function (el, i) {
	        var s = new _scrollable2.default(el, curr[i]);
	        s.on('end', function () {
	          _this2.checkValue(s, s.currentValue());
	        });
	        return s;
	      });
	    }
	  }, {
	    key: 'checkValue',
	    value: function checkValue(s, value) {
	      // TODO validate value
	    }
	  }, {
	    key: 'getCurrent',
	    value: function getCurrent() {
	      var str = this.opts.current;
	      var parts = str.split('-');
	      return [Number(parts[0]) - this.sy, Number(parts[1]) - 1, Number(parts[2]) - 1];
	    }
	  }, {
	    key: 'hide',
	    value: function hide() {
	      this.events.unbind();
	      this.scrollables.forEach(function (s) {
	        s.unbind();
	      });
	      document.body.removeChild(this.root);
	    }
	  }, {
	    key: 'cancel',
	    value: function cancel(e) {
	      e.preventDefault();
	      this.hide();
	      this.emit('cancel');
	    }
	  }, {
	    key: 'confirm',
	    value: function confirm(e) {
	      e.preventDefault();
	      var vals = this.scrollables.map(function (s) {
	        return s.currentValue();
	      });
	      this.hide();
	      this.emit('select', vals.join('-'));
	    }
	  }]);
	  return DatePicker;
	}(_emitter2.default);

	exports.default = DatePicker;

/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getFileList = getFileList;
	exports.getFileInfo = getFileInfo;
	exports.removeFile = removeFile;

	var _api = __webpack_require__(180);

	var _api2 = _interopRequireDefault(_api);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function getFileList() {
	  return (0, _api2.default)({
	    url: '/fileList'
	  });
	}

	function getFileInfo(filePath) {
	  return (0, _api2.default)({
	    url: '/fileInfo',
	    query: { filePath: filePath }
	  });
	}

	function removeFile(filePath) {
	  return (0, _api2.default)({
	    method: 'post',
	    url: '/removeFile',
	    query: { filePath: filePath }
	  });
	}

/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(147);

	var _promise2 = _interopRequireDefault(_promise);

	exports.default = api;

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	// send XMR request to server
	var request = __webpack_require__(181);

	function api(_ref) {
	  var _ref$method = _ref.method,
	      method = _ref$method === undefined ? 'get' : _ref$method,
	      _ref$headers = _ref.headers,
	      headers = _ref$headers === undefined ? {} : _ref$headers,
	      url = _ref.url,
	      _ref$data = _ref.data,
	      data = _ref$data === undefined ? null : _ref$data,
	      _ref$query = _ref.query,
	      query = _ref$query === undefined ? {} : _ref$query;

	  return new _promise2.default(function (resolve, reject) {
	    var req = request(method, url);
	    req.accept('json').type('json');
	    req.query(query);
	    if (data) req.send(data);

	    for (var key in headers) {
	      req.set(key, headers[key]);
	    }
	    req.end(function (res) {
	      if (res.ok) return resolve(res.body);
	      reject(new Error(res.text));
	    });
	  });
	}

/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

	/**
	 * Module dependencies.
	 */

	var Emitter = __webpack_require__(47);
	var reduce = __webpack_require__(182);

	/**
	 * Root reference for iframes.
	 */

	var root = 'undefined' == typeof window
	  ? this
	  : window;

	/**
	 * Noop.
	 */

	function noop(){};

	/**
	 * Check if `obj` is a host object,
	 * we don't want to serialize these :)
	 *
	 * TODO: future proof, move to compoent land
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isHost(obj) {
	  var str = {}.toString.call(obj);

	  switch (str) {
	    case '[object File]':
	    case '[object Blob]':
	    case '[object FormData]':
	      return true;
	    default:
	      return false;
	  }
	}

	/**
	 * Determine XHR.
	 */

	function getXHR() {
	  if (root.XMLHttpRequest
	    && ('file:' != root.location.protocol || !root.ActiveXObject)) {
	    return new XMLHttpRequest;
	  } else {
	    try { return new ActiveXObject('Microsoft.XMLHTTP'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.6.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP.3.0'); } catch(e) {}
	    try { return new ActiveXObject('Msxml2.XMLHTTP'); } catch(e) {}
	  }
	  return false;
	}

	/**
	 * Removes leading and trailing whitespace, added to support IE.
	 *
	 * @param {String} s
	 * @return {String}
	 * @api private
	 */

	var trim = ''.trim
	  ? function(s) { return s.trim(); }
	  : function(s) { return s.replace(/(^\s*|\s*$)/g, ''); };

	/**
	 * Check if `obj` is an object.
	 *
	 * @param {Object} obj
	 * @return {Boolean}
	 * @api private
	 */

	function isObject(obj) {
	  return obj === Object(obj);
	}

	/**
	 * Serialize the given `obj`.
	 *
	 * @param {Object} obj
	 * @return {String}
	 * @api private
	 */

	function serialize(obj) {
	  if (!isObject(obj)) return obj;
	  var pairs = [];
	  for (var key in obj) {
	    if (null != obj[key]) {
	      pairs.push(encodeURIComponent(key)
	        + '=' + encodeURIComponent(obj[key]));
	    }
	  }
	  return pairs.join('&');
	}

	/**
	 * Expose serialization method.
	 */

	 request.serializeObject = serialize;

	 /**
	  * Parse the given x-www-form-urlencoded `str`.
	  *
	  * @param {String} str
	  * @return {Object}
	  * @api private
	  */

	function parseString(str) {
	  var obj = {};
	  var pairs = str.split('&');
	  var parts;
	  var pair;

	  for (var i = 0, len = pairs.length; i < len; ++i) {
	    pair = pairs[i];
	    parts = pair.split('=');
	    obj[decodeURIComponent(parts[0])] = decodeURIComponent(parts[1]);
	  }

	  return obj;
	}

	/**
	 * Expose parser.
	 */

	request.parseString = parseString;

	/**
	 * Default MIME type map.
	 *
	 *     superagent.types.xml = 'application/xml';
	 *
	 */

	request.types = {
	  html: 'text/html',
	  json: 'application/json',
	  xml: 'application/xml',
	  urlencoded: 'application/x-www-form-urlencoded',
	  'form': 'application/x-www-form-urlencoded',
	  'form-data': 'application/x-www-form-urlencoded'
	};

	/**
	 * Default serialization map.
	 *
	 *     superagent.serialize['application/xml'] = function(obj){
	 *       return 'generated xml here';
	 *     };
	 *
	 */

	 request.serialize = {
	   'application/x-www-form-urlencoded': serialize,
	   'application/json': JSON.stringify
	 };

	 /**
	  * Default parsers.
	  *
	  *     superagent.parse['application/xml'] = function(str){
	  *       return { object parsed from str };
	  *     };
	  *
	  */

	request.parse = {
	  'application/x-www-form-urlencoded': parseString,
	  'application/json': JSON.parse
	};

	/**
	 * Parse the given header `str` into
	 * an object containing the mapped fields.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function parseHeader(str) {
	  var lines = str.split(/\r?\n/);
	  var fields = {};
	  var index;
	  var line;
	  var field;
	  var val;

	  lines.pop(); // trailing CRLF

	  for (var i = 0, len = lines.length; i < len; ++i) {
	    line = lines[i];
	    index = line.indexOf(':');
	    field = line.slice(0, index).toLowerCase();
	    val = trim(line.slice(index + 1));
	    fields[field] = val;
	  }

	  return fields;
	}

	/**
	 * Return the mime type for the given `str`.
	 *
	 * @param {String} str
	 * @return {String}
	 * @api private
	 */

	function type(str){
	  return str.split(/ *; */).shift();
	};

	/**
	 * Return header field parameters.
	 *
	 * @param {String} str
	 * @return {Object}
	 * @api private
	 */

	function params(str){
	  return reduce(str.split(/ *; */), function(obj, str){
	    var parts = str.split(/ *= */)
	      , key = parts.shift()
	      , val = parts.shift();

	    if (key && val) obj[key] = val;
	    return obj;
	  }, {});
	};

	/**
	 * Initialize a new `Response` with the given `xhr`.
	 *
	 *  - set flags (.ok, .error, etc)
	 *  - parse header
	 *
	 * Examples:
	 *
	 *  Aliasing `superagent` as `request` is nice:
	 *
	 *      request = superagent;
	 *
	 *  We can use the promise-like API, or pass callbacks:
	 *
	 *      request.get('/').end(function(res){});
	 *      request.get('/', function(res){});
	 *
	 *  Sending data can be chained:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' })
	 *        .end(function(res){});
	 *
	 *  Or passed to `.send()`:
	 *
	 *      request
	 *        .post('/user')
	 *        .send({ name: 'tj' }, function(res){});
	 *
	 *  Or passed to `.post()`:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' })
	 *        .end(function(res){});
	 *
	 * Or further reduced to a single call for simple cases:
	 *
	 *      request
	 *        .post('/user', { name: 'tj' }, function(res){});
	 *
	 * @param {XMLHTTPRequest} xhr
	 * @param {Object} options
	 * @api private
	 */

	function Response(req, options) {
	  options = options || {};
	  this.req = req;
	  this.xhr = this.req.xhr;
	  this.text = this.xhr.responseText;
	  this.setStatusProperties(this.xhr.status);
	  this.header = this.headers = parseHeader(this.xhr.getAllResponseHeaders());
	  // getAllResponseHeaders sometimes falsely returns "" for CORS requests, but
	  // getResponseHeader still works. so we get content-type even if getting
	  // other headers fails.
	  this.header['content-type'] = this.xhr.getResponseHeader('content-type');
	  this.setHeaderProperties(this.header);
	  this.body = this.req.method != 'HEAD'
	    ? this.parseBody(this.text)
	    : null;
	}

	/**
	 * Get case-insensitive `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api public
	 */

	Response.prototype.get = function(field){
	  return this.header[field.toLowerCase()];
	};

	/**
	 * Set header related properties:
	 *
	 *   - `.type` the content type without params
	 *
	 * A response of "Content-Type: text/plain; charset=utf-8"
	 * will provide you with a `.type` of "text/plain".
	 *
	 * @param {Object} header
	 * @api private
	 */

	Response.prototype.setHeaderProperties = function(header){
	  // content-type
	  var ct = this.header['content-type'] || '';
	  this.type = type(ct);

	  // params
	  var obj = params(ct);
	  for (var key in obj) this[key] = obj[key];
	};

	/**
	 * Parse the given body `str`.
	 *
	 * Used for auto-parsing of bodies. Parsers
	 * are defined on the `superagent.parse` object.
	 *
	 * @param {String} str
	 * @return {Mixed}
	 * @api private
	 */

	Response.prototype.parseBody = function(str){
	  var parse = request.parse[this.type];
	  if (!str) return null
	  return parse
	    ? parse(str)
	    : null;
	};

	/**
	 * Set flags such as `.ok` based on `status`.
	 *
	 * For example a 2xx response will give you a `.ok` of __true__
	 * whereas 5xx will be __false__ and `.error` will be __true__. The
	 * `.clientError` and `.serverError` are also available to be more
	 * specific, and `.statusType` is the class of error ranging from 1..5
	 * sometimes useful for mapping respond colors etc.
	 *
	 * "sugar" properties are also defined for common cases. Currently providing:
	 *
	 *   - .noContent
	 *   - .badRequest
	 *   - .unauthorized
	 *   - .notAcceptable
	 *   - .notFound
	 *
	 * @param {Number} status
	 * @api private
	 */

	Response.prototype.setStatusProperties = function(status){
	  var type = status / 100 | 0;

	  // status / class
	  this.status = status;
	  this.statusType = type;

	  // basics
	  this.info = 1 == type;
	  this.ok = 2 == type;
	  this.clientError = 4 == type;
	  this.serverError = 5 == type;
	  this.error = (4 == type || 5 == type)
	    ? this.toError()
	    : false;

	  // sugar
	  this.accepted = 202 == status;
	  this.noContent = 204 == status || 1223 == status;
	  this.badRequest = 400 == status;
	  this.unauthorized = 401 == status;
	  this.notAcceptable = 406 == status;
	  this.notFound = 404 == status;
	  this.forbidden = 403 == status;
	};

	/**
	 * Return an `Error` representative of this response.
	 *
	 * @return {Error}
	 * @api public
	 */

	Response.prototype.toError = function(){
	  var req = this.req;
	  var method = req.method;
	  var url = req.url;

	  var msg = 'cannot ' + method + ' ' + url + ' (' + this.status + ')';
	  var err = new Error(msg);
	  err.status = this.status;
	  err.method = method;
	  err.url = url;

	  return err;
	};

	/**
	 * Expose `Response`.
	 */

	request.Response = Response;

	/**
	 * Initialize a new `Request` with the given `method` and `url`.
	 *
	 * @param {String} method
	 * @param {String} url
	 * @api public
	 */

	function Request(method, url) {
	  var self = this;
	  Emitter.call(this);
	  this._query = this._query || [];
	  this.method = method;
	  this.url = url;
	  this.header = {};
	  this._header = {};
	  this.set('X-Requested-With', 'XMLHttpRequest')
	  this.on('end', function(){
	    var res = new Response(self);
	    if ('HEAD' == method) res.text = null;
	    self.callback(null, res);
	  });
	}

	/**
	 * Mixin `Emitter`.
	 */

	Emitter(Request.prototype);

	/**
	 * Allow for extension
	 */

	Request.prototype.use = function(fn) {
	  fn(this);
	  return this;
	}

	/**
	 * Set timeout to `ms`.
	 *
	 * @param {Number} ms
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.timeout = function(ms){
	  this._timeout = ms;
	  return this;
	};

	/**
	 * Clear previous timeout.
	 *
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.clearTimeout = function(){
	  this._timeout = 0;
	  clearTimeout(this._timer);
	  return this;
	};

	/**
	 * Abort the request, and clear potential timeout.
	 *
	 * @return {Request}
	 * @api public
	 */

	Request.prototype.abort = function(){
	  if (this.aborted) return;
	  this.aborted = true;
	  this.xhr.abort();
	  this.clearTimeout();
	  this.emit('abort');
	  return this;
	};

	/**
	 * Set header `field` to `val`, or multiple fields with one object.
	 *
	 * Examples:
	 *
	 *      req.get('/')
	 *        .set('Accept', 'application/json')
	 *        .set('X-API-Key', 'foobar')
	 *        .end(callback);
	 *
	 *      req.get('/')
	 *        .set({ Accept: 'application/json', 'X-API-Key': 'foobar' })
	 *        .end(callback);
	 *
	 * @param {String|Object} field
	 * @param {String} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.set = function(field, val){
	  if (isObject(field)) {
	    for (var key in field) {
	      this.set(key, field[key]);
	    }
	    return this;
	  }
	  this._header[field.toLowerCase()] = val;
	  this.header[field] = val;
	  return this;
	};

	/**
	 * Get case-insensitive header `field` value.
	 *
	 * @param {String} field
	 * @return {String}
	 * @api private
	 */

	Request.prototype.getHeader = function(field){
	  return this._header[field.toLowerCase()];
	};

	/**
	 * Set Content-Type to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.xml = 'application/xml';
	 *
	 *      request.post('/')
	 *        .type('xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 *      request.post('/')
	 *        .type('application/xml')
	 *        .send(xmlstring)
	 *        .end(callback);
	 *
	 * @param {String} type
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.type = function(type){
	  this.set('Content-Type', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Accept to `type`, mapping values from `request.types`.
	 *
	 * Examples:
	 *
	 *      superagent.types.json = 'application/json';
	 *
	 *      request.get('/agent')
	 *        .accept('json')
	 *        .end(callback);
	 *
	 *      request.get('/agent')
	 *        .accept('application/json')
	 *        .end(callback);
	 *
	 * @param {String} accept
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.accept = function(type){
	  this.set('Accept', request.types[type] || type);
	  return this;
	};

	/**
	 * Set Authorization field value with `user` and `pass`.
	 *
	 * @param {String} user
	 * @param {String} pass
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.auth = function(user, pass){
	  var str = btoa(user + ':' + pass);
	  this.set('Authorization', 'Basic ' + str);
	  return this;
	};

	/**
	* Add query-string `val`.
	*
	* Examples:
	*
	*   request.get('/shoes')
	*     .query('size=10')
	*     .query({ color: 'blue' })
	*
	* @param {Object|String} val
	* @return {Request} for chaining
	* @api public
	*/

	Request.prototype.query = function(val){
	  if ('string' != typeof val) val = serialize(val);
	  if (val) this._query.push(val);
	  return this;
	};

	/**
	 * Write the field `name` and `val` for "multipart/form-data"
	 * request bodies.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .field('foo', 'bar')
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} name
	 * @param {String|Blob|File} val
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.field = function(name, val){
	  if (!this._formData) this._formData = new FormData();
	  this._formData.append(name, val);
	  return this;
	};

	/**
	 * Queue the given `file` as an attachment to the specified `field`,
	 * with optional `filename`.
	 *
	 * ``` js
	 * request.post('/upload')
	 *   .attach(new Blob(['<a id="a"><b id="b">hey!</b></a>'], { type: "text/html"}))
	 *   .end(callback);
	 * ```
	 *
	 * @param {String} field
	 * @param {Blob|File} file
	 * @param {String} filename
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.attach = function(field, file, filename){
	  if (!this._formData) this._formData = new FormData();
	  this._formData.append(field, file, filename);
	  return this;
	};

	/**
	 * Send `data`, defaulting the `.type()` to "json" when
	 * an object is given.
	 *
	 * Examples:
	 *
	 *       // querystring
	 *       request.get('/search')
	 *         .end(callback)
	 *
	 *       // multiple data "writes"
	 *       request.get('/search')
	 *         .send({ search: 'query' })
	 *         .send({ range: '1..5' })
	 *         .send({ order: 'desc' })
	 *         .end(callback)
	 *
	 *       // manual json
	 *       request.post('/user')
	 *         .type('json')
	 *         .send('{"name":"tj"})
	 *         .end(callback)
	 *
	 *       // auto json
	 *       request.post('/user')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // manual x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send('name=tj')
	 *         .end(callback)
	 *
	 *       // auto x-www-form-urlencoded
	 *       request.post('/user')
	 *         .type('form')
	 *         .send({ name: 'tj' })
	 *         .end(callback)
	 *
	 *       // defaults to x-www-form-urlencoded
	  *      request.post('/user')
	  *        .send('name=tobi')
	  *        .send('species=ferret')
	  *        .end(callback)
	 *
	 * @param {String|Object} data
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.send = function(data){
	  var obj = isObject(data);
	  var type = this.getHeader('Content-Type');

	  // merge
	  if (obj && isObject(this._data)) {
	    for (var key in data) {
	      this._data[key] = data[key];
	    }
	  } else if ('string' == typeof data) {
	    if (!type) this.type('form');
	    type = this.getHeader('Content-Type');
	    if ('application/x-www-form-urlencoded' == type) {
	      this._data = this._data
	        ? this._data + '&' + data
	        : data;
	    } else {
	      this._data = (this._data || '') + data;
	    }
	  } else {
	    this._data = data;
	  }

	  if (!obj) return this;
	  if (!type) this.type('json');
	  return this;
	};

	/**
	 * Invoke the callback with `err` and `res`
	 * and handle arity check.
	 *
	 * @param {Error} err
	 * @param {Response} res
	 * @api private
	 */

	Request.prototype.callback = function(err, res){
	  var fn = this._callback;
	  if (!err && res && res.status/100 > 3) {
	    if (res.body && res.body.message) {
	      err = new Error(res.body.message);
	    } else {
	      err = new Error('cannot GET /error (' + res.status + ')');
	    }
	  }
	  if (2 == fn.length || 0 === fn.length) return fn(err, res);
	  res = res || {}
	  res.error = err;
	  if (err) this.emit('error', err);
	  fn(res);
	};

	/**
	 * Invoke callback with x-domain error.
	 *
	 * @api private
	 */

	Request.prototype.crossDomainError = function(){
	  var err = new Error('Origin is not allowed by Access-Control-Allow-Origin');
	  err.crossDomain = true;
	  this.callback(err);
	};

	/**
	 * Invoke callback with timeout error.
	 *
	 * @api private
	 */

	Request.prototype.timeoutError = function(){
	  var timeout = this._timeout;
	  var err = new Error('timeout of ' + timeout + 'ms exceeded');
	  err.timeout = timeout;
	  this.callback(err);
	};

	/**
	 * Enable transmission of cookies with x-domain requests.
	 *
	 * Note that for this to work the origin must not be
	 * using "Access-Control-Allow-Origin" with a wildcard,
	 * and also must set "Access-Control-Allow-Credentials"
	 * to "true".
	 *
	 * @api public
	 */

	Request.prototype.withCredentials = function(){
	  this._withCredentials = true;
	  return this;
	};

	/**
	 * Initiate request, invoking callback `fn(res)`
	 * with an instanceof `Response`.
	 *
	 * @param {Function} fn
	 * @return {Request} for chaining
	 * @api public
	 */

	Request.prototype.end = function(fn){
	  var self = this;
	  var xhr = this.xhr = getXHR();
	  var query = this._query.join('&');
	  var timeout = this._timeout;
	  var data = this._formData || this._data;

	  // store callback
	  this._callback = fn || noop;

	  // state change
	  xhr.onreadystatechange = function(){
	    if (4 != xhr.readyState) return;
	    if (0 == xhr.status) {
	      if (self.aborted) return self.timeoutError();
	      return self.crossDomainError();
	    }
	    self.emit('end');
	  };

	  // progress
	  if (xhr.upload) {
	    xhr.upload.onprogress = function(e){
	      e.percent = e.loaded / e.total * 100;
	      self.emit('progress', e);
	    };
	  }

	  // timeout
	  if (timeout && !this._timer) {
	    this._timer = setTimeout(function(){
	      self.abort();
	    }, timeout);
	  }

	  // querystring
	  if (query) {
	    query = request.serializeObject(query);
	    this.url += ~this.url.indexOf('?')
	      ? '&' + query
	      : '?' + query;
	  }

	  // initiate request
	  xhr.open(this.method, this.url, true);

	  // CORS
	  if (this._withCredentials) xhr.withCredentials = true;

	  // body
	  if ('GET' != this.method && 'HEAD' != this.method && 'string' != typeof data && !isHost(data)) {
	    // serialize stuff
	    var serialize = request.serialize[this.getHeader('Content-Type')];
	    if (serialize) data = serialize(data);
	  }

	  // set header fields
	  for (var field in this.header) {
	    if (null == this.header[field]) continue;
	    xhr.setRequestHeader(field, this.header[field]);
	  }

	  // send stuff
	  this.emit('request', this);
	  xhr.send(data);
	  return this;
	};

	/**
	 * Expose `Request`.
	 */

	request.Request = Request;

	/**
	 * Issue a request:
	 *
	 * Examples:
	 *
	 *    request('GET', '/users').end(callback)
	 *    request('/users').end(callback)
	 *    request('/users', callback)
	 *
	 * @param {String} method
	 * @param {String|Function} url or callback
	 * @return {Request}
	 * @api public
	 */

	function request(method, url) {
	  // callback
	  if ('function' == typeof url) {
	    return new Request('GET', method).end(url);
	  }

	  // url first
	  if (1 == arguments.length) {
	    return new Request('GET', method);
	  }

	  return new Request(method, url);
	}

	/**
	 * GET `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.get = function(url, data, fn){
	  var req = request('GET', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.query(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * HEAD `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.head = function(url, data, fn){
	  var req = request('HEAD', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * DELETE `url` with optional callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.del = function(url, fn){
	  var req = request('DELETE', url);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PATCH `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.patch = function(url, data, fn){
	  var req = request('PATCH', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * POST `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed} data
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.post = function(url, data, fn){
	  var req = request('POST', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * PUT `url` with optional `data` and callback `fn(res)`.
	 *
	 * @param {String} url
	 * @param {Mixed|Function} data or fn
	 * @param {Function} fn
	 * @return {Request}
	 * @api public
	 */

	request.put = function(url, data, fn){
	  var req = request('PUT', url);
	  if ('function' == typeof data) fn = data, data = null;
	  if (data) req.send(data);
	  if (fn) req.end(fn);
	  return req;
	};

	/**
	 * Expose `request`.
	 */

	module.exports = request;


/***/ }),
/* 182 */
/***/ (function(module, exports) {

	
	/**
	 * Reduce `arr` with `fn`.
	 *
	 * @param {Array} arr
	 * @param {Function} fn
	 * @param {Mixed} initial
	 *
	 * TODO: combatible error handling?
	 */

	module.exports = function(arr, fn, initial){  
	  var idx = 0;
	  var len = arr.length;
	  var curr = arguments.length == 3
	    ? initial
	    : arr[idx++];

	  while (idx < len) {
	    curr = fn.call(null, curr, arr[idx], ++idx, arr);
	  }
	  
	  return curr;
	};

/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _etImprove = __webpack_require__(184);

	var _etImprove2 = _interopRequireDefault(_etImprove);

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _mask = __webpack_require__(185);

	var _mask2 = _interopRequireDefault(_mask);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var tmpl = '\n<div>\n  <div class="wx-toast-mask"></div>\n  <div class="wx-toast">\n    {{if _.icon}}\n      <i class="wx-toast-icon wx-icon-{{= _.icon}}" style="font-size: 55px; color: rgb(255, 255, 255);display: block;">\n    {{/}}\n    </i><p class="wx-toast-content">{{= _.title}}</p>\n  </div>\n</div>\n';
	var fn = _etImprove2.default.compile(tmpl);
	var hideMask = null;

	exports.default = {
	  show: function show(_ref) {
	    var _this = this;

	    var _ref$duration = _ref.duration,
	        duration = _ref$duration === undefined ? 1500 : _ref$duration,
	        icon = _ref.icon,
	        title = _ref.title,
	        mask = _ref.mask;

	    this.hide();
	    duration = Math.min(duration, 10000);
	    var el = (0, _domify2.default)(fn({
	      title: title,
	      icon: icon
	    }));
	    this.el = el;
	    document.body.appendChild(el);
	    if (mask) {
	      hideMask = (0, _mask2.default)();
	    }
	    this.timeout = setTimeout(function () {
	      if (el.parentNode) document.body.removeChild(el);
	      if (hideMask) hideMask();
	      _this.el = null;
	    }, duration);
	  },
	  hide: function hide() {
	    window.clearTimeout(this.timeout);
	    if (hideMask) hideMask();
	    if (this.el) {
	      this.el.parentNode.removeChild(this.el);
	      this.el = null;
	    }
	  }
	};

/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {/*eslint "quotes": 0*/
	var dev =  process == null ? false : process.env.NODE_ENV === 'development'

	/**
	 * Compile template to function with option
	 *
	 * @public
	 * @param {String} template
	 * @param {Object} opt
	 * @returns {Function}
	 */
	exports.compile = function (template, opt) {
	  opt = opt || {};
	  var debug = dev || opt.debug;
	  var str

	  if (debug) {
	    // Adds the fancy stack trace meta info
	    var input = template.replace(/['\n]/g, function (_) {
	      if (_ === "'") return "\\'"
	      return '\\n'
	    })
	    str = [
	      'var __stack = { linenr: 1, input: \'' + input + '\'};',
	        rethrow.toString(),
	      'try {',
	        parse(template, opt),
	      '} catch (err) {',
	      '  rethrow(err, __stack.input, __stack.linenr);',
	      '}'
	    ].join("\n");
	  } else {
	    str = parse(template, opt);
	  }

	  str = 'escape = escape || ' + escape.toString() + ';\n' + str;
	  var fn;
	  try {
	    fn = new Function('_, filters, escape', str);
	  } catch (err) {
	    if ('SyntaxError' == err.name) {
	      err.message += ' while compiling ejs';
	    }
	    throw err;
	  }

	  return fn;
	}

	var control = /^\s*\{\{[\w|\/][^}]*\}\}\s*$/

	function parse(str, opt) {
	  opt = opt || {};
	  var debug =  dev || opt.debug
	    , buf = '';

	  buf += 'var _str="";\n';

	  var linenr = 1;
	  var closes = [];
	  var line = ''
	  var js
	  var res

	  for (var i = 0; i <= str.length; i++) {
	    var ch = str[i]
	    if (ch === '\r') {
	      continue;
	    } else if (ch === '\\') {
	      line += '\\\\'
	    } else if(ch === '\n' || typeof ch === 'undefined') {
	      if (debug) buf += "__stack.linenr=" + linenr + ';'
	      if (control.test(line)) {
	        js = line.match(/\{\{(.*)\}\}/)[1]
	        res = parseKeyword(js, closes)
	        if (res instanceof Error) rethrow(res, str, linenr)
	        buf += res + "\n"
	      } else {
	        // no interpolation
	        if (!/\{\{/.test(line)) {
	          buf += "_str += '" + gsub(line, "'", "\\'") + (ch === '\n' ? '\\n' : '') + "';\n"
	        } else {
	          var text = ''
	          var expr
	          for (var j = 0; j < line.length; j++) {
	            if (line[j] === '{' && line[j + 1] === '{') {
	              if (text.length) buf += "_str += '" + gsub(text, "'", "\\'") + "';\n"
	              text = ''
	              var end = line.indexOf('}}', j);
	              js = line.substring(j + 2, end);
	              // parse = !
	              switch (js[0]) {
	                case '=':
	                  expr = js.replace(/^=\s*/, '')
	                  expr = parseFilters(expr)
	                  res = '_str+=escape(' + expr + ');'
	                  break
	                case '!':
	                  expr = js.replace(/^!\s*/, '')
	                  expr = parseFilters(expr)
	                  res = '_str+=' + expr + ';'
	                  break
	                default:
	                  res = parseKeyword(js, closes)
	              }
	              if (res instanceof Error) rethrow(res, str, linenr)
	              buf += res + "\n"
	              j = end + 1
	            } else {
	              text += line[j]
	            }
	          }
	          if (text.length) buf += "_str += '" + gsub(text, "'", "\\'") + "';\n"
	          if (ch === '\n') buf += "_str +='\\n'\n"
	        }
	      }
	      line = ''
	      linenr += 1
	    } else {
	      line += str[i]
	    }
	  }
	  if (closes.length) rethrow(new Error('tag not closed'), str, linenr)
	  buf += 'return _str\n'
	  return buf
	}

	/**
	 * Escape the given string of `html`.
	 *
	 * @param {String} html
	 * @return {String}
	 * @api private
	 */

	function escape(html){
	  html = html == null ? '': html;
	  return String(html)
	    .replace(/&/g, '&amp;')
	    .replace(/</g, '&lt;')
	    .replace(/>/g, '&gt;')
	    .replace(/'/g, '&#39;')
	    .replace(/"/g, '&quot;');
	}

	/**
	 * Re-throw the given `err` in context to the
	 * `str` of et, and `linenr`.
	 *
	 * @param {Error} err
	 * @param {String} str
	 * @param {String} filename
	 * @param {String} linenr
	 * @api private
	 */

	function rethrow(err, input, linenr){
	  // str from context
	  var lines = input.split('\n')
	    , start = Math.max(linenr - 3, 0)
	    , end = Math.min(lines.length, linenr + 3);

	  // Error context
	  var context = lines.slice(start, end).map(function(line, i){
	    var curr = i + start + 1;
	    return (curr == linenr ? ' >> ' : '    ')
	      + curr
	      + '| '
	      + line;
	  }).join('\n');

	  // Alter exception message
	  err.message = 'et compile error:'
	    + linenr + '\n'
	    + context + '\n\n'
	    + err.message;

	  throw err;
	}

	function gsub(str, pat, sub) {
	  return str.replace(new RegExp(pat, 'g'), sub)
	}

	function parseKeyword(js, closes) {
	  if (js === '\/') {
	    if (closes.length === 0) {
	      return new Error("no matched begin tag")
	    } else {
	      return closes.pop()
	    }
	  }
	  if (!/^each|if|elif|else(\s|$)/.test(js)) {
	    return new Error("expression {{" + js +"}} not recognized")
	  }
	  var prefix;
	  var expression = js.replace(/^\w+\s*/, '');
	  if (js.indexOf('each') === 0) {
	    var o = parseForExpression(expression)
	    if (!o.attr) return new Error("attribute not found for " + expression)
	    o.as = o.as || '__val'
	    var args = o.as + (o.index ? ',' + o.index : '')
	    prefix  = o.attr + '.forEach(function(' + args + '){';
	    closes.push('})')
	  } else if (js.indexOf('if') === 0) {
	    prefix  = 'if (' + expression + '){';
	    closes.push('}')
	  } else if (js.indexOf('elif') === 0) {
	    prefix  = '} else if (' + expression + '){';
	  } else if (js.indexOf('else') === 0) {
	    prefix  = '} else {';
	  }
	  return prefix
	}

	// posts as post, i
	function parseForExpression(str) {
	  var parts = str.split(/,\s*/)
	  var index = parts[1]
	  parts = parts[0].split(/\s+as\s+/)
	  return {
	    index: index,
	    attr: parts[0],
	    as: parts[1]
	  }
	}

	function parseFilters(js) {
	  if (!/\s\|\s/.test(js)) return js
	  var arr = js.split(/\s*\|\s*/)
	  var res = arr[0]

	  for (var i = 1; i < arr.length; i++) {
	    var f = arr[i].trim()
	    if (f) {
	      var parts = f.match(/^([\w$_]+)(.*)$/)
	      var args
	      if (parts[2]) {
	        args = parseArgs(parts[2].trim())
	        res = 'filters.' + parts[1] + '(' + res + ', ' + args.join(', ') + ')'
	      } else {
	        res = 'filters.' + f + '(' + res + ')'
	      }
	    }
	  }
	  return res
	}


	/**
	 * Parse arguments from string eg:
	 * 'a' false 3 => ['a', false, 3]
	 *
	 * @param {String} str
	 * @return {Array}
	 * @api public
	 */
	function parseArgs(str) {
	  var strings = []
	  var s = str.replace(/(['"]).+?\1/g, function (str) {
	    strings.push(str)
	    return '$'
	  })
	  var arr = s.split(/\s+/)
	  for (var i = 0, l = arr.length; i < l; i++) {
	    var v= arr[i]
	    if (v === '$') {
	      arr[i] = strings.shift()
	    }
	  }
	  return arr
	}

	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(142)))

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = Mask;

	var _objectAssign = __webpack_require__(186);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Mask() {
	  var el = document.createElement('div');
	  el.className = 'mask';
	  (0, _objectAssign2.default)(el.style, {
	    position: 'absolute',
	    left: 0,
	    top: 0,
	    right: 0,
	    bottom: 0,
	    zIndex: 999
	  });
	  document.body.appendChild(el);
	  return function () {
	    if (el.parentNode) document.body.removeChild(el);
	  };
	}

/***/ }),
/* 186 */
/***/ (function(module, exports) {

	/*
	object-assign
	(c) Sindre Sorhus
	@license MIT
	*/

	'use strict';
	/* eslint-disable no-unused-vars */
	var getOwnPropertySymbols = Object.getOwnPropertySymbols;
	var hasOwnProperty = Object.prototype.hasOwnProperty;
	var propIsEnumerable = Object.prototype.propertyIsEnumerable;

	function toObject(val) {
		if (val === null || val === undefined) {
			throw new TypeError('Object.assign cannot be called with null or undefined');
		}

		return Object(val);
	}

	function shouldUseNative() {
		try {
			if (!Object.assign) {
				return false;
			}

			// Detect buggy property enumeration order in older V8 versions.

			// https://bugs.chromium.org/p/v8/issues/detail?id=4118
			var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
			test1[5] = 'de';
			if (Object.getOwnPropertyNames(test1)[0] === '5') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test2 = {};
			for (var i = 0; i < 10; i++) {
				test2['_' + String.fromCharCode(i)] = i;
			}
			var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
				return test2[n];
			});
			if (order2.join('') !== '0123456789') {
				return false;
			}

			// https://bugs.chromium.org/p/v8/issues/detail?id=3056
			var test3 = {};
			'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
				test3[letter] = letter;
			});
			if (Object.keys(Object.assign({}, test3)).join('') !==
					'abcdefghijklmnopqrst') {
				return false;
			}

			return true;
		} catch (err) {
			// We don't expect any of the above to throw, but better to be safe.
			return false;
		}
	}

	module.exports = shouldUseNative() ? Object.assign : function (target, source) {
		var from;
		var to = toObject(target);
		var symbols;

		for (var s = 1; s < arguments.length; s++) {
			from = Object(arguments[s]);

			for (var key in from) {
				if (hasOwnProperty.call(from, key)) {
					to[key] = from[key];
				}
			}

			if (getOwnPropertySymbols) {
				symbols = getOwnPropertySymbols(from);
				for (var i = 0; i < symbols.length; i++) {
					if (propIsEnumerable.call(from, symbols[i])) {
						to[symbols[i]] = from[symbols[i]];
					}
				}
			}
		}

		return to;
	};


/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(147);

	var _promise2 = _interopRequireDefault(_promise);

	exports.default = function (src) {
	  var img = document.createElement('img');
	  img.src = src;
	  if (img.complete) return _promise2.default.resolve(imgDimension(img));
	  return new _promise2.default(function (resolve, reject) {
	    img.onload = function () {
	      resolve(imgDimension(img));
	    };
	    img.onerror = function (e) {
	      reject(e);
	    };
	  });
	};

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function imgDimension(image) {
	  if (image.naturalWidth) {
	    return {
	      height: image.naturalHeight,
	      width: image.naturalWidth
	    };
	  } else {
	    var i = new Image();
	    i.src = image.currentSrc || image.src;
	    return {
	      height: i.height,
	      width: i.width
	    };
	  }
	}

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(147);

	var _promise2 = _interopRequireDefault(_promise);

	exports.default = function (_ref) {
	  var _ref$title = _ref.title,
	      title = _ref$title === undefined ? '' : _ref$title,
	      _ref$content = _ref.content,
	      content = _ref$content === undefined ? '' : _ref$content,
	      imgUrl = _ref.imgUrl,
	      _ref$showCancel = _ref.showCancel,
	      showCancel = _ref$showCancel === undefined ? true : _ref$showCancel,
	      _ref$cancelText = _ref.cancelText,
	      cancelText = _ref$cancelText === undefined ? '取消' : _ref$cancelText,
	      _ref$cancelColor = _ref.cancelColor,
	      cancelColor = _ref$cancelColor === undefined ? '#000000' : _ref$cancelColor,
	      _ref$confirmText = _ref.confirmText,
	      confirmText = _ref$confirmText === undefined ? '确定' : _ref$confirmText,
	      _ref$confirmColor = _ref.confirmColor,
	      confirmColor = _ref$confirmColor === undefined ? '#3CC51F' : _ref$confirmColor;

	  var called = false;
	  var createModal = function createModal(imgUrl, title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor) {
	    el = (0, _domify2.default)(fn({
	      imgUrl: imgUrl,
	      title: title,
	      content: content,
	      showCancel: showCancel,
	      cancelText: cancelText,
	      cancelColor: cancelColor,
	      confirmText: confirmText,
	      confirmColor: confirmColor
	    }));
	    document.body.appendChild(el);
	    called = false;
	  };
	  if (el && el.parentNode) {
	    closeCallback = function closeCallback() {

	      createModal(imgUrl, title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor);
	    };
	    //el.parentNode.removeChild(el)
	  } else {

	    createModal(imgUrl, title, content, showCancel, cancelText, cancelColor, confirmText, confirmColor);
	  }
	  return new _promise2.default(function (resolve) {
	    el.addEventListener('click', function (e) {
	      if (called) return;else if (this != el) {
	        el.addEventListener('click', function (e) {
	          if (called) return;
	          if ((0, _classes2.default)(e.target).has('confirm-btn')) {
	            called = true;
	            resolve(true);
	          } else if ((0, _classes2.default)(e.target).has('cancel-btn')) {
	            called = true;
	            resolve(false);
	          }
	          if (called && el && el.parentNode) el.parentNode.removeChild(el);
	        });
	        return;
	      }
	      if ((0, _classes2.default)(e.target).has('confirm-btn')) {
	        called = true;
	        resolve(true);
	      } else if ((0, _classes2.default)(e.target).has('cancel-btn')) {
	        called = true;
	        resolve(false);
	      }
	      if (called && el && el.parentNode) el.parentNode.removeChild(el);
	      if (closeCallback) {
	        closeCallback();
	        closeCallback = null;
	      }
	    }, false);
	  });
	};

	var _etImprove = __webpack_require__(184);

	var _etImprove2 = _interopRequireDefault(_etImprove);

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _classes = __webpack_require__(52);

	var _classes2 = _interopRequireDefault(_classes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var tmpl = '\n<div class="wx-modal">\n  <div class="wx-modal-mask"></div>\n  <div class="wx-modal-dialog">\n    <div class="wx-modal-dialog-hd">\n      <strong>{{= _.title}}</strong>\n    </div>\n    <div class="wx-modal-dialog-bd">\n      {{if _.imgUrl}}\n        <img src="{{= _.imgurl}}" class="wx-modal-dialog-img"/>\n      {{/}}\n      {{= _.content}}\n    </div>\n    <div class="wx-modal-dialog-ft">\n    {{if _.showCancel}}\n        <a class="wx-modal-btn-default cancel-btn" style="color: {{=_.cancelColor}};">{{= _.cancelText}}</a>\n    {{/}}\n    <a class="wx-modal-btn-primary confirm-btn" style="color: {{= _.confirmColor}};">{{= _.confirmText}}</a></div>\n  </div>\n</div>\n';
	var fn = _etImprove2.default.compile(tmpl);

	var el = null;
	var closeCallback = null;

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(147);

	var _promise2 = _interopRequireDefault(_promise);

	exports.default = function (_ref) {
	  var itemList = _ref.itemList,
	      _ref$itemColor = _ref.itemColor,
	      itemColor = _ref$itemColor === undefined ? '#000000' : _ref$itemColor;

	  if (el && el.parentNode) el.parentNode.removeChild(el);

	  el = (0, _domify2.default)(fn({ itemList: itemList, itemColor: itemColor }));
	  setTimeout(function () {
	    //必须延迟一些，要不然会立即触发click
	    document.body.appendChild(el);
	  }, 100);
	  var called = false;
	  return new _promise2.default(function (resolve) {
	    el.addEventListener('click', function (e) {
	      if (called) return;
	      if ((0, _classes2.default)(e.target).has('wx-action-sheet-mask')) {
	        called = true;
	        resolve({ cancel: true });
	      } else if ((0, _classes2.default)(e.target).has('wx-action-sheet-item')) {
	        called = true;
	        resolve({ cancel: false, tapIndex: Number(e.target.getAttribute('data-index')) });
	      } else if ((0, _classes2.default)(e.target).has('wx-action-sheet-cancel')) {
	        called = true;
	        resolve({ cancel: true });
	      }
	      if (called && el && el.parentNode) el.parentNode.removeChild(el);
	    }, false);
	  });
	};

	var _etImprove = __webpack_require__(184);

	var _etImprove2 = _interopRequireDefault(_etImprove);

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _classes = __webpack_require__(52);

	var _classes2 = _interopRequireDefault(_classes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var tmpl = '\n<div>\n  <div class="wx-action-sheet-mask"></div>\n  <div class="wx-action-sheet wx-action-sheet-show">\n    <div class="wx-action-sheet-menu">\n      {{each _.itemList as item, index}}\n      <div class="wx-action-sheet-item" data-index="{{= index}}" style="color: {{= _.itemColor}};">{{= item}}</div>\n      {{/}}\n      <div class="wx-action-sheet-item-cancel">\n      <div class="wx-action-sheet-middle"></div>\n      <div class="wx-action-sheet-cancel" style="color: rgb(0, 0, 0);">\u53D6\u6D88</div>\n      </div>\n    </div>\n  </div>\n</div>\n';
	var fn = _etImprove2.default.compile(tmpl);

	var el = null;

/***/ }),
/* 190 */
/***/ (function(module, exports) {

	"use strict";

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.once = once;
	function once(el, name, listener) {
	  var fn = function fn(e) {
	    el.removeEventListener(name, fn, false);
	    listener.call(el, e);
	  };
	  el.addEventListener(name, fn, false);
	}

/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(147);

	var _promise2 = _interopRequireDefault(_promise);

	var _getPrototypeOf = __webpack_require__(89);

	var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

	var _classCallCheck2 = __webpack_require__(92);

	var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

	var _createClass2 = __webpack_require__(93);

	var _createClass3 = _interopRequireDefault(_createClass2);

	var _possibleConstructorReturn2 = __webpack_require__(97);

	var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

	var _inherits2 = __webpack_require__(116);

	var _inherits3 = _interopRequireDefault(_inherits2);

	var _radioComponent = __webpack_require__(192);

	var _radioComponent2 = _interopRequireDefault(_radioComponent);

	var _query = __webpack_require__(170);

	var _query2 = _interopRequireDefault(_query);

	var _event = __webpack_require__(132);

	var _event2 = _interopRequireDefault(_event);

	var _raf = __webpack_require__(131);

	var _raf2 = _interopRequireDefault(_raf);

	var _tween = __webpack_require__(127);

	var _tween2 = _interopRequireDefault(_tween);

	var _emitter = __webpack_require__(47);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _tapEvent = __webpack_require__(49);

	var _tapEvent2 = _interopRequireDefault(_tapEvent);

	var _pinchZoom = __webpack_require__(193);

	var _pinchZoom2 = _interopRequireDefault(_pinchZoom);

	var _objectAssign = __webpack_require__(186);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _closest = __webpack_require__(168);

	var _closest2 = _interopRequireDefault(_closest);

	var _events = __webpack_require__(165);

	var _events2 = _interopRequireDefault(_events);

	var _spin = __webpack_require__(198);

	var _spin2 = _interopRequireDefault(_spin);

	var _propDetect = __webpack_require__(55);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var doc = document;
	var body = doc.body;

	var ImagesPreview = function (_Emitter) {
	  (0, _inherits3.default)(ImagesPreview, _Emitter);

	  /**
	   * Constructor
	   *
	   * @public
	   * @param {Array|DomCollection} imgs
	   * @param {Object} opts
	   */
	  function ImagesPreview(imgs) {
	    var opts = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
	    (0, _classCallCheck3.default)(this, ImagesPreview);

	    var _this = (0, _possibleConstructorReturn3.default)(this, (ImagesPreview.__proto__ || (0, _getPrototypeOf2.default)(ImagesPreview)).call(this));

	    _this.opts = opts;
	    // maximun duration in ms for fast swipe
	    _this.threshold = opts.threshold || 200;
	    // minimum moved distance for fast swipe
	    _this.fastThreshold = opts.fastThreshold || 30;
	    _this.imgs = imgs;
	    _this._containerTap = (0, _tapEvent2.default)(_this.hide.bind(_this));
	    _this.status = [];
	    _this.loaded = [];
	    _this.tx = 0;
	    if (opts.bind !== false) _event2.default.bind(doc, 'touchstart', _this._ontap);
	    return _this;
	  }
	  /**
	   * Show container
	   *
	   * @public
	   */


	  (0, _createClass3.default)(ImagesPreview, [{
	    key: 'show',
	    value: function show() {
	      var div = this.container = doc.createElement('div');
	      div.id = 'images-preview';
	      var vw = viewportWidth();
	      div.style.width = vw * this.imgs.length + 40 + 'px';
	      this.setTransform(-20);
	      body.appendChild(div);
	      var dots = this.dots = (0, _domify2.default)('<div class="imgs-preview-dots"><ul></ul></div>');
	      body.appendChild(dots);
	      var ul = (0, _query2.default)('ul', dots);
	      var fragment = doc.createDocumentFragment();
	      for (var i = 0, l = this.imgs.length; i < l; i++) {
	        ul.appendChild(doc.createElement('li'));
	        var el = doc.createElement('div');
	        el.style.width = vw + 'px';
	        var wrapper = doc.createElement('div');
	        var src = this.imgs[i];
	        wrapper.className = 'wrapper';
	        var img = this.createImage(wrapper, src);
	        img.style.display = 'block';
	        this.positionWrapper(wrapper, img);
	        el.appendChild(wrapper);
	        fragment.appendChild(el);
	      }
	      div.appendChild(fragment);
	      this.zooms = [];
	      this.emit('hide');

	      this.events = (0, _events2.default)(div, this);
	      this.docEvents = (0, _events2.default)(document, this);
	      this.events.bind('touchstart');
	      this.events.bind('touchmove');
	      this.events.bind('touchend');
	      this.docEvents.bind('touchend', 'ontouchend');
	      _event2.default.bind(div, 'touchstart', this._containerTap);
	      _event2.default.bind(doc, 'touchmove', preventDefault);
	    }
	  }, {
	    key: 'ontouchstart',
	    value: function ontouchstart(e) {
	      var _this2 = this;

	      if (this.animating) this.tween.stop();
	      var wrapper = (0, _closest2.default)(e.target, '.wrapper');
	      if (e.touches.length > 1 || wrapper) return;
	      var t = e.touches[0];
	      var sx = t.clientX;
	      this.down = { x: sx, at: Date.now() };
	      var tx = this.tx;
	      var vw = viewportWidth();
	      this.move = function (e, touch) {
	        var x = tx + touch.clientX - sx;
	        x = _this2.limit(x, vw);
	        if (isNaN(x)) return;
	        _this2.setTransform(x);
	      };
	    }
	  }, {
	    key: 'ontouchmove',
	    value: function ontouchmove(e) {
	      if (e.touches.length > 1 || this.move == null) return;
	      e.preventDefault();
	      e.stopPropagation();
	      var touch = e.touches[0];
	      this.move(e, touch);
	    }
	  }, {
	    key: 'ontouchend',
	    value: function ontouchend(e) {
	      if (this.move == null) return;
	      if (this.animating) this.tween.stop();
	      var down = this.down;
	      this.move = this.down = null;
	      var touch = e.changedTouches[0];
	      var x = touch.clientX;
	      var t = Date.now();
	      if (Math.abs(x - down.x) > this.fastThreshold && t - down.at < this.threshold) {
	        var dir = down.x > x ? 'left' : 'right';
	        this.onswipe(dir);
	      } else {
	        this.restore();
	      }
	    }

	    /**
	     * Active a specfic image
	     *
	     * @public
	     * @param {String} src
	     * @param {Number} idx
	     */

	  }, {
	    key: 'active',
	    value: function active(src, idx) {
	      var _this3 = this;

	      idx = idx == null ? this.imgs.indexOf(src) : idx;
	      if (idx == -1) return;
	      var vw = viewportWidth();
	      var state = this.status[idx];
	      this.idx = idx;
	      var wrapper = this.container.querySelectorAll('.wrapper')[idx];
	      (0, _radioComponent2.default)(this.dots.querySelectorAll('li')[idx]);
	      this.emit('active', idx);
	      var tx = idx * vw;
	      this.setTransform(-tx - 20);
	      // not loaded
	      if (!state) {
	        this.status[idx] = 'loading';
	        var image = this.createImage(wrapper, src);
	        image.style.display = 'block';

	        var pz = this.pz = new _pinchZoom2.default(wrapper, {
	          threshold: this.threshold,
	          fastThreshold: this.fastThreshold,
	          padding: 5,
	          tapreset: false,
	          draggable: true,
	          maxScale: 4
	        });
	        pz.on('swipe', this.onswipe.bind(this));
	        pz.on('move', function (dx) {
	          var x = -20 - tx - dx;
	          x = _this3.limit(x, vw);
	          _this3.setTransform(x);
	        });
	        //pz.on('tap', this.hide.bind(this))
	        pz.on('end', this.restore.bind(this));
	        this.zooms.push(pz);
	        this.loadImage(image, wrapper).then(function () {
	          _this3.loaded.push(idx);
	        }, function () {});
	      }
	    }
	  }, {
	    key: 'onswipe',
	    value: function onswipe(dir) {
	      var _this4 = this;

	      var vw = viewportWidth();
	      var i = dir == 'left' ? this.idx + 1 : this.idx - 1;
	      i = Math.max(0, i);
	      i = Math.min(this.imgs.length - 1, i);
	      this.animate(-i * vw - 20).then(function () {
	        if (i == _this4.idx) return;
	        var src = _this4.imgs[i];
	        _this4.active(src, i);
	      });
	    }
	  }, {
	    key: 'limit',
	    value: function limit(x, vw) {
	      x = Math.min(0, x);
	      x = Math.max(-40 - (this.imgs.length - 1) * vw, x);
	      return x;
	    }
	    /**
	     * Restore container transform to sane position
	     *
	     * @private
	     */

	  }, {
	    key: 'restore',
	    value: function restore() {
	      var _this5 = this;

	      var vw = viewportWidth();
	      var idx = Math.round((-this.tx - 20) / vw);
	      this.animate(-idx * vw - 20).then(function () {
	        if (idx == _this5.idx) return;
	        var src = _this5.imgs[idx];
	        _this5.active(src, idx);
	      });
	    }
	    /**
	     * Load image inside wrapper
	     *
	     * @private
	     * @param {Element} image
	     * @param {Element} wrapper
	     */

	  }, {
	    key: 'loadImage',
	    value: function loadImage(image, wrapper) {
	      var _this6 = this;

	      if (image.complete) {
	        this.positionWrapper(wrapper, image);
	        return this.positionHolder(wrapper, image.src, false).then(function () {
	          image.style.display = 'block';
	        });
	      } else {
	        return this.positionHolder(wrapper).then(function () {
	          image.style.display = 'block';
	          var spinEl = (0, _domify2.default)('<div class="spin"></div>');
	          if (wrapper.clientHeight > _this6.container.clientHeight) {
	            spinEl.style.top = _this6.container.clientHeight / 2 + 'px';
	          }
	          wrapper.appendChild(spinEl);
	          var stop = (0, _spin2.default)(spinEl, {
	            color: '#ffffff',
	            duration: 1000,
	            width: 4
	          });
	          var self = _this6;
	          return new _promise2.default(function (resolve, reject) {
	            function onload() {
	              stop();
	              if (spinEl.parentNode) wrapper.removeChild(spinEl);
	              self.positionWrapper(wrapper, image);
	              resolve();
	            }
	            if (image.complete) return onload();
	            image.onload = onload;
	            image.onerror = function (e) {
	              stop();
	              reject(e);
	            };
	          });
	        });
	      }
	    }
	  }, {
	    key: 'positionWrapper',
	    value: function positionWrapper(wrapper, image) {
	      var vw = Math.max(doc.documentElement.clientWidth, window.innerWidth || 0);
	      var dims = imgDimension(image);
	      var h = (vw - 10) * dims.height / dims.width;
	      var top = Math.min(this.container.clientHeight - 10, h) / 2;

	      (0, _objectAssign2.default)(wrapper.style, {
	        left: '5px',
	        width: vw - 10 + 'px',
	        height: h + 'px',
	        marginTop: '-' + top + 'px'
	      });
	    }
	  }, {
	    key: 'createImage',
	    value: function createImage(wrapper, src) {
	      var img = (0, _query2.default)('.image', wrapper);
	      if (img) return img;
	      img = doc.createElement('img');
	      img.className = 'image';
	      img.src = src;
	      wrapper.appendChild(img);
	      return img;
	    }
	    /**
	     * Set translateX of container
	     *
	     * @private
	     * @param {Number} x
	     */

	  }, {
	    key: 'setTransform',
	    value: function setTransform(x) {
	      var el = this.container;
	      this.tx = x;
	      if (_propDetect.has3d) {
	        el.style[_propDetect.transform] = 'translate3d(' + x + 'px,0,0)';
	      } else {
	        el.style[_propDetect.transform] = 'translate(' + x + 'px)';
	      }
	    }
	    /**
	     * Animate container for active image
	     *
	     * @private
	     * @param {Number} x
	     * @param {Number} duration = 200
	     * @param {String} ease = 'out-circ'
	     * @returns {Promise}
	     */

	  }, {
	    key: 'animate',
	    value: function animate(x) {
	      var duration = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 200;
	      var ease = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'out-circ';

	      if (x == this.tx) return _promise2.default.resolve(null);
	      this.animating = true;
	      var tween = this.tween = (0, _tween2.default)({ x: this.tx }).ease(ease).to({ x: x }).duration(duration);

	      tween.update(function (o) {
	        self.setTransform(o.x);
	      });
	      var self = this;
	      var promise = new _promise2.default(function (resolve) {
	        tween.on('end', function () {
	          animate = function animate() {}; // eslint-disable-line
	          self.animating = false;
	          resolve();
	        });
	      });

	      function animate() {
	        (0, _raf2.default)(animate);
	        tween.update();
	      }

	      animate();
	      return promise;
	    }
	    /**
	     * Animate holder to match wrapper
	     *
	     * @private
	     * @param {Element} wrapper
	     * @param {String} src optional new src
	     * @returns {undefined}
	     */

	  }, {
	    key: 'positionHolder',
	    value: function positionHolder(wrapper, src) {
	      var opacity = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : true;

	      var el = this.holder;
	      if (!el) return _promise2.default.resolve(null);
	      if (src) el.style.backgroundImage = 'url(\'' + src + '\')';
	      var tween = (0, _tween2.default)({
	        width: parseInt(el.style.width, 10),
	        height: parseInt(el.style.height, 10),
	        left: parseInt(el.style.left, 10),
	        top: parseInt(el.style.top, 10),
	        opacity: 0.3
	      }).ease('out-cube').to({
	        width: parseInt(wrapper.style.width, 10),
	        height: parseInt(wrapper.style.height, 10),
	        left: parseInt(wrapper.style.left, 10),
	        top: this.container.clientHeight / 2 + parseInt(wrapper.style.marginTop, 10),
	        opacity: 1
	      }).duration(300);

	      tween.update(function (o) {
	        var n = opacity ? o.opacity : 1;
	        (0, _objectAssign2.default)(el.style, {
	          width: o.width + 'px',
	          height: o.height + 'px',
	          left: o.left + 'px',
	          top: o.top + 'px',
	          opacity: n
	        });
	      });

	      var self = this;
	      var promise = new _promise2.default(function (resolve) {
	        tween.on('end', function () {
	          if (el.parentNode) el.parentNode.removeChild(el);
	          self.holder = null;
	          animate = function animate() {}; // eslint-disable-line
	          resolve();
	        });
	      });

	      function animate() {
	        (0, _raf2.default)(animate);
	        tween.update();
	      }

	      animate();
	      return promise;
	    }
	    /**
	     * hide container and unbind events
	     *
	     * @public
	     */

	  }, {
	    key: 'hide',
	    value: function hide() {
	      if (this.dots) body.removeChild(this.dots);
	      this.zooms.forEach(function (pz) {
	        pz.unbind();
	      });
	      this.zooms = [];
	      this.status = [];
	      this.container.style.backgroundColor = 'rgba(0,0,0,0)';
	      this.emit('hide');
	      body.removeChild(this.container);
	      this.unbind();
	    }
	    /**
	     * unbind tap event
	     *
	     * @public
	     */

	  }, {
	    key: 'unbind',
	    value: function unbind() {
	      this.docEvents.unbind();
	      this.events.unbind();
	      if (this.pz) this.pz.unbind();
	      _event2.default.unbind(this.container, 'touchstart', this._containerTap);
	      _event2.default.unbind(doc, 'touchmove', preventDefault);
	    }
	  }]);
	  return ImagesPreview;
	}(_emitter2.default);

	function imgDimension(image) {
	  if (image.naturalWidth) {
	    return {
	      height: image.naturalHeight,
	      width: image.naturalWidth
	    };
	  } else {
	    var i = new Image();
	    i.src = image.src;
	    return {
	      height: i.height,
	      width: i.width
	    };
	  }
	}

	function viewportWidth() {
	  return Math.max(doc.documentElement.clientWidth, window.innerWidth || 0);
	}

	function preventDefault(e) {
	  e.preventDefault();
	}
	exports.default = ImagesPreview;

/***/ }),
/* 192 */
/***/ (function(module, exports, __webpack_require__) {

	var classes = __webpack_require__(52)

	/**
	 * add class to el and remove it from the same tagName siblings
	 *
	 * @param {Element} el
	 * @param {String} [default:active] [className] optional class added for el
	 * @api public
	 */
	module.exports = function (el, className) {
	  var children = el.parentNode.childNodes
	  var tagName = el.tagName
	  className = className || 'active'
	  for (var i = 0, l = children.length; i < l; i++) {
	    var node = children[i]
	    if (!node || (node.nodeType !== 1) || (node.tagName !== tagName)) continue
	    if (node === el) {
	      classes(node).add(className)
	    } else {
	      classes(node).remove(className)
	    }
	  }
	}


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

	var events = __webpack_require__(165)
	var event = __webpack_require__(194)
	var Emitter = __webpack_require__(47)
	var tap = __webpack_require__(49)
	var raf = __webpack_require__(131)
	var Tween = __webpack_require__(127)
	var detect = __webpack_require__(55)
	var util = __webpack_require__(195)
	var Pinch = __webpack_require__(196)
	var has3d = detect.has3d
	var transform = detect.transform
	var PI = Math.PI

	/**
	 * Init PinchZoom with element and optional opt
	 *
	 * @public
	 * @param  {Element}  el
	 * @param {Object} opt
	 */
	function PinchZoom(el, opt) {
	  if (!(this instanceof PinchZoom)) return new PinchZoom(el, opt)
	  opt = opt || {}
	  this.el = el
	  this.padding = opt.padding || 0
	  this.container = el.parentNode
	  this.container.style.overflow = 'hidden'
	  this.scale = 1
	  this.maxScale = opt.maxScale || 5
	  // maximun duration in ms for fast swipe
	  this.threshold = opt.threshold || 200
	  // minimum moved distance for fast swipe
	  this.fastThreshold = opt.fastThreshold || 30
	  var rect = el.getBoundingClientRect()
	  this.tapreset = opt.tapreset || false
	  this.sx = rect.left + rect.width/2
	  this.sy = rect.top + rect.height/2
	  // transform x y
	  this.tx = this.ty = 0
	  this.animating = false
	  this.pinch = new Pinch(el, this.onPinchMove.bind(this))
	  this.pinch.on('start', this.onPinchStart.bind(this))
	  this.pinch.on('end', this.onPinchEnd.bind(this))
	  if (has3d) {
	    this.el.style[transform + 'Origin'] = 'center center 0px'
	  } else {
	    this.el.style[transform + 'Origin'] = 'center center'
	  }
	  var _ontap = this._ontap = tap(this.ontap.bind(this))
	  event.bind(el, 'touchstart', _ontap)
	  this.events = events(el, this)
	  this.docEvents = events(document, this);
	  if (opt.draggable) {
	    this.events.bind('touchstart')
	    this.events.bind('touchmove')
	    this.events.bind('touchend')
	    this.docEvents.bind('touchend', 'ontouchend')
	  }
	}

	Emitter(PinchZoom.prototype)

	/**
	 * touchstart event listener for single touch
	 *
	 * @private
	 * @param  {Event}  e
	 */
	PinchZoom.prototype.ontouchstart = function (e) {
	  var touches = e.touches
	  if (this.animating) {
	    e.stopPropagation()
	    this.tween.stop()
	  }
	  if (!touches || 1 != touches.length) return
	  var rect = this.el.getBoundingClientRect()
	  this.translateY = rect.top < 0 || rect.bottom > this.container.clientHeight
	  this.speed = 0
	  var d = Date.now()
	  var t = e.touches[0]
	  var sx = t.clientX
	  var sy = t.clientY
	  var self = this
	  var start = {x: this.tx, y: this.ty}
	  var limit = this.getLimitation(100)
	  this.move = function (e, touch) {
	    self.down = {
	      x: sx,
	      y: sy,
	      at: d
	    }
	    var cx = touch.clientX
	    var cy = touch.clientY
	    var px = this.prev ? this.prev.x : sx
	    var py = this.prev ? this.prev.y : sy
	    e.preventDefault()
	    var leftOrRight = Math.abs(cx - px) > Math.abs(cy - py)
	    if (self.scale != 1 && !leftOrRight) e.stopPropagation()
	    self.calcuteSpeed(cx, cy)
	    var tx = start.x + cx - sx
	    var ty = start.y + cy - sy
	    var res = util.limit(tx, ty, limit)
	    var dx = res.x - tx
	    if (self.scale == 1 && leftOrRight) {
	      res.y = this.ty
	      this.angle = cx - px > 0 ? 0 : PI
	    }
	    if (leftOrRight) this.emit('move', dx)
	    if (!this.translateY) res.y = start.y
	    self.setTransform(res.x, res.y, self.scale)
	  }
	}

	/**
	 * touchmove event listener for single touch
	 *
	 * @private
	 * @param  {Event}  e
	 */
	PinchZoom.prototype.ontouchmove = function (e) {
	  if (!this.move || this.animating ||this.pinch.pinching) return
	  var touches = e.touches
	  if (!touches || 1 != touches.length) {
	    this.move = null
	    return
	  }
	  var touch = touches[0]
	  this.move(e, touch)
	}

	/**
	 * touchend event listener for single touch
	 *
	 * @private
	 * @param  {Event}  e
	 */
	PinchZoom.prototype.ontouchend = function (e) {
	  if (this.move == null) return
	  if (this.down == null) return this.move = null
	  //if (this.tween) this.tween.stop()
	  if (this.pinch.pinching || this.animating) return

	  var t = Date.now()
	  var touch = e.changedTouches[0]
	  var x = touch.clientX
	  var y = touch.clientY
	  var sx = this.down.x
	  var sy = this.down.y

	  this.calcuteSpeed(x, y)
	  var dx = Math.abs(x - sx)
	  var limit = this.getLimitation()
	  if (dx > this.fastThreshold && dx > Math.abs(y - sy) &&
	    (t - this.down.at) < this.threshold && (this.tx <= limit.minx || this.tx >= limit.maxx)) {
	    var dir = x > sx ? 'right' : 'left'
	    this.down = this.move = null
	    return this.emit('swipe', dir)
	  }

	  this.down = this.move = null
	  this.emit('end')
	  if (this.speed) this.momentum()
	}

	PinchZoom.prototype.momentum = function () {
	  var deceleration = 0.001
	  var limit = this.getLimitation(this.padding)
	  var speed = Math.min(this.speed, 4)
	  var rate = (4 - PI)/2
	  var dis = rate * (speed * speed) / (2 * deceleration)
	  var tx = this.tx + dis*Math.cos(this.angle)
	  var ty = this.ty + dis*Math.sin(this.angle)
	  var res = util.limit(tx, ty, limit)
	  var changed = ((this.scale > 1 && (tx < limit.minx || tx > limit.maxx))
	                || ty < limit.miny || ty > limit.maxy)
	  var ease = changed ? outBack : 'out-circ'
	  var d = util.distance([tx, ty, res.x, res.y])

	  var duration = (1 - d/dis) * speed/deceleration
	  if (this.ty < limit.miny || this.ty > limit.maxy) {
	    duration = 500
	    ease = 'out-circ'
	  }
	  if (!this.translateY) res.y = this.ty
	  return this.animate({x: res.x, y: res.y, scale: this.scale}, duration, ease)
	}

	/**
	 * get limitation values
	 *
	 * @private
	 */
	PinchZoom.prototype.getLimitation = function (padY) {
	  padY = padY || 0
	  var viewport = util.viewport
	  var vw = viewport.width
	  var vh = viewport.height
	  var rect = this.el.getBoundingClientRect()
	  var prect = this.el.parentNode.getBoundingClientRect()
	  return {
	    maxx: this.tx - rect.left + prect.left + this.padding,
	    minx: this.tx - (rect.left - prect.left + rect.width - vw) - this.padding,
	    miny: vh > rect.height ? this.ty - rect.top
	            : this.ty - rect.top - (rect.height - vh) - padY,
	    maxy: vh > rect.height ? this.ty + (vh - rect.top - rect.height)
	            : this.ty  - rect.top + padY
	    }
	}

	/**
	 * tap event handler
	 *
	 * @private
	 */
	PinchZoom.prototype.ontap = function () {
	  if (this.animating) return this.tween.stop()
	  var ts = Date.now()
	  // double tap
	  if (this.lastTap && ts - this.lastTap < 300) {
	    this.emit('tap')
	    return
	  }
	  if (this.scale == 1) {
	    //could be used for reset popup
	    this.emit('tap')
	    return
	  }
	  this.lastTap = Date.now()
	  if (this.tapreset) {
	    this.reset()
	  } else {
	    this.emit('tap')
	  }
	}

	/**
	 * Reset to initial state with animation
	 *
	 * @public
	 * @returns {Promise}
	 */
	PinchZoom.prototype.reset = function () {
	  this.emit('scale', {x: 0, y: 0, scale: 1})
	  var promise = this.animate({x: 0, y: 0, scale: 1}, 200)
	  return promise
	}

	/**
	 * PinchStart event handler
	 * @param {Obejct} point
	 * @private
	 */
	PinchZoom.prototype.onPinchStart = function (point) {
	  if (this.animating) this.tween.stop()
	  this.start = point
	  this.bx = this.sx + this.tx
	  this.by = this.sy + this.ty
	  this.startScale = this.scale
	  this.emit('start')
	}

	/**
	 * PinchMove event handler
	 * @param {Event} e
	 * @private
	 */
	PinchZoom.prototype.onPinchMove = function (e) {
	  if (this.animating) return
	  this.point = {x: e.x, y: e.y}
	  var mx = e.x - this.start.x
	  var my = e.y - this.start.y
	  // center position
	  var x = this.bx + mx
	  var y = this.by + my
	  var a = util.getAngle(x, y, e.x, e.y)
	  var dis = util.distance([e.y, e.x, y, x]) * (e.scale - 1)
	  var tx = this.bx - this.sx + mx - dis*Math.cos(a)
	  var ty = this.by - this.sy + my - dis*Math.sin(a)
	  this.setTransform(tx, ty, e.scale * this.startScale)
	}

	/**
	 * PinchEnd event handler
	 *
	 * @private
	 */
	PinchZoom.prototype.onPinchEnd = function () {
	  if (this.scale !== this.startScale) {
	    this.emit('scale', {x: this.tx, y: this.ty, scale: this.scale})
	  }
	  this.startScale = this.scale
	  var p = this.checkScale()
	  if (!p) this.checkPosition()
	}

	/**
	 * set transform properties of element
	 *
	 * @public
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scale
	 */
	PinchZoom.prototype.setTransform = function (x, y, scale) {
	  if (isNaN(x) || isNaN(y)) return
	  this.tx = x
	  this.ty = y
	  this.scale = scale
	  if (has3d) {
	    this.el.style[transform] = 'translate3d(' + x + 'px, ' + y + 'px, 0) '
	    + ' scale3d(' + scale + ',' + scale + ', 1)'
	  } else {
	    this.el.style[transform] = 'translate(' + x + 'px, ' + y + 'px) '
	    + ' scale(' + scale + ','  + scale + ')'
	  }
	}

	/**
	 * animate transoform properties
	 *
	 * @public
	 * @param  {Element}  o
	 * @param {Number} duration
	 * @param {String} ease
	 */
	PinchZoom.prototype.animate = function (o, duration, ease) {
	  var current = {x: this.tx, y: this.ty, scale: this.scale}
	  ease = ease || 'out-circ'
	  var self = this
	  this.animating = true
	  var tween = this.tween = Tween(current)
	    .ease(ease)
	    .to(o)
	    .duration(duration)

	  tween.update(function(o){
	    self.setTransform(o.x, o.y, o.scale)
	  })

	  var promise = new Promise(function (resolve) {
	    tween.on('end', function(){
	      animate = function(){} // eslint-disable-line
	      self.animating = false
	      resolve()
	    })
	  })

	  function animate() {
	    raf(animate)
	    tween.update()
	  }

	  animate()
	  return promise
	}

	/**
	 * unbind all event listeners and reset element
	 *
	 * @public
	 */
	PinchZoom.prototype.unbind = function () {
	  this.setTransform(0, 0, 1)
	  this.pinch.unbind()
	  this.events.unbind()
	  this.docEvents.unbind()
	  event.unbind(this.el, 'touchstart', this._ontap)
	}

	/**
	 * Reset position if invalid scale or offset.
	 *
	 * @private
	 */
	PinchZoom.prototype.checkPosition = function () {
	  var rect = this.el.getBoundingClientRect()
	  var dest = {x: this.tx, y: this.ty, scale: this.scale}

	  var viewport = util.viewport
	  var vw = viewport.width
	  var vh = viewport.height
	  var pad = this.padding
	  if (rect.left > pad) {
	    dest.x = this.tx - rect.left + pad
	  } else if (rect.left + rect.width < vw - pad) {
	    dest.x = this.tx + (vw - rect.left - rect.width - pad)
	  }
	  var bottom = rect.top + rect.height
	  if (rect.top > 0 && bottom > vh - pad) {
	    // too low
	    dest.y = this.ty - (bottom - vh + pad)
	  } else if (rect.top < pad && bottom < vh - pad) {
	    // too high
	    dest.y = this.ty - rect.top + pad
	  }
	  if (dest.x !== this.tx || dest.y !== this.ty) {
	    return this.animate(dest, 200)
	  }
	  return Promise.resolve()
	}

	/**
	 * Reset scale if scale not valid
	 *
	 * @private
	 */
	PinchZoom.prototype.checkScale = function () {
	  if (this.scale < 1) return this.reset()
	  if (this.scale > this.maxScale) {
	    var p = this.point
	    return this.scaleAt(p.x, p.y, this.maxScale)
	  }
	}

	/**
	 * Limit scale to pinch point
	 * @param {Number} scale
	 * @private
	 */
	PinchZoom.prototype.limitScale = function (scale) {
	  var x = this.sx + this.tx
	  var y = this.sy + this.ty
	  var point = this.point
	  var a = Math.atan((point.y - y)/(point.x - x))
	  if ((point.y < y && point.x < x) || (point.y > y && point.x < x)) {
	    a = a + PI
	  }
	  var dis = util.distance([point.y, point.x, y, x]) * (this.scale - scale)
	  var tx = this.tx + dis*Math.cos(a)
	  var ty = this.ty + dis*Math.sin(a)
	  return this.animate({x: tx, y: ty, scale: scale}, 200)
	}

	/**
	 * change el to scale at x,y with specified scale
	 *
	 * @public
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} scale
	 * @returns {Promise}
	 */
	PinchZoom.prototype.scaleAt = function (x, y, scale) {
	  var cx = this.sx + this.tx
	  var cy = this.sy + this.ty
	  var a = util.getAngle(cx, cy, x, y)
	  var dis = util.distance([y, x, cy, cx]) * (1 - scale/this.scale)
	  var tx = this.tx + dis*Math.cos(a)
	  var ty = this.ty + dis*Math.sin(a)
	  return this.animate({x: tx, y: ty, scale: scale}, 300)
	}

	PinchZoom.prototype.calcuteSpeed = function(x, y) {
	  var prev = this.prev || this.down
	  var ts = Date.now()
	  var dt = ts - prev.at
	  if (ts - this.down.at < 50 || dt > 50) {
	    var distance = util.distance([prev.x, prev.y, x, y])
	    this.speed = Math.abs(distance / dt)
	    this.angle = util.getAngle(prev.x, prev.y, x, y)
	  }
	  if (dt > 50) {
	    this.prev = {x: x, y: y, at: ts}
	  }
	}

	function outBack(n) {
	  var s = 1.20158;
	  return --n * n * ((s + 1) * n + s) + 1;
	}

	module.exports = PinchZoom


/***/ }),
/* 194 */
/***/ (function(module, exports) {

	var bind = window.addEventListener ? 'addEventListener' : 'attachEvent',
	    unbind = window.removeEventListener ? 'removeEventListener' : 'detachEvent',
	    prefix = bind !== 'addEventListener' ? 'on' : '';

	/**
	 * Bind `el` event `type` to `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.bind = function(el, type, fn, capture){
	  el[bind](prefix + type, fn, capture || false);
	  return fn;
	};

	/**
	 * Unbind `el` event `type`'s callback `fn`.
	 *
	 * @param {Element} el
	 * @param {String} type
	 * @param {Function} fn
	 * @param {Boolean} capture
	 * @return {Function}
	 * @api public
	 */

	exports.unbind = function(el, type, fn, capture){
	  el[unbind](prefix + type, fn, capture || false);
	  return fn;
	};

/***/ }),
/* 195 */
/***/ (function(module, exports) {

	/**
	 * Get the distance between two points
	 *
	 * @param {Array} arr [x1, y1, x2, y2]
	 * @return {Number}
	 * @api private
	 */

	exports.distance = function (arr) {
	  var x = Math.pow(arr[0] - arr[2], 2);
	  var y = Math.pow(arr[1] - arr[3], 2);
	  return Math.sqrt(x + y);
	}

	/**
	 * Get the midpoint
	 *
	 * @param {Array} arr
	 * @return {Object} coords
	 * @api private
	 */

	exports.midpoint = function (arr) {
	  var coords = {};
	  coords.x = (arr[0] + arr[2]) / 2;
	  coords.y = (arr[1] + arr[3]) / 2;
	  return coords;
	}

	Object.defineProperty(exports, 'viewport', {
	  get: function () {
	    return {
	      height: Math.max(document.documentElement.clientHeight, window.innerHeight || 0),
	      width: Math.max(document.documentElement.clientWidth, window.innerWidth || 0)
	    }
	  }
	})

	/**
	 * getAngle
	 *
	 * @public
	 * @param {Number} x
	 * @param {Number} y
	 * @param {Number} x1
	 * @param {Number} y1
	 * @returns {undefined}
	 */
	exports.getAngle = function (x, y, x1, y1) {
	  if (x == x1 && y == y1) return 0
	  var a = Math.atan((y1 - y)/(x1 - x))
	  if (x1 < x) return a + Math.PI
	  return a
	}

	exports.limit = function (x, y, limit) {
	  if (x < limit.minx) {
	    x = limit.minx
	  } else if (x > limit.maxx) {
	    x = limit.maxx
	  }
	  if (y < limit.miny) {
	    y = limit.miny
	  } else if (y > limit.maxy) {
	    y = limit.maxy
	  }
	  return {
	    x: x,
	    y: y
	  }
	}


/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

	/*
	 * Module dependencies
	 */

	var events = __webpack_require__(165)
	var Emitter = __webpack_require__(47)
	var E = __webpack_require__(197)
	var util = __webpack_require__(195)

	/**
	 * Export `Pinch`
	 */

	module.exports = Pinch

	/**
	 * Initialize `Pinch`
	 *
	 * @param {Element} el
	 * @param {Function} fn
	 * @return {Pinch}
	 * @api public
	 */

	function Pinch(el, fn) {
	  if (!(this instanceof Pinch)) return new Pinch(el, fn)
	  this.el = el
	  this.parent = el.parentNode
	  this.fn = fn || function(){}
	  this.midpoint = null
	  this.scale = 1
	  this.lastScale = 1
	  this.pinching = false
	  this.events = events(el, this)
	  this.events.bind('touchstart')
	  this.events.bind('touchmove')
	  this.events.bind('touchend')
	  this.fingers = {}
	}

	Emitter(Pinch.prototype)

	/**
	 * Touch start
	 *
	 * @param {Event} e
	 * @return {Pinch}
	 * @api private
	 */

	Pinch.prototype.ontouchstart = function(e) {
	  var touches = e.touches
	  if (!touches || 2 != touches.length) return this
	  e.preventDefault()
	  e.stopPropagation()

	  var coords = []
	  for(var i = 0, finger; i < touches.length; i++) {
	    finger = touches[i]
	    coords.push(finger.clientX, finger.clientY)
	  }

	  this.pinching = true
	  this.distance = util.distance(coords)
	  this.midpoint = util.midpoint(coords)
	  this.emit('start', this.midpoint)
	  return this
	}

	/**
	 * Touch move
	 *
	 * @param {Event} e
	 * @return {Pinch}
	 * @api private
	 */

	Pinch.prototype.ontouchmove = function(e) {
	  var touches = e.touches
	  if (!touches || touches.length != 2 || !this.pinching) return this
	  e.preventDefault()
	  e.stopPropagation()
	  var coords = []
	  for(var i = 0, finger; i < touches.length ; i++) {
	    finger = touches[i]
	    coords.push(finger.clientX, finger.clientY)
	  }

	  var dist = util.distance(coords)
	  var mid = util.midpoint(coords)

	  // make event properties mutable
	  e = E(e)

	  // iphone does scale natively, just use that
	  e.scale = dist / this.distance * this.scale
	  e.x = mid.x
	  e.y = mid.y

	  this.fn(e)

	  this.lastScale = e.scale
	  return this
	}

	/**
	 * Touchend
	 *
	 * @param {Event} e
	 * @return {Pinch}
	 * @api private
	 */

	Pinch.prototype.ontouchend = function(e) {
	  var touches = e.touches
	  if (!touches || touches.length == 2 || !this.pinching) return this
	  this.scale = this.lastScale
	  this.pinching = false
	  this.emit('end')
	  return this
	}

	/**
	 * Unbind
	 *
	 * @return {Pinch}
	 * @api public
	 */

	Pinch.prototype.unbind = function() {
	  this.events.unbind()
	  return this
	}


/***/ }),
/* 197 */
/***/ (function(module, exports) {

	/**
	 * Expose `E`
	 */

	module.exports = function(e) {
	  // any property it doesn't find on the object
	  // itself, look up prototype for original `e`
	  E.prototype = e;
	  return new E();
	};

	/**
	 * Initialize `E`
	 */

	function E() {}


/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	exports.default = function (node, opts) {
	  opts = opts || [];
	  var ctx = createCtx(node);
	  var h = node.clientHeight || 32;
	  var w = node.clientWidth || 32;
	  var duration = opts.duration || 1000;
	  var color = opts.color || '#ffffff';
	  var rgb = torgb(color);
	  var x = h / 2;
	  var y = w / 2;
	  var r = Math.min(h, w) / 2 - 4;
	  var stop = void 0;
	  var start = void 0;
	  function step(timestamp) {
	    ctx.clearRect(0, 0, w, h);
	    if (stop) return;
	    if (!start) start = timestamp;
	    if (!node.parentNode) stop = true;
	    var ts = (timestamp - start) % duration;
	    ctx.beginPath();
	    ctx.strokeStyle = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 0.4)';
	    ctx.arc(x, y, r, 0, Math.PI * 2);
	    ctx.lineWidth = opts.width || 4;
	    ctx.lineCap = 'round';
	    ctx.stroke();
	    var a = -Math.PI / 2 + Math.PI * 2 * ts / duration;
	    var e = a + Math.PI / 2;
	    ctx.beginPath();
	    ctx.strokeStyle = 'rgba(' + rgb.r + ', ' + rgb.g + ', ' + rgb.b + ', 1)';
	    ctx.arc(x, y, r, a, e);
	    ctx.stroke();
	    (0, _raf2.default)(step);
	  }
	  (0, _raf2.default)(step);
	  return function () {
	    stop = true;
	  };
	};

	var _autoscaleCanvas = __webpack_require__(199);

	var _autoscaleCanvas2 = _interopRequireDefault(_autoscaleCanvas);

	var _raf = __webpack_require__(131);

	var _raf2 = _interopRequireDefault(_raf);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function createCtx(node) {
	  var canvas = document.createElement('canvas');
	  node.appendChild(canvas);
	  var rect = node.getBoundingClientRect();
	  var ctx = canvas.getContext('2d');
	  canvas.height = rect.height;
	  canvas.width = rect.width;
	  (0, _autoscaleCanvas2.default)(canvas);
	  return ctx;
	}

	var hex_reg = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i;
	function torgb(hex) {
	  if (hex.length == 4) hex = hex.replace(/[^#]/g, function (p) {
	    return p + p;
	  });
	  var result = hex_reg.exec(hex);
	  return result ? {
	    r: parseInt(result[1], 16),
	    g: parseInt(result[2], 16),
	    b: parseInt(result[3], 16)
	  } : null;
	}

/***/ }),
/* 199 */
/***/ (function(module, exports) {

	
	/**
	 * Retina-enable the given `canvas`.
	 *
	 * @param {Canvas} canvas
	 * @return {Canvas}
	 * @api public
	 */

	module.exports = function(canvas){
	  var ctx = canvas.getContext('2d');
	  var ratio = window.devicePixelRatio || 1;
	  if (1 != ratio) {
	    canvas.style.width = canvas.width + 'px';
	    canvas.style.height = canvas.height + 'px';
	    canvas.width *= ratio;
	    canvas.height *= ratio;
	    ctx.scale(ratio, ratio);
	  }
	  return canvas;
	};

/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(147);

	var _promise2 = _interopRequireDefault(_promise);

	exports.default = Confirm;

	var _query = __webpack_require__(170);

	var _query2 = _interopRequireDefault(_query);

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _event = __webpack_require__(132);

	var _event2 = _interopRequireDefault(_event);

	var _classes = __webpack_require__(52);

	var _classes2 = _interopRequireDefault(_classes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Confirm(message) {
	  var nobtns = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

	  var tmpl = '\n  <div class="cd-popup is-visible" role="alert">\n    <div class="cd-popup-container">\n      <p>' + message + '</p>\n      <ul class="cd-buttons">\n        <li class="yes"><a href="javascript:">\u786E\u8BA4</a></li>\n        <li class="no"><a href="javascript:">\u53D6\u6D88</a></li>\n      </ul>\n    </div> <!-- cd-popup-container -->\n  </div>\n  ';
	  var el = (0, _domify2.default)(tmpl);
	  document.body.appendChild(el);
	  var removed = false;
	  function dismiss() {
	    removed = true;
	    (0, _classes2.default)(el).remove('is-visible');
	    setTimeout(function () {
	      el.parentNode.removeChild(el);
	    }, 200);
	  }

	  return new _promise2.default(function (resolve, reject) {
	    if (nobtns) {
	      var btn = el.querySelector('.cd-buttons');
	      btn.style.display = 'none';
	      _event2.default.bind(el, 'click', function () {
	        dismiss();
	        resolve();
	      });
	    }
	    _event2.default.bind((0, _query2.default)('.yes', el), 'click', function (e) {
	      if (removed) return;
	      e.preventDefault();
	      dismiss();
	      resolve();
	    });
	    _event2.default.bind((0, _query2.default)('.no', el), 'click', function (e) {
	      if (removed) return;
	      e.preventDefault();
	      dismiss();
	      reject(new Error('canceled'));
	    });
	  });
	}

/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	var _defineProperty2 = __webpack_require__(202);

	var _defineProperty3 = _interopRequireDefault(_defineProperty2);

	var _propDetect = __webpack_require__(55);

	var _objectAssign = __webpack_require__(186);

	var _objectAssign2 = _interopRequireDefault(_objectAssign);

	var _spin = __webpack_require__(198);

	var _spin2 = _interopRequireDefault(_spin);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var body = document.body;

	module.exports = {
	  show: function show() {
	    var overlay = this.overlay = document.createElement('div');
	    var middle = document.createElement('div');
	    (0, _objectAssign2.default)(middle.style, {
	      height: '48px',
	      width: '48px'
	    });
	    overlay.appendChild(middle);
	    (0, _objectAssign2.default)(overlay.style, (0, _defineProperty3.default)({
	      position: 'fixed',
	      top: 0,
	      left: 0,
	      bottom: 0,
	      right: 0,
	      zIndex: 9999999,
	      display: 'flex',
	      alignItems: 'center',
	      justifyContent: 'center',
	      backgroundColor: 'rgba(0,0,0,0)'
	    }, _propDetect.transition, 'background-color 200ms linear'));
	    body.appendChild(overlay);
	    this.stop = (0, _spin2.default)(middle, {});
	    setTimeout(function () {
	      overlay.style.backgroundColor = 'rgba(0,0,0,0.3)';
	    }, 20);
	  },
	  hide: function hide() {
	    var _this = this;

	    this.overlay.style.backgroundColor = 'rgba(0,0,0,0.0)';
	    setTimeout(function () {
	      _this.stop();
	      body.removeChild(_this.overlay);
	    });
	  }
	};

/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

	"use strict";

	exports.__esModule = true;

	var _defineProperty = __webpack_require__(94);

	var _defineProperty2 = _interopRequireDefault(_defineProperty);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	exports.default = function (obj, key, value) {
	  if (key in obj) {
	    (0, _defineProperty2.default)(obj, key, {
	      value: value,
	      enumerable: true,
	      configurable: true,
	      writable: true
	    });
	  } else {
	    obj[key] = value;
	  }

	  return obj;
	};

/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _promise = __webpack_require__(147);

	var _promise2 = _interopRequireDefault(_promise);

	exports.default = Prompt;

	var _query = __webpack_require__(170);

	var _query2 = _interopRequireDefault(_query);

	var _domify = __webpack_require__(50);

	var _domify2 = _interopRequireDefault(_domify);

	var _event = __webpack_require__(132);

	var _event2 = _interopRequireDefault(_event);

	var _classes = __webpack_require__(52);

	var _classes2 = _interopRequireDefault(_classes);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function Prompt() {
	  var tmpl = '\n  <div class="cd-popup is-visible" role="prompt">\n    <div class="cd-popup-container">\n      <p>\n        <input type="text" placeholder="\u8BF7\u8F93\u5165\u626B\u7801\u7ED3\u679C"/>\n      </p>\n      <ul class="cd-buttons">\n        <li class="yes"><a href="javascript:">\u786E\u8BA4</a></li>\n        <li class="no"><a href="javascript:">\u53D6\u6D88</a></li>\n      </ul>\n    </div> <!-- cd-popup-container -->\n  </div>\n  ';
	  var el = (0, _domify2.default)(tmpl);
	  document.body.appendChild(el);
	  var removed = false;
	  function dismiss() {
	    removed = true;
	    (0, _classes2.default)(el).remove('is-visible');
	    setTimeout(function () {
	      el.parentNode.removeChild(el);
	    }, 200);
	  }

	  return new _promise2.default(function (resolve, reject) {
	    var btn = el.querySelector('.cd-buttons');
	    _event2.default.bind((0, _query2.default)('.yes', el), 'click', function (e) {
	      if (removed) return;
	      e.preventDefault();
	      var v = el.querySelector('input').value;
	      if (!v.trim()) return;
	      dismiss();
	      resolve(v.trim());
	    });
	    _event2.default.bind((0, _query2.default)('.no', el), 'click', function (e) {
	      if (removed) return;
	      e.preventDefault();
	      dismiss();
	      reject(new Error('canceled'));
	    });
	  });
	}

/***/ }),
/* 204 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _emitter = __webpack_require__(47);

	var _emitter2 = _interopRequireDefault(_emitter);

	var _viewManage = __webpack_require__(61);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	var tabBar = window.__wxConfig__.tabBar || {};
	if (typeof Array.prototype.forEach != "function") {
	  Array.prototype.forEach = function (fn, context) {
	    for (var k = 0, length = this.length; k < length; k++) {
	      if (typeof fn === "function" && Object.prototype.hasOwnProperty.call(this, k)) {
	        fn.call(context, this[k], k, this);
	      }
	    }
	  };
	}

	var Tabbar = {
	  init: function init() {
	    this.activeIdx = 0;
	    this.scrollable = document.querySelector('.scrollable');
	    this.tabbar = document.querySelector('.jshook-ws-tabbar');
	    if (!this.tabbar) return;
	    var self = this;
	    this.tabbarItems = this.tabbar.querySelectorAll('.jshook-ws-tabbar-item');
	    [].forEach.call(this.tabbarItems, function (item, i) {
	      item.onclick = self.onItemTap.bind(self, i, item);
	    });
	  },
	  reset: function reset() {
	    var p = (0, _viewManage.currentView)().path;
	    this.select(p);
	  },
	  show: function show(path) {
	    if (!this.tabbar) return;
	    var p = path.replace(/\?(.*)$/, '').replace(/\.wxml$/, '');
	    this.select(p);
	  },
	  select: function select(path) {
	    var list = tabBar.list || [];
	    this.activeIdx = -1;
	    for (var i in list) {
	      if (list[i].pagePath === path) {
	        this.activeIdx = i;
	      }
	    }
	    //this.activeIdx = (list || []).findIndex(item => item.pagePath === path)
	    this.doUpdate();
	  },
	  onItemTap: function onItemTap(idx, elemt) {
	    if (idx == this.activeIdx) return;
	    var item = void 0,
	        list = tabBar.list || [];
	    for (var i in list) {
	      if (i == idx) {
	        item = list[i];
	      }
	    }
	    /*
	    
	        let item = tabBar.list.find((item, index) => {
	          return idx == index
	        })
	    */
	    this.activeIdx = idx;
	    //this.doUpdate();
	    this.emit('active', item.pagePath);
	  },
	  doUpdate: function doUpdate() {
	    var active = this.activeIdx;
	    var hidden = active == -1 || active == null;
	    var top = tabBar.position == 'top';
	    if (hidden || top) {
	      this.scrollable.style.bottom = '0px';
	    } else {
	      this.scrollable.style.bottom = '56px';
	    }
	    if (top && active != -1) {
	      this.scrollable.style.top = '47px';
	    } else {
	      this.scrollable.style.top = '42px';
	    }
	    if (this.tabbar) {
	      this.tabbar.style.display = hidden ? 'none' : 'flex';
	      [].forEach.call(this.tabbarItems, function (item, idx) {
	        //var idx = item.getAttribute('key');
	        var iconDom = item.querySelector('.tabbar-icon');
	        var iDom = item.querySelector('.tabbar-label-indicator');
	        var labelDom = item.querySelector('.tabbar-label');
	        //fix tabbar no iconPath bug
	        if (!iconDom.getAttribute('src')) {
	          iconDom.style.display = 'none';
	        }
	        if (active == idx) {
	          if (!top) {
	            iconDom.src = iconDom.getAttribute('select-icon');
	          } else {
	            iDom.style.color = tabBar.selectedColor;
	            iDom.style.display = 'inline-block';
	          }
	          labelDom.style.color = tabBar.selectedColor;
	        } else {
	          if (!top) {
	            iconDom.src = iconDom.getAttribute('icon');
	          } else {
	            iDom.style.color = tabBar.color;
	            iDom.style.display = 'none';
	          }
	          labelDom.style.color = tabBar.color;
	        }
	      });
	    }
	  }
	};

	(0, _emitter2.default)(Tabbar);

	exports.default = Tabbar;

/***/ }),
/* 205 */
/***/ (function(module, exports, __webpack_require__) {

	'use strict';

	Object.defineProperty(exports, "__esModule", {
	  value: true
	});

	var _assign = __webpack_require__(10);

	var _assign2 = _interopRequireDefault(_assign);

	exports.setStorageSync = setStorageSync;
	exports.getStorageSync = getStorageSync;
	exports.clearStorageSync = clearStorageSync;
	exports.removeStorageSync = removeStorageSync;
	exports.getStorageInfoSync = getStorageInfoSync;
	exports.getSystemInfoSync = getSystemInfoSync;
	exports.getSystemInfo = getSystemInfo;

	var _storage = __webpack_require__(125);

	var _storage2 = _interopRequireDefault(_storage);

	var _merge = __webpack_require__(137);

	var _merge2 = _interopRequireDefault(_merge);

	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

	function systemInfo() {
	  return {
	    model: /iPhone/.test(navigator.userAgent) ? 'iPhone' : 'Android',
	    pixelRatio: window.devicePixelRatio || 1,
	    windowWidth: window.innerWidth || 0,
	    windowHeight: window.innerHeight || 0,
	    language: window.navigator.userLanguage || window.navigator.language,
	    platform: 'weweb',
	    version: "0.0.1"
	  };
	}

	function toResult(msg, data, command) {
	  var obj = {
	    ext: data, //传过来的数据
	    msg: msg //调用api返回的结果
	  };
	  if (command) obj.command = command;
	  return obj;
	}

	function toError(data) {
	  var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	  var extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  //let name = data.sdkName.replace(/Sync$/, '')
	  var name = data.sdkName;
	  var obj = (0, _assign2.default)({
	    errMsg: name + ':fail'
	  }, extra);
	  return toResult(obj, data, result ? 'GET_ASSDK_RES' : null);
	}

	function toSuccess(data) {
	  var result = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
	  var extra = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

	  //let name = data.sdkName.replace(/Sync$/, '')
	  var name = data.sdkName;
	  var obj = (0, _assign2.default)({
	    errMsg: name + ':ok'
	  }, extra);
	  return toResult(obj, data, result ? 'GET_ASSDK_RES' : null);
	}

	function setStorageSync(data) {
	  var args = data.args;
	  if (args.key == null || args.data == null) return toError(data, true);
	  _storage2.default.set(args.key, args.data, args.dataType);
	  return toSuccess(data, true);
	}

	function getStorageSync(data) {
	  var args = data.args;
	  if (args.key == null || args.key == '') return toError(data, true);
	  var res = _storage2.default.get(args.key);
	  return toSuccess(data, true, {
	    data: res.data,
	    dataType: res.dataType
	  });
	}

	function clearStorageSync(data) {
	  _storage2.default.clear();
	  return toSuccess(data, true);
	}

	function removeStorageSync(data) {
	  var args = data.args;
	  if (args.key == null || args.key == '') return toError(data, true);
	  _storage2.default.remove(args.key);
	  return toSuccess(data, true);
	}

	function getStorageInfoSync(data) {
	  var obj = _storage2.default.info();
	  return toSuccess(data, true, obj);
	}

	function getSystemInfoSync(data) {
	  var info = systemInfo();
	  return toSuccess(data, true, info);
	}

	function getSystemInfo(data) {
	  var info = systemInfo();
	  return toSuccess(data, true, info);
	}

/***/ })
/******/ ]);