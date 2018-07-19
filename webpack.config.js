const webpack = require('webpack');
const glob = require("glob");
//设置路径
const path = require('path');
// html模板 
const htmlWebpackPlugin = require("html-webpack-plugin");
//抽离css样式
const extractTextPlugin = require('extract-text-webpack-plugin');
//消除冗余的css
const purifyCssWebpack = require("purifycss-webpack");
// 清除目录等
const cleanWebpackPlugin = require("clean-webpack-plugin");
//静态资源输出
const copyWebpackPlugin = require("copy-webpack-plugin");



//配置项其实也就五项，分别是：入口entry、出口output、Loader loader、插件plugins、模式mode
module.exports = {//配置正式开始
    entry:'./src/index.js',//设置入口,以package.json为标准
    output:{//设置打包入口
        path:path.resolve(__dirname,'dist'),//打包文件放在这个目录下
        filename:'main.js'//打包到目标文件名
    },
    module:{
        rules:[//js预编辑器，转换ES6代码
            {
                test:/\.js$/,
                use: ["babel-loader"],
                //不检查node_modules下的js文件
                exclude: "/node_modules/"
            },
            {
                test:/\.css$/,//正则表达式：根据后缀为 .css 的文件来匹配 css 文件
				use: extractTextPlugin.extract({
					fallback: "style-loader",
					use: ["css-loader", "postcss-loader"],
					// css中的基础路径
					publicPath: "../"
				})
            },
            {
                test:/\.less$/,
                use:extractTextPlugin.extract({
                    fallback:"style-loader",
                    use:["css-loader","less-loader"]
                })
            },
            {
                test: /\.(scss|sass)$/,
                use:extractTextPlugin.extract({
                    fallback:"style-loader",
                    use:["css-loader","sass-loader"]
                })
            },
            {
				test: /\.(png|jpg|gif)$/,
				use: [{
						// 需要下载file-loader和url-loader
						loader: "url-loader",
						options: {
							limit: 50,
							// 图片文件输出的文件夹
							outputPath: "images"
						}
					}
				]
			},
            {
                test: /\.html$/,
                // html中的img标签
                use: ["html-withimg-loader"]
            }
        ]
    },//loader相关配置
    devServer: {
		contentBase: path.resolve(__dirname, "dist"),
		host: "localhost",
		port: "8090",
		open: true, // 开启浏览器
		hot: true   // 开启热更新
	},
    plugins:[
        new webpack.HotModuleReplacementPlugin(),
        new cleanWebpackPlugin(["dist"]),
        new copyWebpackPlugin([{
			from: path.resolve(__dirname,"src/assets"),
			to: './pulic'
		}]),
        new htmlWebpackPlugin({
			filename: "index.html",
			title: "xxxx",
			// chunks: ['a',"jquery"],  // 按需引入对应名字的js文件
			template: "./src/index.html"
        }),
        new extractTextPlugin("css/index.css"),
        new purifyCssWebpack({
			// glob为扫描模块，使用其同步方法
			paths: glob.sync(path.join(__dirname, "src/*.html"))
		})
    ],//插件相关配置
    mode:'development'//设置模式为开发者模式
}