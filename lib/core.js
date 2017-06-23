'use strict'
const fs = require('fs')
const path = require('path')
const loadConfig = require('./config')
const util = require('./util')
const cache = require('./cache')
const parser = require('./parser')
const version = require('../package.json').version
const builder = require('./builder')
const co = require('co')

function escape(x) { return x}

function noext(str) {
  return str.replace(/\.\w+$/, '')
}

function loadFile(p, throwErr = true) {
  if (/\.wxss$/.test(p)) throwErr = false
  return new Promise((resolve, reject) => {
    fs.stat(`./${p}`, (err, stats) => {
      if (err) {
        if (throwErr) return reject(new Error(`file ${p} not found`))
        return resolve('')
      }
      if (stats && stats.isFile()) {
        let content = cache.get(p)
        if (content) {
          return resolve(content)
        } else {
          return parser(`${p}`).then(resolve, reject)
        }
      } else {
        return resolve('')
      }
    })
  })
}

exports.getIndex = co.wrap(function *() {
  let [config, rootFn] = yield [loadConfig(), util.loadTemplate('index')]
  let pageConfig = yield util.loadJSONfiles(config.pages)
  config['window'].pages = pageConfig
  let tabBar = config.tabBar || {}
  let topBar = tabBar.position == 'top';
  return rootFn({
    config: JSON.stringify(config),
    root: config.root,
    ip: util.getIp(),
    topBar: topBar,
    tabbarList:tabBar.list,
    tabStyle:`background-color: ${tabBar.backgroundColor}; border-color: ${tabBar.borderStyle}; height: `+(topBar?47 : 56)+'px;',
    tabLabelColor:tabBar.color,
    tabLabelSelectedColor:tabBar.selectedColor,
    version
  }, {}, escape)
})(true)

exports.getServiceJs = co(function* () {
  return yield builder.load()
})

exports.getPage = function(path){
  return co(function* () {
    return yield [loadFile(path + '.wxml'),loadFile(path + '.wxss')]
  })
}

exports.getAppWxss = function(path){
  return co(function* () {
    return yield loadFile(path + '.wxss')
  })
}
