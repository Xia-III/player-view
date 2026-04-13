<template>
  <div class="wxlogin">
    <div class="info-list" v-if="showInfo">
      <van-icon name="info" />
      <p>请用支付宝或微信打开本页面</p>
    </div>
    <div class="weixin-con" v-if="weixinShow">
      <div class="bg-top">
        <img class="img-logo" src="../static/img/login.jpg" />
        本商城需要获取用户头像与昵称关联订单信息，用于支付。
      </div>
      <van-button
        class="info-btn"
        :disabled="disType"
        type="primary"
        @click="wxGetCode"
        >确认登录</van-button
      >
    </div>
  </div>
  <van-popup
    class="van-popup-load"
    :overlay="false"
    style="--van-popup-background: rgba(0, 0, 0, 0)"
    v-model:show="showLoading"
  >
    <van-loading type="spinner" />
  </van-popup>
</template>
<script setup>
import { v3AuthPlayerAuthAPI } from "../api/index";
import { ref, reactive, watch, onMounted, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import { setStorageExpire, getStorageExpire } from "../utils/storage";
import { showDialog, showToast } from "vant";
import ap from "../utils/alipayjsapi.min.js";
// 新的：
// const getUrlParam = (name) => {
//     const reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
//     const hash = window.location.hash;
//     // console.log(hash);
//     const match = hash.substr(hash.indexOf('?') + 1).match(reg);
//     if (match) {
//         return decodeURIComponent(match[2]);
//     }
//     return null;
// }

// 旧的：
const getUrlParam = (name) => {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
  let r = window.location.search.substr(1).match(reg);
  if (r != null) {
    return unescape(r[2]);
  }
  return null;
};

const router = useRouter();
const route = useRoute();
const showLoading = ref(false);
const APPID = "wx7f23f819116cc247";
const showInfo = ref(false);
const weixinShow = ref(false);
const disType = ref(false);
const starterMachineId = ref(""); //机器ID
const extId = ref(0); //分机号
// const code = ref('')

// 现在：
starterMachineId.value = localStorage
  .getItem("shop_starterMachineId")
  .substring(4);
extId.value = localStorage.getItem("shop_sExtId");
const isButtonDisabled = ref(false);

const getOpenId = async (code) => {
  if (isButtonDisabled.value) return;
  isButtonDisabled.value = true;
  if (
    starterMachineId.value == null ||
    starterMachineId.value == undefined ||
    starterMachineId.value == "null"
  ) {
    starterMachineId.value = "";
    isButtonDisabled.value = false;
  }
  if (!extId.value) {
    extId.value = 0;
  }
  showLoading.value = true;
  await v3AuthPlayerAuthAPI({
    code: code,
    machineId: starterMachineId.value,
  })
    .then((res) => {
      showLoading.value = false;
      console.log(res.data);
      if (res.data.code == 200) {
        isButtonDisabled.value = false;
        console.log(res.data, "12121");
        localStorage.setItem("clamp_heardTokenStarter", res.data.data);
        // 设置登录的过期时间24小时即1440分钟 单位分钟
        setStorageExpire("clamp_tokenStarter", res.data.data, 1440);
        const host = window.location.host;
        window.location.href = "https://" + host + "/newclamp/#/toLogin";
      }
      //  else if (res.data.code == 998) {
      //     showDialog({
      //         title: '错误提示',
      //         message: '请检查您的网络，再点击我知道了登录',
      //         confirmButtonText: '我知道了'
      //     }).then(() => {
      //         // history.back();
      //     });
      // }
      // else {
      //     showToast("请检查您的网络");
      // }
      isButtonDisabled.value = false;
    })
    .catch((error) => {
      showLoading.value = false;
      isButtonDisabled.value = false;
    });
};

// 支付宝打开调用
const apGetCode = () => {
  // alert('789')
  ap.getAuthCode(
    {
      appId: "2021004118610049",
      scopes: ["auth_user"],
    },
    (res) => {
      // ap.alert(res.error)
      if (res.error == 11) {
        showToast(res.errorMessage);
      } else {
        // ap.alert('123')
        getOpenId(res.authCode);
      }
    }
  );
};

// 微信打开时调用：
const wxGetCode = async () => {
  let code = getUrlParam("code");
  // console.log(code);
  // let code = '071Ljh1w3NSEk13L3h0w3Ysgo13Ljh1a'; // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId
  const local = window.location.href; //获取当前页面的url
  disType.value = true;
  if (code == null || code === "") {
    window.location.href =
      "https://open.weixin.qq.com/connect/oauth2/authorize?appid=" +
      APPID +
      "&redirect_uri=" +
      encodeURIComponent(local) +
      "&response_type=code&scope=snsapi_userinfo&state=1#wechat_redirect";
  } else {
    await getOpenId(code); //把code传给后台获取用户信息
    code = "";
    // sessionStorage.setItem('code', code);
    // window.location.href = "http://localhost:8080/#/home";
  }
};

onMounted(() => {
  var ua = window.navigator.userAgent.toLowerCase();
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    if (getStorageExpire("clamp_tokenStarter")) {
      wxGetCode();
    }
  }

  // 判断是用微信还是支付宝打开的
  if (ua.match(/MicroMessenger/i) == "micromessenger") {
    //微信内置浏览器
    // wxGetCode();
    showInfo.value = false;
    weixinShow.value = true;
    let code = getUrlParam("code");
    // let code = '071Ljh1w3NSEk13L3h0w3Ysgo13Ljh1a'; // 截取路径中的code，如果没有就去微信授权，如果已经获取到了就直接传code给后台获取openId 测试
    // const local = window.location.href; //获取当前页面的url
    if (code) {
      getOpenId(code); //把code传给后台获取用户信息
    }
  } else if (ua.match(/AlipayClient/i) == "alipayclient") {
    //支付宝内置浏览器
    // alert('456')
    apGetCode();
    // alert('9')
    showInfo.value = false;
    weixinShow.value = false;
  } else {
    showToast("请用支付宝或者微信打开本页面");
    showInfo.value = true;
    weixinShow.value = false;
  }
});
</script>
<style scoped lang="less">
.wxlogin {
  .info-list {
    padding-top: 0.95rem;
    text-align: center;

    .van-icon-info:before {
      font-size: 1.95rem;
      color: #10aeff;
      margin-bottom: 0.3rem;
    }

    p {
      font-size: 0.5rem;
    }
  }

  .weixin-con {
    width: 100%;
    text-align: center;
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);

    .bg-top {
      text-align: center;
      color: #1989fa;
      font-size: 34px;

      .img-logo {
        width: 15%;
        display: block;
        margin: -2rem auto 0.3rem;
      }
    }

    .info-btn {
      width: 90%;
      font-size: 0.38rem;
      line-height: 1.08rem;
      height: 1.08rem;
      border-radius: 0.23rem;
      margin-top: 0.65rem;
    }
  }
}
</style>
