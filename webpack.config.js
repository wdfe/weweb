const webpack = require('webpack')
const path = require('path')
const fs = require('fs')
const CopyWebpackPlugin = require('copy-webpack-plugin');


const COMMON_BUNDLE_PATH = './tmp/bundle'
// const VIEW_BUNDLE_PATH = COMMON_BUNDLE_PATH
const VIEW_BUNDLE_PATH = `${COMMON_BUNDLE_PATH}/view`
// const SERVICE_BUNDLE_PATH = COMMON_BUNDLE_PATH
const SERVICE_BUNDLE_PATH = `${COMMON_BUNDLE_PATH}/service`


const getPath = function (rPath) {
    return path.resolve(__dirname, rPath)
}

const getSourcePath = function (rPath) {
    return getPath(`./src/${rPath}`)
}

const commonConfig = {
    // TODO: Add common Configuration
    module: {
        loaders: [{
            test: /\.js$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                "presets": ["es2015","stage-0"]
            }
        },
            { test: /\.html/, loader: 'html-loader' },
            { test: /\.et/, loader: 'ei-loader' },
            { test: /\.json$/, loader: 'json' }
        ]
    },
    plugins: [
        // new webpack.optimize.UglifyJsPlugin({
        //   compress: {
        //     warnings: false
        //   },
        //   output: {
        //     comments: false
        //   }
        // })
    ]
};

const varTypeModuleConfigView = Object.assign({}, commonConfig, {
    entry: {
        // "jsbridge": getPath('./lib/jsbridge.js')
        // "Reporter": getSourcePath('./lib/view-reporter.js'),
        // "wx": getSourcePath('view/api/'),
        // "exparser": getSourcePath('view/exparser/'),
        // "exparser-ext": getPath('./lib/exparser-ext.js'),
        // "virtual-dom": getPath('./lib/virtual-dom.js')
        "view": getSourcePath('view.js')
    },
    output: {
        filename: '[name].js',
        path: getPath(VIEW_BUNDLE_PATH),
        // libraryTarget: 'var',
        // library: '[name]'
    },
});

const varTypeModuleConfigService = Object.assign({}, commonConfig, {
    entry: {
        // "Reporter": getSourcePath('common/Reporter'),
        // "wd": getSourcePath('service/api'),
        // "__appServiceEngine__": getSourcePath('service/engine')
        "service": getSourcePath('service.js')
    },
    output: {
        filename: '[name].js',
        path: getPath(SERVICE_BUNDLE_PATH),
        // libraryTarget: 'var',
        // library: '[name]'
    },
});

// not using libraryTarget
const normalModuleConfig = Object.assign({}, commonConfig, {
    entry: {
        "virtual-dom": getSourcePath('view/virtual-dom/'),
        "exparser-component": getSourcePath('view/exparser-component.js')
    },
    output: {
        filename: '[name].js',
        path: getPath(VIEW_BUNDLE_PATH),
    },
});

const umdModuleConfig = Object.assign({}, commonConfig, {
    entry: {
        "view-bridge": getSourcePath('view/bridge/'),
        "bridge": getSourcePath('service/bridge/'),
    },
    output: {
        filename: '[name].js',
        path: getPath(COMMON_BUNDLE_PATH),
        libraryTarget: 'umd'
    },
});


const copyConfig = {
    // devServer: {
    //     // This is required for older versions of webpack-dev-server
    //     // if you use absolute 'to' paths. The path should be an
    //     // absolute path to your build destination.
    //     outputPath: path.join(__dirname, 'build')
    // },
    output: {
        filename: '[file]',
    },
    plugins: [
        new CopyWebpackPlugin([
            // {output}/to/directory/file.txt
            // {
            //   from: getPath('./lib/jsbridge.js'),
            //   to: getPath('./src/public/script/bundles/view')
            // },
/*
            {
                from: getSourcePath('./view/exparser-component.js'),
                to: getPath(VIEW_BUNDLE_PATH)
            },
*/
            {
                from: getSourcePath('./view/common.js'),
                to: getPath(VIEW_BUNDLE_PATH)
            },
            {
                from: getSourcePath('./service/amdEngine.js'),
                to: getPath(SERVICE_BUNDLE_PATH)
            },

        ], {
            // By default, we only copy modified files during
            // a watch or webpack-dev-server build. Setting this
            // to `true` copies all files.
            copyUnmodified: true
        })
    ]
}
const viewBuild = Object.assign({}, commonConfig, {
    entry: './src/system/index.js',
    output: {
        filename: 'system.js',
        path: './tmp/public/script'
    }
});


// Return Array of Configurations
module.exports = [
    varTypeModuleConfigView,
    varTypeModuleConfigService,
    // normalModuleConfig,
    // umdModuleConfig,
    // copyConfig,
    // viewBuild
];