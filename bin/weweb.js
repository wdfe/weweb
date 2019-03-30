#!/usr/bin/env node
const startTime = new Date()
const loadConfig = require('../lib/config')
const os = require('os')
const childProcess = require('child_process')
const pify = require('pify')
const exec = pify(childProcess.exec)
const program = require('commander')
const json = require('../package.json')
const UpdateNotifier = require('update-notifier').UpdateNotifier
const open = require('open')
const fs = require('fs-extra')
const has = require('has-value')
const chalk = require('chalk')
const net = require('net')
const boxen = require('boxen')
const isWin = /^win/.test(process.platform)
const path = require('path')
const semCmp = require('semver-compare')
const util = require('../lib/util')
const core = require('../lib/core')
const { getAllCustomComponents } = require('../lib/builder')

let cmdRm, cmdCp, cmdCpArg
if (isWin) {
  cmdRm = 'rmdir /s /q '
  cmdCp = 'xcopy '
  cmdCpArg = ' /y /d /s'
} else {
  cmdRm = 'rm -rf '
  cmdCp = 'cp -rf '
  cmdCpArg = ''
}

program
  .version(json.version)
  .usage('[options] <appRoot>')
  .option('-b, --babel', '对小程序源码采用babel转换')
  .option('-d, --dist <p>', '指定生成的路径')
  .option('-l, --list', '使用默认浏览器打开更新历史')
  .option('-n, --nocheck', '不检查更新')
  .option('-o, --open', '使用 Chrome 打开小程序，仅对 Mac 有效')
  .option('-p, --port <n>', '指定服务端口，默认 3000', parseInt)
  .option('-t, --transform', '只转换小程序,不起web服务')

program.parse(process.argv)

/**
 * log 函数，只转换小程序时不输出
 *
 * @param {any} msg
 * @param {any} allow
 */
const log = function (msg, allow) {
  if (!program.transform || allow) {
    console.log(msg)
  }
}

// 更新检查方法
const notifier = new UpdateNotifier({
  pkg: json,
  callback: function (err, result) {
    if (err) return
    if (semCmp(result.latest, result.current) > 0) {
      const message =
        'Update available ' +
        chalk.dim(result.current) +
        chalk.reset(' → ') +
        chalk.green(result.latest) +
        ' \nRun ' +
        chalk.cyan('npm i -g ' + json.name) +
        ' to update'
      const msg =
        '\n' +
        boxen(message, {
          padding: 1,
          margin: 1,
          align: 'center',
          borderColor: 'yellow',
          borderStyle: 'round'
        })
      log(msg)
    }
  }
})

// 打开更新历史
if (program.list) {
  open('https://github.com/wdfe/weweb/releases')
  process.exit()
}

let tmpFolderName
let curPath = process.cwd()

function checkProject () {
  let folder = program.args[0]
  if (folder) {
    let stats
    try {
      stats = fs.statSync(folder)
    } catch (e) {}

    if (!stats) {
      log(`指定目录 ${folder} 不存在或者不是目录，请检查`)
      process.exit()
    } else if (stats.isFile()) {
      if (folder.match(/\.zip$/i)) {
        tmpFolderName =
          '/tmp/__weapp' +
          Math.random()
            .toString(16)
            .substr(2) +
          new Date().getTime()
        childProcess.execSync(`unzip ${folder} -d ${tmpFolderName}`)
        log(folder)
        folder = childProcess
          .execSync(`find ${tmpFolderName} -name app.json -print`)
          .toString()
          .replace(/^\s+|(app\.json\s*$)/, '')
        let tmpMatchValue = folder.match(/(^.*)\n/)
        if (tmpMatchValue) {
          folder = tmpMatchValue[1].replace(/app\.json\s*$/, '')
        }
      } else {
        log('指定目录不存在或者不是目录，请检查')
        process.exit()
      }
    } else if (!stats.isDirectory) {
      log('指定目录不存在或者不是目录，请检查')
      process.exit()
    }

    try {
      process.chdir(folder)
    } catch (err) {
      log('切换目录失败: ' + err)
    }
  }
  if (!fs.existsSync('./app.json')) {
    log(chalk.red('无法找到 app.json 文件，请检查'))
    process.exit()
  }
}

// 开始转换代码
let distPath = path.resolve(curPath, program.dist || './wewebTmp/dist')

/**
 *   记录构建时间
 */
function printRunTime () {
  const endTime = new Date()
  console.log(
    chalk.yellow(
      `Build Complete. Time elapsed: ${(endTime - startTime) / 1000}s`
    )
  )
}

/**
 * 启动服务器
 *
 */
function bootWebServer () {
  let server = require('../lib/server')(distPath)
  let startPort = 2000

  getPort(function (port) {
    if (os.platform() === 'darwin' && program.open) {
      exec('osascript chrome.scpt ' + port, { cwd: __dirname }, function () {})
    }
    server.listen(port, function () {
      // printLog('listening on port ' + port)
      const openMsg = `Opening it on: http://localhost:${port}`
      let msg =
        '\n' +
        boxen(openMsg, {
          padding: 1,
          margin: 1,
          align: 'center',
          borderColor: 'yellow',
          borderStyle: 'round'
        })
      printRunTime()
      // notify.notify({
      //   'title': 'Build Done',
      //   'message': new Date()
      // });
      log(msg)
      if (program.open) open('http://localhost:' + port)
    })
  })

  function getPort (cb) {
    if (program.port) return cb(program.port)
    let port = startPort

    let server = net.createServer()
    server.listen(port, function () {
      server.once('close', function () {
        cb(port)
      })
      server.close()
    })
    server.on('error', function () {
      startPort += 1
      getPort(cb)
    })
  }
}

async function buildPage ({ path, tabBar }) {
  let fullpath = path.replace(/^(\/|\.\/)/, '')
  let paths = fullpath.split('/')
  let file = paths.pop()
  path = paths.join('/')

  const arr = await core.getPage(fullpath)

  // page generateFunc
  let content = arr[0][0] // .replace(/(src=[\"\']?)\/+/,"$1");//对以/开始的路径做处理
  if (arr[1]) {
    arr[1] = arr[1]
      .replace(/\/\*#\s*sourceMappingURL=.*\*\/$/, '')
      .replace(/(position:\s*fixed\s*[^}]*[^w]top:)\s*0\s*;/g, '$142px;')
    if (
      has(tabBar, 'list') &&
      tabBar.list.findIndex(
        item => item.pagePath.replace(/^(\/|\.\/)/, '') === fullpath
      ) !== -1
    ) {
      if (tabBar.position !== 'top') {
        arr[1] = arr[1].replace(
          /(position:\s*fixed\s*[^}]*[^w]bottom:)\s*0\s*;/g,
          '$156px;'
        )
      }
    }
  } else {
    arr[1] = ''
  }
  content += '##code-separator##' + arr[1] // page css
  if (!arr[2]) arr[2] = ''
  content += '##code-separator##' + arr[2] // app-service
  content += '##code-separator##' + JSON.stringify(arr[0][1]) // tags
  return util
    .createFilePromise(
      distPath + '/src/' + path,
      file + '.js',
      content,
      program.transform
    )
    .catch(err => console.error(err))
}

/**
 * 构建 小程序
 *
 */
function build () {
  let execBuild = async function (err, out) {
    err && log(err)
    util.mkdirsSync(distPath)

    log('文件将生成到:\n' + distPath)

    const assetsPath = path.resolve(__dirname, '../lib/template/assets')

    await exec(
      cmdCp +
        JSON.stringify(assetsPath) +
        (isWin ? ' ' : '/* ') +
        distPath +
        cmdCpArg
    )

    await util.copy('./', distPath, {
      exclude: {
        basename: ['.git', 'node_modules'],
        extname: ['.js', '.json', '.wxss', '.css', '.git', '.md', '.wxml']
      }
    })

    const appConfig = await loadConfig({ babel: program.babel })

    await core.getIndex().then(content =>
      /*
           if(program.transform){
           content = content.replace('let __wxConfig__ = {"weweb":{','let __wxConfig__ = {"weweb":{ "requestProxy":"/remoteProxy",')
           }
           */
      util.createFilePromise(distPath, 'index.html', content, program.transform)
    )

    await core
      .getServiceJs()
      .then(content =>
        util.createFilePromise(
          distPath + '/script',
          'app-service.js',
          content,
          program.transform
        )
      )

    await core
      .getAppWxss('./app')
      .then(content =>
        util.createFilePromise(
          distPath + '/css',
          'app.css',
          content.replace(/\/\*#\s*sourceMappingURL=.*\*\/$/, ''),
          program.transform
        )
      )

    let tabBar = appConfig.tabBar
    let pages = appConfig.pages
    let count = 0

    await Promise.all(
      pages.map(path =>
        buildPage({
          path,
          tabBar
        })
      )
    )

    const buildCustomComps = async (comps, parentPath) => {
      for (let [compName, compPath] of Object.entries(comps)) {
        await buildPage({
          path: path.resolve(parentPath, compPath),
          tabBar
        })
        console.log(compName, compPath)
      }
    }
    if (appConfig.usingComponents) {
      await buildCustomComps(appConfig.usingComponents, '/')
    }
    for (const [pageName, pageConfig] of Object.entries(
      appConfig.window.pages
    )) {
      if (pageConfig.usingComponents) {
        await buildCustomComps(pageConfig.usingComponents, pageName)
      }
    }

    if (program.transform) {
      printRunTime()
      log('ok:' + distPath, true)

      if (tmpFolderName) {
        await exec(`${cmdRm}${tmpFolderName}`)
      }
      util.rmEmptyDirsSync(distPath)
      process.exit(0)
    } else {
      bootWebServer()
      util.rmEmptyDirsSync(distPath)
    }

    // printRunTime()
    // console.log('b',program.babel)
  }
  if (fs.existsSync(distPath)) {
    exec(cmdRm + JSON.stringify(distPath)).then(execBuild)
  } else {
    execBuild()
  }
}

process.on('uncaughtException', function (e) {
  log(chalk.red('发生了未知错误'))
  console.error(e.stack)
})

process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at:', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})
;(function main () {
  // 执行更新检查
  if (!program.nocheck) {
    notifier.check()
  }

  // 检查项目目录
  checkProject()
  // 开始构建
  build()
})()
