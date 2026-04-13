import {
  createRouter,
  createWebHistory,
  createWebHashHistory,
} from "vue-router";
import { getStorageExpire } from "../utils/storage";
import Home from "../views/home.vue";
import Account from "../views/account.vue";
import Index from "../views/index.vue";
import AddressShop from "../views/address-shop.vue";
import RechargeRecord from "../views/recharge-record.vue";
import Recharge from "../views/recharge.vue";
import ToLogin from "../views/to-login.vue";
import Login from "../views/wxlogin.vue";
import Entry from "../views/entry.vue";
import Hint from "../views/hint.vue";
import TestCoin from "../views/test-coin.vue";
import CoinSuccess from "../views/coinSuccess.vue";
import Users from "../views/users.vue";
import HomeView from "../views/HomeView.vue";
import MessageBoard from "../views/messageBoard.vue";
import QrcodeAuth from "../views/qrcodeAuth.vue";
import QrcodeAuthlogin from "../views/qrcodeAuthlogin.vue";
import QrcodeView from "../views/qrcodeView.vue";

const routes = [
  // {
  //   path: '',
  //   redirect: 'paycoins',
  //   meta: {
  //     title: '测试'
  //   }
  // },
  {
    path: "/paycoins",
    name: "paycoins",
    component: Entry,
    meta: {
      title: "玩家登录",
    },
  },
  {
    path: "/qrcodeAuth",
    name: "qrcodeAuth",
    component: QrcodeAuth,
    meta: {
      title: "玩家授权",
    },
  },
  {
    path: "/qrcodeAuthlogin",
    name: "qrcodeAuthlogin",
    component: QrcodeAuthlogin,
    meta: {
      title: "玩家授权",
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

  // {
  //   path: '/entry',
  //   name: 'entry',
  //   component: Entry,
  //   meta: {
  //     title: "测试扫码三合一页面"
  //   }
  // },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "玩家登录",
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
    path: "/home",
    name: "home",
    // redirect: '/home/index',
    component: Home,
    children: [
      {
        path: "index",
        name: "index",
        component: Index,
        meta: {
          title: "首页",
        },
      },
      {
        path: "account",
        name: "account",
        component: Account,
        meta: {
          title: "账户",
        },
      },
      {
        path: "recharge",
        name: "recharge",
        component: Recharge,
        meta: {
          title: "充值",
        },
      },
    ],
  },
  {
    path: "/addressShop/:addressId/:coinFee",
    name: "addressShop",
    component: AddressShop,
    meta: {
      title: "币详情",
    },
  },
  {
    path: "/rechargeRecord/:coinFee",
    name: "rechargeRecord",
    component: RechargeRecord,
    meta: {
      title: "充值记录",
    },
  },
  {
    path: "/hint",
    name: "hint",
    component: Hint,
    meta: {
      title: "欢迎光临",
    },
  },
  {
    path: "/testCoin",
    name: "testCoin",
    component: TestCoin,
    meta: {
      title: "投币测试",
    },
  },
  {
    path: "/users",
    name: "users",
    component: Users,
    meta: {
      title: "用户会员管理",
    },
  },
  {
    path: "/coinSuccess",
    name: "coinSuccess",
    component: CoinSuccess,
    meta: {
      title: "支付成功",
    },
  },
  {
    path: "/homeView",
    name: "homeView",
    component: HomeView,
    meta: {
      title: "向商家付款",
    },
  },
  {
    path: "/messageBoard",
    name: "messageBoard",
    component: MessageBoard,
    meta: {
      title: "意见反馈",
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
  let username = getStorageExpire("coiner_tokenStarter");
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
      to.name == "paycoins" ||
      to.name == "qrcodeAuth" ||
      to.name == "qrcodeAuthlogin" ||
      to.path.includes("qrcodeAuth") ||
      to.path.includes("qrcodeAuthlogin")
    ) {
      next();
    } else {
      console.log("Router blocking:", to.path, to.name);
      next(`paycoins`);
    }
  }
});

// router.beforeEach((to, from, next) => {
/*页面挂载获取tokenStarter，判断是否存在*/
// let username = getStorageExpire('coiner_tokenStarter');
// if (to.name == "paycoins") {
//   next();
// } else {
// if (username == null) {
// let sExtId = localStorage.getItem('shop_sExtId');
// sExtId = Number(sExtId);
// let extId = sExtId - 1;
// let starterMachineId = localStorage.getItem('shop_starterMachineId');
//   if (to.name == 'login') {
//     next();
//   } else {
//     next('login');
//   }

// } else {
//   next();
// }
// }
// })

export default router;
