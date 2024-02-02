const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

let proxyTargets = {
  hmcc: 'http://hmcc.cdcerp.cn',
  un: 'http://un-hmcc.cdcerp.cn',
  yj: 'http://192.168.5.13:8083',
}
let proxyTarget = process.env.npm_config_url || proxyTargets.yj;
console.log('当前代理地址：', proxyTarget)
module.exports = {
  devServer: {
    open: true,
    port: process.env.npm_config_port || '8017',
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: proxyTarget,
        changOrigin: true,
        pathRewrite: {
          '/api': ''
        }
      },
      '/hengshi': {
        target: 'https://data-analysis.tracentsure.com',
        changOrigin: true,
        pathRewrite: {
          '/hengshi': ''
        }
      }
    }
  },
  transpileDependencies: ['@dtop'],
  pages: {
    index: {
      // page 的入口
      entry: 'src/main.js',
      // 模板来源
      template: 'public/index.html',
      // 在 dist/index.html 的输出
      filename: 'index.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '智慧医院管理系统'
    },
    mobile: {
      // page 的入口
      entry: 'src/mobile/main.js',
      // 模板来源
      template: 'public/mobile.html',
      // 在 dist/index.html 的输出
      filename: 'mobile.html',
      // 当使用 title 选项时，
      // template 中的 title 标签需要是 <title><%= htmlWebpackPlugin.options.title %></title>
      title: '智慧医院管理系统'
    }
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin([
        {
          from: path.resolve(__dirname, 'static'),
          to: 'static',
          ignore: ['.*']
        }
      ])
    ]
  }
};
