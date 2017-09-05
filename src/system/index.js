import Nprogress from 'nprogress'
import * as util from './util'
import header from './header'
import Bus from './bus'
import {eachView, navigateBack, navigateTo, currentView} from './viewManage'
import {onBack, lifeSycleEvent, toAppService} from './service'
import * as command from './command'
import tabbar from './tabbar'
import * as nativeMethods from './native'
header.init();
tabbar.init();

Nprogress.start()


function sdk(data) {
  let msg = data.msg
  if (msg) {
    let sdkName = msg.sdkName
    if (sdkName == 'showPickerView') {
      command.showPickerView(data, msg.args)
    } else if (sdkName == 'showDatePickerView') {
      command.showDatePickerView(data, msg.args)
    } else if (sdkName == 'onKeyboardComplete') {
      showConsole(msg.sdkName, 'REGISTER_SDK')
    } else if (sdkName == 'getPublicLibVersion'
      || sdkName == 'onKeyboardConfirm'
      || sdkName == 'disableScrollBounce'
      || sdkName == 'onTextAreaHeightChange'
      || sdkName == 'onKeyboardShow') {
      //do nothing
    } else {
      console.warn(`Ignored EXEC_JSSDK ${JSON.stringify(data.msg)}`)
    }
  }
}

function showConsole(sdkName, type) {
  let view = currentView()
  view.postMessage({
    msg: {
      act: "JSSDKLOG",
      isErr: false,
      sdkName: sdkName,
      type: type,
      inputArgs: {},
      sdkRes: {}
    },
    command: "SHOW_CONSOLE_LOG"
  })
}

const systemBridge = {
  doSyncCommand: function (params) {
    const method = params.sdkName;
    if (nativeMethods.hasOwnProperty(method)) {
      return nativeMethods[method](params)
    } else {
      console.warn(`${method} not found on native.js`)
    }
  },
  doCommand: function (data) {
    data = data || {}
    const cmd = data.command
    const msg = data.msg
    // location picker of map
    if (data.module == 'locationPicker') {
      currentView().setLocation(data)
      return
    }
    if (data.to != "backgroundjs") return

    if (data.command == 'EXEC_JSSDK') {//from view
      sdk(data)
    } else if (cmd == 'TO_APP_SERVICE') {//from view
      delete data.command
      if (msg && msg.eventName == 'custom_event_DOMContentLoaded') {
        Bus.emit('ready', data.webviewID)
        Nprogress.done()
      }
      toAppService(data)
    } else if (cmd == 'COMMAND_FROM_ASJS') {//from service
      let sdkName = data.sdkName
      if (command.hasOwnProperty(sdkName)) {
        command[sdkName](data)
      } else {
        console.warn(`Method ${sdkName} not implemented for command!`)
      }
    } else if (cmd == 'PULLDOWN_REFRESH') {
      command['PULLDOWN_REFRESH'](data)
    } else if (cmd == 'WEBVIEW_READY') {
      // TODO figure out WTF is this
    } else {
      console.warn(`Command ${cmd} not recognized!`)
    }
  }
}

window.systemBridge = systemBridge;