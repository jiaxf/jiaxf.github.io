---
layout: post
title: Redis数据介绍与指令大全
tags:
  - 技术
  - redis
  - 缓存
abbrlink: 4248
date: 2018-05-24 15:41:56
---

# Redis数据介绍与指令大全

作为 Key-value 型数据库,Redis 也提供了键(Key)和键值(Value)的映射关系。但是,除了常规的数值或字符串,Redis 的键值还可以是以下形式之一:

 - Lists (列表)
 - Sets (集合)
 - Sorted sets (有序集合)
 - Hashes (哈希表)

## 适用场景

 1. 取最新的n个数据，如读取作家博客最新的50篇文章，通过List实现按时间排序的数据的高效获取
 1. 排行榜应用，以特定条件为排序标准，将其设成sorted set 的score，进而实现高效获取
 1. 需要精准设定过期时间的应用，把sorted set 的 score 值设置成过期时间的时间戳,那么就可以简单地通过过期时间排序,定时清除过期数据了
 1. 计数器应用，Redis 的命令都是原子性的,可以轻松地利用 INCR,DECR 命令来构建计数器系统。
 1. 去除大量数据中的重复数据，将数据放入set中，就能实现对重复数据的排除
 1. 构建队列系统使用 list 可以构建队列系统,使用 sorted set 甚至可以构建有优先级的队列系统。
 1. 实时系统,反垃圾系统通过上面说到的 set 功能,你可以知道一个终端用户是否进行了某个操作,可以找到其操作的集合并进行分析统计对比等。
 1. Pub/Sub构建实时消息系统
 1. 缓存

## redis数据类型及操作详解

### 1. strings类型及操作

![](/images/string.png)

### 2. hashes类型及操作

Redis hash 是一个 string 类型的 field 和 value 的映射表，hash 特别适合用于存储对象,相较string,由于使用了zipmap而占用更少的内存

操作方法：

![](/images/hash.png)

### 3. list类型及操作

list 底层实现是一个双向链表，最大长度为2^32,也可用作栈

操作方法：

![](/images/list.png)

### 4. set类型及操作

set 是 string 类型的无序集合。set 元素最大可以包含(2 的 32 次方)个元素。set 的是通过 hash table 实现的，hash table 会随着添加或者删除自动的调整大小。调整 hash table 大小时候需要同步(获取写锁)会阻塞其他读写操作。

操作方法：

![](/images/set.png)

### 5. sorted sets 类型及操作

sorted set 在set的基础上增加了一个标识属性，它可以在set添加或修改元素时指定，每次指定，set会自动按标识调整顺序，set的每一个元素都会关联一个double类型的score。使用时往往我们把要排序的字段作为score存储，对象id则作为元素存储。

操作方法：

![](/images/sortedset.png)

## redis 常用命令

### 1. 键值相关命令

![](/images/clientcmd.png)

### 2. 服务器相关命令

![](/images/servercmd.png)
