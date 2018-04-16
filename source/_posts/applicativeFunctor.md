---
layout: post
title: 函数式编程入门（2）
categories: 技术
tags:
  - javascript
  - js
  - 函数式编程
abbrlink: 36614
---

# Applicative functor

应用applicative functor作为一个接口可以让不通funcotr可以相互应用（apply）的能力。

## 协调与激励

```
// Http.get :: String -> Task Error HTML
var renderPage = curry(function(destinations, event) {
    /* render page */
});

Task.of(renderPage).ap(Http.get('/destinations')).ap(Http.get('/events'))
// Task("<div>some page with dest and events</div>")
```

两个请求将会同时立即执行，当两者的响应都返回之后，renderPage 就会被调用。这与 monad 版本的那种必须等待前一个任务完成才能继续执行后面的操作完全不同。本来我们就无需根据目的地来获取事件，因此也就不需要依赖顺序执行。

再次强调，因为我们是使用局部调用的函数来达成上述结果的，所以必须要保证 renderpage 是 curry 函数，否则它就不会一直等到两个 Task 都完成。而且如果你碰巧自己做过类似的事，那你一定会感激 applicative functor 这个异常简洁的接口的。这就是那种能够让我们离“奇点”（singularity）更近一步的优美代码。

```
// 帮助函数：
// ===================
// $ :: String -> IO DOM
var $ = function(selector) {
  return new IO(function() {
    return document.querySelector(selector)
  });
}

// getVal :: String -> IO String
var getVal = compose(map(_.prop('value')), $);

// Exapmle
// ===================
// signIn :: String -> String -> Bool -> User
var signIn = curry(function(username, password, remember_me)) {/* singing in */}

IO.of(signIn).ap(getVal('#email')).ap(getVal('#password')).ap(IO.of(false));
```

`signIn` 是一个接收 3 个参数的 curry 函数，因此我们需要调用 `ap` 3 次。在每一次的 `ap` 调用中，`signIn` 就收到一个参数然后运行，直到所有的参数都传进来，它也就执行完毕了。我们可以继续扩展这种模式，处理任意多的参数。另外，左边两个参数在使用 getVal 调用后自然而然地成为了一个 `IO`，但是最右边的那个却需要手动 `lift`，然后变成一个 `IO`，这是因为 `ap` 需要调用者及其参数都属于同一类型。

## lift

我们来试试以一种 pointfree 的方式调用 applicative functor。因为 `map` 等价于 `of/ap`，那么我们就可以定义无数个能够 `ap` 通用函数。

```
var liftA2 = curry(function(f, functor1, functor2) {
    return functor1.map(f).ap(functor2);
});

var liftA3 = curry(function(f, functor1, functor2, functor3) {
    return functor1.map(f).ap(functor2).ap(functor3);
})
// liftA4, etc
```

## 操作符
在haskell、scala、PureScript以及swift等语言中，开发者可以创建自定义的中缀操作符(infix operators)

```
-- haskell
add <$> Right 2 <*> Right 3
```

```JavaScript
map(add, Right(2)).ap(Right(3))
```

`<$>` 就是`map`（亦即`fmap`）， `<*>`就是`ap`。

## 衍生函数（derived function）

`of/ap` 等价于`map`。

```
// 从of/ap衍生出的map
X.prototype.map = function(f) {
  return this.constructor.of(f).ap(this);
}
```

如果已经有`chain`函数，可以免费得到functor 和 applicative：

```
// 从chain 衍生出的map
X.prototype.map = function() {
  var m = this;
  return m.chain(function(a) {
      return m.constructor.of(f(a));
  });
}

// 从 chain/map 衍生出的ap
X.prototype.ap = function(other) {
  return this.chain(function(f) {
    return other.map(f);
  });
}
```

## 定律

applicative functor 是“组合关闭”（closed under composition）的，意味着 `ap` 永远不会改变容器类型。

###　同一律
```
// 同一律
A.of(id).ap(v) == v
```

###  同态
```
//同态
A.of(f).ap(A.of(x)) == A.of(f(x))
```

同态就是一个能够保持接结构的映射（structure preserving map).实际上，funcotr就是一个再不通范畴间的同态，因为funcotr在经过映射之后保持了原始范畴的结构。

### 互换（interchange）

互换（interchange）表明的是选择让函数再`ap`的左边还是右边发生lift是无关紧要的。

```
// 互换
v.ap(A.of(x)) == A.of(function(f) { return f(x)}).ap(v)
```

```
var v = Task.of(_.reverse);
var x = 'Sparklehorse';

v.ap(Task.of(x)) == Task.of(function(f) { return f(x)}).ap(v)

```

### 组合（composition)

组合不过是在检查标准的函数组合是否适用于容器内部的函数调用。

```
// 组合
A.of(compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w));
```

```
var u = IO.of(_.toUpper);
var v = IO.of(_.concat("& beyond"));
var w = IO.of("lood bath");

IO.of(_compose).ap(u).ap(v).ap(w) == u.ap(v.ap(w))
```

## 总结

函数式嗯编程
