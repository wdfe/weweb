var webSocket = null, requestIndex = 0
var jsonp = function (params, callback, networkTimeout) {
  var jsonpName =
    'jsonp_' + Date.now() + '_' + Math.random().toString().substr(2),
    callbackName = 'callback',
    url = params.url,
    timeOut,
    script = document.createElement('script')

  url += (url.indexOf('?') === -1 ? '?' : '&') + callbackName + '=' + jsonpName
  script.src = url
  if (typeof networkTimeout === 'number') {
    timeOut = setTimeout(function () {
      window[jsonpName] = function () {}
      callback &&
        callback({
          errMsg: 'request:fail'
        })
    }, networkTimeout)
  }

  window[jsonpName] = function (response) {
    try {
      timeOut && clearTimeout(timeOut)
      callback &&
        callback({
          errMsg: 'request:ok',
          data: response,
          statusCode: 200
        })
    } finally {
      delete window[jsonpName]
      script.parentNode.removeChild(script)
    }
  }
  document.body.appendChild(script)
}
var request = function (event, params, callback) {
  requestIndex++
  var url = params.url,
    headers = params.header || {},
    timeOut,
    xhr = new XMLHttpRequest(),
    method = params.method || 'POST',
    networkTimeout = 3e4

  if (
    __wxConfig__ &&
    __wxConfig__.weweb &&
    (__wxConfig__.weweb.requestProxy ||
      __wxConfig__.weweb.requestType == 'ajax')
  ) {
    // 配置了 reqProxy， 使用代理来请求
    if (__wxConfig__.weweb.requestProxy) {
      url = __wxConfig__.weweb.requestProxy
    }

    xhr.open(method, url, true)

    if (__wxConfig__.weweb.requestType == 'ajax') {
      xhr.withCredentials = true
    }

    xhr.onreadystatechange = function () {
      if ((xhr.readyState == 3, xhr.readyState == 4)) {
        xhr.onreadystatechange = null
        var statusCode = xhr.status
        if (statusCode != 0) {
          requestIndex--
          timeOut && clearTimeout(timeOut)
          callback &&
            callback({
              errMsg: 'request:ok',
              data: xhr.responseText,
              statusCode: statusCode
            })
        }
      }
    }

    xhr.onerror = function () {
      callback &&
        callback({
          errMsg: 'request:fail'
        })
    }

    if (__wxConfig__.weweb.requestType != 'ajax') {
      xhr.setRequestHeader('X-Remote', params.url)
      xhr.setRequestHeader(
        'Cache-Control',
        'no-cache, no-store, must-revalidate'
      )
      xhr.setRequestHeader('Pragma', 'no-cache')
      xhr.setRequestHeader('Expires', '0')
    }

    // 不晓得为啥会有两个 content-type
    var attrCount = 0
    for (var attr in headers) {
      attr.toLowerCase() === 'content-type' && attrCount++
    }
    attrCount >= 2 && delete headers['content-type']

    // 设置 请求的 header
    var hasContentType = false
    for (var headerKey in headers) {
      if (headers.hasOwnProperty(headerKey)) {
        var headerValue = headerKey.toLowerCase()
        hasContentType = headerValue == 'content-type' || hasContentType
        if (headerValue === 'cookie') {
          xhr.setRequestHeader('_Cookie', headers[headerKey])
        } else {
          xhr.setRequestHeader(headerKey, headers[headerKey])
        }
      }
    }

    method != 'POST' ||
      hasContentType ||
      xhr.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8'
      )

    xhr.setRequestHeader('X-Requested-With', 'requestObj')

    // 手动模拟超时
    if (typeof networkTimeout === 'number') {
      timeOut = setTimeout(function () {
        xhr.abort('timeout')
        params.complete && params.complete()
        params.complete = null
        requestIndex--
        callback &&
          callback({
            errMsg: 'request:fail'
          })
      }, networkTimeout)
    }

    var reqData = typeof params.data === 'string' ? params.data : null

    try {
      xhr.send(reqData)
    } catch (y) {
      requestIndex--
      callback &&
        callback({
          errMsg: 'request:fail'
        })
    }
  } else {
    // 不配置 requestPrxy，默认走 jsonp
    jsonp(params, callback, networkTimeout)
  }
}

var connectSocket = function (event, temp, callback) {
  var url = temp.url, header = temp.header
  /* 安全域名检测
    if (!loadFile.checkUrl(url, "webscoket")) {
        return void(callback && callback({
            errMsg: "connectSocket:fail"
        }));
    }
*/
  webSocket = new WebSocket(url)
  for (var attr in header) {
    header.hasOwnProperty(attr)
  }
  webSocket.onopen = function (data) {
    ServiceJSBridge.subscribeHandler('onSocketOpen', data)
  }
  webSocket.onmessage = function (data) {
    ServiceJSBridge.subscribeHandler('onSocketMessage', {
      data: data.data
    })
  }
  webSocket.onclose = function (data) {
    ServiceJSBridge.subscribeHandler('onSocketClose', data)
  }
  webSocket.onerror = function (data) {
    ServiceJSBridge.subscribeHandler('onSocketError', data)
  }
  callback &&
    callback({
      errMsg: 'connectSocket:ok'
    })
}
var closeSocket = function (event, temp, callback) {
  if (webSocket) {
    webSocket.close()
    webSocket = null
    callback &&
      callback({
        errMsg: 'closeSocket:ok'
      })
  } else {
    callback &&
      callback({
        errMsg: 'closeSocket:fail'
      })
  }
}
var sendSocketMessage = function (event, temp, callback) {
  var data = temp.data
  if (webSocket) {
    try {
      webSocket.send(data)
      callback &&
        callback({
          errMsg: 'sendSocketMessage:ok'
        })
    } catch (Event) {
      callback &&
        callback({
          errMsg: 'sendSocketMessage:fail ' + Event.message
        })
    }
  } else {
    callback &&
      callback({
        errMsg: 'sendSocketMessage:fail'
      })
  }
}
export default {
  request: request,
  connectSocket: connectSocket,
  sendSocketMessage: sendSocketMessage,
  closeSocket: closeSocket
}
