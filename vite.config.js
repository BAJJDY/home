/* eslint-disable no-undef */
import { defineConfig, loadEnv } from "vite";
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
import { resolve } from "path";
import { VitePWA } from "vite-plugin-pwa";
import vue from "@vitejs/plugin-vue";
import AutoImport from "unplugin-auto-import/vite";
import Components from "unplugin-vue-components/vite";
import viteCompression from "vite-plugin-compression";
import crypto from "crypto";

const API_SECRET = "BAJJDY_API_SECRET_KEY_2026_06_15";

const verifyToken = (req) => {
  const token = req.headers["x-request-token"];
  const time = req.headers["x-request-time"];
  if (!token || !time) return false;
  const now = Date.now();
  if (Math.abs(now - parseInt(time)) > 5 * 60 * 1000) return false;
  const url = new URL(req.url, "http://localhost");
  const path = url.pathname;
  const raw = `${path}|${time}|${API_SECRET}`;
  let expected = "";
  for (let i = 0; i < raw.length; i++) {
    expected += String.fromCharCode(raw.charCodeAt(i) ^ API_SECRET.charCodeAt(i % API_SECRET.length));
  }
  const expectedEncoded = Buffer.from(expected).toString("base64")
    .replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  return token === expectedEncoded;
};
export default ({ mode }) =>
  defineConfig({
    plugins: [
      vue(),
      AutoImport({
        imports: ["vue"],
        resolvers: [ElementPlusResolver()],
      }),
      Components({
        resolvers: [ElementPlusResolver()],
      }),
      {
        name: "api-headers",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            // 鉴权：一言 API
            if (req.url.startsWith("/api/hitokoto")) {
              if (!verifyToken(req)) {
                res.statusCode = 403;
                res.setHeader("Content-Type", "text/plain");
                res.end("403 Forbidden");
                return;
              }
            }
            // 禁止缓存：图片 API（防止浏览器/CDN 缓存命中）
            if (req.url.startsWith("/api/fj") || req.url.startsWith("/api/dm") || req.url.startsWith("/api/bg/")) {
              res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, max-age=0");
              res.setHeader("Pragma", "no-cache");
              res.setHeader("Expires", "0");
            }
            next();
          });
        },
      },
      // 强制覆盖图片 API 代理响应头，去除源站缓存指令
      {
        name: "image-no-store",
        configureServer(server) {
          server.middlewares.use((req, res, next) => {
            if (
              req.url.startsWith("/api/fj") ||
              req.url.startsWith("/api/dm") ||
              req.url.startsWith("/api/bg/")
            ) {
              const originalWriteHead = res.writeHead.bind(res);
              res.writeHead = function (statusCode, statusMessage, headers) {
                const merged = Object.assign({}, headers || {}, {
                  "Cache-Control": "no-store, no-cache, must-revalidate, max-age=0",
                  Pragma: "no-cache",
                  Expires: "0",
                });
                return originalWriteHead(statusCode, statusMessage, merged);
              };
            }
            next();
          });
        },
      },
      VitePWA({
        registerType: "autoUpdate",
        workbox: {
          skipWaiting: true,
          clientsClaim: true,
          runtimeCaching: [
            {
              urlPattern: /(.*?)\.(js|css|woff2|woff|ttf)/,
              handler: "CacheFirst",
              options: {
                cacheName: "js-css-cache",
              },
            },
            {
              urlPattern: /^\/images\//,
              handler: "CacheFirst",
              options: {
                cacheName: "local-image-cache",
              },
            },
            {
              urlPattern: /^\/api\/hitokoto/,
              handler: "NetworkOnly",
              options: {
                cacheName: "hitokoto-api-cache",
                networkTimeoutSeconds: 0,
              },
            },
            {
              urlPattern: /^\/api\/(fj|dm|bg\/)/,
              handler: "NetworkOnly",
              options: {
                cacheName: "image-api-cache",
                networkTimeoutSeconds: 0,
              },
            },
          ],
        },
        manifest: {
          name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          short_name: loadEnv(mode, process.cwd()).VITE_SITE_NAME,
          description: loadEnv(mode, process.cwd()).VITE_SITE_DES,
          display: "standalone",
          start_url: "/",
          theme_color: "#424242",
          background_color: "#424242",
          icons: [
            {
              src: "/images/icon/48.png",
              sizes: "48x48",
              type: "image/png",
            },
            {
              src: "/images/icon/72.png",
              sizes: "72x72",
              type: "image/png",
            },
            {
              src: "/images/icon/96.png",
              sizes: "96x96",
              type: "image/png",
            },
            {
              src: "/images/icon/128.png",
              sizes: "128x128",
              type: "image/png",
            },
            {
              src: "/images/icon/144.png",
              sizes: "144x144",
              type: "image/png",
            },
            {
              src: "/images/icon/192.png",
              sizes: "192x192",
              type: "image/png",
            },
            {
              src: "/images/icon/512.png",
              sizes: "512x512",
              type: "image/png",
            },
          ],
        },
      }),
      viteCompression(),
    ],
    server: {
      port: "3000",
      open: true,
      proxy: {
        "/api/hitokoto-fallback": {
          target: "https://api.xygeng.cn",
          changeOrigin: true,
          rewrite: (path) =>
            path.replace(/^\/api\/hitokoto-fallback/, "/one"),
        },
        "/api/hitokoto": {
          target: "https://international.v1.hitokoto.cn",
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api\/hitokoto/, ""),
        },
        "/api/fj": {
          target: "https://tu.ltyuanfang.cn",
          changeOrigin: true,
          followRedirects: true,
          rewrite: (path) => path.replace(/^\/api\/fj/, "/api/fengjing.php"),
          headers: {
            "Cache-Control": "no-store",
          },
        },
        "/api/bg/fengjing": {
          target: "https://tu.ltyuanfang.cn",
          changeOrigin: true,
          followRedirects: true,
          rewrite: (path) => path.replace(/^\/api\/bg\/fengjing/, "/api/fengjing.php"),
          headers: {
            "Cache-Control": "no-store",
          },
        },
        "/api/dm": {
          target: "https://t.alcy.cc",
          changeOrigin: true,
          followRedirects: true,
          rewrite: (path) => path.replace(/^\/api\/dm/, "/ycy"),
          headers: {
            "Cache-Control": "no-store",
          },
        },
        "/api/bg/dongman": {
          target: "https://t.alcy.cc",
          changeOrigin: true,
          followRedirects: true,
          rewrite: (path) => path.replace(/^\/api\/bg\/dongman/, "/ycy"),
          headers: {
            "Cache-Control": "no-store",
          },
        },
      },
    },
    resolve: {
      alias: [
        {
          find: "@",
          replacement: resolve(__dirname, "src"),
        },
      ],
    },
    css: {
      preprocessorOptions: {
        scss: {
          charset: false,
          additionalData: `@import "./src/style/global.scss";`,
          silenceDeprecations: ["legacy-js-api", "import"],
        },
      },
    },
    build: {
      minify: "terser",
      terserOptions: {
        compress: {
          pure_funcs: ["console.log"],
        },
      },
    },
  });
