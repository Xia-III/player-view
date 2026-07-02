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
// 访问端口，在控制台输入测试参数
// (function() {
//   // 1. 机器信息（模拟扫码获取的机器 ID 和分机号）
//   localStorage.setItem('shop_starterMachineId', 'FA7F20002165');
//   localStorage.setItem('shop_sExtId', '0');

//   // 2. Token（替换成真实可用的 token）
//   const REAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI5Mjc1MjAiLCJyb2xlIjoicGxheWVyIiwibmlja25hbWUiOiLmmociLCJhY3RvcnQiOiIyMDAwMjE1MCIsImp0aSI6ImViMmQxYWQ5LTVlN2QtNGVkNS1hMDVkLWM4NGVkNDQwNGVlOCIsIm5iZiI6MTc4MDI5NDA3MCwiZXhwIjoxNzgwMzgwNDcwLCJpYXQiOjE3ODAyOTQwNzB9.8Exg5XvFJ1G04D9XJIn9IY1man2gs0nkXOjRfN00a9s';

//   // axios 拦截器读的是这个 key
//   localStorage.setItem('shop_heardTokenStarter', REAL_TOKEN);

//   // 路由守卫检测的是这个 key（带过期时间格式）
//   localStorage.setItem('kis_tokenStarter', JSON.stringify({
//     data: REAL_TOKEN,
//     time: Date.now(),
//     expire: 86400000  // 24 小时有效期
//   }));

//   // 3. 可选：商城模式标记（0=普通投币模式，1=商城模式）
//   sessionStorage.setItem('shopMode', '0');

//   // 4. 可选：隐藏 Loading 弹窗（如果 token 无效，API 报错时会有黑底 loading 遮不住）
//   console.log('✅ 设置完成，导航到 /#/home/index 即可');
// })();