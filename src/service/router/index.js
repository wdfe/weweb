/**
 * Created by pengguanfa on 2017/8/31.
 */
import * as util from '../lib/util'
import View from './view'
const Bus = util.getBus()
const SERVICE_ID = 100000

let curr = null
let views = {}
let tabViews = {}
Object.defineProperty(window, '__wxConfig', {
  get: function () {
    return curr?curr.getConfig():__wxConfig__
  }
})
Object.defineProperty(window, '__curPage__', {
  get: function () {
    return curr;
  },
  set: function (obj) {
    curr[obj.name] = obj.value;
  }
})

function lifeSycleEvent(path, query, openType) {
  toAppService({
    msg: {
      eventName: 'onAppRoute',
      type: 'ON_APPLIFECYCLE_EVENT',
      data: {
        path: `${path}.wxml`,
        query: query,
        openType: openType
      }
    }
  })
}

function toAppService(data) {
  data.to = 'appservice'
  let obj = Object.assign({
    command: 'MSG_FROM_WEBVIEW',
    webviewID: SERVICE_ID
  }, data)
  let id = curr ? curr.id : 0
  obj.msg.webviewID = data.webviewID || id
  obj.msg.options = obj.msg.options || {}
  obj.msg.options.timestamp = Date.now()
  const msg = obj.msg || {}
  ServiceJSBridge.subscribeHandler(msg.eventName,msg.data || {},msg.webviewID)
}

function getRoutes () {
  const root = window.__root__
  const path = location.hash.replace(/^#!/, '')
  let result = path ? [path] : [root]
  if (sessionStorage){
    const routesStr = sessionStorage.getItem('weweb_routes')
    if (routesStr){
      const routes = routesStr.split('|')
      if (routes.indexOf(path) === routes.length - 1) {
        result = routes
      }
    }
  }
  return result
}
function onRoute() {
  util.redirectTo(curr.url)//改变地址栏
  Bus.emit('route', router.getViewIds().length, curr)//tabbar状态变化
  let arr = []
  let view = curr
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

function onBack() {
  if (!curr.external){
    lifeSycleEvent(curr.path, curr.query, 'navigateBack')
  }
}

function onNavigate(url, type = 'navigateTo') {
  if (!url) throw new Error('url not found')
  if ((type == 'navigateTo' || type == 'redirectTo') && util.isTabbar(curr.path)) {
    console.error('wx.navigateTo wx.redirectTo 不允许跳转到 tabbar 页面，请使用 wx.switchTab')
    return
  }
  if(type == 'reLaunch' && util.isTabbar(curr.path) && curr.query){
    console.error('wx.reLaunch 跳转到 tabbar 页面时不允许携带参数，请去除参数或使用 wx.switchTab')
    return
  }
  curr.onReady(() => {
    lifeSycleEvent(curr.path, curr.query,type)
  })
}

const router = {
  onLaunch (data) { //eslint-disable-line
    const routes = getRoutes()
    const first = routes.shift()
    let valid = util.validPath(first)
    // make sure root is valid page
    let root =  valid ? first : window.__root__
    this.navigateTo(root)//页面切换，路由表更新
    let {path, query} = util.parsePath(root)
    lifeSycleEvent(path, query, 'appLaunch')

    if (!valid){
      console.warn(`Invalid route: ${first}, redirect to root`)
      return
    }
    if (routes.length) {
      mask.show()
      let cid = curr.id
      Bus.once('ready', id => {
        if (id !== cid) return mask.hide()
        for (let route of routes) {//为路由表中的页面注册ready事件
          // check if in pages
          valid = util.validPath(route)
          if (!valid) {
            console.warn(`无法在 pages 配置中找到 ${route}，停止路由`)
            break;
          }
          let data = util.getRedirectData(`/${route}`, curr.id)//获取到路由数据
          toAppService(data)
        }
      })
    }
  },
  redirectTo(path) {
    path = util.normalize(path)
    if (!curr) throw new Error('Current view not exists')
    let pid = curr.pid
    curr.destroy()
    delete views[curr.id]
    let v = curr = new View(path)
    curr.pid = pid
    views[curr.id] = v
    onRoute()
    onNavigate(path, 'redirectTo')
  },
  navigateTo (path) {
    path = util.normalize(path)
    let exists = tabViews[path]
    if (curr) curr.hide()
    if (exists) {
      curr = exists
      exists.show()
    } else {
      let isTabView = util.isTabbar(path)
      let pid = curr ? curr.id : null
      let v = curr = new View(path)
      curr.pid = isTabView ? null : pid
      views[v.id] = v
      if (isTabView) tabViews[path] = curr
    }
    onRoute()
    onNavigate(path, 'navigateTo')
  },
  reLaunch (path) {
    sessionStorage.clear()
    path = util.normalize(path)
    let exists = tabViews[path]
    if (curr) curr.hide()
    if (exists) {
      curr = exists
      exists.show()
    } else {
      let isTabView = util.isTabbar(path)
      let v = curr = new View(path)
      curr.pid = null
      views = []
      views[v.id] = v
      if (isTabView) tabViews[path] = curr
    }
    onRoute()
    onNavigate(path, 'reLaunch')
  },
  switchTab (path) {
    path = util.normalize(path)
    if (util.isTabbar(curr.path)) curr.hide()
    let exists = tabViews[path]
    Object.keys(views).forEach(key => {
      let view = views[key]
      if (!util.isTabbar(view.path)) {
        view.destroy()
        delete views[key]
      }
    })
    if (exists) {
      curr = exists
      exists.show()
    } else {
      let isTabView = util.isTabbar(path)
      let pid = curr ? curr.id : null
      let v = curr = new View(path)
      curr.pid = isTabView ? null : pid
      views[v.id] = v
      if (isTabView) tabViews[path] = curr
      //return Toast(`无法找到存在的 ${path} 页面`, {type: 'error'})
    }
    onRoute()
    onNavigate(path, 'switchTab')
  },
  navigateBack (delta = 1) {
    if (!curr) throw new Error('Current page not exists')
    if (curr.pid == null) return
    for (let i = delta; i > 0; i--) {
      if (curr.pid == null) break;
      curr.destroy()
      delete views[curr.id]
      curr = views[curr.pid]
      onBack()
    }
    curr.show()
    onRoute()
    onNavigate(curr.path, 'navigateBack')
  },
  openExternal (url) {
    console.log('openExternal start!!!')
    if (curr) curr.hide()
    let pid = curr ? curr.id : null
    let v = curr = new View(url)
    views[v.id] = v
    v.pid = pid
    v.show()
    onRoute()
  },
  currentView() {
    return curr
  },
  getViewById(id) {
    return views[id]
  },
  getViewIds() {
    let ids = Object.keys(views).map(id => Number(id))
    return ids
  },
  eachView(fn) {
    let ids = this.getViewIds()
    ids.forEach(id => {
      fn.call(null, views[id])
    })
  },

}
export default router