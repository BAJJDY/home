/**
 * 一言 API（多源自动切换）
 * 直接调用真实 API，支持 CORS，部署后也能正常工作
 */

// 一言 API 列表（按优先级排序）
const hitokotoApis = [
  {
    name: "hitokoto",
    url: "https://international.v1.hitokoto.cn/",
    parse: (d) => ({ hitokoto: d.hitokoto, from: d.from || "未知" }),
  },
  {
    name: "xygeng",
    url: "https://api.xygeng.cn/one",
    parse: (d) => ({
      hitokoto: d.data?.content || d.content || "一言获取失败",
      from: d.data?.origin || d.origin || "未知",
    }),
  },
];

// 依次尝试 API，直到成功
export const getHitokoto = async () => {
  for (const api of hitokotoApis) {
    try {
      const res = await fetch(api.url, { method: "GET", mode: "cors" });
      if (!res.ok) continue;
      const data = await res.json();
      const result = api.parse(data);
      if (result.hitokoto && result.hitokoto !== "一言获取失败") {
        return result;
      }
    } catch (e) {
      console.warn(`一言API [${api.name}] 请求失败，尝试下一个...`);
    }
  }
  // 全部失败时返回默认内容
  return {
    hitokoto: "欢迎来到 BAJJDY 的个人主页",
    from: "BAJJDY",
  };
};
