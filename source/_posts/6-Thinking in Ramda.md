---
layout: post
title: Thinking in Ramda 6
categories: 技术
tags:
  - functional
  - javascript
  - ramda
abbrlink: 3537
---
# Thinking in Ramda: Immutability and Objects

## Reading Object Properties

We can make the functions more declarative using `equals` and `gte`.

##  Prop

Fortunately, Ramda can help us out.It provides the `prop` function for accesing properties of an object.

## Pick

Where `prop` reads a single property from an object and returns the value, `p ick` reads multiple properties from an object and returns a new object with just those properties.
<!-- more -->
# HAS

If we just want to know if an object has a property without reading the value,we can use `has` for checking own properties,and `hasIn` for checking up the prototype chain: `has('name', person)`.

# PATH

Where prop reads a property from an object, path dives into nested objects. For example, we could access the zip code from a deeper structure as path(['address', 'zipCode'], person).

Note that path is more forgiving than prop. path will return undefined if anything along the path (including the original argument) is null or undefined whereas prop will raise an error.

## propOr / pathOr

`propOr` and `pathOr` are similar to `prop` and `path` combined with `defaultTo`. They let you provide a default value to use if the property or path cannot be found in the target object.

For example, we can provide a placeholder when we don’t know a person’s name: `propOr('<Unnamed>', 'name', person)`. Note that unlike `prop`, `propOr` will not raise an error if `person` is `null` or `undefined`; it will instead return the default value.

## keys / values

`keys` returns an array containing the names of all of the own properties in an object. `values` returns the values of those properties. These functions can be useful when combined with the collection iteration functions we learned about in Part 1.

# merging Object

Sometimes, you’ll want to merge two objects together. A common case is when you have a function that takes named options and you want to combine those options with a set of default options. Ramda provides `merge` for this purpose.

```
function f(a,b,options = {}) {
  const defaultOptions = {value:42, local:true}
  const finalOptions = merge(defaultOptions, options)
}
```

`merge` returns a new object containing all of the properties and values from both objects. If both objects have the same property, the value from the second argument is used.

## Conclusion

This has given us a nice set  of tools for working with objects in a declarative and immutable way.We can now read, add, update, delete, and transform properties in objects without changing the original objects. And we can do these things in a way that works when combining functions.

---

**Cite From [« Thinking in Ramda: Immutability and Objects »](http://randycoulman.com/blog/2016/06/28/thinking-in-ramda-immutability-and-objects/)**
