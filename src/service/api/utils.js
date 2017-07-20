function surroundByTryCatchFactory(func, funcName) {//返回函数e
    return function () {
        try {
            return func.apply(func, arguments)
        } catch (e) {
            if ("[object Error]" === Object.prototype.toString.apply(e)) {
                if ("AppServiceSdkKnownError" == e.type) throw e;
                Reporter.errorReport({
                    key: "appServiceSDKScriptError",
                    error: e,
                    extend: funcName
                })
            }
        }
    }
}

function anyTypeToString(data) {//把e转成string并返回一个对象
    var dataType = Object.prototype.toString.call(data).split(" ")[1].split("]")[0];
    if ("Array" == dataType || "Object" == dataType){
        try {
            data = JSON.stringify(data)
        } catch (e) {
            e.type = "AppServiceSdkKnownError"
            throw e
        }
    }else{
        data = "String" == dataType || "Number" == dataType || "Boolean" == dataType ?
            data.toString() :
            "Date" == dataType ?
                data.getTime().toString() :
                "Undefined" == dataType ?
                    "undefined" :
                    "Null" == dataType ? "null" : "";
    }
    return {
        data: data,
        dataType: dataType
    }
}

function stringToAnyType(data, type) {//把e解码回来，和前面a相对应

    return data = "String" == type ?
        data :
        "Array" == type || "Object" == type ?
            JSON.parse(data) :
            "Number" == type ?
                parseFloat(data) :
                "Boolean" == type ?
                    "true" == data :
                    "Date" == type ?
                        new Date(parseInt(data)) :
                        "Undefined" == type ?
                            void 0 : "Null" == type ? null : ""
}

function getDataType(data) {//get data type
    return Object.prototype.toString.call(data).split(" ")[1].split("]")[0]
}

function isObject(e) {
    return "Object" === getDataType(e)
}

function paramCheck(params, paramTpl) {//比较e\t
    var result,
        name = arguments.length > 2 && void 0 !== arguments[2] ? arguments[2] : "parameter",
        tplTpye = getDataType(paramTpl),
        pType = getDataType(params);
    if (pType != tplTpye) return name + " should be " + tplTpye + " instead of " + pType + ";";
    switch (result = "", tplTpye) {
        case "Object":
            for (var i in paramTpl) result += paramCheck(params[i], paramTpl[i], name + "." + i);
            break;
        case "Array":
            if (params.length < paramTpl.length) return name + " should have at least " + paramTpl.length + " item;";
            for (var a = 0; a < paramTpl.length; ++a) result += paramCheck(params[a], paramTpl[a], name + "[" + a + "]")
    }
    return result
}

function getRealRoute(pathname, url) {
    var n = !(arguments.length > 2 && void 0 !== arguments[2]) || arguments[2];
    if (n && (url = addHTMLSuffix(url)), 0 === url.indexOf("/")) return url.substr(1);
    if (0 === url.indexOf("./")) return getRealRoute(pathname, url.substr(2), !1);
    var index, urlArrLength, urlArr = url.split("/");
    for (index = 0, urlArrLength = urlArr.length; index < urlArrLength && ".." === urlArr[index]; index++);
    urlArr.splice(0, index);
    var newUrl = urlArr.join("/"),
        pathArr = pathname.length > 0 ? pathname.split("/") : [];
    pathArr.splice(pathArr.length - index - 1, index + 1);
    var newPathArr = pathArr.concat(urlArr)
    return newPathArr.join("/");
}

function getPlatform() {//return platform
    return "devtools"
}

function urlEncodeFormData(data) {//把对象生成queryString
    var needEncode = arguments.length > 1 && void 0 !== arguments[1] && arguments[1];
    if ("object" !== typeof(data)) return data;
    var tmpArr = [];
    for (var o in data) if (data.hasOwnProperty(o)) {
        if (needEncode) {
            try {
                tmpArr.push(encodeURIComponent(o) + "=" + encodeURIComponent(data[o]))
            } catch (t) {
                tmpArr.push(o + "=" + data[o])
            }
        }else tmpArr.push(o + "=" + data[o]);

    }
    return tmpArr.join("&")
}

function addQueryStringToUrl(originalUrl, newParams) {//生成url t:param obj
    if ("string" == typeof originalUrl && "object" === typeof(newParams) && Object.keys(newParams).length > 0) {
        var urlComponents = originalUrl.split("?"),
            host = urlComponents[0],
            oldParams = (urlComponents[1] || "").split("&").reduce(function (res, cur) {
                if ("string" == typeof cur && cur.length > 0) {
                    var curArr = cur.split("="),
                        key = curArr[0],
                        value = curArr[1];
                    res[key] = value
                }
                return res
            }, {}),
            refinedNewParams = Object.keys(newParams).reduce(function (res, cur) {
                "object" === typeof(newParams[cur]) ?
                    res[encodeURIComponent(cur)] = encodeURIComponent(JSON.stringify(newParams[cur])) :
                    res[encodeURIComponent(cur)] = encodeURIComponent(newParams[cur])
                return res
            }, {});
        return host + "?" + urlEncodeFormData(assign(oldParams, refinedNewParams))
    }
    return originalUrl
}

function validateUrl(url) {
    return /^(http|https):\/\/.*/i.test(url)
}

function assign() {//endext 对象合并
    for (var argLeng = arguments.length, args = Array(argLeng), n = 0; n < argLeng; n++) {
        args[n] = arguments[n];
    }
    return args.reduce(function (res, cur) {
        for (var n in cur) {
            res[n] = cur[n];
        }
        return res
    }, {})
}

function encodeUrlQuery(url) {//把url中的参数encode
    if ("string" == typeof url) {
        var urlArr = url.split("?"),
            urlPath = urlArr[0],
            queryParams = (urlArr[1] || "").split("&").reduce(function (res, cur) {
                    if ("string" == typeof cur && cur.length > 0) {
                        var curArr = cur.split("="),
                            key = curArr[0],
                            value = curArr[1];
                        res[key] = value
                    }
                    return res
                }, {}),
            urlQueryArr = [];
        for (var i in queryParams) {
            queryParams.hasOwnProperty(i) && urlQueryArr.push(i + "=" + encodeURIComponent(queryParams[i]));
        }
        return urlQueryArr.length > 0 ? urlPath + "?" + urlQueryArr.join("&") : url
    }
    return url
}

function addHTMLSuffix(url) {//给url加上。html的扩展名
    if ("string" != typeof url) throw new A("wd.redirectTo: invalid url:" + url);
    var urlArr = url.split("?");
    urlArr[0] += ".html"
    return "undefined" != typeof urlArr[1] ? urlArr[0] + "?" + urlArr[1] : urlArr[0]
}

function extend(target, obj) {//t合并到e对象
    for (var n in obj) target[n] = obj[n];
    return target
}

function arrayBufferToBase64(buffer) {
    for (var res = "", arr = new Uint8Array(buffer), arrLeng = arr.byteLength, r = 0; r < arrLeng; r++) {
        res += String.fromCharCode(arr[r]);
    }
    return btoa(res)
}

function base64ToArrayBuffer(str) {
    for (var atobStr = atob(str), leng = atobStr.length, arr = new Uint8Array(leng), r = 0; r < leng; r++) arr[r] = atobStr.charCodeAt(r);
    return arr.buffer
}

function blobToArrayBuffer(blobStr, callback) {//readAsArrayBuffer t:callback
    var fileReader = new FileReader;
    fileReader.onload = function () {
        callback(this.result)
    }
    fileReader.readAsArrayBuffer(blobStr)
}

function convertObjectValueToString(obj) {//把对象元素都转成字符串
    return Object.keys(obj).reduce(function (res, cur) {
        "string" == typeof obj[cur] ?
            res[cur] = obj[cur] :
            "number" == typeof obj[cur] ?
                res[cur] = obj[cur] + "" :
                res[cur] = Object.prototype.toString.apply(obj[cur])
        return res
    }, {})
}
function renameProperty(obj, oldName, newName) {
  isObject(obj) !== !1 && oldName != newName && obj.hasOwnProperty(oldName) && (obj[newName] = obj[oldName], delete obj[oldName])
}

var words = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",
    btoa = btoa ||
        function (str) {
            for (var curPosFlag, curCodeValue, text = String(str), res = "", i = 0, wordTpl = words; text.charAt(0 | i) || (wordTpl = "=", i % 1); res += wordTpl.charAt(63 & curPosFlag >> 8 - i % 1 * 8)) {
                curCodeValue = text.charCodeAt(i += .75)
                if (curCodeValue > 255) throw new Error('"btoa" failed');
                curPosFlag = curPosFlag << 8 | curCodeValue
            }
            return res
        },
    atob = atob ||
        function (str) {
            var text = String(str).replace(/=+$/, ""),
                res = "";
            if (text.length % 4 === 1) throw new Error('"atob" failed');
            for (var curFlage, curValue, i = 0, a = 0; curValue = text.charAt(a++); ~curValue && (curFlage = i % 4 ? 64 * curFlage + curValue : curValue, i++ % 4) ? res += String.fromCharCode(255 & curFlage >> ( -2 * i & 6)) : 0)
                curValue = words.indexOf(curValue);
            return res
        }

class AppServiceSdkKnownError extends Error {
    constructor(e) {
        super("APP-SERVICE-SDK:" + e);
        this.type = "AppServiceSdkKnownError";
    }
}
export default  {
    surroundByTryCatchFactory: surroundByTryCatchFactory,
    getDataType: getDataType,
    isObject: isObject,
    paramCheck: paramCheck,
    getRealRoute: getRealRoute,
    getPlatform: getPlatform,
    urlEncodeFormData: urlEncodeFormData,
    addQueryStringToUrl: addQueryStringToUrl,
    validateUrl: validateUrl,
    assign: assign,
    encodeUrlQuery: encodeUrlQuery,
    extend: extend,
    arrayBufferToBase64: arrayBufferToBase64,
    base64ToArrayBuffer: base64ToArrayBuffer,
    blobToArrayBuffer: blobToArrayBuffer,
    convertObjectValueToString: convertObjectValueToString,
    anyTypeToString: surroundByTryCatchFactory(anyTypeToString, "anyTypeToString"),
    stringToAnyType: surroundByTryCatchFactory(stringToAnyType, "stringToAnyType"),
    AppServiceSdkKnownError: AppServiceSdkKnownError,
    renameProperty: renameProperty,
    defaultRunningStatus : "active"
}