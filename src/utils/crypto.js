/**
 * 简单加密工具 - 用于保护敏感数据
 */

// 自定义密钥
const SECRET_KEY = "BAJJDY_HOME_2026";

/**
 * 简单的字符替换加密
 */
export const encrypt = (text) => {
  if (!text) return "";
  let result = "";
  for (let i = 0; i < text.length; i++) {
    const charCode = text.charCodeAt(i);
    const keyCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
    result += String.fromCharCode(charCode + keyCode);
  }
  return btoa(result);
};

/**
 * 解密
 */
export const decrypt = (encryptedText) => {
  if (!encryptedText) return "";
  let result = "";
  try {
    const decoded = atob(encryptedText);
    for (let i = 0; i < decoded.length; i++) {
      const charCode = decoded.charCodeAt(i);
      const keyCode = SECRET_KEY.charCodeAt(i % SECRET_KEY.length);
      result += String.fromCharCode(charCode - keyCode);
    }
    return result;
  } catch {
    return encryptedText;
  }
};

/**
 * 对对象进行加密
 */
export const encryptObject = (obj) => {
  const jsonString = JSON.stringify(obj);
  return encrypt(jsonString);
};

/**
 * 解密对象
 */
export const decryptObject = (encryptedString) => {
  const jsonString = decrypt(encryptedString);
  try {
    return JSON.parse(jsonString);
  } catch {
    return null;
  }
};
