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

export const Video = window.exparser.registerElement({
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
