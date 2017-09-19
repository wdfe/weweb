import Emitter from 'emitter'
import { uid, createFrame, parsePath, getBus } from '../lib/util'
import { lifeSycleEvent } from './index'
require('whatwg-fetch')
const Bus = getBus()
function isMap (path) {
  return /^http(s)?:\/\/(apis\.map|3gimg\.qq\.com)/.test(path)
}
let loadedApp = false

var BASE_DEVICE_WIDTH = 750
var EPS = 0.0001
var RPXRE = /%%\?[+-]?\d+(\.\d+)?rpx\?%%/g
var widthScreen = window.innerWidth // >375?375:window.innerWidth
var ratio = window.devicePixelRatio
function transformByDPR (a, width, dpr) {
  a = a / BASE_DEVICE_WIDTH * width
  a = Math.floor(a + EPS)
  if (a === 0) {
    if (dpr === 1) {
      return 1
    } else {
      return 0.5
    }
  }
  return a
}

function getNumber (e, width, ratio) {
  var g = 0
  var d = 1
  var a = false
  var f = false
  for (var b = 0; b < e.length; ++b) {
    var h = e[b]
    if (h >= '0' && h <= '9') {
      if (a) {
        d *= 0.1
        g += (h - '0') * d
      } else {
        g = g * 10 + (h - '0')
      }
    } else {
      if (h === '.') {
        a = true
      } else {
        if (h === '-') {
          f = true
        }
      }
    }
  }
  if (f) {
    g = -g
  }
  return transformByDPR(g, width, ratio)
}

export default class View extends Emitter {
  constructor (path) {
    if (!path) throw new Error('path required for view')
    super()
    let id = (this.id = uid())
    let o = parsePath(path)
    this.url = path
    this.path = o.path
    this.query = o.query
    this.isMap = isMap(path)
    let external = (this.external = /^http(s)?:\/\//.test(path))
    let root = document.querySelector('.scrollable')
    this.ready = false
    window.__webviewId__ = this.id
    if (external) {
      this.el = createFrame(`view-${id}`, path, false, root)
      if (this.isMap) {
        this.el.contentWindow.addEventListener('load', () => {
          this._onReady()
        })
      }
    } else {
      window.__pageFrameStartTime__ = Date.now()
      this.el = this.createPage(id, false, root)
      this.loadWxml()
      if (!loadedApp) {
        loadedApp = true
        this.loadWxss('./css/app.css')
      }
      // this.loadWxss()
      Bus.on('ready', viewId => {
        if (viewId == id) {
          this._onReady()
        }
      })
    }
    this.readyCallbacks = []
  }
  _onReady () {
    this.ready = true
    let cbs = this.readyCallbacks
    for (let cb of cbs) {
      cb()
    }
    this.readyCallbacks = null
  }
  onReady (cb) {
    if (!cb) return
    if (this.ready) return cb()
    this.readyCallbacks.push(cb)
  }
  setLocation (data) {
    this.location = {
      name: data.poiname,
      address: data.poiaddress,
      latitude: data.latlng.lat,
      longitude: data.latlng.lng
    }
    console.log(this.location)
  }
  getConfig () {
    let win = window.__wxConfig__.window
    let obj = {
      backgroundTextStyle: win.backgroundTextStyle || 'dark',
      backgroundColor: win.backgroundColor || '#fff',
      enablePullDownRefresh: win.enablePullDownRefresh || false
    }
    let winConfig = win.pages[this.path] || {}
    Object.keys(obj).forEach(function (key) {
      if (winConfig.hasOwnProperty(key)) {
        obj[key] = winConfig[key]
      }
    })
    return { window: obj, viewId: this.id }
  }
  hide () {
    // this.el.style.display = 'none'
    // 移除当前页面css
    if (this.el) {
      this.elParent.removeChild(this.el)
    }
  }
  show () {
    if (this.el && !this.el.parentNode) {
      this.elParent.appendChild(this.el)
    } // 增加当前页面css
    // this.el.style.display = 'block'
    window.__webviewId__ = this.id
    this.__DOMTree__ && (window.__DOMTree__ = this.__DOMTree__)
    window.__enablePullUpRefresh__ = !!this.__enablePullUpRefresh__
    window.__generateFunc__ = this.__generateFunc__
  }
  destroy () {
    this.emit('destroy')
    /*
     let cssObj = this.cssDom//document.querySelector('#view-css-'+this.id)
     if(cssObj){
     document.querySelector('head').removeChild(cssObj)
     }
     */
    this.el.parentNode.removeChild(this.el)
  }
  postMessage (data) {
    this.onReady(() => {
      data.msg = data.msg || {}

      var msg = data.msg, command = data.command, ext = data.ext

      if (command === 'MSG_FROM_APPSERVICE') {
        WeixinJSBridge.subscribeHandler(msg.eventName, msg.data)
      } else if (
        command == 'GET_JSSDK_RES' ||
        command == 'INVOKE_SDK' ||
        /^private_/.test(msg.sdkName)
      ) {
        WeixinJSBridge.subscribeHandler(msg.sdkName, msg.res, ext) // ext其实也没用 了
      } else if (command === 'STOP_PULL_DOWN_REFRESH') {
        WeixinJSBridge.pull.reset()
      }
    })
  }
  loadWxss (path) {
    let p = path || this.path
    let self = this
    let width = widthScreen
    let ratio = window.devicePixelRatio
    fetch(path)
      .then(function (response) {
        return response.text()
      })
      .then(function (cssBody) {
        self.inlineCss(cssBody, width, ratio, p)
      })
  }
  resizeWxss () {}
  createPage (id, hidden, parent = document.body) {
    let el = document.createElement('div')
    el.setAttribute('id', 'weweb-view-' + id)
    el.setAttribute('view-id', id)
    el.style.height = '100%'
    if (hidden) {
      el.style.display = 'none'
    }
    parent.appendChild(el)
    this.elParent = parent
    el.innerHTML = '<div id="view-body-' + id + '"></div>'
    return el
  }
  inlineCss (content, width, ratio, path) {
    var b, self = this
    b = content.match(RPXRE)
    if (b) {
      b.forEach(function (c) {
        var d = getNumber(c, width, ratio)
        var e = d + 'px'
        content = content.replace(c, e)
      })
    }
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
  loadWxml () {
    // load generateFn and notify view
    // this.el.contentWindow.__gen()
    let self = this
    let p = './src/' + this.path + '.js'
    fetch(p)
      .then(function (response) {
        return response.text()
      })
      .then(function (res) {
        if (window.__curPage__ && window.__curPage__.id != self.id) {
          // 确保是当前页面
          return
        }
        let resArr = res.split('@code-separator-line:')
        try {
          new Function(`${resArr[2]}`)() // define page service
          if (!window.firstRender) { lifeSycleEvent(self.path, self.query, 'appLaunch') }
        } catch (e) {
          console.error(e)
        }
        var func = new Function(
          resArr[0] + '\n return $gwx("./' + self.path + '.wxml")'
        )

        try {
          self.__generateFunc__ = window.__generateFunc__ = func()
        } catch (e) {
          console.error(e)
        }

        if (resArr[1]) {
          self.inlineCss(resArr[1], widthScreen, ratio, self.path)
        }

        function componentLoaded () {
          window.firstRender = 0 // 重置
          Bus.emit('ready', self.id)
        }

        if (resArr[3]) {
          const deps = JSON.parse(resArr[3]).map(name => `wx-${name}`)
          window.exparser.registerAsyncComp(deps, () => {
            componentLoaded()
          })
        } else {
          componentLoaded()
        }
      })
  }
}
