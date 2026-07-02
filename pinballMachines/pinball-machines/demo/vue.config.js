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

// (function() {
//   // 1. 机器信息
//   localStorage.setItem('shop_starterMachineId', '718F20088834');
//   localStorage.setItem('shop_sExtId', '0');

//   // 2. 登录 Token
//   const REAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI5Mjc1MjAiLCJyb2xlIjoicGxheWVyIiwibmlja25hbWUiOiLmmociLCJhY3RvcnQiOiIyMDA4ODgzNCIsImp0aSI6ImVmMGZkMmYzLTY5NjQtNDU5Ni1iYzdjLThiMDRmNmI2ZDQ5MyIsIm5iZiI6MTc4Mjk3MDAzNiwiZXhwIjoxNzgzMDU2NDM2LCJpYXQiOjE3ODI5NzAwMzZ9.Cb1zDfQEA8K0dp1f4xJNIHpAhoF1pZ8afVK9Ftvx4ro'; // 你的 token

//   // API 鉴权（Request 拦截器用）
//   localStorage.setItem('shop_heardTokenStarter', REAL_TOKEN);

//   // 路由守卫判断登录用（带过期包装，24小时）
//   localStorage.setItem('shop_tokenStarter', JSON.stringify({
//     data: REAL_TOKEN,
//     time: Date.now(),
//     expire: 86400000
//   }));

//   console.log('✅ 测试参数已设置，可以访问 /#/home/index 了');
// })();