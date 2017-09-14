import pageInit from './pageInit';
import eventHandle from './initApp';
window.Page = pageInit.pageHolder
window.App = eventHandle.appHolder
window.getApp = eventHandle.getApp
window.getCurrentPages = pageInit.getCurrentPages
