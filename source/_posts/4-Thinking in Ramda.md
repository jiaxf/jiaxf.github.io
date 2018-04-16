---
layout: post
title: Thinking in Ramda 4
categories: 技术
tags:
  - functional
  - javascript
  - ramda
abbrlink: 52304
---
# Thinking in Ramda: Declarative Programming

As we start writing small functional building blocks and combining them, we find that we have to write a lot of functions that wrap JavaScript’s operators such as arithmetic, comparison, logic, and control flow. This can feel tedious, but Ramda has our back.

There are many different ways to divide up the programming language/style landscape. There’s static typing vs dynamic typing, interpreted languages vs compiled languages, low-level vs high-level, etc.

Another such division is imperative programming vs declarative programming.
<!-- more -->
Functional programming is considered a subset of declarative programming. In a functional program, we define functions and then tell the computer what to do by combining these functions.

Even in declarative programs, it is necessary to do similar tasks to those we do in imperative programs. Control flow, arithmetic, comparison, and logic are still the basic building blocks we have to work with. But we need to find a way to express these constructs in a declarative way.

## Declarative Replacements

Since we’re programming in JavaScript, an imperative language, it’s fine to use the standard imperative constructs when writing “normal” JavaScript code.

But when we’re writing functional transformations using pipelines and similar constructs, the imperative constructs don’t play well.

Ramda provides add, subtract, multiply, and divide functions to use in place of the standard arithmetic operators.

## Comparison

Notice that some of our functions are using standard comparison operators (`===` and `>= in this case). As you might suspect by now, Ramda also provides replacements for these.

Let’s modify our code to use `equals` in place of `===` and `gte` in place of `>=`.

Ramda also provides `gt` for `>`, `lt` for `<`, and `lte` for `<=`.

In addition to `equals`, there is `identical` for determining if two values reference the same memory.

There are a couple of common uses of `===`: checking if a string or array is empty (`str === ''` or `arr.length === 0`), and checking if a variable is `null` or `undefined`. Ramda provides handy functions for both cases: `isEmpty` and `isNil`.

## Logic

we used the `both` and `either` functions in place of `&&` and `||` operations. We also talked about `complement` in place of `!`.

But sometimes we need to apply `&&`, `||`, and `!` to disparate values. For those cases, Ramda gives us `and`, `or`, and `not` functions. I think of it this way: `and`, `or`, and `not` work with values, while `both`, `either`, and `complement` work with functions.

`defaultTo` checks if the second argument `isNil`. If it isn’t, it returns that as the value, otherwise it returns the first value.

## Conditionals

 - IfElse

## Constants

Constant functions are quite useful in situations like this. As you might imagine, Ramda provides us a shortcut. In this case, the shortcut is named `always`.

Ramda also provides `T` and `F` as further shortcuts for `always(true)` and `always(false)`.

## Identity

`identity` can take more than one argument, but it always returns its first argument. If we want to return something other than the first argument, there’s the more general `nthArg` function. It’s much less common than `identity`.

## When And Unless

## Cond

***

*Cite From [« Thinking in Ramda: Declarative Programming »](http://randycoulman.com/blog/2016/06/14/thinking-in-ramda-declarative-programming/)*
