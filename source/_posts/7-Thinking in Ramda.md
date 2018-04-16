---
layout: post
title: Thinking in Ramda 7
categories: 技术
tags:
  - functional
  - javascript
  - ramda
abbrlink: 52496
---
# Thinking in Ramda: Immutability and Arrays

## Reading Array Elements

Ramda functions for reading array elements `nth` and  `slice` and `contains`

```
const numbers = [10,20,30,40,50,60]
nth(3, numbers)  // => 40 (0-based indexing)
nth(-2, numbers) // =>50 (negative numbers start from the right)
slice(2, 5, numbers) // => [30,40, 50] (see below)
contains(20, numbers) // => true

```

 `nth(0)`  equals `head`, `nth(-1)` equals `last`.

 It also provides functions for accesing all-but-the-first element `tail`,all-but-the-last element `init`,the first N elements `take(N)`, and the last N elments `takeLast(N)`.
<!-- more -->
## Adding, Updating, and Removing Array Elements

  - `insert`
  - `update`
  - `append`
  - `prepend`
  - `update`
  - `concat`
  - `concatAfter = flip(concat)`

## Transforming Elements

 - `update`
 - `adjust`
 - `evolve`

---

**Cite From [« Thinking in Ramda: Immutability and Arrays »](http://randycoulman.com/blog/2016/07/05/thinking-in-ramda-immutability-and-arrays/)**
