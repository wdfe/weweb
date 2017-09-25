const isString = function (target) {
  return Object.prototype.toString.call(target) === '[object String]'
}

export default {
  isString,
  isArray: function (target) {
    return Array.isArray
      ? Array.isArray(target)
      : Object.prototype.toString.call(target) === '[object Array]'
  },
  getPrototype: function (obj) {
    return Object.getPrototypeOf
      ? Object.getPrototypeOf(obj)
      : obj.__proto__
        ? obj.__proto__
        : obj.constructor ? obj.constructor.prototype : void 0
  },
  isObject: function (obj) {
    return typeof obj === 'object' && obj !== null
  },
  isEmptyObject: function (obj) {
    for (let key in obj) {
      return !1
    }
    return !0
  },
  isVirtualNode: function (node) {
    return node && node.type === 'WxVirtualNode'
  },
  isVirtualText: function (node) {
    return node && node.type === 'WxVirtualText'
  },
  isUndefined: function (obj) {
    return Object.prototype.toString.call(obj) === '[object Undefined]'
  },
  uuid: function () {
    let uuidPart = function () {
      return Math.floor(65536 * (1 + Math.random()))
        .toString(16)
        .substring(1)
    }
    return (
      uuidPart() +
      uuidPart() +
      '-' +
      uuidPart() +
      '-' +
      uuidPart() +
      '-' +
      uuidPart() +
      '-' +
      uuidPart() +
      uuidPart() +
      uuidPart()
    )
  },
  getDataType: function (obj) {
    return Object.prototype.toString
      .call(obj)
      .split(' ')[1]
      .split(']')[0]
  },
  getPageConfig: function () {
    let configs = {}
    if (window.__wxConfig && window.__wxConfig.window) {
      configs = window.__wxConfig.window
    } else {
      let globConfig = {}
      window.__wxConfig &&
        window.__wxConfig.global &&
        window.__wxConfig.global.window &&
        (globConfig = window.__wxConfig.global.window)

      let pageConfig = {}
      window.__wxConfig &&
        window.__wxConfig.page &&
        window.__wxConfig.page[window.__route__] &&
        window.__wxConfig.page[window.__route__].window &&
        (pageConfig = window.__wxConfig.page[window.__route__].window)
      configs = Object.assign({}, globConfig, pageConfig)
    }
    return configs
  }
}
