import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { getStorageExpire } from "../utils/storage";
import ToLogin from "../views/to-login.vue";
import Login from "../views/wxlogin.vue";
import Entry from "../views/entry.vue";
import QrcodeView from "../views/qrcodeView.vue";
import Index from "../views/index.vue";

const routes = [
  {
    path: "",
    redirect: "qrcodeAuth",
    meta: {
      title: "测试",
    },
  },
  {
    path: "/qrcodeAuth",
    name: "qrcodeAuth",
    component: Entry,
    meta: {
      title: "玩家授权",
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "玩家授权",
    },
  },
  {
    path: "/toLogin",
    name: "toLogin",
    component: ToLogin,
    meta: {
      title: "登录",
    },
  },
  {
    path: "/qrcodeView",
    name: "qrcodeView",
    component: QrcodeView,
    meta: {
      title: "玩家授权",
    },
  },
  {
    path: "/index",
    name: "index",
    component: Index,
    meta: {
      title: "玩家信息",
    },
  },
];

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes,
});

router.afterEach((to, from) => {
  // to and from are both route objects.
  document.title = to.meta.title || "玩家充值";
  // console.log("路由后置守卫", to, from);
});

// 全局前置守卫

router.beforeEach((to, from, next) => {
  /*页面挂载获取tokenStarter，判断是否存在*/
  let username = localStorage.getItem("coiner_heardTokenStarter");
  const isEmpty = (value) => {
    return (
      value === undefined ||
      value === null ||
      (typeof value === "object" && Object.keys(value).length === 0) ||
      (typeof value === "string" && value.trim().length === 0)
    );
  };
  if (isEmpty(username) == false) {
    next();
  } else {
    if (
      to.name == "login" ||
      to.name == "qrcodeAuth" ||
      to.name == "qrcodeView"
    ) {
      next();
    } else {
      next(`qrcodeAuth`);
    }
  }
});

export default router;
