---
layout: post
title: PWA简介
tags:
  - javascript
  - 技术
abbrlink: 45644
date: 2018-04-25 09:06:57
---

# PWA简介

Progressive Web Apps，简称PWA.
渐进式提升Web App原生体验的技术方案，能给用户原生应用的体验。

PWA能做到原生应用的体验不是靠特指某一项技术，而是经过应用一些新技术进行改进，在安全、性能和体验三个方面都有很大提升，PWA本质上是WebApp，借助一些新技术也具备NativeApp的一些特性，兼具WebApp和NativeApp的优点。

## PWA具有的一些特点及特性

PWA特点：

- 可靠 即使在不稳定的网络环境下，也能瞬间加载并展现
- 体验 快速响应，并且有平滑的动画响应用户的操作
- 粘性 像设备上的原生应用，具有沉浸式饿得用户体验，用户可以添加到桌面

PWA具有特性

- 渐进式 - Progressive 适用于所有浏览器，因为它以渐进式增强作为宗旨开发
- 连接无关性 - 能够借助Service Worker在离线或这网络较差情况下正常访问
- 类似应用 - 由于在App Shell模型基础上开发，因为应具有NativeApp的交互和导航，给用户NativeApp的体验
- 持续更新 - 始终是最新的，无版本和更新问题
- 安全 - 通过HTTPS协议提供服务，防止窥探和确保内容不被篡改
- 可索引 - 应用清单文件和ServiceWorker可以让搜索引擎引到，从而将其识别为应用
- 粘性 - 通过推送离线通知等，可以让用户回流
- 免安装 - 用户可以添加常用的webapp到桌面，免去应用商店下载的麻烦
- 可链接 - 通过链接即可分享内容，无需下载安装

- Web App Manifest(主屏图标)
- ServiceWorker(离线可用)
- Notification API & Push API(离线通知)
- App Shell & App Skeleton设计模型
- PRPL Pattern(Push, Render, Pre-cache, Lazy-load)
- 安全HTTPS
- 交互 & 动画
- PWA通常是SPA 通常采用AppShell设计模型

## ServiceWorker

## 什么是Service Worker

W3C 组织早在 2014 年 5 月就提出过 Service Worker 这样的一个 HTML5 API ，主要用来做持久的离线缓存。
浏览器中的 javaScript 都是运行在一个单一主线程上的，在同一时间内只能做一件事情。随着 Web 业务不断复杂，我们逐渐在 js 中加了很多耗资源、耗时间的复杂运算过程，这些过程导致的性能问题在 WebApp 的复杂化过程中更加凸显出来。

W3C 组织早早的洞察到了这些问题可能会造成的影响，这个时候有个叫 Web Worker 的 API 被造出来了，这个 API 的唯一目的就是解放主线程，Web Worker 是脱离在主线程之外的，将一些复杂的耗时的活交给它干，完成后通过 postMessage 方法告诉主线程，而主线程通过 onMessage 方法得到 Web Worker 的结果反馈。

Service Worker 在 Web Worker 的基础上加上了持久离线缓存能力。
Service Worker 有以下功能和特性：

 - 一个独立的 worker 线程，独立于当前网页进程，有自己独立的 worker context。
 - 一旦被 install，就永远存在，除非被 uninstall
 - 需要的时候可以直接唤醒，不需要的时候自动睡眠（有效利用资源，此处有坑）
 - 可编程拦截代理请求和返回，缓存文件，缓存的文件可以被网页进程取到（包括网络离线状态）
 - 离线内容开发者可控
 - 能向客户端推送消息
 - 不能直接操作 DOM
 - 出于安全的考虑，必须在 HTTPS 环境下才能工作
 - 异步实现，内部大都是通过 Promise 实现

## Service Worker生命周期

MDN 给出了详细的 Service Worker 生命周期图：
![](/images/sw-lifecycle.png)

生命周期状态：

 - 安装( installing )：这个状态发生在 Service Worker 注册之后，表示开始安装，触发 install 事件回调指定一些静态资源进行离线缓存。
    >install 事件回调中有两个方法：
    > - event.waitUntil()：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
    > - self.skipWaiting()：self 是当前 context 的 global 变量，执行该方法表示强制当前处在 waiting 状态的 Service Worker 进入 activate 状态。
- 安装后( installed )：Service Worker 已经完成了安装，并且等待其他的 Service Worker 线程被关闭。
- 激活( activating )：在这个状态下没有被其他的 Service Worker 控制的客户端，允许当前的 worker 完成安装，并且清除了其他的 worker 以及关联缓存的旧缓存资源，等待新的 Service Worker 线程被激活。
  > activate 回调中有两个方法：
  > - event.waitUntil()：传入一个 Promise 为参数，等到该 Promise 为 resolve 状态为止。
  > - self.clients.claim()：在 activate 事件回调中执行该方法表示取得页面的控制权, 这样之后打开页面都会使用版本更新的缓存。旧的 Service Worker 脚本不再控制着页面，之后会被停止。
- 激活后( activated )：在这个状态会处理 activate 事件回调 (提供了更新缓存策略的机会)。并可以处理功能性的事件 fetch (请求)、sync (后台同步)、push (推送)。
- 废弃状态 ( redundant )：这个状态表示一个 Service Worker 的生命周期结束。

  > 进入废弃 (redundant) 状态的原因可能为这几种：
  > - 安装 (install) 失败
  > - 激活 (activating) 失败
  > - 新版本的 Service Worker 替换了它并成为激活状态

## Service Worker支持的事件
MDN 也列出了 Service Worker 所有支持的事件：
![](/images/sw-events.png)

## 怎么使用Service worker

1. 注册

安装serviceWoker ,通常需要在js主线程（常规页面的js）注册SeriveWorker来启动安装，这个过程将会通知浏览器我们的Service Worker线程的javascript文件在什么地方呆着。

```
if('serviceWorker' in navigator) {
  window.addEventListener('load', function () {
      navigator.serviceWorker.register('/sw.js', {scope: '/'})
      .then(function (registration) {

          // 注册成功
          console.log('ServiceWoker registration successful with scope:', registration.scope);
      })
      .catch(function (err) {
          // 注册失败
          console.log('ServiceWoker registration failed:', err);
      });
  });
}
```

_注：查看是否注册成功，可以用chrome浏览器，输入 `chrome://inspect/#service-workers`_

2. 安装

```
// 监听 service worker的install事件
this.addEventListener('install', function(event){
  // 如果监听到了service worker 已经安装成功，就会调用event.waitUntil回调函数
  event.waitUntil(
      // 安装成功后操作 CacheStorage缓存，使用之前需要先通过caches.open()打开对应缓存空间
      cache.open('my-test-cache-v1').then(function(cache) {
        // 通过cache缓存对象的addAll方法添加precache缓存
        return cache.addAll([
          '/',
          '/index.html',
          '/main.css',
          '/main.js',
          '/image.jpg'
        ])
      });
  );
});
```

3. 自定义请求响应

任何被Service Worker控制的资源被请求时，都会触发fetch事件，这些资源包括了指定的scope内的html文档，和这些html文档内引用的其他任何资源。
实现思路: Serivice Worker代理服务，给Service Woker添加一个fetch的事件监听器，接着调用event上的`respondWith()`方法来劫持HTTP响应，然后来更新他们。

```
this.addEventListener('fetch', function(event) {
   event.respondWith(
      caches.match(event.request).then(function(response) {
          // 来来来，代理可以搞一些代理的事情

          // 如果Service Worker有自己的返回，就直接返回，减少一次http请求
          if(response){
            return response;
          }

          // 如果service worker没有返回，那就得直接请求真实远程服务
          var request = event.request.clone(); //把原始请求拷过来
          return fetch(request).then(function(httpRes) {
            // http请求的返回已被抓到，可以处置

            // 请求失败了，直接返回失败的结果就好
            if(!httpRes ||  httpRes.status !== 200){
              return httpRes;
            }

            // 请求成功的话，将请求缓存起来
            var responseClone = httpRes.clone();
            cache.open('my-test-cache-v1').then(function (cache){
              cache.put(event.request, responseClone);
            });

            return httpRes;
          });

      })
   );
});
```

4. Service Worker版本更新

 - 自动更新所有页面
```
// 安装阶段跳过等待，直接进入active
self.addEventListener('install', function(event) {
  event.waitUntil(self.skipWaiting());
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
      Promise.all([
        // 更新客户端
        self.clients.claim(),

        // 清理旧版本
        caches.keys().then(function(cacheList) {
            return Promise.all(
                cacheList.map(function(cacheName) {
                    if(cacheName ！== 'my-test-cache-v1'){
                      return caches.delete(cacheName)；
                    }
                })
            );
        })

      ])
  );
});
```
 - 手动更新Service Worker

在页面中可以手动借助`Registration.update()`更新。

```
var version = '1.0.1';
navigator.serviceWorker.register('/sw.js').then(function(reg) {
  if(localStorage.getItem('sw_version') !== version){
    reg.update().then(function() {
      localStorage.setItem('sw_version', version)
    });
  }
});
```
 - debug时更新

 Service Worker被载入后立即激活可以保证每次`/sw.js`为最新。
 ```
 self.addEventListener('install', function(){
   self.skipWaiting();
 });
 ```
 - 意外惊喜

Service Worker的特殊之处除了由浏览器触发更新之外，还应用了特殊的缓存策略：如果该文件已24小时没有更新，当update触发时会强制更新。意外着最坏情况下Service Worker会每天更新一次。

ServiceWorker如何更新？
 * 浏览器每天至少更新一次ServiceWorker
 * 注册新的Service Worker,带上版本号，如: /sw.js?t=201709091920
 * 手动更新resistration.update()
 * 逐字节对比新的sw文件和旧的sw，有区别才更新

```
// index.html
navigator.serviceWoker.addEventListener('message', function(e){
  if(e.data === 'sw.update'){
    //提醒用户刷新
  }
  });

// sw.js
self.clients.matchAll().then(function(clients){
  if(clients && clients.length){
    clients.forEach(function(client){
      client.postMessage('sw.update');
      })
  }
  })
```

PWA SEO可以服务器端渲染Server Side Rendering(SSR).
SSR中如何正确使用Service Worker

![](/images/ssr.jpg)




## 参考
1. [LAVAS百度](https://lavas.baidu.com/)
2. [个人分享PWA简介](/works/PWA.pdf)
3. [QCon2018-《Lavas：PWA的探索与最佳实践》-彭星](https://static001.geekbang.org/con/28/pdf/2706484488/file/QCon2018-%E3%80%8ALavas%EF%BC%9APWA%E7%9A%84%E6%8E%A2%E7%B4%A2%E4%B8%8E%E6%9C%80%E4%BD%B3%E5%AE%9E%E8%B7%B5%E3%80%8B-%E5%BD%AD%E6%98%9F.pdf)
