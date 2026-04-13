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
import { ref, computed, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

// 状态控制：可以通过路由参数控制 ?status=1 (成功) / ?status=0 (失败)
// 默认为成功状态用于展示
const status = ref(1);
const errorMessage = ref("");

const isSuccess = computed(() => Number(status.value) === 1);
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
