<template>
  <div class="bg-box">
    <img
      v-if="bgUrl"
      :src="bgUrl"
      :key="bgUrl"
      class="bg"
      @load="onImgLoad"
      draggable="false"
      alt="壁纸"
    />
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onBeforeUnmount } from "vue";
import { mainStore } from "@/store";

const store = mainStore();
const bgUrl = ref("");
let loadTimer = null;
let isInitialized = false;

const showContent = () => {
  if (!store.imgLoadStatus) {
    store.setImgLoadStatus(true);
  }
};

const generateUrl = (type) => {
  // 1/"1" = 风景 (fj), 2/"2" = 动漫 (dm)
  const isFj = type == 1 || type === "1";
  return isFj ? "/api/fj?t=" + Date.now() : "/api/dm?t=" + Date.now();
};

const changeBg = (type) => {
  clearTimeout(loadTimer);
  loadTimer = setTimeout(showContent, 800);
  bgUrl.value = generateUrl(type);
};

const onImgLoad = () => {
  showContent();
};

watch(
  () => store.coverType,
  (newType) => {
    if (!isInitialized) return;
    changeBg(newType);
  }
);

onMounted(() => {
  changeBg(store.coverType);
  isInitialized = true;
});

onBeforeUnmount(() => {
  clearTimeout(loadTimer);
});
</script>

<style lang="scss" scoped>
.bg-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  overflow: hidden;
}

.bg {
  position: absolute;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  backface-visibility: hidden;
  animation: fade-in 0.4s ease-out forwards;
}

@keyframes fade-in {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>