---
layout: post
title: Thinking in Ramda 8
categories: 技术
tags:
  - functional
  - javascript
  - ramda
abbrlink: 51536
---

# Thinking in Ramda: Lenses

Ramda provides a more general tool for performing the operations such as read, update, and transform object properties and array elements in a declarative, immutable way, the lens.

## What is a Lens?

A lens combines a “getter” function and a “setter” function into a single unit. Ramda provides a set of functions for working with lenses.

We can think of a lens as something that focuses on a specific part of a larger data structure.

## How Do I Create a Lens?

The most generic way to create a lens in Ramda is with the lens function. lens takes a getter function and a setter function and returns the new lens.

```
const person = {
  name: 'Randy',
  socialMedia:{
    github: 'randycoulamn',
    twitter: '@randycoulman'
  }
}

const nameLens = lens(prop('name'), assoc('name'))
const twitterLens = lens(
    path(['socialMedia', 'twitter']),
    assocPath(['socialMedia', 'twitter'])
)
```
<!-- more -->
Here we’re using prop and path as our getter functions and `assoc` and `assocPath` as our setter functions.

Note that we had to duplicate the property and path arguments to these functions. Fortunately， Ramda provides nice shortcuts for the most common uses of lenses：
`lensProp`，`lensPath`, and `lensIndex`.

  - `lensProp` creates a lens that focuses on a property of an object.
  - `lensPath` creates a lens that focuses on a nested property of an object.
  - `lensIndex` creates a lens that focuses on an element of an array.

We could rewrite our lenses above with `lensProp` and `lensPath`:

```
const nameLens = lensProp('name')
const twitterLens = lensPath(['socialMedia', 'twitter'])
```

## What Can I Do With It?

Ramda provides three functions for working with lenses.

  - `view` reads the value of the lens.
  - `set` updates the value of the lens.
  - `over` applies a transformation funtion to the lens.

```
view(nameLens, person)  // =>'Randy'
set(twitterLens, '@randy', person)
//=>{
//  name: 'Randy',
//  socialMedia: {
//    github: 'randycoulman',
//    twitter: '@randy'
//  }
//}

over(nameLens, toUpper, person)
// => {
//  name: 'RANDY',
//  socialMedia: {
//    github: 'randycoulman',
//    twitter: '@randycoulman'
//  }
//}
```

## Conclusion

Lenses can be handy if we have a somewhat complex data structure that we want to abstract away from calling code.Rather than exposing the structure or providing a getter, setter, and transformer for every accessible property,we can instead expose lenses.

Client code can the work with our data structure using `view`, `set`, and `over` without being coupled to the exact shape of the structrue.

---
*Cite From [« Thinking in Ramda: Lenses »](http://randycoulman.com/blog/2016/07/12/thinking-in-ramda-lenses/)*
