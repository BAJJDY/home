/**
 * 一言
 */

// 一言API列表
const hitokotoApis = [
  { name: "hitokoto", url: "https://international.v1.hitokoto.cn/" },
  { name: "xygeng", url: "https://api.xygeng.cn/one" },
  { name: "guozhi", url: "http://guozhivip.com/yy/api/api.php" },
];

// 当前使用的API索引
let currentApiIndex = 0;

// 获取一言数据（多源切换）
export const getHitokoto = async () => {
  const api = hitokotoApis[currentApiIndex];
  try {
    const res = await fetch(api.url, {
      method: "GET",
      // 处理跨域
      mode: "cors",
    });
    const data = await res.json();

    // 根据不同API返回格式统一处理
    if (api.name === "hitokoto") {
      return {
        hitokoto: data.hitokoto,
        from: data.from,
      };
    } else if (api.name === "xygeng") {
      return {
        hitokoto: data.data?.content || data.content || "一言获取失败",
        from: data.data?.origin || data.origin || "未知",
      };
    } else if (api.name === "guozhi") {
      return {
        hitokoto: data.content || data.hitokoto || data.text || "一言获取失败",
        from: data.from || data.origin || "未知",
      };
    }
  } catch (error) {
    console.error(`一言API [${api.name}] 请求失败:`, error);
    // 切换到下一个API
    currentApiIndex = (currentApiIndex + 1) % hitokotoApis.length;
    // 如果还有未尝试的API，递归调用
    if (currentApiIndex !== 0) {
      return await getHitokoto();
    }
    throw new Error("所有一言API均不可用");
  }
};
