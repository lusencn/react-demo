let path = require('path');


/**
 * NODE_ENV环境变量
 */
const env = (process.env.NODE_ENV || 'development').toString().trim();

/**
 * 工程目录
 */
const prjDir = path.resolve(__dirname, '../../');



/**
 * 是否是调试环境
 */
const debug = (env == 'development');

/**
 * 页面入口
 */
const entriesPath = {
    mobx_demo: 'mobx_demo/index.js',
    react_demo: 'react_demo/index.js',
    redux_demo: 'redux_demo/index.js'
}

/**
 * 第三方JS模块
 */
const libNames = [
    'react', 'react-dom', 'reqwest'
];

/**
 * JS/CSS构建后发布目录（相对路径）
 */
const releaseFolder = 'dist';

/**
 * JS/CSS构建后发布目录（绝对路径）
 */
const releaseDir = path.resolve(prjDir, releaseFolder);

/**
 * 静态资源域名
 */
const resDomain = {
    'development': '127.0.0.1:8080',
    'production': '127.0.0.1:8080'
}

/**
 * html页面引用JS/CSS文件的前缀路径
 */
const resPrePath = `//${resDomain[env]}/${releaseFolder}/`;

/**
 * JS/CSS源文件目录
 */
const srcDir = path.resolve(prjDir, 'src');


module.exports = {
    debug, entriesPath, libNames, prjDir,
    releaseDir, resDomain, resPrePath, srcDir
}
