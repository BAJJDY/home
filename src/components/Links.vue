<template>
  <div v-if="siteLinks[0]" class="links">
    <div class="line">
      <Icon size="20">
        <Link />
      </Icon>
      <span class="title">网站列表</span>
    </div>
    <Swiper
      v-if="siteLinks[0]"
      :modules="[Pagination, Mousewheel]"
      :slides-per-view="1"
      :space-between="40"
      :pagination="{
        el: '.swiper-pagination',
        clickable: true,
        bulletElement: 'div',
      }"
      :mousewheel="true"
    >
      <SwiperSlide v-for="site in siteLinksList" :key="site">
        <el-row class="link-all" :gutter="20">
          <el-col v-for="(item, index) in site" :span="8" :key="item">
            <div
              class="item cards"
              :style="index < 3 ? 'margin-bottom: 20px' : null"
              @click="jumpLink(item, $event)"
            >
              <Icon size="26">
                <component :is="siteIcon[item.icon]" />
              </Icon>
              <span class="name text-hidden">{{ item.name }}</span>
              <span v-for="r in ripples[item.name] || []" :key="r.id" class="ripple" :style="r.style"></span>
            </div>
          </el-col>
        </el-row>
      </SwiperSlide>
      <div class="swiper-pagination" />
    </Swiper>
  </div>
</template>

<script setup>
import { Icon } from "@vicons/utils";
import { Link, Blog, Book, Cloud, Fire, LaptopCode } from "@vicons/fa";
import { mainStore } from "@/store";
import { Swiper, SwiperSlide } from "swiper/vue";
import { Pagination, Mousewheel } from "swiper";
import siteLinks from "@/assets/siteLinks.json";

const store = mainStore();

const siteLinksList = computed(() => {
  const result = [];
  for (let i = 0; i < siteLinks.length; i += 6) {
    const subArr = siteLinks.slice(i, i + 6);
    result.push(subArr);
  }
  return result;
});

const siteIcon = {
  Blog,
  Cloud,
  Book,
  Fire,
  LaptopCode,
};

const ripples = ref({});

const jumpLink = (data, event) => {
  // 波纹动画
  const itemEl = event.currentTarget;
  const rect = itemEl.getBoundingClientRect();
  const size = Math.max(rect.width, rect.height) * 2;
  const x = event.clientX - rect.left - size / 2;
  const y = event.clientY - rect.top - size / 2;
  const id = Date.now() + Math.random();
  const style = {
    width: size + "px",
    height: size + "px",
    top: y + "px",
    left: x + "px",
  };
  if (!ripples.value[data.name]) {
    ripples.value[data.name] = [];
  }
  ripples.value[data.name].push({ id, style });
  setTimeout(() => {
    if (ripples.value[data.name]) {
      ripples.value[data.name] = ripples.value[data.name].filter((r) => r.id !== id);
    }
  }, 600);

  // 跳转
  setTimeout(() => {
    window.open(data.link, "_blank");
  }, 200);
};
</script>

<style lang="scss" scoped>
.links {
  width: 100%;
  margin-top: 1.5rem;
  display: flex;
  flex-direction: column;
  animation: fade 0.5s;
  .line {
    display: flex;
    align-items: center;
    height: 40px;
    margin-bottom: 1rem;
    .title {
      margin-left: 8px;
      font-size: 1.1rem;
    }
  }
  .swiper {
    width: 100%;
  }
  .link-all {
    height: 220px;
    .item {
      position: relative;
      height: 100px;
      width: 100%;
      display: flex;
      align-items: center;
      flex-direction: row;
      justify-content: center;
      padding: 0 10px;
      animation: fade 0.5s;
      overflow: hidden;
      cursor: pointer;
      transition: transform 0.2s ease;
      &:hover {
        transform: translateY(-3px) scale(1.02);
        background: rgb(0 0 0 / 40%);
        box-shadow: 0 6px 16px rgba(0, 0, 0, 0.3);
        transition: 0.25s ease;
      }
      &:active {
        transform: scale(0.96);
        transition: 0.1s;
      }
      .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.4);
        transform: scale(0);
        animation: ripple 0.6s ease-out;
        pointer-events: none;
      }
      .name {
        margin-left: 12px;
        font-size: 1rem;
      }
    }
  }
}

@keyframes ripple {
  to {
    transform: scale(2);
    opacity: 0;
  }
}

@media (max-width: 720px) {
  .links {
    margin-top: 1rem;
    .link-all {
      height: 170px;
      .item {
        height: 75px;
        flex-direction: column;
        padding: 5px;
        .name {
          margin-left: 0;
          margin-top: 6px;
          font-size: 0.85rem;
        }
      }
    }
  }
}
</style>