---
layout: post
title: javascript模式
categories: 技术
tags:
  - javascript
  - js
  - pattern
abbrlink: 12137
---
# javascriptPattern
《javascript设计模式与开发实践》学习记录

# 模式
***

## 什么是模式

模式是一个可复用的解决方案，可用于解决软件设计中的常见问题。三大好处：

1. 模式是已验证的解决方案
2. 模式很容易被复用
3. 模式富有表达力

## 优秀的模式
优秀的模式应当可以执行以下操作：

1. 解决特殊问题
2. 没有显而易见的解决方案
3. 描述经过验证的概念
4. 描述一种关系

# 设计模式的类别
<!-- more -->
## 创建型设计模式
专注语处理对象创建机制，以合适给定情况的方式来创建对象。包括：

 - Constructor构造器
 - Factory工厂
 - Abstract抽象
 - Prototype原型
 - Singleton单例
 - Builder生成器

## 结构型设计模式

结构型设计模式与组合对象有关，通常可以用于找出在不同对象之间建立关系的简单方法。这种模式有助于确保系统某一部分改变时，不会影响到整体结构，同时改变后能较好地重组。包括：

 - Decorator装饰者
 - Facade外观
 - Flyweight享元
 - Adapter适配器
 - Proxy代理

## 行为设计模式
专注语改善或简化系统中不同对象之间的通信，包括：

* Iterator迭代器
* Mediator终结者
* Observer观察者
* Visitor访问者
