var webSocket = null,
  requestIndex = 0
var jsonp = function (params, callback, networkTimeout) {
  var jsonpName =
      'jsonp_' +
      Date.now() +
      '_' +
      Math.random()
        .toString()
        .substr(2),
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
    header = params.header || {},
    timeOut,
    requestObj = new XMLHttpRequest(),
    method = params.method || 'POST',
    networkTimeout = 3e4
  if (__wxConfig__ && __wxConfig__.weweb && __wxConfig__.weweb.requestProxy) {
    requestObj.open(method, __wxConfig__.weweb.requestProxy, true)
    requestObj.onreadystatechange = function () {
      if ((requestObj.readyState == 3, requestObj.readyState == 4)) {
        requestObj.onreadystatechange = null
        var statusCode = requestObj.status
        if (statusCode != 0) {
          requestIndex--
          timeOut && clearTimeout(timeOut)
          callback &&
            callback({
              errMsg: 'request:ok',
              data: requestObj.responseText,
              statusCode: statusCode
            })
        }
      }
    }
    requestObj.onerror = function () {
      callback &&
        callback({
          errMsg: 'request:fail'
        })
    }
    requestObj.setRequestHeader('X-Remote', params.url)
    requestObj.setRequestHeader(
      'Cache-Control',
      'no-cache, no-store, must-revalidate'
    )
    requestObj.setRequestHeader('Pragma', 'no-cache')
    requestObj.setRequestHeader('Expires', '0')

    var attrCount = 0
    for (var attr in header) {
      attr.toLowerCase() === 'content-type' && attrCount++
    }
    attrCount >= 2 && delete header['content-type']
    var typeTag = false
    for (var headerAttr in header) {
      if (header.hasOwnProperty(headerAttr)) {
        var headerStr = headerAttr.toLowerCase()
        typeTag = headerStr == 'content-type' || typeTag
        if (headerStr === 'cookie') {
          requestObj.setRequestHeader('_Cookie', header[headerAttr])
        } else {
          requestObj.setRequestHeader(headerAttr, header[headerAttr])
        }
      }
    }
    method != 'POST' ||
      typeTag ||
      requestObj.setRequestHeader(
        'Content-Type',
        'application/x-www-form-urlencoded; charset=UTF-8'
      )
    requestObj.setRequestHeader('X-Requested-With', 'requestObj')
    if (typeof networkTimeout === 'number') {
      timeOut = setTimeout(function () {
        requestObj.abort('timeout')
        params.complete && params.complete()
        params.complete = null
        requestIndex--
        callback &&
          callback({
            errMsg: 'request:fail'
          })
      }, networkTimeout)
    }

    var tempData = typeof params.data === 'string' ? params.data : null
    try {
      requestObj.send(tempData)
    } catch (y) {
      requestIndex--
      callback &&
        callback({
          errMsg: 'request:fail'
        })
    }
  } else {
    jsonp(params, callback, networkTimeout)
  }
}

var connectSocket = function (event, temp, callback) {
  var url = temp.url,
    header = temp.header
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
