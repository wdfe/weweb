import Enums from './Enums'
import utils from '../../common/utils'

const init = function () {
  window.__webview_engine_version__ = 0.02
  document.addEventListener(
    'DOMContentLoaded',
    function () {
      let screenWidth = utils.getPlatform() && window.innerWidth || 375
      document.documentElement.style.fontSize = screenWidth / Enums.RPX_RATE + 'px'
    },
    1e3
  )
}

export default {init}
