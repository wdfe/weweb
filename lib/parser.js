const path = require('path')
const execFile = require('child_process').execFile
const exec = require('child_process').exec
const cache = require('./cache')
const config = require('./config')
const isWin = /^win/.test(process.platform)
const isLinux = /^linux/.test(process.platform)
const isMac = /^darwin/.test(process.platform)
const wcscMac = path.resolve(__dirname, '../bin/wcsc')
const wcscWin = wcscMac + '.exe'
const wcscLinux = 'wine ' + wcscWin
const wccMac = path.resolve(__dirname, '../bin/wcc')
const wccWin = wccMac + '.exe'
const wccLinux = 'wine ' + wccWin
const wcsc = isWin ? wcscWin : isMac ? wcscMac : wcscLinux
const wcc = isWin ? wccWin : isMac ? wccMac : wccLinux
const util = require('./util')
const wxssSourcemap = require('./wxss')
const wxmlArgs = ['-b']
const wxssArgs = ['-lc'] //, '-db'这个参数貌似跟sourcemap相关，用wine跑的时偶尔会报错，所以不用
const chalk = require('chalk')

const wxssTranspile = require('wxss-transpiler')
const wxmlTranspiler = require('wxml-transpiler')

const convert = require('convert-source-map')

function parseImports (file, wxss, cb) {
  let fn = wxss ? 'parseCssImports' : 'parseImports'
  let srcs = []
  util[fn](srcs, file, function (err) {
    if (err) {
      console.error(file+'=> ParseImports Error <='+err)
      return cb(err)
    }
    srcs.unshift(file)
    return cb(null, srcs.map(src => `./${src}`))
  })
}
let wxmlMsgFlag = 1
let wxssMsgFlag = 1

const useDefaultCompiler = process.env.DFT_CMP === 'true'

module.exports = function (fullPath) {
  fullPath = fullPath.replace(/^\.?\//, '')
  return new Promise(function (resolve, reject) {
    if(cache.get(fullPath)){
      return resolve(cache.get(fullPath))
    }
    if (/\.wxml$/.test(fullPath)) {
      parseImports(fullPath, false, (err, srcs) => {
        if (err) return reject(err)

        const wxmlCmpRes = wxmlTranspiler.wxmlCompile(srcs)
        const tagsInCode = wxmlCmpRes.tags
        if (useDefaultCompiler) {
          let execWcc = execFile.bind(null, wcc, wxmlArgs.concat(srcs))
          if (isLinux) {
            execWcc = exec.bind(
              null,
              [wcc]
              .concat(wxmlArgs)
              .concat(srcs)
              .join(' ')
            )
          }
          if (wxmlMsgFlag) {
            console.log(chalk.yellow('Using wcc.exe to transpile wxml:'))
            wxmlMsgFlag = 0
          }
          execWcc({ maxBuffer: 1024 * 600 }, (err, stdout, stderr) => {
            if (err) {
              console.error(err.stack)
              return reject(new Error(`${fullPath} 编译失败，请检查`))
            }
            const res = [stdout, tagsInCode]
            cache.set(fullPath,res)
            resolve(res)
          })
        } else {
          if (wxmlMsgFlag) {
            console.log(chalk.yellow('Using wxml-compiler to transpile wxml:'))
            wxmlMsgFlag = 0
          }
          const res = [wxmlCmpRes.render, tagsInCode]
          cache.set(fullPath,res)
          resolve(res)
        }
      })
    } else if (/\.wxss$/.test(fullPath)) {
      parseImports(fullPath, true, (err, srcs) => {
        if (err) return reject(err)
        cache.setWxssMap(srcs)

        if (useDefaultCompiler) {
          if (wxssMsgFlag) {
            console.log(chalk.yellow('Using wcsc.exe to build: '))
            wxssMsgFlag = 0
          }
          let execWcsc = execFile.bind(null, wcsc, wxssArgs.concat(srcs))
          if (isLinux) {
            execWcsc = exec.bind(
              null,
              [wcsc]
              .concat(wxssArgs)
              .concat(srcs)
              .join(' ')
            )
          }
          execWcsc({ maxBuffer: 1024 * 600 }, (err, stdout, stderr) => {
            if (err) {
              console.error(err.stack)
              return reject(new Error(`${fullPath} 编译失败，请检查`))
            }
            wxssSourcemap(fullPath, stdout).then(content => {
              cache.set(fullPath,content)
              resolve(content)
            }, reject)
          })
        } else {
          if (wxssMsgFlag) {
            console.log(
              chalk.yellow('Using wxss-transpiler to transpile wxss: ')
            )
            wxssMsgFlag = 0
          }
          wxssTranspile(srcs).then(stdout => {
            wxssSourcemap(fullPath, stdout).then(content => {
              cache.set(fullPath,content)
              resolve(content)
            }, reject)
          })
        }
      })
    } else if (/\.js$/.test(fullPath)) {
      config().then(function (obj) {
        util.parseJavascript(obj, fullPath).then(
          function ({ code, map }) {
            code = code + '\n' + map?convert.fromJSON(map).toComment():''
            cache.set(fullPath,code)
            resolve(code)
          },
          function (err) {
            console.error(err.stack)
            return reject(new Error(`${fullPath} 编译失败，请检查`))
          }
        )
      }, reject)
    } else {
      resolve()
    }
  }).catch(e => {
    console.error(fullPath+'==> Parse Page Error:', e)
  })
}
