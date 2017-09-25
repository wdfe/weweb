const catchError = function (func) {
  return function () {
    try {
      func.apply(void 0, Array.from(arguments))
    } catch (err) {
      console.error(err.stack)
      Reporter.errorReport({
        key: 'exparserScriptError',
        error: err
      })
    }
  }
}

exparser.addGlobalErrorListener(function (error, errData) {
  Reporter.errorReport({
    key: 'webviewScriptError',
    error: error,
    extend: errData.message
  })
})

export default { catchError }
