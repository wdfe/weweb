import {parsePath, isTabbar} from './util'
import Bus from './bus'
import {currentView} from './viewManage'

let serviceReady = false
const SERVICE_ID = 100000

Bus.once('APP_SERVICE_COMPLETE', () => {
  serviceReady = true
  window.postMessage({
    to: 'devtools',
    sdkName: 'APP_SERVICE_COMPLETE'
  }, '*')
})

function message(obj) {
  var msg = obj.msg || {},
    ext = obj.ext || {};
  if (obj.command == 'GET_ASSDK_RES'){
    ServiceJSBridge.invokeCallbackHandler(ext.callbackID, msg);
  }else if(obj.command == 'MSG_FROM_WEBVIEW'){
    ServiceJSBridge.subscribeHandler(msg.eventName,msg.data || {},msg.webviewID)
  }else if(obj.command == 'WRITE_APP_DATA'){
    for (var message in msg) {
      var detail = msg[message],
        webviewId = detail.__webviewId__;
      ServiceJSBridge.publish("appDataChange", {
        data: {
          data: detail
        }
      }, [webviewId], true);
    }
  }
}

export function toAppService(data) {
  data.to = 'appservice'
  let obj = Object.assign({
    command: 'MSG_FROM_WEBVIEW',
    webviewID: SERVICE_ID
  }, data)
  if (obj.msg && obj.command !== 'GET_ASSDK_RES') {
    let view = currentView()
    let id = view ? view.id : 0
    obj.msg.webviewID = data.webviewID || id
    obj.msg.options = obj.msg.options || {}
    obj.msg.options.timestamp = Date.now()
  }
  if (serviceReady) {
    message(obj)
  } else {
    Bus.once('APP_SERVICE_COMPLETE', () => {
      message(obj)
    })
  }
}

export function reload(path) {
  toAppService({
    msg: {
      data: { path },
      eventName: 'reload'
    }
  })
}

export function lifeSycleEvent(path, query, openType) {
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

export function onLaunch(rootPath) {
  let {path, query} = parsePath(rootPath)
  lifeSycleEvent(path, query, 'appLaunch')
}

export function onBack() {
  let view = currentView()
  lifeSycleEvent(view.path, view.query, 'navigateBack')
}

export function onNavigate(data, type = 'navigateTo') {
  if (!data.args.url) throw new Error('url not found')
  let view = currentView()
  console.log(view)
  if ((type == 'navigateTo' || type == 'redirectTo')
      && isTabbar(view.path)) {
    console.error('wx.navigateTo wx.redirectTo 不允许跳转到 tabbar 页面，请使用 wx.switchTab')
    return
  }
  if(type == 'reLaunch' && isTabbar(view.path) && view.query){
     console.error('wx.reLaunch 跳转到 tabbar 页面时不允许携带参数，请去除参数或使用 wx.switchTab')
    return
  }
  //message({
  //  to: 'appservice',
  //  msg: {
  //    errMsg: `${data.sdkName}:ok`,
  //    url: data.args.url,
  //    webviewId: view.id
  //  },
  //  command: 'GET_ASSDK_RES',
  //  ext: merge.recursive(true, {}, data),
  //  webviewID: SERVICE_ID
  //})
  view.onReady(() => {
    lifeSycleEvent(view.path, view.query,type)
  })
}
