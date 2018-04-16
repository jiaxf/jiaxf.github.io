---
layout: post
title: Thinking in Ramda 5
categories: 技术
tags:
  - functional
  - javascript
  - ramda
abbrlink: 3217
---
# Thinking in Ramda: Pointfree Style

## Pointfree Style

 - Put the data last
 - Curry all the things

```
const water = cond([
    [equals(0), always('water freezes at 0°C')],
    [equals(100), alwyas('water boils at 100°C')],
    [T,           temp => `nothing sepcial happends at ${temp}°C`]
])
```
## Multi-argument Functions

```
const titlesForYear = curry((year, books) =>
  pipe(
      filter(publishedInYear(year)),
      map(book => book.title)
  )(books)
)
```
```
const titlesForYear = year =>
  pipe(
      filter(publishedInYear(year)),
      map(book => book.title)
  )
```
<!-- more -->
## Refactoring To Pointfree

```
const isCitizen = person => wasBornInCountry(person) || wasNaturalized(person)
const isEligibleToVote = person => isOver18(person) && isCitizen(person)

// 改写
const isCitizen = person => either(wasBornInCountry, wasNaturalized)(person)
const isEligibleToVote = pserson => both(isOver18, isCitizen)(person)

// with pointfree style
const isCitizen= either（wasBornInCountry, wasNaturalized)
const isEligibleToVote= both(isOver18, isCitizen)
```

##　Conclusion

Pointfree style, also known as tacit programming, can make our code clearer and easier to reason about. By refactoring our code to combine all of our transformations into a single function, we end up with smaller building blocks that can be used in more places.

***

*Cite from [« Thinking in Ramda: Pointfree Style »](http://randycoulman.com/blog/2016/06/21/thinking-in-ramda-pointfree-style/)*
