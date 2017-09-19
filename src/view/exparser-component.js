function exeWhenWXJSbridgeReady (fn) {
  fn()
}

// 转发 window 上的 animation 和 transition 相关的动画事件到 exparser
;(function (win) {
  var getOpt = function (args) {
      return {
        animationName: args.animationName,
        elapsedTime: args.elapsedTime
      }
    },
    isWebkit = null
  var animationAPIList = [
    'webkitAnimationStart',
    'webkitAnimationIteration',
    'webkitAnimationEnd',
    'animationstart',
    'animationiteration',
    'animationend',
    'webkitTransitionEnd',
    'transitionend'
  ]
  animationAPIList.forEach(function (key) {
    isWebkit = key.slice(0, 6) === 'webkit'
    if (isWebkit) {
      key = key.slice(6).toLowerCase()
    }

    win.addEventListener(
      key,
      function (event) {
        event.target.__wxElement &&
          exparser.triggerEvent(event.target.__wxElement, key, getOpt(event))
        document.dispatchEvent(new CustomEvent('pageReRender', {}))
      },
      !0
    )
  })
})(window)

// 订阅并转发 WeixinJSBridge 提供的全局事件到 exparser
;(function (glob) {
  exeWhenWXJSbridgeReady(function () {
    WeixinJSBridge.subscribe('onAppRouteDone', function () {
      window.__onAppRouteDone = !0
      exparser.triggerEvent(
        document,
        'routeDone',
        {},
        {
          bubbles: !0
        }
      )
      document.dispatchEvent(new CustomEvent('pageReRender', {}))
    })
    WeixinJSBridge.subscribe('setKeyboardValue', function (event) {
      event &&
        event.data &&
        exparser.triggerEvent(
          document,
          'setKeyboardValue',
          {
            value: event.data.value,
            cursor: event.data.cursor,
            inputId: event.data.inputId
          },
          {
            bubbles: !0
          }
        )
    })
    WeixinJSBridge.subscribe('hideKeyboard', function (e) {
      exparser.triggerEvent(
        document,
        'hideKeyboard',
        {},
        {
          bubbles: !0
        }
      )
    })
    WeixinJSBridge.on('onKeyboardComplete', function (event) {
      exparser.triggerEvent(
        document,
        'onKeyboardComplete',
        {
          value: event.value,
          inputId: event.inputId
        },
        {
          bubbles: !0
        }
      )
    })
    WeixinJSBridge.on('onKeyboardConfirm', function (event) {
      exparser.triggerEvent(
        document,
        'onKeyboardConfirm',
        {
          value: event.value,
          inputId: event.inputId
        },
        {
          bubbles: !0
        }
      )
    })
    WeixinJSBridge.on('onTextAreaHeightChange', function (event) {
      exparser.triggerEvent(
        document,
        'onTextAreaHeightChange',
        {
          height: event.height,
          lineCount: event.lineCount,
          inputId: event.inputId
        },
        {
          bubbles: !0
        }
      )
    })
    WeixinJSBridge.on('onKeyboardShow', function (event) {
      exparser.triggerEvent(
        document,
        'onKeyboardShow',
        {
          inputId: event.inputId
        },
        {
          bubbles: !0
        }
      )
    })
  })
})(window)

// 转发 window 上的 error 以及各种表单事件到 exparser
;(function (window) {
  exparser.globalOptions.renderingMode = 'native'

  window.addEventListener(
    'change',
    function (event) {
      exparser.triggerEvent(event.target, 'change', {
        value: event.target.value
      })
    },
    !0
  )

  window.addEventListener(
    'input',
    function (event) {
      exparser.triggerEvent(event.target, 'input')
    },
    !0
  )

  window.addEventListener(
    'load',
    function (event) {
      exparser.triggerEvent(event.target, 'load')
    },
    !0
  )

  window.addEventListener(
    'error',
    function (event) {
      exparser.triggerEvent(event.target, 'error')
    },
    !0
  )

  window.addEventListener(
    'focus',
    function (event) {
      exparser.triggerEvent(event.target, 'focus'), event.preventDefault()
    },
    !0
  )

  window.addEventListener(
    'blur',
    function (event) {
      exparser.triggerEvent(event.target, 'blur')
    },
    !0
  )

  window.requestAnimationFrame =
    window.requestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.msRequestAnimationFrame
  window.requestAnimationFrame ||
    (window.requestAnimationFrame = function (func) {
      typeof func === 'function' &&
        setTimeout(function () {
          func()
        }, 17)
    })
})(window)

;(function (win) {
  // touch events
  var triggerEvent = function (event, name, params) {
      exparser.triggerEvent(event.target, name, params, {
        originalEvent: event,
        bubbles: !0,
        composed: !0,
        extraFields: {
          touches: event.touches,
          changedTouches: event.changedTouches
        }
      })
    },
    distanceThreshold = 10,
    longtapGapTime = 350,
    wxScrollTimeLowestValue = 50,
    setTouches = function (event, change) {
      event[change ? 'changedTouches' : 'touches'] = [
        {
          identifier: 0,
          pageX: event.pageX,
          pageY: event.pageY,
          clientX: event.clientX,
          clientY: event.clientY,
          screenX: event.screenX,
          screenY: event.screenY,
          target: event.target
        }
      ]
      return event
    },
    isTouchstart = !1,
    oriTimeStamp = 0,
    curX = 0,
    curY = 0,
    curEvent = 0,
    longtapTimer = null,
    isCancletap = !1,
    canceltap = function (node) {
      for (; node; node = node.parentNode) {
        var element = node.__wxElement || node
        if (
          element.__wxScrolling &&
          Date.now() - element.__wxScrolling < wxScrollTimeLowestValue
        ) {
          return !0
        }
      }
      return !1
    },
    triggerLongtap = function () {
      triggerEvent(curEvent, 'longtap', {
        x: curX,
        y: curY
      })
    },
    touchstart = function (event, x, y) {
      if (!oriTimeStamp) {
        oriTimeStamp = event.timeStamp
        curX = x
        curY = y
        if (canceltap(event.target)) {
          longtapTimer = null
          isCancletap = !0
          triggerEvent(event, 'canceltap', {
            x: x,
            y: y
          })
        } else {
          longtapTimer = setTimeout(triggerLongtap, longtapGapTime)
          isCancletap = !1
        }
        curEvent = event
        event.defaultPrevented && (oriTimeStamp = 0)
      }
    },
    touchmove = function (e, x, y) {
      if (oriTimeStamp) {
        if (
          !(Math.abs(x - curX) < distanceThreshold &&
            Math.abs(y - curY) < distanceThreshold)
        ) {
          longtapTimer && (clearTimeout(longtapTimer), (longtapTimer = null))
          isCancletap = !0
          triggerEvent(curEvent, 'canceltap', {
            x: x,
            y: y
          })
        }
      }
    },
    touchend = function (event, x, y, isTouchcancel) {
      if (oriTimeStamp) {
        oriTimeStamp = 0
        longtapTimer && (clearTimeout(longtapTimer), (longtapTimer = null))
        if (isTouchcancel) {
          event = curEvent
          x = curX
          y = curY
        } else {
          if (!isCancletap) {
            triggerEvent(curEvent, 'tap', {
              x: x,
              y: y
            })
            readyAnalyticsReport(curEvent)
          }
        }
      }
    }
  win.addEventListener(
    'scroll',
    function (event) {
      event.target.__wxScrolling = Date.now()
    },
    {
      capture: !0,
      passive: !1
    }
  )
  win.addEventListener(
    'touchstart',
    function (event) {
      isTouchstart = !0
      triggerEvent(event, 'touchstart')
      event.touches.length === 1 &&
        touchstart(event, event.touches[0].pageX, event.touches[0].pageY)
    },
    {
      capture: !0,
      passive: !1
    }
  )
  win.addEventListener(
    'touchmove',
    function (event) {
      triggerEvent(event, 'touchmove')
      event.touches.length === 1 &&
        touchmove(event, event.touches[0].pageX, event.touches[0].pageY)
    },
    {
      capture: !0,
      passive: !1
    }
  )
  win.addEventListener(
    'touchend',
    function (event) {
      triggerEvent(event, 'touchend')
      event.touches.length === 0 &&
        touchend(
          event,
          event.changedTouches[0].pageX,
          event.changedTouches[0].pageY
        )
    },
    {
      capture: !0,
      passive: !1
    }
  )
  win.addEventListener(
    'touchcancel',
    function (event) {
      triggerEvent(event, 'touchcancel')
      touchend(null, 0, 0, !0)
    },
    {
      capture: !0,
      passive: !1
    }
  )
  window.addEventListener('blur', function () {
    touchend(null, 0, 0, !0)
  })
  win.addEventListener(
    'mousedown',
    function (event) {
      if (!isTouchstart && !oriTimeStamp) {
        setTouches(event, !1)
        triggerEvent(event, 'touchstart')
        touchstart(event, event.pageX, event.pageY)
      }
    },
    {
      capture: !0,
      passive: !1
    }
  )
  win.addEventListener(
    'mousemove',
    function (event) {
      if (!isTouchstart && oriTimeStamp) {
        setTouches(event, !1)
        triggerEvent(event, 'touchmove')
        touchmove(event, event.pageX, event.pageY)
      }
    },
    {
      capture: !0,
      passive: !1
    }
  )
  win.addEventListener(
    'mouseup',
    function (event) {
      if (!isTouchstart && oriTimeStamp) {
        setTouches(event, !0)
        triggerEvent(event, 'touchend')
        touchend(event, event.pageX, event.pageY)
      }
    },
    {
      capture: !0,
      passive: !1
    }
  )
  var analyticsConfig = {},
    readyAnalyticsReport = function (event) {
      if (analyticsConfig.selector) {
        for (
          var selector = analyticsConfig.selector, target = event.target;
          target;

        ) {
          if (target.tagName && target.tagName.indexOf('WX-') === 0) {
            var classNames = target.className
              .split(' ')
              .map(function (className) {
                return '.' + className
              })
            ;['#' + target.id]
              .concat(classNames)
              .forEach(function (curSelector) {
                selector.indexOf(curSelector) > -1 &&
                  analyticsReport(target, curSelector)
              })
          }
          target = target.parentNode
        }
      }
    },
    analyticsReport = function (ele, selector) {
      for (var i = 0; i < analyticsConfig.data.length; i++) {
        var curData = analyticsConfig.data[i]
        if (curData.element === selector) {
          var data = {
            eventID: curData.eventID,
            page: curData.page,
            element: curData.element,
            action: curData.action,
            time: Date.now()
          }
          selector.indexOf('.') === 0 &&
            (data.index = Array.prototype.indexOf.call(
              document.body.querySelectorAll(curData.element),
              ele
            ))
          exeWhenWXJSbridgeReady(function () {
            WeixinJSBridge.publish('analyticsReport', {
              data: data
            })
          })
          break
        }
      }
    }
  exeWhenWXJSbridgeReady(function () {
    WeixinJSBridge.subscribe('analyticsConfig', function (params) {
      if (Object.prototype.toString.call(params.data) === '[object Array]') {
        analyticsConfig.data = params.data
        analyticsConfig.selector = []
        analyticsConfig.data.forEach(function (e) {
          e.element && analyticsConfig.selector.push(e.element)
        })
      }
    })
  })
})(window)

require('./behaviors/wx-base')
require('./behaviors/wx-data-component')
require('./behaviors/wx-disabled')
require('./behaviors/wx-group')
require('./behaviors/wx-hover')
require('./behaviors/wx-input-base')
require('./behaviors/wx-item')
require('./behaviors/wx-label-target')
require('./behaviors/wx-mask-Behavior')
require('./behaviors/wx-native')
require('./behaviors/wx-player')
require('./behaviors/wx-touchtrack')

require('./components/wx-button')
require('./components/wx-checkbox')
require('./components/wx-checkbox-Group')
require('./components/wx-icon')
require('./components/wx-image')
require('./components/wx-input')
require('./components/wx-label')
require('./components/wx-loading')
require('./components/wx-mask')
require('./components/wx-navigator')
require('./components/wx-text')
require('./components/wx-view')

window.exparser.registerAsyncComp = function (names, cb) {
  let len = names.length
  names
    .filter(name => {
      if (window.exparser.componentList[name]) {
        checkState()
        return false
      }
      return true
    })
    .map(name => requireAsync(name))

  function checkState (name) {
    len--
    if (len == 0) {
      cb()
    }
  }

  function requireAsync (name) {
    switch (name) {
      case 'wx-map':
        ;(function () {
          var script = document.createElement('script')
          script.async = true
          script.type = 'text/javascript'
          script.src =
            'https://map.qq.com/api/js?v=2.exp&callback=__map_jssdk_init'
          document.body.appendChild(script)
          window.__map_jssdk_id = 0
          window.__map_jssdk_ready = !1
          window.__map_jssdk_callback = []
          window.__map_jssdk_init = function () {
            for (
              window.__map_jssdk_ready = !0;
              window.__map_jssdk_callback.length;

            ) {
              var e = window.__map_jssdk_callback.pop()
              e()
            }
          }
        })()
        require.ensure([], function () {
          require('./components/wx-map')
          checkState()
        })
        break
      case 'wx-canvas':
        require.ensure([], function () {
          require('./components/wx-canvas')
          checkState()
        })
        break
      case 'wx-picker-view':
        require.ensure([], function () {
          require('./components/wx-picker-view')
          checkState()
        })
        break
      case 'wx-picker':
        require.ensure([], function () {
          require('./components/wx-picker')
          checkState()
        })
        break
      case 'wx-picker-view-column':
        require.ensure([], function () {
          require('./components/wx-picker-view-column')
          checkState()
        })
        break
      case 'wx-video':
        require.ensure([], function () {
          require('./components/wx-video')
          checkState()
        })
        break
      case 'wx-radio-group':
        require.ensure([], function () {
          require('./components/wx-radio-group')
          checkState()
        })
        break
      case 'wx-swiper':
        require.ensure([], function () {
          require('./components/wx-swiper')
          checkState()
        })
        break
      case 'wx-modal':
        require.ensure([], function () {
          require('./components/wx-modal')
          checkState()
        })
        break
      case 'wx-switch':
        require.ensure([], function () {
          require('./components/wx-switch')
          checkState()
        })
        break
      case 'wx-toast':
        require.ensure([], function () {
          require('./components/wx-toast')
          checkState()
        })
        break
      case 'wx-radio':
        require.ensure([], function () {
          require('./components/wx-radio')
          checkState()
        })
        break
      case 'wx-scroll-view':
        require.ensure([], function () {
          require('./components/wx-scroll-view')
          checkState()
        })
        break
      case 'wx-textarea':
        require.ensure([], function () {
          require('./components/wx-textarea')
          checkState()
        })
        break
      case 'wx-input':
        require.ensure([], function () {
          require('./components/wx-input')
          checkState()
        })
        break
      case 'wx-contact-button':
        require.ensure([], function () {
          require('./components/wx-contact-button')
          checkState()
        })
        break
      case 'wx-audio':
        require.ensure([], function () {
          require('./components/wx-audio')
          checkState()
        })
        break
      case 'wx-form':
        require.ensure([], function () {
          require('./components/wx-form')
          checkState()
        })
        break
      case 'wx-slider':
        require.ensure([], function () {
          require('./components/wx-slider')
          checkState()
        })
        break
      case 'wx-swiper-item':
        require.ensure([], function () {
          require('./components/wx-swiper-item')
          checkState()
        })
        break
      case 'wx-progress':
        require.ensure([], function () {
          require('./components/wx-progress')
          checkState()
        })
        break
      case 'wx-action-sheet-cancel':
        require.ensure([], function () {
          require('./components/wx-action-sheet-cancel')
          checkState()
        })
        break
      case 'wx-action-sheet':
        require.ensure([], function () {
          require('./components/wx-action-sheet')
          checkState()
        })
        break
      case 'wx-action-sheet-item':
        require.ensure([], function () {
          require('./components/wx-action-sheet-item')
          checkState()
        })
        break
      case 'wx-template':
      case 'wx-div':
      case 'wx-import':
      case 'wx-block':
        checkState()
        break
      default:
        console.log(`Unknown Tag: ${name}`)
        checkState()
        break
    }
  }
}
