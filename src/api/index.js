/**
 * 一言 API（多源自动切换 + 加密保护 + 本地 fallback）
 * 通过 Vite 代理访问，隐藏真实 API 地址
 * 添加 token 校验防止接口被直接盗用
 */

// 本地句子库（当所有在线 API 都失败时使用）
const localHitokoto = [
  { hitokoto: "小时候，我妈说我手指长，将来能当钢琴家，然后我成了码农", from: "网络" },
  { hitokoto: "代码写得好，头发掉得少", from: "程序员语录" },
  { hitokoto: "生活不止眼前的苟且，还有读不懂的诗和到不了的远方", from: "高晓松" },
  { hitokoto: "愿你出走半生，归来仍是少年", from: "苏轼" },
  { hitokoto: "人生苦短，我用 Python", from: "Bruce Eckel" },
  { hitokoto: "世界上只有一种真正的英雄主义，那就是在认清生活的真相后依然热爱生活", from: "罗曼·罗兰" },
  { hitokoto: "我们终其一生，就是要摆脱他人的期待，找到真正的自己", from: "无声告白" },
  { hitokoto: "山有木兮木有枝，心悦君兮君不知", from: "越人歌" },
  { hitokoto: "人生如逆旅，我亦是行人", from: "苏轼" },
  { hitokoto: "醉后不知天在水，满船清梦压星河", from: "唐温如" },
  { hitokoto: "世间所有的相遇，都是久别重逢", from: "一代宗师" },
  { hitokoto: "你若盛开，清风自来", from: "三毛" },
  { hitokoto: "不乱于心，不困于情，不畏将来，不念过往", from: "丰子恺" },
  { hitokoto: "早知如此绊人心，何如当初莫相识", from: "李白" },
  { hitokoto: "愿有岁月可回首，且以深情共白头", from: "黄信然" },
  { hitokoto: "程序员的三大浪漫：编译原理、图形学、操作系统", from: "网络" },
  { hitokoto: "在这个世界上，所有真性情的人，想法总是与众不同", from: "王小波" },
  { hitokoto: "你来人间一趟，你要看看太阳", from: "海子" },
  { hitokoto: "黑夜给了我黑色的眼睛，我却用它寻找光明", from: "顾城" },
  { hitokoto: "面向对象编程，就是把数据和操作数据的函数绑定在一起", from: "Alan Kay" },
  { hitokoto: "落霞与孤鹜齐飞，秋水共长天一色", from: "王勃" },
  { hitokoto: "人生若只如初见，何事秋风悲画扇", from: "纳兰性德" },
  { hitokoto: "曾经沧海难为水，除却巫山不是云", from: "元稹" },
  { hitokoto: "两情若是久长时，又岂在朝朝暮暮", from: "秦观" },
  { hitokoto: "一花一世界，一叶一菩提", from: "佛经" },
];

// 生成请求签名（基于密钥+时间戳）
const generateToken = (path) => {
  const secret = import.meta.env.VITE_API_SECRET_KEY || "BAJJDY_API_SECRET_KEY_2026_06_15";
  const timestamp = Date.now();
  let token = "";
  const raw = `${path}|${timestamp}|${secret}`;
  for (let i = 0; i < raw.length; i++) {
    token += String.fromCharCode(raw.charCodeAt(i) ^ secret.charCodeAt(i % secret.length));
  }
  const encoded = btoa(token).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return { token: encoded, timestamp };
};

const hitokotoApis = [
  {
    name: "hitokoto",
    url: "/api/hitokoto",
    parse: (d) => ({ hitokoto: d.hitokoto, from: d.from || "未知" }),
  },
  {
    name: "xygeng",
    url: "/api/hitokoto-fallback",
    parse: (d) => ({
      hitokoto: d.data?.content || d.content || "",
      from: d.data?.origin || d.origin || "未知",
    }),
  },
];

const fetchWithTimeout = (url, options, timeout = 3000) => {
  return Promise.race([
    fetch(url, options),
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout")), timeout)
    ),
  ]);
};

let allApisFailed = false;
let failExpireTime = 0;
const FAIL_COOLDOWN = 5 * 60 * 1000;

export const getHitokoto = async () => {
  if (allApisFailed && Date.now() < failExpireTime) {
    const randomIndex = Math.floor(Math.random() * localHitokoto.length);
    return localHitokoto[randomIndex];
  }

  for (const api of hitokotoApis) {
    try {
      const { token, timestamp } = generateToken(api.url);
      const res = await fetchWithTimeout(
        api.url,
        {
          method: "GET",
          mode: "cors",
          headers: {
            "X-Request-Token": token,
            "X-Request-Time": String(timestamp),
          },
        },
        1500
      );
      if (!res.ok) continue;
      const data = await res.json();
      const result = api.parse(data);
      if (result.hitokoto) {
        allApisFailed = false;
        failExpireTime = 0;
        return result;
      }
    } catch (e) {
    }
  }

  allApisFailed = true;
  failExpireTime = Date.now() + FAIL_COOLDOWN;
  const randomIndex = Math.floor(Math.random() * localHitokoto.length);
  return localHitokoto[randomIndex];
};