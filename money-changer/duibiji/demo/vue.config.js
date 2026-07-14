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
//   localStorage.setItem('shop_starterMachineId', 'CE5B20002798');
//   localStorage.setItem('shop_sExtId', '0');

//   // 2. 登录 Token（注意：需要替换为你实际可用的 token）
//   const REAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI5Mjc1MjAiLCJyb2xlIjoicGxheWVyIiwibmlja25hbWUiOiLmmociLCJhY3RvcnQiOiIyMDAwMjc5OCIsImp0aSI6ImJmZGJlYmRlLTM1NzktNDM1My04NGRjLWE1ODQ3ZTcyN2YzMiIsIm5iZiI6MTc4MzkyNzk4OSwiZXhwIjoxNzg0MDE0Mzg5LCJpYXQiOjE3ODM5Mjc5ODl9.Z58gdBr7l8R2ZEAF7tKrps8pSxROAKRt5eK4dt0zeDo';
  
//   // coiner_tokenStarter — 带过期时间（路由守卫用 getStorageExpire 校验）
//   localStorage.setItem('coiner_tokenStarter', JSON.stringify({
//     data: REAL_TOKEN,
//     time: Date.now(),
//     expire: 86400000  // 24小时（毫秒）
//   }));
  
//   // coiner_heardTokenStarter — 原始 token（axios 拦截器拼到 Authorization 头）
//   localStorage.setItem('coiner_heardTokenStarter', REAL_TOKEN);

//   // 3. 正常模式（非离线/禁用）
//   sessionStorage.setItem('shopMode', '0');

//   console.log('✅ 兑币机测试参数已设置，可访问 /#/home/index');
// })();