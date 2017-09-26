function addPXSuffix (num) {
  return typeof num === 'number' ? num + 'px' : num
}

function addDegSuffix (num) {
  return num + 'deg'
}

var words = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=',
  btoa =
    btoa ||
    function (str) {
      for (
        var curPosFlag,
          curCodeValue,
          text = String(str),
          res = '',
          i = 0,
          wordTpl = words;
        text.charAt(0 | i) || ((wordTpl = '='), i % 1);
        res += wordTpl.charAt(63 & (curPosFlag >> (8 - (i % 1) * 8)))
      ) {
        curCodeValue = text.charCodeAt((i += 0.75))
        if (curCodeValue > 255) throw new Error('"btoa" failed')
        curPosFlag = (curPosFlag << 8) | curCodeValue
      }
      return res
    },
  atob =
    atob ||
    function (str) {
      var text = String(str).replace(/=+$/, ''),
        res = ''
      if (text.length % 4 === 1) throw new Error('"atob" failed')
      for (
        var curFlage, curValue, i = 0, a = 0;
        (curValue = text.charAt(a++));
        ~curValue &&
        ((curFlage = i % 4 ? 64 * curFlage + curValue : curValue), i++ % 4)
          ? (res += String.fromCharCode(255 & (curFlage >> ((-2 * i) & 6))))
          : 0
      ) {
        curValue = words.indexOf(curValue)
      }
      return res
    }

class setSelect {
  constructor (t, n, r) {
    ;(this._selectorQuery = t), (this._selector = n), (this._single = r)
  }

  fields (e, t) {
    return (
      this._selectorQuery._push(this._selector, this._single, e, t),
      this._selectorQuery
    )
  }

  boundingClientRect (e) {
    return (
      this._selectorQuery._push(
        this._selector,
        this._single,
        {
          id: !0,
          dataset: !0,
          rect: !0,
          size: !0
        },
        e
      ),
      this._selectorQuery
    )
  }

  scrollOffset (e) {
    return (
      this._selectorQuery._push(
        this._selector,
        this._single,
        {
          id: !0,
          dataset: !0,
          scrollOffset: !0
        },
        e
      ),
      this._selectorQuery
    )
  }
}
class wxQuerySelector {
  constructor (t) {
    this._webviewId = t
    this._queue = []
    this._queueCb = []
  }

  select (e) {
    return new setSelect(this, e, !0)
  }

  selectAll (e) {
    return new setSelect(this, e, !1)
  }

  selectViewport () {
    return new setSelect(this, 'viewport', !0)
  }

  _push (e, t, n, o) {
    this._queue.push({ selector: e, single: t, fields: n }),
    this._queueCb.push(o || null)
  }

  exec (e) {
    var t = this
    u(this._webviewId, this._queue, function (n) {
      var o = t._queueCb
      n.forEach(function (e, n) {
        typeof o[n] === 'function' && o[n].call(t, e)
      }),
      typeof e === 'function' && e.call(t, n)
    })
  }
}
class AppServiceSdkKnownError extends Error {
  constructor (e) {
    super('APP-SERVICE-SDK:' + e)
    this.type = 'AppServiceSdkKnownError'
  }
}
class AppServiceEngineKnownError extends Error {
  constructor (e) {
    super('APP-SERVICE-Engine:' + e)
    this.type = 'AppServiceEngineKnownError'
  }
}

/*
var Components = {
  //components
  audio: {"1.0.0": ["id", "src", "loop", "controls", "poster", "name", "author", "binderror", "bindplay", "bindpause", "bindtimeupdate", "bindended"]},
  button: {
    "1.0.0": [{size: ["default", "mini"]}, {type: ["primary", "default", "warn"]}, "plain", "disabled", "loading", {"form-type": ["submit", "reset"]}, "hover-class", "hover-start-time", "hover-stay-time"],
    "1.1.0": [{"open-type": ["contact"]}],
    "1.2.0": [{"open-type": ["share"]}],
    "1.4.0": ["session-from"],
    "1.3.0": [{"open-type": ["getUserInfo"]}]
  },
  canvas: {"1.0.0": ["canvas-id", "disable-scroll", "bindtouchstart", "bindtouchmove", "bindtouchend", "bindtouchcancel", "bindlongtap", "binderror"]},
  "checkbox-group": {"1.0.0": ["bindchange"]},
  checkbox: {"1.0.0": ["value", "disabled", "checked", "color"]},
  "contact-button": {"1.0.0": ["size", {type: ["default-dark", "default-light"]}, "session-from"]},
  "cover-view": {"1.4.0": []},
  "cover-image": {"1.4.0": ["src"]},
  form: {"1.0.0": ["report-submit", "bindsubmit", "bindreset"], "1.2.0": ["bindautofill"]},
  icon: {"1.0.0": [{type: ["success", "success_no_circle", "info", "warn", "waiting", "cancel", "download", "search", "clear"]}, "size", "color"]},
  image: {"1.0.0": ["src", {mode: ["scaleToFill", "aspectFit", "aspectFill", "widthFix", "top", "bottom", "center", "left", "right", "top left", "top right", "bottom left", "bottom right"]}, "binderror", "bindload"]},
  input: {
    "1.0.0": ["value", {type: ["text", "number", "idcard", "digit"]}, "password", "placeholder", "placeholder-style", "placeholder-class", "disabled", "maxlength", "cursor-spacing", "auto-focus", "focus", "bindinput", "bindfocus", "bindblur", "bindconfirm"],
    "1.1.0": [{"confirm-type": ["send", "search", "next", "go", "done"]}, "confirm-hold"],
    "1.2.0": ["auto-fill"]
  },
  label: {"1.0.0": ["for"]},
  map: {
    "1.0.0": ["longitude", "latitude", "scale", {markers: ["id", "latitude", "longitude", "title", "iconPath", "rotate", "alpha", "width", "height"]}, "covers", {polyline: ["points", "color", "width", "dottedLine"]}, {circles: ["latitude", "longitude", "color", "fillColor", "radius", "strokeWidth"]}, {controls: ["id", "position", "iconPath", "clickable"]}, "include-points", "show-location", "bindmarkertap", "bindcontroltap", "bindregionchange", "bindtap"],
    "1.2.0": [{markers: ["callout", "label", "anchor"]}, {polyline: ["arrowLine", "borderColor", "borderWidth"]}, "bindcallouttap"]
  },
  modal: {"1.0.0": []},
  "movable-area": {"1.2.0": []},
  "movable-view": {"1.2.0": ["direction", "inertia", "out-of-bounds", "x", "y", "damping", "friction"]},
  navigator: {
    "1.0.0": ["url", {"open-type": ["navigate", "redirect", "switchTab"]}, "delta", "hover-class", "hover-start-time", "hover-stay-time"],
    "1.1.0": [{"open-type": ["reLaunch", "navigateBack"]}]
  },
  "open-data": {"1.4.0": [{type: ["groupName"]}, "open-gid"]},
  "picker-view": {"1.0.0": ["value", "indicator-style", "bindchange"], "1.1.0": ["indicator-class"]},
  "picker-view-column": {"1.0.0": []},
  picker: {
    "1.0.0": ["range", "range-key", "value", "bindchange", "disabled", "start", "end", {fields: ["year", "month", "day"]}, {mode: ["selector", "date", "time"]}],
    "1.2.0": ["auto-fill"],
    "1.4.0": ["bindcolumnchange", {mode: ["multiSelector", "region"]}]
  },
  progress: {"1.0.0": ["percent", "show-info", "stroke-width", "color", "activeColor", "backgroundColor", "active"]},
  "radio-group": {"1.0.0": ["bindchange"]},
  radio: {"1.0.0": ["value", "checked", "disabled", "color"]},
  "rich-text": {"1.4.0": [{nodes: ["name", "attrs", "children"]}]},
  "scroll-view": {"1.0.0": ["scroll-x", "scroll-y", "upper-threshold", "lower-threshold", "scroll-top", "scroll-left", "scroll-into-view", "scroll-with-animation", "enable-back-to-top", "bindscrolltoupper", "bindscrolltolower", "bindscroll"]},
  slider: {"1.0.0": ["min", "max", "step", "disabled", "value", "color", "selected-color", "activeColor", "backgroundColor", "show-value", "bindchange"]},
  swiper: {
    "1.0.0": ["indicator-dots", "autoplay", "current", "interval", "duration", "circular", "vertical", "bindchange"],
    "1.1.0": ["indicator-color", "indicator-active-color"]
  },
  "swiper-item": {"1.0.0": []},
  "switch": {"1.0.0": ["checked", {type: ["switch", "checkbox"]}, "bindchange", "color"]},
  text: {"1.0.0": [], "1.1.0": ["selectable"], "1.4.0": [{space: ["ensp", "emsp", "nbsp"]}, "decode"]},
  textarea: {
    "1.0.0": ["value", "placeholder", "placeholder-style", "placeholder-class", "disabled", "maxlength", "auto-focus", "focus", "auto-height", "fixed", "cursor-spacing", "bindfocus", "bindblur", "bindlinechange", "bindinput", "bindconfirm"],
    "1.2.0": ["auto-fill"]
  },
  video: {
    "1.0.0": ["src", "controls", "danmu-list", "danmu-btn", "enable-danmu", "autoplay", "bindplay", "bindpause", "bindended", "bindtimeupdate", "objectFit", "poster"],
    "1.1.0": ["duration"],
    "1.4.0": ["loop", "muted", "bindfullscreenchange"]
  },
  view: {"1.0.0": ["hover-class", "hover-start-time", "hover-stay-time"]}
};
var APIs = {
  //APIS
  onAccelerometerChange: {"1.2.1": [{callback: ["x", "y", "z"]}]},
  startAccelerometer: {"1.1.0": []},
  stopAccelerometer: {"1.1.0": []},
  chooseAddress: {"1.1.0": [{success: ["userName", "postalCode", "provinceName", "cityName", "countyName", "detailInfo", "nationalCode", "telNumber"]}]},
  createAnimation: {"1.0.0": [{object: ["duration", {timingFunction: ["linear", "ease", "ease-in", "ease-in-out", "ease-out", "step-start", "step-end"]}, "delay", "transformOrigin"]}]},
  createAudioContext: {"1.0.0": []},
  canIUse: {"1.0.0": []},
  login: {"1.0.0": [{success: ["code"]}]},
  checkSession: {"1.0.0": []},
  createMapContext: {"1.0.0": []},
  requestPayment: {"1.0.0": [{object: ["timeStamp", "nonceStr", "package", "signType", "paySign"]}]},
  showToast: {"1.0.0": [{object: ["title", "icon", "duration", "mask"]}], "1.1.0": [{object: ["image"]}]},
  showLoading: {"1.1.0": [{object: ["title", "mask"]}]},
  hideToast: {"1.0.0": []},
  hideLoading: {"1.1.0": []},
  showModal: {
    "1.0.0": [{object: ["title", "content", "showCancel", "cancelText", "cancelColor", "confirmText", "confirmColor"]}, {success: ["confirm"]}],
    "1.1.0": [{success: ["cancel"]}]
  },
  showActionSheet: {"1.0.0": [{object: ["itemList", "itemColor"]}, {success: ["tapIndex"]}]},
  arrayBufferToBase64: {"1.1.0": []},
  base64ToArrayBuffer: {"1.1.0": []},
  createVideoContext: {"1.0.0": []},
  authorize: {"1.2.0": [{object: ["scope"]}]},
  openBluetoothAdapter: {"1.1.0": []},
  closeBluetoothAdapter: {"1.1.0": []},
  getBluetoothAdapterState: {"1.1.0": [{success: ["discovering", "available"]}]},
  onBluetoothAdapterStateChange: {"1.1.0": [{callback: ["available", "discovering"]}]},
  startBluetoothDevicesDiscovery: {"1.1.0": [{object: ["services", "allowDuplicatesKey", "interval"]}, {success: ["isDiscovering"]}]},
  stopBluetoothDevicesDiscovery: {"1.1.0": []},
  getBluetoothDevices: {"1.1.0": [{success: ["devices"]}]},
  onBluetoothDeviceFound: {"1.1.0": [{callback: ["devices"]}]},
  getConnectedBluetoothDevices: {"1.1.0": [{object: ["services"]}, {success: ["devices"]}]},
  createBLEConnection: {"1.1.0": [{object: ["deviceId"]}]},
  closeBLEConnection: {"1.1.0": [{object: ["deviceId"]}]},
  getBLEDeviceServices: {"1.1.0": [{object: ["deviceId"]}, {success: ["services"]}]},
  getBLEDeviceCharacteristics: {"1.1.0": [{object: ["deviceId", "serviceId"]}, {success: ["characteristics"]}]},
  readBLECharacteristicValue: {"1.1.0": [{object: ["deviceId", "serviceId", "characteristicId"]}, {success: ["characteristic"]}]},
  writeBLECharacteristicValue: {"1.1.0": [{object: ["deviceId", "serviceId", "characteristicId", "value"]}]},
  notifyBLECharacteristicValueChange: {"1.1.1": [{object: ["deviceId", "serviceId", "characteristicId", "state"]}]},
  onBLEConnectionStateChange: {"1.1.1": [{callback: ["deviceId", "connected"]}]},
  onBLECharacteristicValueChange: {"1.1.0": [{callback: ["deviceId", "serviceId", "characteristicId", "value"]}]},
  captureScreen: {"1.4.0": [{success: ["tempFilePath"]}]},
  addCard: {"1.1.0": [{object: ["cardList"]}, {success: ["cardList"]}]},
  openCard: {"1.1.0": [{object: ["cardList"]}]},
  setClipboardData: {"1.1.0": [{object: ["data"]}]},
  getClipboardData: {"1.1.9": [{success: ["data"]}]},
  onCompassChange: {"1.0.0": [{callback: ["direction"]}]},
  startCompass: {"1.1.0": []},
  stopCompass: {"1.1.0": []},
  setStorage: {"1.0.0": [{object: ["key", "data"]}]},
  getStorage: {"1.0.0": [{object: ["key"]}, {success: ["data"]}]},
  getStorageSync: {"1.0.0": []},
  getStorageInfo: {"1.0.0": [{success: ["keys", "currentSize", "limitSize"]}]},
  removeStorage: {"1.0.0": [{object: ["key"]}]},
  removeStorageSync: {"1.0.0": []},
  clearStorage: {"1.0.0": []},
  clearStorageSync: {"1.0.0": []},
  getNetworkType: {"1.0.0": [{success: ["networkType"]}]},
  onNetworkStatusChange: {"1.1.0": [{callback: ["isConnected", {networkType: ["wifi", "2g", "3g", "4g", "none", "unknown"]}]}]},
  setScreenBrightness: {"1.2.0": [{object: ["value"]}]},
  getScreenBrightness: {"1.2.0": [{success: ["value"]}]},
  vibrateLong: {"1.2.0": []},
  vibrateShort: {"1.2.0": []},
  getExtConfig: {"1.1.0": [{success: ["extConfig"]}]},
  getExtConfigSync: {"1.1.0": []},
  saveFile: {"1.0.0": [{object: ["tempFilePath"]}, {success: ["savedFilePath"]}]},
  getSavedFileList: {"1.0.0": [{success: ["fileList"]}]},
  getSavedFileInfo: {"1.0.0": [{object: ["filePath"]}, {success: ["size", "createTime"]}]},
  removeSavedFile: {"1.0.0": [{object: ["filePath"]}]},
  openDocument: {"1.0.0": [{object: ["filePath"]}], "1.4.0": [{object: ["fileType"]}]},
  getBackgroundAudioManager: {"1.2.0": []},
  getFileInfo: {"1.4.0": [{object: ["filePath", {digestAlgorithm: ["md5", "sha1"]}]}, {success: ["size", "digest"]}]},
  startBeaconDiscovery: {"1.2.0": [{object: ["uuids"]}]},
  stopBeaconDiscovery: {"1.2.0": []},
  getBeacons: {"1.2.0": [{success: ["beacons"]}]},
  onBeaconUpdate: {"1.2.0": [{callback: ["beacons"]}]},
  onBeaconServiceChange: {"1.2.0": [{callback: ["available", "discovering"]}]},
  getLocation: {
    "1.0.0": [{object: ["type"]}, {success: ["latitude", "longitude", "speed", "accuracy"]}],
    "1.2.0": [{success: ["altitude", "verticalAccuracy", "horizontalAccuracy"]}]
  },
  chooseLocation: {"1.0.0": [{object: ["cancel"]}, {success: ["name", "address", "latitude", "longitude"]}]},
  openLocation: {"1.0.0": [{object: ["latitude", "longitude", "scale", "name", "address"]}]},
  getBackgroundAudioPlayerState: {"1.0.0": [{success: ["duration", "currentPosition", "status", "downloadPercent", "dataUrl"]}]},
  playBackgroundAudio: {"1.0.0": [{object: ["dataUrl", "title", "coverImgUrl"]}]},
  pauseBackgroundAudio: {"1.0.0": []},
  seekBackgroundAudio: {"1.0.0": [{object: ["position"]}]},
  stopBackgroundAudio: {"1.0.0": []},
  onBackgroundAudioPlay: {"1.0.0": []},
  onBackgroundAudioPause: {"1.0.0": []},
  onBackgroundAudioStop: {"1.0.0": []},
  chooseImage: {
    "1.0.0": [{object: ["count", "sizeType", "sourceType"]}, {success: ["tempFilePaths"]}],
    "1.2.0": [{success: ["tempFiles"]}]
  },
  previewImage: {"1.0.0": [{object: ["current", "urls"]}]},
  getImageInfo: {"1.0.0": [{object: ["src"]}, {success: ["width", "height", "path"]}]},
  saveImageToPhotosAlbum: {"1.2.0": [{object: ["filePath"]}]},
  startRecord: {"1.0.0": [{success: ["tempFilePath"]}]},
  stopRecord: {"1.0.0": []},
  chooseVideo: {"1.0.0": [{object: ["sourceType", "maxDuration", "camera"]}, {success: ["tempFilePath", "duration", "size", "height", "width"]}]},
  saveVideoToPhotosAlbum: {"1.2.0": [{object: ["filePath"]}]},
  playVoice: {"1.0.0": [{object: ["filePath"]}]},
  pauseVoice: {"1.0.0": []},
  stopVoice: {"1.0.0": []},
  navigateBackMiniProgram: {"1.3.0": [{object: ["extraData"]}]},
  navigateToMiniProgram: {"1.3.0": [{object: ["appId", "path", "extraData", "envVersion"]}]},
  uploadFile: {"1.0.0": [{object: ["url", "filePath", "name", "header", "formData"]}, {success: ["data", "statusCode"]}]},
  downloadFile: {"1.0.0": [{object: ["url", "header"]}]},
  request: {
    "1.0.0": [{object: ["url", "data", "header", {method: ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"]}, "dataType"]}, {success: ["data", "statusCode"]}],
    "1.2.0": [{success: ["header"]}]
  },
  connectSocket: {
    "1.0.0": [{object: ["url", "data", "header", {method: ["OPTIONS", "GET", "HEAD", "POST", "PUT", "DELETE", "TRACE", "CONNECT"]}]}],
    "1.4.0": [{object: ["protocols"]}]
  },
  onSocketOpen: {"1.0.0": []},
  onSocketError: {"1.0.0": []},
  sendSocketMessage: {"1.0.0": [{object: ["data"]}]},
  onSocketMessage: {"1.0.0": [{callback: ["data"]}]},
  closeSocket: {"1.0.0": [], "1.4.0": [{object: ["code", "reason"]}]},
  onSocketClose: {"1.0.0": []},
  onUserCaptureScreen: {"1.4.0": []},
  chooseContact: {"1.0.0": [{success: ["phoneNumber", "displayName"]}]},
  getUserInfo: {
    "1.0.0": [{success: ["userInfo", "rawData", "signature", "encryptedData", "iv"]}],
    "1.1.0": [{object: ["withCredentials"]}],
    "1.4.0": [{object: ["lang"]}]
  },
  addPhoneContact: {"1.2.0": [{object: ["photoFilePath", "nickName", "lastName", "middleName", "firstName", "remark", "mobilePhoneNumber", "weChatNumber", "addressCountry", "addressState", "addressCity", "addressStreet", "addressPostalCode", "organization", "title", "workFaxNumber", "workPhoneNumber", "hostNumber", "email", "url", "workAddressCountry", "workAddressState", "workAddressCity", "workAddressStreet", "workAddressPostalCode", "homeFaxNumber", "homePhoneNumber", "homeAddressCountry", "homeAddressState", "homeAddressCity", "homeAddressStreet", "homeAddressPostalCode"]}]},
  makePhoneCall: {"1.0.0": [{object: ["phoneNumber"]}]},
  stopPullDownRefresh: {"1.0.0": []},
  scanCode: {
    "1.0.0": [{success: ["result", "scanType", "charSet", "path"]}],
    "1.2.0": [{object: ["onlyFromCamera"]}]
  },
  pageScrollTo: {"1.4.0": [{object: ["scrollTop"]}]},
  setEnableDebug: {"1.4.0": [{object: ["enableDebug"]}]},
  setKeepScreenOn: {"1.4.0": [{object: ["keepScreenOn"]}]},
  setNavigationBarColor: {"1.4.0": [{object: ["frontColor", "backgroundColor", "animation", "animation.duration", {"animation.timingFunc": ["linear", "easeIn", "easeOut", "easeInOut"]}]}]},
  openSetting: {"1.1.0": [{success: ["authSetting"]}]},
  getSetting: {"1.2.0": [{success: ["authSetting"]}]},
  showShareMenu: {"1.1.0": [{object: ["withShareTicket"]}]},
  hideShareMenu: {"1.1.0": []},
  updateShareMenu: {"1.2.0": [{object: ["withShareTicket"]}], "1.4.0": [{object: ["dynamic", "widget"]}]},
  getShareInfo: {"1.1.0": [{object: ["shareTicket"]}, {callback: ["encryptedData", "iv"]}]},
  getSystemInfo: {
    "1.0.0": [{success: ["model", "pixelRatio", "windowWidth", "windowHeight", "language", "version", "system", "platform"]}],
    "1.1.0": [{success: ["screenWidth", "screenHeight", "SDKVersion"]}]
  },
  getSystemInfoSync: {
    "1.0.0": [{return: ["model", "pixelRatio", "windowWidth", "windowHeight", "language", "version", "system", "platform"]}],
    "1.1.0": [{return: ["screenWidth", "screenHeight", "SDKVersion"]}]
  },
  navigateTo: {"1.0.0": [{object: ["url"]}]},
  redirectTo: {"1.0.0": [{object: ["url"]}]},
  reLaunch: {"1.1.0": [{object: ["url"]}]},
  switchTab: {"1.0.0": [{object: ["url"]}]},
  navigateBack: {"1.0.0": [{object: ["delta"]}]},
  setNavigationBarTitle: {"1.0.0": [{object: ["title"]}]},
  showNavigationBarLoading: {"1.0.0": []},
  hideNavigationBarLoading: {"1.0.0": []},
  setTopBarText: {"1.4.2": [{object: ["text"]}]},
  getWeRunData: {"1.2.0": [{success: ["encryptedData", "iv"]}]},
  createSelectorQuery: {"1.4.0": []},
  createCanvasContext: {"1.0.0": []},
  canvasToTempFilePath: {
    "1.0.0": [{object: ["canvasId"]}],
    "1.2.0": [{object: ["x", "y", "width", "height", "destWidth", "destHeight"]}]
  },
  canvasContext: {
    "1.0.0": ["addColorStop", "arc", "beginPath", "bezierCurveTo", "clearActions", "clearRect", "closePath", "createCircularGradient", "createLinearGradient", "drawImage", "draw", "fillRect", "fillText", "fill", "lineTo", "moveTo", "quadraticCurveTo", "rect", "rotate", "save", "scale", "setFillStyle", "setFontSize", "setGlobalAlpha", "setLineCap", "setLineJoin", "setLineWidth", "setMiterLimit", "setShadow", "setStrokeStyle", "strokeRect", "stroke", "translate"],
    "1.1.0": ["setTextAlign"],
    "1.4.0": ["setTextBaseline"]
  },
  animation: {"1.0.0": ["opacity", "backgroundColor", "width", "height", "top", "left", "bottom", "right", "rotate", "rotateX", "rotateY", "rotateZ", "rotate3d", "scale", "scaleX", "scaleY", "scaleZ", "scale3d", "translate", "translateX", "translateY", "translateZ", "translate3d", "skew", "skewX", "skewY", "matrix", "matrix3d"]},
  audioContext: {"1.0.0": ["setSrc", "play", "pause", "seek"]},
  mapContext: {
    "1.0.0": ["getCenterLocation", "moveToLocation"],
    "1.2.0": ["translateMarker", "includePoints"],
    "1.4.0": ["getRegion", "getScale"]
  },
  videoContext: {
    "1.0.0": ["play", "pause", "seek", "sendDanmu"],
    "1.4.0": ["playbackRate", "requestFullScreen", "exitFullScreen"]
  },
  backgroundAudioManager: {"1.2.0": ["play", "pause", "stop", "seek", "onCanplay", "onPlay", "onPause", "onStop", "onEnded", "onTimeUpdate", "onPrev", "onNext", "onError", "onWaiting", "duration", "currentTime", "paused", "src", "startTime", "buffered", "title", "epname", "singer", "coverImgUrl", "webUrl"]},
  uploadTask: {"1.4.0": ["onProgressUpdate", "abort"]},
  downloadTask: {"1.4.0": ["onProgressUpdate", "abort"]},
  requestTask: {"1.4.0": ["abort"]},
  selectorQuery: {"1.4.0": ["select", "selectAll", "selectViewport", "exec"]},
  onBLEConnectionStateChanged: {"1.1.0": [{callback: ["deviceId", "connected"]}]},
  notifyBLECharacteristicValueChanged: {"1.1.0": [{object: ["deviceId", "serviceId", "characteristicId", "state"]}]},
  sendBizRedPacket: {"1.2.0": [{object: ["timeStamp", "nonceStr", "package", "signType", "paySign"]}]}
};
*/
const BASE_DEVICE_WIDTH = 750
const ua = window.navigator.userAgent.toLowerCase()
const platform = /(iphone|ipad)/.test(ua)
  ? 'ios'
  : /android/.test(ua) ? 'android' : ''
const screenWidth = (platform && window.innerWidth) || 375
const devicePixelRatio = window.devicePixelRatio || 2
const SMALL_NUM = 1e-4
const rpxToPxNum = function (rpxNum) {
  rpxNum = rpxNum / BASE_DEVICE_WIDTH * screenWidth
  rpxNum = Math.floor(rpxNum + SMALL_NUM)
  return rpxNum === 0
    ? devicePixelRatio !== 1 && platform == 'ios' ? 0.5 : 1
    : rpxNum
}
const parseRpx = function (matches) {
  let num = 0,
    decimalRadix = 1,
    isHandlingDecimal = !1,
    isNeg = !1,
    idx = 0
  for (; idx < matches.length; ++idx) {
    let ch = matches[idx]
    if (ch >= '0' && ch <= '9') {
      if (isHandlingDecimal) {
        decimalRadix *= 0.1
        num += (ch - '0') * decimalRadix
      } else {
        num = 10 * num + (ch - '0')
      }
    } else {
      ch === '.' ? (isHandlingDecimal = !0) : ch === '-' && (isNeg = !0)
    }
  }
  isNeg && (num = -num)
  return rpxToPxNum(num)
}
const rpxInTemplate = /%%\?[+-]?\d+(\.\d+)?rpx\?%%/g
const rpxInCSS = /(:|\s)[+-]?\d+(\.\d+)?rpx/g

const utils = {
  copyObj (distObj, orgObj) {
    for (var attrName in orgObj) {
      ;(function (attrName) {
        distObj.__defineGetter__(attrName, function () {
          return Reporter.surroundThirdByTryCatch(
            orgObj[attrName],
            'wd.' + attrName
          )
        })
      })(attrName)
    }
  },
  getPlatform: function () {
    return platform
  },
  transformRpx: function (propValue, isInCSS) {
    if (this.getDataType(propValue) !== 'String') return propValue
    let matches
    matches = isInCSS
      ? propValue.match(rpxInCSS)
      : propValue.match(rpxInTemplate)
    matches &&
      matches.forEach(function (match) {
        const pxNum = parseRpx(match)
        const cssValue = (isInCSS ? match[0] : '') + pxNum + 'px'
        propValue = propValue.replace(match, cssValue)
      })
    return propValue
  },
  getRealRoute (pathPrefix = '', pathname = '') {
    // 格式化一个路径
    if (pathname.indexOf('/') === 0) return pathname.substr(1)
    if (pathname.indexOf('./') === 0) {
      return this.getRealRoute(pathPrefix, pathname.substr(2))
    }
    var index,
      folderLength,
      folderArr = pathname.split('/')
    for (
      index = 0, folderLength = folderArr.length;
      index < folderLength && folderArr[index] === '..';
      index++
    );
    folderArr.splice(0, index)
    var prefixArr = pathPrefix.length > 0 ? pathPrefix.split('/') : []
    prefixArr.splice(prefixArr.length - index - 1, index + 1)
    var pathArr = prefixArr.concat(folderArr)
    return pathArr.join('/')
  },
  animationToStyle (params) {
    var animates = params.animates,
      option = params.option,
      opts = void 0 === option ? {} : option,
      transformOrigin = opts.transformOrigin,
      transition = opts.transition
    if (typeof transition === 'undefined' || typeof animates === 'undefined') {
      return {
        transformOrigin: '',
        transform: '',
        transition: ''
      }
    }

    var transform = animates
      .filter(function (animate) {
        var type = animate.type
        return type !== 'style'
      })
      .map(function (animate) {
        var animateType = animate.type,
          animateArgs = animate.args
        switch (animateType) {
          case 'matrix':
            return 'matrix(' + animateArgs.join(',') + ')'
          case 'matrix3d':
            return 'matrix3d(' + animateArgs.join(',') + ')'
          case 'rotate':
            return (
              (animateArgs = animateArgs.map(addDegSuffix)),
              'rotate(' + animateArgs[0] + ')'
            )
          case 'rotate3d':
            return (
              (animateArgs[3] = addDegSuffix(animateArgs[3])),
              'rotate3d(' + animateArgs.join(',') + ')'
            )
          case 'rotateX':
            return (
              (animateArgs = animateArgs.map(addDegSuffix)),
              'rotateX(' + animateArgs[0] + ')'
            )
          case 'rotateY':
            return (
              (animateArgs = animateArgs.map(addDegSuffix)),
              'rotateY(' + animateArgs[0] + ')'
            )
          case 'rotateZ':
            return (
              (animateArgs = animateArgs.map(addDegSuffix)),
              'rotateZ(' + animateArgs[0] + ')'
            )
          case 'scale':
            return 'scale(' + animateArgs.join(',') + ')'
          case 'scale3d':
            return 'scale3d(' + animateArgs.join(',') + ')'
          case 'scaleX':
            return 'scaleX(' + animateArgs[0] + ')'
          case 'scaleY':
            return 'scaleY(' + animateArgs[0] + ')'
          case 'scaleZ':
            return 'scaleZ(' + animateArgs[0] + ')'
          case 'translate':
            return (
              (animateArgs = animateArgs.map(addPXSuffix)),
              'translate(' + animateArgs.join(',') + ')'
            )
          case 'translate3d':
            return (
              (animateArgs = animateArgs.map(addPXSuffix)),
              'translate3d(' + animateArgs.join(',') + ')'
            )
          case 'translateX':
            return (
              (animateArgs = animateArgs.map(addPXSuffix)),
              'translateX(' + animateArgs[0] + ')'
            )
          case 'translateY':
            return (
              (animateArgs = animateArgs.map(addPXSuffix)),
              'translateY(' + animateArgs[0] + ')'
            )
          case 'translateZ':
            return (
              (animateArgs = animateArgs.map(addPXSuffix)),
              'translateZ(' + animateArgs[0] + ')'
            )
          case 'skew':
            return (
              (animateArgs = animateArgs.map(addDegSuffix)),
              'skew(' + animateArgs.join(',') + ')'
            )
          case 'skewX':
            return (
              (animateArgs = animateArgs.map(addDegSuffix)),
              'skewX(' + animateArgs[0] + ')'
            )
          case 'skewY':
            return (
              (animateArgs = animateArgs.map(addDegSuffix)),
              'skewY(' + animateArgs[0] + ')'
            )
          default:
            return ''
        }
      })
      .join(' ')

    var style = animates
      .filter(function (animate) {
        var type = animate.type
        return type === 'style'
      })
      .reduce(function (res, cur) {
        return (res[cur.args[0]] = cur.args[1]), res
      }, {})

    var transitionProperty = ['transform'].concat(Object.keys(style)).join(',')

    return {
      style: style,
      transformOrigin: transformOrigin,
      transform: transform,
      transitionProperty: transitionProperty,
      transition:
        transition.duration +
        'ms ' +
        transition.timingFunction +
        ' ' +
        transition.delay +
        'ms'
    }
  },
  // service
  anyTypeToString (data) {
    // 把e转成string并返回一个对象
    var dataType = this.getDataType(data)
    if (dataType == 'Array' || dataType == 'Object') {
      try {
        data = JSON.stringify(data)
      } catch (e) {
        e.type = 'AppServiceSdkKnownError'
        throw e
      }
    } else {
      data =
        dataType == 'String' || dataType == 'Number' || dataType == 'Boolean'
          ? data.toString()
          : dataType == 'Date'
            ? data.getTime().toString()
            : dataType == 'Undefined'
              ? 'undefined'
              : dataType == 'Null' ? 'null' : ''
    }
    return {
      data: data,
      dataType: dataType
    }
  },
  stringToAnyType (data, type) {
    // 把e解码回来，和前面a相对应

    return (data =
      type == 'String'
        ? data
        : type == 'Array' || type == 'Object'
          ? JSON.parse(data)
          : type == 'Number'
            ? parseFloat(data)
            : type == 'Boolean'
              ? data == 'true'
              : type == 'Date'
                ? new Date(parseInt(data))
                : type == 'Undefined' ? void 0 : type == 'Null' ? null : '')
  },
  getDataType (data) {
    // get data type
    return Object.prototype.toString
      .call(data)
      .split(' ')[1]
      .split(']')[0]
  },
  isPlainObject (e) {
    return this.getDataType(e) === 'Object'
  },
  paramCheck (params, paramTpl) {
    // 比较e\t
    var result,
      name =
        arguments.length > 2 && void 0 !== arguments[2]
          ? arguments[2]
          : 'parameter',
      tplTpye = this.getDataType(paramTpl),
      pType = this.getDataType(params)
    if (pType != tplTpye) {
      return name + ' should be ' + tplTpye + ' instead of ' + pType + ';'
    }
    switch (((result = ''), tplTpye)) {
      case 'Object':
        for (var i in paramTpl) {
          result += this.paramCheck(params[i], paramTpl[i], name + '.' + i)
        }
        break
      case 'Array':
        if (params.length < paramTpl.length) {
          return name + ' should have at least ' + paramTpl.length + ' item;'
        }
        for (var a = 0; a < paramTpl.length; ++a) {
          result += this.paramCheck(
            params[a],
            paramTpl[a],
            name + '[' + a + ']'
          )
        }
    }
    return result
  },
  urlEncodeFormData (data) {
    // 把对象生成queryString
    var needEncode =
      arguments.length > 1 && void 0 !== arguments[1] && arguments[1]
    if (typeof data !== 'object') return data
    var tmpArr = []
    for (var o in data) {
      if (data.hasOwnProperty(o)) {
        if (needEncode) {
          try {
            tmpArr.push(
              encodeURIComponent(o) + '=' + encodeURIComponent(data[o])
            )
          } catch (t) {
            tmpArr.push(o + '=' + data[o])
          }
        } else tmpArr.push(o + '=' + data[o])
      }
    }
    return tmpArr.join('&')
  },
  addQueryStringToUrl (originalUrl, newParams) {
    // 生成url t:param obj
    if (
      typeof originalUrl === 'string' &&
      typeof newParams === 'object' &&
      Object.keys(newParams).length > 0
    ) {
      var urlComponents = originalUrl.split('?'),
        host = urlComponents[0],
        oldParams = (urlComponents[1] || '')
          .split('&')
          .reduce(function (res, cur) {
            if (typeof cur === 'string' && cur.length > 0) {
              var curArr = cur.split('='),
                key = curArr[0],
                value = curArr[1]
              res[key] = value
            }
            return res
          }, {}),
        refinedNewParams = Object.keys(newParams).reduce(function (res, cur) {
          typeof newParams[cur] === 'object'
            ? (res[encodeURIComponent(cur)] = encodeURIComponent(
              JSON.stringify(newParams[cur])
            ))
            : (res[encodeURIComponent(cur)] = encodeURIComponent(
              newParams[cur]
            ))
          return res
        }, {})
      return (
        host +
        '?' +
        this.urlEncodeFormData(this.assign(oldParams, refinedNewParams))
      )
    }
    return originalUrl
  },
  validateUrl (url) {
    return /^(http|https):\/\/.*/i.test(url)
  },
  assign () {
    // endext 对象合并
    const args = Array.prototype.slice.apply(arguments)
    return args.reduce(function (res, cur) {
      for (var n in cur) {
        res[n] = cur[n]
      }
      return res
    }, {})
  },
  encodeUrlQuery (url) {
    // 把url中的参数encode
    if (typeof url === 'string') {
      var urlArr = url.split('?'),
        urlPath = urlArr[0],
        queryParams = (urlArr[1] || '').split('&').reduce(function (res, cur) {
          if (typeof cur === 'string' && cur.length > 0) {
            var curArr = cur.split('='),
              key = curArr[0],
              value = curArr[1]
            res[key] = value
          }
          return res
        }, {}),
        urlQueryArr = []
      for (var i in queryParams) {
        queryParams.hasOwnProperty(i) &&
          urlQueryArr.push(i + '=' + encodeURIComponent(queryParams[i]))
      }
      return urlQueryArr.length > 0
        ? urlPath + '?' + urlQueryArr.join('&')
        : url
    }
    return url
  },
  addHTMLSuffix (url) {
    // 给url加上。html的扩展名
    if (typeof url !== 'string') {
      return url
    }
    var urlArr = url.split('?')
    urlArr[0] += '.html'
    return typeof urlArr[1] !== 'undefined'
      ? urlArr[0] + '?' + urlArr[1]
      : urlArr[0]
  },
  arrayBufferToBase64 (buffer) {
    for (
      var res = '',
        arr = new Uint8Array(buffer),
        arrLeng = arr.byteLength,
        r = 0;
      r < arrLeng;
      r++
    ) {
      res += String.fromCharCode(arr[r])
    }
    return btoa(res)
  },
  base64ToArrayBuffer (str) {
    for (
      var atobStr = atob(str),
        leng = atobStr.length,
        arr = new Uint8Array(leng),
        r = 0;
      r < leng;
      r++
    ) {
      arr[r] = atobStr.charCodeAt(r)
    }
    return arr.buffer
  },
  blobToArrayBuffer (blobStr, callback) {
    // readAsArrayBuffer t:callback
    var fileReader = new FileReader()
    fileReader.onload = function () {
      callback(this.result)
    }
    fileReader.readAsArrayBuffer(blobStr)
  },
  convertObjectValueToString (obj) {
    // 把对象元素都转成字符串
    return Object.keys(obj).reduce(function (res, cur) {
      typeof obj[cur] === 'string'
        ? (res[cur] = obj[cur])
        : typeof obj[cur] === 'number'
          ? (res[cur] = obj[cur] + '')
          : (res[cur] = Object.prototype.toString.apply(obj[cur]))
      return res
    }, {})
  },
  renameProperty (obj, oldName, newName) {
    this.isPlainObject(obj) !== !1 &&
      oldName != newName &&
      obj.hasOwnProperty(oldName) &&
      ((obj[newName] = obj[oldName]), delete obj[oldName])
  },
  toArray (arg) {
    // 把e转成array
    if (Array.isArray(arg)) {
      for (var t = 0, n = Array(arg.length); t < arg.length; t++) n[t] = arg[t]
      return n
    }
    return Array.from(arg)
  },
  canIUse (params, version) {
    return true
    /*
    var name = params[0];//API或组件名
    if(Components[name]){
      return this.isComponentExist(params);
    } else if(APIs[name]){
      return this.isAPIExist(params);
    } else{
      return false;
    }
*/
  },
  /*  isComponentExist(params){
    var name = params[0],//组件名
      attribute = params[1],//属性名
      option = params[2],//组件属性可选值
      component = Components[name];
    if(!attribute){
      return true;
    } else{
      for(var key in component){
        for(var i=0;i<component[key].length;i++){
          if("string" == typeof component[key][i] && component[key][i] == attribute) {
            return true;
          } else if(component[key][i][attribute]){
            if(!option){
              return true;
            } else if(component[key][i][attribute].indexOf(option)>-1){
              return true;
            }
          }
        }
      }
      return false;
    }
  },
  isAPIExist(params){
    var name = params[0],//API名
      method = params[1],//调用方式：有效值为return, success, object, callback
      param = params[2],//组件属性可选值
      options = params[3],
      methods = ["return", "success", "object", "callback"],
      api = APIs[name];
    if(!method){
      return true;
    } else if(methods.indexOf(method)<0){
      return false;
    } else{
      for(var key in api){
        for(var i=0;i<key.length;i++){
          if("object" == typeof api[key][i] && api[key][i][method]) {
            if(!param){
              return true;
            } else{
              for(var j= 0;j<api[key][i][method].length;j++){
                if(typeof api[key][i][method][j] == "string" &&api[key][i][method][j] == param){
                  return true;
                } else if (typeof api[key][i][method][j] == "object" && api[key][i][method][j][param]){
                  if(!options){
                    return true;
                  } else if(api[key][i][method][j][param].indexOf(options)>-1){
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
  }, */
  transWxmlToHtml (url) {
    if (typeof url !== 'string') return url
    var urlArr = url.split('?')
    return (
      (urlArr[0] += '.html'),
      void 0 !== urlArr[1] ? urlArr[0] + '?' + urlArr[1] : urlArr[0]
    )
  },
  removeHtmlSuffixFromUrl (url) {
    return typeof url === 'string'
      ? url.indexOf('?') !== -1
        ? url.replace(/\.html\?/, '?')
        : url.replace(/\.html$/, '')
      : url
  },
  AppServiceSdkKnownError: AppServiceSdkKnownError,
  AppServiceEngineKnownError: AppServiceEngineKnownError,
  defaultRunningStatus: 'active',
  wxQuerySelector: wxQuerySelector,

  safeInvoke () {
    // do page method
    var res = void 0,
      args = Array.prototype.slice.call(arguments),
      fn = args[0]
    args = args.slice(1)
    try {
      var startTime = Date.now()
      res = this[fn].apply(this, args)
      var doTime = Date.now() - startTime
      doTime > 1e3 &&
        Reporter.slowReport({
          key: 'pageInvoke',
          cost: doTime,
          extend: 'at ' + this.__route__ + ' page ' + fn + ' function'
        })
    } catch (e) {
      Reporter.thirdErrorReport({
        error: e,
        extend: 'at "' + this.__route__ + '" page ' + fn + ' function'
      })
    }
    return res
  },
  isEmptyObject (obj) {
    for (var t in obj) {
      if (obj.hasOwnProperty(t)) {
        return false
      }
    }
    return true
  },
  noop () {},
  def (obj, attr, value, enumerable) {
    Object.defineProperty(obj, attr, {
      value: value,
      enumerable: !!enumerable,
      writable: true,
      configurable: true
    })
  },
  error (title, err) {
    console.group(new Date() + ' ' + title)
    console.error(err)
    console.groupEnd()
  },
  warn (title, warn) {
    this.error(title, warn)
  },
  info (msg) {
    __wxConfig__ && __wxConfig__.debug && console.info(msg)
  },
  publish () {
    var params = Array.prototype.slice.call(arguments),
      defaultOpt = {
        options: {
          timestamp: Date.now()
        }
      }
    params[1]
      ? (params[1].options = Object.assign(
        params[1].options || {},
        defaultOpt.options
      ))
      : (params[1] = defaultOpt)
    ServiceJSBridge.publish.apply(ServiceJSBridge, params)
  }
}
export default utils
