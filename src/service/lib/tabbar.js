import Emitter from 'emitter'
import router from '../router/index'
import * as util from './util'
const Bus = util.getBus()
let tabBar = window.__wxConfig__.tabBar || {}

var Tabbar = {
  init: function () {
    this.activeIdx = 0
    this.scrollable = document.querySelector('.scrollable')
    this.tabbar = document.querySelector('.jshook-ws-tabbar')
    if (!this.tabbar) return
    let self = this
    this.tabbarItems = this.tabbar.querySelectorAll('.jshook-ws-tabbar-item')
    ;[].forEach.call(this.tabbarItems, function (item, i) {
      item.addEventListener('touchstart', self.onItemTap.bind(self, i, item))
    })
  },
  reset: function () {
    let p = router.currentView().path
    this.select(p)
  },
  show: function (path) {
    if (!this.tabbar) return
    let p = path.replace(/\?(.*)$/, '').replace(/\.wxml$/, '')
    this.select(p)
  },
  select: function (path) {
    let list = tabBar.list || []
    this.activeIdx = -1
    for (let i in list) {
      if (list[i].pagePath === path) {
        this.activeIdx = i
      }
    }
    // this.activeIdx = (list || []).findIndex(item => item.pagePath === path)
    this.doUpdate()
  },
  onItemTap: function (idx, elemt) {
    if (idx == this.activeIdx) return
    let item,
      list = tabBar.list || []
    for (let i in list) {
      if (i == idx) {
        item = list[i]
      }
    }
    /*

    let item = tabBar.list.find((item, index) => {
      return idx == index
    })
*/
    this.activeIdx = idx
    // this.doUpdate();
    let curr = router.currentView()
    if (curr && curr.url == item.pagePath) return
    router.switchTab(item.pagePath)
  },
  doUpdate: function () {
    let active = this.activeIdx
    let hidden = active == -1 || active == null
    let top = tabBar.position == 'top'
    if (hidden || top) {
      this.scrollable.style.bottom = '0px'
    } else {
      this.scrollable.style.bottom = '56px'
    }
    if (top && active != -1) {
      this.scrollable.style.top = '47px'
    } else {
      this.scrollable.style.top = '42px'
    }
    if (this.tabbar) {
      this.tabbar.style.display = hidden ? 'none' : 'flex'
      ;[].forEach.call(this.tabbarItems, function (item, idx) {
        // var idx = item.getAttribute('key');
        var iconDom = item.querySelector('.tabbar-icon')
        var iDom = item.querySelector('.tabbar-label-indicator')
        var labelDom = item.querySelector('.tabbar-label')
        // fix tabbar no iconPath bug
        if (iconDom && !iconDom.getAttribute('src')) {
          iconDom.style.display = 'none'
        }
        if (active == idx) {
          if (!top) {
            iconDom && (iconDom.src = iconDom.getAttribute('select-icon'))
          } else {
            iDom.style.color = tabBar.selectedColor
            iDom.style.display = 'inline-block'
          }
          labelDom.style.color = tabBar.selectedColor
        } else {
          if (!top) {
            iconDom && (iconDom.src = iconDom.getAttribute('icon'))
          } else {
            iDom.style.color = tabBar.color
            iDom.style.display = 'none'
          }
          labelDom.style.color = tabBar.color
        }
      })
    }
  }
}

Emitter(Tabbar)

Bus.on('route', curr => {
  Tabbar.show(curr.url)
})
export default Tabbar
