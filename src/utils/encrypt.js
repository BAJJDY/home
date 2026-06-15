/**
 * 加密工具类
 */

// 密钥（从环境变量获取）
const SECRET_KEY = import.meta.env.VITE_API_SECRET_KEY || "bajjdy_secret_key_2026";

/**
 * 简单的 XOR 加密/解密
 * @param {string} text - 要加密的文本
 * @param {string} key - 密钥
 * @returns {string} 加密/解密后的文本
 */
const xorEncrypt = (text, key) => {
  let result = "";
  for (let i = 0; i < text.length; i++) {
    result += String.fromCharCode(text.charCodeAt(i) ^ key.charCodeAt(i % key.length));
  }
  return result;
};

/**
 * 双重加密：先 XOR 再 Base64 编码
 * @param {string} text - 要加密的文本
 * @returns {string} 加密后的字符串
 */
export const doubleEncrypt = (text) => {
  const xorResult = xorEncrypt(text, SECRET_KEY);
  return btoa(encodeURIComponent(xorResult));
};

/**
 * 双重解密：先 Base64 解码再 XOR
 * @param {string} encryptedText - 加密的字符串
 * @returns {string} 解密后的文本
 */
export const doubleDecrypt = (encryptedText) => {
  try {
    const decoded = decodeURIComponent(atob(encryptedText));
    return xorEncrypt(decoded, SECRET_KEY);
  } catch (error) {
    console.error("解密失败:", error);
    return null;
  }
};

/**
 * 生成请求签名
 * @returns {string} 签名
 */
export const generateSignature = () => {
  const timestamp = Date.now().toString();
  const random = Math.random().toString(36).substring(2, 10);
  const raw = `${timestamp}:${random}:${SECRET_KEY}`;
  return btoa(raw);
};

/**
 * 获取请求头（包含签名和时间戳）
 * @returns {Object} 请求头对象
 */
export const getRequestHeaders = () => {
  return {
    "X-API-Signature": generateSignature(),
    "X-API-Timestamp": Date.now().toString(),
    "Content-Type": "application/json",
  };
};