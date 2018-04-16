---
layout: post
title: 函数式编程入门
categories: 技术
tags:
  - javascript
  - js
  - 函数式编程
abbrlink: 53647
---

# Functional programs

## PURE FUNCTIONS

    Pure functions are functions that have no side-effects.They don't assign to any outside variables, they don't consume input, they don't produce output, they don't read from or writ to a database, they don't modify the parameters they're passed, etc.

    The basic idea is that, if you call a function with the same inputs over and over again, you alwyas get the same result.

    You can certainly do things with impure functions(and you must, if your program is going to do amything interesting), but for the most part you'll want to keep most of your funtions pure.
<!-- more -->
## IMMUTABILITY

    "Immutable" mean "unchangeable".

    Immutability goes hand-in-hand with pure functions. Since pure functions aren't allowed to have side-effects, they aren't allowed
    to change outside data structures.They are forced to work with data in an immutable way.

###  Replace loops with collection-iteration functions

（1）FOREACH

```
// replace this:
for(const value of myArray){
  console.log(value);
}
// with:
forEach(value => console.log(value), myArray);
```

(2) MAP

    Like `forEach`, `map` applies a function to each element of an array.However, unlike `forEach`, map collects the results of aaplying the function into a new array and returns it.

```
map(x => x * 2, [1,2,3]) // -->[2,4,6]

// or

const double = x => x * 2;
map(double, [1,2,3])
```

(3) FILTER/REJECT

```
const isEven = x => x%2 ===0
filter(isEven, [1,2,3,4]) // --> [2,4]
```

`filter`
