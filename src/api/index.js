import { hitokotoList } from "./hitokotoData";

const hitokotoApis = [
  import.meta.env.VITE_HITOKOTO_API1,
  import.meta.env.VITE_HITOKOTO_API2,
  import.meta.env.VITE_HITOKOTO_API3,
].filter(Boolean);

let currentApiIndex = 0;

export const getHitokoto = async () => {
  if (hitokotoApis.length === 0) {
    const randomIndex = Math.floor(Math.random() * hitokotoList.length);
    return hitokotoList[randomIndex];
  }

  const apiUrl = hitokotoApis[currentApiIndex];
  try {
    const res = await fetch(apiUrl, {
      method: "GET",
      mode: "cors",
    });
    const data = await res.json();

    if (apiUrl.includes("hitokoto")) {
      return {
        hitokoto: data.hitokoto,
        from: data.from || "未知",
      };
    } else if (apiUrl.includes("xygeng")) {
      return {
        hitokoto: data.data?.content || data.content || "一言获取失败",
        from: data.data?.origin || data.origin || "未知",
      };
    } else {
      return {
        hitokoto: data.content || data.hitokoto || data.text || "一言获取失败",
        from: data.from || data.origin || "未知",
      };
    }
  } catch (error) {
    currentApiIndex = (currentApiIndex + 1) % hitokotoApis.length;
    if (currentApiIndex !== 0) {
      return await getHitokoto();
    }
    const randomIndex = Math.floor(Math.random() * hitokotoList.length);
    return hitokotoList[randomIndex];
  }
};
