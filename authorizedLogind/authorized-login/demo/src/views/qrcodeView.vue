<template>
  <div class="auth-result">
    <div class="content">
      <!-- 成功状态 -->
      <div v-if="code == 200" class="status-box success">
        <van-icon name="checked" size="60" color="#07c160" />
        <p class="title">{{ message }}</p>
      </div>

      <!-- 失败状态 -->
      <div v-else class="status-box fail">
        <van-icon name="clear" size="60" color="#ee0a24" />
        <p class="title">{{ message }}</p>
        <p class="desc" v-if="errorMessage">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { v3PlayerProfileAPI } from "../api/index";

import { useRoute, onBeforeRouteLeave } from "vue-router";

const route = useRoute();

const errorMessage = ref("");

const code = ref("");
const message = ref("");

const preventBack = () => {
  // 保持当前的 history.state，防止破坏 Vue Router 的状态
  const state = window.history.state;
  history.pushState(state, null, location.href);
};

onMounted(() => {
  if (route.query.code) {
    code.value = route.query.code;
  }
  if (route.query.message) {
    message.value = route.query.message;
  }

  // 页面创建时加载玩家数据：
  const getPost = async () => {
    showLoading.value = true;
    await v3PlayerProfileAPI()
      .then((res) => {
        if (res.data.code == 200) {
          console.log(res.data.data);
        } else {
          showToast(res.data.message);
        }
      })
      .catch((error) => {});
  };
  getPost();

  // 延迟执行，确保在页面完全加载和 Vue Router 初始化之后
  setTimeout(() => {
    const state = window.history.state;
    history.pushState(state, null, location.href);
    window.addEventListener("popstate", preventBack, false);
  }, 200);
});

onUnmounted(() => {
  window.removeEventListener("popstate", preventBack);
});

onBeforeRouteLeave((to, from, next) => {
  // 阻止页面跳转
  next(false);
});
</script>

<style scoped lang="less">
.auth-result {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;

  .content {
    padding: 0 20px;
    text-align: center;

    .status-box {
      display: flex;
      flex-direction: column;
      align-items: center;

      .van-icon {
        margin-bottom: 20px;
      }

      .title {
        font-size: 30px;
        font-weight: 500;
        color: #333;
        margin: 0 0 15px 0;
      }

      .desc {
        font-size: 14px;
        color: #969799;
        line-height: 1.5;
        margin: 0;
      }
    }
  }
}
</style>
