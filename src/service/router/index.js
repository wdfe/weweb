/**
 * Created by pengguanfa on 2017/8/31.
 */
import * as util from '../lib/util'
import View from './view'
import mask from '../lib/component/mask'

const Bus = util.getBus()

let currPage = null
let views = {}
let tabViews = {}
if (!window.__wxConfig) {
  Object.defineProperty(window, '__wxConfig', {
    get: function () {
      return currPage ? currPage.getConfig() : __wxConfig__
    }
  })
  Object.defineProperty(window, '__curPage__', {
    get: function () {
      return currPage
    },
    set: function (obj) {
      currPage[obj.name] = obj.value
    }
  })
  window.addEventListener('message', function (event) {
    // 处理地图相关通讯
    var data = event.data || {}
    if (
      typeof data === 'object' &&
      (data.module === 'geolocation' || data.module === 'locationPicker')
    ) {
      if (data.module == 'geolocation') {
        data = {
          module: 'locationPicker',
          latlng: {
            lat: data.lat,
            lng: data.lng
          },
          poiaddress: '' + data.province + data.city,
          poiname: data.addr,
          cityname: data.city
        }
      }
      currPage.setLocation(data)
    }
  })
}

export function lifeSycleEvent (path, query, openType) {
  toAppService({
    msg: {
      eventName: 'onAppRoute',
      data: {
        path: `${path}.wxml`,
        query: query,
        openType: openType
      }
    }
  })
}

function toAppService (obj) {
  const id = currPage ? currPage.id : 0
  const msg = obj.msg || {}
  ServiceJSBridge.subscribeHandler(msg.eventName, msg.data || {}, id)
}

function getRoutes () {
  const root = window.__root__
  const path = location.hash.replace(/^#!/, '')
  let result = path ? [path] : [root]
  if (sessionStorage) {
    const routesStr = sessionStorage.getItem('weweb_routes')
    if (routesStr) {
      const routes = routesStr.split('|')
      if (routes.indexOf(path) === routes.length - 1) {
        result = routes
      }
    }
  }
  return result
}

function onRoute () {
  // 改变地址栏
  let home = `${location.protocol}//${location.host}${location.pathname}`
  if (typeof history.replaceState === 'function') {
    history.replaceState({}, '', `${home}#!${currPage.url}`)
  }
  Bus.emit('route', currPage) // tabbar状态变化
  let arr = []
  let view = currPage
  while (view) {
    arr.push(view.url)
    if (view.pid != null) {
      view = views[view.pid]
    } else {
      view = null
    }
  }
  let str = arr.reverse().join('|')
  sessionStorage.setItem('weweb_routes', str)
}

function onBack () {
  if (!currPage.external) {
    lifeSycleEvent(currPage.path, currPage.query, 'navigateBack')
  }
}

function onNavigate (url, type = 'navigateTo') {
  if (!url) throw new Error('url not found')
  if (type == 'reLaunch' && util.isTabbar(currPage.path) && currPage.query) {
    console.error('wx.reLaunch 跳转到 tabbar 页面时不允许携带参数，请去除参数或使用 wx.switchTab')
    return
  }
  currPage.onReady(() => {
    lifeSycleEvent(currPage.path, currPage.query, type)
  })
}

const router = {
  onLaunch () {
    //eslint-disable-line
    const routes = getRoutes()
    const first = routes.shift()
    let valid = util.validPath(first)
    // make sure root is valid page
    let root = valid ? first : window.__root__
    this.navigateTo(root, true) // 页面切换，路由表更新

    if (!valid) {
      console.warn(`Invalid route: ${first}, redirect to root`)
      return
    }
    if (routes.length) {
      mask.show()
      let cid = currPage.id
      Bus.once('ready', id => {
        mask.hide()
        if (id !== cid) return
        for (let route of routes) {
          // 为路由表中的页面注册ready事件
          // check if in pages
          valid = util.validPath(route)
          if (!valid) {
            console.warn(`无法在 pages 配置中找到 ${route}，停止路由`)
            break
          }
          toAppService({
            msg: {
              eventName: 'custom_event_INVOKE_METHOD',
              data: {
                data: {
                  name: 'navigateTo',
                  args: {
                    url: `/${route}`
                  }
                }
              }
            }
          })
        }
      })
    }
  },
  redirectTo (path) {
    path = util.normalize(path)
    if (!currPage) throw new Error('Current view not exists')
    let pid = currPage.pid
    currPage.destroy()
    delete views[currPage.id]
    let v = (currPage = new View(path))
    currPage.pid = pid
    views[currPage.id] = v
    onRoute()
    onNavigate(path, 'redirectTo')
  },
  navigateTo (path, isLaunch) {
    path = util.normalize(path)
    let exists = tabViews[path]
    if (currPage) currPage.hide()
    if (exists && exists.__DOMTree__) {
      currPage = exists
      exists.show()
    } else {
      let isTabView = util.isTabbar(path)
      let pid = currPage ? currPage.id : null
      let v = (currPage = new View(path))
      currPage.pid = isTabView ? null : pid
      views[v.id] = v
      if (isTabView) tabViews[path] = currPage
    }
    onRoute()
    if (isLaunch) {
      onNavigate(path, 'appLaunch')
    } else {
      onNavigate(path, 'navigateTo')
    }
  },
  reLaunch (path) {
    sessionStorage.clear()
    path = util.normalize(path)
    let exists = tabViews[path]
    if (currPage) currPage.hide()
    if (exists && exists.__DOMTree__) {
      currPage = exists
      exists.show()
    } else {
      let isTabView = util.isTabbar(path)
      let v = (currPage = new View(path))
      currPage.pid = null
      views = []
      views[v.id] = v
      if (isTabView) tabViews[path] = currPage
    }
    onRoute()
    onNavigate(path, 'reLaunch')
  },
  switchTab (path) {
    path = util.normalize(path)
    if (util.isTabbar(currPage.path)) currPage.hide()
    let exists = tabViews[path]
    Object.keys(views).forEach(key => {
      let view = views[key]
      if (!util.isTabbar(view.path)) {
        view.destroy()
        delete views[key]
      }
    })
    if (exists && exists.__DOMTree__) {
      currPage = exists
      exists.show()
    } else {
      let isTabView = util.isTabbar(path)
      let pid = currPage ? currPage.id : null
      let v = (currPage = new View(path))
      currPage.pid = isTabView ? null : pid
      views[v.id] = v
      if (isTabView) tabViews[path] = currPage
      // return Toast(`无法找到存在的 ${path} 页面`, {type: 'error'})
    }
    onRoute()
    onNavigate(path, 'switchTab')
  },
  navigateBack (delta = 1) {
    if (!currPage) throw new Error('Current page not exists')
    if (currPage.pid == null) return
    for (let i = delta; i > 0; i--) {
      if (currPage.pid == null) break
      currPage.destroy()
      delete views[currPage.id]
      currPage = views[currPage.pid]
      onBack()
    }
    currPage.show()
    onRoute()
    onNavigate(currPage.path, 'navigateBack')
  },
  openExternal (url) {
    console.log('openExternal start!!!')
    if (currPage) currPage.hide()
    let pid = currPage ? currPage.id : null
    let v = (currPage = new View(url))
    views[v.id] = v
    v.pid = pid
    v.show()
    onRoute()
  },
  currentView () {
    return currPage
  },
  getViewById (id) {
    return views[id]
  },
  getViewIds () {
    let ids = Object.keys(views).map(id => Number(id))
    return ids
  },
  eachView (fn) {
    let ids = this.getViewIds()
    ids.forEach(id => {
      fn.call(null, views[id])
    })
  }
}

export default router
