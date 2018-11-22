---
layout: post
title: RServe安装配置
categories: 技术
tags:
  - R


# RServe高级配置

##　1.RServe服务器启动

1） 在程序中，启动RServe服务器
```
> library(Rserve)
> Rserve()
```

2) 在命令行，启动RServe服务器
```
~ R CMD Rserve --help

Usage: R CMD Rserve [<options>]

Options: --help  this help screen
 --version  prints Rserve version (also passed to R)
 --RS-port <port>  listen on the specified TCP port
 --RS-socket <socket>  use specified local (unix) socket instead of TCP/IP.
 --RS-workdir <path>  use specified working directory root for connections.
 --RS-encoding <enc>  set default server string encoding to <enc>.
 --RS-conf <file>  load additional config file.
 --RS-settings  dumps current settings of the Rserve
 --RS-source <file>  source the specified file on startup.
 --RS-enable-control  enable control commands
 --RS-enable-remote  enable remote connections
 --RS-pidfile <file>  store the pid of the Rserve process in <file>
 --RS-set <config>=<value>   set configuration option as if it was
                             read from a configuration file

All other options are passed to the R engine.
```

```

~ R CMD Rserve --RS-enable-remote
```

## 查看Rserve进程
```
~ ps -aux|grep Rserve
conan    27639  0.0  1.2 116288 25236 ?        Ss   20:41   0:00 /usr/lib/R/bin/Rserve --RS-enable-remote

~ netstat -nltp|grep Rserve
tcp        0      0 0.0.0.0:6311            0.0.0.0:*               LISTEN      27639/Rserve
```

## 2. Rserve配置

通过配置文件，管理Rserve服务器。

Rserv.conf: 配置文件
source.R:初始化脚步文件
查看当前的Rserve 服务器的默认配置信息

```
~ R CMD Rserve --RS-settings
Rserve v1.7-1

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

修改默认配置，新建文件：/etc/Rserv.conf
```
~ sudo vi /etc/Rserv.conf


  workdir /tmp/Rserv
  remote enable
  fileio enable
  interactive yes
  port 6311
  maxinbuf 262144
  encoding utf8
  control enable
  source /home/jiaxf/R/RServe/source.R
  eval xx=1

  ~ vi /home/jiaxf/R/RServe/source.R

    cat("This is my Rserve!!")
    print(paste("Server start at",Sys.time()))

```

source选项，用来配置Rserve服务器启动时加载的文件，例如：初始化系统变量，初始化系统函数等。

eval选项，直接定义环境变量。

##　4. Rserve高级使用：用户登陆认证

增加用户登陆认证，修改文件：/etc/Rserv.conf
```
~ sudo vi /etc/Rserv.conf

workdir /tmp/Rserv
remote enable
fileio enable
interactive yes
port 6311
maxinbuf 262144
encoding utf8
control enable
source /home/jiaxf/R/RServe/source.R
eval xx=1
auth required
plaintext enable
```

用RSclient登陆

```
> library(RSclient)
> conn<-RS.connect()
> RS.login(conn,"jiaxf","jiaxf",authkey=RS.authkey(conn))
[1] TRUE
```
