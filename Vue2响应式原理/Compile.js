// 具体指令解析操作
const compileUtil = {
    // node当前节点，expr指令值，vm实例
    text: function (node, expr, vm) { // v-text 解析
        // 插值表达式单独处理
        if (expr.indexOf('{{') !== -1 && expr.indexOf('}}') !== -1) {
            //  获取插值表达式对应的值{{person.name}}---{{person.age}}
            const value = expr.replace(/\{\{(.+?)\}\}/g, (...arg) => {
                new Watcher(vm, arg[1], () => {
                    // 插值表达式可能是复杂的，比如同时有多个，不能只处理一个就替换，所以需要单独处理
                    return updater.textUpdater(node, this.getInterpolation(expr, vm));
                })
                return (this.getVal(arg[1], vm));
            })
            // 渲染页面
            return updater.textUpdater(node, value);
        }
        // 绑定watcher，订阅数据变化
        this.bindWatch(node, expr, vm, 'text');
    },
    getInterpolation(expr, vm) {
        // 插值表达式添加watcher做单独处理
        return expr.replace(/\{\{(.+?)\}\}/g, (...arg) => {
            return (this.getVal(arg[1], vm));
        })
    },
    html: function (node, expr, vm) { // v-html 解析
        this.bindWatch(node, expr, vm, 'html');
    },
    model: function (node, expr, vm) { // v-model 解析
        this.bindWatch(node, expr, vm, 'model');
        // 视图 → 数据 → 视图
        node.addEventListener('input', (e) => {
            this.setVal(expr, vm, e.target.value)
        }, false);
    },
    bind: function (node, expr, vm, attrName) { // v-bind 和 : 解析
        // expr：指令值，  attrName：绑定的属性名
        this.bindWatch(node, expr, vm, 'bind', attrName);
    },
    on: function (node, expr, vm, eventName) { // v-on 和 @ 解析
        // expr：方法名，  eventName：事件
        // 获取事件方法
        const fun = vm.$options.methods && vm.$options.methods[expr];
        // 小细节：vue的methods中的方法this默认指向vm实例，而这里fun将被node调用，所以this是指向node节点的。
        node.addEventListener(eventName, fun.bind(vm), false)
    },
    bindWatch: function (node, expr, vm, directive, attrName) {
        // node:节点， expr：指令值（data）， vm：实例， directive：指令种类， attrName：绑定属性值（v-bind和: 才有）
        // 指令触发的时候需要为其添加watcher的回调订阅
        const updaterFn = updater[directive + 'Updater'],
            value = this.getVal(expr, vm); // 获取对应的渲染函数，获取指令绑定数据
        // 触发渲染
        updaterFn && updaterFn(node, value, attrName);
        new Watcher(vm, expr, (newVal) => {
            updaterFn && updaterFn(node, newVal, attrName); // 数据更新，watcher回调，更新视图
        })
    },
    getVal: function (expr, vm) {
        // expr形式可能是msg也可能是person.name，所以需要遍历获取expr对应的vm实例data中的值
        return expr.split('.').reduce((data, current) => {
            return data[current];
        }, vm.$data)
    },
    setVal: function (expr, vm, inputVal) {
        let base = vm.$data; // 所有数据取值都是从这里开始的
        expr = expr.split('.'); // 为了遍历方便将其分割成数组
        expr.forEach((value, index) => {
            // 形如：person.son.name这种嵌套对象，只有当到达最后一层时，才将新值赋值。
            if (index < expr.length - 1) {
                base = base[value]
            } else {
                base[value] = inputVal; // 更新新值
            }
        })
    }
}
// 指令解析后更新页面
const updater = {
    // node当前节点，value当前值
    textUpdater: function (node, value) { // v-text 渲染
        // 当value不存在时  应该显示 '' 而不是undefined
        node.textContent = typeof value == 'undefined' ? '' : value;
    },
    htmlUpdater: function (node, value) { // v-html 渲染
        node.innerHTML = typeof value == 'undefined' ? '' : value;
    },
    modelUpdater: function (node, value) { // v-model 渲染
        node.value = typeof value == 'undefined' ? '' : value;
    },
    bindUpdater: function (node, value, attrName) { // v-bind 渲染
        node.setAttribute(attrName, value);
    }
}
// 指令解析器
class Compile {
    // 接收根节点对象el，和vm实例
    constructor(el, vm) {
        // 得到元素节点
        this.el = this.isElementNode(el) ? el : document.querySelector(el);
        // vm实例
        this.vm = vm;
        // 1.为了避免频繁操作dom，造成回流重绘等浪费性能问题，这里使用文档碎片存储dom
        const fragment = this.nodeFragment(this.el);
        // 2.对fragment进行模板编译，处理指令、插值表达式、事件等，有fragment就减少了dom操作
        this.compileInit(fragment);
        // 3.将文档碎片插入到dom中
        this.el.appendChild(fragment);
    }
    // 对fragment进行模板编译
    compileInit(fragment) {
        // 获取文档碎片下的所有子节点
        const childNodes = fragment.childNodes;
        [...childNodes].forEach(child => {
            if (this.isElementNode(child)) {
                // 是元素节点
                this.compileElement(child);
            } else if (this.isTextNode(child)) {
                // 是文本节点
                this.compileText(child);
            }
            if (child.childNodes && child.childNodes.length) {
                // 元素嵌套的递归
                this.compileInit(child)
            }
        })
    }
    // 编译元素节点
    compileElement(node) {
        const nodeAttr = node.attributes;
        [...nodeAttr].forEach(attr => {
            // 解构属性值和名
            const {
                name,
                value
            } = attr;
            if (this.isDirective(name)) {
                // 是否是指令    
                // directive 值为 text， html, model, on:click, bind:XXX 仅做这几种
                const [, directive] = name.split('-');
                const [dirName, eventName] = directive.split(':'); // ['text','']['html','']['model','']['on','click']……
                // 对应指令的解析事件，传递（当前节点，指令值，vm实例，事件）
                compileUtil[dirName](node, value, this.vm, eventName)
                // 删除标签上的 v-html v-text 之类的属性
                node.removeAttribute('v-' + directive);
            } else if (this.isAtSymbol(name)) { // 是否是@开头的指令
                const [, eventName] = name.split('@');
                // 执行v-on 解析
                compileUtil['on'](node, value, this.vm, eventName)
                // 删除标签上的 @开头的  属性
                node.removeAttribute('@' + eventName);
            } else if (this.isColonSymbol(name)) {
                const [, attrName] = name.split(':');
                // 执行v-bind 解析
                compileUtil['bind'](node, value, this.vm, attrName)
                // 删除标签上的 :开头的 属性
                node.removeAttribute(':' + attrName);
            }
        })
    }
    // 编译文本节点
    compileText(node) {
        // 匹配所有 带有“{{}}”进行解析
        const content = node.textContent;
        if (/\{\{(.+?)\}\}/.test(content)) {
            // 调用解析
            compileUtil['text'](node, content, this.vm)
        }
    }
    // 判断是否是以“v-”开头的属性
    isDirective = (directive) => directive.startsWith('v-');
    // 判断是否以“@”开头
    isAtSymbol = (directive) => directive.startsWith('@');
    // 判断是否以“:”开
    isColonSymbol = (directive) => directive.startsWith(':');
    // 将dom文档碎片化
    nodeFragment(el) {
        // 创建文档碎片
        const f = document.createDocumentFragment();
        let firstChild;
        while (firstChild = el.firstChild) {
            // 每次使用appendChild()方法后el节点的firstChild会被移除
            // 这不是死循环！！！
            f.appendChild(firstChild);
        }
        return f;
    }
    // 判断是不是元素节点
    isElementNode = (node) => node.nodeType === 1;
    // 判断是不是文本节点
    isTextNode = (node) => node.nodeType === 3;
}