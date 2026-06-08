const { defineConfig } = require('@vue/cli-service')
const path = require('path')
const CopyWebpackPlugin = require('copy-webpack-plugin')

module.exports = defineConfig({
  outputDir: 'dist',
  filenameHashing: true,
  assetsDir: 'static',
  parallel: true,
  publicPath: './',
  transpileDependencies: true,
  lintOnSave: false,
  devServer: {
    proxy: {
      '/washing': {
        target: 'https://www.huanxizn.com',
        ws: true,
        changeOrigin: true
      }
    }
  },
  configureWebpack: {
    plugins: [
      new CopyWebpackPlugin({
        patterns: [
          { from: 'src/static', to: 'static' }
        ]
      })
    ]
  }
})

// 访问端口，在控制台输入测试参数
// (function() {
//   // 1. 机器信息，
//   localStorage.setItem('shop_starterMachineId', 'FA7F20002165');
//   localStorage.setItem('shop_sExtId', '0');
  
//   // 2. 登录 Token（注意：需要替换为你实际可用的 token）
//   const REAL_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJuYW1laWQiOiI5Mjc1MjAiLCJyb2xlIjoicGxheWVyIiwibmlja25hbWUiOiLmmociLCJhY3RvcnQiOiIyMDAwMjE1MCIsImp0aSI6ImViMmQxYWQ5LTVlN2QtNGVkNS1hMDVkLWM4NGVkNDQwNGVlOCIsIm5iZiI6MTc4MDI5NDA3MCwiZXhwIjoxNzgwMzgwNDcwLCJpYXQiOjE3ODAyOTQwNzB9.8Exg5XvFJ1G04D9XJIn9IY1man2gs0nkXOjRfN00a9s'; // 替换成你真实的
  
//   localStorage.setItem('washing_tokenStarter', JSON.stringify({
//     data: REAL_TOKEN,
//     time: Date.now(),
//     expire: 86400000  // 24小时
//   }));
//   localStorage.setItem('washing_heardTokenStarter', REAL_TOKEN);
  
//   // 3. 机构主题（可选）
//   sessionStorage.setItem('agencyId', '444');
  
//   console.log('✅ 测试参数已设置，可以访问 /#/home/index 了');
// })();

// 复现白屏 bug：washing_tokenStarter 数据损坏（非合法 JSON），导致 router.beforeEach 中 JSON.parse 崩溃
// 使用方式：在控制台执行后，访问 /#/home/index 即可复现白屏
// (function() {
//   // 1. 机器信息
//   localStorage.setItem('shop_starterMachineId', 'FA7F20002165');
//   localStorage.setItem('shop_sExtId', '0');
  
//   // 2. 模拟 washing_tokenStarter 数据损坏（普通字符串，不是 JSON）
//   //    这会导致 getStorageExpire() 内 JSON.parse(val) 抛出 SyntaxError
//   localStorage.setItem('washing_tokenStarter', 'i am not json, corrupted data');
  
//   // 3. washing_heardTokenStarter 是 axios 拦截器直接读取的值（不需要 JSON.parse），正常设置
//   localStorage.setItem('washing_heardTokenStarter', 'corrupted-token-placeholder');
  
//   // 4. 机构主题（可选）
//   sessionStorage.setItem('agencyId', '444');
  
//   console.log('✅ 白屏复现参数已设置，请访问 /#/home/index 观察白屏效果');
//   console.log('⚠️  修复后，此场景应正常跳转到 /paycoins 扫码页，而非白屏');
// })();

