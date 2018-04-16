---
layout: post
title: Redis学习记录
categories: 技术
tags:
  - redis
  - 缓存
abbrlink: 37496
---

# Redis学习记录

业界常用的一些 key-value分布式缓存系统如下：

 - Redis
 - Memcached
 - Cassandra（Facebook 开源）
 - Tokyo Tyrant (Tokyo Cabinet)

## Redis的几个特点：

- Redis 是一个 key-value 的缓存(cache)和存储(store)系统（适合作缓存或DB）
- 支持丰富的数据结构
    * List 就专门用于存储列表型数据，默认按操作时间排序
    * Sorted Set 可以按分数排序元素，分数是一种广义概念，可以是时间或评分
    * 其丰富的数据结构为日后扩展提供了很大的方便。
- 提供的所有操作都是原子操作，为并发天然保驾护航。
- 超快的性能，见其官方性能测试《[How fast is Redis?](https://redis.io/topics/benchmarks)》。
- 拥有比较成熟的Java客户端 - Jedis，像新浪微博都是使用它作为客户端。（官方推荐的Clients）

<!-- more -->
```
  # 查看redis的连接数
  sudo netstat -antp | grep 6379 | wc -l
```

> 注意：`redis`关闭集群链接时异常导致连接泄漏

```
    redis.max.idle.num=32768
    redis.min.idle.num=30
    redis.pool.behaviour=LIFO
    redis.time.between.eviction.runs.seconds=1
    redis.num.tests.per.eviction.run=10
    redis.min.evictable.idle.time.minutes=5
    redis.max.evictable.idle.time.minutes=30
```

LIFO“后进先出”栈方式 有效地利用了空闲队列里的热点池对象资源，随着流量的下降会使一些池对象长时间未被使用而空闲着，最终它们将被淘汰驱逐；

而 FIFO“先进先出”队列方式 虽然使空闲队列里所有池对象都能在一段时间里被使用，看起来它好像分散了资源的请求，但其实这不利于资源的释放。
而这也是“客户端连接数一直降不下来”的根源之一。

**结论： 1. 对象池的空闲队列行为（采用LIFO“后进先出”栈方式）**

**2. 注意关闭集群链接时异常导致连接泄漏**
