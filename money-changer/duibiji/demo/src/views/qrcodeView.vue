<template>
  <div class="auth-result">
    <div class="content">
      <!-- 成功状态 -->
      <div v-if="code == 200" class="status-box success">
        <van-icon name="checked" size="40" color="#07c160" />
        <p class="title">{{ message || "核销成功" }}</p>
        <!-- <p class="desc">请检查您的余额变动</p> -->
      </div>

      <!-- 失败状态 -->
      <div v-else class="status-box fail">
        <van-icon name="clear" size="40" color="#ee0a24" />
        <p class="title">{{ message || "核销失败" }}</p>
        <!-- <p class="desc" v-if="errorMessage">{{ errorMessage }}</p>
        <p class="desc" v-else>请重试或联系客服</p> -->
      </div>

      <!-- 操作按钮 -->
      <div class="action-area">
        <van-button type="primary" block round class="home-btn" @click="goHome">
          返回首页
        </van-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";

const route = useRoute();
const router = useRouter();

const errorMessage = ref("");
const code = ref("");
const message = ref("");

onMounted(() => {
  if (route.query.code) {
    code.value = route.query.code;
  }
  if (route.query.message) {
    message.value = route.query.message;
  }
});

const goHome = () => {
  // 使用 replace 返回首页，避免历史记录堆叠
  router.replace({
    path: "/home/index",
    query: { t: Date.now() }, // 加个时间戳强制刷新（如果需要）
  });
};
</script>

<style scoped lang="less">
.auth-result {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #f7f8fa; /* 调整背景色 */

  .content {
    width: 80%;
    padding: 40px 20px;
    background: #fff;
    border-radius: 16px;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
    text-align: center;

    .status-box {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-bottom: 40px;

      .van-icon {
        margin-bottom: 24px;
      }

      .title {
        font-size: 35px;
        font-weight: 600;
        color: #333;
        margin: 0 0 12px 0;
      }

      .desc {
        font-size: 16px;
        color: #969799;
        line-height: 1.5;
        margin: 0;
      }
    }

    .action-area {
      width: 100%;
      margin-top: 20px;

      .home-btn {
        height: 50px;
        font-size: 25px;
        font-weight: 500;
      }
    }
  }
}
</style>
