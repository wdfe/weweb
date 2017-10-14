import actionSheet from 'actionsheet'
import router from '../router/index'
import storage from './sdk/storage'
import toast from './sdk/toast'
import * as util from './util'
const Bus = util.getBus()

Bus.on('back', () => {
  let curr = router.currentView()
  router.navigateBack()
})
let win = window.__wxConfig__['window']
let header = {
  dom: null,
  init: function () {
    this.state = {
      backgroundColor: win.navigationBarBackgroundColor,
      color: win.navigationBarTextStyle,
      title: win.navigationBarTitleText,
      loading: false,
      backText: '返回',
      back: false,
      sendText: false
    }
    if (!this.dom) {
      this.dom = {
        head: this.$('.jshook-ws-head'),
        headBack: this.$('.jshook-ws-head-back'),
        headBackText: this.$('.jshook-ws-head-back-text'),
        headHome: this.$('.jshook-ws-head-home'),
        headTitle: this.$('.jshook-ws-head-title'),
        headOption: this.$('.jshook-ws-head-option')
      }
      this.dom.headBackSpan = this.dom.headBack.querySelector('span')
      this.dom.headTitleSpan = this.dom.headTitle.querySelector('span')
      this.dom.headBackI = this.dom.headBack.querySelector('i')
      this.dom.headHomeI = this.dom.headHome.querySelector('i')
      this.dom.headTitleI = this.dom.headTitle.querySelector('i')
      this.dom.headBack.onclick = this.onBack.bind(null)
      this.dom.headHome.onclick = this.onHome.bind(null)
      this.dom.headOption.onclick = this.onOptions.bind(null)
    }
    this.dom.head.style.display = 'block'
    Bus.on('route', this.reset.bind(this))
    this.setState()
  },
  $: function (name) {
    return document.querySelector(name)
  },
  reset: function () {
    let d = {
      backgroundColor: win.navigationBarBackgroundColor,
      color: win.navigationBarTextStyle,
      title: win.navigationBarTitleText,
      loading: false,
      back: false
    }
    let curr = router.currentView()

    let winConfig = win.pages[curr.path] || {}
    let tabBar = window.__wxConfig__.tabBar

    let top = tabBar && tabBar.position == 'top'
    let hide = top && util.isTabbar(curr.url)
    if (curr.isMap) {
      this.setState({
        hide: false,
        backgroundColor: 'rgb(0, 0, 0)',
        color: '#ffffff',
        title: '位置',
        loading: false,
        backText: '取消',
        sendText: true
      })
    } else {
      this.setState({
        hide,
        backgroundColor:
          winConfig.navigationBarBackgroundColor || d.backgroundColor,
        color: winConfig.navigationBarTextStyle || d.color,
        title: winConfig.navigationBarTitleText || d.title,
        loading: false,
        backText: '返回',
        sendText: false,
        back: curr.pid != null
      })
    }
  },
  onBack: function (e,send) {
    e.preventDefault()
    Bus.emit('back',send)
  },
  onSend: function (e) {
    // TODO send location
    e.stopPropagation()
    const data = Object.assign({},router.currentView().location)
    this.onBack(e,true)
    Bus.emit('location', data)
  },
  onOptions: function (e) {
    e.preventDefault()
    actionSheet({
      refresh: {
        text: '回主页',
        callback: function () {
          window.sessionStorage.removeItem('routes')
          util.navigateHome()
        }
      },
      clear: {
        text: '清除数据缓存',
        callback: function () {
          if (window.localStorage != null) {
            storage.clear()
            toast.show({ title: '数据缓存已清除', icon: 'success' })
          }
        }
      },
      cancel: {
        text: '取消'
      }
    }).then(() => {
      header.sheetShown = true
    })
  },
  setTitle: function (title) {
    this.dom.headTitleSpan.innerHTML = title
  },
  showLoading: function () {
    this.dom.headTitleI.style.display = 'inline-block'
  },
  hideLoading: function () {
    this.dom.headTitleI.style.display = 'none'
  },
  onHome: function () {
    util.navigateHome()
  },
  setNavigationBarColor: function (style) {
    // insert keyframes
    // https://stackoverflow.com/questions/18481550/how-to-dynamically-create-keyframe-css-animations
    // https://developer.mozilla.org/en-US/docs/Web/API/CSSStyleSheet/insertRule
    var styleEl = document.createElement('style'),
      addKeyFrames = null
    document.head.appendChild(styleEl)
    var styleSheet = styleEl.sheet
    if (CSS && CSS.supports && CSS.supports('animation: name')) {
      // we can safely assume that the browser supports unprefixed version.
      addKeyFrames = function (name, frames) {
        var pos = styleSheet.cssRules.length
        styleSheet.insertRule('@keyframes ' + name + '{' + frames + '}', pos)
      }
    } else {
      addKeyFrames = function (name, frames) {
        // Ugly and terrible, but users with this terrible of a browser
        // *cough* IE *cough* don't deserve a fast site
        var str = name + '{' + frames + '}',
          pos = styleSheet.cssRules.length
        styleSheet.insertRule('@-webkit-keyframes ' + str, pos)
        styleSheet.insertRule('@keyframes ' + str, pos + 1)
      }
    }

    const timingFuncMapping = {
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out'
    }
    if (style.animation) {
      console.log(this.state.backgroundColor, style.backgroundColor)
      addKeyFrames(
        'bgcAnimation',
        `0% {background-color: ${this.state
          .backgroundColor}} 100% {background-color: ${style.backgroundColor}`
      )
      this.dom.head.style.animation = `bgcAnimation ${style.animation
        .duration || 0}ms ${timingFuncMapping[style.animation.timingFunc] ||
        'linear'} forwards`
    } else {
      this.dom.head.style.backgroundColor = style.backgroundColor
    }
    this.state.backgroundColor = style.backgroundColor
  },
  setState: function (data) {
    if (data) Object.assign(this.state, data)
    let state = this.state
    this.dom.head.style.backgroundColor = state.backgroundColor
    this.dom.head.style.display = state.hide ? 'none' : 'flex'
    this.dom.headBack.style.display = state.back ? 'flex' : 'none'
    this.dom.headBackSpan.style.color = state.color
    this.dom.headTitle.style.color = state.color
    this.dom.headBackSpan.innerHTML = state.backText
    this.dom.headTitleSpan.innerHTML = state.title
    this.dom.headBackI.style.display = !state.sendText ? 'inline-block' : 'none'
    this.dom.headTitleI.style.display = state.loading ? 'inline-block' : 'none'
    this.dom.headBackI.style.borderLeft = `1px solid ${state.color}`
    this.dom.headBackI.style.borderBottom = `1px solid ${state.color}`
    this.dom.headHome.style.display = state.back ? 'none' : 'flex'
    this.dom.headHomeI.className =
      state.color == 'white' ? 'head-home-icon white' : 'head-home-icon'
    this.dom.headHomeI.style.display = state.back ? 'none' : 'flex'
    if (state.sendText) {
      this.dom.headOption.innerHTML = '<div>发送</div>'
      this.dom.headOption.querySelector('div').onclick = this.onSend.bind(this)
    } else {
      this.dom.headOption.innerHTML =
        '<i class="head-option-icon' +
        (state.color == 'white' ? ' white' : '') +
        '"></i>'
    }
  }
}
export default header
