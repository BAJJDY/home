简体中文 | [English](./README_EN.md)

<p>
<strong><h2>BAJJDYの主页</h2></strong>
简单的小主页，原来的看够了，重新弄了一个，优化了一些
</p>

![BAJJDYの主页](/screenshots/main.jpg)

>主页的 Logo 字体已经过压缩，若用本站 Logo 以外的字母会变回默认字体，这里是 [完整字体](https://file.imsyy.top/font/Other/Pacifico-Regular.ttf)，若无法下载，可将字体目录下的 `Pacifico-Regular-all.ttf` 进行替换

### Demo

>由于 CDN 缓存原因，查看最新效果可能需要 `Ctrl` + `F5` 强制刷新浏览器缓存

- [BAJJDYの主页](https://bajjdy.top)

### 功能

- [x] 载入动画
- [x] 站点简介
- [x] Hitokoto 一言
- [x] 日期及时间
- [x] 时光进度条
- [x] 移动端适配

### 自动部署

如果遇到构建环境或者打包过程出现错误，则可以采用 `Github Actions` 来进行自动构建

- 在成功 `fork` 仓库后，前往 `Actions` 页面，若您是首次开启，则会出现下面的提示，点击开启
  
  ![开启 Actions](/screenshots/step1.jpg)

- 然后在仓库中进行任意修改后均会触发工作流的运行，在工作流完成后，会在下方生成一个可供下载的压缩包，这就是构建出的静态文件，可自行上传至服务器
  
  ![构建完成](/screenshots/step2.jpg)

### 手动部署

* **安装** [node.js](https://nodejs.org/zh-cn/) **环境**

  > node > 16.16.0  
  > npm > 8.15.0
  
* 然后以 **管理员权限** 运行 `cmd` 终端，并 `cd` 到 项目根目录
* 在 `终端` 中输入：

```bash
# 安装 pnpm
npm install -g pnpm

# 安装依赖
pnpm install

# 预览
pnpm dev

# 构建
pnpm build
```
> 构建完成后，静态资源会在 **`dist` 目录** 中生成，可将 **`dist` 文件夹下的文件**上传至服务器，也可使用 `Vercel` 等托管平台一键导入并自动部署

### Docker 部署

> 安装及配置 Docker 将不在此处说明，请自行解决

```bash
# 构建
docker build -t home .
# 运行
docker run -p 12445:12445 -d home
```

### 网站链接

在 `src/assets/siteLinks.json` 中可以自定义网站链接。

### 社交链接

在 `src/assets/socialLinks.json` 中可以自定义社交链接。

### 字体

现采用 `HarmonyOS Sans` 开源字体，采用字体拆分，提升加载速度。

### 网站图标及网站背景

#### 网站背景

可以在 `public/images` 中修改网站背景

如果想要添加更多的本地图片作为网站背景，可以将图片重命名 `background+数字` 的形式，并在 `src/components/Background/index.vue` 中进行修改：

```js

if (type == 0) {
  // 修改此处 Math.random() 后面的第一个数字为图片的数量
  bgUrl.value = `/images/background${Math.floor(
    Math.random() * 10 + 1
  )}.webp`;
}
```

#### 网站图标

可以在 `public/images/icon` 中修改网站图标。

### 技术栈

* [Vue](https://cn.vuejs.org/)
* [Vite](https://vitejs.cn/vite3-cn/)
* [Pinia](https://pinia.vuejs.org/zh/)
* [IconPark](https://iconpark.oceanengine.com/official)
* [xicons](https://xicons.org/)

### API

* [Hitokoto 一言](https://hitokoto.cn/) - 国际版接口，支持多语言
* [xygeng API](https://api.xygeng.cn) - 备用一言接口
* [guozhi API](http://guozhivip.com) - 备用一言接口

> 项目采用多源API自动切换机制，当主API不可用时自动切换到备用API

<a title="SSL" target="_blank" href="https://myssl.com/seal/detail?domain=bajjdy.top"><img src="https://img.shields.io/badge/MySSL-安全认证-brightgreen"></a>&nbsp;<a title="CDN" target="_blank" href="https://cdnjs.com/"><img src="https://img.shields.io/badge/CDN-Cloudflare-blue"></a>&nbsp;<a title="Copyright" target="_blank" href="https://bajjdy.top/"><img src="https://img.shields.io/badge/Copyright%20%C2%A9%202020--2026-BAJJDY-red"></a>

### 致谢

本项目基于 [imsyy/home](https://github.com/imsyy/home) 进行二次修改。
