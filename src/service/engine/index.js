import pageInit from './pageInit';
import eventHandle from './initApp';


Object.defineProperty(exports, "Page", {
    enumerable: true,
    get: function() {
        return pageInit.pageHolder;
    }
});
Object.defineProperty(exports, "getCurrentPages", {
    enumerable: true,
    get: function() {
        return pageInit.getCurrentPages;
    }
});
Object.defineProperty(exports, "App", {
    enumerable: true,
    get: function() {
        return eventHandle.appHolder;
    }
});
Object.defineProperty(exports, "getApp", {
    enumerable: true,
    get: function() {
        return eventHandle.getApp;
    }
})