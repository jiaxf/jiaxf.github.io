---
layout: post
title: 高性能web平台OpenResty
tags:
  - 技术
  - 服务器
abbrlink: 7559
---

# 高性能web平台OpenResty

## OpenResty®

OpenResty® 是一个基于 Nginx 与 Lua 的高性能 Web 平台，其内部集成了大量精良的 Lua 库、第三方模块以及大多数的依赖项。用于方便地搭建能够处理超高并发、扩展性极高的动态 Web 应用、Web 服务和动态网关。

OpenResty® 通过汇聚各种设计精良的 Nginx 模块（主要由 OpenResty 团队自主开发），从而将 Nginx 有效地变成一个强大的通用 Web 应用平台。这样，Web 开发人员和系统工程师可以使用 Lua 脚本语言调动 Nginx 支持的各种 C 以及 Lua 模块，快速构造出足以胜任 10K 乃至 1000K 以上单机并发连接的高性能 Web 应用系统。

OpenResty® 的目标是让你的Web服务直接跑在 Nginx 服务内部，充分利用 Nginx 的非阻塞 I/O 模型，不仅仅对 HTTP 客户端请求,甚至于对远程后端诸如 MySQL、PostgreSQL、Memcached 以及 Redis 等都进行一致的高性能响应。

OpenResty(又称：ngx_openresty) 是一个基于 NGINX 的可伸缩的 Web 平台，由中国人章亦春发起，提供了很多高质量的第三方模块。
OpenResty 是一个强大的 Web 应用服务器，Web 开发人员可以使用 Lua 脚本语言调动 Nginx 支持的各种 C 以及 Lua 模块,更主要的是在性能方面，OpenResty可以 快速构造出足以胜任 10K 以上并发连接响应的超高性能 Web 应用系统。


## 下载安装

### macOS/Mac OS X
强烈建议 Mac OS X 或者 macOS 系统用户通过 homebrew 包管理器安装 OpenResty，像下面这样：

```
brew tap openresty/brew
brew install openresty
```
如果你之前是从 homebrew/nginx 安装的 OpenResty，请先执行：

```
brew untap homebrew/nginx
```
# Hello World实例

安装成功后，可以使用openresty直接输出html页面。
首先可以创建一个工作目录
```
mkdir /home/www
cd /home/www/
mkdir logs/ conf/
```

其中，logs目录用于存放日志，conf用于存放配置文件。

在conf目录下创建一个nginx.conf文件 代码如下：

```
worker_processes  1;
error_log logs/error.log;
events {
    worker_connections 1024;
}
http {
    server {
        listen 9000;
        location / {
            default_type text/html;
            content_by_lua '
                ngx.say("<p>Hello, World!</p>")
            ';
        }
    }
}
```

## 启动openresty

默认情况下 openresty 安装在 /usr/local/openresty 目录中，启动命令为:
```
cd /home/www
/usr/local/openresty/nginx/sbin/nginx -p `pwd`/ -c conf/nginx.conf
```

如果没有任何输出，说明启动成功，-p 指定我们的项目目录，-c 指定配置文件。

接下来我们可以使用 curl 来测试是否能够正常范围：

`curl http://localhost:9000/`

输出结果为：

`<p>Hello, World!</p>`

OpenResty 的目标是让你的 Web 服务直接跑在 Nginx 服务内部,充分利用 Nginx 的非阻塞 I/O 模型,不仅仅对 HTTP 客户端请求,甚至于对远程后端诸如 MySQL,PostgreSQL,~Memcaches 以及 ~Redis 等都进行一致的高性能响应。
所以对于一些高性能的服务来说，可以直接使用 OpenResty 访问 Mysql或Redis等，而不需要通过第三方语言（PHP、Python、Ruby）等来访问数据库再返回，这大大提高了应用的性能。
