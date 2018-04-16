---
title: JavaScriptEvent
author: 飞天雪
tags:
  - javascript
  - event
categories:
  - 技术
abbrlink: 39862
date: 2016-12-01 10:35:00
---
### JavaScript事件

## 1. 相关术语

  - 事件类型（event type）是一个用来说明发生什么类型事件的字符串。
      例如，“mousemove”表示用户移动鼠标，“keydown”表示键盘上某个键被按下等等。
  - 事件目标（event target）是发生的事件与之相关的对象。当讲事件时，我必须同时指明类型和目标。
  	比如：window上的load事件或button元素的click事件。
  	在客户端JavaScript应用程序中，Window、Document和Element对象是最常见的事件目标。
  - 事件处理程序（event handler）或事件监听程序（event listener）是处理或响应事件的函数。
  - 事件对象（event object）是与特定事件相关且包含有关该事件详细信息的对象。
      事件对象作为参数传递给事件处理程序函数（不包括IE8及之前版本，在这些浏览器中有时仅能通过全局变量event才能得到）。
      所有的事件对象都用来指定事件类型的type属性和指定事件目标的target属性。（在IE8及之前的版本中用srcElement而非target）
  - 事件传播（event propagation）是浏览器决定哪个对象触发其事件处理程序的过程。当文档元素上发生某个类型的事件时，它们会在文档树上向上传播或“冒泡“（bubble）。
  - 事件捕获（event capturing）：在容器元素上注册的特定处理程序有机会在事件传播到真实目标之前捕获它。
***
<!-- more -->
## 2.Event事件

2.1 注册事件处理程序

 	给事件目标对象或文档元素设置属性，onclick、onchange等

2.2 通过addEventListener()

```
target.addEventListener(type, listener[, useCapture]);
```

  - type：事件名称（事件类型），字符串，大小写不敏感。
  - listener：监听函数。事件发生时，会调用该监听函数。
  - useCapture：布尔值，表示监听函数是否在捕获阶段（capture）触发，默认为false（监听函数只在冒泡阶段被触发）。老式浏览器规定该参数必写，较新版本的浏览器允许该参数可选。为了保持兼容，建议总是写上该参数。

*使用addEventListener(）方法时，事件类型不应包括前缀“on”. 去除 removeEventListener（）*

```
addEventListener('click', listener, false);
```

2.3 事件处理程序的返回值

  设置对象属性或HTML属性注册事件处理程序的返回值false告诉浏览器不要执行事件相关的默认操作。比如，表单提交按钮的onclick事件处理程序能返回false阻止浏览器提交表单。

```
v.onclick = function(){
  return false;
}
```

2.4 事件调用顺序

  - 通过设置对象属性或HTML属性注册的处理程序一直优先调用
  - 使用addEventListener() 注册的处理程序按照注册顺序调用
  - 使用attachEvent() 注册的处理程序可能按照任何顺序调用，代码不应该依赖于调用顺序。

2.5 事件传播

  在调用在目标元素上注册的事件处理函数，大部分事件会"冒泡"到DOM树根。发生再文档元素上的大部分事件都会冒泡，有些例外，比如
  focus、blur和scroll事件。文档元素上的load事件会冒泡，但会在Document对象上停止冒泡而不会传播到Window对象。只有整个文档
  都加载完毕时才会触发window对象的load事件。

  三个阶段：
  - 捕获阶段（capture phrase）： 从window对象传导到目标对象。（window ---->document ---> ... ---> 目标对象）
  - 目标阶段（target phrase）： 目标对象本身的事件处理程序调用
  - 冒泡阶段（bubblling phrase）：从目标对象传导会window对象 （目标对象---> 父元素---> ... ---> document -->window）

2.6 事件代理（事件委托）

  基于事件会在冒泡阶段向上传播到父节点，可以将子节点的监听事件定义在父节点上，由父节点的监听函数统一处理多个子元素的事件。这种方叫事件的代理（delegation）。

  *使用事件代理，以后插入的新节点仍然可可以监听到事件*

2.7 事件取消

  用属性注册的事件处理程序返回值能用于取消事件的浏览器默认操作。在支持addEventListener()的浏览器中，能通过调用事件对象的
  preventDefault（）方法取消事件的默认操作。
  在IE9之前的IE中，可以通过设置事件对象的returnValue属性为false来取消。

  ```
  function cancelHandler(event){
    var event = event || window.event;
    if(event.preventDefault){ // 标准
      event.preventDefault;
    }
    if(event.returnValue){ // IE
      event.returnValue = false;
    }
    return false; //用于处理使用对象属性注册的处理程序
  }
  ```

  取消事件传播
  在支持addEventListener()的浏览器中，可以调用事件对象的一个stopPropagation()方法以阻止事件的传播。
  Event对象上还有个方法stopImmediatePropagation() 阻止同一个事件的其他监听函数被调用。

  ```
  e.stopPropagation();
  // IE
  e.cancelBubble = true;
  ```
## 3. 文档事件

 (1) beforeunload事件、unload事件、load事件、error事件、pageshow事件、pagehide事件

 (2) DOMContentLoader事件、readystatechange事件

  DOMContentLoader事件再文档加载解析完毕，图片和异步（async）脚本依旧在加载，单文档已准备就绪。发生再load事件之前。

  readstatechange事件：document.readystatechange属性会随文档加载过程而变，每次状态改变，Document对象上的readystatechange事件都会触发。

```
  document.onreadystate = function(){
    if(doucment.readyState == 'complete'){

    }
  }
```
  (3) scroll事件、resize事件

  (4) hashchange事件、popstate事件

  (5) cut事件、copy事件、 paste事件  文本操作事件

    - cut事件：将选中的内容从文档中移除，加入剪贴板后触发
    - copy事件： 在选中的内容加入剪贴板后触发
    - paste事件： 在剪贴板内容被粘贴到文档后触发

    三个事件都有一个clipboardData只读属性，该属性存放剪贴的数据，是一个DataTransfer对象。

  （6）焦点事件 发生在Element节点和document对象上。
      focus事件、blur事件、focusin事件、focusout事件

## 4. 鼠标事件

  （1） click事件 在Element节点、document节点、window对象上，单击鼠标时触发。
  （2）contextmenu 在一个节点上点击鼠标右键时触发，或者按下“上下文菜单”键时触发。
   (3) dblclick
   (4) mousedown、mouseup、mousemove、mouseover、mouseenter、mouseout、mouseleave
    除了mouseenter和mouseleave外的所有鼠标事件都能冒泡。

## 5. 鼠标滚轮事件

  浏览器支持mousewheel事件，但Firefox使用"DOMMouseScroll"事件。

```
window.onmousewheel = document.onmousewheel = scrollWheel;

function scrollWheel(e){
  e = e || window.event;
  if(e.wheelDelta){ // 判断浏览器IE，谷歌滑轮事件
    if(e.wheelDelta > 0){
      // 滑轮向上滚动时
    }else if(e.wheelDelta < 0){
      // 当滑轮向下滚动时
    }；
  }else if(e.dedail){ // Firefox滑轮事件
    if(e.detail < 0){
      // 当滑轮向上滚动时
    }else if(e.detail > 0){
      // 当滑轮向下滚动时
    }
  }
}
```

##　6. 键盘事件

  keydown、keypress、keyup

## 7. 表单事件

  （1）input、propertychange （用在&lt;input&gt;、&lt;textarea&gt;， 当contenteditable属性设置为true时值变化触发）
  （2）change （&lt;input&gt;、&lt;select&gt;、&lt;textarea&gt;值变化时触发）

    - 激活单选框（radio）或复选框（checkbox）时触发。
    - 用户提交时触发。比如，从下列列表（select）完成选择，在日期或文件输入框完成选择。
    - 当文本框或textarea元素的值发生改变，并且丧失焦点时触发。

  （3）select （当&lt;input&gt;和&lt;textarea&gt; 中选中文本时触发select事件）

  （4）reset、submit（表单对象事件）

    - reset事件：当表单重置（所有表单成员的值变回默认值）时触发。  
    - submit事件：当表单数据向服务器提交时触发。

## 8. 触控事件

  触控事件提供了响应用户对触摸屏或触摸板上的操作能力。

  接口：

  - TouchEvent：代表当触摸行为在平面上发生变化时发生的事件（touchstart、touchend、touchmove、touchcancel、touchenter、touchleave）
  - Touch：代表用户与触摸屏幕间的一个接触点
  - TouchList：代表一系列的Touch；一般在用户多个手指同时解除屏幕时使用
    其他： gesturestart、gestureendscale、rotation

## 9. 进度事件

  进度事件用例描述一个事件进展的过程。

  - abort事件：当进度事件被中止时触发。如果发生错误，导致进程中止，不会触发该事件。   
  - error事件：由于错误导致资源无法加载时触发。   
  - load事件：进度成功结束时触发。   
  - loadstart事件：进度开始时触发。   
  - loadend事件：进度停止时触发，发生顺序排在error事件\abort事件\load事件后面。   
  - progress事件：当操作处于进度之中，由传输的数据块不断触发。   
  - timeout事件：进度超过限时触发。

## 10. 拖放事件

  拖放（Drag-and-Drop，DnD）是在“拖放源drag source”和"拖放目标drop target"之间传输数据的用户界面。

 （1）事件

  - dragstart：当一个元素开始被拖拽的时候触发。用户拖拽的元素需要附加dragstart事件。在这个事件中，监听器将设置与这次拖拽相关的信息，例如拖动的数据和图像。
  - dragenter：当拖拽中的鼠标第一次进入一个元素的时候触发。这个事件的监听器需要指明是否允许在这个区域释放鼠标。如果没有设置监听器，或者监听器没有进行操作，则默认不允许释放。当你想要通过类似高亮或插入标记等方式来告知用户此处可以释放，你将需要监听这个事件。
  - dragover：当拖拽中的鼠标移动经过一个元素的时候触发。大多数时候，监听过程发生的操作与dragenter事件是一样的。
  - dragleave：当拖拽中的鼠标离开元素时触发。监听器需要将作为可释放反馈的高亮或插入标记去除。
  - drag：这个事件在拖拽源触发。即在拖拽操作中触发dragstart事件的元素。
  - drop：这个事件在拖拽操作结束释放时于释放元素上触发。一个监听器用来响应接收被拖拽的数据并插入到释放之地。这个事件只有在需要时才触发。当用户取消了拖拽操作时将不触发，例如按下了Escape（ESC）按键，或鼠标在非可释放目标上释放了按键。
  - dragend：拖拽源在拖拽操作结束将得到dragend事件对象，不管操作成功与否。


  （2）DataTransfer对象

    dataTransfer属性用例保存需要传递的数据，返回一个DataTransfer对象。

    setData() 用来设置事件所带有的指定类型的数据。两个参数：一个是数据类型，第二个时具体数据。

## 11. 自定义事件

```
// 新建事件实例
var event = new Event('play');
// 添加监听函数
element.addEventListener('play', function(e){}, false);
// 触发事件
element.dispatchEvent(event);
```

  可以使用CustomEvent构造函数生成自定义的事件对象。

```
  var event = new CustomEvent('play', {detail: 'play'});
  // 添加监听函数
  element.addEventListener('play', handler, false);
  // 触发事件
  element.dispatchEvent(event);

  function handler(e){
    var data = e.detail;
  }

  // IE 不支持上面写法

  // 新建Event实例
  var event = document.createEvent('Event');
  // 事件初始化
  event.initEvent('play', true, true);
  // 加上监听函数
  document.addEventListener('play', handler, fasle);
  // 触发事件
  document.dispatchEvent(event);
```
 - type：事件名称，格式为字符串。  
 - bubbles：事件是否应该冒泡，格式为布尔值。可以使用event.bubbles属性读取它的值。  
 - cancelable：事件是否能被取消，格式为布尔值。可以使用event.cancelable属性读取它的值。  
 - option：为事件对象指定额外的属性。
