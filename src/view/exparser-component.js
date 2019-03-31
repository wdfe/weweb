// 转发 window 上的 animation 和 transition 相关的动画事件到 exparser
// 同步加载的行为和组件
import './behaviors/wx-base'
import './behaviors/wx-data-component'
import './behaviors/wx-disabled'
import './behaviors/wx-group'
import './behaviors/wx-hover'
import './behaviors/wx-input-base'
import './behaviors/wx-item'
import './behaviors/wx-label-target'
import './behaviors/wx-mask-Behavior'
import './behaviors/wx-native'
import './behaviors/wx-player'
import './behaviors/wx-touchtrack'
import './behaviors/wx-positioning-target'

import './components/wx-button'
import './components/wx-checkbox'
import './components/wx-checkbox-Group'
import './components/wx-icon'
import './components/wx-image'
import './components/wx-input'
import './components/wx-label'
import './components/wx-loading'
import './components/wx-mask'
import './components/wx-navigator'
import './components/wx-text'
import './components/wx-view'
import './components/wx-web-view'
import './components/wx-rich-text'
import resolvePath from '../common/resolvePath'
  ;(function (win) {
  var getOpt = function (args) {
    return {
      animationName: args.animationName,
      elapsedTime: args.elapsedTime
    }
  }

  var isWebkit = null
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
  }

  var distanceThreshold = 10

  var longtapGapTime = 350

  var wxScrollTimeLowestValue = 50

  var setTouches = function (event, change) {
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
  }

  var isTouchstart = !1

  var oriTimeStamp = 0

  var curX = 0

  var curY = 0

  var curEvent = 0

  var longtapTimer = null

  var isCancletap = !1

  var canceltap = function (node) {
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
  }

  var triggerLongtap = function () {
    triggerEvent(curEvent, 'longtap', {
      x: curX,
      y: curY
    })
  }

  var touchstart = function (event, x, y) {
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
  }

  var touchmove = function (e, x, y) {
    if (oriTimeStamp) {
      if (
        !(
          Math.abs(x - curX) < distanceThreshold &&
          Math.abs(y - curY) < distanceThreshold
        )
      ) {
        longtapTimer && (clearTimeout(longtapTimer), (longtapTimer = null))
        isCancletap = !0
        triggerEvent(curEvent, 'canceltap', {
          x: x,
          y: y
        })
      }
    }
  }

  var touchend = function (event, x, y, isTouchcancel) {
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
  var analyticsConfig = {}

  var readyAnalyticsReport = function (event) {
    if (analyticsConfig.selector) {
      for (
        var selector = analyticsConfig.selector, target = event.target;
        target;

      ) {
        if (target.tagName && target.tagName.indexOf('WX-') === 0) {
          var classNames = target.className.split(' ').map(function (className) {
            return '.' + className
          })
          ;['#' + target.id].concat(classNames).forEach(function (curSelector) {
            selector.indexOf(curSelector) > -1 &&
              analyticsReport(target, curSelector)
          })
        }
        target = target.parentNode
      }
    }
  }

  var analyticsReport = function (ele, selector) {
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
        WeixinJSBridge.publish('analyticsReport', {
          data: data
        })
        break
      }
    }
  }
  WeixinJSBridge.subscribe('analyticsConfig', function (params) {
    if (Object.prototype.toString.call(params.data) === '[object Array]') {
      analyticsConfig.data = params.data
      analyticsConfig.selector = []
      analyticsConfig.data.forEach(function (e) {
        e.element && analyticsConfig.selector.push(e.element)
      })
    }
  })
})(window)

// 异步加载的组件
window.exparser.registerAsyncComp = function (components, cb) {
  let len = components.length
  components
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

  function handleCustomComponent (tagName) {
    let currPagePath = __curPage__.path
    let currPageConfig = __wxConfig__.window.pages[currPagePath]
    let compName = ~tagName.indexOf('wx-') ? tagName.substring(3) : tagName
    console.log('custom-tag:', compName)
    if (
      currPageConfig.usingComponents &&
      currPageConfig.usingComponents[compName]
    ) {
      let compPath = resolvePath(
        currPagePath,
        currPageConfig.usingComponents[compName]
      )
      loadCustomComponent({ compPath, compName, tagName })
    } else if (
      __wxConfig__.usingComponents &&
      __wxConfig__.usingComponents[compName]
    ) {
      let compPath = resolvePath('/', __wxConfig__.usingComponents[compName])
      loadCustomComponent({ compPath, compName, tagName })
    } else {
      console.log(`Unknown Tag: ${name}`)
      checkState()
    }
  }

  function inlineCss (content, path) {
    content = utils.transformRpx(content, false)
    if (!content) return
    /*
     content = content.split('\n').map(function(value){
     return value==''?value:"#weweb-view-"+self.id+" "+value.replace(/([^\{]+?,)([^\{]+?)/g,"$1#weweb-view-"+self.id+" $2")
     }).join('\n');
     */

    var link = document.createElement('style')
    link.setAttribute('type', 'text/css')
    link.setAttribute('page', path)
    link.appendChild(document.createTextNode(content))
    if (path != './css/app.css') {
      link.id = 'view-css-' + this.id
      link.setAttribute('scoped', '')
      this.el.appendChild(link)
    } else {
      document.querySelector('head').appendChild(link)
    }
  }

  function loadCustomComponent ({ compPath, tagName }) {
    let path = './src' + compPath + '.js'
    fetch(path)
      .then(function (response) {
        return response.text()
      })
      .then(function (res) {
        // console.log(res)
        // if (window.__curPage__ && window.__curPage__.id != self.id) {
        //   // 确保是当前页面
        //   return
        // }
        let resources = res.split('##code-separator##')

        let generateFunc = new Function(
          `
          ${resources[0]}
           return $gwx(".${compPath}.wxml")
          //# sourceURL=${window.location.origin}${compPath}.wxml`
        )

        let comTPL = null
        try {
          comTPL = generateFunc()
          console.log(comTPL)
        } catch (e) {
          console.error(e)
        }

        if (window.__wxCustomComponent) {
          window.__wxCustomComponent[tagName] = comTPL
        } else {
          window.__wxCustomComponent = {
            [tagName]: comTPL
          }
        }

        try {
          // define page service
          let pageScript = new Function(
            `          var __wxRoute = '';
            var __wxRouteBegin = false;
            var Component = function (compDef) {
              // // console.log(compDef)
              if (compDef) {
                compDef.is =  "${tagName}"
                compDef.template = __wxCustomComponent["${tagName}"]
                ComponentRegister.register(compDef)
              }
            }

            ${resources[2]}\n
            require('${compPath.slice(1)}.js')
            //# sourceURL=${
              window.location.origin
            }${compPath}.js`
          )
          pageScript()
        } catch (e) {
          console.error(e)
        }



        if (resources[1]) {
          inlineCss(resources[1], compPath)
        }

        function componentLoaded () {
          checkState()
        }

        if (resources[3]) {
          const deps = JSON.parse(resources[3]).map(name => `wx-${name}`)
          window.exparser.registerAsyncComp(deps, () => {
            componentLoaded()
          })
        } else {
          componentLoaded()
        }
      })
  }

  function requireAsync (name) {
    switch (name) {
      case 'wx-map':
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

        import(/* webpackChunkName: "wx-map" */ './components/wx-map').then(
          checkState
        )
        break
      case 'wx-canvas':
        import(/* webpackChunkName: "wx-canvas" */ './components/wx-canvas').then(
          checkState
        )
        break
      case 'wx-picker-view':
        import(/* webpackChunkName: "wx-picker-view" */ './components/wx-picker-view').then(
          checkState
        )
        break
      case 'wx-picker':
        import(/* webpackChunkName: "wx-picker" */ './components/wx-picker').then(
          checkState
        )
        break
      case 'wx-picker-view-column':
        import(/* webpackChunkName: "wx-picker-view-column" */ './components/wx-picker-view-column').then(
          checkState
        )
        break
      case 'wx-video':
        import(/* webpackChunkName: "wx-video" */ './components/wx-video').then(
          checkState
        )
        break
      case 'wx-radio-group':
        import(/* webpackChunkName: "wx-radio-group" */ './components/wx-radio-group').then(
          checkState
        )
        break
      case 'wx-swiper':
        import(/* webpackChunkName: "wx-swiper" */ './components/wx-swiper').then(
          checkState
        )
        break
      case 'wx-modal':
        import(/* webpackChunkName: "wx-modal" */ './components/wx-modal').then(
          checkState
        )
        break
      case 'wx-switch':
        import(/* webpackChunkName: "wx-switch" */ './components/wx-switch').then(
          checkState
        )
        break
      case 'wx-toast':
        import(/* webpackChunkName: "wx-toast" */ './components/wx-toast').then(
          checkState
        )
        break
      case 'wx-radio':
        import(/* webpackChunkName: "wx-radio" */ './components/wx-radio').then(
          checkState
        )
        break
      case 'wx-scroll-view':
        import(/* webpackChunkName: "wx-scroll-view" */ './components/wx-scroll-view').then(
          checkState
        )
        break
      case 'wx-textarea':
        import(/* webpackChunkName: "wx-textarea" */ './components/wx-textarea').then(
          checkState
        )
        break
      case 'wx-input':
        import(/* webpackChunkName: "wx-input" */ './components/wx-input').then(
          checkState
        )
        break
      case 'wx-contact-button':
        import(/* webpackChunkName: "wx-contact-button" */ './components/wx-contact-button').then(
          checkState
        )
        break
      case 'wx-audio':
        import(/* webpackChunkName: "wx-audio" */ './components/wx-audio').then(
          checkState
        )
        break
      case 'wx-form':
        import(/* webpackChunkName: "wx-form" */ './components/wx-form').then(
          checkState
        )
        break
      case 'wx-slider':
        import(/* webpackChunkName: "wx-slider" */ './components/wx-slider').then(
          checkState
        )
        break
      case 'wx-swiper-item':
        import(/* webpackChunkName: "wx-swiper-item" */ './components/wx-swiper-item').then(
          checkState
        )
        break
      case 'wx-progress':
        import(/* webpackChunkName: "wx-progress" */ './components/wx-progress').then(
          checkState
        )
        break
      case 'wx-action-sheet-cancel':
        import(/* webpackChunkName: "wx-action-sheet-cancel" */ './components/wx-action-sheet-cancel').then(
          checkState
        )
        break
      case 'wx-action-sheet':
        import(/* webpackChunkName: "wx-action-sheet" */ './components/wx-action-sheet').then(
          checkState
        )
        break
      case 'wx-action-sheet-item':
        import(/* webpackChunkName: "wx-action-sheet-item" */ './components/wx-action-sheet-item').then(
          checkState
        )
        break
      case 'wx-template':
      case 'wx-div':
      case 'wx-import':
      case 'wx-include':
      case 'wx-block':
        checkState()
        break
      default:
        handleCustomComponent(name)

        // checkState()
        break
    }
  }
}
