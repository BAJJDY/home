<template>
  <div class="hitokoto cards" @click.stop>
    <!-- 一言内容 -->
    <div class="content" @click="updateHitokoto">
      <span class="text">{{ displayedText }}<span class="cursor" v-show="isTyping">|</span></span>
      <span class="from" v-show="showFrom">-「&nbsp;{{ hitokotoData.from }}&nbsp;」</span>
    </div>
  </div>
</template>

<script setup>
import { Error } from "@icon-park/vue-next";
import { getHitokoto } from "@/api";
import { mainStore } from "@/store";
import debounce from "@/utils/debounce.js";

const store = mainStore();

// 一言数据
const hitokotoData = reactive({
  text: "这里应该显示一句话",
  from: "BAJJDY",
});

// 打字机效果相关
const displayedText = ref("");
const isTyping = ref(false);
const showFrom = ref(false);
let typingTimer = null;

// 点击频率限制相关
const lastClickTime = ref(0);
const clickCount = ref(0);
const CLICK_LIMIT = 3; // 3秒内最多点击3次
const TIME_WINDOW = 3000; // 时间窗口 3秒
const COOLDOWN = 5000; // 冷却时间 5秒

// 打字机效果
const typeWriter = (text, speed = 80) => {
  isTyping.value = true;
  showFrom.value = false;
  displayedText.value = "";
  
  let index = 0;
  clearInterval(typingTimer);
  
  typingTimer = setInterval(() => {
    if (index < text.length) {
      displayedText.value += text.charAt(index);
      index++;
    } else {
      clearInterval(typingTimer);
      isTyping.value = false;
      showFrom.value = true;
    }
  }, speed);
};

// 获取一言数据
const getHitokotoData = async () => {
  try {
    const result = await getHitokoto();
    hitokotoData.text = result.hitokoto;
    hitokotoData.from = result.from;
    typeWriter(hitokotoData.text);
  } catch (error) {
    ElMessage({
      message: "一言获取失败",
      icon: h(Error, {
        theme: "filled",
        fill: "#efefef",
      }),
    });
    hitokotoData.text = "这里应该显示一句话";
    hitokotoData.from = "BAJJDY";
    typeWriter(hitokotoData.text);
  }
};

// 更新一言数据（带频率限制）
const updateHitokoto = () => {
  const now = Date.now();

  // 检查是否在冷却期内
  if (now - lastClickTime.value < COOLDOWN && clickCount.value >= CLICK_LIMIT) {
    ElMessage({
      message: "请勿频繁点击，稍后再试",
      type: "warning",
      duration: 2000,
    });
    return;
  }

  // 重置计数器（超过时间窗口）
  if (now - lastClickTime.value > TIME_WINDOW) {
    clickCount.value = 0;
  }

  clickCount.value++;
  lastClickTime.value = now;

  // 检查是否超过频率限制
  if (clickCount.value > CLICK_LIMIT) {
    ElMessage({
      message: "请勿频繁点击，稍后再试",
      type: "warning",
      duration: 2000,
    });
    return;
  }

  // 防抖
  debounce(() => {
    getHitokotoData();
  }, 500);
};

onMounted(() => {
  getHitokotoData();
});

onBeforeUnmount(() => {
  clearInterval(typingTimer);
});
</script>

<style lang="scss" scoped>
.hitokoto {
  width: 100%;
  height: 100%;
  padding: 20px;
  animation: fade 0.5s;
  
  .content {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-evenly;
    font-family: inherit;
    cursor: pointer;
    
    .text {
      font-size: 1.1rem;
      word-break: break-all;
      text-overflow: ellipsis;
      overflow: hidden;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      line-height: 1.6;
      
      .cursor {
        animation: blink 1s infinite;
        color: #efefef;
        font-weight: 100;
      }
    }
    
    .from {
      margin-top: 10px;
      font-weight: bold;
      align-self: flex-end;
      font-size: 1.1rem;
      animation: fade 0.5s;
    }
  }
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}
</style>
