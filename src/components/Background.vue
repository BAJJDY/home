<template>
  <div class="bg-box">
    <img
      v-if="bgUrl"
      :src="bgUrl"
      :key="bgUrl"
      class="bg"
      @load="onImgLoad"
      @error="onImgError"
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

const localWallpapers = {
  fj: [
    "/images/background1.jpg",
    "/images/background2.jpg",
    "/images/background3.jpg",
    "/images/background4.jpg",
    "/images/background5.jpg",
  ],
  dm: [
    "/images/background6.jpg",
    "/images/background7.jpg",
    "/images/background8.jpg",
    "/images/background9.jpg",
    "/images/background10.jpg",
  ],
};

const showContent = () => {
  if (!store.imgLoadStatus) {
    store.setImgLoadStatus(true);
  }
};

const generateUrl = (type) => {
  const isFj = type == 1 || type === "1";
  return isFj ? "/api/fj?t=" + Date.now() : "/api/dm?t=" + Date.now();
};

const getLocalWallpaper = (type) => {
  const isFj = type == 1 || type === "1";
  const list = isFj ? localWallpapers.fj : localWallpapers.dm;
  return list[Math.floor(Math.random() * list.length)];
};

const changeBg = (type, useLocal = false) => {
  clearTimeout(loadTimer);
  loadTimer = setTimeout(showContent, 800);
  bgUrl.value = useLocal ? getLocalWallpaper(type) : generateUrl(type);
};

const onImgLoad = () => {
  showContent();
};

const onImgError = () => {
  changeBg(store.coverType, true);
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