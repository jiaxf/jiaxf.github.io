---
layout: post
title: R语言初步
categories: 技术
tags:
  - R
abbrlink: 54689
---

# R语言初步

常用R对象

 - 向量
 - 列表
 - 矩阵
 - 数组
 - 因子
 - 数据帧

向量对象有六种数据类型的原子向量，也称为六类向量。 其他R对象是建立在原子向量之上的。六类向量类型如下表所示

![](/img/R1.png)

## 向量

当要创建具有多个元素的向量时，应该使用`c()`函数，表示将元素组合成一个向量。

```
# Create a vector.
apple <- c('red','green',"yellow");
print(apple);

# Get the class of the vector.
print(class(apple));
```

R上面示例代码，执行结果如下
```
> apple <- c('red','green',"yellow");
> print(apple);
[1] "red"    "green"  "yellow"
> print(class(apple));
[1] "character"
>
```

## 列表
列表是一个R对象，它可以包含许多不同类型的元素，如向量，函数，甚至其中的另一个列表。
```
# Create a list.
list1 <- list(c(2,5,3),21.3,sin);

# Print the list.
print(list1);
```
R上面示例代码，执行结果如下
```
[[1]]
[1] 2 5 3

[[2]]
[1] 21.3

[[3]]
function (x)  .Primitive("sin")
```
