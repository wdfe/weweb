import filePicker from 'file-picker'
import Upload from 'upload'
import router from '../router/index'
import header from '../lib/header'
import tabbar from '../lib/tabbar'
import throttle from 'throttleit'
import record from '../lib/sdk/record'
import Compass from '../lib/sdk/compass'
import storage from '../lib/sdk/storage'
import Picker from '../lib/sdk/picker'
import TimePicker from '../lib/sdk/timePicker'
import DatePicker from '../lib/sdk/datePicker'
import * as fileList from '../lib/sdk/fileList'
import toast from '../lib/sdk/toast'
import image from '../lib/sdk/image'
import modal from '../lib/sdk/modal'
import actionSheet from '../lib/sdk/actionsheet'
import Preview from '../lib/component/preview'
import { dataURItoBlob, toNumber, getBus, once } from '../lib/util'

const Bus = getBus()
let fileIndex = 0
let fileStore = {}

function toAppService (obj) {
  if (obj.command == 'GET_ASSDK_RES') {
    ServiceJSBridge.invokeCallbackHandler(obj.ext.callbackID, obj.msg)
  } else {
    let view = router.currentView()
    let id = view ? view.id : 0
    ServiceJSBridge.subscribeHandler(obj.msg.eventName, obj.msg.data || {}, id)
  }
}

function getAudioElement () {
  const audioTagId = 'wx-audio-component-inside'
  let audio = document.getElementById(audioTagId)
  if (audio == null) {
    const audioTag = document.createElement('audio')
    document.body.appendChild(audioTag)
    audioTag.outerHTML = `<audio id="${audioTagId}" type="audio/mp3" style="display:none;"></audio>`
    audio = audioTag
  }
  return audio
}

function getBackgroundAudioElement () {
  const audioTagId = 'wx-background-audio-component-inside'
  let audio = document.getElementById(audioTagId)
  if (audio == null) {
    const audioTag = document.createElement('audio')
    document.body.appendChild(audioTag)
    audioTag.outerHTML = `<audio id="${audioTagId}" type="audio/mp3" style="display:none;"></audio>`
    audio = audioTag
    audio.addEventListener(
      'error',
      function () {
        toAppService({
          msg: {
            eventName: 'onMusicError',
            type: 'ON_MUSIC_EVENT'
          }
        })
      },
      false
    )
  }
  return audio
}

function requiredArgs (keys, data) {
  let args = data.args
  for (var i = 0, l = keys.length; i < l; i++) {
    if (!args.hasOwnProperty(keys[i])) {
      onError(data, `key ${keys[i]} required for ${data.sdkName}`)
      return true
    }
  }
  return false
}

function onError (data, message) {
  let obj = {
    command: 'GET_ASSDK_RES',
    ext: Object.assign({}, data),
    msg: {
      errMsg: `${data.sdkName}:fail`
    }
  }
  if (message) obj.msg.message = message
  toAppService(obj)
}

function onSuccess (data, extra = {}) {
  if (!data.sdkName) throw new Error('sdkName not found')
  let obj = {
    command: 'GET_ASSDK_RES',
    ext: Object.assign({}, data),
    msg: {
      errMsg: `${data.sdkName}:ok`
    }
  }
  obj.msg = Object.assign(obj.msg, extra)
  toAppService(obj)
}

function onCancel (data, extra = {}) {
  let obj = {
    command: 'GET_ASSDK_RES',
    ext: Object.assign({}, data),
    msg: {
      errMsg: `${data.sdkName}:cancel`
    }
  }
  obj.msg = Object.assign(obj.msg, extra)
  toAppService(obj)
}

function publishPagEevent (eventName, extra) {
  let obj = {
    command: 'MSG_FROM_WEBVIEW',
    msg: {
      data: {
        data: {
          data: extra,
          eventName
        }
      },
      eventName: 'custom_event_PAGE_EVENT'
    }
  }
  toAppService(obj)
}

function getWindowHeight () {
  var scrollable = document.querySelector('.scrollable')
  return scrollable.clientHeight
}

function getScrollHeight () {
  var scrollable = document.querySelector('.scrollable')
  return scrollable && scrollable.scrollHeight
}

export function onLaunch () {
  header.init()
  tabbar.init()
  router.onLaunch()
}

export function redirectTo (data) {
  router.redirectTo(data.args.url)
}

export function navigateTo (data) {
  router.navigateTo(data.args.url)
}

export function reLaunch (data) {
  router.reLaunch(data.args.url)
}

export function switchTab (data) {
  router.switchTab(data.args.url)
}

export function navigateBack (data) {
  data.args = data.args || {}
  let delta = data.args.delta ? Number(data.args.delta) : 1
  router.navigateBack(delta)
}

export function previewImage (data) {
  let args = data.args
  let urls = args.urls
  let current = args.current
  let preview = new Preview(urls, {})
  preview.show()
  preview.active(current)
  onSuccess(data)
}

export function stopPullDownRefresh (data) {
  let curr = router.currentView()
  if (curr) {
    curr.postMessage({
      command: 'STOP_PULL_DOWN_REFRESH'
    })
  }
  data.sdkName = 'stopPullDownRefresh'
  onSuccess(data)
}

// publish event to views
export function publish (data) {
  let all_ids = router.getViewIds()
  let ids = toNumber(data.webviewIds) || all_ids

  let obj = {
    msg: data,
    command: 'MSG_FROM_APPSERVICE'
  }
  router.eachView(view => {
    if (ids.indexOf(view.id) !== -1) {
      view.postMessage(obj)
    }
  })
}

// 页面滚动API
export function pageScrollTo (param) {
  var scrollable = document.querySelector('.scrollable'),
    scrollTop = param.args.scrollTop
  if (void 0 !== scrollTop) {
    scrollTop < 0 && (scrollTop = 0)
    var clientHeight = getWindowHeight(),
      scrollHeight = getScrollHeight()
    scrollTop > scrollHeight - clientHeight &&
    (scrollTop = scrollHeight - clientHeight)
    var init = function () {
        scrollable.style.transition = ''
        scrollable.style.webkitTransition = ''
        scrollable.style.transform = ''
        scrollable.style.webkitTransform = ''
        scrollable.scrollTop = scrollTop
        scrollable.removeEventListener('transitionend', init)
        scrollable.removeEventListener('webkitTransitionEnd', init)
      },
      l =
        'translateY(' + (scrollable.scrollTop - scrollTop) + 'px) translateZ(0)'
    scrollable.style.transition = 'transform .3s ease-out'
    scrollable.style.webkitTransition = '-webkit-transform .3s ease-out'
    scrollable.addEventListener('transitionend', init)
    scrollable.addEventListener('webkitTransitionEnd', init)
    scrollable.style.transform = l
    scrollable.style.webkitTransform = l
    scrollable.style.scrollTop = scrollTop
  }
}

export function setNavigationBarTitle (data) {
  let title = data.args.title
  if (title) header.setTitle(title)
}

export function setStatusBarStyle (data) {
  let color = data.args.color
  if (color) header.setState({color: color})
}

export function setNavigationBarColor (data) {
  let styles = data.args
  if (styles) header.setNavigationBarColor(styles)
}

export function showNavigationBarLoading () {
  header.showLoading()
}

export function hideNavigationBarLoading () {
  header.hideLoading()
}

export function chooseImage (data) {
  let URL = window.URL || window.webkitURL
  filePicker({multiple: true, accept: 'image/*'}, files => {
    files = [].slice.call(files).slice(0, data.args.count || files.length)
    let paths = files.map(file => {
      let blob = URL.createObjectURL(file)
      fileStore[blob] = file
      return blob
    })
    onSuccess(data, {tempFilePaths: paths})
  })
}

export function chooseVideo (data) {
  let URL = window.URL || window.webkitURL
  filePicker({accept: 'video/*'}, files => {
    let path = URL.createObjectURL(files[0])
    fileStore[path] = files[0]
    let video = document.createElement('video')
    video.preload = 'metadata'
    video.onloadedmetadata = function () {
      let duration = video.duration
      let size = files[0].size
      onSuccess(data, {
        duration,
        size,
        height: video.videoHeight,
        width: video.videoWidth,
        tempFilePath: path
      })
    }
    video.src = path
  })
}

export function saveFile (data) {
  let blob = data.args.tempFilePath
  if (!blob) return onError(data, 'file path required')
  let file = fileStore[blob]
  if (!file) return onError(data, 'file not found')
  let upload = new Upload(file)
  upload.to('/upload')
  upload.on('end', xhr => {
    if ((xhr.status / 100) | (0 === 2)) {
      let result = JSON.parse(xhr.responseText)
      onSuccess(data, {
        statusCode: xhr.status,
        savedFilePath: result.file_path
      })
    } else {
      onError(data, `request error ${xhr.status}`)
    }
  })
  upload.on('error', err => {
    onError(data, err.message)
  })
}

export function enableCompass () {
  let id = Compass.watch(
    throttle(head => {
      toAppService({
        msg: {
          eventName: 'onCompassChange',
          data: {
            direction: head
          }
        }
      })
    }, 200)
  )
  router.currentView().on('destroy', () => {
    Compass.unwatch(id)
  })
}

export function enableAccelerometer () {
  if (window.DeviceMotionEvent) {
    let handler = throttle(event => {
      let {x, y, z} = {
        x: event.accelerationIncludingGravity.x,
        y: event.accelerationIncludingGravity.y,
        z: event.accelerationIncludingGravity.z
      }
      if (x == null || y == null || z == null) return
      toAppService({
        msg: {
          eventName: 'onAccelerometerChange',
          data: {x, y, z}
        }
      })
    }, 200)
    window.addEventListener('devicemotion', handler, false)
    router.currentView().on('destroy', () => {
      window.removeEventListener('devicemotion', handler, false)
    })
  } else {
    console.warn('DeviceMotionEvent is not supported')
  }
}

export function getNetworkType (data) {
  let type = navigator.connection == null ? 'WIFI' : navigator.connection.type
  onSuccess(data, {
    networkType: type
  })
}

export function getLocation (data) {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(position => {
      let coords = position.coords
      onSuccess(data, {
        longitude: coords.longitude,
        latitude: coords.latitude
      })
    })
  } else {
    onError(data, {
      message: 'geolocation not supported'
    })
  }
}

export function openLocation (data) {
  let args = data.args
  let url =
    'http://apis.map.qq.com/tools/poimarker?type=0&marker=coord:' +
    args.latitude +
    ',' +
    args.longitude +
    '&key=JMRBZ-R4HCD-X674O-PXLN4-B7CLH-42BSB&referer=wxdevtools'
  router.openExternal(url)
  onSuccess(data, {
    latitude: args.latitude,
    longitude: args.longitude
  })
}

export function chooseLocation (data) {
  let url = `https://3gimg.qq.com/lightmap/components/locationPicker2/index.html?search=1&type=1&coord=39.90403%2C116.407526&key=JMRBZ-R4HCD-X674O-PXLN4-B7CLH-42BSB&referer=wxdevtools`
  router.openExternal(url)
  let called = false
  Bus.once('back', () => {
    if (!called) {
      called = true
      onCancel(data)
    }
  })
  Bus.once('location', location => {
    if (!called) {
      called = true
      if (location) {
        onSuccess(data, location)
      } else {
        onCancel(data)
      }
    }
  })
}

export function setStorage (data) {
  let args = data.args
  storage.set(args.key, args.data, args.dataType)
  if (args.key == null || args.key == '') {
    return onError(data, 'key required')
  }
  onSuccess(data)
}

export function getStorage (data) {
  let args = data.args
  if (args.key == null || args.key == '') {
    return onError(data, 'key required')
  }
  let res = storage.get(args.key)
  onSuccess(data, {
    data: res.data,
    dataType: res.dataType
  })
}

export function clearStorage (data) {
  storage.clear()
  onSuccess(data)
}

export function startRecord (data) {
  record
    .startRecord({
      success: url => {
        onSuccess(data, {
          tempFilePath: url
        })
      },
      fail: err => {
        return onError(data, err.message)
      }
    })
    .catch(e => {
      console.warn(`Audio record failed: ${e.message}`)
    })
}

export function stopRecord () {
  record.stopRecord().then(blob => {
    let filename = `audio${fileIndex}`
    fileIndex++
    let file = new File([blob], filename, {
      type: 'audio/x-wav',
      lastModified: Date.now()
    })
    fileStore[blob] = file
  })
}

export function playVoice (data) {
  let url = data.args.filePath
  let audio = getAudioElement()
  if (audio.src == url && audio.paused && !audio.ended) {
    // resume
    audio.play()
  } else {
    audio.src = url
    audio.load()
    audio.play()
    once(audio, 'error', e => {
      onError(data, e.message)
    })
    once(audio, 'ended', () => {
      onSuccess(data)
    })
  }
}

export function pauseVoice () {
  let audio = getAudioElement()
  audio.pause()
}

export function stopVoice () {
  let audio = getAudioElement()
  audio.pause()
  audio.currentTime = 0
  audio.src = ''
}

// window.addEventListener('DOMContentLoaded', function () {
//   let audio = getBackgroundAudioElement()
//   audio.addEventListener('error', function () {
//     toAppService({
//       msg: {
//         eventName: 'onMusicError',
//         type: 'ON_MUSIC_EVENT'
//       }
//     })
//   }, false)
// }, false)

export function getMusicPlayerState (data) {
  let a = getBackgroundAudioElement()
  let obj = {
    status: a.src ? (a.paused ? 0 : 1) : 2,
    currentPosition: Math.floor(a.currentTime) || -1
  }
  if (a.src && !a.paused) {
    obj.duration = a.duration || 0
    try {
      obj.downloadPercent = Math.round(100 * a.buffered.end(0) / a.duration)
    } catch (e) {}
    obj.dataUrl = a.currentSrc
  }
  onSuccess(data, obj)
}

export function operateMusicPlayer (data) {
  let args = data.args
  let a = getBackgroundAudioElement()
  switch (args.operationType) {
    case 'play':
      if (a.src == args.dataUrl && a.paused && !a.ended) {
        a.play()
      } else {
        a.src = args.dataUrl
        a.load()
        a.loop = true
        a.play()
      }
      toAppService({
        msg: {
          eventName: 'onMusicPlay',
          type: 'ON_MUSIC_EVENT'
        }
      })
      break
    case 'pause':
      a.pause()
      toAppService({
        msg: {
          eventName: 'onMusicPause',
          type: 'ON_MUSIC_EVENT'
        }
      })
      break
    case 'seek':
      a.currentTime = args.position
      break
    case 'stop':
      a.pause()
      a.currentTime = 0
      a.src = ''
      toAppService({
        msg: {
          eventName: 'onMusicEnd',
          type: 'ON_MUSIC_EVENT'
        }
      })
      break
  }
  onSuccess(data)
}

export function uploadFile (data) {
  let args = data.args
  if (!args.filePath || !args.url || !args.name) {
    return onError(data, 'filePath, url and name required')
  }
  let file = fileStore[args.filePath]
  if (!file) return onError(data, `${args.filePath} not found`)

  let headers = args.header || {}
  if (headers.Referer || headers.rederer) {
    console.warn('请注意，微信官方不允许设置请求 Referer')
  }
  let formData = args.formData || {}
  let xhr = new XMLHttpRequest()
  let reqUrl =
    (args.url.indexOf('http') === 0 &&
      args.url.indexOf(location.host) === -1 &&
      __wxConfig__.weweb &&
      (__wxConfig__.weweb.requestProxy || '/remoteProxy')) ||
    args.url
  xhr.open('POST', reqUrl)
  xhr.onload = function () {
    if ((xhr.status / 100) | (0 === 2)) {
      onSuccess(data, {statusCode: xhr.status, data: xhr.responseText})
    } else {
      onError(data, `request error ${xhr.status}`)
    }
  }
  xhr.onerror = function (e) {
    onError(data, `request error ${e.message}`)
  }
  let key
  for (key in headers) {
    xhr.setRequestHeader(key, headers[key])
  }
  xhr.setRequestHeader('X-Remote', args.url)
  let body = new FormData()
  body.append(args.name, file)
  for (key in formData) {
    body.append(key, formData[key])
  }
  xhr.send(body)
}

export function downloadFile (data) {
  let URL = window.URL || window.webkitURL
  let args = data.args
  if (!args.url) return onError(data, 'url required')
  let xhr = new XMLHttpRequest()
  xhr.responseType = 'arraybuffer'
  let headers = args.header || {}
  xhr.open('GET', '/remoteProxy?' + encodeURIComponent(args.url), true)
  xhr.onload = function () {
    if ((xhr.status / 100) | (0 === 2) || xhr.status == 304) {
      let b = new Blob([xhr.response], {
        type: xhr.getResponseHeader('Content-Type')
      })
      let blob = URL.createObjectURL(b)
      fileStore[blob] = b
      onSuccess(data, {
        statusCode: xhr.status,
        tempFilePath: blob
      })
    } else {
      onError(data, `request error ${xhr.status}`)
    }
  }
  xhr.onerror = function (e) {
    onError(data, `request error ${e.message}`)
  }
  let key
  for (key in headers) {
    xhr.setRequestHeader(key, headers[key])
  }
  xhr.setRequestHeader('X-Remote', args.url)
  xhr.send(null)
}

export function getSavedFileList (data) {
  fileList.getFileList().then(
    list => {
      onSuccess(data, {
        fileList: list
      })
    },
    err => {
      onError(data, err.message)
    }
  )
}

export function removeSavedFile (data) {
  let args = data.args
  if (requiredArgs(['filePath'], data)) return
  fileList.removeFile(args.filePath).then(
    () => {
      onSuccess(data, {})
    },
    err => {
      onError(data, err.message)
    }
  )
}

export function getSavedFileInfo (data) {
  let args = data.args
  if (requiredArgs(['filePath'], data)) return
  fileList.getFileInfo(args.filePath).then(
    info => {
      onSuccess(data, info)
    },
    err => {
      onError(data, err.message)
    }
  )
}

export function openDocument (data) {
  let args = data.args
  if (requiredArgs(['filePath'], data)) return
  modal({
    title: '确认打开',
    content: `openDocument ${args.filePath}`
  }).then(confirm => {
    onSuccess(data, {confirm})
  })
}

export function getStorageInfo (data) {
  let info = storage.info()
  onSuccess(data, info)
}

export function removeStorage (data) {
  let args = data.args
  if (requiredArgs(['key'], data)) return

  let o = storage.remove(args.key)
  onSuccess(data, {data: o})
}

export function showToast (data) {
  if (requiredArgs(['title'], data)) return
  toast.show(data.args)
  onSuccess(data)
}

export function hideToast (data) {
  toast.hide()
  onSuccess(data)
}

export function showModal (data) {
  if (requiredArgs(['title', 'content'], data)) return
  modal(data.args).then(confirm => {
    onSuccess(data, {confirm})
  })
}

export function showActionSheet (data) {
  let args = data.args
  if (requiredArgs(['itemList'], data)) return
  if (!Array.isArray(args.itemList)) {
    return onError(data, 'itemList must be Array')
  }
  args.itemList = args.itemList.slice(0, 6)
  actionSheet(args).then(res => {
    onSuccess(data, res)
  })
}

export function getImageInfo (data) {
  if (requiredArgs(['src'], data)) return
  image(data.args.src).then(
    res => {
      onSuccess(data, res)
    },
    err => {
      onError(data, err.message)
    }
  )
}

export function base64ToTempFilePath (data) {
  let uri = data.args.base64Data
  // args.canvasId
  onSuccess(data, {
    filePath: dataURItoBlob(uri)
  })
}

export function refreshSession (data) {
  onSuccess(data)
}

export function showPickerView (args) {
  const picker = new Picker(args)
  picker.show()
  // picker.on('cancel', () => {})
  picker.on('select', n => {
    publishPagEevent('bindPickerChange', {
      type: 'change',
      detail: {
        value: n + ''
      }
    })
  })
}

export function showDatePickerView (args) {
  let picker
  let eventName
  if (args.mode == 'time') {
    eventName = 'bindTimeChange'
    picker = new TimePicker(args)
  } else {
    eventName = 'bindDateChange'
    picker = new DatePicker(args)
  }
  picker.show()
  picker.on('select', val => {
    publishPagEevent(eventName, {
      type: 'change',
      detail: {
        value: val
      }
    })
  })
}
