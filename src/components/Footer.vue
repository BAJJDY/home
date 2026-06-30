<template>
  <footer id="footer" :class="store.footerBlur ? 'blur' : null">
    <div class="power">
      <span class="text">Copyright</span>
      <span class="text">&copy;</span>
      <span class="text">{{ siteStartYear }}</span>
      <a :href="siteUrl" class="text">{{ siteAnthor }}</a>
    </div>
  </footer>
</template>

<script setup>
import { mainStore } from "@/store";

const store = mainStore();

const siteStartYear = ref(import.meta.env.VITE_SITE_START_YEAR || "");
const siteIcp = ref(import.meta.env.VITE_SITE_ICP);
const siteAnthor = ref(import.meta.env.VITE_SITE_ANTHOR);
const siteUrl = computed(() => {
  const url = import.meta.env.VITE_SITE_URL;
  if (!url) return "https://www.bajjdy.top";
  if (!url.startsWith("http://") && !url.startsWith("https://")) {
    return "//" + url;
  }
  return url;
});
</script>

<style lang="scss" scoped>
#footer {
  width: 100%;
  position: absolute;
  bottom: 0;
  left: 0;
  height: 46px;
  line-height: 46px;
  text-align: center;
  z-index: 0;
  font-size: 14px;
  .power {
    animation: fade 0.3s;
    .text {
      font-family: "FooterFont", sans-serif;
      margin: 0 2px;
    }
  }
  &.blur {
    backdrop-filter: blur(10px);
    background: rgb(0 0 0 / 25%);
    font-size: 16px;
  }
  @media (max-width: 720px) {
    font-size: 0.85rem;
    &.blur {
      font-size: 0.85rem;
    }
  }
}
</style>