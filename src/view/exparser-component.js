function _toArray (args) {
    return Array.isArray(args) ? args : Array.from(args)
}

function _toCopyArray (args) {
    if (Array.isArray(args)) {
        for (var t = 0, res = new Array(args.length); t < args.length; t++) {
            res[t] = args[t]
        }
        return res
    }
    return Array.from(args)
}

function _defineProperty (obj, key, value) {
    // 重写e[t]值为n
    key in obj
        ? Object.defineProperty(obj, key, {
        value: value,
        enumerable: !0,
        configurable: !0,
        writable: !0
    })
        : (obj[key] = value)
    return obj
}

var _slicedToArray = (function () {
    function sliceForIteratorObj (obj, length) {
        var res = []
        for (var val of obj) {
            res.push(val)
            if (length && res.length === length) break
        }
        return res
    }

    return function (obj, length) {
        if (Array.isArray(obj)) return obj
        if (Symbol.iterator in Object(obj)) return sliceForIteratorObj(obj, length)
        throw new TypeError('Invalid attempt to destructure non-iterable instance')
    }
})()
function exeWhenWXJSbridgeReady (fn) {
    window.__pageFrameEndTime__//首次generateFuncReady加载完毕
        ? fn()
        : document.addEventListener('generateFuncReady', fn)
}

// 转发 window 上的 animation 和 transition 相关的动画事件到 exparser
!(function (win) {
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
!(function (glob) {

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
!(function (window) {
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
})(window),

// touch events
    function(win) {
        var triggerEvent = function(event, name, params) {
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
            setTouches = function(event, change) {
                event[change ? "changedTouches" : "touches"] = [{
                    identifier: 0,
                    pageX: event.pageX,
                    pageY: event.pageY,
                    clientX: event.clientX,
                    clientY: event.clientY,
                    screenX: event.screenX,
                    screenY: event.screenY,
                    target: event.target
                }]
                return event
            },
            isTouchstart = !1,
            oriTimeStamp = 0,
            curX = 0,
            curY = 0,
            curEvent = 0,
            longtapTimer = null,
            isCancletap = !1,
            canceltap = function(node) {
                for (; node; node = node.parentNode) {
                    var element = node.__wxElement || node;
                    if (element.__wxScrolling && Date.now() - element.__wxScrolling < wxScrollTimeLowestValue) return !0
                }
                return !1
            },
            triggerLongtap = function() {
                triggerEvent(curEvent, "longtap", {
                    x: curX,
                    y: curY
                })
            },
            touchstart = function(event, x, y) {
                if(!oriTimeStamp){
                    oriTimeStamp = event.timeStamp
                    curX = x
                    curY = y
                    if(canceltap(event.target)){
                        longtapTimer = null
                        isCancletap = !0
                        triggerEvent(event, "canceltap", {
                            x: x,
                            y: y
                        })
                    }else{
                        longtapTimer = setTimeout(triggerLongtap, longtapGapTime)
                        isCancletap = !1
                    }
                    curEvent = event
                    event.defaultPrevented && (oriTimeStamp = 0)
                }
            },
            touchmove = function(e, x, y) {
                if(oriTimeStamp){
                    if(!(Math.abs(x - curX) < distanceThreshold && Math.abs(y - curY) < distanceThreshold)){
                        longtapTimer && (clearTimeout(longtapTimer), longtapTimer = null)
                        isCancletap = !0
                        triggerEvent(curEvent, "canceltap", {
                            x: x,
                            y: y
                        })
                    }
                }
            },
            touchend = function(event, x, y, isTouchcancel) {
                if(oriTimeStamp){
                    oriTimeStamp = 0
                    longtapTimer && (clearTimeout(longtapTimer), longtapTimer = null)
                    if(isTouchcancel){
                        event = curEvent
                        x = curX
                        y = curY
                    }else{
                        if(!isCancletap){
                            triggerEvent(curEvent, "tap", {
                                x: x,
                                y: y
                            })
                            readyAnalyticsReport(curEvent)
                        }
                    }
                }
            };
        win.addEventListener("scroll", function(event) {
            event.target.__wxScrolling = Date.now()
        }, {
            capture: !0,
            passive: !1
        })
        win.addEventListener("touchstart", function(event) {
            isTouchstart = !0
            triggerEvent(event, "touchstart")
            1 === event.touches.length && touchstart(event, event.touches[0].pageX, event.touches[0].pageY)
        }, {
            capture: !0,
            passive: !1
        })
        win.addEventListener("touchmove", function(event) {
            triggerEvent(event, "touchmove")
            1 === event.touches.length && touchmove(event, event.touches[0].pageX, event.touches[0].pageY)
        }, {
            capture: !0,
            passive: !1
        })
        win.addEventListener("touchend", function(event) {
            triggerEvent(event, "touchend")
            0 === event.touches.length && touchend(event, event.changedTouches[0].pageX, event.changedTouches[0].pageY)
        }, {
            capture: !0,
            passive: !1
        })
        win.addEventListener("touchcancel", function(event) {
            triggerEvent(event, "touchcancel")
            touchend(null, 0, 0, !0)
        }, {
            capture: !0,
            passive: !1
        })
        window.addEventListener("blur", function() {
            touchend(null, 0, 0, !0)
        })
        win.addEventListener("mousedown", function(event) {
            if(!isTouchstart && !oriTimeStamp){
                setTouches(event, !1)
                triggerEvent(event, "touchstart")
                touchstart(event, event.pageX, event.pageY)
            }
        }, {
            capture: !0,
            passive: !1
        })
        win.addEventListener("mousemove", function(event) {
            if(!isTouchstart && oriTimeStamp){
                setTouches(event, !1)
                triggerEvent(event, "touchmove")
                touchmove(event, event.pageX, event.pageY)
            }
        }, {
            capture: !0,
            passive: !1
        })
        win.addEventListener("mouseup", function(event) {
            if(!isTouchstart && oriTimeStamp){
                setTouches(event, !0)
                triggerEvent(event, "touchend")
                touchend(event, event.pageX, event.pageY)
            }
        }, {
            capture: !0,
            passive: !1
        });
        var analyticsConfig = {},
            readyAnalyticsReport = function(event) {
                if (analyticsConfig.selector){
                    for (var selector = analyticsConfig.selector, target = event.target; target;) {
                        if (target.tagName && 0 === target.tagName.indexOf("WX-")) {
                            var classNames = target.className.split(" ").map(function(className) {
                                return "." + className
                            });
                            ["#" + target.id].concat(classNames).forEach(function(curSelector) {
                                selector.indexOf(curSelector) > -1 && analyticsReport(target, curSelector)
                            })
                        }
                        target = target.parentNode
                    }
                }
            },
            analyticsReport = function(ele, selector) {
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
                        0 === selector.indexOf(".") && (data.index = Array.prototype.indexOf.call(document.body.querySelectorAll(curData.element), ele))
                        exeWhenWXJSbridgeReady(function() {
                            WeixinJSBridge.publish("analyticsReport", {
                                data: data
                            })
                        });
                        break
                    }
                }
            };
        exeWhenWXJSbridgeReady(function() {
            WeixinJSBridge.subscribe("analyticsConfig", function(params) {
                if("[object Array]" === Object.prototype.toString.call(params.data)){
                    analyticsConfig.data = params.data
                    analyticsConfig.selector = []
                    analyticsConfig.data.forEach(function(e) {
                        e.element && analyticsConfig.selector.push(e.element)
                    })
                }
            })
        })
    }(window)