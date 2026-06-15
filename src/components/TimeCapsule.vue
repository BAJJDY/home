<template>
  <div class="time-capsule">
    <div class="title">
      <hourglass-full theme="two-tone" size="24" :fill="['#efefef', '#00000020']" />
      <span>时光胶囊</span>
    </div>
    <div class="capsule-item">
      <div class="item-header">
        <span class="text">今日已经度过了&nbsp;{{ timeData.day.elapsed }}&nbsp;小时</span>
        <span class="remain">{{ timeData.day.remain }}</span>
      </div>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="timeData.day.pass" color="#00d4aa" />
    </div>
    <div class="capsule-item">
      <div class="item-header">
        <span class="text">本周已经度过了&nbsp;{{ timeData.week.elapsed }}&nbsp;天</span>
        <span class="remain">{{ timeData.week.remain }}</span>
      </div>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="timeData.week.pass" color="#00a8e8" />
    </div>
    <div class="capsule-item">
      <div class="item-header">
        <span class="text">本月已经度过了&nbsp;{{ timeData.month.elapsed }}&nbsp;天</span>
        <span class="remain">{{ timeData.month.remain }}</span>
      </div>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="timeData.month.pass" color="#ff6b6b" />
    </div>
    <div class="capsule-item">
      <div class="item-header">
        <span class="text">今年已经度过了&nbsp;{{ timeData.year.elapsed }}&nbsp;个月</span>
        <span class="remain">{{ timeData.year.remain }}</span>
      </div>
      <el-progress :text-inside="true" :stroke-width="18" :percentage="timeData.year.pass" color="#ffd166" />
    </div>
    <div v-if="startDate?.length >= 4 && store.siteStartShow" class="capsule-item site-info">
      <span class="text" v-html="startDateText" />
    </div>
  </div>
</template>

<script setup>
import { HourglassFull } from "@icon-park/vue-next";
import { getTimeCapsule, siteDateStatistics } from "@/utils/getTime.js";
import { mainStore } from "@/store";
const store = mainStore();

// 进度条数据
const timeData = ref(getTimeCapsule());
const startDate = ref(import.meta.env.VITE_SITE_START);
const startDateText = ref(null);
const timeInterval = ref(null);

onMounted(() => {
  timeInterval.value = setInterval(() => {
    timeData.value = getTimeCapsule();
    if (startDate.value) startDateText.value = siteDateStatistics(new Date(startDate.value));
  }, 1000);
});

onBeforeUnmount(() => {
  clearInterval(timeInterval.value);
});
</script>

<style lang="scss" scoped>
.time-capsule {
  width: 100%;
  .title {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin: 0.2rem 0 1.5rem;
    font-size: 1.1rem;
    .i-icon {
      display: flex;
      justify-content: center;
      align-items: center;
      margin-right: 6px;
    }
  }
  .capsule-item {
    margin-bottom: 1rem;
    &:last-child {
      margin-bottom: 0;
    }
    .item-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 0.5rem;
      .text {
        font-size: 0.95rem;
        opacity: 0.9;
      }
      .remain {
        font-size: 0.85rem;
        opacity: 0.7;
        font-style: italic;
      }
    }
  }
  .site-info {
    margin-top: 1.5rem;
    padding-top: 1rem;
    border-top: 1px solid #ffffff20;
    text-align: center;
    .text {
      font-size: 0.9rem;
      opacity: 0.8;
    }
  }
}
</style>
