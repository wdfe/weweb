var errListenerFns = function () {}
var utils = {
    // log report obj
    surroundThirdByTryCatch: function (fn, extend) {
        return function () {
            var res
            try {
              res = fn.apply(fn, arguments)
            } catch (error) {
                var key = 'thirdScriptError'
                var content = extend ? error.message + ';' + extend : error.message
                utils.triggerErrorMessage(key + '\n' + content + '\n' + error.stack)
            }
            return res
        }
    },
    slowReport: function (params) {
        console.log('SLOW!!!!!', params)
    },
    reportKeyValue: function (params) {
    },
    reportIDKey: function (params) {
    },
    thirdErrorReport: function (params) {
        var error = params.error, extend = params.extend
        // utils.errorReport
        // console.log({
        //     key: 'thirdScriptError',
        //     error: error,
        //     extend: extend
        // })
        console.group('thirdScriptError', extend)
        console.log(error)
        console.groupEnd()
    },
    errorReport: function (params) {
    },
    registerErrorListener: function (fn) {
        typeof fn === 'function' && (errListenerFns = fn)
    },
    unRegisterErrorListener: function () {
        errListenerFns = function () {}
    },
    triggerErrorMessage: function (params) {
        errListenerFns(params)
    }
}
window.Reporter = utils
module.exports = utils
