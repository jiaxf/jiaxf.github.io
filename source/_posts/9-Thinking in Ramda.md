---
layout: post
title: Thinking in Ramda 9
categories: 技术
tags:
  - functional
  - javascript
  - ramda
abbrlink: 2449
---
# Thinking in Ramda: Wrap-Up

Ramda has some underlying principles that drive its API:

- Data last: Almost all of the functions take the data parameter as the last parameter.

- Currying: Almost every function in Ramda is “curried”. That is, you can call a function with only a subset of its required arguments, and it will return a new function that takes the remaining arguments. Once all of the arguments are provided, the original function is invoked.
<!-- more -->
# Summary

- Getting started introduces us to the idea of functions, pure functions, and immutablilty. If the gets us started by looking at the collection iteration functions like `map`, `filter`, and `reduce`.
- Combinging Functions shows us that we can combine functions in various ways using tools such as `both`, `either`, `pipe` and `compose`.
- Partial Application help us that it can be useful to only supply some of the arguments to a function, allowing a later function to supply the rest.We use `partial` and `curry` to help us with this and learn about `flip` and the placeholder(`__`).
- Declarative Programming teaches us about the difference between imperative and declarative programming.We learn how to use Ramda's declarative replacements for arithmetic, comparisons,logic and conditionals.
- Pointfree Style introduces us the idea of pointfree style,also known as tacit programming.In pointfree style,we don't actually see the data parameter that we'ar operating on;it's implicit. Our programs are made up of small, simple building blocks that are combined together to do what we need. Only at the end do we apply out compound functions to the actual data.
- Immutability and Objects returns us to the idea of working declaratively, this time giving us the tools we need to read, update, delete, and transform properties of objects.
- Immutability and Arrays continues the theme and shows us how to do the same for arrays.
- Lenses concludes by introducing the concept of a lens, a construct that allows us to focus on a small part of a larger data structure. Using the view, set, and over functions, we can read, update, and transform the focused value in the context of its larger data structure.

---

*Cite from [« Thinking in Ramda: Wrap-Up »](http://randycoulman.com/blog/2016/07/19/thinking-in-ramda-wrap-up/)*
