---
layout: post
title: Web Worker study
categories: 技术
tags:
  - javascript
  - web
abbrlink: 39219
---

# Web Workers

javaScript属于单线程环境，无法同时运行多个脚本。HTML5提供了WebWorker，为JavaScript引入线程技术。

## Web Worker简介

WebWorker规范定义了在网络应用中生成背景脚本的API。可以通过Web Worker执行线程。例如触发长时间运行的脚本
以处理计算密集型任务，同时却不会阻碍UI或其他脚本处理用户互动。

Woker利用类似线程的消息传递实现并行。

## Web Worker的类型

  + 专用Woker
  + 共有Woker

### 使用入门

Web Worker在独立线程中运行，因此，它们执行的代码需要保存在一个单独的文件中。

1. 创建新的Worker对象

```
var worker = new Woker('task.js');
```

2. 创建Worker后通过调用postMessage() 方法启动

```
worker.postMessage(); // start the worker
```
<!-- more -->
### 通过消息传递与Worker通信

Worker与其父网页之间的通信是通过事件模型和postMessage()方法实现。

postMessage()可以接受字符串或JSON对象作为单个参数，新式浏览器的最新版支持传递JSON对象。

```
var worker = new Worker('doWork.js');
worker.addEventListener('message', function(e){
  console.log('Worker said: ', e.data);
}, false);

worker.postMessage('Hello World'); // send data to our worker
```

doWork.js(Worker):

```
self.addEventListener('message', function(e){
  self.postMessage(e.data);
}, false);
```

在主网页中调用postMessage()时，Worker通过定义message事件的onmessage处理程序来实现处理消息。可以在
Event.data中访问消息（“Hello World”），postMessage()也是将数据传回主线程的一种方法。

在主网页和Worker之间传递的消息是复制而不是共享的。系统将对象传递给worker后，会将其序列化，随后在另一端取消
序列化。由于网页和Worker并不共享同一实例，因此每次传递时都要进行复制。大部分浏览器通过在任一端上对值进行自动JSON
编码/解码来实施此功能。

一个使用JSON对象传递消息的更复杂的示例。

主脚本：
```
<button onclick="sayHI()">Say HI</button>
<button onclick="unknownCmd()">Send unknown command</button>
<button onclick="stop()">Stop worker</button>
<output id="result"></output>

<script>
  function sayHI() {
    worker.postMessage({'cmd': 'start', 'msg': 'Hi'});
  }

  function stop() {
    // Calling worker.terminate() from this script would also stop the worker.
    worker.postMessage({'cmd': 'stop', 'msg': 'Bye'});
  }

  function unknownCmd() {
    worker.postMessage({'cmd': 'foobard', 'msg': '???'});
  }

  var worker = new Worker('doWork2.js');

  worker.addEventListener('message', function(e) {
    document.getElementById('result').textContent = e.data;
  }, false);
</script>
```

doWork2.js：

```
self.addEventListener('message', function(e) {
  var data = e.data;
  switch(data.cmd){
    case 'start':
      self.postMessage('Worker started: ' + data.msg);
      break;
    case 'stop':
      self.postMessage('Worker stopped: ' + data.msg + ' .(buttons will no longer work)');
      self.close(); // Terminates the worker.
      break;
    default:
      self.postMessage('Unknown command: ' + data.msg);
  };
}, false);
```

*停止Worker的方法有两种：在主网页中调用worker terminate()或在Worker本身内部调用self.close().*

## Worker环境

### Worker作用域

就Worker来说，self和this指的都是Worker的全局作用域。

```
addEventListener('message', function(e){
  var data = e.data;
  switch(data.cmd) {
    case 'start':
      postMessage('Worker started:' + data.msg);  // 直接方法
      break;
  }
}, false);
```

### 适用于Worker的功能

由于Web Worker的多线程行为，所以它们只能使用JavaScript功能的子集：

  - navigator对象
  - location对象（只读）
  - XMLHttpRequest
  - setTimeout()/clearTimeout()和setInterval()/clearInterval()
  - 应用缓存
  - 使用importScript()方法导入外部脚本
  - 生成其他Web Worker

Worker无法使用：

  - DOM(非线程安全)
  - window对象
  - document对象
  - parent对象

### 加载外部脚本

可以通过importScripts()函数将外部脚本文件或库加载到worker中。

```
importScripts('script1.js');
importScripts('script2.js');
```

也可以写成单个导入语句：
```
importScripts('script1.js', 'script2.js');
```

## 子Worker

Worker可以生成子Worker。子Worker注意事项：

  - 子Worker必须托管在与父网页相同的来源中
  - 子Woker中的URI应相对于父Worker的位置进行解析。

主网页和Worker之间传递的消息是复制而不是共享。

## 内嵌Worker

```
// Prefixed in Webkit， chrome12，and FF6： window.WebKitBlobBuilder, window.MozBlobBuilder
var bb = new BlobBuilder();
bb.append("onmessage = function(e) { postMessage('msg from worker')}");

// Obtain a blob URL reference to our worker 'file'.
// Note: window.webkitURL.createObjectURL() in Chrome 10 +.
var blobURL = window.URL.createObjectURL(bb.getBlob());

var worker = new Worker(blobURL);
worker.onmessage = function(e) {
  // e.data == 'msg from worker'
};
worker.postMessage(); // start the worker.
```

## Blob网址
对window.URL.createObjectURL()的调用十分奇妙，此方法创建一个简单的网址字符串，该字符串可用于DOM File 或 Blob对象中存储的参考数据。例如：
```
blob:http://localhost/c745ef73-ece9-46da-8f66-ebes574789b1
```

Blob网址是唯一的，且只要应用存在，该网址就会一直有效。可以通过将Blob网址传递给window.URL.revokeObjectURL()来明确发布该网址：

```
window.URL.revokeObjectURL(blobURL); // window.webkitURL.createObjectURL() in Chrome 10+.
```

在Chrome浏览器中，用`chrome://blob-internals/`可以查看创建的所有Blob网址。

```
<!DOCTYEP html>
<html>
<head>
  <meta charset="utf-8" />
</head>
<body>
  <div id="log"></div>
  <script id="worker1" type="javascript/worker">
  // This script won't be parsed by JS engines because its type is javascript/worker.
    self.onmessage = function(e) {
      self.postMessage('msg from worker');
    };
    // Rest of your worker code goes here.
  </script>
  <script>
    function log(msg) {
      var fragment = document.createDocumentFragment();
      fragment.appendChild(document.createTextNode(msg));
      fragment.appendChild(document.createElement('br'));

      document.querySelector('#log').appendChild(fragment);
    }

    var bb = new BlobBuilder();
    bb.append(document.querySelector('#worker1').textContent);

    var worker = new Worker(window.URL.createObjectURL(bb.getBlob()));
    worker.onmessage = function(e) {
      log("Received:" + e.data);
    }
    worker.postMessage(); // Start the worker
  </script>
</body>
</html>

```

## 加载外部脚本

在内嵌Worker中利用importScripts()的一种方法是通过将相关网址传递给内嵌Worker并手动构建绝对网址来"导入"运行您主脚本的当前网址。这可以确保外部脚本是从同一来源导入的。

```
<script id="worker2" type="javascript/worker">
self.onmessage = function(e){
  var data = e.data;

  if(data.url){
    var url = data.url.href;
    var index = url.indexOf('index.html');
    if(index != -1){
      url = url.substring(0, index);
    }
    importScipts(url + 'engine.js');
  }
}
</script>
<script>
  var worker = new Worker(window.URL.createObjectURL(bb.getBlob()));
  worker.postMessage({url: document.loacation});
</script>
```

## 处理错误

处理Web Worker中出现的错误，如果在执行Worker时出现错误，就会触发ErrorEvent.

  - filename 导致错误的Worker脚本的名称
  - lineno 出现错误的行号
  - message 有关错误的实用说明

```
<output id="error" style="color: red;"></output>
<output id="result"></output>

<script>
  function onError(e) {
    document.getElementById('error').textContent = [
      'ERROR: Line ', e.lineno, ' in ', e.filename, ': ', e.message].join('');
  }

  function onMsg(e) {
    document.getElementById('result').textContent = e.data;
  }

  var worker = new Worker('workerWithError.js');
  worker.addEventListener('message', onMsg, false);
  worker.addEventListener('error', onError, false);
  worker.postMessage(); // Start worker without a message.
</script>
```

##  安全说明

### 本地访问限制

由于google Chrome浏览器的安全限制，Worker无法在本地运行（如通过file://),且会在不显示任何提示的情况下失败。
要通过file:// 方案运行，需使用--allow-file-access-files标记设置来运行Chrome浏览器。

### 同源注意事项

Worker 脚本必须是将相同方案作为调用网页的外部文件。因此，您无法通过 data: 网址或 javascript: 网址加载脚本，且 https: 网页无法启动以 http: 网址开头的 Worker 脚本。

### 用例

  - 预先抓取和/或缓存数据以便稍后使用
  - 突出显示代码语法或其他实时文本格式
  - 拼写检查程序
  - 分析视频或音频数据
  - 背景 I/O 或网络服务轮询
  - 处理较大数组或超大 JSON 响应
  - &lt;canvas &gt;中的图片过滤
  - 更新本地网络数据库中的多行内容
