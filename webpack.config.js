const path = require('path');
const glob = require('glob');
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin');
const {CleanWebpackPlugin} =require('clean-webpack-plugin');

module.exports={
  mode:"development",
  entry:{
    index:'./src/index.js',
    other:'./src/other.js'
  },
  devtool:'cheap-module-eval-source-map',
  output:{
    filename:'js/[name].[hash:8].js',
    path:path.resolve(__dirname,'dist')
  },
  module:{
    rules:[
      {
        test:/\.js$/,
        use:{
          loader:'babel-loader',
          options:{
            presets:['@babel/preset-env']
          }
        }
      }
    ]
  },
  plugins:[
    new CleanWebpackPlugin(),
    new CopyPlugin([
      {from:"public",to:"public"}
    ])
  ]
}
//动态添加入口
function getEntry() {
  let entry = {};
  //读取src目录所有page入口
  glob.sync('./src/*.js').forEach(function(name){
    let start = name.indexOf('src/') + 4;
    let end = name.length - 3;
    let eArr = [];
    let n = name.slice(start,end);

    entry[n] = name;
  })
  return entry;
}
let getHtmlConfig = function(name,chunks){
  return {
    template:`./src/index.html`,
    filename:`pages/${name}.html`,
    inject:true,
    hash:false,
    chunks:[name]
  }
}

//配置页面
let entryObj = getEntry();
console.log(entryObj)
let htmlArray = [];
Object.keys(entryObj).forEach(function(element){
  htmlArray.push({
    _html:element,
    title:'',
    chunks:[element]
  })
})

//自动生成html模板
htmlArray.forEach(function(element){
  module.exports.plugins.push(new HtmlWebpackPlugin(getHtmlConfig(element._html,element.chunks)));
})
