// 网络请求的 ——  二次封装
import axios from "axios";
import { showToast } from "vant";
import { useRouter } from "vue-router";
import { delCookie } from "./cookie.js";
const router = useRouter();

axios.defaults.baseURL = "https://www.huanxizn.com";
axios.defaults.timeout = 8000;
axios.defaults.headers = {
  Accept: "application/json;charset=UTF-8",
  companyCode: "HXLL",
};
axios.defaults.withCredentials = true; //允许跨域时session id一致

// 拦截器
// axios请求拦截器：
axios.interceptors.request.use(
  (config) => {
    if (localStorage.sweets_heardTokenStarter) {
      //判断token是否存在
      config.headers["Authorization"] =
        "Bearer " + localStorage.getItem("sweets_heardTokenStarter"); //将token设置成请求头
    }
    return config;
  },
  (e) => Promise.reject(e)
);

//axios响应拦截器：
axios.interceptors.response.use(
  (response) => {
    if (response.data.errCode == 2) {
      router.push({
        path: "/login",
        querry: { redirect: router.currentRoute.fullPath }, //从哪个页面跳转
      });
    }
    return response;
  },
  (error) => {
    if (error && error.response) {
      switch (
        error.response.status //处理状态码
      ) {
        case 400:
          showToast("错误请求");
          break;
        case 401:
          showToast("未授权，请重新登录");
          // sessionStorage.clear();
          localStorage.removeItem("sweets_heardTokenStarter");
          // delCookie('username');
          router.push({
            path: "/login",
          });
          break;
        case 403:
          showToast("拒绝访问");
          break;
        case 404:
          showToast("请求错误，未找到该资源");
          break;
        case 405:
          showToast("请求方法未允许");
          break;
        case 408:
          showToast("请求超时，请检查您的网络，然后刷新试试！");
          break;
        case 500:
          showToast("服务器端重启中");
          break;
        case 501:
          showToast("网络未实现");
          break;
        case 502:
          showToast("网络错误");
          break;
        case 505:
          showToast("http版本不支持该请求");
          break;
        default:
          showToast("链接错误");
      }
    } else if (error.request) {
      // 请求已发送但无相应（网络问题）
      showToast("网络错误，请检查连接");
    } else {
      // 请求配置错误（如url格式错误）
      showToast("请求配置错误：", error.message);
    }
    return Promise.reject(error);
  }
);
export default axios;
