---
layout: post
title: React入门
categories: 技术
tags:
  - react
  - jsx
abbrlink: 57993
date: 2016-11-30 13:51:02
---

React入门
========

运行React需要的3个库： react.js、react-dom.js、Browser.js

> react.js时React的核心库

> react-dom.js是提供与DOM相关的功能

> Browser.js的作用时将JSX语法转换为JavaScript语法，这一步较耗时间，世界上线时可以放到服务器完成，

`$ babel src --out-dir build`
<!-- more -->
HTML模板
========
使用React的网页源码，模板如下：

```html

<DOCTYPE html>
<html>
  <head>
    <script src="./react.js"></script>
    <script src="./react-dom.js"></script>
    <script src="./browser.min.js"></script>
  </head>
  <body>
    <div id="example"></div>
    <script type="text/babel">
      // ** Our code goes here! **
    </script>
  </body>
</html>

```

ReactDOM.render()
=================
ReactDOM.render 是React的基本方法，用于将模板转为HTML语言，并插入指定的DOM节点。

```
ReactDOM.render(
  <h1>Hello, world!</h1>,
  document.getElementById('example')
);

```

JSX语法
=======

	JSX语法允许HTML与JavaScript混写，遇到HTML标签（以〈开头），用HTML规则解析；
	遇到代码块（以{开头）,用Javascript规则解析。

React组件
========

React允许将代码封装成组件(component)，然后像插入普通HTML标签一样，在网页中插入这个组件。
React.createClass方法用于生成一个组件类。

>组件的名字必须首字母大写

>组件类必须有自己的render方法，用于输出组件

>组件的用户与原生的HTML标签一样，可以加入属性，组件的属性可以在组件类的this.props对象上获取

>**注：添加组件的属性，class属性需要写成className，for属性需要写成htmlFor，因为class和for是JavaScript的保留字**

_eg:_

```
var HelloMessage = React.createClass({
  render: function() {
    return <h1>Hello {this.props.name}</h1>;
  }
});

ReactDOM.render(
  <HelloMessage name="John" />,
  document.getElementById('example')
);

```

this.props.children
===================

this.props对象的属性与组件的属性一一对应，**this.props.children属性表示组件的所有子节点**

this.props.children的值有三种可能：

 - 如果当前组件没有子节点，就是undefined;
 - 如果有一个子节点，数据类型是object;
 - 如果有多个子节点，数据类型就是array;


 > __React提供一个工具方法React.Children来处理this.props.children，可以利用React.Children.map来遍历子节点。__

虚拟 DOM （virtual DOM）
======================

组件并不是真实的 DOM 节点，而是存在于内存之中的一种数据结构，叫做虚拟 DOM （virtual DOM）。只有当它插入文档以后，才会变成真实的 DOM 。根据 React 的设计，所有的 DOM 变动，都先在虚拟 DOM 上发生，然后再将实际发生变动的部分，反映在真实 DOM上，这种算法叫做 DOM diff ，它可以极大提高网页的性能表现。

从组件获取真实 DOM 的节点，这时就要用到 ref 属性。

*eg：*

```
var MyComponent = React.createClass({
	handleClick: function() {
		this.refs.myTextInput.focus();
	},
	render: function() {
		return (
		  <div>
		    <input type="text" ref="myTextInput" />
		    <input type="button" value="Focus the text input" onClick={this.handleClick} />
		  </div>
		);
	}
});

ReactDOM.render(
  <MyComponent />,
  document.getElementById('example')
);
```

> **由于 this.refs.[refName] 属性获取的是真实 DOM ，所以必须等到虚拟 DOM 插入文档以后，才能使用这个属性，否则会报错。**

组件中的属性类型验证
=================

组件类的PropTypes属性，可以用来验证组件实例的属性是否符合要求。

*eg:*

```
var MyTitle = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
  },

  render: function() {
     return <h1> {this.props.title} </h1>;
   }
});

var data = 123;
ReactDOM.render(
	<MyTitle title={data} />,
	document.body
);

// title属性不能通过验证，控制台会显示错误
// Warning: Failed propType: Invalid prop `title` of type `number` supplied to `MyTitle`, expected `string`.
```

组件的状态
=========
组件可以看成是一个状态机，一开始有一个初始状态，然后用户互动，导致状态变化，从而触发重新渲染 UI。

*eg:*
```
var LikeButton = React.createClass({
  getInitialState: function() {
    return {liked: false};
  },
  handleClick: function(event) {
    this.setState({liked: !this.state.liked});
  },
  render: function() {
    var text = this.state.liked ? 'like' : 'haven\'t liked';
    return (
      <p onClick={this.handleClick}>
        You {text} this. Click to toggle.
      </p>
    );
  }
});

ReactDOM.render(
  <LikeButton />,
  document.getElementById('example')
);
```

 组件的 getInitialState 方法用于定义初始状态，也就是一个对象，这个对象可以通过 this.state 属性读取。当用户点击组件，导致状态变化，this.setState 方法就修改状态值，每次修改以后，自动调用 this.render 方法，再次渲染组件。

 > 由于 this.props 和 this.state 都用于描述组件的特性，可能会产生混淆。一个简单的区分方法是，this.props 表示那些一旦定义，就不再改变的特性，而 this.state 是会随着用户互动而产生变化的特性。


React组件的生命周期
========

组件的生命周期分为三个状态：

 - Mounting：已插入真实DOM
 - Updating：正在被重新渲染
 - Unmounting：已移出真实DOM

React为每个状态都提供了俩种处理函数，will函数在进入状态之前调用，did函数在进入状态之后调用，三种状态共计五种处理函数。

 * componentWillMount()
 * componentDidMount()
 * componentWillUpdate(object nextProps, object nextState)
 * componentDidUpdate(object prevProps, object prevState)
 * componentWillUnmount()

React还提供俩种特殊状态的处理函数

 - componentWillReceiveProps(object nextProps): 已加载组件收到新的参数时调用
 - shouldComponentUpdate（object nextProps, object nextState): 组件判断是否重新渲染时调用
