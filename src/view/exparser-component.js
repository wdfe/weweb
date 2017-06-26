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
    _isDevTools: function () {
        return true
    },
    debounce: function (id, func, waitTime) {
        var _this = this
        this.__debouncers = this.__debouncers || {}
        this.__debouncers[id] && clearTimeout(this.__debouncers[id])
        this.__debouncers[id] = setTimeout(function () {
            typeof func === 'function' && func()
            _this.__debouncers[id] = void 0
        }, waitTime)
    }
})

// wx-data-Component
window.exparser.registerBehavior({
    is: 'wx-data-Component',
    properties: {
        name: {
            type: String,
            public: !0
        }
    },
    getFormData: function () {
        return this.value || ''
    },
    resetFormData: function () {}
})

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
})

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
    _handleItemValueChanged: function (event) {
        this.renameItem(event.detail.item, event.detail.newVal, event.detail.oldVal)
    },
    _handleItemCheckedChanged: function (event) {
        this.changed(event.detail.item)
    },
    _handleItemAdded: function (event) {
        event.detail.item._relatedGroup = this
        this.addItem(event.detail.item)
        return !1
    },
    _handleItemRemoved: function (event) {
        this.removeItem(event.detail.item)
        return !1
    },
    _handleChangedByTap: function () {
        this.triggerEvent('change', {
            value: this.value
        })
    },
    addItem: function () {},
    removeItem: function () {},
    renameItem: function () {},
    changed: function () {},
    resetFormData: function () {
        if (this.hasBehavior('wx-data-Component')) {
            var checkChilds = function (element) {
                element.childNodes.forEach(function (childNode) {
                    if (
                        childNode instanceof exparser.Element &&
                        !childNode.hasBehavior('wx-group')
                    ) {
                        return childNode.hasBehavior('wx-item')
                            ? void childNode.resetFormData()
                            : void checkChilds(childNode)
                    }
                })
            }
            checkChilds(this)
        }
    }
})

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
    attached: function () {
        this.hover &&
        this.hoverStyle != 'none' &&
        this.hoverClass != 'none' &&
        (this.bindHover(), this._hoverClassChange(this.hoverClass))
    },
    isScrolling: function () {
        for (var ele = this.$$; ele; ele = ele.parentNode) {
            var wxElement = ele.__wxElement || ele
            if (
                wxElement.__wxScrolling &&
                Date.now() - wxElement.__wxScrolling < 50
            ) {
                return !0
            }
        }
        return !1
    },
    detached: function () {
        this.unbindHover()
    },
    _hoverChanged: function (bind, t) {
        bind ? this.bindHover() : this.unbindHover()
    },
    _hoverClassChange: function (className) {
        var classArr = className.split(/\s/)
        this._hoverClass = []
        for (var n = 0; n < classArr.length; n++) {
            classArr[n] && this._hoverClass.push(classArr[n])
        }
    },
    bindHover: function () {
        this._hoverTouchStart = this.hoverTouchStart.bind(this)
        this._hoverTouchEnd = this.hoverTouchEnd.bind(this)
        this._hoverCancel = this.hoverCancel.bind(this)
        this._hoverTouchMove = this.hoverTouchMove.bind(this)
        this.$$.addEventListener('touchstart', this._hoverTouchStart)
        window.__DOMTree__.addListener('canceltap', this._hoverCancel)
        window.addEventListener('touchcancel', this._hoverCancel, !0)
        window.addEventListener('touchmove', this._hoverTouchMove, !0)
        window.addEventListener('touchend', this._hoverTouchEnd, !0)
    },
    unbindHover: function () {
        this.$$.removeEventListener('touchstart', this._hoverTouchStart)
        window.__DOMTree__.removeListener('canceltap', this._hoverCancel)
        window.removeEventListener('touchcancel', this._hoverCancel, !0)
        window.removeEventListener('touchmove', this._hoverTouchMove, !0)
        window.removeEventListener('touchend', this._hoverTouchEnd, !0)
    },
    hoverTouchMove: function (e) {
        this.hoverCancel()
    },
    hoverTouchStart: function (event) {
        var self = this
        if (!this.isScrolling()) {
            this.__touch = !0
            if (
                this.hoverStyle == 'none' ||
                this.hoverClass == 'none' ||
                this.disabled
            );
            else {
                if (event.touches.length > 1) return
                if (window.__hoverElement__) {
                    window.__hoverElement__._hoverReset()
                    window.__hoverElement__ = void 0
                }
                this.__hoverStyleTimeId = setTimeout(function () {
                    self.__hovering = !0
                    window.__hoverElement__ = self
                    if (self._hoverClass && self._hoverClass.length > 0) {
                        for (var e = 0; e < self._hoverClass.length; e++) {
                            self.$$.classList.add(self._hoverClass[e])
                        }
                    } else {
                        self.$$.classList.add(self.is.replace('wx-', '') + '-hover')
                    }
                    self.__touch ||
                    window.requestAnimationFrame(function () {
                        clearTimeout(self.__hoverStayTimeId)
                        self.__hoverStayTimeId = setTimeout(function () {
                            self._hoverReset()
                        }, self.hoverStayTime)
                    })
                }, this.hoverStartTime)
            }
        }
    },
    hoverTouchEnd: function () {
        var self = this
        this.__touch = !1
        if (this.__hovering) {
            clearTimeout(this.__hoverStayTimeId)
            window.requestAnimationFrame(function () {
                self.__hoverStayTimeId = setTimeout(function () {
                    self._hoverReset()
                }, self.hoverStayTime)
            })
        }
    },
    hoverCancel: function () {
        this.__touch = !1
        clearTimeout(this.__hoverStyleTimeId)
        this.__hoverStyleTimeId = void 0
        this._hoverReset()
    },
    _hoverReset: function () {
        if (this.__hovering) {
            this.__hovering = !1
            window.__hoverElement__ = void 0
            if (this.hoverStyle == 'none' || this.hoverClass == 'none');
            else if (this._hoverClass && this._hoverClass.length > 0) {
                for (var e = 0; e < this._hoverClass.length; e++) {
                    this.$$.classList.contains(this._hoverClass[e]) &&
                    this.$$.classList.remove(this._hoverClass[e])
                }
            } else {
                this.$$.classList.remove(this.is.replace('wx-', '') + '-hover')
            }
        }
    }
})

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
    resetFormData: function () {
        this._keyboardShow && ((this.__formResetCallback = !0), wx.hideKeyboard())
        this.value = ''
        this.showValue = ''
    },
    getFormData: function (callback) {
        this._keyboardShow
            ? (this.__formCallback = callback)
            : typeof callback === 'function' && callback(this.value)
    },
    _formGetDataCallback: function () {
        typeof this.__formCallback === 'function' && this.__formCallback(this.value)
        this.__formCallback = void 0
    },
    _focusChange: function (isFocusChange) {
        this._couldFocus(isFocusChange)
        return isFocusChange
    },
    _couldFocus: function (isFocusChange) {
        var self = this
        !this._keyboardShow &&
        this._attached &&
        isFocusChange &&
        ((window.requestAnimationFrame =
            window.requestAnimationFrame ||
            window.mozRequestAnimationFrame ||
            window.webkitRequestAnimationFrame ||
            window.msRequestAnimationFrame), window.requestAnimationFrame
            ? window.requestAnimationFrame(function () {
                self._inputFocus()
            })
            : this._inputFocus())
    },
    _getPlaceholderClass: function (name) {
        return 'input-placeholder ' + name
    },
    _showValueFormate: function (value) {
        this.password || this.type == 'password'
            ? (this.showValue = value ? new Array(value.length + 1).join('●') : '')
            : (this.showValue = value || '')
    },
    _maxlengthChanged: function (length, t) {
        var curVal = this.value.slice(0, length)
        curVal != this.value && (this.value = curVal)
    },
    _showValueChange: function (e) {
        return e
    },
    _placeholderChange: function () {
        this._checkPlaceholderStyle(this.value)
    }
})

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
    valueChange: function (newVal, oldVal) {
        this._relatedGroup &&
        this._relatedGroup.triggerEvent('wxItemValueChanged', {
            item: this,
            newVal: newVal,
            oldVal: oldVal
        })
    },
    checkedChange: function (newVal, oldVal) {
        newVal !== oldVal &&
        this._relatedGroup &&
        this._relatedGroup.triggerEvent('wxItemCheckedChanged', {
            item: this
        })
    },
    changedByTap: function () {
        this._relatedGroup && this._relatedGroup.triggerEvent('wxItemChangedByTap')
    },
    attached: function () {
        this.triggerEvent(
            'wxItemAdded',
            {
                item: this
            },
            {
                bubbles: !0
            }
        )
    },
    moved: function () {
        this._relatedGroup &&
        (this._relatedGroup.triggerEvent(
            'wxItemRemoved'
        ), (this._relatedGroup = null)), this.triggerEvent(
            'wxItemAdded',
            {item: this},
            {bubbles: !0}
        )
    },
    detached: function () {
        this._relatedGroup &&
        (this._relatedGroup.triggerEvent('wxItemRemoved', {
            item: this
        }), (this._relatedGroup = null))
    },
    resetFormData: function () {
        this.checked = !1
    }
})

// wx-label-target
window.exparser.registerBehavior({
    is: 'wx-label-target',
    properties: {},
    handleLabelTap: function (event) {}
})

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
    _getMaskStyle: function (showMask) {
        return showMask ? '' : 'background-color: transparent'
    }
})

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
    _isiOS: function () {//转成h5后，此处统一返回false 不走native的处理方式
        //var ua = window.navigator.userAgent.toLowerCase()
        return false ///iphone/.test(ua)
    },
    _isAndroid: function () {
        //var ua = window.navigator.userAgent.toLowerCase()
        return false ///android/.test(ua)
    },
    _isMobile: function () {
        return this._isiOS() || this._isAndroid()
    },
    _getBox: function () {
        var pos = this.$$.getBoundingClientRect(),
            res = {
                left: pos.left + window.scrollX,
                top: pos.top + window.scrollY,
                width: this.$$.offsetWidth,
                height: this.$$.offsetHeight
            }
        return res
    },
    _diff: function () {
        var pos = this._getBox()
        for (var attr in pos) {
            if (pos[attr] !== this._box[attr]) return !0
        }
        return !1
    },
    _ready: function () {
        this._isReady = !0
        this._deferred.forEach(function (e) {
            this[e.callback].apply(this, e.args)
        }, this)
        this._deferred = []
    },
    hiddenChanged: function (e, t) {
        if (!this._isError) {
            return this._isReady
                ? void this._hiddenChanged(e, t)
                : void this._deferred.push({callback: 'hiddenChanged', args: [e, t]})
        }
    },
    _pageReRenderCallback: function () {
        this._isError ||
        (this._diff() && ((this._box = this._getBox()), this._updatePosition()))
    }
})

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
    _formatTime: function (time) {
        if (time === 1 / 0) return '00:00'
        var hour = Math.floor(time / 3600),
            min = Math.floor((time - 3600 * hour) / 60),
            sencod = time - 3600 * hour - 60 * min
        return hour == 0
            ? (min >= 10 ? min : '0' + min) +
            ':' +
            (sencod >= 10 ? sencod : '0' + sencod)
            : (hour >= 10 ? hour : '0' + hour) +
            ':' +
            (min >= 10 ? min : '0' + min) +
            ':' +
            (sencod >= 10 ? sencod : '0' + sencod)
    },
    _publish: function (eventName, param) {
        this.triggerEvent(eventName, param)
    },
    attached: function () {
        var self = this, playDom = this.$.player, tmpObj = {}
        for (var o in MediaError) {
            tmpObj[MediaError[o]] = o
        }
        playDom.onerror = function (event) {
            event.stopPropagation()
            if (event.srcElement.error) {
                var t = event.srcElement.error.code
                self._publish('error', {
                    errMsg: tmpObj[t]
                })
            }
        }
        playDom.onplay = function (event) {
            self.playing = !0
            event.stopPropagation()
            self._publish('play', {})
            self._buttonType = 'pause'
            typeof self.onPlay === 'function' && self.onPlay(event)
        }
        playDom.onpause = function (event) {
            self.playing = !1
            event.stopPropagation()
            self._publish('pause', {})
            self._buttonType = 'play'
            typeof self.onPause === 'function' && self.onPause(event)
        }
        playDom.onended = function (event) {
            self.playing = !1
            event.stopPropagation()
            self._publish('ended', {})
            typeof self.onEnded === 'function' && self.onEnded(event)
        }
        playDom.tagName == 'AUDIO' &&
        (playDom.onratechange = function (event) {
            event.stopPropagation()
            self._publish('ratechange', {
                playbackRate: playDom.playbackRate
            })
        })
        var prevTime = 0
        playDom.addEventListener('timeupdate', function (event) {
            event.stopPropagation()
            Math.abs(playDom.currentTime - prevTime) % playDom.duration >= 1 &&
            (self._publish('timeupdate', {
                currentTime: playDom.currentTime,
                duration: playDom.duration
            }), (prevTime = 1e3 * playDom.currentTime))
            self._currentTime = self._formatTime(Math.floor(playDom.currentTime))
            typeof self.onTimeUpdate === 'function' && self.onTimeUpdate(event)
        })
        playDom.addEventListener('durationchange', function () {
            playDom.duration === 1 / 0 ? (self.isLive = !0) : (self.isLive = !1)
            NaN !== playDom.duration &&
            self.duration === 0 &&
            (self._duration = self._formatTime(Math.floor(playDom.duration)))
        })
    }
})

// wx-touchtrack
exparser.registerBehavior({
    is: 'wx-touchtrack',
    touchtrack: function (element, handlerName) {
        var that = this,
            startX = 0,
            startY = 0,
            dx = 0,
            dy = 0,
            handleEvent = function (event, state, x, y) {
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
                })
                if (res === !1) return !1
            },
            originalEvent = null
        exparser.addListenerToElement(element, 'touchstart', function (event) {
            if (event.touches.length === 1 && !originalEvent) {
                originalEvent = event
                startX = dx = event.touches[0].pageX
                startY = dy = event.touches[0].pageY
                return handleEvent(event, 'start', startX, startY)
            }
        })
        exparser.addListenerToElement(element, 'touchmove', function (event) {
            if (event.touches.length === 1 && originalEvent) {
                var res = handleEvent(
                    event,
                    'move',
                    event.touches[0].pageX,
                    event.touches[0].pageY
                )
                dx = event.touches[0].pageX
                dy = event.touches[0].pageY
                return res
            }
        })
        exparser.addListenerToElement(element, 'touchend', function (event) {
            if (event.touches.length === 0 && originalEvent) {
                originalEvent = null
                return handleEvent(
                    event,
                    'end',
                    event.changedTouches[0].pageX,
                    event.changedTouches[0].pageY
                )
            }
        })
        exparser.addListenerToElement(element, 'touchcancel', function (event) {
            if (event.touches.length === 0 && originalEvent) {
                var t = originalEvent
                originalEvent = null
                return handleEvent(event, 'end', t.touches[0].pageX, t.touches[0].pageY)
            }
        })
    }
})

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
    cancel: function (e) {
        this.hide()
        return !1
    },
    hide: function () {
        this.triggerEvent('change')
    },
    hiddenChange: function (hidd) {
        var mask = this.$.mask
        if (hidd) {
            setTimeout(function () {
                mask.style.display = 'none'
            }, 300)
            mask.style.backgroundColor = 'rgba(0,0,0,0)'
        } else {
            mask.style.display = 'block'
            mask.focus()
            mask.style.backgroundColor = 'rgba(0,0,0,0.6)'
        }
    }
})

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
    handleMiddleTap: function (e) {
        return !1
    },
    handleCancelTap: function (e) {
        this.triggerEvent('actionSheetCancel', void 0, {
            bubbles: !0
        })
    }
})

// wx-action-sheet-item
window.exparser.registerElement({
    is: 'wx-action-sheet-item',
    template: '\n    <slot></slot>\n  ',
    properties: {},
    behaviors: ['wx-base']
})

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
    _reset: function () {
        ;(this._buttonType = 'play'), (this._currentTime =
            '00:00'), (this._duration = '00:00')
    },
    _readySrc: function () {
        this._canSrc = !0
        this.srcChanged(this._deferredSrc)
        this._deferredSrc = ''
    },
    _readyAction: function () {
        var self = this
        this._canAction = !0
        this._deferredAction.forEach(function (t) {
            self.actionChanged(t)
        }, this)
        this._deferredAction = []
    },
    srcChanged: function (src, t) {
        if (src) {
            clearTimeout(this._srcTimer)
            this._canAction = !1
            this.$.player.src = src
            var self = this
            this._srcTimer = setTimeout(function () {
                self._reset()
                self._readyAction()
            }, 0)
        }
    },
    posterChanged: function (url, t) {
        this.$.poster.style.backgroundImage = "url('" + url + "')"
    },
    controlsChanged: function (show, t) {
        this.$.default.style.display = show ? '' : 'none'
    },
    actionChanged: function (act, t) {
        var self = this
        if (act) {
            var method = act.method
            this.action = act
            if (!this._canAction && method !== 'setSrc') {
                return void this._deferredAction.push(act)
            }
            var pattern = null
            if ((pattern = /^set([a-z|A-Z]*)/.exec(method)) != null) {
                var mkey = pattern[1], data = act.data
                mkey = mkey[0].toLowerCase() + mkey.slice(1)
                mkey == 'currentTime'
                    ? this.$.player.readyState === 0 || this.$.player.readyState === 1
                    ? !(function () {
                        var fn = function () {
                            self.$.player[mkey] = data
                            self.$.player.removeEventListener('canplay', fn, !1)
                        }
                        self.$.player.addEventListener('canplay', fn, !1)
                    })()
                    : (this.$.player[mkey] = data)
                    : mkey === 'src'
                    ? this.srcChanged(data)
                    : this.triggerEvent('error', {
                        errMsg: method + ' is not an action'
                    })
            } else if (method == 'play' || method == 'pause') {
                if (this.isBackground === !0 && method === 'play') return
                this.$.fakebutton.click()
            } else {
                this.triggerEvent('error', {
                    errMsg: method + ' is not an action'
                })
            }
            this.action = null
        }
    },
    attached: function () {
        var self = this, player = this.$.player
        this.$.button.onclick = function (e) {
            e.stopPropagation()
            self.action = {
                method: self._buttonType
            }
        }
        this.$.fakebutton.onclick = function (event) {
            event.stopPropagation()
            self.action &&
            typeof player[self.action.method] === 'function' &&
            player[self.action.method]()
        }
        WeixinJSBridge.subscribe('audio_' + this.id + '_actionChanged', function (
            t
        ) {
            self.action = t
        })
        WeixinJSBridge.publish('audioInsert', {
            audioId: this.id
        })
        wx.onAppEnterBackground(function (t) {
            self.$.player.pause()
            self.isBackground = !0
        })
        wx.onAppEnterForeground(function (t) {
            self.isBackground = !1
        })
    }
})

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
    _preventTapOnDisabled: function () {
        if (this.disabled) return !1
    },
    _onThisTap: function () {
        this.formType === 'submit'
            ? this.triggerEvent('formSubmit', void 0, {bubbles: !0})
            : this.formType === 'reset' &&
            this.triggerEvent('formReset', void 0, {bubbles: !0})
    },
    handleLabelTap: function (event) {
        exparser.triggerEvent(this.shadowRoot, 'tap', event.detail, {
            bubbles: !0,
            composed: !0,
            extraFields: {
                touches: event.touches,
                changedTouches: event.changedTouches
            }
        })
    }
})

var touchEventNames = [
        'touchstart',
        'touchmove',
        'touchend',
        'touchcancel',
        'longtap'
    ],
    touchEventMap = {
        touchstart: 'onTouchStart',
        touchmove: 'onTouchMove',
        touchend: 'onTouchEnd',
        touchcancel: 'onTouchCancel',
        longtap: 'onLongPress'
    },
    LONG_PRESS_TIME_THRESHOLD = 300,
    LONG_PRESS_DISTANCE_THRESHOLD = 5,
    format = function (obj, method, arr, key) {
        arr = Array.prototype.slice.call(arr)
        var res =
            obj +
            '.' +
            method +
            '(' +
            arr
            .map(function (val) {
                return typeof val === 'string' ? "'" + val + "'" : val
            })
            .join(', ') +
            ')'
        key && (res = key + ' = ' + res)
        return res
    },
    resolveColor = function (color) {
        var arr = color.slice(0)
        arr[3] = arr[3] / 255
        return 'rgba(' + arr.join(',') + ')'
    },
    getCanvasTouches = function (args) {
        var self = this
        return [].concat(_toCopyArray(args)).map(function (e) {
            return {
                identifier: e.identifier,
                x: e.pageX - self._box.left,
                y: e.pageY - self._box.top
            }
        })
    },
    calcDistance = function (end, start) {
        var dx = end.x - start.x, dy = end.y - start.y
        return dx * dx + dy * dy
    }

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
    _updatePosition: function () {
        this.$.canvas.width = this._box.width
        this.$.canvas.height = this._box.height
        this._isMobile()
            ? WeixinJSBridge.invoke(
            'updateCanvas',
            {
                canvasId: this._canvasNumber,
                position: this._box
            },
            function (e) {}
        )
            : this.actionsChanged(this.actions)
    },
    attached: function () {
        var self = this
        this._images = {}
        this._box = this._getBox()
        this.$.canvas.width = this.$$.offsetWidth
        this.$.canvas.height = this.$$.offsetHeight
        if (!this.canvasId) {
            this.triggerEvent('error', {
                errMsg: 'canvas-id attribute is undefined'
            })
            this._isError = !0
            return void (this.$$.style.display = 'none')
        }
        window.__canvasNumbers__ = window.__canvasNumbers__ || {}
        var canvasId = window.__webviewId__ + 'canvas' + this.canvasId
        return window.__canvasNumbers__.hasOwnProperty(canvasId)
            ? (this.triggerEvent('error', {
                errMsg: 'canvas-id ' +
                self.canvasId +
                ' in this page has already existed'
            }), (this._isError = !0), void (this.$$.style.display = 'none'))
            : ((window.__canvasNumber__ =
                window.__canvasNumber__ || 1e5), (window.__canvasNumbers__[canvasId] =
                window.__canvasNumber__ +
                __webviewId__), (window.__canvasNumber__ += 1e5), (this._canvasNumber =
                window.__canvasNumbers__[canvasId]), void (this._isMobile()
                ? !(function () {
                    self._isReady = !1
                    var eventObj = {
                            target: {
                                target: self.$$.id,
                                dataset: self.dataset,
                                offsetTop: self.$$.offsetTop,
                                offsetLeft: self.$$.offsetLeft
                            },
                            startTime: +new Date()
                        },
                        gesture = !1
                    touchEventNames.forEach(function (eventKey) {
                        self['bind' + eventKey] &&
                        ((eventObj[touchEventMap[eventKey]] =
                            self['bind' + eventKey]), (gesture = !0))
                    })
                    WeixinJSBridge.invoke(
                        'insertCanvas',
                        {
                            data: JSON.stringify({
                                type: 'canvas',
                                webviewId: window.__webviewId__,
                                canvasNumber: self._canvasNumber
                            }),
                            gesture: gesture,
                            canvasId: self._canvasNumber,
                            position: self._box,
                            hide: self.hidden,
                            disableScroll: self.disableScroll
                        },
                        function (e) {
                            WeixinJSBridge.publish('canvasInsert', {
                                canvasId: self.canvasId,
                                canvasNumber: self._canvasNumber,
                                data: eventObj
                            })
                            self._ready()
                            document.addEventListener(
                                'pageReRender',
                                self._pageReRenderCallback.bind(self)
                            )
                        }
                    )
                })()
                : (WeixinJSBridge.publish('canvasInsert', {
                    canvasId: self.canvasId,
                    canvasNumber: self._canvasNumber
                }), WeixinJSBridge.subscribe(
                    'canvas' + self._canvasNumber + 'actionsChanged',
                    function (params) {
                        var actions = params.actions, reserve = params.reserve
                        self.actions = actions
                        self.actionsChanged(actions, reserve)
                    }
                ), WeixinJSBridge.subscribe(
                    'invokeCanvasToDataUrl_' + self._canvasNumber,
                    function () {
                        var dataUrl = self.$.canvas.toDataURL()
                        WeixinJSBridge.publish(
                            'onCanvasToDataUrl_' + self._canvasNumber,
                            {
                                dataUrl: dataUrl
                            }
                        )
                    }
                ), self._ready(), document.addEventListener(
                    'pageReRender',
                    self._pageReRenderCallback.bind(self)
                ), this.addTouchEventForWebview())))
    },
    detached: function () {
        var canvasId = __webviewId__ + 'canvas' + this.canvasId
        delete window.__canvasNumbers__[canvasId]
        this._isMobile() &&
        WeixinJSBridge.invoke(
            'removeCanvas',
            {canvasId: this._canvasNumber},
            function (e) {}
        )
        WeixinJSBridge.publish('canvasRemove', {
            canvasId: this.canvasId,
            canvasNumber: this._canvasNumber
        })
    },
    addTouchEventForWebview: function () {
        var self = this
        touchEventNames.forEach(function (eventName) {
            self.$$.addEventListener(eventName, function (event) {
                var touches = getCanvasTouches.call(self, event.touches),
                    changedTouches = getCanvasTouches.call(self, event.changedTouches)
                self.bindlongtap &&
                ((self._touchInfo = self._touchInfo || {}), (self._disableScroll =
                    self._disableScroll || 0), eventName === 'touchstart'
                    ? changedTouches.forEach(function (curEvent) {
                        ;(self._touchInfo[curEvent.identifier] = {
                        }), (self._touchInfo[curEvent.identifier].x = curEvent.x), (self._touchInfo[curEvent.identifier].y = curEvent.y), (self._touchInfo[curEvent.identifier].timeStamp = event.timeStamp), (self._touchInfo[
                            curEvent.identifier
                            ].handler = setTimeout(function () {
                            if (self._touchInfo.hasOwnProperty(curEvent.identifier)) {
                                ;(self._touchInfo[
                                    curEvent.identifier
                                    ].longPress = !0), ++self._disableScroll
                                var _touches = [], _changedTouches = []
                                for (var ide in self._touchInfo) {
                                    var curTouche = {
                                        identifier: ide,
                                        x: self._touchInfo[ide].x,
                                        y: self._touchInfo[ide].y
                                    }
                                    _touches.push(curTouche)
                                    ide === String(curEvent.identifier) &&
                                    _changedTouches.push(curTouche)
                                }
                                wx.publishPageEvent(self.bindlongtap, {
                                    type: 'bindlongtap',
                                    timeStamp: self._touchInfo[curEvent.identifier]
                                        .timeStamp + LONG_PRESS_TIME_THRESHOLD,
                                    target: {
                                        id: event.target.parentElement.id,
                                        offsetLeft: event.target.offsetLeft,
                                        offsetTop: event.target.offsetTop,
                                        dataset: self.dataset
                                    },
                                    touches: _touches,
                                    changedTouches: _changedTouches
                                })
                            }
                        }, LONG_PRESS_TIME_THRESHOLD))
                    })
                    : eventName === 'touchend' || eventName === 'touchcancel'
                        ? changedTouches.forEach(function (n) {
                            self._touchInfo.hasOwnProperty(n.identifier) ||
                            console.error(
                                'in ' +
                                eventName +
                                ', can not found ' +
                                n.identifier +
                                ' in ' +
                                JSON.stringify(self._touchInfo)
                            ), self._touchInfo[n.identifier].longPress && --self._disableScroll, clearTimeout(self._touchInfo[n.identifier].handler), delete self._touchInfo[n.identifier]
                        })
                        : changedTouches.forEach(function (n) {
                            self._touchInfo.hasOwnProperty(n.identifier) ||
                            console.error(
                                'in ' +
                                eventName +
                                ', can not found ' +
                                n.identifier +
                                ' in ' +
                                JSON.stringify(self._touchInfo)
                            ), calcDistance(self._touchInfo[n.identifier], n) > LONG_PRESS_DISTANCE_THRESHOLD && !self._touchInfo[n.identifier].longPress && clearTimeout(self._touchInfo[n.identifier].handler), (self._touchInfo[n.identifier].x = n.x), (self._touchInfo[n.identifier].y = n.y)
                        })), self['bind' + eventName] &&
                touches.length + changedTouches.length > 0 &&
                wx.publishPageEvent(self['bind' + eventName], {
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
                })
                ;(self.disableScroll || self._disableScroll) &&
                (event.preventDefault(), event.stopPropagation())
            })
        })
    },
    actionsChanged: function (actions) {
        var flag =
            !(arguments.length <= 1 || void 0 === arguments[1]) && arguments[1]
        if (!this._isMobile() && actions) {
            var __canvas = this.$.canvas, ctx = __canvas.getContext('2d')
            if (flag === !1) {
                ctx.fillStyle = '#000000'
                ctx.strokeStyle = '#000000'
                ctx.shadowColor = '#000000'
                ctx.shadowBlur = 0
                ctx.shadowOffsetX = 0
                ctx.shadowOffsetY = 0
                ctx.setTransform(1, 0, 0, 1, 0, 0)
                ctx.clearRect(0, 0, __canvas.width, __canvas.height)
                actions.forEach(function (act) {
                    var self = this, _method = act.method, _data = act.data
                    if (/^set/.test(_method)) {
                        var styleKey = _method[3].toLowerCase() + _method.slice(4),
                            styleVal = void 0
                        if (styleKey === 'fillStyle' || styleKey === 'strokeStyle') {
                            if (_data[0] === 'normal') {
                                styleVal = resolveColor(_data[1])
                            } else if (_data[0] === 'linear') {
                                var _gradient = ctx.createLinearGradient.apply(ctx, _data[1])
                                _data[2].forEach(function (arr) {
                                    var t = arr[0], n = resolveColor(arr[1])
                                    _gradient.addColorStop(t, n)
                                })
                            } else if (_data[0] === 'radial') {
                                var s = _data[1][0],
                                    l = _data[1][1],
                                    c = _data[1][2],
                                    d = [s, l, 0, s, l, c],
                                    _gradient = ctx.createRadialGradient.apply(ctx, d)
                                _data[2].forEach(function (arr) {
                                    var t = arr[0], n = resolveColor(arr[1])
                                    _gradient.addColorStop(t, n)
                                })
                            }
                            ctx[styleKey] = styleVal
                        } else if (styleKey === 'globalAlpha') {
                            ctx[styleKey] = _data[0] / 255
                        } else if (styleKey === 'shadow') {
                            var _keys = [
                                'shadowOffsetX',
                                'shadowOffsetY',
                                'shadowBlur',
                                'shadowColor'
                            ]
                            _data.forEach(function (e, t) {
                                _keys[t] === 'shadowColor'
                                    ? (ctx[_keys[t]] = resolveColor(e))
                                    : (ctx[_keys[t]] = e)
                            })
                        } else {
                            styleKey === 'fontSize'
                                ? (ctx.font = ctx.font.replace(/\d+\.?\d*px/, _data[0] + 'px'))
                                : (ctx[styleKey] = _data[0])
                        }
                    } else {
                        if (_method === 'fillPath' || _method === 'strokePath') {
                            _method = _method.replace(/Path/, '')
                            ctx.beginPath()
                            _data.forEach(function (e) {
                                ctx[e.method].apply(ctx, e.data)
                            })
                            ctx[_method]()
                        } else {
                            if (_method === 'fillText') {
                                ctx.fillText.apply(ctx, _data)
                            } else {
                                if (_method === 'drawImage') {
                                    !(function () {
                                        var _arr = _toArray(_data),
                                            _url = _arr[0],
                                            params = _arr.slice(1)
                                        self._images = self._images || {}
/*
                                        _url = _url.replace(
                                            'wdfile://',
                                            'http://wxfile.open.weixin.qq.com/'
                                        )
*/

                                        if (self._images[_url]) {
                                            ctx.drawImage.apply(
                                                ctx,
                                                [self._images[_url]].concat(_toCopyArray(params))
                                            )
                                        } else {
                                            self._images[_url] = new Image()
                                            self._images[_url].src = _url
                                            self._images[_url].onload = function () {
                                                ctx.drawImage.apply(
                                                    ctx,
                                                    [self._images[_url]].concat(_toCopyArray(params))
                                                )
                                            }
                                        }
                                    })()
                                } else {
                                    ctx[_method].apply(ctx, _data)
                                }
                            }
                        }
                    }
                }, this)
            }
        }
    },
    _hiddenChanged: function (hidden, t) {
        this._isMobile()
            ? ((this.$$.style.display = hidden
            ? 'none'
            : ''), WeixinJSBridge.invoke(
            'updateCanvas',
            {canvasId: this._canvasNumber, hide: hidden},
            function (e) {}
        ))
            : (this.$$.style.display = hidden ? 'none' : '')
    },
    disableScrollChanged: function (disScroll, t) {
        this._isMobile() &&
        WeixinJSBridge.invoke(
            'updateCanvas',
            {
                canvasId: this._canvasNumber,
                disableScroll: disScroll
            },
            function (e) {}
        )
    }
})

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
    _getColor: function (notEmpty, def) {
        return notEmpty ? def : ''
    },
    _inputTap: function () {
        return (
            !this.disabled &&
            ((this.checked = !this.checked), void this.changedByTap())
        )
    },
    handleLabelTap: function () {
        this._inputTap()
    }
})

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
    addItem: function (checkbox) {
        checkbox.checked && this.value.push(checkbox.value)
    },
    removeItem: function (checkbox) {
        if (checkbox.checked) {
            var index = this.value.indexOf(checkbox.value)
            index >= 0 && this.value.splice(index, 1)
        }
    },
    renameItem: function (checkbox, newVal, oldVal) {
        if (checkbox.checked) {
            var index = this.value.indexOf(oldVal)
            index >= 0 && (this.value[index] = newVal)
        }
    },
    changed: function (checkbox) {
        if (checkbox.checked) {
            this.value.push(checkbox.value)
        } else {
            var index = this.value.indexOf(checkbox.value)
            index >= 0 && this.value.splice(index, 1)
        }
    }
})

var MAX_SIZE = 27,
    MIN_SIZE = 18,
    buttonTypes = {
        'default-dark': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABRCAYAAABBuPE1AAAAAXNSR0IArs4c6QAAA1tJREFUeAHtm89rE0EcxZttbA00ePBc8CLkEEMlNId69uKtWKt/gqRevcejeBNRj/aiKNibHpVST4GQ5gc9F/RYEaE1BNLG9y1ZSNXa3eyb7Ya8hWUmuztv5vuZN9nJTnZqSpsIiIAIiIAIiMB4EEiVSqXLnU7neb/fv4Umz41Hs09t5X4qlfqYyWTK1Wr1+6lXOTiRHkBcdaB9HpJzMMQqYrK678bZAG/gxDjrdF7XecTkIapxH87/6pjYYzKQ2ggEBJIA0SQEUiBJBEgycqRAkgiQZORIgSQRIMnIkQJJIkCSkSMFkkSAJCNHCiSJAElGjhRIEgGSjBxJApkm6SRaJp/P9x008CsW2p41m80nSPty5OiE57E29LhQKDw0CYEcHeRxScB8IJARIQ6KzwskB+SxioY2CaZACiSJAElGjhRIEgGSjBwpkCQCJBk5UiBJBEgycqRAkgiQZORIIsh9klaSZGKPybPXKZJEgNSWD77OwsLCop93mXr2TgpgvkMlsfeig8AshrfZbLbsax8eHq75eZdpKox40LUPdMwv6K61Wq1XYfTZ18KNNwDyM55iX2BrD+u12+2Ui8WvnXQ6fader+8MVxZ3HhCvAuJ71xD9uKgg4cT1mZmZcq1WM0fGvhWLxUtHR0dXer3ebey2KHUxrkZQQEYdykG/Ms6C0u12z7rE2XkGyEQMZWeEAgpHmpDbUJ6dnV087+/DgLE6vWwkR9pQxl7GvwzWnbZujMRDgQS8b4jtB+7K9+TCk70camhPT09fy+Vy1wXxJET7FGpC/ndxzhHWXZvTmvAqNiEP5cjwVUxOCYEk9bVACiSJAElGjhRIEgGSTFIc+YUUT+wy+JGyZZUmAiR+ry+jQW+w/4ydxIgVWluxv8YKw7JJJGJCPmIsIxXD5P8+ADwN+sDXJttBKkqEI4M0lHUNwLyE1k3seyxN05k4kBY01pI28eBlEc5s2mfGNpEgDdz29vYuQC4huyGQEQngeeoB3Lnied4jSEV6O2xiHen3AVzZB9AKHhGuIH/gHw+bTjxIH1ij0djAnXwJMHf9Y2FSgRyihTt6E8vJdhPatMNIPw2d/m9WIP/AgzX5PcC06dELgLS1cW1RCFQqFZksCkCVFQEREAEREIHEEvgNdubEHW4rptkAAAAASUVORK5CYII=',
        'default-light': 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAABRCAYAAABBuPE1AAAAAXNSR0IArs4c6QAAAsJJREFUeAHtm71KA0EUhbOijT8o6APY2FgoCFYW9nYK/pSWkvTaig9hrY2iYKmdIOgLWGgrqIUgIpKoIOh6RjMQgpid3bOb3cwZOEyMd86d++UmG3fdUklDBERABERABESgGAQCs80wDIcxbUNzUD9U5FHD5k+gchAET1kVYkEeIOFSVkkzynMIkMsZ5SpZkFUkLHonNjOrAeRA85Np/WxBhmklaKcvQP7Ul8UeurJI4kMOgSS9ygIpkCQCJBt1pECSCJBs1JECSSJAslFHCiSJAMlGHSmQJAIkG3WkQJIIkGzUkQJJIkCyUUcKpBsBXOBLY9zCdB36PRVvMrhtqxjRjZcaUq5xw5trNimDvBNI0ptLBxuBJBEg2agjBZJEgGSjjhRIEgGSjTpSIEkESDbqSIEkESDZqCMFkkSAZKOOJIM0dwJ02si0JtuR5naKThvHtiCci5y2j9Oau+vG5frcKffZGIi2JlNapV5ffiZzpjnieEXcart3jj3MQB8R9xw7zLnOiJmuEDfubE5egD2MQQ8R95wozHnrEbLtIKbX2Zi0ALkHoUloC3qHMhn2M5JRxhtMKrhytxPHzFQbZ11e1rBAXqOgRUA0s5fDfv1JUvwuFk/7DNHAS9KR5q1sbuU1IL0fcUDeg9oztOJ7FzZ2z88/CDQ+0eoxjglDiKkC4merWJffF/1g4wzSBY5LbNFBMg42Lrw6NlYgSS+tQAokiQDJRh0pkCQCJJs8deQFqaZ22JznCeQ8COxDL+0gETOn2eseZPbu38CX/zUo8llz/wg5VAyQs9Aj1HI42PoZCoKj0GUrkn7ScawaEPugo/9gOlr6Gw6IAbQJff0F1F8yMSsHxAWo1gwzpp3fywBxArpphOk3kQTVA+IIdFaHeZrASksBsQfahqZEIyEBQMzTX34Jq9FyERABERABERCBXwLfe8eGVVx752oAAAAASUVORK5CYII='
    }

// wx-contact-button
window.exparser.registerElement({
    is: 'wx-contact-button',
    behaviors: ['wx-base', 'wx-native'],
    template: '\n    <div id="wrapper" class="wx-contact-button-wrapper">\n    </div>\n  ',
    properties: _defineProperty(
        {
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
        },
        'sessionFrom',
        {
            type: String,
            value: 'wxapp',
            public: !0
        }
    ),
    attached: function () {
        var self = this
        this._isMobile()
        if (1) {
            var url = void 0
            url = buttonTypes[this.type]
                ? buttonTypes[this.type]
                : buttonTypes['default-dark']
            this.$.wrapper.style.backgroundImage = "url('" + url + "')"
            this.$.wrapper.addEventListener('click', function () {
                self._isMobile()
                    ? wx.enterContact({
                    sessionFrom: self.sessionFrom,
                    complete: function (e) {
                        console.log(e)
                    }
                })
                    : alert('进入客服会话，sessionFrom: ' + self.sessionFrom)
            })
        } else {
            this._box = this._getBox()
            console.log('insertContactButton', this._box)
            wx.insertContactButton({
                position: this._box,
                buttonType: this.type,
                sessionFrom: this.sessionFrom,
                complete: function (res) {
                    console.log('insertContactButton complete', res)
                    self.contactButtonId = res.contactButtonId
                    document.addEventListener(
                        'pageReRender',
                        self._pageReRender.bind(self),
                        !1
                    )
                }
            })
        }
    },
    detached: function () {
        this._isMobile(), 1
    },
    sizeChanged: function (e, t) {
        this._box = this._getBox()
        this.$.wrapper.style.width = this._box.width + 'px'
        this.$.wrapper.style.height = this._box.height + 'px'
        this._updateContactButton()
    },
    typeChanged: function (e, t) {
        this._isMobile()
        if (1) {
            var url = void 0
            url = buttonTypes[this.type]
                ? buttonTypes[this.type]
                : buttonTypes['default-dark']
            this.$.wrapper.style.backgroundImage = "url('" + url + "')"
        } else {
            this._updateContactButton()
        }
    },
    _updateContactButton: function () {
        this._isMobile(), 1
    },
    _getBox: function () {
        var pos = this.$.wrapper.getBoundingClientRect(), size = this.size
        typeof size !== 'number' && (size = MIN_SIZE)
        size = size > MAX_SIZE ? MAX_SIZE : size
        size = size < MIN_SIZE ? MIN_SIZE : size
        var res = {
            left: pos.left + window.scrollX,
            top: pos.top + window.scrollY,
            width: size,
            height: size
        }
        return res
    },
    _pageReRender: function () {
        this._updateContactButton()
    }
})

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
    resetDfs: function (element) {
        if (element.childNodes) {
            for (var i = 0; i < element.childNodes.length; ++i) {
                var curChild = element.childNodes[i]
                curChild instanceof exparser.Element &&
                (curChild.hasBehavior('wx-data-Component') &&
                curChild.resetFormData(), this.resetDfs(curChild))
            }
        }
    },
    getFormData: function (form, fn) {
        return form.name && form.hasBehavior('wx-data-Component')
            ? form.__domElement.tagName === 'WX-INPUT' ||
            form.__domElement.tagName === 'WX-PICKER' ||
            form.__domElement.tagName === 'WX-TEXTAREA'
                ? form.getFormData(function (e) {
                    fn(e)
                })
                : fn(form.getFormData())
            : fn()
    },
    asyncDfs: function (element, fn) {
        var self = this,
            resFn = function () {
                typeof fn === 'function' && fn()
                fn = void 0
            }
        if (!element.childNodes) {
            return resFn()
        }
        for (
            var length = element.childNodes.length, i = 0;
            i < element.childNodes.length;
            ++i
        ) {
            var curChild = element.childNodes[i]
            curChild instanceof exparser.Element
                ? !(function (form) {
                self.getFormData(form, function (val) {
                    typeof val !== 'undefined' && (self._data[form.name] = val)
                    self.asyncDfs(form, function () {
                        --length == 0 && resFn()
                    })
                })
            })(curChild)
                : --length
        }
        length == 0 && resFn()
    },
    submitHandler: function (event) {
        var self = this,
            _target = {
                id: event.target.__domElement.id,
                dataset: event.target.dataset,
                offsetTop: event.target.__domElement.offsetTop,
                offsetLeft: event.target.__domElement.offsetLeft
            }
        this._data = Object.create(null)
        return this.asyncDfs(this, function () {
            self.reportSubmit
                ? self._isDevTools()
                ? self.triggerEvent('submit', {
                    value: self._data,
                    formId: 'the formId is subscribe mock one',
                    target: _target
                })
                : WeixinJSBridge.invoke('reportSubmitForm', {}, function (e) {
                    self.triggerEvent('submit', {
                        value: self._data,
                        formId: e.formId,
                        target: _target
                    })
                })
                : self.triggerEvent('submit', {value: self._data, target: _target})
        }), !1
    },
    resetHandler: function (event) {
        var _target = {
            id: event.target.__domElement.id,
            dataset: event.target.dataset,
            offsetTop: event.target.__domElement.offsetTop,
            offsetLeft: event.target.__domElement.offsetLeft
        }
        this._data = Object.create(null)
        this.resetDfs(this)
        this.triggerEvent('reset', {target: _target})
        return !1
    }
})

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
})

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
    _publishError: function (errMsg) {
        this.triggerEvent('error', errMsg)
    },
    _ready: function () {
        if (!(this._img && this._img instanceof Image)) {
            this._img = new Image()
            var self = this
            this._img.onerror = function (event) {
                event.stopPropagation()
                var data = {
                    errMsg: 'GET ' + self._img.src + ' 404 (Not Found)'
                }
                self._publishError(data)
            }
            this._img.onload = function (event) {
                event.stopPropagation()
                self.triggerEvent('load', {
                    width: this.width,
                    height: this.height
                })
              if(self.mode === 'widthFix'){
                self.rate = this.width / this.height
                self.$$.style.height = (self.$.div.offsetWidth || self.$$.offsetWidth) / self.rate + 'px'
              }
            }
            document.addEventListener(
                'pageReRender',
                this._pageReRenderCallback.bind(this)
            )
        }
    },
    attached: function () {
        this._ready()
        this.backgroundSizeChanged(this.backgroundSize)
        this.backgroundRepeatChanged(this.backgroundRepeat)
    },
    detached: function () {
        document.removeEventListener(
            'pageReRender',
            this._pageReRenderCallback.bind(this)
        )
    },
    _pageReRenderCallback: function () {
        this.mode === 'widthFix' &&
        typeof this.rate !== 'undefined' &&
        (this.$$.style.height = this.$$.offsetWidth / this.rate + 'px')
    },
    _srcChanged: function (url) {
        this._img.src = url
        this.$.div.style.backgroundImage = "url('" + url + "')"
    },
    srcChanged: function (filePath, t) {
        if (filePath) {
            var ua = (this.$.div, window.navigator.userAgent.toLowerCase()),
                self = this
            this._ready()
            var opts = {
                success: function (e) {
                    self._srcChanged(e.localData)
                },
                fail: function (e) {
                    self._publishError(e)
                }
            }//!/wechatdevtools/.test(ua)
            false && /iphone/.test(ua)
                ? /^(http|https):\/\//.test(filePath) ||
            /^\s*data:image\//.test(filePath)
                ? this._srcChanged(filePath)
                : /^wdfile:\/\//.test(filePath)
                    ? ((opts.filePath = filePath), wx.getLocalImgData(opts))
                    : ((opts.path = filePath), wx.getLocalImgData(opts))
                : false && /android/.test(ua)
                ? /^wdfile:\/\//.test(filePath) ||
                /^(http|https):\/\//.test(filePath) ||
                /^\s*data:image\//.test(filePath)
                    ? this._srcChanged(filePath)
                    : wx.getCurrentRoute({
                        success: function (t) {
                            var n = wx.getRealRoute(t.route, filePath)
                            self._srcChanged(n)
                        }
                    })
                : this._srcChanged(
                    filePath/*.replace(
                        'wdfile://',
                        'http://wxfile.open.weixin.qq.com/'
                    )*/
                )
        }
    },
    _checkMode: function (styleKey) {
        var styles = [
                'scaleToFill',
                'aspectFit',
                'aspectFill',
                'top',
                'bottom',
                'center',
                'left',
                'right',
                'top left',
                'top right',
                'bottom left',
                'bottom right'
            ],
            res = !1,
            i = 0
        for (; i < styles.length; i++) {
            if (styleKey == styles[i]) {
                res = !0
                break
            }
        }
        return res
    },
    modeChanged: function (mode, t) {
        if (!this._checkMode(mode)) {
            return void (this._disableSizePositionRepeat = !1)
        }
        this._disableSizePositionRepeat = !0
        this.$.div.style.backgroundSize = 'auto auto'
        this.$.div.style.backgroundPosition = '0% 0%'
        this.$.div.style.backgroundRepeat = 'no-repeat'
        switch (mode) {
            case 'scaleToFill':
                this.$.div.style.backgroundSize = '100% 100%'
                break
            case 'aspectFit':
                (this.$.div.style.backgroundSize =
                    'contain'), (this.$.div.style.backgroundPosition = 'center center')
                break
            case 'aspectFill':
                (this.$.div.style.backgroundSize =
                    'cover'), (this.$.div.style.backgroundPosition = 'center center')
                break
            case 'widthFix':
                this.$.div.style.backgroundSize = '100% 100%'
                break
            case 'top':
                this.$.div.style.backgroundPosition = 'top center'
                break
            case 'bottom':
                this.$.div.style.backgroundPosition = 'bottom center'
                break
            case 'center':
                this.$.div.style.backgroundPosition = 'center center'
                break
            case 'left':
                this.$.div.style.backgroundPosition = 'center left'
                break
            case 'right':
                this.$.div.style.backgroundPosition = 'center right'
                break
            case 'top left':
                this.$.div.style.backgroundPosition = 'top left'
                break
            case 'top right':
                this.$.div.style.backgroundPosition = 'top right'
                break
            case 'bottom left':
                this.$.div.style.backgroundPosition = 'bottom left'
                break
            case 'bottom right':
                this.$.div.style.backgroundPosition = 'bottom right'
        }
    },
    backgroundSizeChanged: function (value, t) {
        this._disableSizePositionRepeat || (this.$.div.style.backgroundSize = value)
    },
    backgroundPositionChanged: function (value, t) {
        this._disableSizePositionRepeat ||
        (this.$.div.style.backgroundPosition = value)
    },
    backgroundRepeatChanged: function (value, t) {
        this._disableSizePositionRepeat ||
        (this.$.div.style.backgroundRepeat = value)
    }
})

// wx-input if in wechatdevtools
!(function () {
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
        resetFormData: function () {
            this._keyboardShow &&
            ((this.__formResetCallback = !0), wx.hideKeyboard()), (this.value =
                ''), (this.showValue = '')
        },
        getFormData: function (callback) {
            this._keyboardShow
                ? (this.__formCallback = callback)
                : typeof callback === 'function' && callback(this.value)
        },
        _formGetDataCallback: function () {
            typeof this.__formCallback === 'function' &&
            this.__formCallback(this.value), (this.__formCallback = void 0)
        },
        _focusChange: function (getFocus) {
            return this._couldFocus(getFocus), getFocus
        },
        _couldFocus: function (getFocus) {
            var self = this
            this._attached &&
            (!this._keyboardShow && getFocus
                ? window.requestAnimationFrame(function () {
                    self._inputFocus()
                })
                : this._keyboardShow && !getFocus && this.$.input.blur())
        },
        _getPlaceholderClass: function (name) {
            return 'input-placeholder ' + name
        },
        _maxlengthChanged: function (length, t) {
            var vaildVal = this.value.slice(0, length)
            vaildVal != this.value && (this.value = vaildVal)
        },
        _placeholderChange: function () {
            this._checkPlaceholderStyle(this.value)
        },
        attached: function () {
            var self = this
            this._placeholderClassChange(
                this.placeholderClass
            ), this._checkPlaceholderStyle(
                this.value
            ), (this._attached = !0), (this._value = this.value), this.updateInput(), window.__onAppRouteDone &&
            this._couldFocus(
                this.autoFocus || this.focus
            ), (this.__routeDoneId = exparser.addListenerToElement(
                document,
                'routeDone',
                function () {
                    self._couldFocus(self.autoFocus || self.focus)
                }
            )), (this.__setKeyboardValueId = exparser.addListenerToElement(
                document,
                'setKeyboardValue',
                function (event) {
                    if (self._keyboardShow) {
                        var value = event.detail.value, cursor = event.detail.cursor
                        typeof value !== 'undefined' &&
                        ((self._value = value), (self.value = value)), typeof cursor !==
                        'undefined' &&
                        cursor != -1 &&
                        self.$.input.setSelectionRange(cursor, cursor)
                    }
                }
            )), (this.__hideKeyboardId = exparser.addListenerToElement(
                document,
                'hideKeyboard',
                function (t) {
                    self._keyboardShow && self.$.input.blur()
                }
            )), (this.__onDocumentTouchStart = this.onDocumentTouchStart.bind(
                this
            )), (this.__updateInput = this.updateInput.bind(
                this
            )), (this.__inputKeyUp = this._inputKeyUp.bind(
                this
            )), this.$.input.addEventListener(
                'keyup',
                this.__inputKeyUp
            ), document.addEventListener(
                'touchstart',
                this.__onDocumentTouchStart
            ), document.addEventListener('pageReRender', this.__updateInput), (this
                .autoFocus ||
            this.focus) &&
            setTimeout(function () {
                self._couldFocus(self.autoFocus || self.focus)
            }, 500)
        },
        detached: function () {
            document.removeEventListener(
                'pageReRender',
                this.__updateInput
            ), document.removeEventListener(
                'touchstart',
                this.__onDocumentTouchStart
            ), this.$.input.removeEventListener(
                'keyup',
                this.__inputKeyUp
            ), exparser.removeListenerFromElement(
                document,
                'routeDone',
                this.__routeDoneId
            ), exparser.removeListenerFromElement(
                document,
                'hideKeyboard',
                this.__hideKeyboardId
            ), exparser.removeListenerFromElement(
                document,
                'onKeyboardComplete',
                this.__onKeyboardCompleteId
            ), exparser.removeListenerFromElement(
                document,
                'setKeyboardValue',
                this.__setKeyboardValueId
            )
        },
        onDocumentTouchStart: function () {
            this._keyboardShow && this.$.input.blur()
        },
        _getType: function (type, isPswd) {
            return isPswd || type == 'password' ? 'password' : 'text'
        },
        _showValueChange: function (value) {
            this.$.input.value = value
        },
        _inputFocus: function (e) {
            this.disabled ||
            this._keyboardShow ||
            ((this._keyboardShow = !0), this.triggerEvent('focus', {
                value: this.value
            }), this.$.input.focus())
        },
        _inputBlur: function (e) {
            ;(this._keyboardShow = !1), (this.value = this._value), this._formGetDataCallback(), this.triggerEvent(
                'change',
                {value: this.value}
            ), this.triggerEvent('blur', {
                value: this.value
            }), this._checkPlaceholderStyle(this.value)
        },
        _inputKeyUp: function (event) {
            if (event.keyCode == 13) {
                this.triggerEvent('confirm', {value: this._value})
                return void (this.confirmHold ||
                ((this.value = this._value), this.$.input.blur()))
            }
        },
        _inputKey: function (event) {
            var value = event.target.value
            this._value = value
            this._checkPlaceholderStyle(value)
            if (this.bindinput) {
                var target = {
                    id: this.$$.id,
                    dataset: this.dataset,
                    offsetTop: this.$$.offsetTop,
                    offsetLeft: this.$$.offsetLeft
                }
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
                })
            }
            return !1
        },
        updateInput: function () {
            var styles = window.getComputedStyle(this.$$),
                bounds = this.$$.getBoundingClientRect(),
                pos = (['Left', 'Right'].map(function (type) {
                    return (
                        parseFloat(styles['border' + type + 'Width']) +
                        parseFloat(styles['padding' + type])
                    )
                }), ['Top', 'Bottom'].map(function (type) {
                    return (
                        parseFloat(styles['border' + type + 'Width']) +
                        parseFloat(styles['padding' + type])
                    )
                })),
                inputObj = this.$.input,
                height = bounds.height - pos[0] - pos[1]
            height != this.__lastHeight &&
            ((inputObj.style.height = height + 'px'), (inputObj.style.lineHeight =
                height +
                'px'), (this.__lastHeight = height)), (inputObj.style.color =
                styles.color)
            var ele = this.$.placeholder
            ;(ele.style.height =
                bounds.height - pos[0] - pos[1] + 'px'), (ele.style.lineHeight =
                ele.style.height)
        },
        defaultValueChange: function (value, t) {
            this.maxlength > 0 &&
            (value = value.slice(0, this.maxlength)), this._checkPlaceholderStyle(
                value
            ), this._showValueChange(value), (this._value = value)
            return value
        },
        _getPlaceholderStyle: function (placeholderStyle) {
            return placeholderStyle
        },
        _placeholderClassChange: function (className) {
            var classs = className.split(/\s/)
            this._placeholderClass = []
            for (var n = 0; n < classs.length; n++) {
                classs[n] && this._placeholderClass.push(classs[n])
            }
        },
        _checkPlaceholderStyle: function (hide) {
            var phClasss = this._placeholderClass || [],
                placeholderNode = this.$.placeholder
            if (hide) {
                if (
                    this._placeholderShow &&
                    (placeholderNode.classList.remove(
                        'input-placeholder'
                    ), placeholderNode.setAttribute('style', ''), phClasss.length > 0)
                ) {
                    for (var i = 0; i < phClasss.length; i++) {
                        placeholderNode.classList.contains(phClasss[i]) &&
                        placeholderNode.classList.remove(phClasss[i])
                    }
                }
                ;(placeholderNode.style.display =
                    'none'), (this._placeholderShow = !1)
            } else {
                if (
                    !this._placeholderShow &&
                    (placeholderNode.classList.add('input-placeholder'), this
                        .placeholderStyle &&
                    placeholderNode.setAttribute(
                        'style',
                        this.placeholderStyle
                    ), phClasss.length > 0)
                ) {
                    for (var i = 0; i < phClasss.length; i++) {
                        placeholderNode.classList.add(phClasss[i])
                    }
                }
                ;(placeholderNode.style.display =
                    ''), this.updateInput(), (this._placeholderShow = !0)
            }
        }
    })
})()

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
    _handleNode: function (ele, event) {
        return (
            !!(ele instanceof exparser.Element &&
            ele.hasBehavior('wx-label-target')) && (ele.handleLabelTap(event), !0)
        )
    },
    dfs: function (ele, event) {
        if (this._handleNode(ele, event)) return !0
        if (!ele.childNodes) return !1
        for (var idx = 0; idx < ele.childNodes.length; ++idx) {
            if (this.dfs(ele.childNodes[idx], event)) return !0
        }
        return !1
    },
    onTap: function (event) {
        for (
            var target = event.target;
            target instanceof exparser.Element && target !== this;
            target = target.parentNode
        ) {
            if (target.hasBehavior('wx-label-target')) return
        }
        if (this.for) {
            var boundEle = document.getElementById(this.for)
            boundEle && this._handleNode(boundEle.__wxElement, event)
        } else {
            this.dfs(this, event)
        }
    }
})

// wx-loading
window.exparser.registerElement({
    is: 'wx-loading',
    template: '\n    <div class="wx-loading-mask" style$="background-color: transparent;"></div>\n    <div class="wx-loading">\n      <i class="wx-loading-icon"></i><p class="wx-loading-content"><slot></slot></p>\n    </div>\n  ',
    // template: '\n    <div class="wx-loading-mask" style$="background-color: transparent;"></div>\n    <div class="wx-loading">\n      <invoke class="wx-loading-icon"></invoke><p class="wx-loading-content"><slot></slot></p>\n    </div>\n  ',
    behaviors: ['wx-base']
})

// add map sdk
!(function () {
    window.addEventListener('DOMContentLoaded', function () {
        if (window.__wxConfig__.weweb && window.__wxConfig__.weweb.nomap) return
        var script = document.createElement('script')
        script.async = true
        script.type = 'text/javascript'
        script.src = 'https://map.qq.com/api/js?v=2.exp&callback=__map_jssdk_init'
        document.body.appendChild(script)
    })
    window.__map_jssdk_id = 0
    window.__map_jssdk_ready = !1
    window.__map_jssdk_callback = []
    window.__map_jssdk_init = function () {
        for (__map_jssdk_ready = !0; __map_jssdk_callback.length;) {
            var e = __map_jssdk_callback.pop()
            e()
        }
    }
})()

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
    _delay: function (cb, t, n) {
        this._deferred.push({
            callback: cb,
            args: [t, n]
        })
    },
    _update: function (opt, t) {
        ;(opt.mapId = this._mapId), (opt.hide = this.hidden), WeixinJSBridge.invoke(
            'updateMap',
            opt,
            function (e) {}
        )
    },
    _updatePosition: function () {
        this._isMobile() &&
        (this._isiOS() &&
        ((this._box.width = this._box.width || 1), (this._box.height =
            this._box.height || 1)), WeixinJSBridge.invoke(
            'updateMap',
            {
                mapId: this._mapId,
                position: this._box,
                covers: this.covers || []
            },
            function (e) {}
        ))
    },
    _transformPath: function (path, t) {
        return path.map(function (item) {
            var tempObj = {}
            return item.iconPath
                ? (Object.keys(item).forEach(function (itemName) {
                    tempObj[itemName] = item[itemName]
                }), (tempObj.iconPath = wx.getRealRoute(
                    t,
                    tempObj.iconPath
                )), tempObj)
                : item
        })
    },
    _hiddenChanged: function (hide, t) {
        this._isMobile()
            ? ((this.$$.style.display = hide
            ? 'none'
            : ''), WeixinJSBridge.invoke(
            'updateMap',
            {
                mapId: this._mapId,
                hide: hide
            },
            function (e) {}
        ))
            : (this.$$.style.display = hide ? 'none' : '')
    },
    _transformMarkers: function (markers) {
        var selof = this
        return (markers || []).map(function (marker) {
            var tempObj = {}
            return marker
                ? (Object.keys(marker).forEach(function (t) {
                    tempObj[t] = marker[t]
                }), marker.name &&
                (tempObj.title =
                    tempObj.title || tempObj.name), typeof marker.id !==
                'undefined' &&
                selof.bindmarkertap &&
                (tempObj.data = JSON.stringify({
                    markerId: marker.id,
                    bindmarkertap: selof.bindmarkertap
                })), tempObj)
                : tempObj
        })
    },
    _transformControls: function (ctrls) {
        var self = this
        return ctrls.map(function (ctrl) {
            var tempObj = {}
            Object.keys(ctrl).forEach(function (t) {
                tempObj[t] = ctrl[t]
            })
            typeof ctrl.id !== 'undefined' &&
            self.bindcontroltap &&
            ctrl.clickable &&
            (tempObj.data = JSON.stringify({
                controlId: ctrl.id,
                bindcontroltap: self.bindcontroltap
            }))
            return tempObj
        })
    },
    _transformColor: function (hexColor) {
        hexColor.indexOf('#') === 0 && (hexColor = hexColor.substr(1))
        var r = Number('0x' + hexColor.substr(0, 2)),
            g = Number('0x' + hexColor.substr(2, 2)),
            b = Number('0x' + hexColor.substr(4, 2)),
            a = hexColor.substr(6, 2) ? Number('0x' + hexColor.substr(6, 2)) / 255 : 1
        return new qq.maps.Color(r, g, b, a)
    },
    _initFeatures: function () {
        this._mapId &&
        (((this.markers && this.markers.length > 0) ||
        (this.covers && this.covers.length > 0)) &&
        WeixinJSBridge.invoke(
            'addMapMarkers',
            {
                mapId: this._mapId,
                markers: this._transformMarkers(this.markers).concat(this.covers)
            },
            function (e) {}
        ), this.includePoints &&
        this.includePoints.length > 0 &&
        WeixinJSBridge.invoke(
            'includeMapPoints',
            {
                mapId: this._mapId,
                points: this.includePoints
            },
            function (e) {}
        ), this.polyline &&
        this.polyline.length > 0 &&
        WeixinJSBridge.invoke(
            'addMapLines',
            {
                mapId: this._mapId,
                lines: this.polyline
            },
            function (e) {}
        ), this.circles &&
        this.circles.length > 0 &&
        WeixinJSBridge.invoke(
            'addMapCircles',
            {
                mapId: this._mapId,
                circles: this.circles
            },
            function (e) {}
        ), this.controls &&
        this.controls.length > 0 &&
        WeixinJSBridge.invoke(
            'addMapControls',
            {
                mapId: this._mapId,
                controls: this._transformControls(this.controls)
            },
            function (e) {}
        ))
    },
    _insertNativeMap: function () {
        var self = this
        ;(this._box.width = this._box.width || 1), (this._box.height =
            this._box.height || 1)
        var opt = {
            position: this._box,
            centerLongitude: this.longitude,
            centerLatitude: this.latitude,
            scale: this.scale,
            covers: this.covers || [],
            hide: this.hidden,
            showLocation: this.showLocation
        }
        this._canInvokeNewFeature || (opt.markers = this.markers || [])
        WeixinJSBridge.invoke('insertMap', opt, function (res) {
            ;/ok/.test(res.errMsg)
                ? ((self._mapId =
                    res.mapId), self._ready(), self._canInvokeNewFeature &&
                WeixinJSBridge.publish('mapInsert', {
                    domId: self.id,
                    mapId: self._mapId,
                    showLocation: self.showLocation,
                    bindregionchange: self.bindregionchange,
                    bindtap: self.bindtap
                }), (self.__pageReRenderCallback = self._pageReRenderCallback.bind(
                    self
                )), document.addEventListener(
                    'pageReRender',
                    self.__pageReRenderCallback
                ))
                : self.triggerEvent('error', {
                    errMsg: res.errMsg
                })
        })
    },
    _insertIframeMap: function () {
        var self = this,
            map = (this._map = new qq.maps.Map(this.$.map, {
                zoom: this.scale,
                center: new qq.maps.LatLng(this.latitude, this.longitude),
                mapTypeId: qq.maps.MapTypeId.ROADMAP,
                zoomControl: !1,
                mapTypeControl: !1
            })),
            isDragging = !1,
            stopedDragging = !1
        qq.maps.event.addListener(map, 'click', function () {
            self.bindtap && wx.publishPageEvent(self.bindtap, {})
        })
        qq.maps.event.addListener(map, 'drag', function () {
            self.bindregionchange &&
            !isDragging &&
            (wx.publishPageEvent(self.bindregionchange, {
                type: 'begin'
            }), (isDragging = !0), (stopedDragging = !1))
        })
        qq.maps.event.addListener(map, 'dragend', function () {
            isDragging && ((isDragging = !1), (stopedDragging = !0))
        })
        qq.maps.event.addListener(map, 'bounds_changed', function () {
            self.bindregionchange &&
            stopedDragging &&
            (wx.publishPageEvent(self.bindregionchange, {
                type: 'end'
            }), (stopedDragging = !1))
        })
        var mapTitlesLoadedEvent = qq.maps.event.addListener(
            map,
            'tilesloaded',
            function () {
                self._mapId = __map_jssdk_id++
                self._ready()
                WeixinJSBridge.subscribe('doMapAction' + self._mapId, function (res) {
                    if (self._map && self._mapId === res.data.mapId) {
                        if (res.data.method === 'getMapCenterLocation') {
                            var center = self._map.getCenter()
                            WeixinJSBridge.publish('doMapActionCallback', {
                                mapId: self._mapId,
                                callbackId: res.data.callbackId,
                                method: res.data.method,
                                latitude: center.getLat(),
                                longitude: center.getLng()
                            })
                        } else {
                            res.data.method === 'moveToMapLocation' &&
                            self.showLocation &&
                            WeixinJSBridge.invoke('private_geolocation', {}, function (res) {
                                try {
                                    res = JSON.parse(res)
                                } catch (e) {
                                    res = {}
                                }
                                if (res.result && res.result.location) {
                                    var loc = res.result.location
                                    self._posOverlay && self._posOverlay.setMap(null)
                                    self._posOverlay = new self.CustomOverlay(
                                        new qq.maps.LatLng(loc.lat, loc.lng)
                                    )
                                    self._posOverlay.setMap(self._map)
                                    self._map.panTo(new qq.maps.LatLng(loc.lat, loc.lng))
                                }
                            })
                        }
                    }
                })
                WeixinJSBridge.publish('mapInsert', {
                    domId: self.id,
                    mapId: self._mapId,
                    showLocation: self.showLocation,
                    bindregionchange: self.bindregionchange,
                    bindtap: self.bindtap
                })
                qq.maps.event.removeListener(mapTitlesLoadedEvent)
                mapTitlesLoadedEvent = null
            }
        )
        var CustomOverlay = (this.CustomOverlay = function (pos, idx) {
            this.index = idx
            this.position = pos
        })
        CustomOverlay.prototype = new qq.maps.Overlay()
        CustomOverlay.prototype.construct = function () {
            var div = (this.div = document.createElement('div'))
            div.setAttribute(
                'style',
                'width: 32px;height: 32px;background: rgba(31, 154, 228,.3);border-radius: 20px;position: absolute;'
            )
            var div2 = document.createElement('div')
            div2.setAttribute(
                'style',
                'position: absolute;width: 16px;height: 16px;background: white;border-radius: 8px;top: 8px;left: 8px;'
            )
            div.appendChild(div2)
            var div3 = document.createElement('div')
            div3.setAttribute(
                'style',
                'position: absolute;width: 12px;height: 12px;background: rgb(31, 154, 228);border-radius: 6px;top: 2px;left: 2px;'
            )
            div2.appendChild(div3)
            var panes = this.getPanes()
            panes.overlayMouseTarget.appendChild(div)
        }
        CustomOverlay.prototype.draw = function () {
            var projection = this.getProjection(),
                pixInfo = projection.fromLatLngToDivPixel(this.position),
                style = this.div.style
            ;(style.left = pixInfo.x - 16 + 'px'), (style.top = pixInfo.y - 16 + 'px')
        }
        CustomOverlay.prototype.destroy = function () {
            ;(this.div.onclick = null), this.div.parentNode.removeChild(
                this.div
            ), (this.div = null)
        }
    },
    latitudeChanged: function (centerLatitude, t) {
        if (centerLatitude) {
            return this._isReady
                ? void (this._isMobile()
                    ? this._update(
                        {
                            centerLatitude: centerLatitude,
                            centerLongitude: this.longitude
                        },
                        '纬度'
                    )
                    : this._map.setCenter(
                        new qq.maps.LatLng(centerLatitude, this.longitude)
                    ))
                : void this._delay('latitudeChanged', centerLatitude, t)
        }
    },
    longitudeChanged: function (centerLongitude, t) {
        if (centerLongitude) {
            return this._isReady
                ? void (this._isMobile()
                    ? this._update(
                        {
                            centerLatitude: this.latitude,
                            centerLongitude: centerLongitude
                        },
                        '经度'
                    )
                    : this._map.setCenter(
                        new qq.maps.LatLng(this.latitude, centerLongitude)
                    ))
                : void this._delay('longitudeChanged', centerLongitude, t)
        }
    },
    scaleChanged: function () {
        var scale = arguments.length <= 0 || void 0 === arguments[0]
                ? 16
                : arguments[0],
            arg2 = arguments[1]
        if (scale) {
            return this._isReady
                ? void (this._isMobile()
                    ? this._update(
                        {
                            centerLatitude: this.latitude,
                            centerLongitude: this.longitude,
                            scale: scale
                        },
                        '缩放'
                    )
                    : this._map.zoomTo(scale))
                : void this._delay('scaleChanged', scale, arg2)
        }
    },
    coversChanged: function () {
        var self = this,
            arg1 = arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            arg2 = arguments[1]
        return this._isReady
            ? void (this._isMobile()
                ? wx.getCurrentRoute({
                    success: function (n) {
                        self._update(
                            {
                                centerLatitude: self.latitude,
                                centerLongitude: self.longitude,
                                covers: self._transformPath(arg1, n.route)
                            },
                            '覆盖物'
                        )
                    }
                })
                : ((this._covers || []).forEach(function (e) {
                    e.setMap(null)
                }), (this._covers = arg1.map(function (t) {
                    var n = new qq.maps.Marker({
                        position: new qq.maps.LatLng(t.latitude, t.longitude),
                        map: self._map
                    })
                    return t.iconPath &&
                    n.setIcon(new qq.maps.MarkerImage(t.iconPath)), n
                }))))
            : void this._delay('coversChanged', arg1, arg2)
    },
    markersChanged: function () {
        var self = this,
            markerArg = arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            arg2 = arguments[1]
        return this._isReady
            ? void (this._isMobile()
                ? wx.getCurrentRoute({
                    success: function (res) {
                        var markers = self._transformPath(
                            self._transformMarkers(markerArg),
                            res.route
                        )
                        self._canInvokeNewFeature
                            ? WeixinJSBridge.invoke(
                            'addMapMarkers',
                            {
                                mapId: self._mapId,
                                markers: markers
                            },
                            function (e) {}
                        )
                            : self._update({
                            centerLatitude: self.latitude,
                            centerLongitude: self.longitude,
                            markers: markers
                        })
                    }
                })
                : ((this._markers || []).forEach(function (e) {
                    e.setMap(null)
                }), (this._markers = markerArg.map(function (markerItem) {
                    var markerIns = new qq.maps.Marker({
                        position: new qq.maps.LatLng(
                            markerItem.latitude,
                            markerItem.longitude
                        ),
                        map: self._map
                    })
                    return markerItem.iconPath &&
                    (Number(markerItem.width) && Number(markerItem.height)
                        ? markerIns.setIcon(
                            new qq.maps.MarkerImage(
                                markerItem.iconPath,
                                new qq.maps.Size(markerItem.width, markerItem.height),
                                new qq.maps.Point(0, 0),
                                new qq.maps.Point(
                                    markerItem.width / 2,
                                    markerItem.height
                                ),
                                new qq.maps.Size(markerItem.width, markerItem.height)
                            )
                        )
                        : markerIns.setIcon(
                            new qq.maps.MarkerImage(markerItem.iconPath)
                        )), (markerItem.title || markerItem.name) && markerIns.setTitle(markerItem.title || markerItem.name), self.bindmarkertap &&
                    typeof markerItem.id !== 'undefined' &&
                    qq.maps.event.addListener(markerIns, 'click', function (n) {
                        var event = n.event
                        event instanceof TouchEvent
                            ? event.type === 'touchend' &&
                            wx.publishPageEvent(self.bindmarkertap, {
                                markerId: markerItem.id
                            })
                            : wx.publishPageEvent(self.bindmarkertap, {
                            markerId: markerItem.id
                        })
                    }), markerIns
                }))))
            : void this._delay('markersChanged', markerArg, arg2)
    },
    linesChanged: function () {
        var self = this,
            lines = arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            arg2 = arguments[1]
        return this._isReady
            ? void (this._isMobile()
                ? this._canInvokeNewFeature &&
                WeixinJSBridge.invoke(
                    'addMapLines',
                    {
                        mapId: this._mapId,
                        lines: lines
                    },
                    function (e) {}
                )
                : ((this._lines || []).forEach(function (e) {
                    e.setMap(null)
                }), (this._lines = lines.map(function (line) {
                    var path = line.points.map(function (point) {
                        return new qq.maps.LatLng(point.latitude, point.longitude)
                    })
                    return new qq.maps.Polyline({
                        map: self._map,
                        path: path,
                        strokeColor: self._transformColor(line.color) || '',
                        strokeWidth: line.width,
                        strokeDashStyle: line.dottedLine ? 'dash' : 'solid'
                    })
                }))))
            : void this._delay('linesChanged', lines, arg2)
    },
    circlesChanged: function () {
        var self = this,
            circles = arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            arg2 = arguments[1]
        return this._isReady
            ? void (this._isMobile()
                ? this._canInvokeNewFeature &&
                WeixinJSBridge.invoke(
                    'addMapCircles',
                    {
                        mapId: this._mapId,
                        circles: circles
                    },
                    function (e) {}
                )
                : ((this._circles || []).forEach(function (circle) {
                    circle.setMap(null)
                }), (this._circles = circles.map(function (circle) {
                    return new qq.maps.Circle({
                        map: self._map,
                        center: new qq.maps.LatLng(circle.latitude, circle.longitude),
                        radius: circle.radius,
                        fillColor: self._transformColor(circle.fillColor) || '',
                        strokeColor: self._transformColor(circle.color) || '',
                        strokeWidth: circle.strokeWidth
                    })
                }))))
            : void this._delay('circlesChanged', circles, arg2)
    },
    pointsChanged: function () {
        var self = this,
            points = arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            n = arguments[1]
        if (!this._isReady) return void this._delay('pointsChanged', points, n)
        if (this._isMobile()) {
            this._canInvokeNewFeature &&
            WeixinJSBridge.invoke(
                'includeMapPoints',
                {
                    mapId: this._mapId,
                    points: points
                },
                function (e) {}
            )
        } else {
            var i = (function () {
                if (points.length <= 0) {
                    return {
                        v: void 0
                    }
                }
                var LatLngBounds = new qq.maps.LatLngBounds()
                points.forEach(function (point) {
                    LatLngBounds.extend(
                        new qq.maps.LatLng(point.latitude, point.longitude)
                    )
                })
                self._map.fitBounds(LatLngBounds)
            })()
            if (typeof i === 'object') return i.v
        }
    },
    controlsChanged: function () {
        var self = this,
            nCtrl = arguments.length <= 0 || void 0 === arguments[0]
                ? []
                : arguments[0],
            n = arguments[1]
        return this._isReady
            ? void (this._isMobile()
                ? this._canInvokeNewFeature &&
                wx.getCurrentRoute({
                    success: function (res) {
                        var controls = self._transformPath(
                            self._transformControls(nCtrl),
                            res.route
                        )
                        WeixinJSBridge.invoke(
                            'addMapControls',
                            {
                                mapId: self._mapId,
                                controls: controls
                            },
                            function (e) {}
                        )
                    }
                })
                : !(function () {
                    for (
                        var ctrs = (self._controls = self._controls || []);
                        ctrs.length;

                    ) {
                        var ctr = ctrs.pop()
                        ctr.onclick = null
                        ctr.parentNode.removeChild(ctr)
                    }
                    nCtrl.forEach(function (ctr) {
                        var img = document.createElement('img')
                        img.style.position = 'absolute'
                        img.style.left =
                            ((ctr.position && ctr.position.left) || 0) + 'px'
                        img.style.top = ((ctr.position && ctr.position.top) || 0) + 'px'
                        img.style.width =
                            ((ctr.position && ctr.position.width) || '') + 'px'
                        img.style.height =
                            ((ctr.position && ctr.position.height) || '') + 'px'
                        img.style.zIndex = 9999
                        img.src = ctr.iconPath
                        ctr.clickable &&
                        typeof ctr.id !== 'undefined' &&
                        (img.onclick = function () {
                            wx.publishPageEvent(self.bindcontroltap, {
                                controlId: ctr.id
                            })
                        })
                        ctrs.push(img)
                        self.$.map.appendChild(img)
                    })
                })())
            : void this._delay('controlsChanged', nCtrl, n)
    },
    showLocationChanged: function () {
        var self = this,
            location =
                !(arguments.length <= 0 || void 0 === arguments[0]) && arguments[0],
            arg2 = arguments[1]
        return this._isReady
            ? void (this._isMobile()
                ? this._update({
                    showLocation: location
                })
                : (this._posOverlay &&
                (this._posOverlay.setMap(
                    null
                ), (this._posOverlay = null)), location &&
                WeixinJSBridge.invoke('private_geolocation', {}, function (res) {
                    try {
                        res = JSON.parse(res)
                    } catch (e) {
                        res = {}
                    }
                    if (res.result && res.result.location) {
                        var loc = res.result.location
                        ;(self._posOverlay = new self.CustomOverlay(
                            new qq.maps.LatLng(loc.lat, loc.lng)
                        )), self._posOverlay.setMap(self._map)
                    }
                })))
            : void this._delay('showLocationChanged', location, arg2)
    },
    attached: function () {
        return this.latitude > 90 || this.latitude < -90
            ? (console.group(new Date() + ' latitude 字段取值有误'), console.warn(
                '纬度范围 -90 ~ 90'
            ), void console.groupEnd())
            : this.longitude > 180 || this.longitude < -180
                ? (console.group(new Date() + ' longitude 字段取值有误'), console.warn(
                    '经度范围 -180 ~ 180'
                ), void console.groupEnd())
                : ((this._canInvokeNewFeature = !0), (this._box = this._getBox()), void (this._isMobile()
                    ? this._insertNativeMap()
                    : __map_jssdk_ready
                        ? this._insertIframeMap()
                        : __map_jssdk_callback.push(
                            this._insertIframeMap.bind(this)
                        )))
    },
    detached: function () {
        this._isMobile() &&
        (WeixinJSBridge.invoke(
            'removeMap',
            {
                mapId: this._mapId
            },
            function (e) {}
        ), this.__pageReRenderCallback &&
        document.removeEventListener(
            'pageReRender',
            this.__pageReRenderCallback
        ))
    }
})

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
    hiddenChange: function (hide) {
        var mask = this.$.mask
        hide === !0
            ? (setTimeout(function () {
            mask.style.display = 'none'
        }, 300), this.$.mask.classList.add('wx-mask-transparent'))
            : ((mask.style.display = 'block'), mask.focus(), mask.classList.remove(
            'wx-mask-transparent'
        ))
    }
})

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
    _handleConfirm: function () {
        this.triggerEvent('confirm')
    },
    _handleCancel: function () {
        this.triggerEvent('cancel')
    }
})

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
    navigateTo: function () {
        if (!this.url) {
            return void console.error('navigator should have url attribute')
        }
        if (this.redirect) {
            return void wx.redirectTo({
                url: this.url
            })
        }
        switch (this.openType) {
            case 'navigate':
                return void wx.navigateTo({
                    url: this.url
                })
            case 'redirect':
                return void wx.redirectTo({
                    url: this.url
                })
            case 'switchTab':
                return void wx.switchTab({
                    url: this.url
                })
            default:
                return void console.error(
                    'navigator: invalid openType ' + this.openType
                )
        }
    }
})

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
    resetFormData: function () {
        this.mode == 'selector' ? (this.value = -1) : (this.value = '')
    },
    getFormData: function (formCallback) {
        this.__pickerShow
            ? (this.__formCallback = formCallback)
            : typeof formCallback === 'function' && formCallback(this.value)
    },
    formGetDataCallback: function () {
        typeof this.__formCallback === 'function' && this.__formCallback(this.value)
        this.__formCallback = void 0
    },
    showPickerView: function () {
        this.mode == 'date' || this.mode == 'time'
            ? this.showDatePickerView()
            : this.mode === 'selector' && this.showSelector()
    },
    getCustomerStyle: function () {
        var customerStyle = this.$.wrapper.getBoundingClientRect()
        return {
            width: customerStyle.width,
            height: customerStyle.height,
            left: customerStyle.left + window.scrollX,
            top: customerStyle.top + window.scrollY
        }
    },
    showSelector: function (e) {
        var that = this
        if (!this.disabled) {
            var _value = parseInt(this.value)
            ;(isNaN(_value) || _value >= this.range.length) && (_value = 0)

            var pickerData = []
            if (this.rangeKey) {
                for (var idx = 0; idx < this.range.length; idx++) {
                    var r = this.range[idx]
                    pickerData.push(r[this.rangeKey] + '')
                }
            } else {
                for (var o = 0; o < this.range.length; o++) {
                    pickerData.push(this.range[o] + '')
                }
            }

            WeixinJSBridge.invoke(
                'showPickerView',
                {
                    array: pickerData,
                    current: _value,
                    style: this.getCustomerStyle()
                },
                function (res) {
                    ;/:ok/.test(res.errMsg) &&
                    ((that.value = res.index), that.triggerEvent('change', {
                        value: that.value
                    }))
                    that.resetPickerState()
                    that.formGetDataCallback()
                }
            )

            this.__pickerShow = !0
        }
    },
    showDatePickerView: function () {
        var _this = this
        if (!this.disabled) {
            WeixinJSBridge.invoke(
                'showDatePickerView',
                {
                    range: {
                        start: this.start,
                        end: this.end
                    },
                    mode: this.mode,
                    current: this.value,
                    fields: this.fields,
                    style: this.getCustomerStyle()
                },
                function (t) {
                    ;/:ok/.test(t.errMsg) &&
                    ((_this.value = t.value), _this.triggerEvent('change', {
                        value: _this.value
                    }))
                    _this.resetPickerState()
                    _this.formGetDataCallback()
                }
            )
            this.__pickerShow = !0
        }
    },
    resetPickerState: function () {
        this.__pickerShow = !1
    }
})

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
    attached: function () {
        this._initColumns()
    },
    _initColumns: function () {
        var _this = this,
            columns = (this._columns = []),
            getColumns = function getColumns (rootNode) {
                for (var i = 0; i < rootNode.childNodes.length; i++) {
                    var node = rootNode.childNodes[i]
                    node instanceof exparser.Element &&
                    (node.hasBehavior('wx-picker-view-column')
                        ? columns.push(node)
                        : getColumns(node))
                }
            }

        getColumns(this)
        var _value = Array.isArray(this.value) ? this.value : []
        columns.forEach(function (col, idx) {
            col._setStyle(_this.indicatorStyle)
            col._setHeight(_this.$$.offsetHeight)
            col._setCurrent(_value[idx] || 0), col._init()
        })
    },
    _columnValueChanged: function () {
        var values = this._columns.map(function (column) {
            return column._getCurrent()
        })
        this.triggerEvent('change', {
            value: values
        })
    },
    _valueChanged: function () {
        var e = arguments.length <= 0 || void 0 === arguments[0] ? [] : arguments[0]
        ;(this._columns || []).forEach(function (column, n) {
            column._setCurrent(e[n] || 0)
            column._update()
        })
    }
})

// wx-picker-view-column
!(function () {
    function _Animation (model, t, n) {
        function i (t, n, o, r) {
            if (!t || !t.cancelled) {
                o(n)
                var a = model.done()
                a ||
                t.cancelled ||
                (t.id = requestAnimationFrame(i.bind(null, t, n, o, r))), a &&
                r &&
                r(n)
            }
        }

        function cancelAnimation (e) {
            e && e.id && cancelAnimationFrame(e.id)
            e && (e.cancelled = !0)
        }

        var r = {
            id: 0,
            cancelled: !1
        }

        i(r, model, t, n)

        return {
            cancel: cancelAnimation.bind(null, r),
            model: model
        }
    }

    function Friction (drag) {
        this._drag = drag
        this._dragLog = Math.log(drag)
        this._x = 0
        this._v = 0
        this._startTime = 0
    }

    function n (e, t, n) {
        return e > t - n && e < t + n
    }

    function i (e, t) {
        return n(e, 0, t)
    }

    function Spring (m, k, c) {
        this._m = m
        this._k = k
        this._c = c
        this._solution = null
        this._endPosition = 0
        this._startTime = 0
    }

    function Scroll (extent) {
        this._extent = extent
        this._friction = new Friction(0.01)
        this._spring = new Spring(1, 90, 20)
        this._startTime = 0
        this._springing = !1
        this._springOffset = 0
    }

    function Handler (element, current, itemHeight) {
        this._element = element
        this._extent =
            this._element.offsetHeight - this._element.parentElement.offsetHeight
        var disY = -current * itemHeight
        disY > 0 ? (disY = 0) : disY < -this._extent && (disY = -this._extent)
        this._position = disY
        this._scroll = new Scroll(this._extent)
        this._onTransitionEnd = this.onTransitionEnd.bind(this)
        this._itemHeight = itemHeight
        var transform = 'translateY(' + disY + 'px)'
        this._element.style.webkitTransform = transform
        this._element.style.transform = transform
    }

    Friction.prototype.set = function (x, v) {
        this._x = x
        this._v = v
        this._startTime = new Date().getTime()
    }
    Friction.prototype.x = function (e) {
        void 0 === e && (e = (new Date().getTime() - this._startTime) / 1e3)
        var t
        return (t = e === this._dt && this._powDragDt
            ? this._powDragDt
            : (this._powDragDt = Math.pow(this._drag, e))), (this._dt = e), this._x +
        this._v * t / this._dragLog -
        this._v / this._dragLog
    }
    Friction.prototype.dx = function (e) {
        void 0 === e && (e = (new Date().getTime() - this._startTime) / 1e3)
        var t
        return (t = e === this._dt && this._powDragDt
            ? this._powDragDt
            : (this._powDragDt = Math.pow(this._drag, e))), (this._dt = e), this._v *
        t
    }
    Friction.prototype.done = function () {
        return Math.abs(this.dx()) < 3
    }
    Friction.prototype.reconfigure = function (e) {
        var t = this.x(), n = this.dx()
        ;(this._drag = e), (this._dragLog = Math.log(e)), this.set(t, n)
    }
    Friction.prototype.configuration = function () {
        var e = this
        return [
            {
                label: 'Friction',
                read: function () {
                    return e._drag
                },
                write: function (t) {
                    e.reconfigure(t)
                },
                min: 0.001,
                max: 0.1,
                step: 0.001
            }
        ]
    }
    var s = 0.1
    Spring.prototype._solve = function (e, t) {
        var n = this._c, i = this._m, o = this._k, r = n * n - 4 * i * o
        if (r == 0) {
            var a = -n / (2 * i), s = e, l = t / (a * e)
            return {
                x: function (e) {
                    return (s + l * e) * Math.pow(Math.E, a * e)
                },
                dx: function (e) {
                    var t = Math.pow(Math.E, a * e)
                    return a * (s + l * e) * t + l * t
                }
            }
        }
        if (r > 0) {
            var c = (-n - Math.sqrt(r)) / (2 * i),
                d = (-n + Math.sqrt(r)) / (2 * i),
                l = (t - c * e) / (d - c),
                s = e - l
            return {
                x: function (e) {
                    var t, n
                    return e === this._t &&
                    ((t = this._powER1T), (n = this._powER2T)), (this._t = e), t ||
                    (t = this._powER1T = Math.pow(Math.E, c * e)), n ||
                    (n = this._powER2T = Math.pow(Math.E, d * e)), s * t + l * n
                },
                dx: function (e) {
                    var t, n
                    return e === this._t &&
                    ((t = this._powER1T), (n = this._powER2T)), (this._t = e), t ||
                    (t = this._powER1T = Math.pow(Math.E, c * e)), n ||
                    (n = this._powER2T = Math.pow(Math.E, d * e)), s * c * t + l * d * n
                }
            }
        }
        var u = Math.sqrt(4 * i * o - n * n) / (2 * i),
            a = -(n / 2 * i),
            s = e,
            l = (t - a * e) / u
        return {
            x: function (e) {
                return (
                    Math.pow(Math.E, a * e) * (s * Math.cos(u * e) + l * Math.sin(u * e))
                )
            },
            dx: function (e) {
                var t = Math.pow(Math.E, a * e),
                    n = Math.cos(u * e),
                    i = Math.sin(u * e)
                return t * (l * u * n - s * u * i) + a * t * (l * i + s * n)
            }
        }
    }
    Spring.prototype.x = function (e) {
        return void 0 == e &&
        (e = (new Date().getTime() - this._startTime) / 1e3), this._solution
            ? this._endPosition + this._solution.x(e)
            : 0
    }
    Spring.prototype.dx = function (e) {
        return void 0 == e &&
        (e = (new Date().getTime() - this._startTime) / 1e3), this._solution
            ? this._solution.dx(e)
            : 0
    }
    Spring.prototype.setEnd = function (e, t, n) {
        if ((n || (n = new Date().getTime()), e != this._endPosition || !i(t, s))) {
            t = t || 0
            var o = this._endPosition
            this._solution &&
            (i(t, s) &&
            (t = this._solution.dx(
                (n - this._startTime) / 1e3
            )), (o = this._solution.x((n - this._startTime) / 1e3)), i(t, s) &&
            (t = 0), i(o, s) && (o = 0), (o += this._endPosition)), (this
                ._solution &&
            i(o - e, s) &&
            i(t, s)) ||
            ((this._endPosition = e), (this._solution = this._solve(
                o - this._endPosition,
                t
            )), (this._startTime = n))
        }
    }
    Spring.prototype.snap = function (e) {
        ;(this._startTime = new Date().getTime()), (this._endPosition = e), (this._solution = {
            x: function () {
                return 0
            },
            dx: function () {
                return 0
            }
        })
    }
    Spring.prototype.done = function (e) {
        return e || (e = new Date().getTime()), n(this.x(), this._endPosition, s) &&
        i(this.dx(), s)
    }
    Spring.prototype.reconfigure = function (e, t, n) {
        ;(this._m = e), (this._k = t), (this._c = n), this.done() ||
        ((this._solution = this._solve(
            this.x() - this._endPosition,
            this.dx()
        )), (this._startTime = new Date().getTime()))
    }
    Spring.prototype.springConstant = function () {
        return this._k
    }
    Spring.prototype.damping = function () {
        return this._c
    }
    Spring.prototype.configuration = function () {
        function e (e, t) {
            e.reconfigure(1, t, e.damping())
        }

        function t (e, t) {
            e.reconfigure(1, e.springConstant(), t)
        }

        return [
            {
                label: 'Spring Constant',
                read: this.springConstant.bind(this),
                write: e.bind(this, this),
                min: 100,
                max: 1e3
            },
            {
                label: 'Damping',
                read: this.damping.bind(this),
                write: t.bind(this, this),
                min: 1,
                max: 500
            }
        ]
    }
    Scroll.prototype.snap = function (e, t) {
        ;(this._springOffset = 0), (this._springing = !0), this._spring.snap(
            e
        ), this._spring.setEnd(t)
    }
    Scroll.prototype.set = function (e, t) {
        this._friction.set(e, t)
        if (e > 0 && t >= 0) {
            ;(this._springOffset = 0), (this._springing = !0), this._spring.snap(
                e
            ), this._spring.setEnd(0)
        } else {
            e < -this._extent && t <= 0
                ? ((this._springOffset = 0), (this._springing = !0), this._spring.snap(
                e
            ), this._spring.setEnd(-this._extent))
                : (this._springing = !1), (this._startTime = new Date().getTime())
        }
    }
    Scroll.prototype.x = function (e) {
        if (!this._startTime) return 0
        if (
            (e || (e = (new Date().getTime() - this._startTime) / 1e3), this
                ._springing)
        ) {
            return this._spring.x() + this._springOffset
        }
        var t = this._friction.x(e), n = this.dx(e)
        return ((t > 0 && n >= 0) || (t < -this._extent && n <= 0)) &&
        ((this._springing = !0), this._spring.setEnd(0, n), t < -this._extent
            ? (this._springOffset = -this._extent)
            : (this._springOffset = 0), (t =
            this._spring.x() + this._springOffset)), t
    }
    Scroll.prototype.dx = function (e) {
        return this._springing ? this._spring.dx(e) : this._friction.dx(e)
    }
    Scroll.prototype.done = function () {
        return this._springing ? this._spring.done() : this._friction.done()
    }
    Scroll.prototype.configuration = function () {
        var e = this._friction.configuration()
        return e.push.apply(e, this._spring.configuration()), e
    }
    var l = 0.5
    Handler.prototype.onTouchStart = function () {
        this._startPosition = this._position
        this._startPosition > 0
            ? (this._startPosition /= l)
            : this._startPosition < -this._extent &&
            (this._startPosition =
                (this._startPosition + this._extent) / l - this._extent)
        this._animation && this._animation.cancel()
        var pos = this._position, transform = 'translateY(' + pos + 'px)'
        this._element.style.webkitTransform = transform
        this._element.style.transform = transform
    }
    Handler.prototype.onTouchMove = function (e, t) {
        var pos = t + this._startPosition
        pos > 0
            ? (pos *= l)
            : pos < -this._extent &&
            (pos = (pos + this._extent) * l - this._extent)
        this._position = pos
        var transform = 'translateY(' + pos + 'px) translateZ(0)'
        ;(this._element.style.webkitTransform = transform), (this._element.style.transform = transform)
    }
    Handler.prototype.onTouchEnd = function (t, n, i) {
        var self = this
        if (this._position > -this._extent && this._position < 0) {
            if ((Math.abs(n) < 34 && Math.abs(i.y) < 300) || Math.abs(i.y) < 150) {
                return void self.snap()
            }
        }

        this._scroll.set(this._position, i.y)

        this._animation = _Animation(
            this._scroll,
            function () {
                var e = self._scroll.x()
                self._position = e
                var t = 'translateY(' + e + 'px) translateZ(0)'
                self._element.style.webkitTransform = t
                self._element.style.transform = t
            },
            function () {
                self.snap()
            }
        )

        return void 0
    }

    Handler.prototype.onTransitionEnd = function () {
        ;(this._snapping = !1), (this._element.style.transition =
            ''), (this._element.style.webkitTransition =
            ''), this._element.removeEventListener(
            'transitionend',
            this._onTransitionEnd
        ), this._element.removeEventListener(
            'webkitTransitionEnd',
            this._onTransitionEnd
        ), typeof this.snapCallback === 'function' &&
        this.snapCallback(Math.floor(Math.abs(this._position) / this._itemHeight))
    }
    Handler.prototype.snap = function () {
        var height = this._itemHeight,
            t = this._position % height,
            n = Math.abs(t) > 17
                ? this._position - (height - Math.abs(t))
                : this._position - t
        this._element.style.transition = 'transform .2s ease-out'
        this._element.style.webkitTransition = '-webkit-transform .2s ease-out'
        this._element.style.transform = 'translateY(' + n + 'px) translateZ(0)'
        this._element.style.webkitTransform =
            'translateY(' + n + 'px) translateZ(0)'
        this._position = n
        this._snapping = !0
        this._element.addEventListener('transitionend', this._onTransitionEnd)
        this._element.addEventListener('webkitTransitionEnd', this._onTransitionEnd)
    }
    Handler.prototype.update = function (e) {
        var t =
            this._element.offsetHeight - this._element.parentElement.offsetHeight
        typeof e === 'number' && (this._position = -e * this._itemHeight), this
            ._position < -t
            ? (this._position = -t)
            : this._position > 0 &&
            (this._position = 0), (this._element.style.transform =
            'translateY(' +
            this._position +
            'px) translateZ(0)'), (this._element.style.webkitTransform =
            'translateY(' +
            this._position +
            'px) translateZ(0)'), (this._extent = t), (this._scroll._extent = t)
    }
    Handler.prototype.configuration = function () {
        return this._scroll.configuration()
    }

    window.exparser.registerElement({
        is: 'wx-picker-view-column',
        template: '\n      <div id="main" class="wx-picker__group">\n        <div id="mask" class="wx-picker__mask"></div>\n        <div id="indicator" class="wx-picker__indicator"></div>\n        <div id="content" class="wx-picker__content"><slot></slot></div>\n      </div>\n    ',
        attached: function () {
            var self = this
            this._observer = exparser.Observer.create(function () {
                self._handlers.update()
            })
            this._observer.observe(this, {
                childList: !0,
                subtree: !0
            })
        },
        detached: function () {
            this.$.main.removeEventListener('touchstart', this.__handleTouchStart)
            document.body.removeEventListener('touchmove', this.__handleTouchMove)
            document.body.removeEventListener('touchend', this.__handleTouchEnd)
            document.body.removeEventListener('touchcancel', this.__handleTouchEnd)
        },
        _getCurrent: function () {
            return this._current || 0
        },
        _setCurrent: function (indicator) {
            this._current = indicator
        },
        _setStyle: function (style) {
            this.$.indicator.setAttribute('style', style)
        },
        _setHeight: function (height) {
            var indicatorHeight = this.$.indicator.offsetHeight,
                contents = this.$.content.children,
                idx = 0,
                len = contents.length
            for (; idx < len; idx++) {
                var contentItem = contents.item(idx)
                contentItem.style.height = indicatorHeight + 'px'
                contentItem.style.overflow = 'hidden'
            }

            this._itemHeight = indicatorHeight
            this.$.main.style.height = height + 'px'
            var indicatorTopPos = (height - indicatorHeight) / 2
            this.$.mask.style.backgroundSize = '100% ' + indicatorTopPos + 'px'
            this.$.indicator.style.top = indicatorTopPos + 'px'
            this.$.content.style.padding = indicatorTopPos + 'px 0'
        },
        _init: function () {
            var that = this
            this._touchInfo = {
                trackingID: -1,
                maxDy: 0,
                maxDx: 0
            }
            this._handlers = new Handler(
                this.$.content,
                this._current,
                this._itemHeight
            )
            this._handlers.snapCallback = function (idx) {
                idx !== that._current &&
                ((that._current = idx), that.triggerEvent(
                    'wxPickerColumnValueChanged',
                    {
                        idx: idx
                    },
                    {
                        bubbles: !0
                    }
                ))
            }
            this.__handleTouchStart = this._handleTouchStart.bind(this)
            this.__handleTouchMove = this._handleTouchMove.bind(this)
            this.__handleTouchEnd = this._handleTouchEnd.bind(this)
            this.$.main.addEventListener('touchstart', this.__handleTouchStart)
            document.body.addEventListener('touchmove', this.__handleTouchMove)
            document.body.addEventListener('touchend', this.__handleTouchEnd)
            document.body.addEventListener('touchcancel', this.__handleTouchEnd)
        },
        _update: function () {
            this._handlers.update(this._current)
        },
        _findDelta: function (event) {
            var touchInfo = this._touchInfo
            if (event.type != 'touchmove' && event.type != 'touchend') {
                return {
                    x: event.screenX - touchInfo.x,
                    y: event.screenY - touchInfo.y
                }
            }
            for (
                var touches = event.changedTouches || event.touches, i = 0;
                i < touches.length;
                i++
            ) {
                if (touches[i].identifier == touchInfo.trackingID) {
                    return {
                        x: touches[i].pageX - touchInfo.x,
                        y: touches[i].pageY - touchInfo.y
                    }
                }
            }
            return null
        },
        _handleTouchStart: function (event) {
            var touchInfo = this._touchInfo
            if (touchInfo.trackingID == -1) {
                var handlers = this._handlers
                if (handlers) {
                    if (event.type == 'touchstart') {
                        var touches = event.changedTouches || event.touches
                        touchInfo.trackingID = touches[0].identifier
                        touchInfo.x = touches[0].pageX
                        touchInfo.y = touches[0].pageY
                    } else {
                        touchInfo.trackingID = 'mouse'
                        touchInfo.x = event.screenX
                        touchInfo.y = event.screenY
                    }
                    touchInfo.maxDx = 0
                    touchInfo.maxDy = 0
                    touchInfo.historyX = [0]
                    touchInfo.historyY = [0]
                    touchInfo.historyTime = [event.timeStamp]
                    touchInfo.listener = handlers
                    handlers.onTouchStart && handlers.onTouchStart()
                }
            }
        },
        _handleTouchMove: function (event) {
            var touchInfo = this._touchInfo
            if (touchInfo.trackingID != -1) {
                event.preventDefault()
                var delta = this._findDelta(event)
                if (delta) {
                    touchInfo.maxDy = Math.max(touchInfo.maxDy, Math.abs(delta.y))
                    touchInfo.maxDx = Math.max(touchInfo.maxDx, Math.abs(delta.x))
                    touchInfo.historyX.push(delta.x)
                    touchInfo.historyY.push(delta.y)
                    touchInfo.historyTime.push(event.timeStamp)
                    for (; touchInfo.historyTime.length > 10;) {
                        touchInfo.historyTime.shift()
                        touchInfo.historyX.shift()
                        touchInfo.historyY.shift()
                    }
                    touchInfo.listener &&
                    touchInfo.listener.onTouchMove &&
                    touchInfo.listener.onTouchMove(delta.x, delta.y, event.timeStamp)
                }
            }
        },
        _handleTouchEnd: function (event) {
            var touchInfo = this._touchInfo
            if (touchInfo.trackingID != -1) {
                event.preventDefault()
                var delta = this._findDelta(event)
                if (delta) {
                    var listener = touchInfo.listener
                    touchInfo.trackingID = -1
                    touchInfo.listener = null
                    var historyTimeLen = touchInfo.historyTime.length,
                        r = {
                            x: 0,
                            y: 0
                        }
                    if (historyTimeLen > 2) {
                        var lastIdx = touchInfo.historyTime.length - 1,
                            lastHistoryTIme = touchInfo.historyTime[lastIdx],
                            lastHistoryX = touchInfo.historyX[lastIdx],
                            lastHistoryY = touchInfo.historyY[lastIdx]
                        for (; lastIdx > 0;) {
                            lastIdx--
                            var timeItem = touchInfo.historyTime[lastIdx],
                                u = lastHistoryTIme - timeItem
                            if (u > 30 && u < 50) {
                                r.x = (lastHistoryX - touchInfo.historyX[lastIdx]) / (u / 1e3)
                                r.y = (lastHistoryY - touchInfo.historyY[lastIdx]) / (u / 1e3)
                                break
                            }
                        }
                    }
                    touchInfo.historyTime = []
                    touchInfo.historyX = []
                    touchInfo.historyY = []
                    listener &&
                    listener.onTouchEnd &&
                    listener.onTouchEnd(delta.x, delta.y, r)
                }
            }
        }
    })
})()

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
    percentChange: function (percent) {
        percent > 100 && (this.percent = 100), percent < 0 &&
        (this.percent = 0), this.__timerId &&
        clearInterval(this.__timerId), this.activeAnimation(this.active)
    },
    activeAnimation: function (active) {
        if (!isNaN(this.percent)) {
            if (active) {
                var timeFunc = function () {
                        return this.percent <= this.curPercent + 1
                            ? ((this.curPercent = this.percent), void clearInterval(
                                this.__timerId
                            ))
                            : void ++this.curPercent
                    }
                ;(this.curPercent = 0), (this.__timerId = setInterval(
                    timeFunc.bind(this),
                    30
                )), timeFunc.call(this)
            } else {
                this.curPercent = this.percent
            }
        }
    },
    detached: function () {
        this.__timerId && clearInterval(this.__timerId)
    }
})

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
    _getColor: function (checked, color) {
        return checked ? color : ''
    },
    _inputTap: function () {
        return (
            !this.disabled &&
            void (this.checked || ((this.checked = !0), this.changedByTap()))
        )
    },
    handleLabelTap: function () {
        this._inputTap()
    }
})

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
    created: function () {
        this._selectedItem = null
    },
    addItem: function (e) {
        e.checked &&
        (this._selectedItem && (this._selectedItem.checked = !1), (this.value =
            e.value), (this._selectedItem = e))
    },
    removeItem: function (e) {
        this._selectedItem === e && ((this.value = ''), (this._selectedItem = null))
    },
    renameItem: function (e, t) {
        this._selectedItem === e && (this.value = t)
    },
    changed: function (e) {
        this._selectedItem === e ? this.removeItem(e) : this.addItem(e)
    }
})

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
    created: function () {
        this._lastScrollTop = this.scrollTop || 0;
        this._lastScrollLeft = this.scrollLeft || 0;
        this.touchtrack(this.$.main, '_handleTrack');
    },
    attached: function () {
        var self = this
        this._scrollTopChanged(this.scrollTop)
        this._scrollLeftChanged(this.scrollLeft)
        this._srollIntoViewChanged(this.scrollIntoView)
        this.__handleScroll = function (t) {
            t.preventDefault(), t.stopPropagation(), self._handleScroll.bind(
                self,
                t
            )()
        }
        this.__handleTouchMove = function (t) {
            self._checkBounce()
            var py = t.touches[0].pageY, main = self.$.main
            self.__touchStartY < py
                ? main.scrollTop > 0 && t.stopPropagation()
                : main.scrollHeight > main.offsetHeight + main.scrollTop &&
                t.stopPropagation()
        }
        this.__handleTouchStart = function (t) {
            ;(self.__touchStartY =
                t.touches[0].pageY), WeixinJSBridge.invoke(
                'disableScrollBounce',
                {
                    disable: !0
                },
                function () {}
            )
            var main = self.$.main
            ;(self._touchScrollTop = self.$.main.scrollTop), (self._touchScrollLeft =
                self.$.main.scrollLeft), (self._touchScrollBottom =
                self._touchScrollTop + main.offsetHeight ===
                main.scrollHeight), (self._touchScrollRight =
                self._touchScrollLeft + main.offsetWidth === main.scrollWidth)
        }
        this.__handleTouchEnd = function () {
            WeixinJSBridge.invoke(
                'disableScrollBounce',
                {
                    disable: !1
                },
                function () {}
            )
        }
        this.$.main.addEventListener('touchstart', this.__handleTouchStart)
        this.$.main.addEventListener('touchmove', this.__handleTouchMove)
        this.$.main.addEventListener('touchend', this.__handleTouchEnd)
        this.$.main.addEventListener('scroll', this.__handleScroll)
        this.$.main.style.overflowX = this.scrollX ? 'auto' : 'hidden'
        this.$.main.style.overflowY = this.scrollY ? 'auto' : 'hidden'
        var ua = window.navigator.userAgent.toLowerCase()
        if (/iphone/.test(ua)) {
            document.getElementById('__scroll_view_hack') &&
            document.body.removeChild(document.getElementById('__scroll_view_hack'))
            var div = document.createElement('div')
            div.setAttribute(
                'style',
                'position: fixed; left: 0; bottom: 0; line-height: 1; font-size: 1px; z-index: 10000; border-radius: 4px; box-shadow: 0 0 8px rgba(0,0,0,.4); width: 1px; height: 1px; overflow: hidden;'
            )
            div.innerText = '.'
            div.id = '__scroll_view_hack'
            document.body.appendChild(div)
        }
    },
    detached: function () {
        this.$.main.removeEventListener(
            'scroll',
            this.__handleScroll
        ), this.$.main.removeEventListener(
            'touchstart',
            this.__handleTouchStart
        ), this.$.main.removeEventListener(
            'touchmove',
            this.__handleTouchMove
        ), this.$.main.removeEventListener('touchend', this.__handleTouchEnd)
    },
    _getStyle: function (e, t) {
        var ox = e ? 'auto' : 'hidden', oy = t ? 'auto' : 'hidden'
        return 'overflow-x: ' + ox + '; overflow-y: ' + oy + ';'
    },
    _handleTrack: function (e) {
        return e.detail.state === 'start'
            ? ((this._x = e.detail.x), (this._y =
                e.detail.y), void (this._noBubble = null))
            : (e.detail.state === 'end' && (this._noBubble = !1), this._noBubble ===
            null &&
            this.scrollY &&
            (Math.abs(this._y - e.detail.y) / Math.abs(this._x - e.detail.x) > 1
                ? (this._noBubble = !0)
                : (this._noBubble = !1)), this._noBubble === null &&
            this.scrollX &&
            (Math.abs(this._x - e.detail.x) / Math.abs(this._y - e.detail.y) > 1
                ? (this._noBubble = !0)
                : (this._noBubble = !1)), (this._x = e.detail.x), (this._y =
                e.detail.y), void (this._noBubble && e.stopPropagation()))
    },
    _handleScroll: function (e) {
        this._bounce ||
        (clearTimeout(this._timeout), (this._timeout = setTimeout(
            function () {
                var main = this.$.main
                if (
                    (this.triggerEvent('scroll', {
                        scrollLeft: main.scrollLeft,
                        scrollTop: main.scrollTop,
                        scrollHeight: main.scrollHeight,
                        scrollWidth: main.scrollWidth,
                        deltaX: this._lastScrollLeft - main.scrollLeft,
                        deltaY: this._lastScrollTop - main.scrollTop
                    }), this.scrollY)
                ) {
                    var goTop = this._lastScrollTop - main.scrollTop > 0,
                        goBottom = this._lastScrollTop - main.scrollTop < 0
                    main.scrollTop <= this.upperThreshold &&
                    goTop &&
                    this.triggerEvent('scrolltoupper', {
                        direction: 'top'
                    })
                    main.scrollTop + main.offsetHeight + this.lowerThreshold >=
                    main.scrollHeight &&
                    goBottom &&
                    this.triggerEvent('scrolltolower', {
                        direction: 'bottom'
                    })
                }
                if (this.scrollX) {
                    var goLeft = this._lastScrollLeft - main.scrollLeft > 0,
                        goRight = this._lastScrollLeft - main.scrollLeft < 0
                    main.scrollLeft <= this.upperThreshold &&
                    goLeft &&
                    this.triggerEvent('scrolltoupper', {
                        direction: 'left'
                    })
                    main.scrollLeft +
                    main.offset__wxConfigWidth +
                    this.lowerThreshold >=
                    main.scrollWidth &&
                    goRight &&
                    this.triggerEvent('scrolltolower', {
                        direction: 'right'
                    })
                }
                ;(this.scrollTop = this._lastScrollTop =
                    main.scrollTop), (this.scrollLeft = this._lastScrollLeft =
                    main.scrollLeft)
            }.bind(this),
            50
        )))
    },
    _checkBounce: function () {
        var self = this, main = self.$.main
        self._touchScrollTop === 0 &&
        (!self._bounce &&
        main.scrollTop < 0 &&
        (self._bounce = !0), self._bounce &&
        main.scrollTop > 0 &&
        (self._bounce = !1))
        self._touchScrollLeft === 0 &&
        (!self._bounce &&
        main.scrollLeft < 0 &&
        (self._bounce = !0), self._bounce &&
        main.scrollLeft > 0 &&
        (self._bounce = !1))
        self._touchScrollBottom &&
        (!self._bounce &&
        main.scrollTop > self._touchScrollTop &&
        (self._bounce = !0), self._bounce &&
        main.scrollTop < self._touchScrollTop &&
        (self._bounce = !1))
        self._touchScrollRight &&
        (!self._bounce &&
        main.scrollLeft > self._touchScrollLeft &&
        (self._bounce = !0), self._bounce &&
        main.scrollLeft < self._touchScrollLeft &&
        (self._bounce = !1))
    },
    _scrollXChanged: function (e) {
        this.$.main.style.overflowX = e ? 'auto' : 'hidden'
    },
    _scrollYChanged: function (e) {
        this.$.main.style.overflowY = e ? 'auto' : 'hidden'
    },
    _scrollTopChanged: function (e) {
        this.scrollY && (this.$.main.scrollTop = e)
    },
    _scrollLeftChanged: function (e) {
        this.scrollX && (this.$.main.scrollLeft = e)
    },
    _srollIntoViewChanged: function (id) {
        if (id) {
            if (Number(id[0]) >= 0 && Number(id[0]) <= 9) {
                return console.group('scroll-into-view="' + id + '" 有误'), console.warn(
                    'id属性不能以数字开头'
                ), void console.groupEnd()
            }
            var ele = this.$$.querySelector('#' + id)
            ele && (this.$.main.scrollTop = ele.offsetTop)
        }
    }
})

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
    created: function () {
        this.touchtrack(this.$.handle, '_onTrack')
    },
    _filterValue: function (val) {
        if (val < this.min) return this.min
        if (val > this.max) return this.max
        var stepWidth = Math.round((val - this.min) / this.step)
        return stepWidth * this.step + this.min
    },
    _revalicateRange: function () {
        this.value = this._filterValue(this.value)
    },
    _getValueWidth: function (val, min, max) {
        return 100 * (val - min) / (max - min) + '%'
    },
    _getXPosition: function (ele) {
        for (var width = ele.offsetLeft; ele; ele = ele.offsetParent) {
            width += ele.offsetLeft
        }
        return width - document.body.scrollLeft
    },
    _onUserChangedValue: function (event) {
        var offsetWidth = this.$.step.offsetWidth,
            currPos = this._getXPosition(this.$.step),
            value =
                (event.detail.x - currPos) * (this.max - this.min) / offsetWidth +
                this.min
        ;(value = this._filterValue(value)), (this.value = value)
    },
    _onTrack: function (event) {
        if (!this.disabled) {
            return event.detail.state === 'move'
                ? (this._onUserChangedValue(event), !1)
                : void (event.detail.state === 'end' &&
                this.triggerEvent('change', {
                    value: this.value
                }))
        }
    },
    _onTap: function (event) {
        this.disabled ||
        (this._onUserChangedValue(event), this.triggerEvent('change', {
            value: this.value
        }))
    },
    resetFormData: function () {
        this.value = this.min
    }
})

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
    created: function () {
        this.touchtrack(this.$.slides, '_handleContentTrack')
    },
    attached: function () {
        ;(this._attached = !0), this._initSlides(), this.autoplay &&
        this._scheduleNextSlide()
    },
    detached: function () {
        ;(this._attached = !1), this._cancelSchedule()
    },
    _initSlides: function () {
        if (this._attached) {
            this._cancelSchedule()
            var items = (this._items = [])
            var getItems = function getItems (ele) {
                for (var idx = 0; idx < ele.childNodes.length; idx++) {
                    var child = ele.childNodes[idx]
                    child instanceof exparser.Element &&
                    (child.hasBehavior('wx-swiper-item')
                        ? items.push(child)
                        : getItems(child))
                }
            }
            getItems(this)
            var itemLen = items.length
            this._slideCount = itemLen
            var pos = -1
            this._isCurrentSlideLegal(this.current) &&
            ((pos = this.current), this.autoplay && this._scheduleNextSlide())
            this._viewport = pos
            this._itemPos = []
            for (var idx = 0; idx < items.length; idx++) {
                items[idx]._clearTransform()
                pos >= 0
                    ? this._updateItemPos(idx, idx - pos)
                    : this._updateItemPos(idx, -1)
            }
            this._updateDots(pos)
        }
    },
    _updateViewport: function (nViewPort, flag) {
        var self = this, oViewPort = this._viewport
        this._viewport = nViewPort
        var slideCount = this._slideCount
        var updateViewport = function (nextViewport) {
            var movingSlide = (nextViewport % slideCount + slideCount) % slideCount
            if (!(self.circular && self._slideCount > 1)) {
                nextViewport = movingSlide
            }
            var flag2 = !1
            if (flag) {
                if (oViewPort <= nViewPort) {
                    oViewPort - 1 <= nextViewport &&
                    nextViewport <= nViewPort + 1 &&
                    (flag2 = !0)
                } else {
                    nViewPort - 1 <= nextViewport &&
                    nextViewport <= oViewPort + 1 &&
                    (flag2 = !0)
                }
            }

            if (flag2) {
                self._updateItemPos(
                    movingSlide,
                    nextViewport - nViewPort,
                    nextViewport - oViewPort
                )
            } else {
                self._updateItemPos(movingSlide, nextViewport - nViewPort)
            }
        }
        if (oViewPort < nViewPort) {
            for (
                var nextVieport = Math.ceil(nViewPort), idx = 0;
                idx < slideCount;
                idx++
            ) {
                updateViewport(idx + nextVieport - slideCount + 1)
            }
        } else {
            for (
                var nextViewport = Math.floor(nViewPort), idx = 0;
                idx < slideCount;
                idx++
            ) {
                updateViewport(idx + nextViewport)
            }
        }
    },
    _updateDots: function (next) {
        var dotes = this.$.slidesDots
        dotes.innerHTML = ''
        for (
            var fragment = document.createDocumentFragment(), idx = 0;
            idx < this._slideCount;
            idx++
        ) {
            var div = document.createElement('div')
            div.setAttribute('data-dot-index', idx)
            idx === next
                ? div.setAttribute('class', 'wx-swiper-dot wx-swiper-dot-active')
                : div.setAttribute('class', 'wx-swiper-dot')
            fragment.appendChild(div)
        }
        dotes.appendChild(fragment)
    },
    _gotoSlide: function (next, curr) {
        if (this._slideCount) {
            if ((this._updateDots(next), this.circular && this._slideCount > 1)) {
                var currPos = Math.round(this._viewport),
                    ratio = Math.floor(currPos / this._slideCount),
                    nextPos = ratio * this._slideCount + next
                curr > 0
                    ? nextPos < currPos && (nextPos += this._slideCount)
                    : curr < 0 && nextPos > currPos && (nextPos -= this._slideCount)
                this._updateViewport(nextPos, !0)
            } else {
                this._updateViewport(next, !0)
            }
            this.autoplay && this._scheduleNextSlide()
        }
    },
    _updateItemPos: function (nextPos, dis1, dis2) {
        if (void 0 !== dis2 || this._itemPos[nextPos] !== dis1) {
            this._itemPos[nextPos] = dis1
            var duration = '0ms', o = '', r = ''
            void 0 !== dis2 &&
            ((duration = this.duration + 'ms'), (r = this.vertical
                ? 'translate(0,' + 100 * dis2 + '%) translateZ(0)'
                : 'translate(' + 100 * dis2 + '%,0) translateZ(0)'))
            o = this.vertical
                ? 'translate(0,' + 100 * dis1 + '%) translateZ(0)'
                : 'translate(' + 100 * dis1 + '%,0) translateZ(0)'
            this._items[nextPos]._setTransform(duration, o, r)
        }
    },
    _stopItemsAnimation: function () {
        for (var idx = 0; idx < this._slideCount; idx++) {
            var item = this._items[idx]
            item._clearTransform()
        }
    },
    _scheduleNextSlide: function () {
        var self = this
        this._cancelSchedule()
        if (this._attached) {
            this._scheduleTimeoutObj = setTimeout(function () {
                self._scheduleTimeoutObj = null
                self._nextDirection = 1
                self.current = self._normalizeCurrentSlide(self.current + 1)
            }, this.interval)
        }
    },
    _cancelSchedule: function () {
        this._scheduleTimeoutObj &&
        (clearTimeout(
            this._scheduleTimeoutObj
        ), (this._scheduleTimeoutObj = null))
    },
    _normalizeCurrentSlide: function (nextSlide) {
        if (this._slideCount) {
            return (
                (Math.round(nextSlide) % this._slideCount + this._slideCount) %
                this._slideCount
            )
        } else {
            return 0
        }
    },
    _isCurrentSlideLegal: function (slide) {
        return this._slideCount ? slide === this._normalizeCurrentSlide(slide) : 0
    },
    _autoplayChanged: function (autoplay) {
        autoplay ? this._scheduleNextSlide() : this._cancelSchedule()
    },
    _currentSlideChanged: function (next, curr) {
        if (this._isCurrentSlideLegal(next) && this._isCurrentSlideLegal(curr)) {
            this._gotoSlide(next, this._nextDirection || 0)
            this._nextDirection = 0

            next !== curr &&
            this.triggerEvent('change', {
                current: this.current
            })
        } else {
            this._initSlides()
        }

        return void 0
    },
    _itemChanged: function (event) {
        event.target._relatedSwiper = this
        this._initSlides()
        return !1
    },
    _getDirectionName: function (isVertical) {
        return isVertical ? 'vertical' : 'horizontal'
    },
    _handleDotTap: function (event) {
        if (this._isCurrentSlideLegal(this.current)) {
            var dot = Number(event.target.dataset.dotIndex)
            this.current = dot
        }
    },
    _handleSlidesCancelTap: function () {
        this._userWaitingCancelTap = !1
    },
    _handleTrackStart: function () {
        this._cancelSchedule()
        this._contentTrackViewport = this._viewport
        this._contentTrackSpeed = 0
        this._contentTrackT = Date.now()
        this._stopItemsAnimation()
    },
    _handleTrackMove: function (event) {
        var self = this
        var contentTrackT = this._contentTrackT
        this._contentTrackT = Date.now()
        var slideCount = this._slideCount
        var calcRatio = function (e) {
            return 0.5 - 0.25 / (e + 0.5)
        }
        var calcViewport = function (moveRatio, speed) {
            var nextViewPort = self._contentTrackViewport + moveRatio
            self._contentTrackSpeed = 0.6 * self._contentTrackSpeed + 0.4 * speed
            if (!(self.circular && self._slideCount > 1)) {
                if (nextViewPort < 0 || nextViewPort > slideCount - 1) {
                    if (nextViewPort < 0) {
                        nextViewPort = -calcRatio(-nextViewPort)
                    } else {
                        nextViewPort > slideCount - 1 &&
                        (nextViewPort =
                            slideCount - 1 + calcRatio(nextViewPort - (slideCount - 1)))
                    }
                    self._contentTrackSpeed = 0
                }
            }
            self._updateViewport(nextViewPort, !1)
        }

        if (this.vertical) {
            calcViewport(
                -event.dy / this.$.slidesWrapper.offsetHeight,
                -event.ddy / (this._contentTrackT - contentTrackT)
            )
        } else {
            calcViewport(
                -event.dx / this.$.slidesWrapper.offsetWidth,
                -event.ddx / (this._contentTrackT - contentTrackT)
            )
        }
    },
    _handleTrackEnd: function () {
        this.autoplay && this._scheduleNextSlide()
        this._tracking = !1
        var shifting = 0
        Math.abs(this._contentTrackSpeed) > 0.2 &&
        (shifting =
            0.5 * this._contentTrackSpeed / Math.abs(this._contentTrackSpeed))
        var nextSlide = this._normalizeCurrentSlide(this._viewport + shifting)
        if (this.current !== nextSlide) {
            this._nextDirection = this._contentTrackSpeed
            this.current = nextSlide
        } else {
            this._gotoSlide(nextSlide, 0)
        }
        this.autoplay && this._scheduleNextSlide()
    },
    _handleContentTrack: function (event) {
        if (this._isCurrentSlideLegal(this.current)) {
            if (event.detail.state === 'start') {
                this._userTracking = !0
                this._userWaitingCancelTap = !1
                this._userDirectionChecked = !1
                return this._handleTrackStart()
            }
            if (this._userTracking) {
                if (this._userWaitingCancelTap) return !1
                if (!this._userDirectionChecked) {
                    this._userDirectionChecked = !0
                    var dx = Math.abs(event.detail.dx)
                    var dy = Math.abs(event.detail.dy)
                    dx >= dy && this.vertical
                        ? (this._userTracking = !1)
                        : dx <= dy && !this.vertical && (this._userTracking = !1)
                    if (!this._userTracking) {
                        return void (this.autoplay && this._scheduleNextSlide())
                    }
                }
                return event.detail.state === 'end'
                    ? this._handleTrackEnd(event.detail)
                    : (this._handleTrackMove(event.detail), !1)
            }
        }
    }
})

// wx-swiper-item
!(function () {
    var idIdx = 1
    var frameFunc = null
    var pendingList = []
    var computePendingTime = function (ele, func) {
        var id = idIdx++
        pendingList.push({
            id: id,
            self: ele,
            func: func,
            frames: 2
        })
        var triggerFunc = function e () {
            frameFunc = null
            for (var i = 0; i < pendingList.length; i++) {
                var o = pendingList[i]
                o.frames--, o.frames ||
                (o.func.call(o.self), pendingList.splice(i--, 1))
            }
            frameFunc = pendingList.length ? requestAnimationFrame(e) : null
        }
        frameFunc || (frameFunc = requestAnimationFrame(triggerFunc))
        return id
    }
    var removeFromPendingList = function (e) {
        for (var t = 0; t < pendingList.length; t++) {
            if (pendingList[t].id === e) return void pendingList.splice(t, 1)
        }
    }
    window.exparser.registerElement({
        is: 'wx-swiper-item',
        template: '\n    <slot></slot>\n  ',
        properties: {},
        listeners: {
            'this.wxSwiperItemChanged': '_invalidChild'
        },
        behaviors: ['wx-base'],
        _invalidChild: function (chid) {
            if (chid.target !== this) return !1
        },
        _setDomStyle: function () {
            var selfEle = this.$$
            selfEle.style.position = 'absolute'
            selfEle.style.width = '100%'
            selfEle.style.height = '100%'
        },
        attached: function () {
            this._setDomStyle()
            this._pendingTimeoutId = 0
            this._pendingTransform = ''
            this._relatedSwiper = null
            this.triggerEvent('wxSwiperItemChanged', void 0, {
                bubbles: !0
            })
        },
        detached: function () {
            this._clearTransform()
            this._relatedSwiper &&
            (this._relatedSwiper.triggerEvent(
                'wxSwiperItemChanged'
            ), (this._relatedSwiper = null))
        },
        _setTransform: function (duration, transform, hasPending) {
            hasPending
                ? ((this.$$.style.transitionDuration = '0ms'), (this.$$.style[
                '-webkit-transform'
                ] = hasPending), (this.$$.style.transform = hasPending), (this._pendingTransform = transform), (this._pendingTimeoutId = computePendingTime(
                this,
                function () {
                    ;(this.$$.style.transitionDuration = duration), (this.$$.style[
                        '-webkit-transform'
                        ] = transform), (this.$$.style.transform = transform)
                }
            )))
                : (this._clearTransform(), (this.$$.style.transitionDuration = duration), (this.$$.style[
                '-webkit-transform'
                ] = transform), (this.$$.style.transform = transform))
        },
        _clearTransform: function () {
            this.$$.style.transitionDuration = '0ms'
            this._pendingTimeoutId &&
            ((this.$$.style[
                '-webkit-transform'
                ] = this._pendingTransform), (this.$$.style.transform = this._pendingTransform), removeFromPendingList(
                this._pendingTimeoutId
            ), (this._pendingTimeoutId = 0))
        }
    })
})()

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
    _getSwitchBorderColor: function (checked, color) {
        return checked ? color : ''
    },
    handleLabelTap: function () {
        this.disabled || (this.checked = !this.checked)
    },
    onInputChange: function (e) {
        this.checked = !this.checked
        return this.disabled
            ? void (this.checked = !this.checked)
            : void this.triggerEvent('change', {
                value: this.checked
            })
    },
    isSwitch: function (type) {
        return type !== 'checkbox'
    },
    isCheckbox: function (type) {
        return type === 'checkbox'
    },
    getFormData: function () {
        return this.checked
    },
    resetFormData: function () {
        this.checked = !1
    }
})

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
    _styleChanged: function (styles) {
        this.$$.setAttribute('style', styles)
    },
    _classChanged: function (cls) {
        this.$$.setAttribute('class', cls)
    },
    _htmlEncode: function (txt) {
        return txt
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/\"/g, '&quot;')
        .replace(/\'/g, '&apos;')
    },
    _update: function () {
        var rawEle = this.$.raw,
            fragment = document.createDocumentFragment(),
            idx = 0,
            len = rawEle.childNodes.length
        for (; idx < len; idx++) {
            var childNode = rawEle.childNodes.item(idx)
            if (childNode.nodeType === childNode.TEXT_NODE) {
                var spanEle = document.createElement('span')
                spanEle.innerHTML = this._htmlEncode(childNode.textContent).replace(
                    /\n/g,
                    '<br>'
                )
                fragment.appendChild(spanEle)
            } else {
                childNode.nodeType === childNode.ELEMENT_NODE &&
                childNode.tagName === 'WX-TEXT' &&
                fragment.appendChild(childNode.cloneNode(!0))
            }
        }
        this.$.main.innerHTML = ''
        this.$.main.appendChild(fragment)
    },
    created: function () {
        this._observer = exparser.Observer.create(function () {
            this._update()
        })
        this._observer.observe(this, {
            childList: !0,
            subtree: !0,
            characterData: !0,
            properties: !0
        })
    },
    attached: function () {
        this._update()
    }
})

// wx-textarea in dev tool
!(function () {
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
        resetFormData: function () {
            this.$.textarea.value = ''
            this.value = ''
        },
        getFormData: function (cb) {
            var self = this
            this.value = this.$.textarea.value
            setTimeout(function () {
                typeof cb === 'function' && cb(self.value)
            }, 0)
        },
        couldFocus: function (focus) {
            var self = this
            if (this.__attached) {
                if (!this._keyboardShow && focus) {
                    this.disabled ||
                    window.requestAnimationFrame(function () {
                        self.$.textarea.focus()
                    })
                } else {
                    this._keyboardShow && !focus && this.$.textarea.blur()
                }
            }
        },
        focusChanged: function (focus, t) {
            this.couldFocus(Boolean(focus))
            return focus
        },
        attached: function () {
            var self = this
            this.__attached = !0
            this.__scale = 750 / window.innerWidth
            this.getComputedStyle()
            this.checkRows(this.value)
            this.__updateTextArea = this.updateTextArea.bind(this)
            document.addEventListener('pageReRender', this.__updateTextArea)
            this.__routeDoneId = exparser.addListenerToElement(
                document,
                'routeDone',
                function () {
                    self.checkAutoFocus()
                }
            )
            this.checkPlaceholderStyle(this.value)
        },
        checkAutoFocus: function () {
            if (!this.__autoFocused) {
                this.__autoFocused = !0
                this.couldFocus(this.autoFocus || this.focus)
            }
        },
        detached: function () {
            document.removeEventListener('pageReRender', this.__updateTextArea)
            exparser.removeListenerFromElement(
                document,
                'routeDone',
                this.__routeDoneId
            )
        },
        getHexColor: function (colorValue) {
            try {
                var colorNums
                var decimal
                var hexValue = (function () {
                    if (colorValue.indexOf('#') >= 0) {
                        return {
                            v: colorValue
                        }
                    }
                    colorNums = colorValue.match(/\d+/g)
                    var ret = []
                    colorNums.map(function (num, idx) {
                        if (idx < 3) {
                            var decNum = parseInt(num)
                            decNum = decNum > 9 ? decNum.toString(16) : '0' + decNum
                            ret.push(decNum)
                        }
                    })

                    if (colorNums.length > 3) {
                        decimal = parseFloat(colorNums.slice(3).join('.'))
                        if (decimal == 0) {
                            ret.push('00')
                        } else {
                            if (decimal >= 1) {
                                ret.push('ff')
                            } else {
                                decimal = parseInt(255 * decimal)
                                if ((decimal = decimal > 9)) {
                                    decimal.toString(16)
                                } else {
                                    '0' + decimal
                                }
                                ret.push(decimal)
                            }
                        }
                    }
                    return {
                        v: '#' + ret.join('')
                    }
                })()
                if (typeof hexValue === 'object') return hexValue.v
            } catch (e) {
                return ''
            }
        },
        getComputedStyle: function () {
            var self = this
            window.requestAnimationFrame(function () {
                var selfStyle = window.getComputedStyle(self.$$)
                var selfSizeInfo = self.$$.getBoundingClientRect()
                var lrSize = ['Left', 'Right'].map(function (side) {
                    return (
                        parseFloat(selfStyle['border' + side + 'Width']) +
                        parseFloat(selfStyle['padding' + side])
                    )
                })
                var tbSize = ['Top', 'Bottom'].map(function (side) {
                    return (
                        parseFloat(selfStyle['border' + side + 'Width']) +
                        parseFloat(selfStyle['padding' + side])
                    )
                })
                var textarea = self.$.textarea
                textarea.style.width = selfSizeInfo.width - lrSize[0] - lrSize[1] + 'px'
                textarea.style.height = selfSizeInfo.height - tbSize[0] - tbSize[1] + 'px'
                console.log(selfSizeInfo.height - tbSize[0] - tbSize[1] + 'px')
                textarea.style.fontWeight = selfStyle.fontWeight
                textarea.style.fontSize = selfStyle.fontSize || '16px'
                textarea.style.color = selfStyle.color
                self.$.compute.style.fontSize = selfStyle.fontSize || '16px'
                self.$.compute.style.width = textarea.style.width
                self.$.placeholder.style.width = textarea.style.width
                self.$.placeholder.style.height = textarea.style.height
                self.disabled
                    ? textarea.setAttribute('disabled', !0)
                    : textarea.removeAttribute('disabled')
            })
        },
        getCurrentRows: function (txt) {
            var computedStyle = window.getComputedStyle(this.$.compute)
            var lineHeight = 1.2 * (parseFloat(computedStyle.fontSize) || 16)
            this.$.compute.innerText = txt
            this.$.compute.appendChild(document.createElement('br'))
            return {
                height: Math.max(this.$.compute.scrollHeight, lineHeight),
                heightRpx: this.__scale * this.$.compute.scrollHeight,
                lineHeight: lineHeight,
                lineCount: Math.ceil(this.$.compute.scrollHeight / lineHeight)
            }
        },
        onTextAreaInput: function (event) {
            this.value = event.target.value
            if (this.bindinput) {
                var target = {
                    id: this.$$.id,
                    dataset: this.dataset,
                    offsetTop: this.$$.offsetTop,
                    offsetLeft: this.$$.offsetLeft
                }
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
                })
            }
            return !1
        },
        onTextAreaFocus: function (e) {
            this._keyboardShow = !0
            this.triggerEvent('focus', {
                value: this.value
            })
        },
        onTextAreaBlur: function (e) {
            this._keyboardShow = !1
            this.triggerEvent('blur', {
                value: this.value
            })
        },
        updateTextArea: function () {
            this.checkAutoFocus()
            this.getComputedStyle()
            this.autoHeightChanged(this.autoHeight)
        },
        hiddenChanged: function (isHidden, t) {
            this.$$.style.display = isHidden ? 'none' : ''
        },
        _getPlaceholderStyle: function (placeholderStyle) {
            return placeholderStyle + ';display:none;'
        },
        _getComputePlaceholderStyle: function () {
            var stylecomputeEle = this.$.stylecompute,
                computedStyle = window.getComputedStyle(stylecomputeEle),
                fontWight = parseInt(computedStyle.fontWeight)
            isNaN(fontWight)
                ? (fontWight = computedStyle.fontWeight)
                : fontWight < 500
                ? (fontWight = 'normal')
                : fontWight >= 500 && (fontWight = 'bold')
            this.placeholderStyle && this.placeholderStyle.split(';')
            var placeHolder = this.$.placeholder
            placeHolder.style.position = 'absolute'
            placeHolder.style.fontSize =
                (parseFloat(computedStyle.fontSize) || 16) + 'px'
            placeHolder.style.fontWeight = fontWight
            placeHolder.style.color = this.getHexColor(computedStyle.color)
        },
        defaultValueChange: function (val) {
            this.maxlength > 0 &&
            val.length > this.maxlength &&
            (val = val.slice(0, this.maxlength))
            this.checkPlaceholderStyle(val)
            this.$.textarea.value = val
            this.__attached && this.checkRows(val)
            return val
        },
        autoHeightChanged: function (changed) {
            if (changed) {
                var rows = this.getCurrentRows(this.value)
                var height = rows.height < rows.lineHeight
                    ? rows.lineHeight
                    : rows.height
                this.$$.style.height = height + 'px'
                this.getComputedStyle()
            }
        },
        checkRows: function (txt) {
            var rowsInfo = this.getCurrentRows(txt)
            if (this.lastRows != rowsInfo.lineCount) {
                this.lastRows = rowsInfo.lineCount
                if (this.autoHeight) {
                    var height = rowsInfo.height < rowsInfo.lineHeight
                        ? rowsInfo.lineHeight
                        : rowsInfo.height
                    this.$$.style.height = height + 'px'
                    this.getComputedStyle()
                }
                this.triggerEvent('linechange', rowsInfo)
            }
        },
        checkPlaceholderStyle: function (hasPlaceHolder) {
            if (hasPlaceHolder) {
                this.$.placeholder.style.display = 'none'
            } else {
                this._getComputePlaceholderStyle()
                this.$.placeholder.style.display = ''
            }
        },
        _getPlaceholderClass: function (cls) {
            return 'textarea-placeholder ' + cls
        },
        _getMaxlength: function (len) {
            return len <= 0 ? -1 : len
        },
        maxlengthChanged: function (len) {
            len > 0 &&
            this.value.length > len &&
            (this.value = this.value.slice(0, len))
        }
    })
})()

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
    durationChange: function () {
        this.timer && (clearTimeout(this.timer), this.hiddenChange(this.hidden))
    },
    hiddenChange: function (isHidden) {
        if (!isHidden && this.duration != 0) {
            var self = this
            this.timer = setTimeout(function () {
                self.triggerEvent('change', {
                    value: self.hidden
                })
            }, this.duration)
        }
    }
})

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
        _reset: function () {
            this._buttonType = 'play'
            this._currentTime = '00:00'
            this._duration = this._formatTime(this.duration)
            this._progressLeft = -22
            this._progressLength = 0
            this._barType = this.controls ? 'full' : 'part'
        },
        _hiddenChanged: function (isHidden, t) {
            this.$.player.pause()
            this.$$.style.display = isHidden ? 'none' : ''
        },
        posterChanged: function (posterUrl, t) {
            this._isError || (this.$.player.poster = posterUrl)
        },
        srcChanged: function (srcURL, t) {
            if (!this._isError && srcURL) {
                var self = this
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
                this.$.player.src = srcURL
                setTimeout(function () {
                    self._reset()
                }, 0)
            }
        },
        controlsChanged: function (show, t) {
            this.controls
                ? (this._barType = 'full')
                : this.danmuBtn ? (this._barType = 'part') : (this._barType = 'none')
            this.$.fullscreen.style.display = show ? 'block' : 'none'
            this.$.controls.style.display = show ? 'flex' : 'none'
        },
        objectFitChanged: function (objectFit, t) {
            this.$.player.style.objectFit = objectFit
        },
        durationChanged: function (duration, t) {
            console.log('durationChanged', duration)
            duration > 0 && (this._duration = this._formatTime(Math.floor(duration)))
        },
        danmuBtnChanged: function (isDanmuBtnShow, t) {
            this.controls
                ? (this._barType = 'full')
                : this.danmuBtn ? (this._barType = 'part') : (this._barType = 'none')
            this.$.danmuBtn.style.display = isDanmuBtnShow ? '' : 'none'
        },
        enableDanmuChanged: function (enableDanmu, t) {
            this._danmuStatus = enableDanmu ? 'active' : ''
            this.$.danmu.style.zIndex = enableDanmu ? '0' : '-9999'
        },
        actionChanged: function (action, t) {
            if (typeof action === 'object') {
                var method = action.method, data = action.data
                if (method === 'play') {
                    this.$.player.play()
                } else if (method === 'pause') {
                    this.$.player.pause()
                } else if (method === 'seek') {
                    ;(this.$.player.currentTime = data[0]), this._resetDanmu()
                } else if (method === 'sendDanmu') {
                    var danmuInfo = _slicedToArray(data, 2),
                        txt = danmuInfo[0],
                        color = danmuInfo[1],
                        currentTime = parseInt(this.$.player.currentTime)
                    this.danmuObject[currentTime]
                        ? this.danmuObject[currentTime].push({
                        text: txt,
                        color: color,
                        time: currentTime
                    })
                        : (this.danmuObject[currentTime] = [
                        {
                            text: txt,
                            color: color,
                            time: currentTime
                        }
                    ])
                }
            }
        },
        onPlay: function () {
            var self = this
            var damuItems = document.querySelectorAll('.wx-video-danmu-item')
            Array.prototype.forEach.apply(damuItems, [
                function (damuItem) {
                    var transitionDuration =
                        3 *
                        (parseInt(getComputedStyle(damuItem).left) + damuItem.offsetWidth) /
                        (damuItem.offsetWidth + self.$$.offsetWidth)
                    damuItem.style.left = '-' + damuItem.offsetWidth + 'px'
                    damuItem.style.transitionDuration = transitionDuration + 's'
                    damuItem.style.webkitTransitionDuration = transitionDuration + 's'
                }
            ])
        },
        onPause: function (event) {
            var danmuItems = document.querySelectorAll('.wx-video-danmu-item')
            Array.prototype.forEach.apply(danmuItems, [
                function (danmu) {
                    danmu.style.left = getComputedStyle(danmu).left
                }
            ])
        },
        onEnded: function (event) {},
        _computeRate: function (targetPos) {
            var elapsed = this.$.progress.getBoundingClientRect().left,
                totalLen = this.$.progress.offsetWidth,
                rate = (targetPos - elapsed) / totalLen
            rate < 0 ? (rate = 0) : rate > 1 && (rate = 1)
            return rate
        },
        _setProgress: function (rate) {
            this._progressLength = Math.floor(this.$.progress.offsetWidth * rate)
            this._progressLeft = this._progressLength - 22
        },
        _sendDanmu: function (data) {
            if (this.playing && !data.flag) {
                data.flag = !0
                var danmuItem = document.createElement('p')
                danmuItem.className += 'wx-video-danmu-item'
                danmuItem.textContent = data.text
                danmuItem.style.top = this._genDanmuPosition() + '%'
                danmuItem.style.color = data.color
                this.$.danmu.appendChild(danmuItem)
                danmuItem.style.left = '-' + danmuItem.offsetWidth + 'px'
            }
        },
        _genDanmuPosition: function () {
            if (this.lastDanmuPosition) {
                var danmuPos = 100 * Math.random()
                Math.abs(danmuPos - this.lastDanmuPosition) < 10
                    ? (this.lastDanmuPosition = (this.lastDanmuPosition + 50) % 100)
                    : (this.lastDanmuPosition = danmuPos)
            } else {
                this.lastDanmuPosition = 100 * Math.random()
            }
            return this.lastDanmuPosition
        },
        attached: function () {
            // var e = this
            var self = this
            WeixinJSBridge.publish('videoPlayerInsert', {
                domId: this.id,
                videoPlayerId: 0
            })
            this.$.default.style.display = ''
            this.$.player.style.display = ''
            this.$.player.autoplay = this.autoplay
            this.$.player.style.objectFit = this.objectFit
            console.log('attached', this.objectFit)
            this.danmuObject = this.danmuList.reduce(function (acc, danmu) {
                if (
                    typeof danmu.time === 'number' &&
                    danmu.time >= 0 &&
                    typeof danmu.text === 'string' &&
                    danmu.text.length > 0
                ) {
                    if (acc[danmu.time]) {
                        acc[danmu.time].push({
                            text: danmu.text,
                            color: danmu.color || '#ffffff'
                        })
                    } else {
                        acc[danmu.time] = [
                            {
                                text: danmu.text,
                                color: danmu.color || '#ffffff'
                            }
                        ]
                    }
                }
                return acc
            }, {})
            this.$.button.onclick = function (event) {
                event.stopPropagation()
                self.$.player[self._buttonType]()
            }
            this.$.progress.onclick = function (event) {
                event.stopPropagation()
                var rate = self._computeRate(event.clientX)
                self.$.player.currentTime = self.$.player.duration * rate
                self._resetDanmu()
            }
            this.$.fullscreen.onclick = function (event) {
                event.stopPropagation()
                wx.getPlatform() === 'android'
                    ? (self.enableFullScreen = !0)
                    : (self.enableFullScreen = !self.enableFullScreen)
                self.enableFullScreen && self.$.player.webkitEnterFullscreen()
                self.triggerEvent('togglefullscreen', {
                    enable: self.enableFullScreen
                })
            }
            this.$.danmuBtn.onclick = function (event) {
                event.stopPropagation()
                self.enableDanmu = !self.enableDanmu
                self.triggerEvent('toggledanmu', {
                    enable: self.enableDanmu
                })
            }

            WeixinJSBridge.subscribe('video_' + this.id + '_actionChanged', function (
                res
            ) {
                self.action = res
                self.actionChanged(res)
            })
        },
        onTimeUpdate: function (event) {
            var self = this
            event.stopPropagation()
            var rate = this.$.player.currentTime / this.$.player.duration
            this._isLockTimeUpdateProgress || this._setProgress(rate)
            var danmuList = this.danmuObject[parseInt(this.$.player.currentTime)]
            void 0 !== danmuList &&
            danmuList.length > 0 &&
            danmuList.forEach(function (danmu) {
                self._sendDanmu(danmu)
            })
        },
        detached: function () {},
        onBallTouchStart: function () {
            if (!this.isLive) {
                var self = this
                self._isLockTimeUpdateProgress = !0
                var touchMoveHandler = function (event) {
                    event.stopPropagation()
                    event.preventDefault()
                    self._rate = self._computeRate(event.touches[0].clientX)
                    self._setProgress(self._rate)
                }
                var touchEndHandler = function touchEndHandler (event) {
                    self.$.player.currentTime = self.$.player.duration * self._rate
                    document.removeEventListener('touchmove', touchMoveHandler)
                    document.removeEventListener('touchend', touchEndHandler)
                    self._isLockTimeUpdateProgress = !1
                    self._resetDanmu()
                }
                document.addEventListener('touchmove', touchMoveHandler)
                document.addEventListener('touchend', touchEndHandler)
            }
        },
        _resetDanmu: function () {
            var self = this
            this.$.danmu.innerHTML = ''
            Object.keys(this.danmuObject).forEach(function (danmuListKey) {
                self.danmuObject[danmuListKey].forEach(function (danmu) {
                    danmu.flag = !1
                })
            })
        }
    })
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
        handlersChanged: function () {
            this._update()
        },
        _reset: function () {
            this._buttonType = 'play'
            this._currentTime = '00:00'
            this._duration = '00:00'
            this._progressLeft = -22
            this._progressLength = 0
            this._barType = this.controls ? 'full' : 'part'
        },
        _update: function () {
            var opt = arguments.length <= 0 || void 0 === arguments[0]
                    ? {}
                    : arguments[0],
                _this = this
            opt.videoPlayerId = this._videoId
            opt.hide = this.hidden
            var _data = this._getData()
            opt.needEvent = Object.keys(_data.handlers).length > 0
            opt.objectFit = this.objectFit
            opt.showBasicControls = this.controls
            opt.showDanmuBtn = this.danmuBtn
            opt.enableDanmu = this.enableDanmu
            opt.data = JSON.stringify(_data)
            this.duration > 0 && (opt.duration = this.duration)
            WeixinJSBridge.invoke('updateVideoPlayer', opt, function (data) {
                ;/ok/.test(data.errMsg) ||
                _this._publish('error', {
                    errMsg: data.errMsg
                })
            })
        },
        _updatePosition: function () {
            if (this._isiOS()) {
                this._update(
                    {
                        position: this._box
                    },
                    '位置'
                )
            } else {
                this.$.player.width = this._box.width
                this.$.player.height = this._box.height
            }
        },
        _hiddenChanged: function (isHidden) {
            if (this._isiOS()) {
                this.$$.style.display = isHidden ? 'none' : ''
                this._update(
                    {
                        hide: isHidden
                    },
                    isHidden ? '隐藏' : '显示'
                )
            } else {
                this.$.player.pause()
                this.$$.style.display = isHidden ? 'none' : ''
            }
        },
        posterChanged: function (posterUrl, t) {
            if (!this._isError) {
                if (this._isReady) {
                    this._isiOS() &&
                    (/http:\/\//.test(posterUrl) || /https:\/\//.test(posterUrl))
                        ? this._update(
                        {
                            poster: posterUrl
                        },
                        '封面'
                    )
                        : (this.$.player.poster = posterUrl)
                    return void 0
                } else {
                    this._deferred.push({
                        callback: 'posterChanged',
                        args: [posterUrl, t]
                    })
                    return void 0
                }
            }
        },
        srcChanged: function (srcUrl, t) {
            if (!this._isError && srcUrl) {
                if (!this._isReady) {
                    return void this._deferred.push({
                        callback: 'srcChanged',
                        args: [srcUrl, t]
                    })
                }
                if (this._isiOS()) {
                    ;/wdfile:\/\//.test(srcUrl) ||
                    /http:\/\//.test(srcUrl) ||
                    /https:\/\//.test(srcUrl)
                        ? this._update(
                            {
                                filePath: srcUrl
                            },
                            '资源'
                        )
                        : this._publish('error', {
                            errMsg: 'MEDIA_ERR_SRC_NOT_SUPPORTED'
                        })
                } else if (this._isDevTools()) {
                    this.$.player.src = srcUrl.replace(
                        'wdfile://',
                        'http://wxfile.open.weixin.qq.com/'
                    )
                    var self = this
                    setTimeout(function () {
                        self._reset()
                    }, 0)
                } else {
                    this.$.player.src = srcUrl
                    var self = this
                    setTimeout(function () {
                        self._reset()
                    }, 0)
                }
            }
        },
        controlsChanged: function (show, t) {
            this._update({})
            this.$.controls.style.display = show ? 'flex' : 'none'
        },
        danmuBtnChanged: function (show, t) {
            this._update({})
            this.$.danmuBtn.style.display = show ? '' : 'none'
        },
        enableDanmuChanged: function (isActive, t) {
            this._update({})
            this._danmuStatus = isActive ? 'active' : ''
            this.$.danmu.style.zIndex = isActive ? '0' : '-9999'
        },
        actionChanged: function (action, t) {
            if (this._isiOS()) {
            } else {
                if (typeof action !== 'object') return
                var method = action.method, data = action.data
                if (method === 'play') {
                    this.$.player.play()
                } else if (method === 'pause') {
                    this.$.player.pause()
                } else if (method === 'seek') {
                    this.$.player.currentTime = data[0]
                    this._resetDanmu()
                } else if (method === 'sendDanmu') {
                    var danmuData = _slicedToArray(data, 2),
                        txt = danmuData[0],
                        color = danmuData[1],
                        time = parseInt(this.$.player.currentTime)
                    this.danmuObject[time]
                        ? this.danmuObject[time].push({
                        text: txt,
                        color: color,
                        time: time
                    })
                        : (this.danmuObject[time] = [
                        {
                            text: txt,
                            color: color,
                            time: time
                        }
                    ])
                }
            }
        },
        onPlay: function (e) {
            var self = this,
                danmuItems = document.querySelectorAll('.wx-video-danmu-item')
            Array.prototype.forEach.apply(danmuItems, [
                function (danmuItem) {
                    var transitionDuration =
                        3 *
                        (parseInt(getComputedStyle(danmuItem).left) +
                        danmuItem.offsetWidth) /
                        (danmuItem.offsetWidth + self.$$.offsetWidth)
                    danmuItem.style.left = '-' + danmuItem.offsetWidth + 'px'
                    danmuItem.style.transitionDuration =
                        transitionDuration + 'checkScrollBottom'
                    danmuItem.style.webkitTransitionDuration =
                        transitionDuration + 'checkScrollBottom'
                }
            ])
            this.bindplay &&
            wx.publishPageEvent(this.bindplay, {
                type: 'play'
            })
        },
        onPause: function (e) {
            var danmuItems = document.querySelectorAll('.wx-video-danmu-item')
            Array.prototype.forEach.apply(danmuItems, [
                function (danmuItem) {
                    danmuItem.style.left = getComputedStyle(danmuItem).left
                }
            ]), wx.publishPageEvent(this.bindpause, {
                type: 'pause'
            })
        },
        onEnded: function (e) {
            wx.publishPageEvent(this.bindended, {
                type: 'ended'
            })
        },
        _computeRate: function (targetPos) {
            var elapsed = this.$.progress.getBoundingClientRect().left,
                totalTime = this.$.progress.offsetWidth,
                rate = (targetPos - elapsed) / totalTime
            rate < 0 ? (rate = 0) : rate > 1 && (rate = 1)
            return rate
        },
        _setProgress: function (rate) {
            this._progressLength = Math.floor(this.$.progress.offsetWidth * rate)
            this._progressLeft = this._progressLength - 22
        },
        _sendDanmu: function (data) {
            if (this.playing && !data.flag) {
                data.flag = !0
                var danmuEle = document.createElement('p')
                danmuEle.className += 'wx-video-danmu-item'
                danmuEle.textContent = data.text
                danmuEle.style.top = this._genDanmuPosition() + '%'
                danmuEle.style.color = data.color
                this.$.danmu.appendChild(danmuEle)
                danmuEle.style.left = '-' + danmuEle.offsetWidth + 'px'
            }
        },
        _genDanmuPosition: function () {
            if (this.lastDanmuPosition) {
                var danmuPos = 100 * Math.random()
                Math.abs(danmuPos - this.lastDanmuPosition) < 10
                    ? (this.lastDanmuPosition = (this.lastDanmuPosition + 50) % 100)
                    : (this.lastDanmuPosition = danmuPos)
            } else {
                this.lastDanmuPosition = 100 * Math.random()
            }
            return this.lastDanmuPosition
        },
        attached: function () {
            var self2 = this, self = this
            if (this._isiOS()) {
                this._box = this._getBox()
                var data = this._getData()
                var opt = {
                    data: JSON.stringify(data),
                    needEvent: Object.keys(data.handlers).length > 0,
                    position: this._box,
                    hide: this.hidden,
                    enableDanmu: this.enableDanmu,
                    showDanmuBtn: this.danmuBtn,
                    showBasicControls: this.controls,
                    objectFit: this.objectFit,
                    autoplay: this.autoplay,
                    danmuList: this.danmuList
                }
                this.duration > 0 && (opt.duration = this.duration)
                WeixinJSBridge.invoke('insertVideoPlayer', opt, function (res) {
                    if (/ok/.test(res.errMsg)) {
                        self._videoId = res.videoPlayerId
                        self._ready()
                        self.createdTimestamp = Date.now()
                        document.addEventListener(
                            'pageReRender',
                            self._pageReRenderCallback.bind(self)
                        )
                        WeixinJSBridge.publish('videoPlayerInsert', {
                            domId: self.id,
                            videoPlayerId: res.videoPlayerId
                        })
                    } else {
                        self._isError = !0
                        self.$$.style.display = 'none'
                        self._publish('error', {
                            errMsg: res.errMsg
                        })
                    }
                })
            } else {
                WeixinJSBridge.publish('videoPlayerInsert', {
                    domId: this.id,
                    videoPlayerId: 0
                })
            }
            this.$.default.style.display = ''
            this.$.player.style.display = ''
            this.$.player.autoplay = this.autoplay
            this.danmuObject = this.danmuList.reduce(function (acc, danmuItem) {
                if (
                    typeof danmuItem.time === 'number' &&
                    danmuItem.time >= 0 &&
                    typeof danmuItem.text === 'string' &&
                    danmuItem.text.length > 0
                ) {
                    if (acc[danmuItem.time]) {
                        acc[danmuItem.time].push({
                            text: danmuItem.text,
                            color: danmuItem.color || '#ffffff'
                        })
                    } else {
                        acc[danmuItem.time] = [
                            {
                                text: danmuItem.text,
                                color: danmuItem.color || '#ffffff'
                            }
                        ]
                    }
                }

                return acc
            }, {})
            this.$.button.onclick = function (event) {
                event.stopPropagation(), self.$.player[self._buttonType]()
            }
            this.$.progress.onclick = function (event) {
                event.stopPropagation()
                var rate = self._computeRate(event.clientX)
                self.$.player.currentTime = self.$.player.duration * rate
                self._resetDanmu()
            }
            this.$.fullscreen.onclick = function (event) {
                event.stopPropagation()
                self.enableFullScreen = !self.enableFullScreen
                self.enableFullScreen && self.$.player.webkitEnterFullscreen()
                self.triggerEvent('togglefullscreen', {
                    enable: self.enableFullScreen
                })
            }
            this.$.danmuBtn.onclick = function (event) {
                event.stopPropagation()
                self.enableDanmu = !self.enableDanmu
                self.triggerEvent('toggledanmu', {
                    enable: self.enableDanmu
                })
            }
            this._ready()
            document.addEventListener(
                'pageReRender',
                this._pageReRenderCallback.bind(this)
            )
            WeixinJSBridge.subscribe('video_' + this.id + '_actionChanged', function (
                res
            ) {
                self2.action = res
                self2.actionChanged(res)
            })
        },
        onTimeUpdate: function (event) {
            var self = this
            event.stopPropagation()
            var rate = this.$.player.currentTime / this.$.player.duration
            this._isLockTimeUpdateProgress || this._setProgress(rate)
            var danmuList = this.danmuObject[parseInt(this.$.player.currentTime)]
            void 0 !== danmuList &&
            danmuList.length > 0 &&
            danmuList.forEach(function (danmu) {
                self._sendDanmu(danmu)
            })
            this.bindtimeupdate &&
            wx.publishPageEvent(this.bindtimeupdate, {
                type: 'timeupdate',
                detail: {
                    currentTime: this.$.player.currentTime,
                    duration: this.$.player.duration
                }
            })
        },
        detached: function () {
            this._isiOS() &&
            wx.removeVideoPlayer({
                videoPlayerId: this._videoId,
                success: function (e) {}
            }), WeixinJSBridge.publish('videoPlayerRemoved', {
                domId: this.id,
                videoPlayerId: this.videoPlayerId
            })
        },
        onBallTouchStart: function () {
            var self = this
            self._isLockTimeUpdateProgress = !0
            var touchmove = function (event) {
                event.stopPropagation()
                event.preventDefault()
                self._rate = self._computeRate(event.touches[0].clientX)
                self._setProgress(self._rate)
            }
            var touchend = function touchend (event) {
                self.$.player.currentTime = self.$.player.duration * self._rate
                document.removeEventListener('touchmove', touchmove)
                document.removeEventListener('touchend', touchend)
                self._isLockTimeUpdateProgress = !1
                self._resetDanmu()
            }
            document.addEventListener('touchmove', touchmove)
            document.addEventListener('touchend', touchend)
        },
        _resetDanmu: function () {
            var self = this
            this.$.danmu.innerHTML = ''
            Object.keys(this.danmuObject).forEach(function (danmuListKey) {
                self.danmuObject[danmuListKey].forEach(function (danmu) {
                    danmu.flag = !1
                })
            })
        },
        _getData: function () {
            var self = this
            return {
                handlers: [
                    'bindplay',
                    'bindpause',
                    'bindended',
                    'bindtimeupdate'
                ].reduce(function (acc, handlerName) {
                    handlerName && (acc[handlerName] = self[handlerName])
                    return acc
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
            }
        }
    })
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
