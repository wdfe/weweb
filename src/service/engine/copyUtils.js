function copy (obj, customizerFn) {
  var res = copyValue(obj)
  return res !== null ? res : copyCollection(obj, customizerFn)
}
function copyCollection (obj, customizerFn) {
  if (typeof customizerFn !== 'function') {
    throw new TypeError('customizer is must be a Function')
  }
  if (typeof obj === 'function') {
    return obj
  }
  var typeString = toString.call(obj)
  if (typeString === '[object Array]') {
    return []
  }
  if (typeString === '[object Object]' && obj.constructor === Object) {
    return {}
  }
  if (typeString === '[object Date]') {
    return new Date(obj.getTime())
  }
  if (typeString === '[object RegExp]') {
    var toStr = String(obj),
      pos = toStr.lastIndexOf('/')
    return new RegExp(toStr.slice(1, pos), toStr.slice(pos + 1))
  }
  var res = customizerFn(obj)
  return undefined !== res ? res : null
}
function copyValue (param) {
  var type = typeof param
  return param !== null && type !== 'object' && type !== 'function'
    ? param
    : null
}
var toString = Object.prototype.toString
export default {
  copy,
  copyCollection,
  copyValue
}
