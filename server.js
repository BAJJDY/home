import express from "express";
import { createProxyMiddleware } from "http-proxy-middleware";
import path from "path";
import https from "https";
import http from "http";
import crypto from "crypto";

const app = express();
const PORT = process.env.PORT || 3000;
const API_SECRET = process.env.API_SECRET || "BAJJDY_API_SECRET_KEY_2026_06_15";

// 一言接口 token 验证
const verifyHitokotoToken = (req, res, next) => {
  const token = req.headers["x-request-token"];
  const time = req.headers["x-request-time"];
  if (!token || !time) {
    res.status(403).type("text/plain").send("403 Forbidden");
    return;
  }
  const now = Date.now();
  if (Math.abs(now - parseInt(time)) > 5 * 60 * 1000) {
    res.status(403).type("text/plain").send("403 Forbidden");
    return;
  }
  const path = req.originalUrl.replace(/\?.*$/, "");
  const raw = `${path}|${time}|${API_SECRET}`;
  let expected = "";
  for (let i = 0; i < raw.length; i++) {
    expected += String.fromCharCode(raw.charCodeAt(i) ^ API_SECRET.charCodeAt(i % API_SECRET.length));
  }
  const expectedEncoded = Buffer.from(expected).toString("base64")
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  if (token !== expectedEncoded) {
    res.status(403).type("text/plain").send("403 Forbidden");
    return;
  }
  next();
};

// 图片接口 referer 验证
const imageGuard = (req, res, next) => {
  const referer = req.headers.referer || req.headers.referrer || "";
  const host = req.headers.host || "";
  if (referer && !referer.includes(host) && !referer.includes("BAJJDY.top") && !referer.includes("localhost")) {
    return res.status(403).json({ code: 403, msg: "Forbidden" });
  }
  next();
};

app.use(express.static(path.join(import.meta.dirname, "dist")));

app.use(
  "/api/hitokoto-fallback",
  verifyHitokotoToken,
  createProxyMiddleware({
    target: "https://api.xygeng.cn",
    changeOrigin: true,
    pathRewrite: { "^/api/hitokoto-fallback": "/one" },
    onProxyRes: (proxyRes, req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

app.use(
  "/api/hitokoto",
  verifyHitokotoToken,
  createProxyMiddleware({
    target: "https://international.v1.hitokoto.cn",
    changeOrigin: true,
    pathRewrite: { "^/api/hitokoto": "" },
    onProxyRes: (proxyRes, req, res) => {
      res.setHeader("Access-Control-Allow-Origin", "*");
    },
  })
);

const fetchImageAndProxy = (url, res) => {
  // 强制禁止浏览器和中间缓存，确保每次请求都是新的图片
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  const protocol = url.startsWith("https") ? https : http;
  const req = protocol.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (response) => {
    if (response.statusCode === 301 || response.statusCode === 302) {
      const redirectUrl = response.headers.location;
      fetchImageAndProxy(redirectUrl, res);
    } else {
      res.setHeader("Content-Type", response.headers["content-type"] || "image/jpeg");
      res.setHeader("Access-Control-Allow-Origin", "*");
      // 再次确保下游响应不携带缓存指令覆盖
      res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
      response.pipe(res);
    }
  });
  req.on("error", (err) => {
    res.status(500).send("Image fetch error");
  });
};

app.get("/api/fj", imageGuard, (req, res) => {
  fetchImageAndProxy("https://tu.ltyuanfang.cn/api/fengjing.php", res);
});

app.get("/api/bg/fengjing", imageGuard, (req, res) => {
  fetchImageAndProxy("https://tu.ltyuanfang.cn/api/fengjing.php", res);
});

app.get("/api/dm", imageGuard, (req, res) => {
  fetchImageAndProxy("https://t.alcy.cc/ycy", res);
});

app.get("/api/bg/dongman", imageGuard, (req, res) => {
  fetchImageAndProxy("https://t.alcy.cc/ycy", res);
});

app.get("(.*)", (req, res) => {
  res.sendFile(path.join(import.meta.dirname, "dist", "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});