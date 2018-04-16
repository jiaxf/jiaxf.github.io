---
layout: post
title: 函数式编程入门
categories: 技术
tags:
  - javascript
  - js
  - 函数式编程
abbrlink: 53649
---

## curring

A curried function is one where multiple arguments are descirbed by a series of one
argument funtions.For example, curried addition would be :

    记录传入的参数，在需要的时候求值。

```
var curry = require('curry')
var add = curry(function(a, b){ return a + b})
var add100 = add(100)
add100(1) // =101
```

Curry allows you can aslo call a function with multiple arguments at once:

```
var sum3 = curry(function(a, b, c) { return a + b + c})
sum3(1,2,3) // =6
sum3(1)(2,3) // =6
sum3(1,2)(3) // =6
```
<!-- more -->
## what advantage to use curry?

If you're not used to languages in whice curried functions are part of daily life,
it's probably not obvious what advantage this gives us. To my mind,the two main ones
are:

 - Little pieces can be configured and reused with ease, without clutter;
 - Functions are used throughout.

## The little pieces

Take an obvious example;mapping over a collection to get the ids of its members:

```
var objects = [{id:1}, {id:2}, {id:3}]
objects.map(function(o){ return o.id})
```

>MAP over OBJECTS to getIDS

There's a lot of implementation cruft in just that line;in the form of the function
definition.Let's clean that up:

```
var get = curry(function(property, object) {return object[property]})
objects.map(get('id')) // =[1,2,3]
```

Now we're talking in terms of the real logic of the operation - map over these objects,
getting their ids.BAM. What we'v really created in the get function is a function
that can be partially configured.

What if we want to re-use the 'get ids from a list of objects' functionality, though?
Let's do it the naive way:

```
var getIDs = function(objects) {
  return objects.map(get('id'))
}

getIDs(objects) // =[1,2,3]
```

```
var map = curry(function(fn, value) { return value.map(fn)})
var getIDs = map(get('id'))

getIDs(objects) // =[1,2,3]
```

## Functions through and throughout

Another avantage of this approach is that it encourages the creation of functions;
rather than of methods. While methods are beautiful things - allowing polymorphism,
and very readable code - they aren't always the tool for the job, such as in heavlily
async code.

`Data`
```
{
    "user": "hughfdjackson",
    "posts": [
        { "title": "why curry?", "contents": "..." },
        { "title": "prototypes: the short(est possible) story", "contents": "..." }
    ]
}
```

Your task is to get the titles for each of this users posts.

```
fetchFromServer()
  .then(JSON.parse)
  .then(function(data){ return data.posts})
  .then(function(posts) {
      return posts.map(function(post){return post.title})
  })
```

Since chains of promises(or, if you prefer, callbacks) fundamentally work with
functions,you can't easilly just map over an value when one is available from
the server without first wrapping it up in all that visual(and mental) clutter.

Let's go again, this time using the tools we've already defined:

```
fetchFromSever()
  .then(JSON.parse)
  .then(get('posts'))
  .then(map(get('title')))
```

This is lean logic, easily expressed; something we couldn't achieve nearly so
easily without curried functions.

## tl;dr (Too Long;Don't Read)

curry gives you a tantalising amount of expressive power.

`node/npm`
```
npm install curry
```
