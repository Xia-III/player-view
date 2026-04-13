const { defineConfig } = require('@vue/cli-service')
const path = require('path')
module.exports = defineConfig({
  outputDir: 'dist',
  filenameHashing: true,
  assetsDir: 'static',
  parallel: true,
  publicPath: './',
  transpileDependencies: true,
  lintOnSave: false,
  configureWebpack: {
    devServer: {
      proxy: {
        '/api': {             // /api 表示拦截以 /api开头的请求路径
          target: 'http://www.huanxizn.com',    // 跨域的域名（不需要写路径）
          ws: true,        // 是否代理websocked
          changeOrigin: true, //是否开启跨域
          pathRewrite: {      //路径重写
            '^/api': '/api'       //把/api变为空字符
          }
        },
        // '/paybox': {
        //   target: 'http://www.huanxizn.com/paybox',  //接口  设置要调用的接口域名和端口号 别忘了加http
        //   ws: true,        // 是否代理websocked
        //   changeOrigin: true, //是否开启跨域
        //   pathRewrite: {      //路径重写
        //     '^/api': '/api'       //把/api变为空字符
        //   }
        // },
      }
    },

  }
}
)