const path = require('path')
const name = 'Iot Admin'

function resolve(dir) {
  return path.join(__dirname, dir)
}
module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? '/' : '/', // TODO: Remember to change this to fit your need
  lintOnSave: process.env.NODE_ENV === 'development',
  pwa: {
    name: name
  },
  pluginOptions: {
    'style-resources-loader': {
      preProcessor: 'scss',
      patterns: [
        path.resolve(__dirname, 'src/styles/_variables.scss'),
        path.resolve(__dirname, 'src/styles/_mixins.scss')
      ]
    }
  },
  chainWebpack(config) {
    // Provide the app's title in webpack's name field, so that
    // it can be accessed in index.html to inject the correct title.
    config.resolve.alias
      .set('@', resolve('src')) // key,value自行定义，比如.set('@@', resolve('src/components'))
    config.set('name', name)
  },
  devServer: {
    proxy: {
      '/': {
        target: 'http://172.172.1.15:8080/', // 代理接口
        changeOrigin: true
      },
      '/api/v1/': {
        target: 'http://iiiii.imdo.co/', // 代理接口
        changeOrigin: true
      }
    }
  }
}
