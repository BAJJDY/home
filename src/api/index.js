/**
 * 一言 API（加密保护）
 */

import { getRequestHeaders } from "@/utils/encrypt";

// 获取一言数据（使用代理 + 签名保护）
export const getHitokoto = async () => {
  try {
    const headers = getRequestHeaders();
    const res = await fetch("/api/", {
      method: "GET",
      mode: "cors",
      headers: headers,
    });
    const data = await res.json();
    return {
      hitokoto: data.hitokoto,
      from: data.from || "未知",
    };
  } catch (error) {
    console.error("一言API请求失败:", error);
    throw new Error("一言获取失败");
  }
};
