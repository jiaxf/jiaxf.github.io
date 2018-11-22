---
layout: post
title: RServe安装配置
categories: 技术
tags:
  - R
abbrlink: 60272
---

# RServe安装配置

1. Rserve的安装与配置
Rserve主要是提供远程连接的服务，当然功能是很多的，具体可参考：https://rforge.net/Rserve/

在安装Rserve之前确保R能够正常运行，并正确配置了R的环境变量。 建议安装R 3.2.5 以上的R版本。

## 运行R，安装Rserve包
```
~ sudo R
> install.packages("Rserve")
```

## 查看Rserve配置
```
~ R CMD Rserve --RS-settings
Rserve v1.7-3

config file: /etc/Rserv.conf
working root: /tmp/Rserv
port: 6311
local socket: [none, TCP/IP used]
authorization required: no
plain text password: not allowed
passwords file: [none]
allow I/O: yes
allow remote access: no
control commands: no
interactive: yes
max.input buffer size: 262144 kB
```

    config file: 本地无此文件/etc/Rserv.conf
    working root: R运行时工作目录 /tmp/Rserv
    port: 端口6311
    local socket: TCP/IP协议
    authorization: 认证未开启
    plain text password: 不允许明文密码
    passwords file: 密码文件，未指定
    allow I/O: 允许IO操作
    allow remote access: 远程访问未开启
    control commands: 命令控制未开启
    interactive: 允许通信
    max.input buffer size: 文件上传限制262mb

## 创建配置文件
```
~ sudo vi /etc/Rserv.conf
```

    workdir /tmp/Rserv
    remote enable
    fileio enable
    auth required
    plaintext enable
    fileio enable
    interactive yes
    port 6311
    maxinbuf 262144
    encoding utf8
    control enable

## 开启远程访问权限后配置信息

```
~ R CMD Rserve --RS-settings
Rserve v1.7-3

config file: /etc/Rserv.conf
working root: /tmp/Rserv
port: 6311
local socket: [none, TCP/IP used]
authorization required: yes
plain text password: allowed
passwords file: [none]
allow I/O: yes
allow remote access: yes
control commands: yes
interactive: yes
max.input buffer size: 262144 kB
```

## 指定配置文件
```
~ R CMD Rserve --RS-conf /etc/Rserv.conf
```

## 启动Rserve远程模式
```
~ R CMD Rserve --RS-enable-remote
```

## 查看启动后Rserve端口
```
~ netstat -nltp|grep Rserve
```

> tcp  0   0 0.0.0.0:6311   0.0.0.0:*   LISTEN  73821/Rserve
> 0.0.0.0:6311 代表不受限的IP访问
