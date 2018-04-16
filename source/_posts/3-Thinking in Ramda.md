---
layout: post
title: Thinking in Ramda 3
categories: 技术
tags:
  - functional
  - javascript
  - ramda
abbrlink: 3601
---
# Thinking in Ramda: Partial Application

## Higher-Order Functions

Functions that take or return other functions are known as “higher-order functions”.

```
//  Full function version:
function publishedInYear(year) {
  return function(book){
    return book.year === year
  }
}

// Arrow function version:
const publishedInYear = year => book => book.year === year
const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(year), books)

  return map(book => book.title, selected)
}
```
<!-- more -->
## Partially-Applying functions

We could rewrite any multi-argument function this way if we wanted to, but we don’t own all of the functions we might want to use. Also, we might want to use some multi-argument functions in the usual way.

Ramda provides two functions to help us out: `partial`, and `partialRight`.

These two functions let us call any function with fewer arguments than it needs. They both return a new function that takes the missing arguments and then calls the original function once all of the arguments have been supplied.

The difference between `partial` and `partialRight` is whether the arguments we supply are the left-most or right-most arguments needed by the original function.

Note that the arguments we supply to `partial` and `partialRight` must always be in an array, even if there’s only one of them.

```
const publishedInYear = (book, year) => book.year === year

const titlesForYear = (books, year) => {
  const selected = filter(partialRight(publishedInYear, [year]), books)

  return map(book => book.title, selected)
}
```

## Curry

Currying is another core concept in functional programming. Technically, a curried function is always a series of single-argument functions, which is what I was just complaining about. In pure functional languages, the syntax generally makes that look no different than calling a function with multiple arguments.

> 柯里化是把接受多个参数的函数变换成接受一个单一参数（最初函数的第一个参数）的函数，并且返回接受余下的参数而且返回结果的新函数的技术。“如果固定某些参数，将会得到余下参数的一个函数”。

> 函数柯里化的对偶是Uncurrying,一种是使用匿名单参数函数来实现多参数函数的方法。

```
var foo = function(a){
  return function(b){
    return a*a + b*b;
  }
}

(foo(3))(4) or foo(3)(4)
```
> 惰性求值（Lazy Evaluation），又称惰性计算、懒惰求值，也称为传需求调用（call-by-need）。它的目的是要最小化计算机要做的工作。除可以得到性能的提升外，惰性计算的最重要的好处是它可以构造一个无限的数据类型或可计算的无限列表而没有妨碍计算的无限循环或大小问题。
> 惰性求值的相反是及早求值，这是一个大多少编程语言所拥有的普通计算方式。

> λ演算是一套用于研究函数定义、函数应用和递归的形式系统。这种演算可以用来清晰地定义什么是一个可计算函数。Lambda演算可以被称为最小的通用程序设计语言，它包括一条变换规则（变量替换）和一条函数定义方式，Lambda演算置通用在于，任何一个可计算函数都能用这种形式来表达和求值。因此，它是等价于图灵机的。
> 在lambda表达式的集合定义一个等价关系（== 标注），“两个表达式其实表示的是同一个函数”这样的直觉性判断即由此表述，这种等级关系是通过所谓的“alpha-变换规则”和"beta-归约规则"。

In Ramda, a curried function can be called with only a subset of its arguments, and it will return a new function that accepts the remaining arguments. If you call a curried function with all of its arguments, it will call just call the function.

You can think of a curried function as the best of both worlds: you can call it normally with all of its arguments and it will just work. Or you can call it with a subset of its arguments, and it will act as if you’d used `partial`.

Note that this flexibility introduces a small performance hit, because `curry` needs to figure out how the function was called and then determine what to do. In general, I only curry functions when I find I need to use `partial` in more than one place.

```
const publishedInYear = curry((year, book) => book.year === year)

const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(year), books)
  return map(book => book.title, selected)
}
```

## Argument Order

Notice that to make curry work for us, we had to reverse the argument order. This is extremely common with functional programming, so almost every Ramda function is written so that the data to be operated on comes last.

# Arguments In The Wrong order

###　Filp

The first option is `flip`. flip takes a function of 2 or more arguments and returns a new function that takes the same arguments, but switches the order of the first two arguments. It is mostly used with two argument functions, but is more general than that.

```
const publishedInYear = curry((book, year) => book.year === year)

const titlesForYear = (books, year) => {
  const selected = filter(flip(publishedInYear)(year), books)

  return map(book => book.title, selected)
}
```
In most cases, I’d prefer to use the more convenient argument order, but if you need to use a function you don’t control, `flip` is a helpful option.

### Placeholder

The more general option is the “placeholder” argument (__).

What if we have a curried function of three arguments, and we want to supply the first and last arguments, leaving the middle one for later? We can use the placeholder for the middle argument:

```
const threeArgs = curry((a,b,c) => { /* ... */})

const middleArgumentLater = threeArgs('value for a', __, 'value fro c')

const middleAargumentOnly = threeArgs(__, 'value for b', __)
```

```
const publishedInYear = curry ((book, year) => book.year === year)

const titlesForYear = (books, year) => {
  const selected = filter(publishedInYear(__, year), books)
  return map(book => book.title, selected)
}
```

Note that __ only works for curried functions, while partial, partialRight, and flip all work on any function. If you need to use __ with a normal function, you can always wrap it with a call to curry first.

```
const publishedInYear = curry((year, book) => book.year === year)

const titlesForYear = curry((year, books) =>
  pipe(
      filter(publishedInYear(year)),
      map(book => book.title)
  )(books)
)
```
***

  *Cite From [« Thinking in Ramda: Partial Application »](http://randycoulman.com/blog/2016/06/07/thinking-in-ramda-partial-application/)*
