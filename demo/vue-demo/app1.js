var journal = new Vue({
  el: '#journal',
  data: {
    message: 'Your first entry'
  }
});

var app2 = new Vue({
  el: '#app-2',
  data: {
    message: 'You loaded this page on ' + new Date()
  }
});

var app3 = new Vue({
  el: '#app-3',
  data: {
    seen: true
  }
});

var app4 = new Vue({
    el: '#app-4',
    data: {
        todos: [
            { text: 'Learn JavaScript' },
            { text: 'Learn Vue' },
            { text: 'Build something awesome' }
        ]
    }
});

var app5 = new Vue({
  el: '#app-5',
  data: {
    message: 'Hello Vue.js!'
  },
  methods: {
    reverseMessage: function () {
      this.message = this.message.split('').reverse().join('')
    }
  }
});

// 定义一个组件 todo-item
Vue.component('todo-item', {
    props: ['todo'],
    template: '<li>{{ todo.text }}</li>'
});

var app7 = new Vue({
    el: '#app-7',
    data: {
        groceryList: [
            { text: 'Vegetables' },
            { text: 'Cheese' },
            { text: 'Whatever else humans are supposed to eat' }
        ]
    }
});

Vue.component('my-component', {
    // 模板
    template: '<div>{{msg}} {{privateMsg}}</div>',
    // 接受参数
    props: {
        msg: String

    },
    // 私有数据，需要在函数中返回以避免多个实例共享一个对象
    data: function () {
        return {
            privateMsg: 'component!'
        }
    }
})