import storage from '../lib/sdk/storage'

function systemInfo () {
  return {
    model: /iPhone/.test(navigator.userAgent) ? 'iPhone' : 'Android',
    pixelRatio: window.devicePixelRatio || 1,
    windowWidth: window.innerWidth || 0,
    windowHeight: window.innerHeight || 0,
    language: window.navigator.userLanguage || window.navigator.language,
    platform: 'weweb',
    version: '0.0.1'
  }
}

function toResult (msg, data, command) {
  var obj = {
    ext: data, // 传过来的数据
    msg: msg // 调用api返回的结果
  }
  if (command) obj.command = command
  return obj
}

function toError (data, result = false, extra = {}) {
  // let name = data.sdkName.replace(/Sync$/, '')
  let name = data.sdkName
  let obj = Object.assign(
    {
      errMsg: `${name}:fail`
    },
    extra
  )
  return toResult(obj, data, result ? 'GET_ASSDK_RES' : null)
}

function toSuccess (data, result = false, extra = {}) {
  // let name = data.sdkName.replace(/Sync$/, '')
  let name = data.sdkName
  let obj = Object.assign(
    {
      errMsg: `${name}:ok`
    },
    extra
  )
  return toResult(obj, data, result ? 'GET_ASSDK_RES' : null)
}

export function setStorageSync (data) {
  let args = data.args
  if (args.key == null || args.data == null) return toError(data, true)
  storage.set(args.key, args.data, args.dataType)
  return toSuccess(data, true)
}

export function getStorageSync (data) {
  let args = data.args
  if (args.key == null || args.key == '') return toError(data, true)
  let res = storage.get(args.key)
  return toSuccess(data, true, {
    data: res.data,
    dataType: res.dataType
  })
}

export function clearStorageSync (data) {
  storage.clear()
  return toSuccess(data, true)
}

export function removeStorageSync (data) {
  let args = data.args
  if (args.key == null || args.key == '') return toError(data, true)
  storage.remove(args.key)
  return toSuccess(data, true)
}

export function getStorageInfoSync (data) {
  let obj = storage.info()
  return toSuccess(data, true, obj)
}

export function getSystemInfoSync (data) {
  let info = systemInfo()
  return toSuccess(data, true, info)
}

export function getSystemInfo (data) {
  let info = systemInfo()
  return toSuccess(data, true, info)
}
