const gulp = require('gulp')
const webpack = require('webpack-stream')
const babel = require('gulp-babel')
const sourcemaps = require('gulp-sourcemaps')
const gutil = require('gulp-util')
const concat = require('gulp-concat')
const clean = require('gulp-clean')
const uglify = require('gulp-uglify')

gulp.task('build', function (callback) {
  const distPath = './tmp/bundle'
  const pubPath = './tmp/public/script/'

  gulp.src(distPath + '/!*').pipe(clean())

  const webpack = require('webpack')
  // 载入webpack.config.js文件
  const libConfig = require('./webpack.config.js')
  webpack(libConfig, function (err, stats) {
    console.log('start concat...')
    if (err) {
      throw new gutil.PluginError('webpack', err)
    }
    gutil.log(
      '[webpack]',
      stats.toString({
        chunks: false, // Makes the build much quieter
        colors: true
      })
    )
    const views = [
      './tmp/bundle/view-bridge.js',
      './tmp/bundle/view/wx.js',
      './tmp/bundle/view/exparser.js',
      './tmp/bundle/view/exparser-component.js',
//        './tmp/bundle/view/behaviors.js',
//        './tmp/bundle/view/components.js',
      './tmp/bundle/view/virtual-dom.js',
      './tmp/bundle/view/common.js'
    ]
    const services = [
      './tmp/bundle/bridge.js',
      './tmp/bundle/service/Reporter.js',
      './tmp/bundle/service/wd.js',
      './tmp/bundle/service/__appServiceEngine__.js',
      './tmp/bundle/service/amdEngine.js'
    ]
    /*
    gulp.src('./tmp/public/script/system.js').pipe(uglify()).pipe(gulp.dest(pubPath))
    gulp.src(services).pipe(concat('service.js')).pipe(uglify()).pipe(gulp.dest(pubPath))
    gulp.src(views).pipe(concat('view.js')).pipe(uglify()).pipe(gulp.dest(pubPath))
     */
    //  gulp.src('./tmp/public/script/system.js').pipe(gulp.dest(pubPath))
    //  gulp.src(services).pipe(concat('service.js')).pipe(gulp.dest(pubPath))
     gulp.src('./tmp/bundle/service/service.js').pipe(gulp.dest(pubPath))
    //  gulp.src(views).pipe(concat('view.js')).pipe(gulp.dest(pubPath))
     gulp.src('./tmp/bundle/view/view.js').pipe(gulp.dest(pubPath))


    console.log('end concat...')
  })
})
gulp.task('concat', function (callback) {
  const distPath = './tmp/bundle'
  const pubPath = './tmp/public/script/'

  gulp.src(distPath + '/!*').pipe(clean())
  const views = [
    './tmp/bundle/view-bridge.js',
    './tmp/bundle/view/wx.js',
    './tmp/bundle/view/exparser.js',
    './tmp/bundle/view/exparser-component.js',
//      './tmp/bundle/view/behaviors.js',
//      './tmp/bundle/view/components.js',
    // './tmp/bundle/old/view-exparser-ext.js',
    './tmp/bundle/view/virtual-dom.js',
    './tmp/bundle/view/common.js'
  ]
  const services = [
    './tmp/bundle/bridge.js',
    './tmp/bundle/service/Reporter.js',
    './tmp/bundle/service/wd.js',
    './tmp/bundle/service/__appServiceEngine__.js',
    './tmp/bundle/service/amdEngine.js'
  ]

  gulp.src('./tmp/public/script/system.js').pipe(gulp.dest(pubPath))
  gulp.src(services).pipe(concat('service.js')).pipe(gulp.dest(pubPath))
  gulp.src(views).pipe(concat('view.js')).pipe(gulp.dest(pubPath))

  console.log('end concat...')

})
gulp.task('default', ['build'])
