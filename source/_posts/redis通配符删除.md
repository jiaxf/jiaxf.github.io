---
layout: post
title: redis通配符删除
tags:
  - 技术
  - redis
  - 缓存
abbrlink: 9768
date: 2018-05-24 15:14:45
---

# redis通配符删除

## 批量删除Key
Redis 中有删除单个 Key 的指令 DEL，但好像没有批量删除 Key 的指令，不过我们可以借助 Linux 的 xargs 指令来完成这个动作

```
redis-cli keys "*" | xargs redis-cli del
```

```
//如果要指定 Redis 数据库访问密码，使用下面的命令
redis-cli -a password keys "*" | xargs redis-cli -a password del  

//下面的命令指定数据序号为0，即默认数据库  
redis-cli -n 0 keys "*" | xargs redis-cli -n 0 del  
```

```
//批量删除redis 数据库中redis key的方法如下：
bin/redis-cli  –h <your_redis_server_IP>
                -p  6379  -n  <your database ID>
                -a  <your_auth_keys>  keys  "mykeys*"  |  xargs bin/redis-cli -n <your database ID> del
```

```
//删除所有Key，可以使用Redis的flushdb和flushall命令
//删除当前数据库中的所有Key  
flushdb  
//删除所有数据库中的key  
flushall  
```
