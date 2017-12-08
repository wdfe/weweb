import WxVirtualNode from './WxVirtualNode'
import Utils from './Utils'
import WxVirtualText from './WxVirtualText'
import AppData from './AppData'
import TouchEvents from './TouchEvents'
import Init from './Init'

Init.init()

window.__mergeData__ = AppData.mergeData
window.__DOMTree__ = void 0 // 虚拟dom生成的domtree
window.reRender = 0
let rootNode = void 0

function setGlobalPageAttr (name, value) {
  window[name] = value
  window.__curPage__ = {
    name: name,
    value: value
  }
}
function setRootNode (value) {
  rootNode = value
  window.__curPage__ = {
    name: 'rootNode',
    value: value
  }
}

const createWXVirtualNode = function (
  tagName,
  props,
  newProps,
  wxkey,
  wxVkey,
  children
) {
  return new WxVirtualNode(tagName, props, newProps, wxkey, wxVkey, children)
}
const createWxVirtualText = function (txt) {
  return new WxVirtualText(txt)
}
const createWXVirtualNodeRec = function (opt) {
  // Recursively
  if (Utils.isString(opt) || (Number(opt) === opt && Number(opt) % 1 === 0)) {
    return createWxVirtualText(String(opt))
  }
  let children = []
  opt.children.forEach(function (child) {
    children.push(createWXVirtualNodeRec(child))
  })
  return createWXVirtualNode(
    opt.tag,
    opt.attr,
    opt.n,
    opt.wxKey,
    opt.wxVkey,
    children
  )
}
const createBodyNode = function (data) {
  window.__curPage__.envData || (window.__curPage__.envData = {})
  let root = window.__generateFunc__(
    window.__curPage__.envData, // AppData.getAppData(),
    data
  )
  // t.tag = "body"
  return createWXVirtualNodeRec(root)
}

const firstTimeRender = function (event) {
  if (event.ext) {
    event.ext.enablePullUpRefresh &&
      setGlobalPageAttr('__enablePullUpRefresh__', !0)
  }
  setRootNode(createBodyNode(event.data))
  setGlobalPageAttr('__DOMTree__', rootNode.render())
  exparser.Element.replaceDocumentElement(
    window.__DOMTree__,
    document.querySelector('#view-body-' + window.__wxConfig.viewId)
  )
  TouchEvents.enablePullUpRefresh()
}

const reRender = function (event) {
  let newBodyNode = createBodyNode(event.data)
  if (window.__curPage__ && window.__curPage__.rootNode != rootNode) {
    // 切换页面了
    rootNode = window.__curPage__.rootNode
  }
  let patch = rootNode.diff(newBodyNode)
  patch.apply(window.__DOMTree__)
  setRootNode(newBodyNode)
}

const renderOnDataChange = function (event) {
  if (window.reRender) {
    reRender(event)
    document.dispatchEvent(new CustomEvent('pageReRender', {}))
  } else {
    firstTimeRender(event)
    if (!(event.options && event.options.firstRender)) {
      console.log(event)
      console.error('firstRender not the data from Page.data')
      Reporter.errorReport({
        key: 'webviewScriptError',
        error: new Error('firstRender not the data from Page.data'),
        extend: 'firstRender not the data from Page.data'
      })
    }
    window.reRender = !0
    document.dispatchEvent(new CustomEvent('pageReRender', {}))
  }
}

window.onerror = function (messageOrEvent, source, lineno, colno, error) {
  console.error(error && error.stack)
  Reporter.errorReport({
    key: 'webviewScriptError',
    error: error
  })
}

wx.onAppDataChange(
  Reporter.surroundThirdByTryCatch(function (event) {
    renderOnDataChange(event)
  })
)

exparser.addGlobalErrorListener(function (error, errData) {
  Reporter.errorReport({
    key: 'webviewScriptError',
    error: error,
    extend: errData.message
  })
})

export default {
  reset: function () {
    rootNode = void 0
    window.__DOMTree__ = void 0
    // nonsenselet = {}
  }
}
