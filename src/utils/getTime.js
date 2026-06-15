import { h } from "vue";
import { SpaCandle } from "@icon-park/vue-next";

// 时钟
export const getCurrentTime = () => {
  const time = new Date();
  const pad = (n) => n < 10 ? "0" + n : n;
  const weekday = ["星期日", "星期一", "星期二", "星期三", "星期四", "星期五", "星期六"];
  return {
    year: time.getFullYear(),
    month: pad(time.getMonth() + 1),
    day: pad(time.getDate()),
    hour: pad(time.getHours()),
    minute: pad(time.getMinutes()),
    second: pad(time.getSeconds()),
    weekday: weekday[time.getDay()],
  };
};

// 时光胶囊 - 精确计算
export const getTimeCapsule = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth(); // 0-11
  const date = now.getDate();
  const hour = now.getHours();
  const minute = now.getMinutes();
  const second = now.getSeconds();

  // 日进度 - 精确到秒
  const todaySeconds = hour * 3600 + minute * 60 + second;
  const dayTotalSeconds = 24 * 3600;
  const todayPassPercent = (todaySeconds / dayTotalSeconds) * 100;
  const dayRemain = 24 - hour - 1;
  const dayRemainText = `剩余 ${dayRemain} 小时`;

  // 周进度 - 精确到秒（周一为第1天）
  const dayOfWeek = now.getDay(); // 0-6, 0=周日
  const weekDay = dayOfWeek === 0 ? 7 : dayOfWeek; // 1-7
  const weekSeconds = (weekDay - 1) * dayTotalSeconds + todaySeconds;
  const weekTotalSeconds = 7 * dayTotalSeconds;
  const weekPassPercent = (weekSeconds / weekTotalSeconds) * 100;
  const weekRemain = 7 - weekDay;
  const weekRemainText = `剩余 ${weekRemain} 天`;

  // 月进度 - 精确到秒
  const monthAll = new Date(year, month + 1, 0).getDate();
  const monthSeconds = (date - 1) * dayTotalSeconds + todaySeconds;
  const monthTotalSeconds = monthAll * dayTotalSeconds;
  const monthPassPercent = (monthSeconds / monthTotalSeconds) * 100;
  const monthRemain = monthAll - date;
  const monthRemainText = `剩余 ${monthRemain} 天`;

  // 年进度 - 精确到秒（考虑闰年）
  const yearStart = new Date(year, 0, 1);
  const yearEnd = new Date(year + 1, 0, 1);
  const yearTotalSeconds = (yearEnd - yearStart) / 1000;
  const yearSeconds = (now - yearStart) / 1000;
  const yearPassPercent = (yearSeconds / yearTotalSeconds) * 100;
  const yearTotalDays = Math.floor(yearTotalSeconds / 86400);
  const yearPassedDays = Math.floor(yearSeconds / 86400);
  const yearRemain = yearTotalDays - yearPassedDays;
  const yearRemainText = `剩余 ${yearRemain} 天`;

  return {
    day: {
      elapsed: hour,
      pass: Math.floor(todayPassPercent),
      remain: dayRemainText,
    },
    week: {
      elapsed: weekDay,
      pass: Math.floor(weekPassPercent),
      remain: weekRemainText,
    },
    month: {
      elapsed: date,
      pass: Math.floor(monthPassPercent),
      remain: monthRemainText,
    },
    year: {
      elapsed: month + 1, // 月份从1开始显示
      pass: Math.floor(yearPassPercent),
      remain: yearRemainText,
    },
  };
};

// 欢迎提示
export const helloInit = () => {
  const hour = new Date().getHours();
  const helloMap = [
    [6, "凌晨好"],
    [9, "早上好"],
    [12, "上午好"],
    [14, "中午好"],
    [17, "下午好"],
    [19, "傍晚好"],
    [22, "晚上好"],
  ];
  let hello = "夜深了";
  for (const [h, text] of helloMap) {
    if (hour < h) {
      hello = text;
      break;
    }
  }
  ElMessage({
    dangerouslyUseHTMLString: true,
    message: `<strong>${hello}</strong> 欢迎来到我的主页`,
  });
};

// 默哀模式
const anniversaries = {
  "4.4": "清明节",
  "5.12": "汶川大地震纪念日",
  "7.7": "中国人民抗日战争纪念日",
  "9.18": "九·一八事变纪念日",
  "12.13": "南京大屠杀死难者国家公祭日",
};
export const checkDays = () => {
  const myDate = new Date();
  const key = `${myDate.getMonth() + 1}.${myDate.getDate()}`;
  const anniversary = anniversaries[key];
  if (anniversary) {
    console.log(`今天是${anniversary}`);
    const gray = document.createElement("style");
    gray.innerHTML = "html{filter: grayscale(100%)}";
    document.head.appendChild(gray);
    ElMessage({
      message: `今天是${anniversary}`,
      duration: 14000,
      icon: h(SpaCandle, { theme: "filled", fill: "#efefef" }),
    });
  }
};

// 建站日期统计 - 精确计算
export const siteDateStatistics = (startDate) => {
  const currentDate = new Date();
  const diffTime = currentDate.getTime() - startDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 3600 * 24));
  const diffMonths = Math.floor(diffDays / 30);
  const diffYears = Math.floor(diffMonths / 12);

  if (diffYears >= 1) {
    return `本站已经苟活了 ${diffYears} 年 ${diffMonths % 12} 月 ${diffDays % 30} 天`;
  } else if (diffMonths >= 1) {
    return `本站已经苟活了 ${diffMonths} 月 ${diffDays % 30} 天`;
  } else {
    return `本站已经苟活了 ${diffDays} 天`;
  }
};
