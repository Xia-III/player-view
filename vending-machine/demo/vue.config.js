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
        '/vending': {
          target: 'https://www.huanxizn.com',
          ws: true,
          changeOrigin: true
        }
      }
    },

  }
}
)

//测试
// (function() {
//   // 1. 机器信息
//   localStorage.setItem('shop_starterMachineId', 'FA7F20000910'); // 机器ID（带前缀，接口会 substring(4) 取纯机器号 20000910）
//   localStorage.setItem('shop_sExtId', '0');                      // 分机号
//   localStorage.setItem('shop_sFee', '0');                        // 费用（分）

//   // 2. 登录 Token（需要替换为你实际可用的 token）
//   const REAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI5Mjc1MjAiLCJyb2xlIjoicGxheWVyIiwibmlja25hbWUiOiLmmociLCJhY3RvcnQiOiIyMDAwMzY4NiIsImp0aSI6IjkwNjlmNmM3LTBmYzItNDM5ZS1iZTViLTE4ZGM0YTAzYTk5MyIsIm5iZiI6MTc4NzkxMTg3MCwiZXhwIjoxNzg3OTk4MjcwLCJpYXQiOjE3ODc5MTE4NzB9.jd-RUo-WdlN4iN6tJ9jUjcHEhR3syGMoAZSEUOcgz04'; // 替换成你真实的

//   // 带过期时间的 token（路由守卫 getStorageExpire('shop_tokenStarter') 读取）
//   localStorage.setItem('shop_tokenStarter', JSON.stringify({
//     data: REAL_TOKEN,
//     time: Date.now(),
//     expire: 86400000  // 24小时（毫秒）
//   }));

//   // 请求头 token（request.js 读取，作为 Authorization: Bearer）
//   localStorage.setItem('shop_heardTokenStarter', REAL_TOKEN);

//   console.log('✅ 测试参数已设置，可以访问 /#/home/index 了');
// })();