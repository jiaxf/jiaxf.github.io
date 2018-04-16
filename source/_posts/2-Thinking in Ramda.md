---
layout: post
title: Thinking in Ramda 2
categories: 技术
tags:
  - functional
  - javascript
  - ramda
abbrlink: 52944
---
# Thinking in Ramda: Combining funtions

## Simple Combinations

Once you've gotten used to the idea of passing functions to other functions, you might start to find situations where you want to combine sereral functions together.

Ramda provides several functions for doing simple combinations.

##  Complement

Ramda provides a higher-order-function,`complement`, that takes another function and return a new function that returns `true` when the original function returns a falsy value, and `false` when the original function returns a truthy value.
<!-- more -->

```
const isEven = x => x % 2 === 0
find(complement(isEven), [1,2,3,4]) //--> 1
```

Even better is to give the `complement`ed function its own name so it can be reused:

```
const isEven = x => x % 2 ===0
const isOdd = complement(isEven)

find(isOdd, [1,2,3,4])    // --> 1
```

Note that  `complement` implements the same idea for functions as the `!`(not) operator does for values.

## BOTH/EITHER

`both` takes two other functions and returns a new funtion that returns `true` if both functions return a truthy value when applied to the arguments and  `false` otherwise.

`either` takes two other functions and returns a new function that returns `true` if either function returns a truthy value when applied to the arguments and  `false` otherwise.

Note that `both` implements the same idea for  functions as the `&&`(and) operator does for values, and `either` implements that same idea for functions as the `||`(or) operator does for values.

Ramda also provides  `allPass` and `anyPass` that take an array of any number of functions. As their names suggest, `allPass` works like `both`, and  `anyPass` works like `either`.

## Pipelines

Sometimes we want to apply several functions to some data in a pipeline fashion.For example, we might want to take tow numbers,multiply them together,and one, and square the result.We could write it like this.

```
const multiply = (a,b) => a*b   
const addOne = x => x + 1
const square = x => x * x
const operate = (x, y) => {
  const product = multiply(x,y)
  const incremented = addOne(product)
  const square = square(incremented)

  return squared
}

operate(3, 4) // => ((3*4)+1)^2 ==> (12 +1)^2 ==> 169
```

### Pipe

Ramda provides the `pipe` functions,which takes a list of one or more functions and returns a new function.

The new function takes the same number of arguments as the first function it is given.It then 'pipes' those arguments through each function in the list.It applies
the first function to the arguments, passes its result to the second function and so on. The result of the last function is the result of the `pipe` call.

Note that all of the functions after the first must only take a single argument.

```
const operate = pipe(
  multiply,
  addOne,
  square
)
```

## Compose

`compose` works exactly the same way as `pipe`, except that it applies the functions in right-to-left order instead of left-to-right.

```
const operate = compose(
    square,
    addOne,
    multiply
)
```

I always think of `compose` this way: `compose(f,g)(value)` is equivalent to `f(g(value))`.

As with `pipe`, note that all of the functions except the last must only take a single argument.

***

*Cited From [« Thinking in Ramda: Combining Functions »](http://randycoulman.com/blog/2016/05/31/thinking-in-ramda-combining-functions/)*
