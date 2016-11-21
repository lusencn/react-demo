let ExtractTextPlugin = require('extract-text-webpack-plugin');
let HtmlWebpackPlugin = require('html-webpack-plugin');
let path = require('path');
let webpack = require('webpack');

let CommonsChunkPlugin = webpack.optimize.CommonsChunkPlugin;
let DefinePlugin = webpack.DefinePlugin;
let UglifyJsPlugin = webpack.optimize.UglifyJsPlugin;

// 配置
let debug = process.env.NODE_ENV != 'production';
let dirConfig = {
    srcDir: 'src',
    libDir: 'lib',
    releaseDir: 'dist'
}
let publicPath = debug ? `//127.0.0.1:8080/${dirConfig.releaseDir}/` : `//127.0.0.1:3000/todo/${dirConfig.releaseDir}/`;
let entriesPath = {
    todo: 'react/todo/index.js',
    mobxTodo: 'mobx/todo/index.js'
}

module.exports = {
    // 页面入口文件配置
    entry: Object.assign({
        // 将数组中的模块合并成一个文件
        lib: ['react', 'react-dom', 'reqwest']
    }, (() => {
        let result = {};
        for (let entry in entriesPath) {
            result[entry] = path.resolve(dirConfig.srcDir, entriesPath[entry]);
        }
        return result;
    })()),
    // 构建后输出路径相关配置
    output: {
        // 构建后文件输出目录
        path: dirConfig.releaseDir,
        // html页面引用JS/CSS文件的前缀路径
        publicPath: publicPath,
        // 构建后入口文件的相对路径
        filename: debug ? '[name].js' : '[name]/[chunkhash:8].js',
        // 构建后动态加载文件的相对路径
        chunkFilename: debug ? '[name].js' : '[name]/[chunkhash:8].js'
    },
    module: {
        loaders: [{
            // Babel：将es2015+和jsx语法解析为es5
            test: /\.js$/,
            loader: 'babel', //'babel?presets[]=react,presets[]=es2015'
            query: {
                presets: ['es2015', 'stage-0', 'react'],
                plugins: ['babel-plugin-transform-decorators-legacy']
            },
            exclude: [
                path.resolve(__dirname, 'node_modules'),
                path.resolve(dirConfig.libDir, '')
            ]
        }, {
            // 将JS代码中引用的CSS文件，合并提取成一个CSS文件
            test: /\.css$/,
            loader: ExtractTextPlugin.extract('style', 'css')//'style!css'
        }, {
            // 因CSS构建后的路径变化，将CSS中图片的路径修改为指定路径，并将图片复制到对应目录
            test: /\.(png|jpe?g|gif|eot|svg|ttf|woff2?)$/,
            loader: `file?name=images/[name]${debug ? '' : '.[hash:8]'}.[ext]`
        }]
    },
    resolve: {
        // JS引用模块的默认后缀
        extensions: ['', '.js', '.jsx']
    },
    plugins: (() => {
        let arr = [
            // 将chunks中对应的entry所引用的公共文件提取出来，chunk名为common
            new CommonsChunkPlugin({
                name: 'common',
                chunks: Object.keys(entriesPath)
            }),
            new CommonsChunkPlugin({
                name: 'lib',
                filename: 'lib.js',
                chunks: ['lib', 'common']
            }),
            // 将JS代码中引用的CSS文件，合并提取成一个CSS文件
            new ExtractTextPlugin(
                debug ? '[name].css' : '[name]/[contenthash:8].css',
                {allChunks: true}
            )
        ];

        !debug && arr.push(
            // 设置webpack环境变量
            new DefinePlugin({
                'process.env': {
                    'NODE_ENV': '"production"'
                }
            }),
            // JS文件压缩（去空格注释，变量替换）
            new UglifyJsPlugin({
                compress: {
                    warnings: false
                }
            })
        );

        // 将构建生成的JS文件添加到指定html文件中
        Object.keys(entriesPath).forEach(chunk => {
            arr.push(new HtmlWebpackPlugin({
                template: path.resolve(dirConfig.srcDir, 'index.html'),
                filename: path.resolve(dirConfig.releaseDir, `${chunk}.html`),
                inject: true,
                chunks: ['lib', 'common', chunk]
            }));
        });

        return arr;
    })()
}
