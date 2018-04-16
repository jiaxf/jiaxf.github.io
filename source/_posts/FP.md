---
layout: post
title: 函数式编程入门
categories: 技术
tags:
  - javascript
  - js
  - 函数式编程
abbrlink: 53648
---



# Function Program

## 几个原则

- DRY（不要重复自己，don't repeat yourself）
- 高内聚低耦合（loose coupling high cohesion）
- YAGNI （你不会用到它的，ya ain't gonna need it）
- 最小意外原则（Principle of least surprise）
- 单一责任（single responsibility）
- 纯函数，尽量减少副作用

> 纯函数是这样一种函数，即相同的输入，永远会得到相同的输出，而且没有任何可观察的副作用。

> *副作用*是在计算结果的过程中，系统状态的一种变化，或者与外部世界进行的*可观察的交互*。
<!-- more -->

几个数学定律应用

```js
// 结合律（assosiative）
add(add(x, y), z) == add(x, add(y, z));

// 交换律（commutative）
add(x, y) == add(y, x);

// 同一律（identity）
add(x, 0) == x;

// 分配律（distributive）
multiply(x, add(y,z)) == add(multiply(x, y), multiply(x, z));
```


## 函数柯里化

curry 的概念很简单：只传递给函数一部分参数来调用它，让它返回一个函数去处理剩下的参数。

```js
var add = function(x) {
  return function(y) {
    return x + y;
  };
};

var increment = add(1);
var addTen = add(10);

increment(2);
// 3

addTen(2);
// 12
```

```js
var curry = require('lodash').curry;

var match = curry(function(what, str) {
  return str.match(what);
});

var replace = curry(function(what, replacement, str) {
  return str.replace(what, replacement);
});

var filter = curry(function(f, ary) {
  return ary.filter(f);
});

var map = curry(function(f, ary) {
  return ary.map(f);
});
```

```js
match(/\s+/g, "hello world");
// [ ' ' ]

match(/\s+/g)("hello world");
// [ ' ' ]

var hasSpaces = match(/\s+/g);
// function(x) { return x.match(/\s+/g) }

hasSpaces("hello world");
// [ ' ' ]

hasSpaces("spaceless");
// null

filter(hasSpaces, ["tori_spelling", "tori amos"]);
// ["tori amos"]

var findSpaces = filter(hasSpaces);
// function(xs) { return xs.filter(function(x) { return x.match(/\s+/g) }) }

findSpaces(["tori_spelling", "tori amos"]);
// ["tori amos"]

var noVowels = replace(/[aeiou]/ig);
// function(replacement, x) { return x.replace(/[aeiou]/ig, replacement) }

var censored = noVowels("*");
// function(x) { return x.replace(/[aeiou]/ig, "*") }

censored("Chocolate Rain");
// 'Ch*c*l*t* R**n'
```

> “预加载”函数的能力，通过传递一到两个参数调用函数，就能得到一个记住了这些参数的新函数。

## 高阶函数

> 高阶函数（higher order function）（高阶函数：参数或返回值为函数的函数）。

## 函数组合

`组合`（compose，以下将称之为组合）：

```js
var compose = function(f,g) {
  return function(x) {
    return f(g(x));
  };
};
```

`f` 和 `g` 都是函数，`x` 是在它们之间通过“管道”传输的值。在 `compose` 的定义中，`g` 将先于 `f` 执行，因此就创建了一个从右到左的数据流。

`组合`将两个函数结合产生一个新函数。组合用法如下：

```js
var toUpperCase = function(x) { return x.toUpperCase(); };
var exclaim = function(x) { return x + '!'; };
var shout = compose(exclaim, toUpperCase);

shout("send in the clowns");
//=> "SEND IN THE CLOWNS!"
```

```js
var head = function(x) { return x[0]; };
var reverse = reduce(function(acc, x){ return [x].concat(acc); }, []);
var last = compose(head, reverse);

last(['jumpkick', 'roundhouse', 'uppercut']);
//=> 'uppercut'
```

```js
// 结合律（associativity）
var associative = compose(f, compose(g, h)) == compose(compose(f, g), h);
// true
```

符合结合律意味着不管你是把 `g` 和 `h` 分到一组，还是把 `f` 和 `g` 分到一组都不重要。所以，如果我们想把字符串变为大写，可以这么写：

```js
compose(toUpperCase, compose(head, reverse));

// 或者
compose(compose(toUpperCase, head), reverse);
```

因为如何为 `compose` 的调用分组不重要，所以结果都是一样的。

结合律的一大好处是任何一个函数分组都可以被拆开来，然后再以它们自己的组合方式打包在一起。让我们来重构重构前面的例子：

```js
var loudLastUpper = compose(exclaim, toUpperCase, head, reverse);

// 或
var last = compose(head, reverse);
var loudLastUpper = compose(exclaim, toUpperCase, last);

// 或
var last = compose(head, reverse);
var angry = compose(exclaim, toUpperCase);
var loudLastUpper = compose(angry, last);

// 更多变种...
```

## pointfree

pointfree 模式指的是，永远不必说出你的数据。函数无须提及将要操作的数据是什么样的。一等公民的函数、柯里化（curry）以及组合协作起来非常有助于实现这种模式。

```js
// 非 pointfree，因为提到了数据：word
var snakeCase = function (word) {
  return word.toLowerCase().replace(/\s+/ig, '_');
};

// pointfree
var snakeCase = compose(replace(/\s+/ig, '_'), toLowerCase);
```

```js
// 非 pointfree，因为提到了数据：name
var initials = function (name) {
  return name.split(' ').map(compose(toUpperCase, head)).join('. ');
};

// pointfree
var initials = compose(join('. '), map(compose(toUpperCase, head)), split(' '));

initials("hunter stockton thompson");
// 'H. S. T'
```

pointfree 模式能够帮助我们减少不必要的命名，让代码保持简洁和通用。对函数式代码来说，pointfree 是非常好的石蕊试验，因为它能告诉我们一个函数是否是接受输入返回输出的小函数。比如，while 循环是不能组合的。不过你也要警惕，pointfree 就像是一把双刃剑，有时候也能混淆视听。并非所有的函数式代码都是 pointfree 的，不过这没关系。可以使用它的时候就使用，不能使用的时候就用普通函数。

组合的一个常见错误是，在没有局部调用之前，就组合类似 map 这样接受两个参数的函数。


```js
// 错误做法：我们传给了 `angry` 一个数组，根本不知道最后传给 `map` 的是什么东西。
var latin = compose(map, angry, reverse);

latin(["frog", "eyes"]);
// error


// 正确做法：每个函数都接受一个实际参数。
var latin = compose(map(angry), reverse);

latin(["frog", "eyes"]);
// ["EYES!", "FROG!"])
```

如果在 debug 组合的时候遇到了困难，那么可以使用下面这个实用的，但是不纯的 `trace` 函数来追踪代码的执行情况。

```js
var trace = curry(function(tag, x){
  console.log(tag, x);
  return x;
});

var dasherize = compose(join('-'), toLower, split(' '), replace(/\s{2,}/ig, ' '));

dasherize('The world is a vampire');
// TypeError: Cannot read property 'apply' of undefined
```

这里报错了，来 `trace` 下：

```js
var dasherize = compose(join('-'), toLower, trace("after split"), split(' '), replace(/\s{2,}/ig, ' '));
// after split [ 'The', 'world', 'is', 'a', 'vampire' ]
```

啊！`toLower` 的参数是一个数组，所以需要先用 `map` 调用一下它。

```js
var dasherize = compose(join('-'), map(toLower), split(' '), replace(/\s{2,}/ig, ' '));

dasherize('The world is a vampire');

// 'the-world-is-a-vampire'
```

`trace` 函数允许我们在某个特定的点观察数据以便 debug。像 haskell 和 purescript 之类的语言出于开发的方便，也都提供了类似的函数。

> However, it does offer a different style of coding, a style that's taken for granted in purely functional programming languages: Ramda makes it simple for you to build complex logic through functional composition. Note that any library with a compose function will allow you do functional composition; the real point here is: "makes it simple".

## 异步任务

回调（callback）是通往地狱的狭窄的螺旋阶梯。使用 Quildreen Motta 的 [Folktale](http://folktalejs.org/) 里的 `Data.Task`

```js
// Node readfile example:
//=======================

var fs = require('fs');

//  readFile :: String -> Task(Error, JSON)
var readFile = function(filename) {
  return new Task(function(reject, result) {
    fs.readFile(filename, 'utf-8', function(err, data) {
      err ? reject(err) : result(data);
    });
  });
};

readFile("metamorphosis").map(split('\n')).map(head);
// Task("One morning, as Gregor Samsa was waking up from anxious dreams, he discovered that
// in bed he had been changed into a monstrous verminous bug.")


// jQuery getJSON example:
//========================

//  getJSON :: String -> {} -> Task(Error, JSON)
var getJSON = curry(function(url, params) {
  return new Task(function(reject, result) {
    $.getJSON(url, params, result).fail(reject);
  });
});

getJSON('/video', {id: 10}).map(_.prop('title'));
// Task("Family Matters ep 15")

// 传入普通的实际值也没问题
Task.of(3).map(function(three){ return three + 1 });
// Task(4)
```

例子中的 `reject` 和 `result` 函数分别是失败和成功的回调。正如你看到的，我们只是简单地调用 `Task` 的 `map` 函数，就能操作将来的值，好像这个值就在那儿似的。到现在 `map` 对你来说应该不稀奇了。

如果熟悉 promise 的话，你该能认出来 `map` 就是 `then`，`Task` 就是一个 promise。如果不熟悉你也不必气馁，反正我们也不会用它，因为它并不纯；但刚才的类比还是成立的。

与 `IO` 类似，`Task` 在我们给它绿灯之前是不会运行的。事实上，正因为它要等我们的命令，`IO` 实际就被纳入到了 `Task` 名下，代表所有的异步操作——`readFile` 和 `getJSON` 并不需要一个额外的 `IO` 容器来变纯。更重要的是，当我们调用它的 `map` 的时候，`Task` 工作的方式与 `IO` 几无差别：都是把对未来的操作的指示放在一个时间胶囊里，就像家务列表（chore chart）那样——真是一种精密的拖延术。

## 一点理论

前面提到，functor 的概念来自于范畴学，并满足一些定律。我们先来探索这些实用的定律。

```js
// identity
map(id) === id;

// composition
compose(map(f), map(g)) === map(compose(f, g));
```

## 总结

我们已经认识了几个不同的 functor，但它们的数量其实是无限的。有一些值得注意的可迭代数据类型（iterable data structure）我们没有介绍，像 tree、list、map 和 pair 等，以及所有你能说出来的。eventstream 和 observable 也都是 functor。

## chain 函数

`chain` 可以轻松地嵌套多个作用，因此我们就能以一种纯函数式的方式来表示 *序列*（sequence） 和 *变量赋值*（variable assignment）。

```js
// getJSON :: Url -> Params -> Task JSON
// querySelector :: Selector -> IO DOM


getJSON('/authenticate', {username: 'stale', password: 'crackers'})
  .chain(function(user) {
    return getJSON('/friends', {user_id: user.id});
});
// Task([{name: 'Seimith', id: 14}, {name: 'Ric', id: 39}]);


querySelector("input.username").chain(function(uname) {
  return querySelector("input.email").chain(function(email) {
    return IO.of(
      "Welcome " + uname.value + " " + "prepare for spam at " + email.value
    );
  });
});
// IO("Welcome Olivia prepare for spam at olivia@tremorcontrol.net");


Maybe.of(3).chain(function(three) {
  return Maybe.of(2).map(add(three));
});
// Maybe(5);


Maybe.of(null).chain(safeProp('address')).chain(safeProp('street'));
// Maybe(null);
```

```
querySelector("input.username").chain(function(uname) {
  return querySelector("input.email").map(function(email) {
      return "Welcome" + uname.value + " prepare for spam at " + email.value;
  });
});
```

> 返回的如果是"普通值"就用`map`，如果是`functor`就用`chain`。

### 等式推导（equational reasoning）
### 可靠特性(reliable properties)

```
// upload :: String -> (String -> a) -> Void
var upload = function(filename, callback) {
  if(!filename) {
    throw "You need a filename!";
  } else {
    readFile(filename, function(err, contents) {
        if(err) throw err;
        httpPost(contents, function(err, json) {
            if(err) throw err;
            callback(json);
        });
    });
  }
}
```

```
函数式编程
// readFile :: Filename -> Either String （Future Error String）
// httpPost :: String -> Futrue Error JSON

// upload :: String -> Either String (Futrue Error JSON)
var upload = compose(map(chain(httpPost('/uploads'))), readFile);
```

# 函数式编程理论

```
// 结合律
compose(join, map(join)) == compose(join, join)
```

这个定律表明了monad的嵌套本质，

 - join
 - map
 - compose
 - curry

```
// 同一律
compose(join, of) == compose(join, map(of)) == id
```

    对任意的monad `M` `of` 和`join`相当与`id`，也可以使用`map(of)`由内而外实现相同效果。
    这个定律叫“三角同一律”（triangle identity）。

```
var mcompose = function(f, g) {
  return compose(chain(f), chain(g));
}

// 左同一律
mcompose(M, f) == f

// 右同一律
mcompose(f, M) == f

// 结合律
mcompose(mcompose(f, g), h) == mcompose(f, mcompose(g, h))
```

monad 来自于一个叫 “Kleisli 范畴”的范畴，这个范畴里边所有的对象都是 monad，所有的态射都是联结函数（chained funtions）。

## 总结

monad 让我们深入到嵌套的运算当中，使我们能够在完全避免回调金字塔（pyramid of doom）情况下，为变量赋值，运行有序的作用，执行异步任务等等。当一个值被困在几层相同类型的容器中时，monad 能够拯救它。借助 “pointed” 这个可靠的帮手，monad 能够借给我们从盒子中取出的值，而且知道我们会在结束使用后还给它。
