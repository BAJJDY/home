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

### Deployment

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

### Fonts

Now using `HarmonyOS Sans` open source font, using font splitting to improve loading speed.

### Technology Stack

* [Vue](https://cn.vuejs.org/)
* [Vite](https://vitejs.cn/vite3-cn/)
* [Pinia](https://pinia.vuejs.org/zh/)
* [IconPark](https://iconpark.oceanengine.com/official)
* [xicons](https://xicons.org/)

### API

* [Hitokoto](https://hitokoto.cn/) - International version, supports multiple languages
* [xygeng API](https://api.xygeng.cn) - Backup hitokoto API
* [guozhi API](http://guozhivip.com) - Backup hitokoto API

> The project uses a multi-source API automatic switching mechanism. When the primary API is unavailable, it automatically switches to the backup API.

<a title="SSL" target="_blank" href="https://myssl.com/seal/detail?domain=bajjdy.top"><img src="https://img.shields.io/badge/MySSL-Secure-brightgreen"></a>&nbsp;<a title="CDN" target="_blank" href="https://cdnjs.com/"><img src="https://img.shields.io/badge/CDN-Cloudflare-blue"></a>&nbsp;<a title="Copyright" target="_blank" href="https://bajjdy.top/"><img src="https://img.shields.io/badge/Copyright%20%C2%A9%202020--2023-BAJJDY-red"></a>
