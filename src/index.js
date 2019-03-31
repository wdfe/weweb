import './assets/css/index.css'

import './common/globalDefined'

import './service/bridge'

import './common/reporter'

import './service/api'

import './service/engine'

import './service/amdEngine'

import './view/api'

import './view/exparser'

// register components
import './view/exparser-component'

import './view/virtual-dom'

exparser.addGlobalErrorListener(function (error, errData) {
  Reporter.errorReport({
    key: 'webviewScriptError',
    error: error,
    extend: errData.message
  })
})