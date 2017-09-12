import bridge from './bridge'
import utils from './utils'

var localImgDataIng = !1,
  imgData = [],
  wx = {},
  foregroundCallbacks = [],
  backgroundCallbacks = [],

  publish = function (name, args) {//publish
    bridge.publish("INVOKE_METHOD", {
      name: name,
      args: args
    })
  },
  apiObj = {
    invoke: bridge.invoke,
    on: bridge.on,
    getPlatform: utils.getPlatform,
    onAppEnterForeground: function (fn) {
      foregroundCallbacks.push(fn)
    },
    onAppEnterBackground: function (fn) {
      backgroundCallbacks.push(fn)
    },
    reportIDKey: function (e, t) {
      console.warn("reportIDKey has been removed wx")
    },
    reportKeyValue: function (e, t) {
      console.warn("reportKeyValue has been removed from wx")
    },
    redirectTo: function (params) {
      publish("redirectTo", params)
    },
    navigateTo: function (params) {
      publish("navigateTo", params)
    },
    reLaunch:function (params) {
      publish("reLaunch", params)
    },
    switchTab: function (params) {
      publish("switchTab", params)
    },
    clearStorage: function () {
      publish("clearStorage", {})
    },
    showKeyboard: function (params) {
      bridge.invokeMethod("showKeyboard", params)
    },
    showDatePickerView: function (params) {
      bridge.invokeMethod("showDatePickerView", params)
    },
    hideKeyboard: function (params) {
      bridge.invokeMethod("hideKeyboard", params)
    },
    insertMap: function (params) {
      bridge.invokeMethod("insertMap", params)
    },
    removeMap: function (params) {
      bridge.invokeMethod("removeMap", params)
    },
    updateMapCovers: function (params) {
      bridge.invokeMethod("updateMapCovers", params)
    },
    getRealRoute: utils.getRealRoute,
    getCurrentRoute: function (params) {
      bridge.invokeMethod("getCurrentRoute", params, {
        beforeSuccess: function (res) {
          res.route = res.route.split("?")[0]
        }
      })
    },
    getLocalImgData: function (params) {
      function beforeAllFn() {
        localImgDataIng = !1
        if ( imgData.length > 0) {
          var item = imgData.shift();
          apiObj.getLocalImgData(item)
        }
      }

      if (localImgDataIng === !1) {
        localImgDataIng = !0
        if ("string" == typeof params.path) {
          apiObj.getCurrentRoute({
            success: function (res) {
              var route = res.route;
              params.path = utils.getRealRoute(route || "index.html", params.path);
              bridge.invokeMethod("getLocalImgData", params, {
                beforeAll: beforeAllFn
              })
            }
          })
        } else {
          bridge.invokeMethod("getLocalImgData", params, {
            beforeAll: beforeAllFn
          })
        }
      } else {
        imgData.push(params)
      }
    },
    insertVideoPlayer: function (e) {
      bridge.invokeMethod("insertVideoPlayer", e)
    },
    removeVideoPlayer: function (e) {
      bridge.invokeMethod("removeVideoPlayer", e)
    },
    insertShareButton: function (e) {
      bridge.invokeMethod("insertShareButton", e)
    },
    updateShareButton: function (e) {
      bridge.invokeMethod("updateShareButton", e)
    },
    removeShareButton: function (e) {
      bridge.invokeMethod("removeShareButton", e)
    },
    onAppDataChange: function (callback) {
      bridge.subscribe("appDataChange", function (params) {
        callback(params)
      })
    },
    onPageScrollTo: function (callback) {
      bridge.subscribe("pageScrollTo",function (params) {
        callback(params);
      })
    },
    publishPageEvent: function (eventName, data) {
      bridge.publish("PAGE_EVENT", {
        eventName: eventName,
        data: data
      })
    },
    animationToStyle: utils.animationToStyle
  };
bridge.subscribe("onAppEnterForeground", function (e) {
  foregroundCallbacks.forEach(function (fn) {
    fn(e)
  })
});
bridge.subscribe("onAppEnterBackground", function (e) {
  backgroundCallbacks.forEach(function (fn) {
    fn(e)
  })
});
function injectAttr(attrName) {
  wx.__defineGetter__(attrName, function () {
    return function () {
      if(apiObj[attrName]) {
        return apiObj[attrName].apply(this, arguments)
      } else {
        console.log(attrName+' method no exist')
      }
    }
  })
}

for (var key in apiObj) injectAttr(key);


// export default wx
module.exports = wx