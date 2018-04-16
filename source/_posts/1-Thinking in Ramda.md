---
layout: post
title: Thinking in Ramda 1
categories: 技术
tags:
  - functional
  - javascript
  - ramda
abbrlink: 53136
---
# Thinking in Ramda: getting started

## Getting Started

I'll be using the Ramda JavaScript library fro this series,though many of the ideas apply to other JavaScript libraries such as  Underscore and Lodash as well as to other languages.

I'm going to stick to the lighter,less-academic end of functional programing.

## Ramda

I find Ramda to be a nicely designed library that provides a lot of tools for doing functional programming in JavaScript in a clean, elegant way.
<!-- more -->
## Functions


Some languages go further and provide support for functions as first-class constructs. By "first-class", I mean that functions can be used in the same way as other kinds of values.You can:

 - refer to them from constants and variables
 - pass them as parameters to other Functions
 - return them as results from other Functions

JavaScript is one such language, and we'll be taking advantage of that.

## Pure Functions

Pure functions are functions that have no side-effects.They don't assign to any outside variables,they don't consume input, they don't produce output,they don't read from or write to a database,they don't modify the parameters they're passed,etc.

The basic idea is that,if you call a function with the same inputs over and over again,you always get the same result.

You can certainly do things with impure functions(and you must, if you program is going to do anything interesting), but for the most part you'll want to keep most of you functions pure.

## Immutability

What dose that mean? "Immutable" means "unchangeable".

When I'm working in an immutable fashion, once I initialize a value or an object I never change it again.That means no changing elements of an array or properties of an object.

If I need to change something in an array or object,I instead return a new copy of it with the changed value. Later posts will talk about this in great detail.

Immutability goes hand-in-hand with pure functions.Since pure functions aren't allowed to have side-effects, they aren't allowed to change outside data structures.They are forced to work with data in an immutable way.

## FOREACH

Rather than writing an explicit loop,try using the `forEach` function instead.That is:

```
//Replace this
for ( const value of myArray){
  console.log(value)
}
//With
forEach(value => console.log(value), myArray)
```

`forEach` takes a function an d an array, and calls the function on each element of the array.

## MAP

Unlike `forEach`, map collects the results of applying the function into a new array and returns it.

```
map(x => x *2, [1,2,3]) // =>[2,4,6]

const double = x => x * 2
map(double, [1,2,3]) // =>[2,4,6]
```

## FILTER/REJECT

As its name might suggest, `filter` selects elements from an array based on some function.`reject` does exactly the same thing, but in reverse. It keeps the elements for which the function returns a false value and excludes the values for which it returns a truthy value.

```
const isEven = x => x%2 === 0
filter(isEven, [1,23,4]) // ==> [2, 4]

reject(isEven, [1,2,3,4]) // ==> [1,3]
```

## FIND

`find` applies a function to each element of an array and returns the first element for which the function returns a truthy value.

```
find(isEven, [1,2,3,4])  // --> 2
```

## REDUCE

`reduce` takes a two-argument function, and initial value,and the array to operate on.

The first argument to the function we pass in is called the "accumulator" and the second argument is the value from the array.The function needs to return a new accumulator value.

```
const add = (accum, value) => accum + value
reduce(add, 5, [1,2,3,4])  // --> 15
```

# Conclusion

By starting with these collection-iteration functions, you can get used to the idea of passing functions to other functions. You might have used these in other languages without realizing you were doing some functional programming.

***

*Cited From [« Thinking in Ramda: Getting Started »](http://randycoulman.com/blog/2016/05/24/thinking-in-ramda-getting-started/)*
