<template>
  <div class="test">
    <van-popup
      v-model:show="showLoading"
      style="background: none"
      :overlay="false"
      class="van-popup-load"
    >
      <van-loading size="24px" color="#1989fa" vertical>加载中...</van-loading>
    </van-popup>
  </div>
</template>
<script setup>
import { ref, onMounted, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { showToast, showConfirmDialog } from "vant";
import { getStorageExpire } from "../utils/storage";
const router = useRouter();
const route = useRoute();
const showLoading = ref(false);
const urlParams = ref([]);

const ticketId = ref("");
const ticketType = ref(0);

const getDataFee = async () => {
  urlParams.value = getUrlParams();
  console.log(urlParams.value);
  if (
    urlParams.value["ticketId"] == "" ||
    urlParams.value["ticketId"] == undefined ||
    urlParams.value["ticketId"] == null
  ) {
    if (
      localStorage.getItem("shop_ticketId") == "" ||
      localStorage.getItem("shop_ticketId") == undefined ||
      localStorage.getItem("shop_ticketId") == null
    ) {
      showToast("暂无设备记录，请先扫描机器二维码");
    } else {
      ticketId.value = localStorage.getItem("shop_ticketId");
    }
  } else {
    ticketId.value = urlParams.value["ticketId"];
    localStorage.setItem("shop_ticketId", ticketId.value);
  }

  ticketType.value = urlParams.value["ticketType"];
  localStorage.setItem("shop_ticketType", ticketType.value);
  // const host = window.location.host;
  // window.location.href = "https://" + host + "/newcoiner/#/login";
  router.replace({ name: "login" });
};

const getUrlParams = () => {
  let url = location.href; //获取url中"?"符后的字串
  // console.log(url);
  let urlParams = new Object();
  if (url.indexOf("?") != -1) {
    //找到?，这样后面才可能有参数
    url = url.replace(/\?/g, "&"); //?号替换成&号
    let strs = url.split("&"); //分割成等号=键-值对
    for (let i = 0; i < strs.length; i++) {
      if (strs[i].indexOf("=") != -1) {
        let substrs = strs[i].split("=");
        urlParams[substrs[0]] = unescape(substrs[1]);
      }
    }
  }
  return urlParams;
};
getUrlParams();
// console.log(getUrlParams());
onMounted(() => {
  // 调用方法
  getDataFee();
});
</script>
<style scoped lang="less"></style>
