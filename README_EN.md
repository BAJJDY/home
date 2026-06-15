English | [Chinese](./README.md)

<p>
<strong><h2>BAJJDY's Home</h2></strong>
Simple little homepage, had enough of the original one and made a new one, optimized some features
</p>

![BAJJDY's Home](/screenshots/main.jpg)

>The logo font on the home page has been compressed, so if you use a font other than this logo, it will change back to the default font, Here is the [full font](https://file.4everland.app/font/Other/Pacifico-Regular.ttf)  

### Demo

>Due to CDN caching, you may need `Ctrl` + `F5` to force a browser cache refresh to see the latest results

- [BAJJDY's Home](https://bajjdy.top)

### Functions

- [x] Loading animation
- [x] Site description
- [x] Hitokoto
- [x] Date and time
- [x] Time progress bar
- [x] Mobile adaptation

### Automatic Deployment

If you encounter build environment or packaging errors, you can use `Github Actions` for automatic builds.

- After successfully `fork` the repository, go to the `Actions` page. If this is your first time, you will see the following prompt, click to enable.
  
  ![Enable Actions](/screenshots/step1.jpg)

- Then any modifications to the repository will trigger the workflow. After the workflow completes, a downloadable archive will be generated below, which is the built static file. You can upload it to your server.
  
  ![Build Complete](/screenshots/step2.jpg)

### Manual Deployment

* **Installation** [node.js](https://nodejs.org/zh-cn/) **Environment**

  > node > 16.16.0  
  > npm > 8.15.0
  
* Then run the `cmd` terminal with **administrator privileges** and `cd` to the project root directory
* In the `terminal` type:

```bash
# Install pnpm
npm install -g pnpm

# Install the dependencies
pnpm install

# Preview
pnpm dev

# Build
pnpm build
```

> Once the build is complete, the files in the `dist` folder can be uploaded to the server or imported and automatically deployed with one click using a hosting platform such as `Vercel`.

### Docker Deployment

> Docker installation and configuration will not be explained here, please solve it yourself.

```bash
# Build
docker build -t home .
# Run
docker run -p 12445:12445 -d home
```

### Site Links

You can customize site links in `src/assets/siteLinks.json`.

### Social Links

You can customize social links in `src/assets/socialLinks.json`.

### Fonts

Now using `HarmonyOS Sans` open source font, using font splitting to improve loading speed.

### Site Icons and Background

#### Site Background

You can modify the site background in `public/images`.

If you want to add more local images as site backgrounds, you can rename them in the form `background+number` and modify them in `src/components/Background/index.vue`:

```js

if (type == 0) {
  // Modify the first number after Math.random() to the number of images
  bgUrl.value = `/images/background${Math.floor(
    Math.random() * 10 + 1
  )}.webp`;
}
```

#### Site Icons

You can modify the site icons in `public/images/icon`.

### Technology Stack

* [Vue](https://cn.vuejs.org/)
* [Vite](https://vitejs.cn/vite3-cn/)
* [Pinia](https://pinia.vuejs.org/zh/)
* [IconPark](https://iconpark.oceanengine.com/official)
* [xicons](https://xicons.org/)

### Hitokoto Configuration

Hitokoto API URLs are configured in the `.env` file, supporting multi-source automatic switching. When all APIs are unavailable, local data will be used as fallback.

<a title="SSL" target="_blank" href="https://myssl.com/seal/detail?domain=bajjdy.top"><img src="https://img.shields.io/badge/MySSL-Secure-brightgreen"></a>&nbsp;<a title="CDN" target="_blank" href="https://cdnjs.com/"><img src="https://img.shields.io/badge/CDN-Cloudflare-blue"></a>&nbsp;<a title="Copyright" target="_blank" href="https://bajjdy.top/"><img src="https://img.shields.io/badge/Copyright%20%C2%A9%202025--2026-BAJJDY-red"></a>

### Acknowledgment

This project is based on [imsyy/home](https://github.com/imsyy/home).
