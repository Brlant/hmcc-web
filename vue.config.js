const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

function resolve(dir) {
  return path.join(__dirname, '..', dir);
}

module.exports = {
  devServer: {
    open: true,
    port: '8006',
    https: false,
    hotOnly: false,
    disableHostCheck: true,
    proxy: {
      '/api': {
        target: 'http://192.168.2.152:8083',
        changOrigin: true
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
      title: '冷链监控管理系统'
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
      title: '冷链监控管理系统'
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
