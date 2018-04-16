---
layout: post
title: js错误类型
categories: 技术
tags:
  - javascript
  - js
abbrlink: 62653
date: 2016-11-29 13:51:02
---

# JavaScript原生错误类型

Error对象是最一遍的错误类型,在它基础上,JavaScript还定义了其他6种错误派生对象.

## (1) SyntaxError 解析代码时发生的错误.

```
// 变量名错误
var 1a;

// 缺少括号
console.log 'Hello');
```

## (2) ReferenceError 引用一个不存在的变量时发生的错误.

```
unknowVariable

// ReferenceError: unknownVariable is not defined
```
<!-- more -->

## (3) RangeError 当一个值超出有效范围时发生的错误.

```
new Array(-1)

// RangeError: Invalid array length

(1234).toExponential(21)
// RangeError: toExponential() argument must be between 0 and 20
```

## (4) TypeError 变量或参数不是预期类型时发生的错误.比如,对字符串、布尔值、数值等原始类型的值使用new命令,就会抛出这种错误,因为new命令的参数应该是一个构造函数.

```
new 123
// TypeError: number is not a func

var obj = {};
obj.unknownMethod()
// TypeError: obj.unknownMethod is not a function
```

## (5) URIError URI相关函数的参数不正确时抛出的错误,主要涉及encodeURI()、 decodeURI()、encodeURIComponent()、decodeURIComponent()、escape()和unescape()六个函数.

```
decodeURI('%2')
// URIError: URI malformed
```

## (6) EvalError eval函数没有正确执行时,会抛出EvalError错误.

## JavaScript还可以自定义错误类型.

```
function UserError(message) {
    this.message = message || '默认信息';
    this.name = "UserError";
}

UserError.prototype = new Error();
UserError.prototype.constructor = UserError;
```
***

> Written By jiaxf
